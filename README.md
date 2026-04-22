# whpvideo

Convert a Zoom screen-share recording into a polished tutorial video.

**What it does:**
- Removes silence gaps (dead air, pauses between segments)
- Transcribes audio and burns in subtitles
- Detects section breaks from long pauses and adds chapter markers to the MP4

## Setup

**System requirements** (install once):
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

**Python dependencies:**
```bash
pip install -r requirements.txt
```

## Usage

1. Drop your Zoom `.mp4` recording into the `input/` folder.
2. Run:

```bash
python process.py input/your-recording.mp4
```

The output is saved to `output/your-recording_tutorial.mp4`.
A subtitle file `output/your-recording.srt` is also saved alongside it.

### Options

| Flag | Default | Description |
|---|---|---|
| `--output PATH` | `output/<name>_tutorial.mp4` | Custom output path |
| `--whisper-model` | `base` | Whisper model: `tiny` `base` `small` `medium` `large` |
| `--silence-db` | `-35` | Silence threshold in dB (lower = only cut very quiet gaps) |
| `--silence-duration` | `1.5` | Minimum gap length in seconds to remove |
| `--skip-trim` | — | Skip silence trimming |
| `--skip-subtitles` | — | Skip transcription and subtitles |

### Examples

```bash
# Default (base Whisper model)
python process.py input/demo.mp4

# More accurate transcription (slower)
python process.py input/demo.mp4 --whisper-model small

# Only trim silences, skip subtitles
python process.py input/demo.mp4 --skip-subtitles

# Custom output path
python process.py input/demo.mp4 --output output/final_tutorial.mp4
```

## Output structure

```
output/
  your-recording_tutorial.mp4   # final video with subtitles + chapters
  your-recording.srt             # subtitle file (can be used separately)
  tmp/                           # intermediate files (can be deleted)
```
