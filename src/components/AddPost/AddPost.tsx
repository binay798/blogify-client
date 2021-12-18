import React, { useState } from 'react';
import {
  Avatar,
  Divider,
  Paper,
  Stack,
  Modal,
  Typography,
  IconButton,
  ListItemText,
  TextField,
  Input,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import * as classes from './AddPost.style';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { User } from '../../store/reducers/auth.reducer';
import { Post } from '../../store/reducers/post.reducer';
import axios from '../../axiosInstance';
import initializeState from '../../utils/initializeState';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 450,
  width: '100%',
  bgcolor: 'var(--appbar)',
  boxShadow: 24,
  p: 2,
};

interface AddPostProps {
  addPost(post: Post): void;
}

function AddPost(props: AddPostProps): JSX.Element {
  const state = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const smScreen = useMediaQuery('(max-width: 600px)');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Paper
      sx={{ ...classes.addPostPaper, padding: smScreen ? '1rem' : '3rem' }}
    >
      <Stack spacing={4} direction='row'>
        <Avatar src={`${state.user?.photo}`} />

        <Box onClick={handleOpen} sx={classes.postBtn}>
          <Typography variant={smScreen ? 'body2' : 'body1'} color='secondary'>
            What's on your mind {state.user?.firstname}?
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--divider)', marginTop: '2rem' }} />

      {/* CREATE POST MODAL */}
      <CreatePostModal
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        user={state.user}
        addPost={props.addPost}
      />
    </Paper>
  );
}

interface CreatePostModalProps {
  open: boolean;
  handleOpen(): void;
  handleClose(): void;
  user: User | null;
  addPost(post: Post): void;
}

function CreatePostModal(props: CreatePostModalProps): JSX.Element {
  const [file, setFile] = useState<File | string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgSrc, setImgSrc] = useState<string>();
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const reader = new FileReader();
    if (!files) return;
    setFile(files[0]);

    reader.addEventListener('load', function () {
      setImgSrc(reader.result as string);
    });
    if (files) {
      reader.readAsDataURL(files[0]);
    }
  };

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (title === '' || description === '' || file === '') return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('image', file);

      let res = await axios.post<{ post: Post }>('/api/v1/posts', fd);
      props.addPost(res.data.post);
      initializeState([setTitle, setFile, setDescription, setImgSrc]);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Paper sx={style}>
        <Typography
          id='modal-modal-title'
          color='secondary.light'
          variant='h5'
          component='h1'
          align='center'
          gutterBottom
        >
          Create Post
        </Typography>
        <Divider sx={{ borderColor: 'var(--divider)', marginBottom: '2rem' }} />

        {/* CLOSE BUTTON */}
        <IconButton
          sx={{ position: 'absolute' as 'absolute', top: 10, right: 10 }}
          onClick={props.handleClose}
        >
          <CloseIcon />
        </IconButton>
        {/* USER DETAIL */}
        <Stack direction='row' spacing={2} sx={{ marginBottom: '1rem' }}>
          <Avatar src={`${props.user?.photo}`} alt='person' />
          <ListItemText
            primary={
              <Typography
                variant='body1'
                component='div'
                sx={{ fontWeight: 600 }}
              >
                {props.user?.firstname} {props.user?.lastname}
              </Typography>
            }
            secondary={
              <Typography variant='caption' component='div'>
                <Stack direction='row' spacing={1} alignItems='center'>
                  <PublicIcon sx={{ width: 20, height: 20 }} />
                  <span>Public</span>
                </Stack>
              </Typography>
            }
          />
        </Stack>

        {/* FORM */}
        <form onSubmit={submitHandler}>
          <Stack direction='column' spacing={2}>
            <TextField
              label='Title'
              variant='outlined'
              sx={{ width: '100%' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              id='standard-multiline-static'
              label='What is on your mind Binay? '
              multiline
              rows={4}
              variant='outlined'
              sx={{ width: '100%' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Stack direction='row' alignItems='center'>
              <Typography
                color='secondary'
                variant='body1'
                sx={{ fontWeight: 600 }}
              >
                Add Photo:
              </Typography>
              <label htmlFor='icon-button'>
                <Input
                  sx={{ display: 'none' }}
                  id='icon-button'
                  type='file'
                  onChange={fileChangeHandler}
                />
                <IconButton
                  color='primary'
                  aria-label='upload picture'
                  component='span'
                >
                  <AddAPhotoIcon />
                </IconButton>
              </label>
            </Stack>
            {/* SELECTED IMAGE */}
            {imgSrc && (
              <img
                src={imgSrc}
                style={{
                  display: 'block',
                  height: '10rem',
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
                alt='selected'
              />
            )}
            {/* BUTTON */}
            <Button
              disabled={loading}
              variant='contained'
              type='submit'
              color='secondary'
            >
              Create Post
            </Button>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
}

export default AddPost;
