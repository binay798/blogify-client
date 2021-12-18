import { useState, useEffect, Suspense } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Typography,
  Box,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { blue } from '@mui/material/colors';
import { Post as SinglePost } from '../../store/reducers/post.reducer';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { User } from '../../store/reducers/auth.reducer';
import axios from '../../axiosInstance';
import axiosMain from 'axios';
import CircularLoading from '../CircularLoading/CircularLoading';

interface PostProps {
  data: SinglePost;
}
function Post(props: PostProps): JSX.Element {
  const [post, setPost] = useState<SinglePost>(props.data);
  const state = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCommentBox, setOpenCommentBox] = useState(false);

  useEffect(() => {
    if (!state.user) return;
    const existUser = post.likes.find((el) => el === state.user?._id);
    if (existUser) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.likes]);

  const modifyLike = async () => {
    setLoading(true);
    try {
      let res = await axios.patch<{ post: SinglePost }>(
        `api/v1/posts/${post._id}/modify-like/${isLiked ? 'dislike' : 'like'}`
      );
      setPost(res.data.post);
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={`${post.author.photo}`}
            sx={{ bgcolor: 'red' }}
            aria-label='recipe'
          >
            R
          </Avatar>
        }
        action={
          <IconButton aria-label='settings'>
            <MoreVertIcon />
          </IconButton>
        }
        title={`${post.author.firstname} ${post.author.lastname}`}
        subheader={moment(post.createdAt).fromNow()}
      />
      <CardMedia
        component='img'
        sx={{ width: '100%', objectFit: 'contain' }}
        image={`${post.photo}`}
        alt='Paella dish'
      />
      <CardContent>
        <Typography variant='body2' color='text.secondary'>
          {post.description}
        </Typography>
      </CardContent>
      <Stack
        direction='row'
        sx={{ padding: '0 2rem' }}
        justifyContent='space-between'
        alignItems='center'
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar sx={{ width: 24, height: 24, backgroundColor: blue[500] }}>
            <ThumbUpOutlinedIcon
              color='action'
              sx={{ width: 18, height: 18 }}
            />
          </Avatar>
          <Typography variant='body2' color='text.secondary'>
            {post.likes.length} likes
          </Typography>
        </Stack>

        <Typography variant='body2' color='text.secondary'>
          <Button onClick={() => setOpenCommentBox((prev) => !prev)}>
            1 comment
          </Button>
        </Typography>
      </Stack>
      {/* LIKE AND COMMENT  */}
      <Box sx={{ padding: '2rem' }}>
        <Divider sx={{ borderColor: 'var(--divider)' }} />
        <Stack
          direction='row'
          justifyContent='space-evenly'
          sx={{ margin: '.5rem 3rem' }}
        >
          <Button
            onClick={modifyLike}
            startIcon={isLiked ? <ThumbUpAltIcon /> : <ThumbUpOutlinedIcon />}
            sx={{ flex: 1 }}
            disabled={loading}
          >
            {isLiked ? 'Liked' : 'Like'}
          </Button>
          <Button
            startIcon={<ChatBubbleOutlineOutlinedIcon />}
            sx={{ flex: 1 }}
            onClick={() => setOpenCommentBox((prev) => !prev)}
          >
            Comment
          </Button>
        </Stack>
        <Divider sx={{ borderColor: 'var(--divider)' }} />
      </Box>

      {openCommentBox ? (
        <Suspense fallback='loading...'>
          <CommentBox postId={post._id} />
        </Suspense>
      ) : null}
    </Card>
  );
}

interface CommentState {
  author: User;
  text: string;
  createdAt: string;
}

interface CommentProps {
  postId: string;
}

function CommentBox(props: CommentProps): JSX.Element {
  const state = useSelector((state: RootState) => state.auth);
  const group = useSelector((state: RootState) => state.group);
  const [comments, setComments] = useState<CommentState[] | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [createCommentLoading, setCreateCommentLoading] = useState(false);

  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      try {
        setLoading(true);

        let res = await axios.get(`/api/v1/posts/${props.postId}/comments`, {
          cancelToken: cancelReq.token,
        });
        setComments([...res.data.comments]);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();

    return () => {
      cancelReq.cancel();
    };
  }, [props.postId, group.selectedGroup]);

  const createComment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (text === '') return;
    setCreateCommentLoading(true);
    try {
      let res = await axios.post(`/api/v1/posts/${props.postId}/comments`, {
        text,
      });
      setText('');
      setComments([...res.data.comments]);
    } catch (err) {
      console.log(err);
    }
    setCreateCommentLoading(false);
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <form onSubmit={createComment}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Avatar src={`${state.user && state.user.photo}`} alt='A' />
          <TextField
            variant='outlined'
            sx={{ width: '100%' }}
            label='Write comment...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              endAdornment: createCommentLoading ? (
                <InputAdornment position='end'>
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Stack>
      </form>
      {/* LOADING */}
      {loading && (
        <Box sx={{ paddingTop: '2rem' }}>
          <CircularLoading />
        </Box>
      )}

      {/* NO COMMENTS */}
      {comments && comments.length === 0 && (
        <Typography
          color='secondary'
          variant='caption'
          sx={{ marginTop: '1rem' }}
          align='center'
          component='div'
        >
          No comments
        </Typography>
      )}

      {/* COMMENTS CONTAINER */}
      {comments &&
        comments.length !== 0 &&
        comments.map((el, id) => {
          return (
            <Stack
              key={id}
              sx={{ marginTop: '2rem', padding: '0 2rem 0 6rem' }}
              direction='column'
              spacing={1}
            >
              <Stack direction='row' spacing={2} alignItems='center'>
                <Avatar
                  src={`${el.author.photo}`}
                  alt='A'
                  sx={{ width: 24, height: 24 }}
                />
                <Box
                  sx={{
                    padding: '1rem 2rem',
                    background: 'var(--appbar)',
                    borderRadius: '1rem',
                    flex: 1,
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{ fontWeight: 600 }}
                    color='secondary.light'
                  >
                    {el.author.firstname} {el.author.lastname}{' '}
                    <span style={{ fontSize: '1rem', color: 'gray' }}>
                      {moment(el.createdAt).fromNow()}
                    </span>
                  </Typography>

                  <Typography variant='body2' color='secondary.light'>
                    {el.text}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          );
        })}
    </Box>
  );
}
export default Post;
