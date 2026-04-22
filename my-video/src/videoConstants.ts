// Chapter definitions — update titles to match actual call content
export type Chapter = {
  title: string;
  frameStart: number;
};

export const VIDEO_FPS = 25;
export const VIDEO_TOTAL_FRAMES = 139339;

export const CHAPTERS: Chapter[] = [
  { title: 'Introduction', frameStart: 0 },
  { title: 'Getting Started with Claude', frameStart: 1415 },
  { title: 'The Premise', frameStart: 2338 },
  { title: 'Writing with Claude: Live Demo', frameStart: 66807 },
  { title: 'Tips & Best Practices', frameStart: 68088 },
];

// How long each chapter card stays on screen (frames)
export const CHAPTER_CARD_DURATION = 5 * VIDEO_FPS; // 5 seconds
export const INTRO_CARD_DURATION = 6 * VIDEO_FPS;   // 6 seconds
