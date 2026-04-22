import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GradientBackground } from '../components/GradientBackground';
import { AnimatedBullet } from '../components/AnimatedBullet';
import { COLOR_ACCENT, COLOR_TEXT, COLOR_SECONDARY } from '../constants';
import { fontFamily } from '../fonts';

const TIPS = [
  'Be specific in your prompts',
  'Give context about your book',
  'Ask Claude to revise',
  'Use it as a thinking partner',
];

export const BestPracticesScene: React.FC = () => {
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

  const proTipOpacity = interpolate(frame, [160, 180], [0, 1], {
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
            Tips for Great Results
          </span>
        </div>

        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            marginBottom: 48,
          }}
        >
          <span
            style={{ fontSize: 64, fontWeight: 700, color: COLOR_TEXT, lineHeight: 1.15 }}
          >
            Get the most from Claude
          </span>
        </div>

        <div style={{ marginBottom: 32 }}>
          {TIPS.map((text, i) => (
            <AnimatedBullet
              key={text}
              text={text}
              index={i}
              staggerFrames={30}
            />
          ))}
        </div>

        <div style={{ opacity: proTipOpacity }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              backgroundColor: 'rgba(245, 166, 35, 0.15)',
              border: `2px solid ${COLOR_ACCENT}`,
              borderRadius: 12,
              padding: '16px 24px',
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: COLOR_ACCENT,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Pro tip
            </span>
            <span style={{ fontSize: 26, color: COLOR_SECONDARY }}>
              Start every prompt with your genre and audience
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
