import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GradientBackground } from '../components/GradientBackground';
import { COLOR_ACCENT, COLOR_TEXT, COLOR_SECONDARY } from '../constants';
import { fontFamily } from '../fonts';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const ctaScale = interpolate(frame, [0, 25], [0.8, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaOpacity = interpolate(frame, [0, 25], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const linkOpacity = interpolate(frame, [20, 40], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const footerOpacity = interpolate(frame, [30, 50], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const underlineScale = interpolate(frame, [15, 35], [0, 1], {
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
        }}
      >
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: 96, fontWeight: 700, color: COLOR_TEXT, lineHeight: 1.1 }}
          >
            Start Writing Today
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

        <div style={{ opacity: linkOpacity, marginTop: 32 }}>
          <span style={{ fontSize: 40, fontWeight: 600, color: COLOR_ACCENT }}>
            claude.ai
          </span>
          <span style={{ fontSize: 36, fontWeight: 400, color: COLOR_SECONDARY }}>
            {' '}— free to start
          </span>
        </div>

        <div style={{ opacity: footerOpacity, marginTop: 48 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: COLOR_SECONDARY,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Whole Heart Publishing
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
