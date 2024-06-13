import {BookingQueueAction} from '../actions';
import moment from 'moment';
import Utilities from '../../helpers/utils/Utilities';
import {Translations} from '../../constants';
import {t} from 'i18next';
// import DeviceInfo from 'react-native-device-info';

// const isTablet = DeviceInfo.isTablet();
const initialState = {
  selectedDayIsHolyday: false,
  bookingQueueIsLoading: true,
  availabilitydetail:{},
  queueIsLoading: true,
  bookingIsLoading: true,
  selectedDate: Utilities.convertorTimeToBusinessTimeZone(
    moment().toISOString(),
  ),
  specialistAvailable: true,
  _isQueueIsAvailable: true,
  _isRightButtonEnabled: false,
  _rightButtonText: t(Translations.CONFIRM),
  _isBusinessHourDisabled: false,
  _isConsultantBusinessHourDisabled: false,
  // isTablet:true,
};
const reducer = (state = initialState, action) => {
  console.log('Booking queue actions : => action.type', action.type);
  switch (action.type) {
    case BookingQueueAction?.types?.SET_SELECTED_DAY_IS_HOLYDAY: {
      return {
        ...state,
        selectedDayIsHolyday: action?.payload,
      };
    }
    case BookingQueueAction?.types?.BOOKING_QUEUE_IS_LOADING: {
      return {
        ...state,
        bookingQueueIsLoading: action?.payload,
      };
    }
    case BookingQueueAction?.types?.AVAILABILITYINFO: {
      return {
        ...state,
        availabilitydetail: action?.payload,
      };
    }
    case BookingQueueAction?.types?.BOOKING_IS_LOADING: {
      return {
        ...state,
        bookingIsLoading: action?.payload,
      };
    }
    case BookingQueueAction?.types?.QUEUE_IS_LOADING: {
      return {
        ...state,
        queueIsLoading: action?.payload,
      };
    }
    case BookingQueueAction?.types?.SELECTED_DATE: {
      return {
        ...state,
        selectedDate: action?.payload,
      };
    }
    case BookingQueueAction?.types?.SPECIALIST_AVAILABLE: {
      return {
        ...state,
        specialistAvailable: action?.payload,
      };
    }
    case BookingQueueAction?.types?.SET_IS_RIGHT_BUTTON_ENABLED: {
      return {
        ...state,
        _isRightButtonEnabled: action?.payload,
      };
    }
    case BookingQueueAction?.types?.SET_RIGHT_BUTTON_TEXT: {
      return {
        ...state,
        _rightButtonText: action?.payload,
      };
    }
    case BookingQueueAction?.types?.IS_QUEUE_IS_AVAILABLE: {
      return {
        ...state,
        isQueueIsAvailable: action?.payload,
      };
    }
    case BookingQueueAction?.types?.BUSINESS_HOUR_DISABLED: {
      return {
        ...state,
        _isBusinessHourDisabled: action?.payload,
      };
    }

    case BookingQueueAction?.types?.CONSULTANT_BUSINESS_HOUR_DISABLED: {
      return {
        ...state,
        _isConsultantBusinessHourDisabled: action?.payload,
      };
    }
    // case BookingQueueAction?.types?.SET_TABLET_VIEW: {
    //   return {
    //     ...state,
    //     isTablet: action?.payload,
    //   };
    // }
  }
  return state;
};
export default reducer;
