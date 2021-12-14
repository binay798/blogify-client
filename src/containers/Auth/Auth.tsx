import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    htmlFontSize: 10,
  },
});
function Auth() {
  const smScreen = useMediaQuery('(max-width: 600px)');
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: smScreen ? '1rem' : '4rem',
        }}
      >
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default Auth;
