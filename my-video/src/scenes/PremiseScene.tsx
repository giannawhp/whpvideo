import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GradientBackground } from '../components/GradientBackground';
import { AnimatedBullet } from '../components/AnimatedBullet';
import { COLOR_ACCENT, COLOR_TEXT } from '../constants';
import { fontFamily } from '../fonts';

const BULLETS = [
  'Brainstorm ideas instantly',
  'Draft faster with AI assist',
  'Refine and polish with feedback',
];

export const PremiseScene: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headlineOpacity = interpolate(frame, [10, 35], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineY = interpolate(frame, [10, 35], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <GradientBackground />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 160px',
        }}
      >
        <div style={{ opacity: labelOpacity, marginBottom: 16 }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: COLOR_ACCENT,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            The Premise
          </span>
        </div>

        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            marginBottom: 56,
          }}
        >
          <span
            style={{ fontSize: 72, fontWeight: 700, color: COLOR_TEXT, lineHeight: 1.1 }}
          >
            Your writing, amplified.
          </span>
        </div>

        <div>
          {BULLETS.map((text, i) => (
            <AnimatedBullet
              key={text}
              text={text}
              index={i}
              staggerFrames={25}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
