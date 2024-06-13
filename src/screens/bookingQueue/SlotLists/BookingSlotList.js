import React, {useState, useEffect, Fragment, useLayoutEffect} from 'react';
import {
  View,
  FlatList,
  Platform,
  StyleSheet,
  I18nManager,
  KeyboardAvoidingView,
  LogBox,
} from 'react-native';

import ContentLoader, {Rect} from 'react-content-loader/native';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../constants';
import {t} from 'i18next';
import moment from 'moment';
import Utilities from '../../../helpers/utils/Utilities';
import DataManager from '../../../helpers/apiManager/DataManager';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import StorageManager from '../../../helpers/storageManager/StorageManager';
import BookingSlotDataCell from '../BookingSlotDataCell';
import BookingFullEmptyComponent from '../emptyScreens/BookingFullEmptyComponent';
import HollyDayEmptyComponent from '../emptyScreens/HollyDayEmptyComponent';
import {useDispatch, useSelector} from 'react-redux';
import {BookingQueueAction} from '../../../redux/actions';
import SpecialistEmptyComponent from '../emptyScreens/SpecialistEmptyComponent';
import {BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE} from '../../../helpers/enums/Enums';
const BookingSlotList = props => {
  const {
    index,
    module,
    selectedServicesId,
    isSelectedDayToday,
    appointmentDetails,
    selectedServingUserId,
    isServingUserSelected,
    setIsQueueSlotsAvailable,
    setIsThereAnyCanBookSlots,
    didFoundNextDate,
    didSelectBookingSlot,
    selectedServingUserInfo,
  } = props;

  const dispatch = useDispatch();
  const [
    isInitialRedirectionAvailableDate,
    setIsInitialRedirectionAvailableDate,
  ] = useState(true);
  const [bookingSlotList, setBookingSlotList] = useState([]);
  const [selectedBookingSlotIndex, setSetSelectedBookingSlotIndex] = useState();
  const [isBookingFull, setIsBookingFull] = useState(false);
  const [emptyScreenType, setEmptyScreenType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    selectedDayIsHolyday,
    bookingQueueIsLoading,
    bookingIsLoading,
    queueIsLoading,
    selectedDate,
    availabilitydetail,
    specialistAvailable,
    _isBusinessHourDisabled,
    _isConsultantBusinessHourDisabled,
  } = useSelector(state => state?.BookingQueueState);
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  useEffect(() => {
    if (index === 0) {
      setSetSelectedBookingSlotIndex('');
      getBusinessDetails(selectedDate, selectedServingUserId);
    }
    setBookingSlotList('');
  }, [selectedDate, index,availabilitydetail]);
  useLayoutEffect(() => {
    console.log(
      'useLayOut effect Booking slot _isBusinessHourDisabled ',
      _isBusinessHourDisabled,
      '_isConsultantBusinessHourDisabled',
      _isConsultantBusinessHourDisabled,
    );
    dispatch(BookingQueueAction.setBookingQueueIsLoading(true));

    dispatch(BookingQueueAction.setBookingIsLoading(true));
    return () => {
      dispatch(BookingQueueAction.setBookingIsLoading(true));
    };
  }, [selectedDate, index]);
  const dummyNotArrivedListData = [
    {
      id: '1',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '2',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '3',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '4',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '5',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '6',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '7',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '8',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '9',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '10',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '11',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '12',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '13',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '14',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '15',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '16',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '17',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '18',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '19',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '20',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '21',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '22',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '23',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
    {
      id: '24',
      dateTo: '2022-02-15T10:35:00.000Z',
      canBook: true,
      dateFrom: '2022-02-15T10:30:00.000Z',
      name: 'Free-slot',
    },
  ];

  const isThereAnyCanBookSlots = timeSlots => {
    const canBookSlotIndex = timeSlots.findIndex(
      item => item?.canBook === true,
    );
    if (canBookSlotIndex !== -1) {
      return true;
    } else {
      return false;
    }
  };
  /**
      *
      * Purpose: check booking configurations
      * Created/Modified By: Vijin
      * Created/Modified Date: 17 Feb 2022
      * Steps:
         
   */
  const checkBookingSlotsWithBusinessConfigurations = (
    timeSlots,
    isQueueSlotsAvailable,
  ) => {
    let timeSlotIsEmpty = false;
    if (timeSlots?.length > 0) {
      timeSlotIsEmpty = false;
    } else {
      timeSlotIsEmpty = true;
    }
    console.log(':::::::::', timeSlots);
    console.log(':::::::::', isQueueSlotsAvailable);
    setIsQueueSlotsAvailable(isQueueSlotsAvailable);
    dispatch(BookingQueueAction._setIsQueueIsAvailable(isQueueSlotsAvailable));
    // console.log('isQueueSlotsAvailable<-><-><->', isQueueSlotsAvailable);
    if (isSelectedDayToday === true) {
      if (isThereAnyCanBookSlots(timeSlots) === false) {
        dispatch(BookingQueueAction._setRightButtonEnabled(false));
      } else if (
        Globals.BUSINESS_DETAILS?.bookingSettings?.allowCurrentDayBooking ===
          true &&
        isThereAnyCanBookSlots(timeSlots) === true
      ) {
        setIsThereAnyCanBookSlots(true);

        // dispatch(BookingQueueAction._setRightButtonEnabled(true));

        dispatch(
          BookingQueueAction._setRightButtonText(
            module === 'reschedule'
              ? t(Translations.RESCHEDULE)
              : t(Translations.CONFIRM),
          ),
        );

        setBookingSlotList(timeSlots);
      } else {
        if (
          Globals.BUSINESS_DETAILS?.enableQueue === true &&
          Globals.BUSINESS_DETAILS?.pricePlan_id?.enableQueue === true &&
          isQueueSlotsAvailable
        ) {
          setIsThereAnyCanBookSlots(false);

          dispatch(BookingQueueAction._setRightButtonEnabled(true));

          setBookingSlotList([]);
        } else {
          setIsThereAnyCanBookSlots(false);

          dispatch(BookingQueueAction._setRightButtonEnabled(false));

          dispatch(
            BookingQueueAction._setRightButtonText(
              module === 'reschedule'
                ? t(Translations.RESCHEDULE)
                : t(Translations.CONFIRM),
            ),
          );

          setBookingSlotList([]);
        }
      }
    } else if (isThereAnyCanBookSlots(timeSlots)) {
      setIsThereAnyCanBookSlots(true);
      dispatch(BookingQueueAction._setRightButtonEnabled(false));

      dispatch(
        BookingQueueAction._setRightButtonText(
          module === 'reschedule'
            ? t(Translations.RESCHEDULE)
            : t(Translations.CONFIRM),
        ),
      );

      setBookingSlotList(timeSlots);
    } else {
      if (
        Globals.BUSINESS_DETAILS?.enableQueue === true &&
        Globals.BUSINESS_DETAILS?.pricePlan_id?.enableQueue === true &&
        Globals.BUSINESS_DETAILS?.waitlistSettings?.allowFutureDayQueue ===
          true &&
        isQueueSlotsAvailable
      ) {
        setIsThereAnyCanBookSlots(false);
        dispatch(BookingQueueAction._setRightButtonEnabled(false));

        setBookingSlotList([]);
      } else {
        setIsThereAnyCanBookSlots(false);
        dispatch(BookingQueueAction._setRightButtonEnabled(false));

        dispatch(
          BookingQueueAction._setRightButtonText(
            module === 'reschedule'
              ? t(Translations.RESCHEDULE)
              : t(Translations.CONFIRM),
          ),
        );

        setBookingSlotList([]);
      }
    }
setTimeout(() => {
  dispatch(BookingQueueAction.setBookingIsLoading(false));
  dispatch(BookingQueueAction.setBookingQueueIsLoading(false))
}, 1000);
    configEmptyComponent(timeSlotIsEmpty);

    // console.log('<><><><><><> Api loaded 1 <><><><><><>');
  };

  //API CALLS
  /**
       *
       * Purpose: Get selected business details
       * Created/Modified By: Jenson
       * Created/Modified Date: 28 Dec 2021
       * Steps:
           1.fetch business details from API and append to state variable
    */
  const getBusinessDetails = (_selectedDate, serveUserId) => {
    dispatch(BookingQueueAction.setBookingQueueIsLoading(true));
    dispatch(BookingQueueAction.setBookingIsLoading(true));
    DataManager.getBusinessDetails(Globals.BUSINESS_ID).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            if (data?.objects !== undefined && data?.objects !== null) {
              //Save business info to local storage
              StorageManager.saveBusinessDetails(data?.objects);
              Globals.BUSINESS_DETAILS = data?.objects;
              Globals.BUSINESS_ID = data?.objects?._id;

              //Update themes
              if (
                data?.objects?.primaryColor !== undefined &&
                data.objects.primaryColor !== null &&
                data.objects.primaryColor !== ''
              ) {
                Colors.PRIMARY_COLOR = data.objects.primaryColor;
              } else {
                Colors.PRIMARY_COLOR = '#FF5264';
              }
              if (
                data?.objects?.secondaryColor !== undefined &&
                data.objects.secondaryColor !== null &&
                data.objects.secondaryColor !== ''
              ) {
                Colors.SECONDARY_COLOR = data.objects.secondaryColor;
              } else {
                Colors.SECONDARY_COLOR = '#5F73FC';
              }
              if (isServingUserSelected) {
                performGetBookingSlotList(_selectedDate, serveUserId);
              } else {
                performGetAllBookingSlots(_selectedDate);
              }
            }
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );

            setTimeout(() => {
              dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
            }, 1000);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );

          setTimeout(() => {
            dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
          }, 1000);
        }
      },
    );
  };

  /**
               *
               * Purpose: Business listing
               * Created/Modified By: Jenson
               * Created/Modified Date: 27 Dec 2021
               * Steps:
                   1.fetch business list from API and append to state variable
       */

  const performGetBookingSlotList = (date, serveUserId) => {
    // let dateSelected = Utilities.appendBusinessTimeZoneToDate(date);

    let startDate =
      moment(date).format('dddd D MMMM YYYY 00:00:00 ') +
      Utilities.getBusinessTimeZoneOffset();
    let endDate =
      moment(date).format('dddd D MMMM YYYY 11:59:59 ') +
      Utilities.getBusinessTimeZoneOffset();

    var body = {};
    if (Utilities.isServiceBasedBusiness()) {
      body = {
        [APIConnections.KEYS.SERVING_USER_ID]:
          serveUserId !== undefined ? serveUserId : Globals.USER_DETAILS._id,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_DETAILS._id,
        [APIConnections.KEYS.START_DATE]: startDate,
        [APIConnections.KEYS.END_DATE]: endDate,
        [APIConnections.KEYS.SERVICES]: selectedServicesId,
      };
    } else {
      body = {
        [APIConnections.KEYS.SERVING_USER_ID]:
          serveUserId !== undefined ? serveUserId : Globals.USER_DETAILS._id,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_DETAILS._id,
        [APIConnections.KEYS.START_DATE]: startDate,
        [APIConnections.KEYS.END_DATE]: endDate,
      };
    }

    DataManager.getBookingSlotList(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data !== undefined && data !== null) {
          Globals.BOOKING_DETAILS=data;
          // if (data?.objects?.length > 0) {
          if (
            data?.nextDate !== undefined &&
            isInitialRedirectionAvailableDate
          ) {
            let nextDateFormatted = moment(data.nextDate).format('DD MM YYYY');
            setIsInitialRedirectionAvailableDate(false);
            didFoundNextDate(nextDateFormatted);
          }
          checkBookingSlotsWithBusinessConfigurations(
            data?.objects,
            data?.isQueueSlotsAvailable,
          );
          setIsBookingFull(isThereAnyCanBookSlots(data?.objects));
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );

          setTimeout(() => {
            dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');

        setTimeout(() => {
          dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
        }, 1000);
      }
    });
  };
  /**
               *
               * Purpose: Business listing
               * Created/Modified By: Jenson
               * Created/Modified Date: 27 Dec 2021
               * Steps:
                   1.fetch business list from API and append to state variable
       */

  const performGetAllBookingSlots = date => {
    //let dateSelected = Utilities.appendBusinessTimeZoneToDate(date);

    let startDate =
      moment(date).format('dddd D MMMM YYYY 00:00:00 ') +
      Utilities.getBusinessTimeZoneOffset();
    let endDate =
      moment(date).format('dddd D MMMM YYYY 11:59:59 ') +
      Utilities.getBusinessTimeZoneOffset();

    dispatch(BookingQueueAction.setBookingQueueIsLoading(true));

    dispatch(BookingQueueAction.setBookingIsLoading(true));
    var body = {};

    if (Utilities.isServiceBasedBusiness()) {
      body = {
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_DETAILS._id,
        [APIConnections.KEYS.START_DATE]: startDate,
        [APIConnections.KEYS.END_DATE]: endDate,
        [APIConnections.KEYS.SERVICES]: selectedServicesId,
      };
    } else {
      body = {
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_DETAILS._id,
        [APIConnections.KEYS.START_DATE]: startDate,
        [APIConnections.KEYS.END_DATE]: endDate,
      };
    }

    DataManager.getAllServingUserBookingSlot(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            Globals.BOOKING_DETAILS=data;
            if (
              data?.nextDate !== undefined &&
              isInitialRedirectionAvailableDate
            ) {
              let nextDateFormatted = moment(data.nextDate).format(
                'DD MM YYYY',
              );
              setIsInitialRedirectionAvailableDate(false);
              didFoundNextDate(nextDateFormatted);
            }
            checkBookingSlotsWithBusinessConfigurations(
              data?.objects,
              data?.isQueueSlotsAvailable,
            );
            setIsBookingFull(isThereAnyCanBookSlots(data?.objects));
            setTimeout(() => {
              dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
           dispatch(BookingQueueAction.setBookingIsLoading(false));
            }, 1000);
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );

            setTimeout(() => {
              dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
              dispatch(BookingQueueAction.setBookingIsLoading(false));
            }, 1000);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );

          setTimeout(() => {
             dispatch(BookingQueueAction.setBookingIsLoading(false));
            dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
          }, 1000);
        }
      },
    );
  };
  const onPressSlotCell = (item, index) => {
    if (!bookingQueueIsLoading) {
      if (item.canBook === true) {
        setSetSelectedBookingSlotIndex(index);
        dispatch(BookingQueueAction._setRightButtonEnabled(true));

        dispatch(
          BookingQueueAction._setRightButtonText(
            module === 'reschedule'
              ? t(Translations.RESCHEDULE)
              : t(Translations.CONFIRM),
          ),
        );
        didSelectBookingSlot(item.dateFrom, item);
      }
    }
  };
  /**
          * Purpose:Render function of flat list
          * Created/Modified By: Sudhin Sudhakaran
          * Created/Modified Date: 8 Oct 2021
          * Steps:
              1.pass the data from api to customer details child component
      */
  const renderItem = ({item, index}) => {
    return (
      <BookingSlotDataCell
        item={item}
        index={index}
        onPressSlotCell={onPressSlotCell}
        appointmentDetails={appointmentDetails}
        selectedBookingSlotIndex={selectedBookingSlotIndex}
        // isLoading={bookingQueueIsLoading}
      />
    );
  };
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'30%'}
      height={'34'}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="0" y="0" rx="5" ry="5" width="98%" height="100%" />
    </ContentLoader>
  );
  const LoadingComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 30,
        }}>
        <ListLoader />
        <ListLoader />
        <ListLoader />
      </View>
    );
  };

  const DataLoader = () => {
    return (
      <>
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
      </>
    );
  };

  const configEmptyComponent = _timeSlotIsEmpty => {
    console.log('Config function called ====<><><><><> ', _timeSlotIsEmpty);
    console.log('_isBusinessHourDisabled', _isBusinessHourDisabled);
    console.log(
      '_isConsultantBusinessHourDisabled',
      _isConsultantBusinessHourDisabled,
    );
    console.log('selectedServingUserInfo=====',selectedServingUserInfo);
    console.log('is selected day is holiday?==',selectedDayIsHolyday);
    if(selectedDayIsHolyday===true && Globals.BUSINESS_DETAILS?.holidayList?.length>0 )
      {
        console.log('Booking Holiday ............');
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.HOLYDAY);
    }else{

    
    if (Globals.BUSINESS_DETAILS?.enableBooking === false) {
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.BOOKING_DISABLE);
    }  else if (_isBusinessHourDisabled === true) {
      console.log('condition 3');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
    } else if (_isConsultantBusinessHourDisabled === true) {
      console.log('condition 3');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
    } else if (selectedServingUserInfo?.availability==='NOTAVAILABLE'
    ) {
      console.log('condition 6');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
      }
      else if (
      Globals.BUSINESS_DETAILS?.bookingSettings?.advanceBookingAvialability
        ?.isActive === false || Globals.AVAILABLE_BUTTON?.sessionInfo?.enableEndButton === false &&
        Globals.AVAILABLE_BUTTON?.sessionInfo?.enableStartButton === false 
        // Globals.BOOKING_DETAILS?.isQueueSlotsAvailable === false
    ) {
      console.log('====',Globals?.BOOKING_DETAILS?.isQueueSlotsAvailable)
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.NO_ADVANCE_BOOKING);
    } else if (!isBookingFull) {
      console.log('condition 4');
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.BOOKING_FULL);
    } else {
      console.log('condition 5');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
    }
  }
    setTimeout(() => {
       dispatch(BookingQueueAction.setBookingIsLoading(false));
      dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
    }, 1000);
  };
  /**
           * Purpose: List empty component
           * Created/Modified By: Sudhin Sudhakaran
           * Created/Modified Date: 11 Oct 2021
           * Steps:
               1.Return the component when list is empty
       */
  const BookingEmptyComponent = () => {
    console.log(
      'SWITCH BOOKING ====================================',
      emptyScreenType,
    );

    switch (emptyScreenType) {
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.BOOKING_DISABLE:
        return (
          <BookingFullEmptyComponent
            title={t(Translations.NO_BOOKING_AVAILABLE)}
            showQueue={false}
          />
        );

      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.HOLYDAY:
        return <HollyDayEmptyComponent />;
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE:
        return <SpecialistEmptyComponent />;
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.BOOKING_FULL:
        return (
          <BookingFullEmptyComponent
            title={t(Translations.BOOKING_ARE_FULL_YOU_CAN_SWITCH_TO_THE)}
            showQueue={true}
          />
        );
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.NO_ADVANCE_BOOKING:
        return (
          <BookingFullEmptyComponent
            title={t(Translations.NO_BOOKING_AVAILABLE)}
            showQueue={false}
          />
        );
      default:
        return <SpecialistEmptyComponent />;
    }
  };

  //final return
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1, backgroundColor: Colors.APP_MAIN_BACKGROUND_COLOR}}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.APP_MAIN_BACKGROUND_COLOR,
          }}>
          <View
            style={{
              width: '100%',
              height: 0.5,
              backgroundColor: Colors.LINE_SEPARATOR_COLOR,
            }}
          />

          <FlatList
            contentContainerStyle={{
              // paddingBottom: 85,
              // marginLeft: 16,
              // backgroundColor:'red',
              // marginRight: 22,
            }}
            horizontal={false}
            numColumns={3}
            data={
              bookingQueueIsLoading ? dummyNotArrivedListData : bookingSlotList
            }
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            ListEmptyComponent={() =>
         bookingIsLoading ? (
                <DataLoader />
              ) : (
                <BookingEmptyComponent />
              )
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default React.memo(BookingSlotList);

const styles = StyleSheet.create({});
