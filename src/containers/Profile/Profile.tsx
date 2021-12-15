import { useState, useEffect } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  IconButton,
  Input,
  Modal,
  Paper,
  useMediaQuery,
} from '@mui/material';
import * as classes from './Profile.style';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { blueGrey } from '@mui/material/colors';
import { NavLink, Outlet, Link } from 'react-router-dom';
import styles from './Profile.module.css';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as actionCreators from './../../store/actionCreators/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './../../store/Store';

function Profile(): JSX.Element {
  const state = useSelector((state: RootState) => state.auth);
  const mdScreen = useMediaQuery('(max-width: 960px)');
  const smScreen = useMediaQuery('(max-width: 600px)');

  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFile(undefined);
    setOpen(false);
  };

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFile(files[0]);
    setOpen(true);
  };

  const setActiveClassName = (active: { isActive: boolean }) => {
    if (active.isActive) {
      return `${styles.navBtnActive}`;
    } else {
      return styles.navBtn;
    }
  };
  return (
    <Box>
      {/* TOP SECTION */}
      <Box
        sx={{
          background: 'var(--appbar)',
          padding: mdScreen ? '0 2rem' : '0 20rem',
        }}
      >
        {/* COVER PHOTO SECTION */}
        <Box sx={classes.coverPhoto}>Add</Box>
        {/* USER SUMMARY SECTION */}
        <Box sx={{ padding: '0 4rem', marginBottom: '1rem' }}>
          <Stack
            direction='row'
            sx={{ marginTop: '-3rem', flexWrap: 'wrap' }}
            spacing={4}
            alignItems='flex-end'
          >
            <UploadPhotoModal
              open={open}
              handleOpen={handleOpen}
              handleClose={handleClose}
              file={file}
            />
            {/* USER AVATAR */}
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <label htmlFor='icon-button-file'>
                  <Input
                    sx={{ display: 'none' }}
                    id='icon-button-file'
                    type='file'
                    onChange={fileChangeHandler}
                  />
                  <Avatar sx={{ bgcolor: blueGrey[900] }}>
                    <IconButton
                      color='primary'
                      aria-label='upload picture'
                      component='span'
                    >
                      <CameraAltIcon sx={{ color: blueGrey[100] }} />
                    </IconButton>
                  </Avatar>
                </label>
              }
            >
              <Avatar
                sx={{
                  width: smScreen ? 100 : 170,
                  height: smScreen ? 100 : 170,
                }}
                alt='Travis Howard'
                src={`${state.user?.photo}`}
              />
            </Badge>
            <Stack direction='column'>
              <Typography
                variant={!mdScreen ? 'h4' : 'h5'}
                sx={{ textTransform: 'capitalize' }}
                color={blueGrey[100]}
                component='div'
              >
                {state.user?.firstname} {state.user?.lastname}
              </Typography>
              <Link style={{ textDecoration: 'none' }} to='/profile/edit'>
                <Button variant='contained' color='primary'>
                  Edit Profile
                </Button>
              </Link>
            </Stack>
          </Stack>
          <Divider sx={{ borderColor: 'var(--divider)', marginTop: '2rem' }} />
        </Box>

        {/* TAB BAR SECTION */}
        <Stack direction='row' sx={{ padding: '0 4rem' }} spacing={4}>
          <NavLink
            className={(active) => setActiveClassName(active)}
            to='/profile'
          >
            Posts
          </NavLink>
          <NavLink
            className={(active) => setActiveClassName(active)}
            color='secondary'
            to='/profile/about'
          >
            About
          </NavLink>
          <NavLink
            className={(active) => setActiveClassName(active)}
            to='/profile/photos'
          >
            Photos
          </NavLink>
        </Stack>
      </Box>
      {/* BOTTOM SECTION */}
      <Box
        sx={{
          background: 'var(--body)',
          padding: mdScreen ? '0 2rem' : '2rem 24rem',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Profile;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'var(--appbar)',
  boxShadow: 24,
  p: 4,
  color: 'white',
};
interface UploadPhoto {
  open: boolean;
  handleClose(): void;
  handleOpen(): void;
  file: File | undefined;
}

function UploadPhotoModal(props: UploadPhoto): JSX.Element {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      setImgSrc(reader.result as string);
    });
    if (props.file) {
      reader.readAsDataURL(props.file);
    }
  }, [props.file]);

  const submitHandler = () => {
    if (!props.file) return;
    dispatch(actionCreators.updateProfilePic(props.file as File, setLoading));
  };
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Paper sx={style}>
        <form>
          <Stack direction='column' spacing={2}>
            <img
              src={imgSrc}
              alt='profile'
              style={{
                display: 'block',
                height: '25rem',
                width: '100%',
                objectFit: 'contain',
                margin: '0 auto',
                borderRadius: '4px',
              }}
            />
            <Button
              sx={{ width: '100%' }}
              variant='contained'
              color='secondary'
              startIcon={<FileUploadIcon />}
              onClick={submitHandler}
              disabled={loading}
            >
              Upload
            </Button>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
}
