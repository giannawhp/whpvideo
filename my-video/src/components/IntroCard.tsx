import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLOR_ACCENT, COLOR_TEXT, COLOR_SECONDARY } from '../constants';
import { fontFamily } from '../fonts';

export const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [100, 125], [1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = fadeIn * fadeOut;

  const titleY = interpolate(frame, [0, 25], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, rgba(15,12,41,0.97) 0%, rgba(48,43,99,0.97) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        fontFamily,
      }}
    >
      <div style={{ opacity: 0.7, marginBottom: 20 }}>
        <span style={{ fontSize: 26, fontWeight: 600, color: COLOR_ACCENT, letterSpacing: 6, textTransform: 'uppercase' }}>
          Whole Heart Publishing
        </span>
      </div>

      <div style={{ transform: `translateY(${titleY}px)`, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 88, fontWeight: 700, color: COLOR_TEXT, lineHeight: 1.1 }}>
          Writing with Claude
        </div>
        <div style={{
          height: 5,
          backgroundColor: COLOR_ACCENT,
          marginTop: 14,
          borderRadius: 3,
        }} />
      </div>

      <div style={{ opacity: 0.8, marginTop: 16 }}>
        <span style={{ fontSize: 34, fontWeight: 400, color: COLOR_SECONDARY }}>
          A training session for WHP writers
        </span>
      </div>
    </AbsoluteFill>
  );
};
