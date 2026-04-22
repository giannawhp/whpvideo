import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GradientBackground } from '../components/GradientBackground';
import { COLOR_ACCENT, COLOR_TEXT, COLOR_SECONDARY } from '../constants';
import { fontFamily } from '../fonts';

const STEPS = [
  { number: '01', label: 'Go to', highlight: 'claude.ai' },
  { number: '02', label: 'Sign in or create a free account', highlight: null },
  { number: '03', label: 'Type your first prompt', highlight: null },
];

const STEP_START_FRAMES = [20, 55, 90];

export const GettingStartedScene: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headlineOpacity = interpolate(frame, [5, 25], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineY = interpolate(frame, [5, 25], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const highlightOpacity = interpolate(frame, [120, 140], [0, 0.18], {
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
            Getting Started
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
            style={{ fontSize: 64, fontWeight: 700, color: COLOR_TEXT, lineHeight: 1.15 }}
          >
            Three steps to your first conversation
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {STEPS.map((step, i) => {
            const startFrame = STEP_START_FRAMES[i];
            const stepOpacity = interpolate(
              frame,
              [startFrame, startFrame + 20],
              [0, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );
            const stepScale = interpolate(
              frame,
              [startFrame, startFrame + 20],
              [0.9, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );

            const isLastStep = i === 2;
            const boxShadow = isLastStep
              ? `0 0 0 3px rgba(245, 166, 35, ${highlightOpacity * 5.5})`
              : 'none';

            return (
              <div
                key={step.number}
                style={{
                  opacity: stepOpacity,
                  transform: `scale(${stepScale})`,
                  transformOrigin: 'left center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 32,
                  padding: '20px 28px',
                  borderRadius: 12,
                  backgroundColor: isLastStep
                    ? `rgba(245, 166, 35, ${highlightOpacity})`
                    : 'rgba(255,255,255,0.04)',
                  boxShadow,
                }}
              >
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: COLOR_ACCENT,
                    minWidth: 80,
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </span>
                <span style={{ fontSize: 40, color: COLOR_TEXT, fontWeight: 400 }}>
                  {step.label}
                  {step.highlight && (
                    <span style={{ color: COLOR_ACCENT, fontWeight: 600 }}>
                      {' '}{step.highlight}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
