/**
 * Design tokens ported verbatim from the original prototype's
 * src/index.css @theme block and Tailwind arbitrary-value classes
 * (git show cfaa64e:src/index.css / src/components/*.tsx).
 */
export const colors = {
  canvas: '#FAF9F7',
  pageBackground: '#F4F3F0',
  textPrimary: '#18181B',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',

  lavender50: '#F5F3FF',
  lavender100: '#EDE9FE',
  lavender200: '#DDD6FE',
  lavender300: '#C4B5FD',
  lavender400: '#A78BFA',
  lavender500: '#8B7CE6',
  lavender600: '#7C6EE6', // primary
  lavender700: '#6D5EC9',
  lavender800: '#55479E',
  lavender900: '#42367E',

  amber50: '#FEF3C7',
  amber200: '#FDE68A',
  amber700: '#92400E',
  amber600: '#D97706',

  emerald600: '#059669',
  emerald500: '#10B981',
  pink500: '#EC4899',
  indigo600: '#4F46E5',
  orange500: '#F97316',

  // Back-compat aliases for the pre-redesign palette used by screens not
  // yet redone against the original prototype's exact tokens above.
  background: '#FAF9F7',
  primary: '#7C6EE6',
  primaryMuted: '#EDE9FE',
};

export const fonts = {
  serif: 'Literata_600SemiBold',
  serifItalic: 'Literata_700Bold_Italic',
  serifRegularItalic: 'Literata_400Regular_Italic',
  sans: 'Geist-Regular',
  sansMedium: 'Geist-Medium',
  sansSemiBold: 'Geist-SemiBold',
  sansBold: 'Geist-Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};
