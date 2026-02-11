import { View } from "react-native";



// src/core/theme.ts
export const COLORS = {
  // Brand
  brand: '#9FE747',          // neon green
  brandSoft: '#9FE74780',    // 50% from palette
  brandDark: '#013023',      // deep green background

  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  gray700: '#54585C',
  gray800: '#151718',
  gray300: '#C5C1C1',

  // Status
  danger: '#E72A2A',

  // Semantic aliases
  background: '#013023',
  surface: '#151718',
  surfaceSoft: '#013023',    // cards/blocks
  textPrimary: '#FFFFFF',
  textSecondary: '#C5C1C1',
  border: '#9FE74780',
  calssBackground: '#9fe74733',
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const TYPOGRAPHY = {
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: COLORS.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: COLORS.textPrimary,
  },
  button: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.black,
  },
  text:{
    color: COLORS.textPrimary
  },
    textCenter: {
      textAlign: 'center',
      fontSize: 16,
      color: COLORS.textPrimary,
      marginBottom: 12,
    },
    textMuted: {
      textAlign: 'center',
      fontSize: 14,
      color: COLORS.brandSoft,
      marginBottom: 8,
    },
    cardName: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
    cardMeta: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 4,
    },
    View:{
        shadowColor: '#ff0000',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    }
};
