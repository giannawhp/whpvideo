import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { GradientBackground } from '../components/GradientBackground';
import { Typewriter } from '../components/Typewriter';
import { COLOR_ACCENT, COLOR_TEXT, COLOR_SECONDARY, PROMPT_TEXT, RESPONSE_TEXT, CHAR_FRAMES } from '../constants';
import { fontFamily } from '../fonts';

// Prompt: 59 chars × 2 frames = 118 frames, starts at 30 → done at 148
// Pause: 148→163 (15 frames)
// Response: 24 chars × 2 frames = 48 frames, starts at 163 → done at 211
const PROMPT_START = 30;
const RESPONSE_START = 163;

export const WritingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftPanelOpacity = interpolate(frame, [10, 25], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rightPanelOpacity = interpolate(frame, [RESPONSE_START - 15, RESPONSE_START], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panelStyle: React.CSSProperties = {
    flex: 1,
    borderRadius: 16,
    padding: '40px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    minHeight: 280,
  };

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <GradientBackground />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 120px',
          gap: 32,
        }}
      >
        <div style={{ opacity: labelOpacity }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: COLOR_ACCENT,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Writing with Claude
          </span>
        </div>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          <div
            style={{
              ...panelStyle,
              opacity: leftPanelOpacity,
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: COLOR_SECONDARY,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              You type
            </span>
            <Typewriter
              text={PROMPT_TEXT}
              startFrame={PROMPT_START}
              charFrames={CHAR_FRAMES}
              showCursor={frame < RESPONSE_START}
              style={{
                fontSize: 36,
                color: COLOR_TEXT,
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            />
          </div>

          <div
            style={{
              ...panelStyle,
              opacity: rightPanelOpacity,
              backgroundColor: 'rgba(245, 166, 35, 0.08)',
              border: `1px solid rgba(245, 166, 35, 0.3)`,
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: COLOR_ACCENT,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Claude responds
            </span>
            <Typewriter
              text={RESPONSE_TEXT}
              startFrame={RESPONSE_START}
              charFrames={CHAR_FRAMES}
              showCursor
              style={{
                fontSize: 40,
                color: COLOR_TEXT,
                lineHeight: 1.5,
                fontWeight: 600,
                fontStyle: 'italic',
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
