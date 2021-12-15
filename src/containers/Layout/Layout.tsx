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
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet } from 'react-router-dom';
import * as classes from './Layout.style';
import { Link } from 'react-router-dom';
import logo from './../../assets/logo.jpeg';
import { RootState } from '../../store/Store';
import { User } from '../../store/reducers/auth.reducer';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../axiosInstance';
import * as actionCreators from '../../store/actions';

function Layout(): JSX.Element {
  const state = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const open = Boolean(anchorEl);
  const smScreen = useMediaQuery('(max-width: 600px)');

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

                <IconButton
                  onClick={() => setOpenDrawer(true)}
                  sx={{ display: !smScreen ? 'none' : 'flex' }}
                >
                  <MenuRoundedIcon />
                </IconButton>

                <Drawer
                  anchor='left'
                  open={openDrawer}
                  onClose={() => setOpenDrawer((prev) => !prev)}
                >
                  <DrawerContent user={state.user} />
                </Drawer>
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

interface DrawerContentProps {
  user: User | null;
}

function DrawerContent(props: DrawerContentProps): JSX.Element {
  return (
    <List>
      <Link to='profile' style={{ color: 'inherit', textDecoration: 'none' }}>
        <ListItemButton>
          <ListItemIcon>
            <Avatar src={`${props.user?.photo}`} alt='B' />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant='body1' sx={{ textTransform: 'capitalize' }}>
                {props.user?.firstname} {props.user?.lastname}
              </Typography>
            }
          />
        </ListItemButton>
      </Link>

      <Divider sx={{ borderColor: 'var(--divider)' }} />
      <Link style={{ color: 'inherit', textDecoration: 'none' }} to='/groups'>
        <ListItemButton>
          <ListItemIcon>
            <GroupsIcon sx={{ color: 'var(--light)', fontSize: '3rem' }} />
          </ListItemIcon>
          <ListItemText primary='Groups' />
        </ListItemButton>
      </Link>
      <Link
        style={{ color: 'inherit', textDecoration: 'none' }}
        to='/groups/create'
      >
        <ListItemButton>
          <ListItemIcon>
            <GroupAddIcon sx={{ color: 'var(--light)', fontSize: '3rem' }} />
          </ListItemIcon>
          <ListItemText primary='Create Group' />
        </ListItemButton>
      </Link>
      <Link style={{ color: 'inherit', textDecoration: 'none' }} to='/users'>
        <ListItemButton>
          <ListItemIcon>
            <PeopleAltIcon sx={{ color: 'var(--light)', fontSize: '3rem' }} />
          </ListItemIcon>
          <ListItemText primary='All Users' />
        </ListItemButton>
      </Link>
    </List>
  );
}
export default Layout;
