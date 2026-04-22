import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLOR_BG_START, COLOR_BG_END } from '../constants';

export const GradientBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLOR_BG_START} 0%, ${COLOR_BG_END} 100%)`,
    }}
  />
);
