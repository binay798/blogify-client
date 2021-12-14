import { useState } from 'react';
import {
  Paper,
  Typography,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  useMediaQuery,
} from '@mui/material';
import logo from './../../../assets/logo.jpeg';
import { blueGrey } from '@mui/material/colors';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actionCreators from './../../../store/actionCreators/index';

const container = {
  padding: '2rem',
  background: 'white',
  color: '#333',
  maxWidth: '65rem',
  width: '100%',
};

const img = {
  display: 'block',
  objectFit: 'contain' as 'contain',
  margin: '0 auto',
  width: '15rem',
};
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const smScreen = useMediaQuery('(max-width: 600px)');

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(actionCreators.login({ email, password }, setLoading, navigate));
  };
  return (
    <Paper elevation={8} sx={container}>
      <Stack
        direction={smScreen ? 'column' : 'row'}
        spacing={smScreen ? 0 : 12}
      >
        <img
          style={{ ...img, display: smScreen ? 'none' : 'block' }}
          src={logo}
          alt='logo'
        />
        <Stack sx={{ flex: 1 }} direction='column' spacing={2}>
          <Typography variant='h5' align='center' color={blueGrey[500]}>
            Login
          </Typography>
          <form onSubmit={submitHandler}>
            <Stack direction='column' spacing={2}>
              <TextField
                sx={{ width: '100%' }}
                variant='outlined'
                label='Email address'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                sx={{ width: '100%' }}
                variant='outlined'
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Stack direction='row' spacing={1} justifyContent='space-between'>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label={<Typography variant='body2'>Remember me</Typography>}
                />
                <Button
                  sx={{ textTransform: 'none', fontSize: '1.4rem' }}
                  variant='text'
                >
                  Forgot password?
                </Button>
              </Stack>
              <Button
                startIcon={<LoginIcon />}
                variant='contained'
                color='primary'
                type='submit'
                disabled={loading}
              >
                Login
              </Button>
              <Link
                to='/auth/signup'
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Button
                  sx={{
                    textTransform: 'none',
                    fontSize: '1.4rem',
                    width: '100%',
                  }}
                  variant='text'
                >
                  Don't have an account? Signup
                </Button>
              </Link>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Login;
