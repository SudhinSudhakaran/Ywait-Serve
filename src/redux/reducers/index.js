import {combineReducers} from 'redux';
import BookingQueueReducer from './BookingQueueReducer';
import tabletReducer from './tabletReducer';
export default combineReducers({
  BookingQueueState: BookingQueueReducer,
  tablet: tabletReducer,
});
