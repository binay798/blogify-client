import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Breadcrumbs,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './../../../store/Store';
import * as actionCreators from './../../../store/actionCreators/index';

function EditProfile() {
  const state = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [temporaryAddress, setTemporaryAddress] = useState('');
  const [mobile, setMobile] = useState(0);
  const [highSchool, setHighSchool] = useState('');
  const [college, setCollege] = useState('');

  useEffect(() => {
    setFirstname(state.user?.firstname || '');
    setLastname(state.user?.lastname || '');
    setUsername(state.user?.username || '');
    setEmail(state.user?.email || '');
    setPermanentAddress(state.user?.permanentAddress || '');
    setTemporaryAddress(state.user?.temporaryAddress || '');
    setMobile(state.user?.mobile || 0);
    setHighSchool(state.user?.highSchool || '');
    setCollege(state.user?.college || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user]);

  const [loading, setLoading] = useState(false);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      actionCreators.updateUser(
        {
          firstname,
          lastname,
          username,
          email,
          temporaryAddress,
          permanentAddress,
          mobile,
          highSchool,
          college,
        },
        setLoading
      )
    );
  };
  return (
    <Paper sx={{ padding: '2rem', background: 'var(--appbar)' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' />}
        aria-label='breadcrumb'
        sx={{ marginBottom: '2rem' }}
      >
        {[
          <Link
            style={{ color: 'inherit', textDecoration: 'none' }}
            to='/profile'
            key={1}
          >
            Profile
          </Link>,
          <Typography key={2}>Edit</Typography>,
        ]}
      </Breadcrumbs>
      <Typography variant='h5' gutterBottom color='secondary.light'>
        Edit Profile
      </Typography>
      {/* EDIT CONTAINER */}
      <form onSubmit={submitHandler}>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='Firstname'
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='Lastname'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='Permanent address'
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='Temporary address'
              value={temporaryAddress}
              onChange={(e) => setTemporaryAddress(e.target.value)}
            />
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='Mobile'
              type='number'
              value={mobile}
              onChange={(e) => setMobile(parseInt(e.target.value))}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='High school'
              value={highSchool}
              onChange={(e) => setHighSchool(e.target.value)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              sx={{ width: '100%' }}
              variant='outlined'
              label='College'
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Button
              sx={{ width: '100%' }}
              variant='contained'
              color='secondary'
              type='submit'
              disabled={loading}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default EditProfile;
