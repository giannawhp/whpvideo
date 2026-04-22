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
import { TutorialVideo } from './TutorialVideo';
import { SCENE, TRANSITION_FRAMES, FPS } from './constants';
import { VIDEO_FPS, VIDEO_TOTAL_FRAMES } from './videoConstants';

// Animated slides intro video (32.5s)
const SLIDES_TOTAL_FRAMES = 1050 - 5 * TRANSITION_FRAMES;

const WHPSlidesVideo: React.FC = () => (
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
  <>
    {/* Main tutorial: source Zoom recording trimmed + overlaid with title/chapter cards */}
    <Composition
      id="WHPTutorial"
      component={TutorialVideo}
      durationInFrames={VIDEO_TOTAL_FRAMES}
      fps={VIDEO_FPS}
      width={1920}
      height={1080}
    />
    {/* Standalone animated intro slides (32.5s) */}
    <Composition
      id="WHPIntroSlides"
      component={WHPSlidesVideo}
      durationInFrames={SLIDES_TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
