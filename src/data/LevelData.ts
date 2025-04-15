// Grid constants
export const GRID_SIZE = 32; // Size of each grid cell in pixels
export const GRID_WIDTH = 32; // Number of cells wide
export const GRID_HEIGHT = 48; // Changed from 32 to 48 for taller levels

// Level element types
export enum LevelElement {
  EMPTY = " ", // Empty space
  GROUND = "G", // Ground platform
  PLATFORM = "P", // Regular platform
  PLATFORM_LEFT = "L", // Left platform
  PLATFORM_RIGHT = "R", // Right platform
  PLATFORM_MIDDLE = "M", // Middle platform
  WALL = "W", // Wall block
  END = "E", // End trigger
  PLAYER = "S", // Player start position
  FOLIAGE = "F", // Foliage decoration
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
  foliageType: string; // Optional foliage type
}

// Define all levels - ensured to be properly aligned and consistent
export const LEVELS: LevelData[] = [
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W                              W",
      "W              E               W",
      "W           LMMMR              W",
      "W                        FFF   W",
      "W                        LMR   W",
      "W                              W",
      "W                              W",
      "W                    LMR       W",
      "W                              W",
      "W                FFF           W",
      "W                LMR           W",
      "W                              W",
      "W                              W",
      "W            LMR               W",
      "W                              W",
      "W                              W",
      "W        LMR                   W",
      "W                              W",
      "W    FFF                       W",
      "W    LMR                       W",
      "W                              W",
      "W                              W",
      "W        LMR                   W",
      "W                              W",
      "W            FFF               W",
      "W            LMR               W",
      "W                              W",
      "W                              W",
      "W                LMR           W",
      "W                              W",
      "W                              W",
      "WFFFFSFFFFFFFFFFFFFFFFFFFFFFFFFW",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg3_background",
      hills: "bg3_hills",
      tiles: "bg3_tiles",
    },
    platformType: "tileBlue",
    foliageType: "Blue",
  },
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W                              W",
      "W              E               W",
      "W           LMMMR              W",
      "W                    FFF       W",
      "W                    LMR       W",
      "W                              W",
      "W        LMR                   W",
      "W    FFF                       W",
      "W    LMR                       W",
      "W                              W",
      "W                LMR           W",
      "W         LMR                  W",
      "W                              W",
      "W    FFF                       W",
      "W    LMR                       W",
      "W                              W",
      "W              LMR             W",
      "W                              W",
      "W                              W",
      "W        FFF                   W",
      "W        LMR                   W",
      "W                              W",
      "W                              W",
      "W                    LMR       W",
      "W           LMR                W",
      "W                              W",
      "W                              W",
      "W      FFF                     W",
      "W      LMR                     W",
      "W                              W",
      "W                              W",
      "WFFFFSFFFFFFFFFFFFFFFFFFFFFFFFFW",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg4_background",
      hills: "bg4_hills",
      tiles: "bg4_tiles",
    },
    platformType: "tileGreen",
    foliageType: "Dark",
  },
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W                              W",
      "W              E               W",
      "W           LMMMR              W",
      "W                              W",
      "W                      FFF     W",
      "W                      LMR     W",
      "W                              W",
      "W                              W",
      "W            LMR               W",
      "W                              W",
      "W     FFF                      W",
      "W     LMR                      W",
      "W                              W",
      "W                              W",
      "W                   LMR        W",
      "W                              W",
      "W          FFF                 W",
      "W          LMR                 W",
      "W                              W",
      "W                              W",
      "W    LMR                       W",
      "W                              W",
      "W                              W",
      "W                    LMR       W",
      "W                              W",
      "W                              W",
      "W           LMR                W",
      "W                              W",
      "W     FFF                      W",
      "W     LMR                      W",
      "W                              W",
      "WFFFFSFFFFFFFFFFFFFFFFFFFFFFFFFW",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg2_background",
      hills: "bg2_hills",
      tiles: "bg2_tiles",
    },
    platformType: "tileYellow",
    foliageType: "Green",
  },
  {
    grid: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "W                              W",
      "W              E               W",
      "W           LMMMR              W",
      "W                              W",
      "W      F               F       W",
      "W      P               P       W",
      "W                              W",
      "W                              W",
      "W     F           F            W",
      "W     P           P            W",
      "W                              W",
      "W                              W",
      "W          F              F    W",
      "W          P              P    W",
      "W                              W",
      "W                              W",
      "W     F           F            W",
      "W     P           P            W",
      "W                              W",
      "W                              W",
      "W            F                 W",
      "W            P                 W",
      "W                              W",
      "W                              W",
      "W                              W",
      "W     F             F          W",
      "W     P             P          W",
      "W                              W",
      "W             F                W",
      "W             P                W",
      "W                              W",
      "WFFFFSFFFFFFFFFFFFFFFFFFFFFFFFFW",
      "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
    ],
    background: {
      base: "bg1_background",
      hills: "bg1_hills",
      tiles: "bg1_tiles",
    },
    platformType: "tileBrown",
    foliageType: "Red",
  },
];
