import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Button,
  ListItemText,
  Avatar,
  Pagination,
  CircularProgress,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  useMediaQuery,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import axios from '../../axiosInstance';
import { User } from '../../store/reducers/auth.reducer';
import { Link } from 'react-router-dom';

const leftSideStyle = {
  background: 'var(--appbar)',
  maxHeight: '100vh',
  height: '100%',
  '&::-webkit-scrollbar': { display: 'none' },
  borderRight: '1px solid gray',
};

const rightSideStyle = {
  background: 'var(--body)',
  height: '100vh',
};

function Users(): JSX.Element {
  const mdScreen = useMediaQuery('(max-width: 600px)');
  return (
    <Grid container>
      <Box component={Grid} display={{ xs: 'none', sm: 'block' }} item sm={3}>
        <Box sx={{ ...leftSideStyle, overflowY: 'scroll' }}>
          <LeftContainer />
        </Box>
      </Box>
      <Grid item sm={9} xs={12}>
        <Box
          sx={{
            ...rightSideStyle,
            overflowY: 'scroll',
            '&::-webkit-scrollbar': { display: 'none' },
            padding: mdScreen ? '0rem' : '4rem',
          }}
        >
          <RightContainer />
        </Box>
      </Grid>
    </Grid>
  );
}

function LeftContainer(): JSX.Element {
  const [users, setUsers] = useState<User[] | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const searchUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/users/search/${name}`);
      setUsers(res.data.users);
      setName('');
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography
        gutterBottom
        sx={{ fontWeight: 600, padding: '1rem' }}
        color='secondary.light'
        variant='h5'
      >
        Users
      </Typography>
      {/* USER SEARCH FORM */}
      <form onSubmit={searchUser} style={{ padding: '0 1rem' }}>
        <Stack direction='column' spacing={2} sx={{ marginBottom: '2rem' }}>
          <TextField
            sx={{ width: '100%' }}
            variant='outlined'
            label='Search User'
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            disabled={loading}
            type='submit'
            variant='contained'
            color='secondary'
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Stack>
      </form>
      {users && (
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              Serach results
            </ListSubheader>
          }
        >
          {users.length === 0 && (
            <Typography
              variant='body2'
              color='secondary'
              sx={{ padding: '0 1.5rem' }}
            >
              No users found.
            </Typography>
          )}
          {users.length !== 0 &&
            users.map((el, id) => {
              return (
                <Link
                  key={id}
                  to={`/${el.username}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <Avatar src={`${el.photo}`} />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: 'secondary.main' }}
                      primary={`${el.firstname} ${el.lastname}`}
                    />
                  </ListItemButton>
                </Link>
              );
            })}
        </List>
      )}
    </Box>
  );
}

function RightContainer(): JSX.Element {
  const [users, setUsers] = useState<User[] | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;
  const smScreen = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/v1/users/count`);
        setTotal(res.data.users);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    setUsers(null);
    (async () => {
      try {
        const res = await axios.get(
          `/api/v1/users?limit=${limit}&page=${page}`
        );
        setUsers(res.data.users);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [page]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Paper sx={{ padding: '0rem', background: 'var(--appbar)' }}>
      <Typography
        gutterBottom
        sx={{ fontWeight: 600, padding: '1rem' }}
        color='secondary.light'
        variant='h5'
      >
        People You May Know
      </Typography>

      {/* USERS CONTAINER */}
      {!users && (
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={1}
          sx={{ paddingBottom: '2rem' }}
        >
          <CircularProgress />
          <Typography variant='body2' color='secondary'>
            Loading...
          </Typography>
        </Stack>
      )}
      <Grid
        container
        spacing={4}
        sx={{ padding: smScreen ? '0rem' : '1rem 4rem' }}
      >
        {users &&
          users.length !== 0 &&
          users.map((el, id) => {
            return (
              <Grid key={id} item xs={12} sm={12} md={6}>
                <Paper sx={{ padding: '2rem 3rem' }}>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Avatar src={`${el.photo}`} />
                    <ListItemText
                      primary={
                        <Typography
                          variant='body1'
                          color='secondary.light'
                          sx={{ fontWeight: 600 }}
                        >
                          {`${el.firstname} ${el.lastname}`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant='body2' color='secondary'>
                          125 followers
                        </Typography>
                      }
                    />
                    <Button size='small' variant='outlined' color='primary'>
                      <Link
                        to={`/${el.username}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        View
                      </Link>
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
      <Stack direction='row' justifyContent='center' sx={{ padding: '1rem 0' }}>
        <Pagination
          page={page}
          count={Math.ceil(total / limit)}
          onChange={handleChange}
          color='primary'
        />
      </Stack>
    </Paper>
  );
}

export default Users;
