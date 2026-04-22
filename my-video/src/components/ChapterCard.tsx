import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLOR_ACCENT, COLOR_TEXT, COLOR_SECONDARY } from '../constants';
import { fontFamily } from '../fonts';

type ChapterCardProps = {
  number: number;
  title: string;
  totalChapters: number;
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ number, title, totalChapters }) => {
  const frame = useCurrentFrame();

  const slideIn = interpolate(frame, [0, 18], [60, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [90, 112], [1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const barScale = interpolate(frame, [5, 22], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-start', padding: 60, fontFamily }}>
      <div
        style={{
          opacity: fadeIn * fadeOut,
          transform: `translateY(${slideIn}px)`,
          backgroundColor: 'rgba(15, 12, 41, 0.88)',
          border: `2px solid ${COLOR_ACCENT}`,
          borderRadius: 14,
          padding: '24px 36px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            width: 5,
            height: 52,
            backgroundColor: COLOR_ACCENT,
            borderRadius: 3,
            transform: `scaleY(${barScale})`,
            transformOrigin: 'bottom center',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLOR_ACCENT, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
            Chapter {number} of {totalChapters}
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, color: COLOR_TEXT }}>
            {title}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
