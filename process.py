#!/usr/bin/env python3
"""
Process Zoom recordings: trim silences, transcribe subtitles, split into segments.

Output layout:
  <input_stem>/
    trimmed.mp4        – silence-removed full video
    subtitles.srt      – full transcript
    segments/
      segment_01.mp4   – with burned-in subtitles
      segment_01.srt
      ...

Usage: python process.py <input.mp4>
"""

import sys
import re
import json
import subprocess
from pathlib import Path

SILENCE_DB = -40      # dB below which audio is considered silent
SILENCE_MIN = 0.5     # minimum silence duration to remove (seconds)
SEGMENT_BREAK = 2.5   # silence duration that marks a segment boundary (seconds)
PADDING = 0.15        # seconds of audio kept at speech edges after trimming


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def ffprobe_duration(path):
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(json.loads(r.stdout)["format"]["duration"])


def detect_silences(path):
    """Return list of (start, end) silent intervals in seconds."""
    r = subprocess.run(
        ["ffmpeg", "-i", str(path), "-af",
         f"silencedetect=noise={SILENCE_DB}dB:d={SILENCE_MIN}", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    ends   = [float(x) for x in re.findall(r"silence_end: ([\d.]+)",   r.stderr)]
    pairs  = list(zip(starts, ends))
    if len(starts) > len(ends):
        pairs.append((starts[-1], ffprobe_duration(path)))
    return pairs


def speech_intervals(silences, duration):
    """Convert silence list to speech (non-silent) intervals with PADDING kept at edges."""
    ivs, cursor = [], 0.0
    for s_start, s_end in silences:
        end = min(s_start + PADDING, duration)
        if end - cursor > 0.05:
            ivs.append((max(cursor, 0.0), end))
        cursor = max(s_end - PADDING, 0.0)
    if cursor < duration - 0.05:
        ivs.append((cursor, duration))
    return ivs


def srt_timestamp(t):
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{round((s % 1) * 1000):03d}"


# ---------------------------------------------------------------------------
# Step 2: trim silences
# ---------------------------------------------------------------------------

def trim_silences(input_path, output_path, intervals):
    from moviepy import VideoFileClip, concatenate_videoclips

    clip = VideoFileClip(str(input_path))
    subclips = [clip.subclipped(max(0.0, s), min(e, clip.duration)) for s, e in intervals]
    concatenate_videoclips(subclips).write_videofile(
        str(output_path), codec="libx264", audio_codec="aac", logger=None
    )
    clip.close()


# ---------------------------------------------------------------------------
# Step 3: transcribe + write SRT
# ---------------------------------------------------------------------------

def transcribe(path):
    import whisper
    print("  Loading Whisper base model...")
    model = whisper.load_model("base")
    return model.transcribe(str(path), verbose=False)["segments"]


def write_srt(segments, path):
    with open(path, "w") as f:
        for i, seg in enumerate(segments, 1):
            f.write(
                f"{i}\n"
                f"{srt_timestamp(seg['start'])} --> {srt_timestamp(seg['end'])}\n"
                f"{seg['text'].strip()}\n\n"
            )


# ---------------------------------------------------------------------------
# Step 4: split into segments with per-segment subtitles
# ---------------------------------------------------------------------------

def parse_srt(path):
    """Return list of (start_s, end_s, text) from an SRT file."""
    def to_secs(ts):
        h, m, rest = ts.split(":")
        sec, ms = rest.split(",")
        return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000

    entries, block = [], []
    for line in (Path(path).read_text().splitlines() + [""]):
        if line.strip():
            block.append(line)
        elif block:
            if len(block) >= 2 and "-->" in block[1]:
                start_str, end_str = block[1].split("-->")
                text = " ".join(block[2:]).strip()
                entries.append((to_secs(start_str.strip()), to_secs(end_str.strip()), text))
            block = []
    return entries


def write_srt_entries(entries, path):
    with open(path, "w") as f:
        for i, (start, end, text) in enumerate(entries, 1):
            f.write(f"{i}\n{srt_timestamp(start)} --> {srt_timestamp(end)}\n{text}\n\n")


def split(input_path, breaks, duration, srt_path, output_dir):
    output_dir.mkdir(exist_ok=True)
    srt_entries = parse_srt(srt_path)
    boundaries = [0.0] + breaks + [duration]
    n = 0

    for seg_start, seg_end in zip(boundaries, boundaries[1:]):
        if seg_end - seg_start < 5.0:
            continue
        n += 1

        # Retime SRT entries to this segment's local clock
        local_entries = [
            (s - seg_start, e - seg_start, t)
            for s, e, t in srt_entries
            if s >= seg_start - 0.5 and e <= seg_end + 0.5
        ]
        seg_srt = output_dir / f"segment_{n:02d}.srt"
        write_srt_entries(local_entries, seg_srt)

        seg_mp4 = output_dir / f"segment_{n:02d}.mp4"
        # Escape colons in path for ffmpeg subtitles filter
        escaped_srt = str(seg_srt).replace("\\", "/").replace(":", "\\:")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-ss", f"{seg_start:.3f}", "-to", f"{seg_end:.3f}",
                "-i", str(input_path),
                "-vf", (
                    f"subtitles='{escaped_srt}'"
                    ":force_style='FontSize=18,PrimaryColour=&Hffffff&,BorderStyle=3'"
                ),
                "-c:v", "libx264", "-c:a", "aac",
                str(seg_mp4),
            ],
            check=True, capture_output=True,
        )
        print(f"  [{n:02d}] {seg_start:.1f}s – {seg_end:.1f}s  →  {seg_mp4.name}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if len(sys.argv) < 2:
        sys.exit("Usage: python process.py <input.mp4>")

    input_path = Path(sys.argv[1]).expanduser().resolve()
    if not input_path.exists():
        sys.exit(f"File not found: {input_path}")

    out_dir = input_path.parent / input_path.stem
    out_dir.mkdir(exist_ok=True)
    print(f"Input : {input_path.name}")
    print(f"Output: {out_dir}\n")

    # 1. Detect silences in the original file
    print("[1/4] Detecting silences...")
    duration = ffprobe_duration(input_path)
    silences = detect_silences(input_path)
    print(f"      {len(silences)} silent regions in {duration:.0f}s of video")

    # 2. Trim silences
    print("[2/4] Trimming silences...")
    intervals = speech_intervals(silences, duration)
    trimmed = out_dir / "trimmed.mp4"
    trim_silences(input_path, trimmed, intervals)
    trimmed_duration = ffprobe_duration(trimmed)
    print(f"      {duration:.0f}s → {trimmed_duration:.0f}s  ({trimmed.name})")

    # 3. Transcribe trimmed video
    print("[3/4] Transcribing with Whisper...")
    segs = transcribe(trimmed)
    srt = out_dir / "subtitles.srt"
    write_srt(segs, srt)
    print(f"      {len(segs)} subtitle entries → {srt.name}")

    # 4. Split into segments at long pauses, burn in subtitles
    print("[4/4] Splitting into segments...")
    trimmed_silences = detect_silences(trimmed)
    breaks = [(s + e) / 2 for s, e in trimmed_silences if e - s >= SEGMENT_BREAK]
    print(f"      {len(breaks)} segment break(s) found")
    split(trimmed, breaks, trimmed_duration, srt, out_dir / "segments")

    print(f"\nDone! Output in: {out_dir}")


if __name__ == "__main__":
    main()
