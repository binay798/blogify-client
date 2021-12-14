import { useEffect, useState, memo } from 'react';
import {
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Stack,
  Paper,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axiosInstance';
import * as Actions from '../../store/actions/index';
import { RootState } from '../../store/Store';
import { Group } from '../../store/reducers/group.reducer';
import axiosMain from 'axios';

const leftSideStyle = {
  background: 'var(--appbar)',
  padding: '1rem',
  height: '100%',
  '&::-webkit-scrollbar': { display: 'none' },
  borderRight: '1px solid gray',
  overflowY: 'scroll',
};

const img = {
  display: 'block',
  width: '5rem',
  borderRadius: '1rem',
};

function Groups() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.group);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      setLoading(true);
      try {
        let res = await axios.get('/api/v1/groups?limit=4', {
          cancelToken: cancelReq.token,
        });
        dispatch({
          type: Actions.GroupAction.GET_GROUPS,
          payload: res.data,
        });
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();

    return () => {
      cancelReq.cancel();
    };
  }, [dispatch]);
  return (
    <Grid container sx={{ height: 'calc(100vh - 65px)' }}>
      <Box
        component={Grid}
        item
        display={{ xs: 'none', sm: 'none', md: 'block' }}
        md={3}
      >
        <Box sx={{ ...leftSideStyle, overflowY: 'scroll' }}>
          <Typography
            color='secondary.light'
            style={{ fontWeight: 600, marginBottom: '1rem' }}
            variant='h5'
          >
            Groups
          </Typography>
          <MemoizedSearchGroup />

          {/* CREATE NEW GROUP BUTTON */}
          <Link
            style={{ color: 'inherit', textDecoration: 'none' }}
            to='/groups/create'
          >
            <Button
              startIcon={<AddIcon />}
              sx={{ width: '100%', marginTop: '2rem' }}
              variant='contained'
            >
              Create New Group
            </Button>
          </Link>

          {/* GROUPS THAT YOU HAVE JOINED */}
          {loading ? (
            <Stack
              sx={{ padding: '1rem 0' }}
              direction='row'
              alignItems='center'
              justifyContent='center'
            >
              <CircularProgress />
            </Stack>
          ) : (
            <YourGroupList groups={state.groups} />
          )}
        </Box>
      </Box>
      <Grid
        item
        md={9}
        sm={12}
        xs={12}
        sx={{ background: 'var(--body)', height: '100%' }}
      >
        <Box sx={{ height: '100%' }}>
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}

interface YourGroupListProps {
  groups: Group[];
}

function YourGroupList(props: YourGroupListProps): JSX.Element {
  return (
    <Box>
      <Typography
        sx={{ fontWeight: 600, marginTop: '1rem' }}
        color='secondary'
        variant='body1'
      >
        Groups you've joined
      </Typography>
      {/* MAIN GROUP LIST CONTAINER */}
      <List>
        {props.groups.map((el, id) => {
          return (
            <Link
              to={`/groups/${el._id}`}
              key={id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <img style={img} alt={el.name} src={`${el.photo}`} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ color: blueGrey[100] }}
                    primary={
                      <Typography
                        color='secondary.light'
                        sx={{ fontWeight: 600 }}
                        variant='body2'
                      >
                        {el.name}
                      </Typography>
                    }
                    secondary='1.6k members'
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Box>
  );
}

function SearchGroup(): JSX.Element {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<null | Group[]>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (name === '') return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/groups/search/${name}?limit=5`);
      setGroups(res.data.groups);
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <Box position='relative'>
      <form onSubmit={submitHandler}>
        <TextField
          sx={{ width: '100%' }}
          id='outlined-basic'
          label='Search groups'
          variant='outlined'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position='end'>
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
        />
      </form>
      <Paper
        sx={{
          position: 'absolute',
          top: '120%',
          left: '0',
          width: '100%',
          zIndex: 10,
          display: open ? 'block' : 'none',
        }}
      >
        <List>
          {groups &&
            groups.length !== 0 &&
            groups.map((el, id) => {
              return (
                <Link
                  key={id}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  to={`/groups/${el._id}`}
                >
                  <ListItem onClick={handleClose} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Avatar src={`${el.photo}`} alt='list item' />
                      </ListItemIcon>
                      <ListItemText primary={el.name} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              );
            })}
        </List>
      </Paper>
    </Box>
  );
}

const MemoizedSearchGroup = memo(SearchGroup);
export default Groups;
