#!/usr/bin/env python3
"""
whpvideo: Convert a Zoom screen-share recording into a polished tutorial video.

Usage:
    python process.py input/recording.mp4
    python process.py input/recording.mp4 --output output/tutorial.mp4
    python process.py input/recording.mp4 --whisper-model small
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path


# ── ffmpeg helpers ─────────────────────────────────────────────────────────────

def get_video_duration(video_path: str) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", video_path],
        capture_output=True, text=True, check=True,
    )
    return float(json.loads(result.stdout)["format"]["duration"])


def detect_silences(
    video_path: str, threshold_db: float, min_duration: float
) -> list[tuple[float, float]]:
    result = subprocess.run(
        [
            "ffmpeg", "-i", video_path,
            "-af", f"silencedetect=noise={threshold_db}dB:d={min_duration}",
            "-f", "null", "-",
        ],
        capture_output=True, text=True,
    )
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", result.stderr)]
    ends   = [float(x) for x in re.findall(r"silence_end: ([\d.]+)",   result.stderr)]
    return list(zip(starts, ends))


def keep_segments(
    silences: list[tuple[float, float]], duration: float, padding: float = 0.25
) -> list[tuple[float, float]]:
    """Invert silence intervals into the segments we want to keep."""
    segments: list[tuple[float, float]] = []
    cursor = 0.0
    for s_start, s_end in silences:
        end = max(cursor, s_start - padding)
        if end - cursor > 0.1:
            segments.append((cursor, end))
        cursor = s_end + padding
    if duration - cursor > 0.1:
        segments.append((cursor, duration))
    return segments


def trim_silences(
    input_path: str, output_path: str, segments: list[tuple[float, float]]
) -> None:
    """Cut silence gaps and concatenate remaining segments with ffmpeg."""
    parts, v_labels, a_labels = [], [], []
    for i, (s, e) in enumerate(segments):
        parts += [
            f"[0:v]trim=start={s:.3f}:end={e:.3f},setpts=PTS-STARTPTS[v{i}]",
            f"[0:a]atrim=start={s:.3f}:end={e:.3f},asetpts=PTS-STARTPTS[a{i}]",
        ]
        v_labels.append(f"[v{i}]")
        a_labels.append(f"[a{i}]")

    n = len(segments)
    parts.append(
        "".join(v_labels) + "".join(a_labels) + f"concat=n={n}:v=1:a=1[outv][outa]"
    )

    subprocess.run(
        [
            "ffmpeg", "-y", "-i", input_path,
            "-filter_complex", ";".join(parts),
            "-map", "[outv]", "-map", "[outa]",
            "-c:v", "libx264", "-preset", "fast", "-crf", "22",
            "-c:a", "aac", "-b:a", "128k",
            output_path,
        ],
        check=True,
    )


def burn_subtitles(input_path: str, srt_path: str, output_path: str) -> None:
    # Escape path for ffmpeg's subtitles filter (colons must be escaped)
    escaped = srt_path.replace("\\", "/").replace(":", "\\:")
    style = (
        "FontSize=18,PrimaryColour=&HFFFFFF,"
        "OutlineColour=&H000000,Outline=2,Shadow=1,Alignment=2"
    )
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", input_path,
            "-vf", f"subtitles={escaped}:force_style='{style}'",
            "-c:v", "libx264", "-preset", "fast", "-crf", "22",
            "-c:a", "copy",
            output_path,
        ],
        check=True,
    )


def embed_chapters(input_path: str, meta_path: str, output_path: str) -> None:
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", input_path, "-i", meta_path,
            "-map_metadata", "1", "-map", "0", "-c", "copy",
            output_path,
        ],
        check=True,
    )


# ── Whisper helpers ────────────────────────────────────────────────────────────

def transcribe(video_path: str, model_name: str) -> dict:
    import whisper  # type: ignore
    model = whisper.load_model(model_name)
    return model.transcribe(video_path, word_timestamps=True, verbose=False)


def fmt_timestamp(t: float) -> str:
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"


def make_srt(result: dict, path: str) -> None:
    lines = []
    for i, seg in enumerate(result["segments"], 1):
        lines += [
            str(i),
            f"{fmt_timestamp(seg['start'])} --> {fmt_timestamp(seg['end'])}",
            seg["text"].strip(),
            "",
        ]
    Path(path).write_text("\n".join(lines), encoding="utf-8")


def detect_sections(result: dict, min_pause: float = 4.0) -> list[tuple[float, str]]:
    """Find section boundaries at long pauses between transcript segments."""
    sections: list[tuple[float, str]] = [(0.0, "Introduction")]
    segs = result["segments"]
    for i in range(1, len(segs)):
        if segs[i]["start"] - segs[i - 1]["end"] >= min_pause:
            sections.append((segs[i]["start"], f"Section {len(sections)}"))
    return sections


def make_ffmetadata(sections: list[tuple[float, str]], path: str) -> None:
    lines = [";FFMETADATA1", ""]
    for i, (start, title) in enumerate(sections):
        end = int(sections[i + 1][0] * 1000) if i + 1 < len(sections) else int(start * 1000) + 1
        lines += [
            "[CHAPTER]", "TIMEBASE=1/1000",
            f"START={int(start * 1000)}", f"END={end}",
            f"title={title}", "",
        ]
    Path(path).write_text("\n".join(lines), encoding="utf-8")


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert a Zoom recording to a tutorial video."
    )
    parser.add_argument("input", help="Path to the Zoom .mp4 recording")
    parser.add_argument(
        "--output", help="Output path (default: output/<name>_tutorial.mp4)"
    )
    parser.add_argument(
        "--whisper-model", default="base",
        choices=["tiny", "base", "small", "medium", "large"],
        help="Whisper model size — larger = more accurate but slower (default: base)",
    )
    parser.add_argument(
        "--silence-db", type=float, default=-35,
        help="Silence threshold in dB (default: -35). Lower = only cut very quiet gaps.",
    )
    parser.add_argument(
        "--silence-duration", type=float, default=1.5,
        help="Minimum silence length in seconds to remove (default: 1.5)",
    )
    parser.add_argument("--skip-trim",      action="store_true", help="Skip silence trimming")
    parser.add_argument("--skip-subtitles", action="store_true", help="Skip subtitle generation")
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    if not input_path.exists():
        sys.exit(f"Error: file not found: {input_path}")

    stem    = input_path.stem
    out_dir = Path("output")
    tmp_dir = out_dir / "tmp"
    out_dir.mkdir(exist_ok=True)
    tmp_dir.mkdir(exist_ok=True)

    final_out = Path(args.output) if args.output else out_dir / f"{stem}_tutorial.mp4"

    print("\n=== whpvideo: Zoom → Tutorial ===")
    print(f"Input:  {input_path}")
    print(f"Output: {final_out}\n")

    current = str(input_path)

    # ── Step 1: Trim silences ──────────────────────────────────────────────────
    if not args.skip_trim:
        print("[1/3] Detecting silences...")
        duration = get_video_duration(current)
        silences = detect_silences(current, args.silence_db, args.silence_duration)
        segments = keep_segments(silences, duration)
        removed  = sum(e - s for s, e in silences)
        print(f"      Removing {len(silences)} gap(s) (~{removed:.0f}s total).")
        trimmed = str(tmp_dir / f"{stem}_trimmed.mp4")
        trim_silences(current, trimmed, segments)
        current = trimmed
    else:
        print("[1/3] Skipping silence trim.")

    # ── Step 2: Transcribe + subtitles + sections ──────────────────────────────
    srt_out   = str(out_dir / f"{stem}.srt")
    sections: list[tuple[float, str]] = []
    meta_path = ""

    if not args.skip_subtitles:
        print(f"[2/3] Transcribing with Whisper '{args.whisper_model}' (may take a few minutes)...")
        result = transcribe(current, args.whisper_model)

        make_srt(result, srt_out)
        print(f"      Subtitles saved → {srt_out}")

        sections  = detect_sections(result)
        meta_path = str(tmp_dir / f"{stem}_chapters.txt")
        make_ffmetadata(sections, meta_path)
        print(f"      Detected {len(sections)} section(s).")

        subtitled = str(tmp_dir / f"{stem}_subtitled.mp4")
        print("      Burning subtitles into video...")
        burn_subtitles(current, srt_out, subtitled)
        current = subtitled
    else:
        print("[2/3] Skipping subtitles.")

    # ── Step 3: Embed chapters & finalise ─────────────────────────────────────
    print("[3/3] Finalising output...")
    if sections and meta_path:
        embed_chapters(current, meta_path, str(final_out))
    else:
        shutil.copy(current, str(final_out))

    print(f"\nDone!  →  {final_out}")

    if not args.skip_subtitles:
        print(f"Subtitles  →  {srt_out}")

    if sections:
        print("\nSections:")
        for ts, name in sections:
            print(f"  {int(ts // 60):02d}:{int(ts % 60):02d}  {name}")


if __name__ == "__main__":
    main()
