import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLOR_ACCENT, COLOR_TEXT } from '../constants';
import { fontFamily } from '../fonts';

type AnimatedBulletProps = {
  text: string;
  index: number;
  staggerFrames: number;
};

export const AnimatedBullet: React.FC<AnimatedBulletProps> = ({
  text,
  index,
  staggerFrames,
}) => {
  const frame = useCurrentFrame();
  const startFrame = index * staggerFrames;

  const progress = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        opacity: progress,
        transform: `translateY(${translateY}px)`,
        marginBottom: 24,
        fontFamily,
      }}
    >
      <div
        style={{
          width: 4,
          height: 36,
          backgroundColor: COLOR_ACCENT,
          borderRadius: 2,
          transform: `scaleY(${progress})`,
          transformOrigin: 'top center',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 36, color: COLOR_TEXT, fontWeight: 400 }}>
        {text}
      </span>
    </div>
  );
};
