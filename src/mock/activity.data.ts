import { SportType } from '../app/loader/loader.types';
import USER_DATA from './user.data';
// import { MapPoints } from '../map/interface-map';

const ACTIVITY_DATA = {
  id: 1,
  user_id: '1',
  user: USER_DATA,
  distance: '10',
  duration: '01:14:45',
  elevation: 1000,
  sport: SportType.HIKING,
  date: '13/03/21',
  time: '18:39',
  title: 'I am easy like Sunday morning',
  description: 'my training was quite good',
  mapPoints: {
    startPoint: {
      lat: 120,
      lng: 129,
    },
    endPoint: {
      lat: 300,
      lng: 356,
    },
  },
  location: 'string',
};

export default ACTIVITY_DATA;
