import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Stack,
  Typography,
  ListItemIcon,
  Button,
  Box,
} from '@mui/material';

import AddPost from '../../../components/AddPost/AddPost';
import * as classes from './Posts.style';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import { Link } from 'react-router-dom';
import { purple } from '@mui/material/colors';
import Post from '../../../components/Post/Post';
import axios from '../../../axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';
import { Post as SinglePost } from '../../../store/reducers/post.reducer';
import { User } from '../../../store/reducers/auth.reducer';
import axiosMain from 'axios';
import CircularLoading from '../../../components/CircularLoading/CircularLoading';

function Posts(): JSX.Element {
  const state = useSelector((state: RootState) => state.auth);
  const [posts, setPosts] = useState<SinglePost[] | null>(null);

  // const [loading, setLoading] = useState(false);
  // GET YOUR POST
  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      // setLoading(true);
      try {
        if (!state.user) return;
        const authorId = state.user._id;
        let res = await axios.get(
          `/api/v1/posts?author=${authorId}&limit=5&populate=author`,
          { cancelToken: cancelReq.token }
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      }
      // setLoading(false);
    })();

    return () => {
      cancelReq.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPost = (post: SinglePost) => {
    // setLoading(true);
    setPosts((prev) => {
      if (!prev) return null;
      return [post, ...prev];
    });
    // setLoading(false);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={5}>
        <Stack direction='column' spacing={2}>
          <Intro authorId={state.user?._id} />

          <Photos posts={posts} />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={7}>
        <AddPost addPost={addPost} />

        {/* ALL POSTS */}
        <Stack direction='column' sx={{ margin: '2rem auto' }} spacing={4}>
          {!posts && <CircularLoading />}
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
  posts: SinglePost[] | null;
}

function Photos(props: PhotosProps): JSX.Element {
  return (
    <Paper sx={classes.paper}>
      <Stack
        direction='row'
        sx={{ marginBottom: '1rem' }}
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h6'>Photos</Typography>
        <Link
          style={{ color: purple[700], textDecoration: 'none' }}
          to='/profile/photos'
        >
          <Button>See all photos</Button>
        </Link>
      </Stack>
      {/* PHOTOS */}
      <Box sx={classes.photoContainer}>
        {props.posts?.length === 0 && (
          <Typography color='secondary' variant='caption' display='block'>
            No photos to show
          </Typography>
        )}
        {props.posts &&
          props.posts.map((el, id) => {
            return (
              <Box key={id}>
                <img
                  style={{ display: 'block', width: '100%', cursor: 'pointer' }}
                  src={`${el.photo}`}
                  alt='hello'
                />
              </Box>
            );
          })}
      </Box>
    </Paper>
  );
}

interface IntroProps {
  authorId: string | undefined;
}
function Intro(props: IntroProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      try {
        if (!props.authorId) return;
        const res = await axios.get(`/api/v1/users/${props.authorId}`, {
          cancelToken: cancelReq.token,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      cancelReq.cancel();
    };
  }, [props.authorId]);
  return (
    <Paper sx={classes.paper}>
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
                  {user?.college}
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
                  {user?.highSchool}
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
                  {user?.temporaryAddress}
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
                  {user?.permanentAddress}
                </span>
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Paper>
  );
}

export default Posts;
