import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLOR_ACCENT, CHAR_FRAMES } from '../constants';

type TypewriterProps = {
  text: string;
  startFrame?: number;
  charFrames?: number;
  showCursor?: boolean;
  style?: React.CSSProperties;
};

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  startFrame = 0,
  charFrames = CHAR_FRAMES,
  showCursor = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);
  const charCount = Math.min(text.length, Math.floor(localFrame / charFrames));
  const typed = text.slice(0, charCount);

  const cursorOpacity = interpolate(
    (frame % 16),
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <span style={style}>
      {typed}
      {showCursor && (
        <span
          style={{
            display: 'inline-block',
            width: 3,
            height: '1.1em',
            backgroundColor: COLOR_ACCENT,
            marginLeft: 3,
            verticalAlign: 'text-bottom',
            opacity: cursorOpacity,
          }}
        />
      )}
    </span>
  );
};
