import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from 'remotion';
import { IntroCard } from './components/IntroCard';
import { ChapterCard } from './components/ChapterCard';
import { SubtitleDisplay, parseSrt, SubtitleEntry } from './components/SubtitleDisplay';
import { CHAPTERS, CHAPTER_CARD_DURATION, INTRO_CARD_DURATION, VIDEO_FPS } from './videoConstants';

// Replace with real SRT content once transcription is available.
// Each line: index, timecode, text (standard SRT format).
const SRT_CONTENT = ``;

let SUBTITLES: SubtitleEntry[] = [];
if (SRT_CONTENT.trim()) {
  SUBTITLES = parseSrt(SRT_CONTENT, VIDEO_FPS);
}

export const TutorialVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Source video */}
      <OffthreadVideo
        src={staticFile('WHP_trimmed.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />

      {/* Intro title card — overlaid on top of video for first 5s */}
      <Sequence from={0} durationInFrames={INTRO_CARD_DURATION} premountFor={fps}>
        <IntroCard />
      </Sequence>

      {/* Chapter cards */}
      {CHAPTERS.map((chapter, i) => (
        <Sequence
          key={chapter.title}
          from={chapter.frameStart}
          durationInFrames={CHAPTER_CARD_DURATION}
          premountFor={fps}
          layout="none"
        >
          <ChapterCard
            number={i + 1}
            title={chapter.title}
            totalChapters={CHAPTERS.length}
          />
        </Sequence>
      ))}

      {/* Subtitles (populated once SRT_CONTENT is filled in) */}
      {SUBTITLES.length > 0 && <SubtitleDisplay subtitles={SUBTITLES} />}
    </AbsoluteFill>
  );
};
