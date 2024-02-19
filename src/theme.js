import { createTheme, darken, lighten } from '@mui/material/styles';

const styleOverrides = (rootStyle) => ({
  styleOverrides: {
    root: rootStyle,
  },
});

const defaultProps = (props) => ({ defaultProps: props });

const mode = 'light';

const theme = createTheme({
  palette: {
    mode,
    ...(mode === 'dark' && {
      background: {
        default: 'rgb(5, 30, 52)',
        paper: 'rgb(5, 30, 52)',
      },
    }),
    primary: {
      main: '#128c7e',
    },
    none: {
      main: '#fff',
      light: '#000',
      dark: '#fff',
    },
    report_bg: {
      main:
        mode == 'dark'
          ? darken('rgb(5, 30, 52)', 0.2)
          : lighten('#3366ff', 0.9),
      sub:
        mode == 'dark'
          ? darken('rgb(5, 30, 52)', 0.1)
          : lighten('#3366ff', 0.95),
    },
  },
  typography: {
    fontSize: 16,
  },
  components: {
    MuiButtonBase: defaultProps({
      disableRipple: true,
      sx: {
        textTransform: 'none !important',
      },
    }),
    MuiLink: defaultProps({
      underline: 'none',
      href: '#',
      sx: { cursor: 'pointer' },
    }),
    MuiList: defaultProps({
      sx: { a: { textDecoration: 'none', color: 'inherit' } },
    }),
    MuiBackdrop: styleOverrides({
      backgroundColor:
        mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      zIndex: 1000,
    }),
    MuiTypography: styleOverrides({ wordBreak: 'normal' }),
  },
});

export default theme;
