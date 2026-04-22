import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GradientBackground } from '../components/GradientBackground';
import { COLOR_ACCENT, COLOR_TEXT, COLOR_SECONDARY } from '../constants';
import { fontFamily } from '../fonts';

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  const whpOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [10, 40], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [10, 40], [60, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [30, 55], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const underlineScale = interpolate(frame, [25, 45], [0, 1], {
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
          alignItems: 'center',
          padding: '80px 120px',
        }}
      >
        <div style={{ opacity: whpOpacity, marginBottom: 24 }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 8,
              color: COLOR_ACCENT,
              textTransform: 'uppercase',
            }}
          >
            Whole Heart Publishing
          </span>
        </div>

        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: COLOR_TEXT,
              lineHeight: 1.1,
            }}
          >
            Writing with Claude
          </div>
          <div
            style={{
              height: 6,
              backgroundColor: COLOR_ACCENT,
              marginTop: 16,
              borderRadius: 3,
              transform: `scaleX(${underlineScale})`,
              transformOrigin: 'left center',
            }}
          />
        </div>

        <div style={{ opacity: subtitleOpacity, marginTop: 16 }}>
          <span
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: COLOR_SECONDARY,
            }}
          >
            A guide for our writers
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
