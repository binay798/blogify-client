import { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';
import axios from '../../../axiosInstance';
import { Group } from '../../../store/reducers/group.reducer';
import axiosMain from 'axios';

function HomepageLeftSection(): JSX.Element {
  const state = useSelector((state: RootState) => state.auth);
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
    const cancelReq = axiosMain.CancelToken.source();
    (async () => {
      try {
        const res = await axios.get('/api/v1/groups?limit=4', {
          cancelToken: cancelReq.token,
        });
        setGroups(res.data.groups);
      } catch (err) {
        console.log(err);
      }
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
      <List>
        <Link to='profile' style={{ color: 'inherit', textDecoration: 'none' }}>
          <ListItemButton>
            <ListItemIcon>
              <Avatar src={`${state.user?.photo}`} alt='B' />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant='body1'
                  sx={{ textTransform: 'capitalize' }}
                >
                  {state.user?.firstname} {state.user?.lastname}
                </Typography>
              }
            />
          </ListItemButton>
        </Link>

        <Divider sx={{ borderColor: 'var(--divider)' }} />
        <Link style={{ color: 'inherit', textDecoration: 'none' }} to='/groups'>
          <ListItemButton>
            <ListItemIcon>
              <GroupsIcon sx={{ color: 'var(--light)', fontSize: '3rem' }} />
            </ListItemIcon>
            <ListItemText primary='Groups' />
          </ListItemButton>
        </Link>
        <Link
          style={{ color: 'inherit', textDecoration: 'none' }}
          to='/groups/create'
        >
          <ListItemButton>
            <ListItemIcon>
              <GroupAddIcon sx={{ color: 'var(--light)', fontSize: '3rem' }} />
            </ListItemIcon>
            <ListItemText primary='Create Group' />
          </ListItemButton>
        </Link>
        <Link style={{ color: 'inherit', textDecoration: 'none' }} to='/users'>
          <ListItemButton>
            <ListItemIcon>
              <PeopleAltIcon sx={{ color: 'var(--light)', fontSize: '3rem' }} />
            </ListItemIcon>
            <ListItemText primary='All Users' />
          </ListItemButton>
        </Link>
      </List>

      {/* RECENTELY ADDED GROUPS */}
      <List
        sx={{ width: '100%' }}
        component='nav'
        aria-labelledby='nested-list-subheader'
      >
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
          Recently added groups
        </Typography>
        {groups &&
          groups.map((el, id) => {
            return (
              <Link
                to={`/groups/${el._id}`}
                key={id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemButton key={id}>
                  <ListItemIcon>
                    <Avatar src={`${el.photo}`} alt='A' />
                  </ListItemIcon>
                  <ListItemText primary={el.name} />
                </ListItemButton>
              </Link>
            );
          })}
        <Link
          to={'/groups'}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <Button sx={{ margin: '2rem' }} variant='contained'>
            Explore more groups
          </Button>
        </Link>
      </List>
    </Box>
  );
}

export default HomepageLeftSection;
