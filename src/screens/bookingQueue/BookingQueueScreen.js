import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useLayoutEffect,
} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  I18nManager,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/elements';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../constants';
import {t} from 'i18next';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GetImage} from '../shared/getImage/GetImage';
import Utilities from '../../helpers/utils/Utilities';
import {useFocusEffect} from '@react-navigation/core';
import QueueSlotList from './SlotLists/QueueSlotList';
import BookingSlotList from './SlotLists/BookingSlotList';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import DataManager from '../../helpers/apiManager/DataManager';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import APIConnections from '../../helpers/apiManager/APIConnections';
import StorageManager from '../../helpers/storageManager/StorageManager';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import QueueSuccessPopUp from '../successAndFailurePopUps/queuePopUps/QueueSuccessPopUp';
import QueueFailurePopUp from '../successAndFailurePopUps/queuePopUps/QueueFailurePopUp';
import QueueConfirmationPopUp from '../confirmationPopUps/queuePopUps/QueueConfirmationPopUp';
import BookingSuccessPopUp from '../successAndFailurePopUps/bookingPopUps/BookingSuccessPopUp';
import BookingFailurePopUp from '../successAndFailurePopUps/bookingPopUps/BookingFailurePopUp';
import BookingConfirmationPopUp from '../confirmationPopUps/bookingPopUps/BookingConfirmationPopUp';
import QueuePaymentConfirmationPopUp from '../confirmationPopUps/queuePopUps/QueuePaymentConfirmationPopUp';
import BookingPaymentConfirmationPopUp from '../confirmationPopUps/bookingPopUps/BookingPaymentConfirmationPopUp';
import {useDispatch, useSelector} from 'react-redux';
import {BookingQueueAction} from '../../redux/actions';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export default function BookingQueueScreen(props) {
  const {
    module,
    appointmentType,
    selectedGender,
    selectedServicesId,
    appointmentDetails,
    selectedCustomerInfo,
    isServingUserSelected,
    selectedAppointmentDateFrom,
    selectedServingUserInfo,
  } = props.route.params;
  // var selectedServingUserId =
  //   props?.route?.params?.selectedServingUserId === undefined
  //     ? Utilities.isUserIsConsultant
  //       ? Globals.USER_DETAILS._id
  //       : ''
  //     : props?.route?.params?.selectedServingUserId;

  const [selectedServingUserId, setSelectedServingUserId] = useState(
    props?.route?.params?.selectedServingUserId === undefined
      ? Utilities.isUserIsConsultant() === true
        ? Globals.USER_DETAILS._id
        : ''
      : props?.route?.params?.selectedServingUserId,
  );
  var _module = module === undefined ? 'newBooking' : module;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userIdText, setUserIdText] = useState('');
  const [dateDataIndex, setDateDataIndex] = useState(0);
  // const [selectedDate, setSelectedDate] = useState(
  //   Utilities.convertorTimeToBusinessTimeZone(selectedAppointmentDateFrom),
  // );
  const [userIdValue, setUserIdValue] = useState('');
  const [dateRefresh, setDateRefresh] = useState(false);
  const [DATA, setDATA] = useState([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState(
    Utilities.convertorTimeToBusinessTimeZone(selectedAppointmentDateFrom),
  );
  const [availabilityInfo, setAvailabilityInfo] = useState({});
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isSelectedDayToday, setIsSelectedDateToday] = useState(true);
  const [selectedQueueSlotInfo, setSelectedQueueSlotInfo] = useState();
  const [newBookingSuccessData, setNewBookingSuccessData] = useState('');
  const [reScheduleSuccessDataId, setReScheduleSuccessId] = useState('');
  const [isQueueSlotsAvailable, setIsQueueSlotsAvailable] = useState(true);
  const [reScheduleSuccessDataName, setReScheduleSuccessName] = useState('');
  const [isThereAnyCanBookSlots, setIsThereAnyCanBookSlots] = useState(false);
  const dateFlatListRef = useRef();
  const queueSuccessRef = useRef();
  const queueFailureRef = useRef();
  const bookingSuccessRef = useRef();
  const bookingFailureRef = useRef();
  const queueConfirmationRef = useRef();
  const bookingConfirmationRef = useRef();
  const queuePaymentConfirmationRef = useRef();
  const bookingPaymentConfirmationRef = useRef();
  const dispatch = useDispatch();
  const {
    bookingQueueIsLoading,
    bookingIsLoading,
    queueIsLoading,
    selectedDate,
    availabilitydetail,
    _rightButtonText,
    _isRightButtonEnabled,
  } = useSelector(state => state?.BookingQueueState);

  var dateStart = moment(
    moment()
      .utcOffset(Globals.BUSINESS_DETAILS.timeZone.offset)
      .format('MM-DD-YYYY'),
    'MM-DD-YYYY',
  );

  var dateEnd = moment().add(
    Globals.BUSINESS_DETAILS?.bookingSettings?.advanceBookingAvialability
      ?.isActive
      ? Globals.BUSINESS_DETAILS?.bookingSettings?.advanceBookingAvialability
          ?.days
      : 30,
    'days',
  );

  var tempData = [];
  useFocusEffect(
    React.useCallback(() => {
      console.log('selectedServingUserInfo=====', selectedServingUserInfo);
      dispatch(
        BookingQueueAction._setRightButtonText(
          _module === 'reschedule'
            ? t(Translations.RESCHEDULE)
            : t(Translations.CONFIRM),
        ),
      );

      if (_module !== 'reschedule') {
        dispatch(
          BookingQueueAction.setSelectedDate(
            Utilities.convertorTimeToBusinessTimeZone(moment().toISOString()),
          ),
        );
      }

      return () => {
        dispatch(BookingQueueAction._setRightButtonEnabled(false));
        dispatch(BookingQueueAction._setBusinessHourDisabled(false));
        dispatch(BookingQueueAction._setConsultantBusinessHourDisabled(false));
        dispatch(
          BookingQueueAction.setSelectedDate(
            Utilities.convertorTimeToBusinessTimeZone(moment().toISOString()),
          ),
        );
      };
    }, []),
  );
  useLayoutEffect(() => {
    dispatch(BookingQueueAction.setBookingQueueIsLoading(true));
    dispatch(BookingQueueAction.setQueueIsLoading(true));
    dispatch(BookingQueueAction.setBookingIsLoading(true));
    return () => {};
  }, [availabilitydetail]);
  useEffect(() => {
    getAvailability();
  }, []);
  useEffect(() => {
    setNewBookingSuccessData('');
    loadData();
    return () => {
      Globals.SELECTED_CUSTOMER_INFO = {};
      Globals.SELECTED_DATE_FROM = '';
      Globals.FAILURE_ERROR_MESSAGE = '';
      Globals.SELECTED_PAYMENT_INFO = {};
    };
  }, []);
  useEffect(() => {
    setDateDataIndex(0);
    populateDates(
      Utilities.convertorTimeToBusinessTimeZone(moment().format()),
      moment().utcOffset(Globals.BUSINESS_DETAILS.timeZone.offset).format('D') -
        1,
    );
  }, []);
  const [routes] = useState([
    {key: 'tab1', title: t(Translations.BOOKING)},
    {key: 'tab2', title: t(Translations.QUEUE)},
  ]);

  useEffect(() => {
    checkHoliday(selectedDate);
    checkSpecialistAvailable(selectedDate);
  }, []);
  const getAvailability = () => {
    DataManager.getAvailability(selectedServingUserId).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.objects !== undefined && data.objects !== null) {
            // setAvailabilityInfo(data.objects);
            Globals.AVAILABLE_BUTTON = data.objects;
            dispatch(BookingQueueAction.setAvailabilityInfo(data.objects));
            console.log(
              '=============/////////====',
              availabilitydetail,
              Globals.AVAILABLE_BUTTON,
              data.objects,
            );
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            setIsLoading(false);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
        }
      },
    );
  };
  const checkHoliday = _day => {
    let _holiday = Utilities.checkSelectedDateIsHoliday(_day);

    dispatch(BookingQueueAction.setSelectedDayIsHolyDay(_holiday));
  };
  const checkSpecialistAvailable = date => {
    console.log('check specialist function called .............');
    const _day = moment(date).format('dddd');
    if (
      Globals.BUSINESS_DETAILS?._id !== undefined &&
      Globals.BUSINESS_DETAILS?._id !== null
    ) {
      if (Globals.BUSINESS_DETAILS?.generalHours?.length > 0) {
        Globals.BUSINESS_DETAILS?.generalHours?.map(item => {
          if (_day.toUpperCase() === item.label.toUpperCase()) {
            if (item?.activeFlag === false) {
              console.log('??????', item?.activeFlag);
              dispatch(BookingQueueAction._setBusinessHourDisabled(true));
            }
          }
        });
      }
    }
    checkConsultantBusinessHourDisabled(date);
  };

  const checkConsultantBusinessHourDisabled = date => {
    const _day = moment(date).format('dddd');
    var data = Utilities.isUserIsAdmin()
      ? selectedServingUserInfo
      : Globals.USER_DETAILS;

    if (data?.workingHours?.length > 0) {
      data?.workingHours?.map(item => {
        console.log('>>>>>>.......', item);
        if (_day.toUpperCase() === item.label.toUpperCase()) {
          if (item?.activeFlag === false) {
            console.log('>>>>>>::::::::::<<<<<<<', item);
            dispatch(
              BookingQueueAction._setConsultantBusinessHourDisabled(true),
            );
          }
        }
      });
    }
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'tab1':
        return (
          <BookingSlotList
            index={index}
            module={_module}
            selectedServingUserId={
              props?.route?.params?.selectedServingUserId === undefined
                ? Utilities.isUserIsConsultant() === true
                  ? Globals.USER_DETAILS._id
                  : ''
                : props?.route?.params?.selectedServingUserId
            }
            isSelectedDayToday={isSelectedDayToday}
            appointmentDetails={appointmentDetails}
            selectedServicesId={selectedServicesId}
            setIsQueueSlotsAvailable={setIsQueueSlotsAvailable}
            setIsThereAnyCanBookSlots={setIsThereAnyCanBookSlots}
            didFoundNextDate={didFoundNextDate}
            isServingUserSelected={isServingUserSelected}
            didSelectBookingSlot={didSelectBookingSlot}
            selectedServingUserInfo={
              Utilities.isUserIsConsultant() === true
                ? Globals.USER_DETAILS
                : props?.route?.params?.selectedServingUserInfo
            }
          />
        );
      case 'tab2':
        return (
          <QueueSlotList
            index={index}
            selectedServicesId={selectedServicesId}
            selectedServingUserId={
              props?.route?.params?.selectedServingUserId === undefined
                ? Utilities.isUserIsConsultant() === true
                  ? Globals.USER_DETAILS._id
                  : ''
                : props?.route?.params?.selectedServingUserId
            }
            isServingUserSelected={isServingUserSelected}
            didSelectQueueSlot={didSelectQueueSlot}
            selectedServingUserInfo={
              Utilities.isUserIsConsultant() === true
                ? Globals.USER_DETAILS
                : props?.route?.params?.selectedServingUserInfo
            }
          />
        );
      default:
        return null;
    }
  };
  const didSelectBookingSlot = (_selectedDateFrom, bookingSlotInfo) => {
    if (index === 0) {
      if (!isServingUserSelected) {
        if (Globals.BUSINESS_DETAILS.autoAssign === true) {
          setSelectedServingUserId(bookingSlotInfo?.servingUserId);
        } else {
          setSelectedServingUserId('');
        }
      }
      setSelectedDateFrom(_selectedDateFrom);
    }
  };
  const didFoundNextDate = nextDate => {};

  const didSelectQueueSlot = selectedQueueInfo => {
    if (index === 1) {
      if (!isServingUserSelected) {
        if (Globals.BUSINESS_DETAILS.autoAssign) {
          setSelectedServingUserId(selectedQueueInfo?.servingUserId);
        } else {
          setSelectedServingUserId('');
        }
      }
      setSelectedDateFrom(selectedQueueInfo?.expectedTimeOfServing);
      setSelectedQueueSlotInfo(selectedQueueInfo);
    }
  };
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: Colors.SECONDARY_COLOR}}
      pressColor={Colors.APP_MAIN_BACKGROUND_COLOR}
      bounces={false}
      style={{
        backgroundColor: Colors.APP_MAIN_BACKGROUND_COLOR,
        elevation: 0,
        height: 35,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        marginLeft: 100,
        marginRight: 100,
      }}
      renderLabel={({route, focused, color}) => (
        <View
          style={{
            height: 30,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.Gibson_Regular,
              color: focused
                ? Colors.SECONDARY_COLOR
                : Colors.PRIMARY_TEXT_COLOR,
              backgroundColor: 'transparent',
            }}>
            {route.title}
          </Text>
        </View>
      )}
      // tabStyle={{
      // }}
      labelStyle={{}}
      getLabelText={({route}) => route.title}
    />
  );

  const onIndexChange = index => {
    dispatch(BookingQueueAction.setBookingQueueIsLoading(true));
    dispatch(BookingQueueAction.setQueueIsLoading(true));
    dispatch(BookingQueueAction.setBookingIsLoading(true));
    dispatch(BookingQueueAction.setSpecialistAvailable(true));
    setIndex(index);

    dispatch(BookingQueueAction._setRightButtonEnabled(false));

    dispatch(
      BookingQueueAction._setRightButtonText(
        _module === 'reschedule'
          ? t(Translations.RESCHEDULE)
          : t(Translations.CONFIRM),
      ),
    );
    if (index === 0) {
    } else {
    }
  };

  /**
   * Purpose:load initial data
   * Created/Modified By: Vijin
   * Created/Modified Date: 11 feb 2022
   * Steps:
   */
  const loadData = () => {
    let savedUserIdInfo = Utilities.getSavedBusinessUserIdInfo();
    setUserIdText(savedUserIdInfo?.label || 'CustomerID');
    if (selectedCustomerInfo?.additionalInfo?.length > 0) {
      const userIdIndex = selectedCustomerInfo?.additionalInfo.findIndex(
        _item => _item.key === (savedUserIdInfo?.key || 'customerId'),
      );
      var _userIdValue = selectedCustomerInfo?.customerId || 0;
      if (userIdIndex !== -1) {
        _userIdValue = selectedCustomerInfo?.additionalInfo[userIdIndex]?.value;
      }
      setUserIdValue(_userIdValue);
    } else {
      setUserIdValue('N/A');
    }
  };
  /**
   * Purpose:populate date
   * Created/Modified By: Vijin
   * Created/Modified Date: 11 feb 2022
   * Steps:
   */
  const populateDates = (monthForDate, indexForDate) => {
    var count = 0;
    while (dateEnd > dateStart) {
      count = count + 1;
      tempData.push(dateStart.format());

      dateStart.add(1, 'days');
    }

    //2
    setDATA(tempData);
    setDateRefresh(!dateRefresh);

    if (_module === 'reschedule') {
      // console.log('RESCHEDULE MODULE =====');
      let appointmentDate = Utilities.convertorTimeToBusinessTimeZone(
        selectedAppointmentDateFrom,
      );
      let formattedReappointmentDate =
        moment(appointmentDate).format('DD MM YYYY');

      let rescheduleDateIndex = tempData?.findIndex(
        x => moment(x).format('DD MM YYYY') === formattedReappointmentDate,
      );

      if (rescheduleDateIndex !== undefined) {
        dispatch(BookingQueueAction._setRightButtonEnabled(false));

        dispatch(
          BookingQueueAction._setRightButtonText(
            _module === 'reschedule'
              ? t(Translations.RESCHEDULE)
              : t(Translations.CONFIRM),
          ),
        );

        dispatch(
          BookingQueueAction.setSelectedDate(tempData[rescheduleDateIndex]),
        );
        setDateDataIndex(rescheduleDateIndex);
        goToIndex(rescheduleDateIndex);
        if (
          moment(rescheduleDateIndex).format('DD MM YYYY') ===
          moment().format('DD MM YYYY')
        ) {
          setIsSelectedDateToday(true);
        } else {
          setIsSelectedDateToday(false);
        }
      }
    }
  };
  const goToIndex = scrollIndex => {
    if (dateDataIndex !== undefined && DATA.length > dateDataIndex) {
      setTimeout(() => {
        dateFlatListRef.current.scrollToIndex({
          index: scrollIndex,
          animated: true,
        });
      }, 500);
    }
  };
  const dateCellSelectedAction = (item, index) => {
    dispatch(BookingQueueAction._setIsQueueIsAvailable(true));
    dispatch(BookingQueueAction._setBusinessHourDisabled(false));
    dispatch(BookingQueueAction._setConsultantBusinessHourDisabled(false));
    dispatch(BookingQueueAction.setSelectedDate(moment(item).toISOString()));
    console.log(
      '<><><><><><Date selection Action <><><><><><><',
      moment(item).format('DD-MM-YYYY'),
    );

    dispatch(BookingQueueAction.setQueueIsLoading(true));
    dispatch(BookingQueueAction.setBookingIsLoading(true));
    dispatch(BookingQueueAction.setSpecialistAvailable(true));

    setDateDataIndex(index);

    console.log('<><><><><>', selectedDate);
    checkHoliday(moment(item).toISOString());
    checkSpecialistAvailable(moment(item).toISOString());
    if (index !== dateDataIndex) {
      dispatch(BookingQueueAction._setRightButtonEnabled(false));

      dispatch(
        BookingQueueAction._setRightButtonText(
          _module === 'reschedule'
            ? t(Translations.RESCHEDULE)
            : t(Translations.CONFIRM),
        ),
      );
      // goToIndex(index);
      if (
        Utilities.convertorTimeToBusinessTimeZone(
          moment(item).format('DD MM YYYY'),
        ) === moment().format('DD MM YYYY')
      ) {
        setIsSelectedDateToday(true);
      } else {
        setIsSelectedDateToday(false);
      }
    }
  };

  /**
      * Purpose: month cell styling
      * Created/Modified By: Vijin
      * Created/Modified Date: 4 Jun 2021
      * Steps: 1.if notread set background view color red else white(becomes hidden)
               2.if selected id and the current idex are equal set the text colrs to red
               3.if the month is January show the year at bottom
    */
  const DateItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => dateCellSelectedAction(item, index)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: responsiveWidth(24.8),
          height: 77,
          marginLeft: -3.2,
          backgroundColor:
            dateDataIndex === index
              ? Colors.SECONDARY_COLOR
              : Colors.NOTIFICATION_BACKGROUND_COLOR,
        }}>
        <Text
          style={{
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 10,
            color:
              dateDataIndex === index
                ? Colors.WHITE_COLOR
                : Colors.PRIMARY_TEXT_COLOR,
            marginBottom: 6,
          }}>
          {moment(item).format('ddd')}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.Gibson_SemiBold,
            color:
              dateDataIndex === index
                ? Colors.WHITE_COLOR
                : Colors.PRIMARY_TEXT_COLOR,
            marginBottom: 6,
          }}>
          {moment(item).format('DD')}
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.Gibson_Regular,
            color:
              dateDataIndex === index
                ? Colors.WHITE_COLOR
                : Colors.PRIMARY_TEXT_COLOR,
          }}>
          {moment(item).format('MMM')}
        </Text>
      </TouchableOpacity>
    );
  };
  /**
   * Purpose: right button action
   * Created/Modified By: Vijin
   * Created/Modified Date: 4 Jun 2021
   * Steps:
   */
  const rightButtonAction = () => {
    console.log('right button action called');
    if (!bookingQueueIsLoading) {
      if (index === 0) {
        Globals.SELECTED_CUSTOMER_INFO = selectedCustomerInfo;
        Globals.SELECTED_DATE_FROM = selectedDateFrom;

        if (isSelectedDayToday === true) {
          if (
            Globals.BUSINESS_DETAILS?.bookingSettings
              ?.allowCurrentDayBooking === true &&
            isThereAnyCanBookSlots === true
          ) {
            if (
              Utilities.isBillingEnabled() === true &&
              Utilities.isPaymentBeforeConsultation() === true
            ) {
              fetchBookingPaymentInfo();
            } else {
              bookingConfirmationRef.current.open();
            }
          } else {
            if (
              Globals.BUSINESS_DETAILS?.enableQueue === true &&
              Globals.BUSINESS_DETAILS?.pricePlan_id?.enableQueue === true &&
              isQueueSlotsAvailable
            ) {
              // console.log('navigate to queue');
              setIndex(1);
            } else {
              // console.log('consultation not available');
            }
          }
        } else if (isThereAnyCanBookSlots === true) {
          if (
            Utilities.isBillingEnabled() === true &&
            Utilities.isPaymentBeforeConsultation() === true
          ) {
            fetchBookingPaymentInfo();
          } else {
            bookingConfirmationRef.current.open();
          }
        } else {
          if (
            Globals.BUSINESS_DETAILS?.enableQueue === true &&
            Globals.BUSINESS_DETAILS?.pricePlan_id?.enableQueue === true &&
            Globals.BUSINESS_DETAILS?.waitlistSettings?.allowFutureDayQueue ===
              true &&
            isQueueSlotsAvailable
          ) {
            // console.log('navigate to queue');
            setIndex(1);
          } else {
            // console.log('consultation not available');
          }
        }
      } else if (index === 1 && selectedQueueSlotInfo !== undefined) {
        Globals.SELECTED_CUSTOMER_INFO = selectedCustomerInfo;
        Globals.SELECTED_DATE_FROM = selectedDateFrom;

        if (
          Utilities.isBillingEnabled() === true &&
          Utilities.isPaymentBeforeConsultation() === true
        ) {
          fetchQueuePaymentInfo();
        } else {
          queueConfirmationRef.current.open();
        }
      }
    }
  };
  //API Calls
  /**
              *
              * Purpose: fetch payment info
              * Created/Modified By: Jenson
              * Created/Modified Date: 27 Dec 2021
              * Steps:
                  1.fetch business list from API and append to state variable
      */
  const fetchBookingPaymentInfo = () => {
    // console.log('fetchBookingPaymentInfo function called');
    setIsLoaderLoading(true);
    var body = {};
    if (Utilities.isServiceBasedBusiness()) {
      body = {
        [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
        [APIConnections.KEYS.SERVICES]: selectedServicesId,
      };
    } else {
      body = {
        [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
      };
    }
    DataManager.performFetchPaymentInfo(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoaderLoading(false);
          let paymentInfo = responseData.objects;
          let totalValDouble = parseFloat(paymentInfo?.total);
          // console.log('total:', totalValDouble);
          if (totalValDouble > 0) {
            Globals.SELECTED_PAYMENT_INFO = paymentInfo;
            bookingPaymentConfirmationRef.current.open();
          } else {
            bookingConfirmationRef.current.open();
          }
        } else {
          // Utilities.showToast('Failed!', message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          bookingFailureRef.current.open();
        }
      },
    );
  };

  /**
              *
              * Purpose: Add new booking
              * Created/Modified By: Jenson
              * Created/Modified Date: 27 Dec 2021
              * Steps:
                  1.fetch business list from API and append to state variable
      */
  const performAddNewBooking = (
    paymentType,
    referenceNumber,
    paymentStatus,
  ) => {
    setIsLoaderLoading(true);
    var body = {};
    if (Utilities.isBillingEnabled() && paymentStatus === 'PAID') {
      //if billing enabled and payment is done
      if (Utilities.isServiceBasedBusiness()) {
        if (isServingUserSelected) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          };
        } else if (Globals.BUSINESS_DETAILS.autoAssign) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          };
        } else {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        }
      } else {
        body = {
          [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
          [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
          [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
          [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
        };
      }
    } else {
      if (Utilities.isServiceBasedBusiness()) {
        if (isServingUserSelected) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        } else if (Globals.BUSINESS_DETAILS.autoAssign) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        } else {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        }
      } else {
        body = {
          [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
        };
      }
    }

    DataManager.performAddNewBooking(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoaderLoading(false);
          // console.log('responcedata', responseData);
          setNewBookingSuccessData(responseData.objects);
          bookingSuccessRef.current.open();
        } else {
          // Utilities.showToast('Failed!', message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          bookingFailureRef.current.open();
        }
      },
    );
  };
  /**
              *
              * Purpose: Add new booking
              * Created/Modified By: Jenson
              * Created/Modified Date: 27 Dec 2021
              * Steps:
                  1.fetch business list from API and append to state variable
      */
  const performRescheduleBooking = (
    paymentType,
    referenceNumber,
    paymentStatus,
  ) => {
    setIsLoaderLoading(true);

    var body = {};
    if (Utilities.isBillingEnabled() && paymentStatus === 'PAID') {
      //if billing enabled and payment is done
      if (Utilities.isServiceBasedBusiness()) {
        if (isServingUserSelected) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [appointmentDetails?.name === 'Booking'
              ? APIConnections.KEYS.BOOKING_ID
              : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
          };
        } else if (Globals.BUSINESS_DETAILS.autoAssign) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [appointmentDetails?.name === 'Booking'
              ? APIConnections.KEYS.BOOKING_ID
              : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
          };
        } else {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [appointmentDetails?.name === 'Booking'
              ? APIConnections.KEYS.BOOKING_ID
              : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
          };
        }
      } else {
        body = {
          [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
          [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
          [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
          [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
          [appointmentDetails?.name === 'Booking'
            ? APIConnections.KEYS.BOOKING_ID
            : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
        };
      }
    } else {
      if (Utilities.isServiceBasedBusiness()) {
        if (isServingUserSelected) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [appointmentDetails?.name === 'Booking'
              ? APIConnections.KEYS.BOOKING_ID
              : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
          };
        } else if (Globals.BUSINESS_DETAILS.autoAssign) {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [appointmentDetails?.name === 'Booking'
              ? APIConnections.KEYS.BOOKING_ID
              : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
          };
        } else {
          body = {
            [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
            [appointmentDetails?.name === 'Booking'
              ? APIConnections.KEYS.BOOKING_ID
              : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
          };
        }
      } else {
        body = {
          [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
          [appointmentDetails?.name === 'Booking'
            ? APIConnections.KEYS.BOOKING_ID
            : APIConnections.KEYS.QUEUE_ID]: appointmentDetails?._id,
        };
      }
    }

    DataManager.performRescheduleAppointment(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          // console.log('responsedata ---', responseData);
          setReScheduleSuccessId(responseData?.objects?._id);
          setReScheduleSuccessName(responseData?.objects?.name);
          setIsLoaderLoading(false);
          bookingSuccessRef.current.open();
        } else {
          // Utilities.showToast('Failed!', message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          bookingFailureRef.current.open();
        }
      },
    );
  };
  /**
             *
             * Purpose: fetch payment info
             * Created/Modified By: Jenson
             * Created/Modified Date: 27 Dec 2021
             * Steps:
                 1.fetch business list from API and append to state variable
     */
  const fetchQueuePaymentInfo = () => {
    setIsLoaderLoading(true);
    var body = {};
    if (Utilities.isServiceBasedBusiness()) {
      body = {
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.GENDER]: selectedGender,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
          selectedQueueSlotInfo?.expectedTimeOfServing,
        [APIConnections.KEYS.PREFERRED_TIME_FROM]: selectedQueueSlotInfo?.from,
        [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
        [APIConnections.KEYS.SERVICES]: selectedServicesId,
      };
    } else {
      body = {
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.GENDER]: selectedGender,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
          selectedQueueSlotInfo?.expectedTimeOfServing,
        [APIConnections.KEYS.PREFERRED_TIME_FROM]: selectedQueueSlotInfo?.from,
        [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
      };
    }

    DataManager.performFetchQueuePaymentInfo(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoaderLoading(false);
          let paymentInfo = responseData.objects;
          let totalValDouble = parseFloat(paymentInfo?.total);

          if (totalValDouble > 0) {
            Globals.SELECTED_PAYMENT_INFO = paymentInfo;
            queuePaymentConfirmationRef.current.open();
          } else {
            queueConfirmationRef.current.open();
          }
        } else {
          // Utilities.showToast('Failed!', message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          queueFailureRef.current.open();
        }
      },
    );
  };
  /**
                  *
                  * Purpose: Add new booking
                  * Created/Modified By: Jenson
                  * Created/Modified Date: 27 Dec 2021
                  * Steps:
                      1.fetch business list from API and append to state variable
          */
  const performAddNewQueue = (paymentType, referenceNumber, paymentStatus) => {
    setIsLoaderLoading(true);
    var body = {};
    if (Utilities.isBillingEnabled() && paymentStatus === 'PAID') {
      //if billing enabled and payment is done
      if (Utilities.isServiceBasedBusiness()) {
        if (isServingUserSelected) {
          body = {
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.GENDER]: selectedGender,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
              selectedQueueSlotInfo?.expectedTimeOfServing,
            [APIConnections.KEYS.PREFERRED_TIME_FROM]:
              selectedQueueSlotInfo?.from,
            [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        } else if (Globals.BUSINESS_DETAILS.autoAssign) {
          body = {
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.GENDER]: selectedGender,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
              selectedQueueSlotInfo?.expectedTimeOfServing,
            [APIConnections.KEYS.PREFERRED_TIME_FROM]:
              selectedQueueSlotInfo?.from,
            [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        } else {
          body = {
            [APIConnections.KEYS.GENDER]: selectedGender,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
              selectedQueueSlotInfo?.expectedTimeOfServing,
            [APIConnections.KEYS.PREFERRED_TIME_FROM]:
              selectedQueueSlotInfo?.from,
            [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
            [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
            [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
            [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        }
      } else {
        body = {
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.GENDER]: selectedGender,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
            selectedQueueSlotInfo?.expectedTimeOfServing,
          [APIConnections.KEYS.PREFERRED_TIME_FROM]:
            selectedQueueSlotInfo?.from,
          [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
          [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
          [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
          [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
        };
      }
    } else {
      if (Utilities.isServiceBasedBusiness()) {
        if (isServingUserSelected) {
          body = {
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.GENDER]: selectedGender,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
              selectedQueueSlotInfo?.expectedTimeOfServing,
            [APIConnections.KEYS.PREFERRED_TIME_FROM]:
              selectedQueueSlotInfo?.from,
            [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        } else if (Globals.BUSINESS_DETAILS.autoAssign) {
          body = {
            [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
            [APIConnections.KEYS.GENDER]: selectedGender,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
              selectedQueueSlotInfo?.expectedTimeOfServing,
            [APIConnections.KEYS.PREFERRED_TIME_FROM]:
              selectedQueueSlotInfo?.from,
            [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        } else {
          body = {
            [APIConnections.KEYS.GENDER]: selectedGender,
            [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
            [APIConnections.KEYS.CUSTOMER_ID]:
              Globals.SELECTED_CUSTOMER_INFO._id,
            [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
              selectedQueueSlotInfo?.expectedTimeOfServing,
            [APIConnections.KEYS.PREFERRED_TIME_FROM]:
              selectedQueueSlotInfo?.from,
            [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
            [APIConnections.KEYS.SERVICES]: selectedServicesId,
          };
        }
      } else {
        body = {
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.GENDER]: selectedGender,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
            selectedQueueSlotInfo?.expectedTimeOfServing,
          [APIConnections.KEYS.PREFERRED_TIME_FROM]:
            selectedQueueSlotInfo?.from,
          [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
        };
      }
    }

    DataManager.performAddNewQueue(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setNewBookingSuccessData(responseData.objects);
          setIsLoaderLoading(false);
          queueSuccessRef.current.open();
        } else {
          // Utilities.showToast('Failed!', message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          queueFailureRef.current.open();
        }
      },
    );
  };

  //POP UPS CONFIGURATION
  /**
      *
        * Purpose:BOOKING CONFIRMATION
        * Created/Modified By: Vijin Raj
        * Created/Modified Date: 29 Jan 2022
        * Steps:
            1.open the rb sheet
            2.pass the selected value
      */

  const GetBookingConfirmationPopUp = () => {
    return (
      <RBSheet
        ref={bookingConfirmationRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={DisplayUtils.setHeight(35)}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <BookingConfirmationPopUp
          refRBSheet={bookingConfirmationRef}
          didSelectYes={handleDidSelectBookingYes}
          didSelectNo={handleDidSelectBookingNo}
        />
      </RBSheet>
    );
  };

  const handleDidSelectBookingYes = () => {
    // console.log('Yes');
    if (_module !== 'reschedule') {
      performAddNewBooking('', '', '');
    } else {
      if (
        appointmentDetails?.name === 'Booking' ||
        appointmentType === 'Booking'
      ) {
        performRescheduleBooking('', '', '');
      } else {
        //DELETE AND PERFORM RESCHEDULE
      }
    }
  };
  const handleDidSelectBookingNo = () => {
    // console.log('No');
  };
  /**
          *
            * Purpose:QUEUE CONFIRMATION
            * Created/Modified By: Vijin Raj
            * Created/Modified Date: 31 Jan 2022
            * Steps:
                1.open the rb sheet
                2.pass the selected value
          */

  const GetQueueConfirmationPopUp = () => {
    return (
      <RBSheet
        ref={queueConfirmationRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={DisplayUtils.setHeight(35)}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <QueueConfirmationPopUp
          refRBSheet={queueConfirmationRef}
          didSelectYes={handleDidSelectQueueYes}
          didSelectNo={handleDidSelectQueueNo}
        />
      </RBSheet>
    );
  };
  const handleDidSelectQueueYes = () => {
    // console.log('Yes');
    performAddNewQueue('', '', '');
  };
  const handleDidSelectQueueNo = () => {
    // console.log('No');
  };
  /**
      *
        * Purpose:BOOKING CONFIRMATION
        * Created/Modified By: Vijin Raj
        * Created/Modified Date: 29 Jan 2022
        * Steps:
            1.open the rb sheet
            2.pass the selected value
      */

  const GetBookingPaymentConfirmationPopUp = () => {
    return (
      <RBSheet
        ref={bookingPaymentConfirmationRef}
        closeOnDragDown={false}
        closeOnPressMask={false}
        height={DisplayUtils.setHeight(85)}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <BookingPaymentConfirmationPopUp
          refRBSheet={bookingPaymentConfirmationRef}
          didSelectYes={handleDidSelectPaymentBookingYes}
          didSelectNo={handleDidSelectPaymentBookingNo}
        />
      </RBSheet>
    );
  };
  const handleDidSelectPaymentBookingYes = (paymentType, referenceNumber) => {
    // console.log('Yes');

    if (_module !== 'reschedule') {
      performAddNewBooking(paymentType, referenceNumber, 'PAID');
    } else {
      if (
        appointmentDetails?.name === 'Booking' ||
        appointmentType === 'Booking'
      ) {
        performRescheduleBooking(paymentType, referenceNumber, 'PAID');
      } else {
        //DELETE AND PERFORM RESCHEDULE
      }
    }
  };
  const handleDidSelectPaymentBookingNo = () => {
    // console.log('No');
  };
  /**
      *
       * Purpose:BOOKING CONFIRMATION
       * Created/Modified By: Vijin Raj
       * Created/Modified Date: 29 Jan 2022
       * Steps:
           1.open the rb sheet
           2.pass the selected value
      */

  const GetQueuePaymentConfirmationPopUp = () => {
    return (
      <RBSheet
        ref={queuePaymentConfirmationRef}
        closeOnDragDown={false}
        closeOnPressMask={false}
        height={DisplayUtils.setHeight(85)}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <QueuePaymentConfirmationPopUp
          refRBSheet={queuePaymentConfirmationRef}
          didSelectYes={handleDidSelectPaymentQueueYes}
          didSelectNo={handleDidSelectPaymentQueueNo}
        />
      </RBSheet>
    );
  };
  const handleDidSelectPaymentQueueYes = (paymentType, referenceNumber) => {
    // console.log('Yes');
    performAddNewQueue(paymentType, referenceNumber, 'PAID');
  };
  const handleDidSelectPaymentQueueNo = () => {
    // console.log('No');
  };

  /**
      *
         * Purpose:BOOKING SUCCESS
         * Created/Modified By: Vijin Raj
         * Created/Modified Date: 29 Jan 2022
         * Steps:
             1.open the rb sheet
             2.pass the selected value
      */

  const GetBookingSuccessPopUp = () => {
    return (
      <RBSheet
        ref={bookingSuccessRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={380}
        // onClose={}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <BookingSuccessPopUp
          refRBSheet={bookingSuccessRef}
          viewDetails={
            _module === 'reschedule'
              ? handleViewReScheduleBookingDetails
              : handleViewBookingDetails
          }
          // didSelectNo={handleDidSelectBookingNo}
          onClosePopup={bookingSuccessOnClose}
        />
      </RBSheet>
    );
  };

  const handleViewBookingDetails = () => {
    navigation.navigate('AppointmentDetailsScreen', {
      selectedAppointment_id: newBookingSuccessData._id,
      selectedAppointmentType: newBookingSuccessData.name,
      isFrom: 'NEW_BOOKING_SCREEN',
    });
  };
  const handleViewReScheduleBookingDetails = () => {
    // console.log('view reschedule booking data func called');
    navigation.push('AppointmentDetailsScreen', {
      selectedAppointment_id: reScheduleSuccessDataId,
      selectedAppointmentType: reScheduleSuccessDataName,
      isFrom: 'from reschedule',
    });
  };
  /**
      *
         * Purpose:BOOKING SUCCESS
         * Created/Modified By: Vijin Raj
         * Created/Modified Date: 29 Jan 2022
         * Steps:
             1.open the rb sheet
             2.pass the selected value
      */

  const GetQueueSuccessPopUp = () => {
    return (
      <RBSheet
        ref={queueSuccessRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={350}
        // onClose={}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <QueueSuccessPopUp
          refRBSheet={queueSuccessRef}
          viewDetails={handleViewBookingDetails}
          onClosePopup={bookingSuccessOnClose}
        />
      </RBSheet>
    );
  };
  const bookingSuccessOnClose = () => {
    console.log('Goto dashboard');
    // navigation.reset({
    //   index: 0,
    //   routes: [{name: 'DashboardScreen'}],
    // });
    navigation.navigate('DashboardScreen');
  };
  // const handleDidSelectBookingYes = () => {
  //     console.log('Yes')

  // };
  // const handleDidSelectBookingNo = () => {
  //     console.log('No')
  // };
  /**
      *
         * Purpose:BOOKING FAILURE
         * Created/Modified By: Vijin Raj
         * Created/Modified Date: 29 Jan 2022
         * Steps:
             1.open the rb sheet
             2.pass the selected value
      */

  const GetBookingFailurePopUp = () => {
    return (
      <RBSheet
        ref={bookingFailureRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={320}
        // onClose={bookingSuccessOnClose}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <BookingFailurePopUp
          refRBSheet={bookingFailureRef}
          // didSelectYes={handleDidSelectBookingYes}
          // didSelectNo={handleDidSelectBookingNo}
        />
      </RBSheet>
    );
  };
  /**
      *
         * Purpose:BOOKING FAILURE
         * Created/Modified By: Vijin Raj
         * Created/Modified Date: 29 Jan 2022
         * Steps:
             1.open the rb sheet
             2.pass the selected value
      */

  const GetQueueFailurePopUp = () => {
    return (
      <RBSheet
        ref={queueFailureRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={320}
        // onClose={bookingSuccessOnClose}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <QueueFailurePopUp
          refRBSheet={queueFailureRef}
          // didSelectYes={handleDidSelectBookingYes}
          // didSelectNo={handleDidSelectBookingNo}
        />
      </RBSheet>
    );
  };
  const backButtonAction = () => {
    navigation.goBack();
    Globals.AVAILABLE_BUTTON = null;
    dispatch(BookingQueueAction.setAvailabilityInfo({}));
  };
  //final return
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.APP_MAIN_BACKGROUND_COLOR,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}>
        <StatusBar
          backgroundColor={Colors.BACKGROUND_COLOR}
          barStyle="dark-content"
        />
        <GetBookingConfirmationPopUp />
        <GetBookingSuccessPopUp />
        <GetQueueSuccessPopUp />
        <GetBookingFailurePopUp />
        <GetQueueConfirmationPopUp />
        <GetBookingPaymentConfirmationPopUp />
        <GetQueuePaymentConfirmationPopUp />
        <GetQueueFailurePopUp />
        <LoadingIndicator visible={isLoaderLoading} />
        {/* HEADER */}
        <View style={styles.header}>
          <View
            style={{
              marginTop: 16,
              marginLeft: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={() => backButtonAction()}>
              <Image
                style={{
                  height: 17,
                  width: 24,
                  transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                }}
                source={Images.BACK_ARROW_IMAGE}
              />
            </TouchableOpacity>
            <GetImage
              style={{
                marginTop: 0,
                marginLeft: 18,
                width: 48,
                height: 48,
                borderRadius: 48 / 2,
                borderWidth: 2,
                borderColor: Colors.SECONDARY_COLOR,
              }}
              fullName={(
                (selectedCustomerInfo?.firstName || 'N/A') +
                ' ' +
                (selectedCustomerInfo?.lastName || '')
              ).trim()}
              url={selectedCustomerInfo?.image}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  marginTop: 6,
                  fontFamily: Fonts.Gibson_SemiBold,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: 18,
                  width: DisplayUtils.setWidth(65),
                  textAlign: 'left',
                }}
                numberOfLines={1}>
                {selectedCustomerInfo?.firstName || 'N/A'} {''}
                {selectedCustomerInfo?.lastName || ''}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginTop: 4,
                    fontFamily: Fonts.Gibson_Regular,
                    color: Colors.PRIMARY_TEXT_COLOR,
                    fontSize: 14,
                    textAlign: 'left',
                  }}
                  numberOfLines={1}>
                  {I18nManager.isRTL === true
                    ? t(Translations.CUSTOMER_ID) + ' : '
                    : t(Translations.CUSTOMER_ID) + ':'}
                </Text>
                <View
                  style={{
                    flexDirection:
                      I18nManager.isRTL === true ? 'row-reverse' : 'row',
                    marginLeft:
                      I18nManager.isRTL === true ? responsiveHeight(7) : 0,
                  }}>
                  <Text
                    style={{
                      marginTop: 4,
                      fontFamily: Fonts.Gibson_Regular,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      fontSize: 14,
                      textAlign: 'left',
                    }}
                    numberOfLines={1}>
                    {Globals.BUSINESS_DETAILS.customerPrefix}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      fontFamily: Fonts.Gibson_Regular,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      fontSize: 14,
                      textAlign: 'left',
                    }}
                    numberOfLines={1}>
                    {userIdValue}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* DAY SELECT LABEL */}
        <Text
          style={{
            marginTop: 20,
            fontFamily: Fonts.Gibson_Regular,
            color: Colors.PRIMARY_TEXT_COLOR,
            fontSize: 16,
            alignSelf: 'center',
          }}
          numberOfLines={1}>
          {t(Translations.WHICH)}{' '}
          <Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              color: Colors.PRIMARY_COLOR,
              fontSize: 16,
            }}>
            {t(Translations.DAY)}{' '}
          </Text>
          {t(Translations.YOU_WOULD_LIKE_TO_SELECT)}
        </Text>

        {/* CALENDER */}

        <View style={{marginHorizontal: 10, marginTop: 10}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DATA.length === 0
              ? null
              : DATA.map((item, index) => {
                  return <DateItem item={item} index={index} />;
                })}
          </ScrollView>
        </View>
        {/* TIME SELECT LABEL */}
        <Text
          style={{
            marginTop: 20,
            fontFamily: Fonts.Gibson_Regular,
            color: Colors.PRIMARY_TEXT_COLOR,
            fontSize: 16,
            alignSelf: 'center',
            marginBottom: 20,
          }}
          numberOfLines={1}>
          {t(Translations.WHAT)}{' '}
          <Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              color: Colors.PRIMARY_COLOR,
              fontSize: 16,
            }}>
            {t(Translations.TIME)}{' '}
          </Text>
          {t(Translations.YOU_WOULD_LIKE_TO_CHOOSE)}
        </Text>

        {/* TABS */}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={onIndexChange}
          renderTabBar={renderTabBar}
          lazy={true}
          initialLayout={{width: layout.width}}
        />

        {/* BOTTOM BAR */}
        <View
          style={{
            borderTopColor: Colors.SHADOW_COLOR,
            justifyContent: 'center',
            borderTopWidth: 0.5,
            height: 60,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: insets.bottom,
            flexDirection: 'row',
            //Shadow props
            backgroundColor: Colors.WHITE_COLOR,
            shadowColor: Colors.SHADOW_COLOR,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 8,
          }}>
          <TouchableOpacity
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Colors.SHADOW_COLOR,
              height: 60,
              width: 75,
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('DashboardScreen')}>
            <Image
              source={Images.YWAIT_Y_LOGO}
              style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
                tintColor: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: _isRightButtonEnabled
                  ? Colors.SECONDARY_COLOR
                  : Colors.TAB_VIEW_LABEL_COLOR,
                height: 36,
                width: 167,
                alignSelf: 'flex-end',
                marginRight: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
              }}
              activeOpacity={1}
              disabled={_isRightButtonEnabled ? false : true}
              onPress={() => rightButtonAction()}>
              <Text
                style={{
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 13,
                  color: Colors.WHITE_COLOR,
                }}>
                {_rightButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.PRIMARY_WHITE,
    width: DisplayUtils.setWidth(100),
    height: 75,
    borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
  },
  tabContainer: {},
});
