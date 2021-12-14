import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Group } from '../../store/reducers/group.reducer';
import { Link } from 'react-router-dom';

interface GroupCardProps {
  data: Group;
}
function GroupCard(props: GroupCardProps) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardMedia
        component='img'
        height='240'
        image={`${props.data.photo}`}
        alt='green iguana'
      />
      <CardContent>
        <Typography variant='h5' component='div'>
          {props.data.name}
        </Typography>
        <Typography color='secondary' variant='caption'>
          26.3k members
        </Typography>
      </CardContent>
      <CardActions>
        <Link
          style={{ width: '100%', color: 'inherit', textDecoration: 'none' }}
          to={`/groups/${props.data._id}`}
        >
          <Button variant='outlined' color='secondary' sx={{ width: '100%' }}>
            View Group
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default GroupCard;
