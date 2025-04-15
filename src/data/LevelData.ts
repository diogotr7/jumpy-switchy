// Grid constants
export const GRID_SIZE = 32; // Size of each grid cell in pixels
export const GRID_WIDTH = 32; // Number of cells wide
export const GRID_HEIGHT = 32; // Number of cells tall

// Level element types
export enum LevelElement {
  EMPTY = " ", // Empty space
  GROUND = "G", // Ground platform
  PLATFORM = "P", // Regular platform
  PLATFORM_LEFT = "L", // Left platform
  PLATFORM_RIGHT = "R", // Right platform
  PLATFORM_MIDDLE = "M", // Middle platform
  WALL = "W", // Wall block
  COIN = "C", // Bonus coin
  END = "E", // End trigger
  PLAYER = "S", // Player start position
}

// Level data structure
export interface LevelData {
  grid: string[]; // Array of strings representing each row
  background: {
    base: string;
    hills: string;
    tiles: string;
  };
  platformType: string;
}

// Define all levels - ensured to be properly aligned and consistent
export const LEVELS: LevelData[] = [
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W              E              W",
      "W           LMMMR             W",
      "W                             W",
      "W        LMR                  W",
      "W                    LMR      W",
      "W                             W",
      "W    LMR                      W",
      "W                             W",
      "W                LMR          W",
      "W         LMR                 W",
      "W                             W",
      "W    LMR                      W",
      "W                             W",
      "W              LMR            W",
      "W                             W",
      "W        LMR                  W",
      "W                             W",
      "W                    LMR      W",
      "W           LMR               W",
      "W                             W",
      "W      LMR                    W",
      "W    S                        W",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg3_background",
      hills: "bg3_hills",
      tiles: "bg3_tiles",
    },
    platformType: "tileBlue",
  },
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W              E              W",
      "W           LMMMR             W",
      "W                             W",
      "W                             W",
      "W                      LMR    W",
      "W                             W",
      "W            LMR              W",
      "W                             W",
      "W     LMR                     W",
      "W                             W",
      "W                   LMR       W",
      "W                             W",
      "W          LMR                W",
      "W                             W",
      "W    LMR                      W",
      "W                             W",
      "W                    LMR      W",
      "W                             W",
      "W           LMR               W",
      "W                             W",
      "W     LMR                     W",
      "W    S                        W",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg4_background",
      hills: "bg4_hills",
      tiles: "bg4_tiles",
    },
    platformType: "tileGreen",
  },
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W              E              W",
      "W           LMMMR             W",
      "W                             W",
      "W                             W",
      "W          P     P            W",
      "W                             W",
      "W                             W",
      "W     P           P           W",
      "W                             W",
      "W                             W",
      "W          P     P            W",
      "W                             W",
      "W                             W",
      "W     P           P           W",
      "W                             W",
      "W                             W",
      "W           P    P            W",
      "W                             W",
      "W                             W",
      "W     P             P         W",
      "W                             W",
      "W    S                        W",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg2_background",
      hills: "bg2_hills",
      tiles: "bg2_tiles",
    },
    platformType: "tileYellow",
  },
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W              E              W",
      "W           LMMMR             W",
      "W                             W",
      "W                        LMR  W",
      "W                             W",
      "W                    LMR      W",
      "W                             W",
      "W                LMR          W",
      "W                             W",
      "W            LMR              W",
      "W                             W",
      "W        LMR                  W",
      "W                             W",
      "W    LMR                      W",
      "W                             W",
      "W        LMR                  W",
      "W                             W",
      "W            LMR              W",
      "W                             W",
      "W                LMR          W",
      "W                             W",
      "W    S                        W",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg1_background",
      hills: "bg1_hills",
      tiles: "bg1_tiles",
    },
    platformType: "tileBrown",
  },
];
