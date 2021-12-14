import { useEffect, useState } from 'react';
import {
  Box,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
} from '@mui/material';
import axios from '../../../axiosInstance';
import { User } from '../../../store/reducers/auth.reducer';
import axiosMain from 'axios';
import { Link } from 'react-router-dom';

function HomepageRightSection() {
  const [users, setUsers] = useState<User[] | null>(null);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      // setLoading(true);
      try {
        const res = await axios.get('/api/v1/users?limit=10', {
          cancelToken: cancelReq.token,
        });
        setUsers(res.data.users);
      } catch (err) {
        console.log(err);
      }
      // setLoading(false);
    })();
    return () => {
      cancelReq.cancel();
    };
  }, []);
  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {/* PEOPLE YOU MAY KNOW */}
      <List>
        <Typography
          variant='subtitle1'
          sx={{
            color: 'var(--heading-primary)',
            fontWeight: '600',
            marginLeft: '1rem',
            marginBottom: '1rem',
          }}
          component='div'
        >
          People you may know
        </Typography>
        {!users && (
          <Typography variant='body2' color='secondary' gutterBottom>
            Loading...
          </Typography>
        )}
        {users &&
          users.map((el, id) => {
            return (
              <Link
                key={id}
                to={`/${el.username}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Avatar src={`${el.photo}`} alt='B' />
                  </ListItemIcon>
                  <ListItemText primary={`${el.firstname} ${el.lastname}`} />
                </ListItemButton>
              </Link>
            );
          })}
        <Link to='/users' style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button sx={{ width: '95%' }} variant='contained'>
            See more users
          </Button>
        </Link>
      </List>
    </Box>
  );
}

export default HomepageRightSection;
