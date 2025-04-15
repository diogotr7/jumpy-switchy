// Level data structure
export interface PlatformData {
  x: number;
  y: number;
  width: number;
}

export interface LevelData {
  platforms: PlatformData[];
  background?: string; // Optional background image
  backgroundColor?: number; // Optional color
}

// Define all levels
export const LEVELS: LevelData[] = [
  // Level 1 - Original layout
  {
    platforms: [
      // Ground platform
      { x: 512, y: 768, width: 20 },
      // Ascending platforms
      { x: 300, y: 700, width: 4 },
      { x: 700, y: 650, width: 3 },
      { x: 200, y: 580, width: 3 },
      { x: 550, y: 510, width: 2 },
      { x: 300, y: 440, width: 2 },
      { x: 700, y: 380, width: 2 },
      { x: 450, y: 320, width: 1.5 },
      { x: 200, y: 260, width: 1.5 },
      { x: 400, y: 190, width: 1 },
      { x: 650, y: 130, width: 1 },
      { x: 350, y: 70, width: 1 },
    ],
    backgroundColor: 0x87ceeb,
  },

  // Level 2 - Different pattern
  {
    platforms: [
      // Ground
      { x: 512, y: 768, width: 20 },
      // Zigzag pattern
      { x: 200, y: 700, width: 3 },
      { x: 400, y: 650, width: 2 },
      { x: 600, y: 600, width: 2 },
      { x: 800, y: 550, width: 2 },
      { x: 600, y: 500, width: 2 },
      { x: 400, y: 450, width: 2 },
      { x: 200, y: 400, width: 2 },
      { x: 400, y: 350, width: 1.5 },
      { x: 600, y: 300, width: 1.5 },
      { x: 800, y: 250, width: 1 },
      { x: 600, y: 200, width: 1 },
      { x: 400, y: 150, width: 1 },
      { x: 200, y: 100, width: 1 },
      { x: 512, y: 50, width: 3 },
    ],
    backgroundColor: 0x6bb7bd,
  },

  // Level 3 - Vertical challenge
  {
    platforms: [
      // Ground
      { x: 512, y: 768, width: 20 },
      // Central column with small platforms
      { x: 512, y: 700, width: 3 },
      { x: 512, y: 620, width: 2 },
      { x: 512, y: 550, width: 1.5 },
      { x: 412, y: 500, width: 1 },
      { x: 612, y: 450, width: 1 },
      { x: 512, y: 400, width: 1 },
      { x: 412, y: 350, width: 0.8 },
      { x: 612, y: 300, width: 0.8 },
      { x: 512, y: 250, width: 0.8 },
      { x: 462, y: 200, width: 0.6 },
      { x: 562, y: 150, width: 0.6 },
      { x: 512, y: 100, width: 0.5 },
      { x: 512, y: 50, width: 1 },
    ],
    backgroundColor: 0x9370db,
  },

  // Level 4 - Stair pattern
  {
    platforms: [
      // Ground
      { x: 512, y: 768, width: 20 },
      // Left stairs
      { x: 100, y: 700, width: 2 },
      { x: 200, y: 630, width: 2 },
      { x: 300, y: 560, width: 2 },
      { x: 400, y: 490, width: 2 },
      // Right stairs
      { x: 924, y: 420, width: 2 },
      { x: 824, y: 350, width: 2 },
      { x: 724, y: 280, width: 2 },
      { x: 624, y: 210, width: 2 },
      // Top platform
      { x: 512, y: 140, width: 3 },
      { x: 512, y: 70, width: 1 },
    ],
    backgroundColor: 0xff9966,
  },
];
