import { Box } from '@mui/material';
import { Suspense } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularLoading from '../CircularLoading/CircularLoading';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    htmlFontSize: 10,
  },
});

interface LazyComponentProps {
  component: JSX.Element;
}

function LazyComponent(props: LazyComponentProps): JSX.Element {
  return (
    <Suspense fallback={<FallbackComponent />}>{props.component}</Suspense>
  );
}

export function FallbackComponent(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--body)',
        }}
      >
        <CircularLoading />
      </Box>
    </ThemeProvider>
  );
}
export default LazyComponent;
