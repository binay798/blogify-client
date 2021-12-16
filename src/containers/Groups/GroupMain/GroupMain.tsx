import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Pagination,
  Stack,
  useMediaQuery,
} from '@mui/material';
import GroupCard from '../../../components/GroupCard/GroupCard';
import { useDispatch } from 'react-redux';
import axios from '../../../axiosInstance';
// import * as Actions from '../../../store/actions/index';
// import { RootState } from '../../../store/Store';
import CircularLoading from '../../../components/CircularLoading/CircularLoading';

import { Group } from '../../../store/reducers/group.reducer';
// import { baseUrl } from '../../axiosInstance';
const groupContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(30rem, 1fr))',
  gap: '3rem',
  minHeight: '23.8rem',
};

function GroupMain(): JSX.Element {
  const dispatch = useDispatch();
  // const state = useSelector((state: RootState) => state.group);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [page, setPage] = useState(1);
  const limit = 2;
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const mdScreen = useMediaQuery('(max-width:600px)');

  // COUNT DOCUMENTS
  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get('/api/v1/groups/count');
        setTotal(res.data.groups);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      // if (state.groups.length !== 0) return;
      setLoading(true);
      try {
        let res = await axios.get(`/api/v1/groups?page=${page}&limit=${limit}`);

        setGroups(res.data.groups);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page]);

  return (
    <Box
      sx={{
        padding: !mdScreen ? '2rem 8rem' : '2rem',
        overflowY: 'scroll',
        height: '100%',
        width: '100%',
      }}
    >
      <Typography
        color='secondary.light'
        style={{ fontWeight: 600 }}
        variant='h5'
      >
        Suggested for you
      </Typography>
      <Typography
        color='secondary'
        style={{ marginBottom: '3rem' }}
        variant='body2'
      >
        Groups you might be interested in
      </Typography>
      <Stack direction='row' justifyContent='center'>
        {loading && <CircularLoading />}
      </Stack>
      <Box sx={groupContainer}>
        {!loading &&
          groups &&
          groups.map((el, id) => {
            return <GroupCard key={id} data={el} />;
          })}
      </Box>
      <Stack sx={{ padding: '2rem 0' }} direction='row' justifyContent='center'>
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color='primary'
        />
      </Stack>
    </Box>
  );
}

export default GroupMain;
