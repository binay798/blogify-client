import { useState } from 'react';
import {
  Grid,
  Box,
  Stack,
  CircularProgress,
  Typography,
  Pagination,
} from '@mui/material';
import { useEffect } from 'react';
import * as classes from './Homepage.style';
import HomepageLeftSection from './HomepageLeftSection/HomepageLeftSection';
import HomepageRightSection from './HomepageRightSection/HomepageRightSection';
import Post from './../../components/Post/Post';
import AddPost from '../../components/AddPost/AddPost';

import axios from '../../axiosInstance';
import { Post as SinglePost } from '../../store/reducers/post.reducer';
import axiosMain from 'axios';

function Homepage(): JSX.Element {
  const [posts, setPosts] = useState<SinglePost[] | null>(null);
  const [page, setPage] = useState(1);
  const limit = 3;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/v1/posts/count');
        setTotal(res.data.posts);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  useEffect(() => {
    const cancelToken = axiosMain.CancelToken.source();
    (async () => {
      // if (posts && posts.length !== 0) return;

      setLoading(true);
      try {
        let res = await axios.get(
          `/api/v1/posts?limit=${limit}&populate=author&page=${page}`,
          {
            cancelToken: cancelToken.token,
          }
        );
        setPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    })();
    return () => {
      cancelToken.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Grid
      container
      justifyContent='space-between'
      sx={classes.container}
      columnSpacing={{ md: 8, xs: 1 }}
    >
      <Box
        component={Grid}
        item
        md={3}
        sx={{ height: '100%' }}
        display={{ sm: 'none', md: 'block', xs: 'none' }}
      >
        <HomepageLeftSection />
      </Box>
      <Grid sx={{ height: '100%', width: '100%' }} item md={5} sm={8}>
        <Box
          sx={{
            // margin: '0 auto',
            // marginTop: '2rem',
            // overflowY: 'scroll',
            // height: 'calc(100% - 2rem)',
            // width: '75%',
            height: '100%',
            width: '100%',
            padding: '0 0.5rem',
          }}
        >
          <Stack
            sx={{ height: '100%', width: '100%' }}
            direction='column'
            spacing={0}
          >
            <Box
              sx={{
                margin: '0 auto',
                marginTop: '2rem',
                overflowY: 'scroll',
                height: 'calc(100% - 2rem)',
                width: '100%',
                '&::-webkit-scrollbar': {
                  width: 0,
                },
              }}
            >
              <AddPost />

              {/* POSTS */}

              {!posts || loading ? (
                <Stack
                  sx={{ padding: '2rem' }}
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
              ) : null}

              <Stack spacing={8} sx={{ margin: '0 auto', marginTop: '3rem' }}>
                {!loading &&
                  posts &&
                  posts.map((el, id) => {
                    return <Post key={id} data={el} />;
                  })}
              </Stack>
            </Box>
            {/* PAGINATION */}
            <Stack
              direction='row'
              sx={{ padding: '1rem 0' }}
              justifyContent='center'
            >
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                onChange={(_, val) => setPage(val)}
                variant='outlined'
                color='secondary'
              />
            </Stack>
          </Stack>
        </Box>
      </Grid>
      <Box
        component={Grid}
        item
        md={3}
        sm={4}
        sx={{ height: '100%' }}
        display={{ md: 'block', xs: 'none', sm: 'block' }}
      >
        <HomepageRightSection />
      </Box>
    </Grid>
  );
}

export default Homepage;
