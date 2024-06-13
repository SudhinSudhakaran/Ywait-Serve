/* eslint-disable no-fallthrough */
import React, {useState, Fragment, useLayoutEffect} from 'react';
import {Colors, Fonts, Globals, Images, Translations} from '../../../constants';
import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {t} from 'i18next';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import Utilities from '../../../helpers/utils/Utilities';
import {BookingQueueAction} from '../../../redux/actions';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import DataManager from '../../../helpers/apiManager/DataManager';
import {useFocusEffect} from '@react-navigation/core';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import StorageManager from '../../../helpers/storageManager/StorageManager';
import HollyDayEmptyComponent from '../emptyScreens/HollyDayEmptyComponent';
import ContentLoader, {Rect} from 'react-content-loader/native';
import QueueFullEmptyComponent from '../emptyScreens/QueueFullEmptyComponent';
import SpecialistEmptyComponent from '../emptyScreens/SpecialistEmptyComponent';
import {BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE} from '../../../helpers/enums/Enums';

const QueueSlotList = props => {
  const {
    index,
    selectedServicesId,
    selectedServingUserId,
    isServingUserSelected,
    didSelectQueueSlot,
    selectedServingUserInfo
  } = props;

  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState();
  const [queueSlotList, setQueueSlotList] = useState([]);
  const [emptyScreenType, setEmptyScreenType] = useState(null);
  const [isRefreshNeeded, setIsRefreshNeeded] = useState(false);
  const [isQueueFull, setIsQueueFull] = useState(false);
  const [showEmptyComponent, setShowEmptyComponent] = useState(false);
  const [expectedTimeOfServing, setExpectedTimeOfServing] = useState();
  const [selectedSubSlotIndex, setSelectedSubSlotIndex] = useState(-1); //-1 if system generated time
  const [isLoading, setIsLoading] = useState(true);
  const[visible,setVisible]=useState(false);
  const {
    selectedDayIsHolyday,
    bookingQueueIsLoading,
    queueIsLoading,
    selectedDate,
    _isQueueIsAvailable,
    _isBusinessHourDisabled,
    _isConsultantBusinessHourDisabled,
    _isRightButtonEnabled,
    availabilitydetail,
  } = useSelector(state => state?.BookingQueueState);

  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'index in queue',
        index,
        moment(selectedDate).format('DD-MM-YYYY'),
      );
      console.log(
        'isQueueSlotsAvailable<-><-><-> Queue screen',
        _isQueueIsAvailable,
      );
      if (_isQueueIsAvailable === true) {
        if (index === 1) {
          getBusinessDetails(selectedDate, selectedServingUserId);
        }
        setQueueSlotList('');
        setSelectedIndex('');
        setVisible(false);

        setShowEmptyComponent(true);
      } else {
        setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_FULL);
        setTimeout(() => {
          dispatch(BookingQueueAction.setQueueIsLoading(false));
          dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
        }, 1000);
      }
      return () => {};
    }, [selectedDate, index]),
  );

  useLayoutEffect(() => {
    // console.log('useLayOut effect Queue slot isloading', bookingQueueIsLoading);
    if (_isQueueIsAvailable === true) {
      dispatch(BookingQueueAction.setBookingQueueIsLoading(true));
    } else {
      setTimeout(() => {
              dispatch(BookingQueueAction.setQueueIsLoading(false));
        dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
      }, 1000);
    }
    return () => {
      dispatch(BookingQueueAction.setQueueIsLoading(true));
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
  //Shimmer loader for the flatList
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={'100%'}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="0" y="0" rx="5" ry="5" width="98%" height="100%" />
    </ContentLoader>
  );
  const SuggestedTimeLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={40}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="20%" y="0" rx="5" ry="5" width="60%" height="12" />
      <Rect x="25%" y="22" rx="5" ry="5" width="50%" height="12" />
    </ContentLoader>
  );
  const ConsultantTextLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={25}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="35%" y="10" rx="5" ry="5" width="30%" height="12" />
    </ContentLoader>
  );
  /**
          *
          * Purpose: check booking configurations
          * Created/Modified By: Vijin
          * Created/Modified Date: 17 Feb 2022
          * Steps:
             
       */
  const checkQueueSlotsWithBusinessConfigurations = (
    queueSlotData,
    systemGeneratedTime,
    queueSlot,
  ) => {
    console.log('========>>>>>>', queueSlotData, queueSlot);
    console.log('========>>>>>> systemGeneratedTime', systemGeneratedTime);
    let timeSlotIsEmpty = false;
    if (queueSlot?.length > 0) {
      timeSlotIsEmpty = false;
      setIsQueueFull(true);
    } else {
      timeSlotIsEmpty = true;
    }

    setExpectedTimeOfServing(queueSlotData);
    didSelectQueueSlot(systemGeneratedTime);
    setQueueSlotList(queueSlot);
    setShowEmptyComponent(false);

    if (systemGeneratedTime !== undefined) {
      if (
        Globals.BUSINESS_DETAILS?.waitlistSettings?.allowFutureDayQueue ===
        false
      ) {
        dispatch(BookingQueueAction._setRightButtonEnabled(false));
      } else {
        dispatch(BookingQueueAction._setRightButtonEnabled(true));
      }
    }
    if (Globals?.QUEUE_DETAILS?.objects?.length > 0) {
      if (
        Globals.BUSINESS_DETAILS?.waitlistSettings?.allowFutureDayQueue ===
        false
      ) {
        dispatch(BookingQueueAction._setRightButtonEnabled(false));
      } else {
        dispatch(BookingQueueAction._setRightButtonEnabled(false));
      }
    } else {
      dispatch(BookingQueueAction._setRightButtonEnabled(false));
    }
    dispatch(
      BookingQueueAction._setRightButtonText(t(Translations.JOIN_QUEUE)),
    );

    setTimeout(() => {
      dispatch(BookingQueueAction.setQueueIsLoading(false));
      dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
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
                performGetQueueSlotList(_selectedDate, serveUserId);
              } else {
                performGetAllQueueSlots(_selectedDate);
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
              dispatch(BookingQueueAction.setQueueIsLoading(false));
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
            dispatch(BookingQueueAction.setQueueIsLoading(false));
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

  const performGetQueueSlotList = (date, serveUserId) => {
    //let dateSelected = Utilities.appendBusinessTimeZoneToDate(date);

    let startDate =
      moment(date).format('dddd D MMMM YYYY 00:00:00 ') +
      Utilities.getBusinessTimeZoneOffset();
    let endDate =
      moment(date).format('dddd D MMMM YYYY 11:59:59 ') +
      Utilities.getBusinessTimeZoneOffset();

    dispatch(BookingQueueAction.setBookingQueueIsLoading(true));
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

    DataManager.getQueueSlotList(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data !== undefined && data !== null) {
          Globals.QUEUE_DETAILS = data;
          checkQueueSlotsWithBusinessConfigurations(
            data,
            data?.systemGeneratedTime,
            data.objects,
          );
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );

          setTimeout(() => {
            dispatch(BookingQueueAction.setQueueIsLoading(false));
            dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');

        setTimeout(() => {
          dispatch(BookingQueueAction.setQueueIsLoading(false));
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

  const performGetAllQueueSlots = date => {
    //let dateSelected = Utilities.appendBusinessTimeZoneToDate(date);

    let startDate =
      moment(date).format('dddd D MMMM YYYY 00:00:00 ') +
      Utilities.getBusinessTimeZoneOffset();
    let endDate =
      moment(date).format('dddd D MMMM YYYY 11:59:59 ') +
      Utilities.getBusinessTimeZoneOffset();

    dispatch(BookingQueueAction.setBookingQueueIsLoading(true));
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

    DataManager.getAllQueueSlots(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data !== undefined && data !== null) {
          Globals.QUEUE_DETAILS = data;
          checkQueueSlotsWithBusinessConfigurations(
            data,
            data?.systemGeneratedTime,
            data.objects,
          );

          setTimeout(() => {
            dispatch(BookingQueueAction.setQueueIsLoading(false));
            dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
          }, 1000);
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );

          setTimeout(() => {
            dispatch(BookingQueueAction.setQueueIsLoading(false));
            dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');

        setTimeout(() => {
          dispatch(BookingQueueAction.setQueueIsLoading(false));
          dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
        }, 1000);
      }
    });
  };
  const plusButtonAction = index => {
    if (index === selectedIndex) {
      setSelectedIndex();
      setVisible(false)
    }
     else {
      setSelectedIndex(index);
      setVisible(true)
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
    return <QueueSlotDataCell item={item} index={index} />;
  };

  const QueueSlotDataCell = ({item, index}) => {
    return (
      <View
        key={`12345_item-${index}`}
        style={{alignSelf: 'center', width: DisplayUtils.setWidth(90)}}
        // onPress={() =>
        //     navigation.navigate('CustomerDetailsScreen', { selectedCustomer: item })
        // }
      >
        {bookingQueueIsLoading ? (
          <ListLoader />
        ) : (
          <View
            style={{
              backgroundColor: Colors.WHITE_COLOR,
              borderWidth: bookingQueueIsLoading ? 0 : 0.5,
              borderColor: Colors.NOTIFICATION_TITLE_COLOR,
              height: 50,

              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.Gibson_Regular,
                color: Colors.PRIMARY_TEXT_COLOR,
              }}>
              {/* {Utilities.getUtcToLocalWithFormat(
                item.from,
                Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
              )}{' '}
              -{' '}
              {Utilities.getUtcToLocalWithFormat(
                item.to,
                Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
              )} */}
              {moment(item.from).format(
                Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
              )}{' '}
              -{' '}
              {moment(item.to).format(
                Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
              )}
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                width: 52,
                borderLeftColor: Colors.NOTIFICATION_TITLE_COLOR,
                borderLeftWidth: bookingQueueIsLoading ? 0 : 0.5,
                position: 'absolute',
                right: 0,
                justifyContent: 'center',
              }}
              onPress={() => plusButtonAction(index)}>
              <Image
                style={{
                  width: 12,
                  height: 12,
                  resizeMode: 'contain',
                  tintColor: Colors.PRIMARY_COLOR,
                  alignSelf: 'center',
                }}
                source={index === selectedIndex ? Images.MINUS_ICON:Images.PLUS_ICON}
              />
            </TouchableOpacity>
          </View>
        )}
        {selectedIndex === index ? (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 85,
              marginLeft: 16,
              marginRight: 22,
            }}
            horizontal={false}
            numColumns={2}
            data={item?.available}
            keyboardShouldPersistTaps="handled"
            renderItem={renderAvailableItem}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
          />
        ) : null}
      </View>
    );
  };
  const availableSubSlotOnPress = (item, index) => {
    dispatch(BookingQueueAction._setRightButtonEnabled(true));
    queueSlotList?.map((queueItem, queueItemIndex) => {
      queueItem?.available.map(
        (queueAvailableItem, queueAvailableItemIndex) => {
          if (queueItemIndex === selectedIndex) {
            if (queueAvailableItemIndex === index) {
              queueSlotList[queueItemIndex].available[
                queueAvailableItemIndex
              ].isSelected = true;
            } else {
              queueSlotList[queueItemIndex].available[
                queueAvailableItemIndex
              ].isSelected = false;
            }
          } else {
            queueSlotList[queueItemIndex].available[
              queueAvailableItemIndex
            ].isSelected = false;
          }
        },
      );
    });

    setSelectedSubSlotIndex(index); //-1 if system generated time
    setIsRefreshNeeded(!isRefreshNeeded);
    didSelectQueueSlot(item);
  };
  /**
          * Purpose:Render function of flat list
          * Created/Modified By: Sudhin Sudhakaran
          * Created/Modified Date: 8 Oct 2021
          * Steps:
              1.pass the data from api to customer details child component
      */
  const renderAvailableItem = ({item, index}) => {
    return <AvailableDataCell item={item} index={index} />;
  };

  const AvailableDataCell = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => availableSubSlotOnPress(item, index)}
        style={{
          borderWidth: bookingQueueIsLoading ? 0 : 0.3,
          borderColor: Colors.SEARCH_INPUT_BORDER_GRAY_COLOR,
          height: 35,
          backgroundColor:
            item?.isSelected || false
              ? Colors.SECONDARY_COLOR
              : Colors.WHITE_COLOR,
          marginLeft: 12,
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          width: '45%',
        }}>
        {bookingQueueIsLoading ? (
          <ListLoader />
        ) : (
          <Fragment>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.Gibson_Regular,
                color:
                  item?.isSelected || false
                    ? Colors.WHITE_COLOR
                    : Colors.PRIMARY_TEXT_COLOR,
              }}>
              {Utilities.getUtcToLocalWithFormat(
                item.from,
                Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
              )}
            </Text>
          </Fragment>
        )}
      </TouchableOpacity>
    );
  };
  /**
              * Purpose: List empty component
              * Created/Modified By: Sudhin Sudhakaran
              * Created/Modified Date: 11 Oct 2021
              * Steps:
                  1.Return the component when list is empty
          */

  const configEmptyComponent = _timeSlotIsEmpty => {
    console.log(
      '_isConsultantBusinessHourDisabled in config empty component',
      _isConsultantBusinessHourDisabled,
    );
    console.log('_isQueueIsAvailable', _isQueueIsAvailable);
    console.log('is selected day is holiday?==',selectedDayIsHolyday);
    if (selectedDayIsHolyday === true && Globals.BUSINESS_DETAILS?.holidayList?.length>0 )
       {
      console.log('Holiday ............');
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.HOLYDAY);
    } else if (_isBusinessHourDisabled === true) {
      console.log('Business hour disabled ............');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
    } else if (_isConsultantBusinessHourDisabled === true) {
      console.log('Consultant business disabled ............');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
    } else if (selectedServingUserInfo?.availability==='NOTAVAILABLE') {
      console.log('Consultant business disabled ............');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
    } 
    else if (
      Globals.BUSINESS_DETAILS?.waitlistSettings?.allowFutureDayQueue === false || Globals.AVAILABLE_BUTTON?.sessionInfo?.enableEndButton === false 
      && Globals.AVAILABLE_BUTTON?.sessionInfo?.enableStartButton === false 
    ) {
      console.log('No advance queue ............');
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.NO_ADVANCE_QUEUE);
    } else if (Globals.BUSINESS_DETAILS?.enableQueue === false) {
      console.log('Queue disabled ............');
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_DISABLE);
    } else if (_isQueueIsAvailable === false) {
      console.log('Queue not available ............');
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_FULL);
      return;
    } else if (_isQueueIsAvailable === false && _timeSlotIsEmpty === true) {
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_NOT_AVAILABLE,
      );
    } else if (!isQueueFull) {
      console.log('Queue full ............');
      setEmptyScreenType(BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_FULL);
    } else {
      console.log('Else ............');
      setEmptyScreenType(
        BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE,
      );
    }

    setTimeout(() => {
      dispatch(BookingQueueAction.setQueueIsLoading(false));
      dispatch(BookingQueueAction.setBookingQueueIsLoading(false));
    }, 1000);
  };
  const QueueEmptyComponent = () => {
    console.log('SWITCH QUEUE =================== >>><><<<', emptyScreenType);
    switch (emptyScreenType) {
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_DISABLE:
        return (
          <QueueFullEmptyComponent
            title={t(Translations.QUEUE_IS_NOT_AVAILABLE)}
          />
        );
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.HOLYDAY:
        return <HollyDayEmptyComponent />;

      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.NO_ADVANCE_QUEUE:
        return (
          <QueueFullEmptyComponent title={t(Translations.NO_QUEUE_AVAILABLE)} />
        );

      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.SPECIALIST_NOT_AVAILABLE:
        return <SpecialistEmptyComponent />;
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_FULL:
        return (
          <QueueFullEmptyComponent title={t(Translations.QUEUE_IS_FULL)} />
        );
      case BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE.QUEUE_NOT_AVAILABLE:
        return (
          <QueueFullEmptyComponent
            title={t(Translations.QUEUE_IS_NOT_AVAILABLE)}
          />
        );
      default:
        return <SpecialistEmptyComponent />;
    }
  };
  const systemGeneratedViewOnPress = () => {
    dispatch(BookingQueueAction._setRightButtonEnabled(true));
    if (selectedSubSlotIndex !== -1) {
      queueSlotList?.map((queueItem, queueItemIndex) => {
        queueItem?.available.map(
          (queueAvailableItem, queueAvailableItemIndex) => {
            if (queueAvailableItem?.isSelected === true) {
              queueSlotList[queueItemIndex].available[
                queueAvailableItemIndex
              ].isSelected = false;
            }
          },
        );
      });

      setSelectedSubSlotIndex(-1); //-1 if system generated time
      setIsRefreshNeeded(!isRefreshNeeded);
      didSelectQueueSlot(expectedTimeOfServing?.systemGeneratedTime);
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
          <ScrollView>
            {/* expectedTimeOfServing?.systemGeneratedTime !== undefined  */}
            {/* QUEUE MODE LABEL */}
            {bookingQueueIsLoading ||
            (queueSlotList?.length > 0 &&
              Globals?.BUSINESS_DETAILS?.waitlistSettings
                ?.allowFutureDayQueue === true) ? (
              <Text
                style={{
                  marginTop: 20,
                  fontFamily: Fonts.Gibson_Regular,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: 16,
                  alignSelf: 'center',
                }}
                numberOfLines={1}>
                {t(Translations.YOU_ARE_IN)}{' '}
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_COLOR,
                    fontSize: 16,
                  }}>
                  {t(Translations.QUEUE)}{' '}
                </Text>
                {t(Translations.MODE)}
              </Text>
            ) : null}

            {/* SYSTEM GENERATED TIME */}
            {bookingQueueIsLoading ||
            (queueSlotList?.length > 0 &&
              Globals?.BUSINESS_DETAILS?.waitlistSettings
                ?.allowFutureDayQueue === true) ? (
                  <View>
            {_isRightButtonEnabled === true && selectedSubSlotIndex === -1 ?
               <View  style={{
                marginLeft: 40,
                marginRight: 40,
                height: 127,
                borderWidth: selectedSubSlotIndex === -1 ? 2 : 1,
                borderColor:
                  selectedSubSlotIndex === -1 ?
                  _isRightButtonEnabled === true ? Colors.PRIMARY_COLOR
                  : Colors.SECONDARY_COLOR
                    : Colors.NOTIFICATION_TITLE_COLOR,
                borderRadius: 8,
                backgroundColor:
                  selectedSubSlotIndex === -1
                    ? Colors.SECONDARY_COLOR
                    : Colors.WHITE_COLOR,
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center'}}>
               <Text
               style={{
                 fontFamily: Fonts.Gibson_Regular,
                 fontSize: 14,
                 textAlign: 'center',
                 color:
                   selectedSubSlotIndex === -1
                     ? Colors.WHITE_COLOR
                     : Colors.INACTIVE_BOTTOM_BAR_COLOR,
                 lineHeight: 25,
               }}>
               {t(Translations.THE_BEST_SUGGESTED_TIME)}
               {'\n'} {t(Translations.FOR_THE_CONSULTATION_IS)}
             </Text>
             <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Image
                      source={Images.ALARM_CLOCK_ICON}
                      style={{
                        height: 14,
                        width: 14,
                        marginRight: 4,
                        marginTop: 0,
                        tintColor:
                          selectedSubSlotIndex === -1
                            ? Colors.WHITE_COLOR
                            : Colors.INACTIVE_BOTTOM_BAR_COLOR,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize: 14,
                        textAlign: 'center',
                        color:
                          selectedSubSlotIndex === -1
                            ? Colors.WHITE_COLOR
                            : Colors.INACTIVE_BOTTOM_BAR_COLOR,
                      }}>
                      {expectedTimeOfServing !== undefined
                        ? Utilities.getUtcToLocalWithFormat(
                            expectedTimeOfServing?.systemGeneratedTime
                              ?.expectedTimeOfServing,
                            Utilities.isBusiness24HrTimeFormat()
                              ? 'HH:mm'
                              : 'hh:mm A',
                          )
                        : 'N/A'}
                    </Text>
                  </View>
                  <View
                  style={{
                    height: 12,
                    width: 12,
                    backgroundColor:selectedSubSlotIndex === -1 &&
                    _isRightButtonEnabled === true ?
                    Colors.PRIMARY_COLOR : Colors.WHITE_COLOR,
                    borderColor: Colors.NOTIFICATION_TITLE_COLOR,
                    borderWidth: 1,
                    position: 'absolute',
                    top: 58,
                    borderRadius: 6,
                    left: 16,
                  }}
                />
             </View>
              :<TouchableOpacity
                style={{
                  marginLeft: 40,
                  marginRight: 40,
                  height: 127,
                  borderWidth: selectedSubSlotIndex === -1 ? 2 : 1,
                  borderColor:
                    selectedSubSlotIndex === -1 ?
                    _isRightButtonEnabled === true ? Colors.PRIMARY_COLOR
                    : Colors.SECONDARY_COLOR
                      : Colors.NOTIFICATION_TITLE_COLOR,
                  borderRadius: 8,
                  backgroundColor:
                    selectedSubSlotIndex === -1
                      ? Colors.SECONDARY_COLOR
                      : Colors.WHITE_COLOR,
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => systemGeneratedViewOnPress()}>
                {bookingQueueIsLoading === true ||
                showEmptyComponent === true ? (
                  <SuggestedTimeLoader />
                ) : bookingQueueIsLoading === false &&
                  showEmptyComponent === false ? (
                  <Text
                    style={{
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 14,
                      textAlign: 'center',
                      color:
                        selectedSubSlotIndex === -1
                          ? Colors.WHITE_COLOR
                          : Colors.INACTIVE_BOTTOM_BAR_COLOR,
                      lineHeight: 25,
                    }}>
                    {t(Translations.THE_BEST_SUGGESTED_TIME)}
                    {'\n'} {t(Translations.FOR_THE_CONSULTATION_IS)}
                  </Text>
                ) : (
                  <View />
                )}

                {bookingQueueIsLoading === true ||
                showEmptyComponent === true ? (
                  <ConsultantTextLoader />
                ) : bookingQueueIsLoading === false &&
                  showEmptyComponent === false ? (
                  <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Image
                      source={Images.ALARM_CLOCK_ICON}
                      style={{
                        height: 14,
                        width: 14,
                        marginRight: 4,
                        marginTop: 0,
                        tintColor:
                          selectedSubSlotIndex === -1
                            ? Colors.WHITE_COLOR
                            : Colors.INACTIVE_BOTTOM_BAR_COLOR,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize: 14,
                        textAlign: 'center',
                        color:
                          selectedSubSlotIndex === -1
                            ? Colors.WHITE_COLOR
                            : Colors.INACTIVE_BOTTOM_BAR_COLOR,
                      }}>
                      {expectedTimeOfServing !== undefined
                        ? Utilities.getUtcToLocalWithFormat(
                            expectedTimeOfServing?.systemGeneratedTime
                              ?.expectedTimeOfServing,
                            Utilities.isBusiness24HrTimeFormat()
                              ? 'HH:mm'
                              : 'hh:mm A',
                          )
                        : 'N/A'}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}

                <View
                  style={{
                    height: 12,
                    width: 12,
                    backgroundColor:selectedSubSlotIndex === -1 &&
                    _isRightButtonEnabled === true ?
                    Colors.PRIMARY_COLOR : Colors.WHITE_COLOR,
                    borderColor: Colors.NOTIFICATION_TITLE_COLOR,
                    borderWidth: 1,
                    position: 'absolute',
                    top: 58,
                    borderRadius: 6,
                    left: 16,
                  }}
                />
              </TouchableOpacity>
}
               </View>
            ) : null}

            {/* OR VIEW */}
            {bookingQueueIsLoading ||
            (queueSlotList?.length > 0 &&
              Globals?.BUSINESS_DETAILS?.waitlistSettings
                ?.allowFutureDayQueue === true) ? (
              <View style={{marginTop: 60, flexDirection: 'row'}}>
                <View
                  style={{
                    height: 1,
                    width: '45%',
                    backgroundColor: Colors.TEXT_GREY_COLOR_9B,
                  }}
                />
                <Text
                  style={{
                    marginLeft: 12,
                    marginRight: 12,
                    fontFamily: Fonts.Gibson_SemiBold,
                    fontSize: 14,
                    color: Colors.QUEUE_LIST_DAY_COLOR,
                    marginTop: -8,
                  }}>
                  {t(Translations.OR)}
                </Text>
                <View
                  style={{
                    height: 1,
                    width: '50%',
                    backgroundColor: Colors.TEXT_GREY_COLOR_9B,
                  }}
                />
              </View>
            ) : null}

            {/* CHOOSE TIME LABEL */}
            {bookingQueueIsLoading ||
            (queueSlotList?.length > 0 &&
              Globals?.BUSINESS_DETAILS?.waitlistSettings
                ?.allowFutureDayQueue === true) ? (
              <Text
                style={{
                  marginTop: 30,
                  fontFamily: Fonts.Gibson_Regular,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: 14,

                  marginLeft: 40,
                  marginRight: 40,
                  lineHeight: 20,
                }}>
                {t(Translations.CHOOSE_A)}{' '}
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_COLOR,
                    fontSize: 14,
                  }}>
                  {t(Translations.TIME)}{' '}
                </Text>
                {t(Translations.FROM_THE_BELOW_TIME_INTERVALS_FOR_CONSULTATION)}
              </Text>
            ) : null}

            <FlatList
              contentContainerStyle={{
                paddingBottom: 85,
              }}
              data={
                bookingQueueIsLoading
                  ? dummyNotArrivedListData
                  : Globals?.BUSINESS_DETAILS?.waitlistSettings
                      ?.allowFutureDayQueue === true
                  ? queueSlotList
                  : QueueEmptyComponent
              }
              refreshing={isRefreshNeeded}
              keyboardShouldPersistTaps="handled"
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item._id ? item._id.toString() : index.toString()
              }
              ListEmptyComponent={
             queueIsLoading
                  ? null
                  : QueueEmptyComponent
              }
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default React.memo(QueueSlotList);

const styles = StyleSheet.create({});
