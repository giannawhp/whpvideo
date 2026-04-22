import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fontFamily } from '../fonts';

export type SubtitleEntry = {
  startFrame: number;
  endFrame: number;
  text: string;
};

type SubtitleDisplayProps = {
  subtitles: SubtitleEntry[];
};

export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({ subtitles }) => {
  const frame = useCurrentFrame();

  const current = subtitles.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );

  if (!current) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 120px',
        fontFamily,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.78)',
          borderRadius: 8,
          padding: '10px 24px',
          maxWidth: '80%',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 34, fontWeight: 400, color: '#ffffff', lineHeight: 1.4 }}>
          {current.text}
        </span>
      </div>
    </div>
  );
};

// Parse a simple SRT string into SubtitleEntry[]
export function parseSrt(srt: string, fps: number): SubtitleEntry[] {
  const entries: SubtitleEntry[] = [];
  const blocks = srt.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;
    const timeLine = lines[1];
    const match = timeLine.match(
      /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/
    );
    if (!match) continue;
    const toSec = (h: string, m: string, s: string, ms: string) =>
      +h * 3600 + +m * 60 + +s + +ms / 1000;
    const start = toSec(match[1], match[2], match[3], match[4]);
    const end   = toSec(match[5], match[6], match[7], match[8]);
    const text  = lines.slice(2).join(' ');
    entries.push({
      startFrame: Math.round(start * fps),
      endFrame:   Math.round(end * fps),
      text,
    });
  }
  return entries;
}
