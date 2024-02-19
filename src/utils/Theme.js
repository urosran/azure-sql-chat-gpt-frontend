import createTheme from "@mui/material/styles/createTheme";
import {deepPurple} from "@mui/material/colors";

export const theme =
  createTheme({
    root: {
      position: 'absolute',
      height: '100%'
    },
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#5271FF',
        contrastText: '#ffffff',
        white: '#ffffff'
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: '#4F4F4F'
      },
      neutral: {
        main: '#ffffff',
        gray: '#f4f6f6',
        gray2: '#adadad',
      },
      azure: {
        main: '#1DAEFF',
      },
      confirmation: {
        main: '#09D92A',
        contrastText: '#ffffff',
        dark: "#2FA642"
      },
      purple: {
        main: deepPurple[500],
        light: deepPurple[200],
      }
    },
    typography: {
      fontFamily: "Roboto Slab, serif",
      h1: {
        fontFamily: "Roboto Slab, serif",
        fontSize: '2.8rem'
      },
      h2: {
        fontFamily: "Roboto Slab, serif",
        fontSize: '2.2rem'
      },
      h3: {
        fontFamily: "Roboto Slab, serif",
        fontSize: '1.5rem'
      },
      h4: {
        fontFamily: "Roboto Slab, serif",
        fontSize: '1.2rem'
      },
      h5: {
        fontFamily: "Roboto Slab, serif",
        fontSize: '1rem'
      },
      body1: {
        fontFamily: "Roboto Slab, serif",
        fontSize: '0.9rem'
      }

    },
    action: {
      hover: '#1B8EB1',
      active: '#1B8EB1',
    }
  })
