import { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Stack } from '@mui/material';
import * as classes from './Photos.style';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';
import axios from '../../../axiosInstance';
import { Post as SinglePost } from '../../../store/reducers/post.reducer';
import axiosMain from 'axios';

function Photos() {
  const state = useSelector((state: RootState) => state.auth);
  const [posts, setPosts] = useState<SinglePost[] | null>(null);
  // GET YOUR POST
  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      try {
        if (!state.user) return;
        const authorId = state.user._id;
        let res = await axios.get(
          `/api/v1/posts?author=${authorId}&limit=5&populate=author&fields=photo`,
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
    <Paper sx={classes.container}>
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

      <Box sx={classes.photoContainer}>
        {posts &&
          posts.map((el, id) => {
            return (
              <img
                key={id}
                style={classes.img}
                src={`${el.photo}`}
                alt='hello'
              />
            );
          })}
      </Box>
    </Paper>
  );
}

export default Photos;
