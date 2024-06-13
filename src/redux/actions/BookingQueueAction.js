const types = {
  SET_SELECTED_DAY_IS_HOLYDAY: 'SET_SELECTED_DAY_IS_HOLYDAY',
  SELECTED_DATE: 'SELECTED_DATE',
  SPECIALIST_AVAILABLE: 'SPECIALIST_AVAILABLE',
  IS_QUEUE_IS_AVAILABLE: 'IS_QUEUE_IS_AVAILABLE',
  SET_IS_RIGHT_BUTTON_ENABLED: 'SET_IS_RIGHT_BUTTON_ENABLED',
  SET_RIGHT_BUTTON_TEXT: 'SET_RIGHT_BUTTON_TEXT',
  BUSINESS_HOUR_DISABLED: 'BUSINESS_HOUR_DISABLED',
  CONSULTANT_BUSINESS_HOUR_DISABLED: 'CONSULTANT_BUSINESS_HOUR_DISABLED',
  BOOKING_QUEUE_IS_LOADING: 'BOOKING_QUEUE_IS_LOADING',
  BOOKING_IS_LOADING: 'BOOKING_IS_LOADING',
  QUEUE_IS_LOADING: 'QUEUE_IS_LOADING',
  AVAILABILITYINFO:'AVAILABILITYINFO',
  // SET_TABLET_VIEW:'SET_TABLET_VIEW',
};

const setSelectedDayIsHolyDay = info => {
  return {
    type: types.SET_SELECTED_DAY_IS_HOLYDAY,
    payload: info,
  };
};
const setBookingQueueIsLoading = isLoading => {
  return {
    type: types.BOOKING_QUEUE_IS_LOADING,
    payload: isLoading,
  };
};
const setAvailabilityInfo = isLoading => {
  return {
    type: types.AVAILABILITYINFO,
    payload: isLoading,
  };
};
const setBookingIsLoading = isLoading => {
  return {
    type: types.BOOKING_IS_LOADING,
    payload: isLoading,
  };
};
const setQueueIsLoading = isLoading => {
  return {
    type: types.QUEUE_IS_LOADING,
    payload: isLoading,
  };
};

const setSelectedDate = date => {
  return {
    type: types.SELECTED_DATE,
    payload: date,
  };
};
const setSpecialistAvailable = _available => {
  return {
    type: types.SPECIALIST_AVAILABLE,
    payload: _available,
  };
};
const _setRightButtonEnabled = _status => {
  return {
    type: types.SET_IS_RIGHT_BUTTON_ENABLED,
    payload: _status,
  };
};
const _setRightButtonText = _text => {
  return {
    type: types.SET_RIGHT_BUTTON_TEXT,
    payload: _text,
  };
};
const _setIsQueueIsAvailable = _data => {
  return {
    type: types.IS_QUEUE_IS_AVAILABLE,
    payload: _data,
  };
};
const _setBusinessHourDisabled = data => {
  return {
    type: types.BUSINESS_HOUR_DISABLED,
    payload: data,
  };
};
const _setConsultantBusinessHourDisabled = data => {
  return {
    type: types.CONSULTANT_BUSINESS_HOUR_DISABLED,
    payload: data,
  };
};
// const isTablet = data => {
//   return {
//     type: types.SET_TABLET_VIEW,
//     payload: data,
//   };
// };
export default {
  types,
  setSelectedDate,
  _setRightButtonText,
  _setRightButtonEnabled,
  setSpecialistAvailable,
  _setIsQueueIsAvailable,
  setSelectedDayIsHolyDay,
  setBookingQueueIsLoading,
  setAvailabilityInfo,
  setQueueIsLoading,
  setBookingIsLoading,
  _setBusinessHourDisabled,
  _setConsultantBusinessHourDisabled,
  // isTablet,
};
