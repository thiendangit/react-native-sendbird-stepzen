import { createTheme, useTheme as useThemeRS } from '@shopify/restyle'

import { color } from './color'
import { palette } from './palette'
import { spacing } from './spacing'
import { typography } from './typography'

export const lightTheme = createTheme({
  colors: {
    ...color,
  },
  spacing: {
    ...spacing,
  },
  textInputVariants: {
    defaults: {
      fontSize: 16,
      fontFamily: 'Poppins',
      lineHeight: 16 * 1.5,
    },
    normal: {
      fontSize: 16,
      color: 'text',
      fontFamily: 'Poppins',
      fontWeight: 'bold',
    },
  },
  textVariants: {
    defaults: {
      fontSize: 16,
      color: 'text',
      fontFamily: 'Poppins',
    },
    ...typography,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
    largeTablet: 1024,
  },
  isDark: false,
})

export type Theme = typeof lightTheme

export const darkTheme: Theme = {
  ...lightTheme,
  isDark: true,
  colors: {
    ...lightTheme.colors,
    background: palette.black,
    highlight: palette.white,
    text: palette.white,
  },
}

export const useTheme = () => useThemeRS<Theme>()
