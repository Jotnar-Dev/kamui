export const tokens = {
  color: {
    white: '#ffffff',
    gray: {
      100: '#f5f5f5',
      300: '#d4d4d4',
      500: '#737373',
      700: '#404040',
      900: '#171717',
    },
    primary: {
      100: '#e0e7ff',
      300: '#a5b4fc',
      500: '#6366f1',
      700: '#4338ca',
      900: '#312e81',
    },
  },
  space: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 6: '24px', 8: '32px' },
  fontSize: { sm: '14px', md: '16px', lg: '20px', xl: '24px' },
  radius: { sm: '4px', md: '8px', lg: '16px', full: '9999px' },
} as const;
