import { Stack, CircularProgress, Typography } from '@mui/material';

function CircularLoading(): JSX.Element {
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='center'
      spacing={1}
    >
      <CircularProgress size={18} />
      <Typography variant='caption' color='secondary'>
        Loading...
      </Typography>
    </Stack>
  );
}

export default CircularLoading;
