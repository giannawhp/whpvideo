import React from 'react';
import { Composition } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { TitleScene } from './scenes/TitleScene';
import { PremiseScene } from './scenes/PremiseScene';
import { GettingStartedScene } from './scenes/GettingStartedScene';
import { WritingScene } from './scenes/WritingScene';
import { BestPracticesScene } from './scenes/BestPracticesScene';
import { OutroScene } from './scenes/OutroScene';
import { SCENE, TRANSITION_FRAMES, FPS } from './constants';

// Scene frames: 90 + 210 + 180 + 270 + 210 + 90 = 1050
// Transitions: 5 × 15 = 75 overlap
// Total: 975 frames (32.5s)
const TOTAL_FRAMES = 1050 - 5 * TRANSITION_FRAMES;

const WHPVideo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={SCENE.title}>
      <TitleScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
    <TransitionSeries.Sequence durationInFrames={SCENE.premise}>
      <PremiseScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
    <TransitionSeries.Sequence durationInFrames={SCENE.gettingStarted}>
      <GettingStartedScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
    <TransitionSeries.Sequence durationInFrames={SCENE.writing}>
      <WritingScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
    <TransitionSeries.Sequence durationInFrames={SCENE.bestPractices}>
      <BestPracticesScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
    <TransitionSeries.Sequence durationInFrames={SCENE.outro}>
      <OutroScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WHPVideo"
    component={WHPVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
