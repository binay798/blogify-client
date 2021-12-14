import React from 'react';
import {
  AppBar,
  Button,
  Stack,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet } from 'react-router-dom';
import * as classes from './Layout.style';
import { Link } from 'react-router-dom';
import logo from './../../assets/logo.jpeg';
import { RootState } from '../../store/Store';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../axiosInstance';
import * as actionCreators from '../../store/actions';

function Layout(): JSX.Element {
  const state = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.get('/api/v1/users/logout');
      dispatch({ type: actionCreators.AuthAction.LOGOUT });
      setAnchorEl(null);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <div>
      {/* <Box sx={{ flexGrow: 1 }}> */}
      <AppBar sx={classes.appBar} position='relative'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            <Link to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
              <img
                style={{
                  display: 'block',
                  width: '5rem',
                  borderRadius: '1rem',
                }}
                src={logo}
                alt='logo'
              />
            </Link>
          </Typography>
          <Stack direction='row' spacing={2}>
            {/* <Link
              to='/auth/signup'
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Button
                startIcon={<VpnKeyIcon />}
                variant='contained'
                color='secondary'
              >
                Register
              </Button>
            </Link> */}
            {state.user && (
              <>
                <Button
                  startIcon={
                    <Avatar
                      src={`${state.user.photo}`}
                      sx={{ width: 30, height: 30 }}
                    />
                  }
                  variant='outlined'
                  size='small'
                  sx={{ borderRadius: 24, textTransform: 'none' }}
                  id='basic-button'
                  aria-controls='basic-menu'
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  {state.user.username}
                </Button>
                <Menu
                  id='basic-menu'
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <AccountCircleIcon />
                      <Typography variant='body1'>Profile</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <ManageAccountsIcon />
                      <Typography variant='body1'>My account</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <LogoutIcon />
                      <Typography variant='body1'>
                        {loading ? 'Logging out...' : 'Logout'}
                      </Typography>
                    </Stack>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      {/* </Box> */}
      <Outlet />
    </div>
  );
}

export default Layout;
