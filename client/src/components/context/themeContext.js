import * as React from "react";
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { createContext } from "react";


export const ColorModeContext = createContext({ toggleColorMode: () => { } });


export function ToggleColorMode({ children }) {
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  console.log(mode)
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={{ theme, colorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}
