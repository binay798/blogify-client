import { useState, useEffect } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import * as classes from './../Profile.style';
import { blueGrey } from '@mui/material/colors';
import { useParams } from 'react-router-dom';
import Post from '../../../components/Post/Post';
import { Post as MainPost } from '../../../store/reducers/post.reducer';

import axios from './../../../axiosInstance';
import { User as MainUser } from '../../../store/reducers/auth.reducer';
import axiosMain from 'axios';

function User(): JSX.Element {
  // const state = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<MainUser | null>(null);
  const [navs, setNavs] = useState('posts');
  const params = useParams();
  const mdScreen = useMediaQuery('(max-width: 960px)');
  const smScreen = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `/api/v1/users?username=${params.username}`
        );
        setUser(res.data.users[0]);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [params.username]);

  if (!user) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 65px)',
          background: 'var(--body)',
        }}
      >
        <Stack
          direction='row'
          sx={{ height: '100%' }}
          alignItems='center'
          justifyContent='center'
          spacing={2}
        >
          <CircularProgress />
          <Typography variant='body1' color='secondary.main'>
            Loading...
          </Typography>
        </Stack>
      </Box>
    );
  }
  return (
    <Box>
      {/* TOP SECTION */}
      <Box
        sx={{
          background: 'var(--appbar)',
          padding: mdScreen ? '0 0.5rem' : '0 20rem',
        }}
      >
        {/* COVER PHOTO SECTION */}
        <Box sx={classes.coverPhoto}>Add</Box>
        {/* USER SUMMARY SECTION */}
        <Box
          sx={{
            padding: !mdScreen ? '0 4rem' : '0 2rem',
            marginBottom: '1rem',
          }}
        >
          <Stack
            direction='row'
            sx={{ marginTop: '-3rem', flexWrap: 'wrap' }}
            spacing={4}
            alignItems={!mdScreen ? 'flex-end' : 'center'}
          >
            {/* USER AVATAR */}
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                sx={{
                  width: smScreen ? 100 : 170,
                  height: smScreen ? 100 : 170,
                }}
                alt='Travis Howard'
                src={`${user.photo}`}
              />
            </Badge>
            <Stack direction='column'>
              <Typography
                variant={!smScreen ? 'h4' : 'h6'}
                sx={{ textTransform: 'capitalize' }}
                color={blueGrey[100]}
                component='div'
              >
                {user.firstname} {user.lastname}
              </Typography>
              {/* <Typography variant='h6' color={blueGrey[100]} component='div'>
                72 mutual friends
              </Typography> */}
            </Stack>
          </Stack>
          <Divider sx={{ borderColor: 'var(--divider)', marginTop: '2rem' }} />
        </Box>

        {/* TAB BAR SECTION */}
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          sx={{ padding: '0 4rem', paddingBottom: '2rem' }}
        >
          <Button
            onClick={() => setNavs('posts')}
            variant={navs === 'posts' ? 'contained' : 'outlined'}
          >
            Posts
          </Button>

          <Button
            onClick={() => setNavs('photos')}
            variant={navs === 'photos' ? 'contained' : 'outlined'}
          >
            Photos
          </Button>
        </Stack>
      </Box>
      {/* BOTTOM SECTION */}
      <Box
        sx={{
          padding: mdScreen ? '0 0.5rem' : '2rem 24rem',
          background: 'var(--body)',
          minHeight: '100vh',
        }}
      >
        {navs === 'posts' ? <Posts user={user} /> : null}
        {navs === 'photos' ? <Photos user={user} /> : null}
      </Box>
    </Box>
  );
}

interface PostsProps {
  user: MainUser;
}
function Posts(props: PostsProps): JSX.Element {
  const [posts, setPosts] = useState<MainPost[] | null>(null);

  // GET POSTS
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `/api/v1/posts?author=${props.user._id}&populate=author`
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [props.user._id]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={5} position='relative'>
        <Stack
          direction='column'
          sx={{ position: 'sticky', top: '2rem' }}
          spacing={2}
        >
          <Paper
            sx={{
              padding: '2rem',
              background: 'var(--appbar)',
            }}
          >
            <Typography variant='h6' gutterBottom component='div'>
              Intro
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      Went to
                      <span style={{ fontWeight: 600, display: 'block' }}>
                        {props.user.highSchool}
                      </span>
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      Went to
                      <span style={{ fontWeight: 600, display: 'block' }}>
                        {props.user.college}
                      </span>
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      Lives in
                      <span style={{ fontWeight: 600, display: 'block' }}>
                        {props.user.temporaryAddress}
                      </span>
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      From
                      <span style={{ fontWeight: 600, display: 'block' }}>
                        {props.user.permanentAddress}
                      </span>
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={7}>
        {/* ALL POSTS */}
        <Stack direction='column' sx={{ margin: '0rem auto' }} spacing={4}>
          {!posts && (
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='center'
              spacing={1}
            >
              <CircularProgress />
              <Typography variant='body2' color='secondary'>
                Loading...
              </Typography>
            </Stack>
          )}
          {posts &&
            posts.map((el) => {
              return <Post data={el} key={el._id} />;
            })}

          {posts?.length === 0 && (
            <Typography
              color='secondary'
              variant='body1'
              sx={{ textAlign: 'center' }}
              display='block'
            >
              No posts to show
            </Typography>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

interface PhotosProps {
  user: MainUser;
}
function Photos(props: PhotosProps): JSX.Element {
  const [posts, setPosts] = useState<MainPost[] | null>(null);
  // GET YOUR POST
  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      try {
        let res = await axios.get(
          `/api/v1/posts?author=${props.user._id}&limit=5&populate=author&fields=photo`,
          { cancelToken: cancelReq.token }
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      cancelReq.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper sx={{ padding: '2rem' }}>
      <Typography style={{ marginBottom: '1rem' }} variant='h5'>
        Photos
      </Typography>
      {!posts && (
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='center'
          spacing={1}
        >
          <CircularProgress />
          <Typography variant='body2' color='secondary'>
            Loading...
          </Typography>
        </Stack>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
          gap: '1rem',
        }}
      >
        {posts &&
          posts.map((el, id) => {
            return (
              <img
                key={id}
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '4px',
                  height: '100%',
                  objectFit: 'cover' as 'cover',
                }}
                src={`${el.photo}`}
                alt='hello'
              />
            );
          })}
      </Box>
    </Paper>
  );
}

export default User;
