/**
 * Color System
 *
 * Light/Dark 모드를 지원하는 색상 시스템
 */

export const COLORS = {
  // Primary Colors
  primary: {
    light: {
      main: "#007AFF",
      hover: "#0051D5",
      active: "#004CBF",
      disabled: "#B3D7FF",
    },
    dark: {
      main: "#0A84FF",
      hover: "#409CFF",
      active: "#5DB0FF",
      disabled: "#1C3A5E",
    },
  },

  // Secondary Colors
  secondary: {
    light: {
      main: "#5856D6",
      hover: "#3634A3",
      active: "#2E2C8B",
      disabled: "#C7C6EA",
    },
    dark: {
      main: "#5E5CE6",
      hover: "#7D7AFF",
      active: "#9493FF",
      disabled: "#2C2B5E",
    },
  },

  // Neutral Colors (Gray Scale)
  gray: {
    light: {
      50: "#F9F9F9",
      100: "#F2F2F7",
      200: "#E5E5EA",
      300: "#D1D1D6",
      400: "#C7C7CC",
      500: "#AEAEB2",
      600: "#8E8E93",
      700: "#636366",
      800: "#48484A",
      900: "#3A3A3C",
      950: "#1C1C1E",
    },
    dark: {
      50: "#1C1C1E",
      100: "#2C2C2E",
      200: "#3A3A3C",
      300: "#48484A",
      400: "#636366",
      500: "#8E8E93",
      600: "#AEAEB2",
      700: "#C7C7CC",
      800: "#D1D1D6",
      900: "#E5E5EA",
      950: "#F2F2F7",
    },
  },

  // Background Colors
  background: {
    light: {
      primary: "#FFFFFF",
      secondary: "#F9F9F9",
      tertiary: "#F2F2F7",
    },
    dark: {
      primary: "#000000",
      secondary: "#1C1C1E",
      tertiary: "#2C2C2E",
    },
  },

  // Text Colors
  text: {
    light: {
      primary: "#000000",
      secondary: "#3A3A3C",
      tertiary: "#8E8E93",
      disabled: "#C7C7CC",
      inverse: "#FFFFFF",
    },
    dark: {
      primary: "#FFFFFF",
      secondary: "#E5E5EA",
      tertiary: "#8E8E93",
      disabled: "#48484A",
      inverse: "#000000",
    },
  },

  // Border Colors
  border: {
    light: {
      default: "#D1D1D6",
      strong: "#8E8E93",
      subtle: "#E5E5EA",
    },
    dark: {
      default: "#48484A",
      strong: "#636366",
      subtle: "#3A3A3C",
    },
  },

  // Status Colors
  status: {
    success: {
      light: "#34C759",
      dark: "#32D74B",
    },
    error: {
      light: "#FF3B30",
      dark: "#FF453A",
    },
    warning: {
      light: "#FF9500",
      dark: "#FF9F0A",
    },
    info: {
      light: "#007AFF",
      dark: "#0A84FF",
    },
  },
} as const;

// Type Definitions
export type ColorTheme = "light" | "dark";
export type ColorCategory = keyof typeof COLORS;
export type ColorValue = string;

// Utility Functions
export const getColor = (
  category: string,
  theme: ColorTheme,
  variant: string
): string => {
  const categoryColors = COLORS[category as ColorCategory];
  if (!categoryColors) return "";

  const themeColors = categoryColors[theme as keyof typeof categoryColors];
  if (!themeColors) return "";
  if (typeof themeColors !== "object") return "";

  return (themeColors as Record<string, string>)[variant] || "";
};

export const getButtonColor = (
  variant: "primary" | "secondary" | "tertiary",
  theme: ColorTheme,
  state: "main" | "hover" | "active" | "disabled" = "main"
): string => {
  if (variant === "tertiary") {
    // Tertiary는 gray를 사용
    return COLORS.gray[theme][
      state === "main"
        ? 200
        : state === "hover"
        ? 300
        : state === "active"
        ? 400
        : 100
    ];
  }

  return COLORS[variant][theme][state];
};

export default COLORS;
