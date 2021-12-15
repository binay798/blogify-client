import { useState } from 'react';

import {
  Paper,
  Box,
  Stack,
  Breadcrumbs,
  Typography,
  TextField,
  FormLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Input,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import * as actionCreators from '../../../store/actionCreators/index';
import { useDispatch } from 'react-redux';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const paper = {
  padding: '2rem',
  background: 'var(--appbar)',
};

const addGroupPhoto = {
  border: '1px dashed gray',
  display: 'flex',
  width: '25rem',
  height: '25rem',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  marginBottom: '2rem',
};

const img = {
  width: '25rem',
  objectFit: 'contain' as 'contain',
  display: 'block',
};
function CreateGroup(): JSX.Element {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('public');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [imgSrc, setImgSrc] = useState('');
  const smScreen = useMediaQuery('(max-width: 600px)');

  const radioChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFile(files[0]);
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      setImgSrc(reader.result as string);
    });
    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  };

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      name !== '' &&
      description !== '' &&
      location !== '' &&
      file !== undefined
    ) {
      dispatch(
        actionCreators.createGroup(
          { name, description, location, status, photo: file },
          setLoading
        )
      );
    }
  };
  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        padding: smScreen ? '0rem' : '2rem',
        '&::-webkit-scrollbar': {
          width: 0,
        },
      }}
    >
      <Paper sx={paper}>
        {/* BREADCRUMBS */}
        <Stack direction='row' sx={{ marginBottom: '1rem' }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'
          >
            [
            <Link
              style={{ color: 'inherit', textDecoration: 'none' }}
              to='/groups'
            >
              Groups
            </Link>
            , <Typography>Create</Typography>]
          </Breadcrumbs>
        </Stack>
        {/* CREATE GROUP HEADING */}
        <Typography variant='h5' gutterBottom color='secondary.light'>
          Create Group
        </Typography>
        {/* MAIN FORM CONTAINER */}
        <form onSubmit={submitHandler}>
          <Stack direction='row' spacing={3} sx={{ flexWrap: 'wrap' }}>
            <Stack direction='column' spacing={2} sx={{ flex: 1 }}>
              <TextField
                sx={{ width: '100%' }}
                variant='outlined'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                sx={{ width: '100%' }}
                variant='outlined'
                label='Location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <TextField
                sx={{ width: '100%' }}
                variant='outlined'
                label='Description'
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Visibility</FormLabel>
                <RadioGroup
                  row
                  aria-label='gender'
                  name='row-radio-buttons-group'
                  onChange={radioChangeHandler}
                  value={status}
                >
                  <FormControlLabel
                    value='public'
                    control={<Radio />}
                    label='Public'
                  />
                  <FormControlLabel
                    value='private'
                    control={<Radio />}
                    label='Private'
                  />
                </RadioGroup>
              </FormControl>
              {/* UPLOADED IMAGE */}
              {imgSrc && <img style={img} src={imgSrc} alt='uploaded' />}
            </Stack>

            <label style={addGroupPhoto} htmlFor='icon-button-file'>
              <Input
                sx={{ display: 'none' }}
                id='icon-button-file'
                type='file'
                onChange={fileChangeHandler}
              />
              <IconButton
                color='primary'
                aria-label='upload picture'
                component='span'
              >
                <PhotoCamera />
              </IconButton>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                Add Photo
              </Typography>
            </label>
          </Stack>
          <Button
            disabled={loading}
            startIcon={<AddIcon />}
            variant='contained'
            type='submit'
          >
            Create Group
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateGroup;
