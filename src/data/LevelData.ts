// Grid constants
export const GRID_SIZE = 32; // Size of each grid cell in pixels
export const GRID_WIDTH = 32; // Number of cells wide
export const GRID_HEIGHT = 24; // Number of cells tall

// Level element types
export enum LevelElement {
  EMPTY = " ", // Empty space
  GROUND = "G", // Ground platform
  PLATFORM = "P", // Regular platform
  WALL = "W", // Wall block
  COIN = "C", // Bonus coin
  END = "E", // End trigger
  PLAYER = "S", // Player start position
}

// Level data structure
export interface LevelData {
  grid: string[][]; // 2D array of level elements
  background: {
    base: string;
    hills: string;
    tiles: string;
  };
  platformType: string;
}

// Helper function to create an empty grid
export function createEmptyGrid(): string[][] {
  return Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(LevelElement.EMPTY));
}

// Helper function to create a row of elements
function createRow(element: string): string[] {
  return Array(GRID_WIDTH).fill(element);
}

// Helper function to create side walls
function createSideWalls(): string[] {
  return ["W", ...Array(GRID_WIDTH - 2).fill(LevelElement.EMPTY), "W"];
}

// Helper function to create a platform at a specific position
function createPlatformRow(platformX: number, width: number = 1): string[] {
  const row = createSideWalls();
  for (let i = 0; i < width; i++) {
    if (platformX + i < GRID_WIDTH - 1) {
      // Don't overwrite the right wall
      row[platformX + i] = LevelElement.PLATFORM;
    }
  }
  return row;
}

// Define all levels
export const LEVELS: LevelData[] = [
  // Level 1 - Original ascending platforms
  {
    grid: [
      // Top walls
      createSideWalls(),
      // Empty rows
      ...Array(5)
        .fill(null)
        .map(() => createSideWalls()),
      // Ascending platforms
      createPlatformRow(9, 1), // y: 320
      createPlatformRow(21, 1), // y: 380
      createPlatformRow(12, 1), // y: 440
      createPlatformRow(17, 1), // y: 510
      createPlatformRow(9, 1), // y: 580
      createPlatformRow(21, 1), // y: 650
      createPlatformRow(14, 1), // y: 700
      // Empty rows
      ...Array(4)
        .fill(null)
        .map(() => createSideWalls()),
      // Ground row
      createRow(LevelElement.GROUND),
    ],
    background: {
      base: "bg3_background",
      hills: "bg3_hills",
      tiles: "bg3_tiles",
    },
    platformType: "tileBlue",
  },

  // Level 2 - Original zigzag pattern
  {
    grid: [
      // Top walls
      createSideWalls(),
      // Empty rows
      ...Array(5)
        .fill(null)
        .map(() => createSideWalls()),
      // Zigzag pattern
      createPlatformRow(6, 1), // y: 300
      createPlatformRow(12, 1), // y: 350
      createPlatformRow(6, 1), // y: 400
      createPlatformRow(12, 1), // y: 450
      createPlatformRow(6, 1), // y: 500
      createPlatformRow(12, 1), // y: 550
      createPlatformRow(6, 1), // y: 600
      createPlatformRow(12, 1), // y: 650
      createPlatformRow(6, 1), // y: 700
      // Empty rows
      ...Array(2)
        .fill(null)
        .map(() => createSideWalls()),
      // Ground row
      createRow(LevelElement.GROUND),
    ],
    background: {
      base: "bg4_background",
      hills: "bg4_hills",
      tiles: "bg4_tiles",
    },
    platformType: "tileGreen",
  },

  // Level 3 - Original vertical challenge
  {
    grid: [
      // Top walls
      createSideWalls(),
      // Empty rows
      ...Array(5)
        .fill(null)
        .map(() => createSideWalls()),
      // Vertical platforms
      createPlatformRow(16, 1), // y: 300
      createPlatformRow(16, 1), // y: 350
      createPlatformRow(16, 1), // y: 400
      createPlatformRow(16, 1), // y: 450
      createPlatformRow(16, 1), // y: 500
      createPlatformRow(16, 1), // y: 550
      createPlatformRow(16, 1), // y: 600
      createPlatformRow(16, 1), // y: 650
      createPlatformRow(16, 1), // y: 700
      // Empty rows
      ...Array(2)
        .fill(null)
        .map(() => createSideWalls()),
      // Ground row
      createRow(LevelElement.GROUND),
    ],
    background: {
      base: "bg2_background",
      hills: "bg2_hills",
      tiles: "bg2_tiles",
    },
    platformType: "tileGreen",
  },

  // Level 4 - Original stair pattern
  {
    grid: [
      // Top walls
      createSideWalls(),
      // Empty rows
      ...Array(5)
        .fill(null)
        .map(() => createSideWalls()),
      // Stair pattern
      createPlatformRow(3, 1), // y: 320
      createPlatformRow(6, 1), // y: 380
      createPlatformRow(9, 1), // y: 440
      createPlatformRow(12, 1), // y: 500
      createPlatformRow(15, 1), // y: 560
      createPlatformRow(18, 1), // y: 620
      createPlatformRow(21, 1), // y: 680
      createPlatformRow(24, 1), // y: 740
      // Empty rows
      ...Array(3)
        .fill(null)
        .map(() => createSideWalls()),
      // Ground row
      createRow(LevelElement.GROUND),
    ],
    background: {
      base: "bg1_background",
      hills: "bg1_hills",
      tiles: "bg1_tiles",
    },
    platformType: "tileBrown",
  },
];
