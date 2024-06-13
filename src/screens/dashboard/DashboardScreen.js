import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
  ScrollView,
  Platform,
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import moment from 'moment';
// import {BarChart, PieChart} from '../../charts'
import {BarChart} from '../../charts/src';
import {PieChart} from '../../charts/src';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect} from '@react-navigation/core';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../constants';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import StorageManager from '../../helpers/storageManager/StorageManager';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import {GetImage} from '../shared/getImage/GetImage';
import APIConnections from '../../helpers/apiManager/APIConnections';
import {
  GraphFilterOption,
  DepartmentGraphFilterOption,
} from '../../helpers/enums/Enums';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import GraphFilterOptionPopup from './popups/GraphFilterOptionPopup';
import AvailabilityStatusChangePopup from './popups/AvailabilityStatusChangePopup';
import {t} from 'i18next';

import AwesomeAlert from 'react-native-awesome-alerts';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import DashboardLabelScreen from './DashboardLabelScreen';
const DashboardScreen = () => {
  //Declaration
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const forceUpdate = React.useReducer(bool => !bool)[1];
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardCountInfo, setDashboardCountInfo] = useState({});
  const [selectedServingTimeOption, setSelectedServingTimeOption] = useState(
    GraphFilterOption.daily,
  );
  const [selectedBookingCountOption, setSelectedBookingCountOption] = useState(
    GraphFilterOption.daily,
  );
  const [selectedDepartmentVisitOption, setSelectedDepartmentVisitOption] =
    useState(DepartmentGraphFilterOption.daily);
  const [isBusinessNameImageLoadError, setIsBusinessNameImageLoadError] =
    useState(false);
  const [servingTimeGraphData, setServingTimeGraphData] = useState([]);
  const [bookingCountGraphData, setBookingCountGraphData] = useState([]);
  const [departmentVisitGraphData, setDepartmentVisitGraphData] = useState([]);
  const [servingTimeMaxValue, setServingTimeMaxValue] = useState(0);
  const [bookingTimeMaxValue, setBookingTimeMaxValue] = useState(0);
  const [servingTimeAverage, setServingTimeAverage] = useState(0);
  const [bookingTimeAverage, setBookingTimeAverage] = useState(0);
  const [unReadCount, setUnReadCount] = useState(0);
  const [availabilityText, setAvailabilityText] = useState('');

  const [selectedWeekDayText, setSelectedWeekDayText] = useState(
    t(Translations.TODAY),
  );
  const [dateDataIndex, setDateDataIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    Utilities.convertorTimeToBusinessTimeZone(moment().format()),
  );
  const [dateRefresh, setDateRefresh] = useState(false);
  const [DATA, setDATA] = useState([]);
  const dateFlatListRef = useRef();
  const refRBSheetGraphFilter = useRef();
  const refRBSheetAvailabilityPopup = useRef();

  //redux state for tabletview
  const isTablet = useSelector(state => state.tablet.isTablet);

  useEffect(() => {
    getAverageServingTimeData();
    getAverageBookingCountData();
    if (isDepartmentChartNeeded() === true) {
      getDepartmentVisitData();
    }
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getUserDetails(Globals.USER_DETAILS?._id);
      if (Utilities.isUserIsConsultant() === true) {
        getAvailability();
      }

      return () => {};
    }, []),
  );

  useEffect(() => {
    getTokenUUID().then(res => {
      Globals.TOKEN_UUID = res;
    });
    if (Platform.OS === 'ios') {
      fetchFCMTokenFromAPNS();
    }
    //Create OR use Token UUID
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      performDeviceRegister();
      console.log('App business Id -----', Globals.BUSINESS_ID);
      setUnReadCount(Globals.UN_READ_NOTIFICATION_COUNT);
      performGetNotificationList();

      let notification = Globals.NOTIFICATION_DATA;
      console.log(
        'HOME Globals.NOTIFICATION_DATA: ',
        Globals.NOTIFICATION_DATA,
      );
      if (notification.data.type !== undefined) {
        handleNotificationTap();
      }
      return () => {};
    }, []),
  );

  const handleNotificationTap = () => {
    let notification = Globals.NOTIFICATION_DATA;
    var _selectedNotificationId = notification?.data?.booking_id
      ? notification?.data?.booking_id.replace(/['"]+/g, '')
      : notification?.data?.waitlist_id
      ? notification?.data?.waitlist_id.replace(/['"]+/g, '')
      : ''; //removing the single quotes
    var _notificationType = notification.data.booking_id ? 'Booking' : 'Queue';
    console.log('HOME handleNotificationTap: ', notification.data.type);
    console.log(
      'ISNavigationNeeded: ',
      Globals.IS_NOTIFICATION_NAVIGATION_NEEDED,
    );
    if (Globals.IS_NOTIFICATION_NAVIGATION_NEEDED) {
      Globals.IS_NOTIFICATION_NAVIGATION_NEEDED = false;
      if (notification.data.type !== undefined) {
        //console.log('ENTERED IS AUTHORIZED');
        if (
          _selectedNotificationId !== undefined &&
          _selectedNotificationId !== ''
        ) {
          if (
            notification.data.type === 'BOOKING-PENDING' ||
            notification.data.type === 'BOOKING-SERVING' ||
            notification.data.type === 'BOOKING-CANCELLED' ||
            notification.data.type === 'BOOKING-UPDATE' ||
            notification.data.type === 'BOOKING-SERVED' ||
            notification.data.type === 'WAITLIST-PENDING' ||
            notification.data.type === 'WAITLIST-SERVING' ||
            notification.data.type === 'WAITLIST-SERVED' ||
            notification.data.type === 'QUEUE-CANCELLED' ||
            notification.data.type === 'DIRECT-CONSULTATION-SERVING'
          ) {
            navigation.navigate('AppointmentDetailsScreen', {
              selectedAppointment_id: _selectedNotificationId,
              selectedAppointmentType: _notificationType,
              isFrom: 'DASH_BOARD',
            });
          }
        }
      }
    }
  };
  const getTokenUUID = async () => {
    const uuid = await Utilities.getTokenUUID();
    if (uuid === null || uuid === undefined) {
      let timeStamp = Date.parse(new Date());
      console.log('timeStamp: ', timeStamp);
      Globals.TOKEN_UUID = timeStamp;
      Utilities.saveTokenUUID(timeStamp);
      return timeStamp;
    }
    Globals.TOKEN_UUID = uuid;
    return uuid;
  };

  const fetchFCMTokenFromAPNS = () => {
    const body = {
      application: Globals.APPLICATION_ID,
      sandbox: false, //NEED FALSE FOR IOS ARCHIVE BUILD SCHEME..
      apns_tokens: [Globals.APNS_TOKEN],
    };
    console.log('body for token ==============', body);
    fetch('https://iid.googleapis.com/iid/v1:batchImport', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAGm1FANg:APA91bEK7fefXZ5xBwWl37ZTA-tKeT5QkhIP1n9OH58-2ggszlkpiqY_dH8p29cgdel0lS4CmZtdirVkzI8FD77VJtV3iotgnTVLzLZCTBo0hCwFxDYx1Xm-kGNhz9DvyZLlMXQ7gNFB',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('**fetchFCMTokenFromAPNS===========', responseJson);

        if (responseJson?.results?.length > 0) {
          console.log('Inside first if');
          if (responseJson?.results[0]?.registration_token) {
            console.log('Inside second if');
            Globals.PUSH_NOTIFICATION_TOKEN =
              responseJson?.results[0]?.registration_token;
          }
        }
      });
  };

  const configureUserAvailability = () => {
    let _availabilityInfo =
      Globals.SHARED_VALUES.CURRENT_USER_AVAILABILITY_INFO;
    let _availabilityText = '';
    Globals.SHARED_VALUES.CURRENT_USER_AVAILABILITY_STATUS = '';
    if (_availabilityInfo !== undefined) {
      if (_availabilityInfo.availability === 'ON A BREAK') {
        _availabilityText = 'On a break';
        Globals.SHARED_VALUES.CURRENT_USER_AVAILABILITY_STATUS = 'ON A BREAK';
        //Update from, to times
        if (_availabilityInfo.expiry !== undefined) {
          let _fromTime = _availabilityInfo.expiry.fromTime;
          let _toTime = _availabilityInfo.expiry.toTime;
          let _convertedFromTime = moment(_fromTime);

          let _convertedToTime = moment(_toTime);

          Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME = _convertedFromTime;
          Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME = _convertedToTime;
          console.log(
            `_fromTime: ${_fromTime} _convertedFromTime: ${_convertedFromTime}`,
          );
        }
      } else if (_availabilityInfo.availability === 'AVAILABLE') {
        _availabilityText = t(Translations.AVAILABLE);
        Globals.SHARED_VALUES.CURRENT_USER_AVAILABILITY_STATUS = 'AVAILABLE';
        Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME = '';
        Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME = '';
      } else if (_availabilityInfo.availability === 'NOTAVAILABLE') {
        _availabilityText = t(Translations.NOT_AVAILABLE);
        Globals.SHARED_VALUES.CURRENT_USER_AVAILABILITY_STATUS = 'NOTAVAILABLE';
        Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME = '';
        Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME = '';
      }
    }
    setAvailabilityText(_availabilityText);
  };

  /**
*
* Purpose:perform device register
* Created/Modified By: Sudhin
* Created/Modified Date: 18 Feb 2022
* Steps:
  1.if login success navigate to drawer navigator else show the message on toast
*/
  const performDeviceRegister = () => {
    console.log(
      'Globals.PUSH_NOTIFICATION_TOKEN',
      Globals.PUSH_NOTIFICATION_TOKEN,
    );
    const body = {
      [APIConnections.KEYS.DEVICE_ID]: Globals.TOKEN_UUID,
      [APIConnections.KEYS.DEVICE]: Platform.OS,
      [APIConnections.KEYS.USER_ID]: Globals.USER_DETAILS._id,
      [APIConnections.KEYS.TOKEN]: Globals.PUSH_NOTIFICATION_TOKEN,
    };
    DataManager.performDeviceRegister(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            // Utils.showToast('Success!', message, 'success', 'bottom');
          } else {
            // setIsLoading(false);
          }
        } else {
          // Utils.showToast(t(Translations.FAILED), message, 'error', 'bottom');
          // setIsLoading(false);
        }
      },
    );
  };

  const businessNameImageError = () => {
    console.log('Business Name image load error');
    setIsBusinessNameImageLoadError(true);
  };
  //Button actions
  const profileButtonAction = () => {
    navigation.navigate('UserProfileScreen');
  };
  const availabilityStatusChangeButtonAction = () => {
    //Fetch user latest info ands show status popup
    getUserDetails(Globals.USER_DETAILS?._id, true);
  };
  const servingTimeFilterButtonAction = () => {
    Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE = 'ServingTime';
    Globals.SHARED_VALUES.SELECTED_GRAPH_FILTER_OPTION =
      selectedServingTimeOption;
    refRBSheetGraphFilter.current.open();
  };
  const bookingCountFilterButtonAction = () => {
    Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE = 'BookingCount';
    Globals.SHARED_VALUES.SELECTED_GRAPH_FILTER_OPTION =
      selectedBookingCountOption;
    refRBSheetGraphFilter.current.open();
  };
  const departmentFilterButtonAction = () => {
    Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE = 'DepartmentVisit';
    Globals.SHARED_VALUES.SELECTED_GRAPH_FILTER_OPTION =
      selectedDepartmentVisitOption;
    refRBSheetGraphFilter.current.open();
  };

  //Calendar date helpers

  var dateStart = moment(
    moment()
      .utcOffset(Globals.BUSINESS_DETAILS.timeZone.offset)
      .format('MM-DD-YYYY'),
    'MM-DD-YYYY',
  );

  var dateEnd = moment().add(
    -(Globals.BUSINESS_DETAILS?.bookingSettings?.advanceBookingAvialability
      ?.isActive
      ? Globals.BUSINESS_DETAILS?.bookingSettings?.advanceBookingAvialability
          ?.days
      : 30),
    'days',
  );

  var tempData = [];

  useEffect(() => {
    console.log('date data index', dateDataIndex);
    setDateDataIndex(0);
    setSelectedDate(
      Utilities.convertorTimeToBusinessTimeZone(moment().format()),
    );
    populateDates(
      Utilities.convertorTimeToBusinessTimeZone(moment().format()),
      moment().utcOffset(Globals.BUSINESS_DETAILS.timeZone.offset).format('D') -
        1,
    );
  }, []);

  /**
   * Purpose:populate date
   * Created/Modified By: Vijin
   * Created/Modified Date: 11 feb 2022
   * Steps:
   */
  const populateDates = (monthForDate, indexForDate) => {
    console.log('dateEnd', dateEnd);
    console.log('dateStart', dateStart);
    var count = 0;
    while (dateEnd < dateStart) {
      //console.log(`inside while dateEnd: ${dateEnd} dateStart: ${dateStart}`);
      count = count + 1;
      tempData.push(dateStart.format());
      dateStart.add(-1, 'days');
    }
    //console.log('count', count);
    //console.log('tempData: ', tempData);
    //2
    setDATA(tempData);

    setDateRefresh(!dateRefresh);
  };

  const goToIndex = scrollIndex => {
    if (dateDataIndex !== undefined && DATA?.length > dateDataIndex) {
      setTimeout(() => {
        console.log('scrolling to index', dateDataIndex);
        dateFlatListRef.current.scrollToIndex({
          index: scrollIndex,
          animated: true,
        });
      }, 500);
    }
  };
  const dateCellSelectedAction = (item, index) => {
    let selectedWeekDay = Utilities.getFormattedWeekDay(item);
    setSelectedWeekDayText(selectedWeekDay);

    setSelectedDate(item);
    getDashboardCounts(item);
    setDateDataIndex(index);
    // goToIndex(index);
  };
  /**
   * Purpose: render the dates
   * Created/Modified By: sudhin
   * Created/Modified Date: 19 jan 2022
   * Steps: Render the date
   */
  const renderDates = ({item, index}) => {
    //  console.log('renderDate', item);
    return <DateItem item={item} index={index} />;
  };

  /**
  * Purpose: month cell styling
  * Created/Modified By: Vijin
  * Created/Modified Date: 4 Jun 2021
  * Steps: 1.if not read set background view color red else white(becomes hidden)
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
          width:
            isTablet === true ? responsiveWidth(13) : responsiveWidth(21.5),
          height: isTablet === true ? 88 : 77,
          backgroundColor:
            dateDataIndex === index
              ? Colors.SECONDARY_COLOR
              : Colors.NOTIFICATION_BACKGROUND_COLOR,
        }}>
        <Text
          style={{
            fontFamily: Fonts.Gibson_Regular,
            fontSize: isTablet === true ? 15 : 10,
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
            fontSize: isTablet === true ? 22 : 20,
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
            fontSize: isTablet === true ? 22 : 20,
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

  //Bar chart helpers
  const configureServingTimeChart = info => {
    var _servingTimeGraphData = [];
    var _maxValue = 0;
    if (info !== undefined && info !== null) {
      let actualList = info?.actualList || [];
      let previousList = info?.previousList || [];

      if (actualList?.length === previousList?.length) {
        actualList.map((actualListItem, actualListItemIndex) => {
          var _servingTimeGraphDataItem = {};
          let actualValue = actualListItem.actualTime || 0;
          if (actualValue >= _maxValue) {
            _maxValue = actualValue;
          }
          _servingTimeGraphDataItem.value = actualValue;
          let dateFromLabel = Utilities.getUtcToLocalWithFormat(
            actualListItem.dateFrom,
            'DD MMM',
          );
          _servingTimeGraphDataItem.label = dateFromLabel;
          _servingTimeGraphDataItem.spacing = 2;
          _servingTimeGraphDataItem.labelWidth = 55;
          _servingTimeGraphDataItem.labelTextStyle = {
            fontSize: 13,
            color: Colors.BLACK_COLOR,
            textAlign: 'center',
          };
          _servingTimeGraphDataItem.frontColor = Colors.SECONDARY_COLOR;
          _servingTimeGraphDataItem.topLabelComponent = () => {
            return (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.BLACK_COLOR,
                  textAlign: 'center',
                }}>
                {actualListItem.actualTime || 0}
              </Text>
            );
          };
          _servingTimeGraphData.push(_servingTimeGraphDataItem);

          let _previousItem = previousList[actualListItemIndex];
          var _servingTimeGraphDataItem2 = {};
          let previousValue = _previousItem.actualTime || 0;
          if (previousValue >= _maxValue) {
            _maxValue = previousValue;
          }
          _servingTimeGraphDataItem2.value = previousValue;
          _servingTimeGraphDataItem2.frontColor = Colors.PRIMARY_COLOR;
          _servingTimeGraphDataItem2.topLabelComponent = () => {
            return (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.BLACK_COLOR,
                  textAlign: 'center',
                }}>
                {_previousItem.actualTime || 0}
              </Text>
            );
          };
          _servingTimeGraphData.push(_servingTimeGraphDataItem2);
        });
      }
      let averageTime = info?.averageTime || 0;
      if (averageTime >= _maxValue) {
        _maxValue = averageTime;
      }
      console.log('setServingTimeAverage: ', averageTime);
      setServingTimeAverage(averageTime);
      console.log('setServingTimeMaxValue: ', _maxValue);
      setServingTimeMaxValue(_maxValue);
    }
    setServingTimeGraphData(_servingTimeGraphData);
    console.log('setServingTimeGraphData: ', _servingTimeGraphData);
  };

  const configureBookingCountChart = info => {
    var _bookingCountGraphData = [];
    var _maxValue = 0;
    if (info !== undefined && info !== null) {
      let actualList = info?.actualList || [];
      let previousList = info?.previousList || [];

      if (actualList?.length === previousList?.length) {
        actualList.map((actualListItem, actualListItemIndex) => {
          var _servingTimeGraphDataItem = {};
          let actualValue = actualListItem.usersServed || 0;
          if (actualValue >= _maxValue) {
            _maxValue = actualValue;
          }
          _servingTimeGraphDataItem.value = actualValue;
          let dateFromLabel = Utilities.getUtcToLocalWithFormat(
            actualListItem.dateFrom,
            'DD MMM',
          );
          _servingTimeGraphDataItem.label = dateFromLabel;
          _servingTimeGraphDataItem.spacing = 2;
          _servingTimeGraphDataItem.labelWidth = 55;
          _servingTimeGraphDataItem.labelTextStyle = {
            fontSize: 13,
            color: Colors.BLACK_COLOR,
            textAlign: 'center',
          };
          _servingTimeGraphDataItem.frontColor = Colors.SECONDARY_COLOR;
          _servingTimeGraphDataItem.topLabelComponent = () => {
            return (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.BLACK_COLOR,
                  textAlign: 'center',
                }}>
                {actualListItem.usersServed || 0}
              </Text>
            );
          };
          _bookingCountGraphData.push(_servingTimeGraphDataItem);

          let _previousItem = previousList[actualListItemIndex];
          var _servingTimeGraphDataItem2 = {};
          let previousValue = _previousItem.usersServed || 0;
          if (previousValue >= _maxValue) {
            _maxValue = previousValue;
          }
          _servingTimeGraphDataItem2.value = previousValue;
          _servingTimeGraphDataItem2.frontColor = Colors.PRIMARY_COLOR;
          _servingTimeGraphDataItem2.topLabelComponent = () => {
            return (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.BLACK_COLOR,
                  textAlign: 'center',
                }}>
                {_previousItem.usersServed || 0}
              </Text>
            );
          };
          _bookingCountGraphData.push(_servingTimeGraphDataItem2);
        });
      }
      let averageValue = info?.averageTime || 0;
      if (averageValue >= _maxValue) {
        _maxValue = averageValue;
      }
      console.log('setBookingTimeAverage: ', averageValue);
      setBookingTimeAverage(averageValue);
      console.log('setBookingTimeMaxValue: ', _maxValue);
      setBookingTimeMaxValue(_maxValue);
    }
    setBookingCountGraphData(_bookingCountGraphData);
    console.log('setBookingCountGraphData: ', _bookingCountGraphData);
  };

  const ChartFilterOptionPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetGraphFilter}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
          draggableIcon: {
            backgroundColor: Colors.PRIMARY_TEXT_COLOR,
          },
        }}
        height={isTablet === true ? 235 : 220}>
        <GraphFilterOptionPopup
          RBSheet={refRBSheetGraphFilter}
          didSelectItem={didSelectedGraphFilterOption}
        />
      </RBSheet>
    );
  };

  const didSelectedGraphFilterOption = selectedOption => {
    if (Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE === 'ServingTime') {
      setSelectedServingTimeOption(selectedOption);
      getAverageServingTimeData(true, selectedOption);
    } else if (
      Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE === 'BookingCount'
    ) {
      setSelectedBookingCountOption(selectedOption);
      getAverageBookingCountData(true, selectedOption);
    } else if (
      Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE === 'DepartmentVisit'
    ) {
      setSelectedDepartmentVisitOption(selectedOption);
      getDepartmentVisitData(true, selectedOption);
    }
  };

  const GetAvailabilityPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetAvailabilityPopup}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={getAvailability}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
          draggableIcon: {
            backgroundColor: Colors.PRIMARY_TEXT_COLOR,
          },
        }}
        height={220}>
        <AvailabilityStatusChangePopup
          RBSheet={refRBSheetAvailabilityPopup}
          didSelectItem={didSelectedAvailabilityOption}
        />
      </RBSheet>
    );
  };

  const didSelectedAvailabilityOption = selectedOption => {};

  //Pie chart helper
  const configureDepartmentVisitChart = info => {
    var _visitData = [];
    let departmentList = info?.departmentList || [];
    if (departmentList !== undefined && departmentList !== null) {
      if (departmentList?.length > 0) {
        departmentList.map((departmentListItem, departmentListItemIndex) => {
          let visits = departmentListItem.visits || 0;
          if (visits > 0) {
            var departmentItem = {};
            departmentItem.value = visits;
            departmentItem.departmentName =
              departmentListItem.department_name || '';
            let color =
              Colors.PIE_CHART_COLORS[
                departmentListItemIndex % departmentList?.length
              ];
            departmentItem.color = color;
            departmentItem.text = visits.toString();
            departmentItem.textColor = Colors.WHITE_COLOR;
            _visitData.push(departmentItem);
          }
        });
      } else {
        //No department visit data
        var departmentItem = {};
        departmentItem.value = 0;
        departmentItem.departmentName = 'No Visit';
        let color = Colors.GREY_COLOR;
        departmentItem.color = color;
        departmentItem.text = '';
        departmentItem.textColor = Colors.WHITE_COLOR;
        _visitData.push(departmentItem);
      }
    } else {
      //No department visit data
      var departmentItem = {};
      departmentItem.value = 0;
      departmentItem.departmentName = 'No Visit';
      let color = Colors.GREY_COLOR;
      departmentItem.color = color;
      departmentItem.text = '';
      departmentItem.textColor = Colors.WHITE_COLOR;
      _visitData.push(departmentItem);
    }

    if (_visitData?.length === 0) {
      //No department visit data
      var departmentItem = {};
      departmentItem.value = 1;
      departmentItem.departmentName = 'No Visit';
      let color = Colors.GREY_COLOR;
      departmentItem.color = color;
      departmentItem.text = '';
      departmentItem.textColor = Colors.WHITE_COLOR;
      _visitData.push(departmentItem);
    }

    setDepartmentVisitGraphData(_visitData);
    console.log('setDepartmentVisitGraphData: ', _visitData);
  };

  const isDepartmentChartNeeded = () => {
    if (
      Utilities.isSingleConsultantBusiness() === false &&
      Utilities.isServiceBasedBusiness() === false
    ) {
      //department chart should show if the role is Admin + consultant or admin or receotionist or fromt office(not admin,not consultant)
      if (
        (Utilities.isUserIsAdmin() === true &&
          Utilities.isUserIsConsultant() === true) ||
        Utilities.isUserIsAdmin() === true ||
        (Utilities.isUserIsAdmin() === false &&
          Utilities.isUserIsConsultant() === false)
      ) {
        return true;
      }
    }
    return false;
  };
  //API Calls
  /**
          *
          * Purpose: Get user details
          * Created/Modified By: Jenson
          * Created/Modified Date: 04 Jan 2022
          * Steps:
              1.fetch business details from API and append to state variable
   */
  const getUserDetails = (userId, isForStatusAvailability = false) => {
    setIsLoading(true);
    DataManager.getUserDetails(userId).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data.objects !== undefined && data.objects !== null) {
          StorageManager.saveUserDetails(data.objects);
          Globals.USER_DETAILS = data.objects;
          if (isForStatusAvailability === true) {
            //Need to check user latest break count and show popup
            setIsLoading(false);
            configureUserAvailability();
            refRBSheetAvailabilityPopup.current.open();
          } else {
            getDashboardCounts();
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
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };

  /**
          *
          * Purpose: Get user availability
          * Created/Modified By: Jenson
          * Created/Modified Date: 21 Jan 2022
          * Steps:
              1.fetch business details from API and append to state variable
   */
  const getAvailability = (servingUserId = Globals.USER_DETAILS?._id) => {
    DataManager.getAvailability(servingUserId).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.objects !== undefined && data.objects !== null) {
            Globals.SHARED_VALUES.CURRENT_USER_AVAILABILITY_INFO = data.objects;
            console.log('Get availability func called', data.objects);
            configureUserAvailability();
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
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

  /**
      *
      * Purpose: Get dashboard counts
      * Created/Modified By: Jenson
      * Created/Modified Date: 17 Feb 2022
      * Steps:
         1.fetch details from API and append to state variable
     */
  const getDashboardCounts = (dateValue = selectedDate) => {
    setIsLoading(true);
    let offsetValue = Utilities.getBusinessTimeZoneOffset();
    let dateSelected = Utilities.appendBusinessTimeZoneToDate(dateValue);
    let dateToSent =
      moment(dateSelected).format('dddd D MMMM YYYY 00:00:00 ') + offsetValue;
    console.log(
      `getDashboardCounts offsetValue: ${offsetValue} dateSelected: ${dateSelected} dateToSent: ${dateToSent} `,
    );
    const body = {
      [APIConnections.KEYS.TIME]: dateToSent,
    };
    DataManager.getDashboardCounts(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data.objects !== undefined && data.objects !== null) {
          setDashboardCountInfo(data.objects);
          setIsLoading(false);
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
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };

  /**
      *
      * Purpose: getAverageServingTimeData
      * Created/Modified By: Jenson
      * Created/Modified Date: 17 Feb 2022
      * Steps:
         1.fetch details from API and append to state variable
     */
  const getAverageServingTimeData = (
    isLoaderNeeded = false,
    _selectedServingTimeOption = selectedServingTimeOption,
  ) => {
    if (isLoaderNeeded === true) {
      setIsLoading(true);
    }
    console.log('selectedServingTimeOption: ', _selectedServingTimeOption);
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.USER_ID]: Globals.USER_DETAILS._id,
    };
    DataManager.getAverageServingTimeData(
      body,
      _selectedServingTimeOption,
    ).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data.objects !== undefined && data.objects !== null) {
          console.log('getAverageServingTimeData: ', data.objects);
          configureServingTimeChart(data.objects);
          if (isLoaderNeeded === true) {
            setIsLoading(false);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          if (isLoaderNeeded === true) {
            setIsLoading(false);
          }
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        if (isLoaderNeeded === true) {
          setIsLoading(false);
        }
      }
    });
  };

  /**
      *
      * Purpose: getAverageBookingCountData
      * Created/Modified By: Jenson
      * Created/Modified Date: 17 Feb 2022
      * Steps:
         1.fetch details from API and append to state variable
     */
  const getAverageBookingCountData = (
    isLoaderNeeded = false,
    _selectedBookingCountOption = selectedBookingCountOption,
  ) => {
    console.log('selectedBookingCountOption: ', _selectedBookingCountOption);
    if (isLoaderNeeded === true) {
      setIsLoading(true);
    }
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.USER_ID]: Globals.USER_DETAILS._id,
    };
    DataManager.getAverageBookingCountData(
      body,
      _selectedBookingCountOption,
    ).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data.objects !== undefined && data.objects !== null) {
          configureBookingCountChart(data.objects);
          console.log('getAverageBookingCountData: ', data.objects);
          if (isLoaderNeeded === true) {
            setIsLoading(false);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          if (isLoaderNeeded === true) {
            setIsLoading(false);
          }
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        if (isLoaderNeeded === true) {
          setIsLoading(false);
        }
      }
    });
  };

  /**
      *
      * Purpose: getAverageBookingCountData
      * Created/Modified By: Jenson
      * Created/Modified Date: 17 Feb 2022
      * Steps:
         1.fetch details from API and append to state variable
     */
  const getDepartmentVisitData = (
    isLoaderNeeded = false,
    _selectedDepartmentVisitOption = selectedDepartmentVisitOption,
  ) => {
    console.log(
      'selectedDepartmentVisitOption: ',
      _selectedDepartmentVisitOption,
    );
    if (isLoaderNeeded === true) {
      setIsLoading(true);
    }
    DataManager.getDepartmentCountData(_selectedDepartmentVisitOption).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.objects !== undefined && data.objects !== null) {
            console.log('getDepartmentCountData: ', data.objects);
            configureDepartmentVisitChart(data.objects);
            if (isLoaderNeeded === true) {
              setIsLoading(false);
            }
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            if (isLoaderNeeded === true) {
              setIsLoading(false);
            }
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          if (isLoaderNeeded === true) {
            setIsLoading(false);
          }
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

  const performGetNotificationList = () => {
    setIsLoading(true);
    DataManager.getNotificationList(1).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data !== undefined && data !== null) {
          setIsLoading(false);
          console.log('notification unread count', data.objects.unreadingCount);
          Globals.UN_READ_NOTIFICATION_COUNT = data.objects.unreadingCount;

          console.log(
            ' Globals.UN_READ_NOTIFICATION_COUNT....',
            Globals.UN_READ_NOTIFICATION_COUNT,
          );
          setUnReadCount(data.objects.unreadingCount);
          Utilities.setNotificationCount(data.objects.unreadingCount);
        } else {
          setIsLoading(false);
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        }
      } else {
        // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };
  /**
   *
   * Purpose: New booking button action
   * Created/Modified By: Vijin
   * Created/Modified Date: 1 Feb 2022
   * Steps:
   */
  const newBookingButtonAction = () => {
    if (Globals.BUSINESS_DETAILS.allowNonConsultantLogin === true) {
      if (Utilities.isUserIsConsultant()) {
        if (
          Utilities.getGenderOptions()?.length > 0 &&
          !Utilities.isSingleConsultantBusiness() &&
          Utilities.isGenderSpecificBooking()
        ) {
          console.log('GENDER SELECTION');
          navigation.navigate('GenderSelectionScreen');
        } else {
          navigation.navigate('NewBookingCustomerListScreen', {
            parentSource: 'dashboard',
          });
        }
      } else {
        if (
          Utilities.getGenderOptions()?.length > 0 &&
          !Utilities.isSingleConsultantBusiness() &&
          Utilities.isGenderSpecificBooking()
        ) {
          console.log('GENDER SELECTION');
          navigation.navigate('GenderSelectionScreen');
        } else if (
          Utilities.getGenderOptions()?.length > 0 &&
          !Utilities.isSingleConsultantBusiness() &&
          Utilities.isGenderSpecificBooking() === false
        ) {
          navigation.navigate('AllServingUsersList');
        } else if (!Utilities.isSingleConsultantBusiness()) {
          navigation.navigate('NewBookingCustomerListScreen', {
            parentSource: 'dashboard',
          });
        } else {
          navigation.navigate('AllServingUsersList');
        }
      }
    } else {
      Utilities.showToast(
        t(Translations.FAILED),
        t(Translations.YOU_ARE_NOT_AUTHORIZED_TO_USE_THIS_APP),
        'error',
        'bottom',
      );
      setIsLoading(false);
    }
  };

  const renderLegend = (text, color) => {
    return (
      <View
        style={{flexDirection: 'row', marginBottom: 12, alignItems: 'center'}}>
        <View
          style={{
            height: 10,
            width: 10,
            backgroundColor: color || 'black',
          }}
        />
        <Text
          style={{
            marginLeft: 5,
            marginRight: 8,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: isTablet ? 14 : 12,
            color: Colors.PRIMARY_TEXT_COLOR,
          }}>
          {text || ''}
        </Text>
      </View>
    );
  };
  //final return
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.BACKGROUND_COLOR,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}>
        <LoadingIndicator visible={isLoading} />
        <ChartFilterOptionPopup />
        <GetAvailabilityPopup />
        <StatusBar
          backgroundColor={Colors.BACKGROUND_COLOR}
          barStyle="dark-content"
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginLeft: 20, marginTop: 20, width: 38, height: 38}}
            onPress={() => profileButtonAction()}>
            <GetImage
              style={{
                width: isTablet === true ? 50 : 38,
                height: isTablet === true ? 50 : 38,
                borderRadius: isTablet === true ? 50 / 2 : 38 / 2,
                borderWidth: 1,
                borderColor: Colors.PRIMARY_COLOR,
              }}
              fullName={(
                (Globals.USER_DETAILS?.firstName || 'N/A') +
                ' ' +
                (Globals.USER_DETAILS?.lastName || '')
              ).trim()}
              alphabetColor={Colors.SECONDARY_COLOR}
              url={Globals.USER_DETAILS?.image}
            />
          </TouchableOpacity>

          {Globals.HIDE_FOR_PRACTO === true ? (
            <View style={{marginTop: 20, height: 26}} />
          ) : Utilities.isUserIsConsultant() === true &&
            availabilityText.trim()?.length > 0 ? (
            <TouchableOpacity
              onPress={() => availabilityStatusChangeButtonAction()}
              style={{
                marginTop: 20,
                flexDirection: 'row',
                marginLeft: 16,
                height: 26,
                alignItems: 'center',
                borderColor: Colors.TEXT_LIGHT_GREY_COLOR_3E,
                borderWidth: 0.5,
                borderRadius: 12,
              }}>
              <Text
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 12,
                  color: Colors.START_SESSION_COLOR,
                }}>
                {availabilityText}
              </Text>
              <Image
                style={{
                  marginRight: 10,
                  width: 15,
                  height: 15,
                  tintColor: Colors.BLACK_COLOR,
                  resizeMode: 'contain',
                }}
                source={Images.DROP_DOWN_ICON}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text
          style={{
            marginLeft: 20,
            marginTop: 10,
            marginRight: 20,
            color: Colors.PRIMARY_TEXT_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: isTablet === true ? 22 : 18,
            textAlign: 'left',
          }}
          numberOfLines={1}>
          {t(Translations.HI)}{' '}
          <Text style={{fontFamily: Fonts.Gibson_SemiBold}}>
            {Globals.USER_DETAILS?.name || ''}
          </Text>
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              marginTop: 8,
              marginLeft: 20,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet === true ? 18 : 12,
              color: Colors.SECONDARY_TEXT_COLOR,
            }}>
            {t(Translations.WELCOME_TO)}{' '}
          </Text>
          {Globals.BUSINESS_DETAILS?.businessNameImage?.trim()?.length > 0 &&
          isBusinessNameImageLoadError === false ? (
            <FastImage
              style={{
                marginLeft: 5,
                marginTop: 6,
                height: isTablet === true ? 25 : 18,
                width: 75,
                borderWidth: 0.2,
                borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
                shadowColor: Colors.SHADOW_COLOR,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 4,
                elevation: 4,
                borderRadius: 3,
                backgroundColor: '#fff',
              }}
              source={{
                uri: Globals.BUSINESS_DETAILS?.businessNameImage,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
              onError={() => businessNameImageError()}
            />
          ) : (
            <Text
              style={{
                color: Colors.PRIMARY_TEXT_COLOR,
                marginLeft: 5,
                marginTop: 8,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 12,
                textAlign: 'left',
              }}>
              {Globals.BUSINESS_DETAILS?.name || Strings.APP_NAME}
            </Text>
          )}
        </View>
        <View
          style={{
            height: 1.5,
            backgroundColor: Colors.LINE_SEPARATOR_COLOR,
            marginTop: 12,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('LanguageListScreen')}
          style={{
            width: isTablet === true ? 55 : 40,
            height: isTablet === true ? 55 : 40,
            alignItems: 'center',
            justifyContent: 'center',
            //Shadow props
            borderWidth: 0.4,
            borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
            backgroundColor: Colors.WHITE_COLOR,
            shadowColor: Colors.SHADOW_COLOR,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 8,
            borderRadius: 8,
            position: 'absolute',
            right: isTablet === true ? 80 : 70,
            top: insets.top + 20,
          }}>
          <Image
            style={{
              width: isTablet === true ? 26 : 16,
              height: isTablet === true ? 26 : 16,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: 8,
              tintColor: Colors.SECONDARY_COLOR,
              transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
            }}
            source={Images.CHANGE_LANGUAGE}
          />
          <Text
            style={{
              marginTop: I18nManager.isRTL ? 5 : 1,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet === true ? 8 : 6,
              color: Colors.SECONDARY_COLOR,
              textAlign: 'left',
              marginBottom: 5,
            }}>
            {t(Translations.CHANGE_LANGUAGE)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationListScreen')}
          style={{
            width: isTablet === true ? 55 : 40,
            height: isTablet === true ? 55 : 40,
            alignItems: 'center',
            justifyContent: 'center',
            //Shadow props
            borderWidth: 0.4,
            borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
            backgroundColor: Colors.WHITE_COLOR,
            shadowColor: Colors.SHADOW_COLOR,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 8,
            borderRadius: 8,
            position: 'absolute',
            right: isTablet === true ? 15 : 20,
            top: insets.top + 20,
          }}>
          {unReadCount > 0 ? (
            <LottieView
              key={unReadCount}
              style={{width: 25}}
              source={Images.GRAY_NOTIFICATION_ICON}
              loop={true}
              autoPlay={true}
              colorFilters={[
                {
                  keypath: 'bell-ae Outlines',
                  color: Colors.PRIMARY_COLOR,
                },
              ]}
            />
          ) : (
            <LottieView
              style={{width: 25}}
              source={Images.GRAY_NOTIFICATION_ICON}
              autoPlay={false}
              loop={false}
              colorFilters={[
                {
                  keypath: 'bell-ae Outlines',
                  color: Colors.GREY_COLOR,
                },
              ]}
            />
          )}
        </TouchableOpacity>

        {/* center items */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginBottom: 100}}>
            <View
              style={{
                marginLeft: 28,
                marginRight: 28,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  marginTop: 15,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet === true ? 22 : 14,
                  color: Colors.DARK_BROWN_COLOR,
                  textAlign: 'left',
                }}>
                {t(Translations.DASH_BOARD)}
              </Text>

              {Globals.HIDE_FOR_PRACTO === true ? (
                <View />
              ) : Utilities.isDisplayForBookingEnabled() ? (
                <TouchableOpacity
                  onPress={() => newBookingButtonAction()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.DARK_BROWN_COLOR,
                    borderRadius: 4,
                    height: 26,
                    width: 100,
                    marginTop: 12,
                  }}>
                  <Image
                    source={Images.DASHBOARD_PLUS_ICON}
                    style={{
                      width: 12,
                      height: 8,
                      tintColor: Colors.WHITE_COLOR,
                      resizeMode: 'contain',
                      marginLeft: 4,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      marginRight: 8,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 12,
                      color: Colors.WHITE_COLOR,
                    }}>
                    {t(Translations.NEW_BOOKING)}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* CALENDER */}
            <View style={{marginHorizontal: 28, marginTop: 20}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {DATA?.length === 0
                  ? null
                  : DATA.map((item, index) => {
                      return <DateItem item={item} index={index} />;
                    })}
              </ScrollView>
            </View>
            {isTablet ? (
              <DashboardLabelScreen />
            ) : (
              <View
                style={{
                  height: 220,
                  marginTop: 2,
                  marginLeft: 28,
                  marginRight: 28,
                  //Shadow props
                  borderWidth: 0.1,
                  borderColor: Colors.GREY_COLOR,
                  backgroundColor: Colors.WHITE_COLOR,
                  shadowColor: Colors.SHADOW_COLOR,
                  shadowOffset: {width: 0, height: 4},
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                  elevation: 8,
                }}>
                <View style={{height: 110, flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 0.5,
                      borderWidth: 0.5,
                      borderColor: Colors.LINE_SEPARATOR_COLOR,
                    }}>
                    <Image
                      style={{
                        width: 18,
                        height: 18,
                        marginTop: 12,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: Colors.SECONDARY_COLOR,
                      }}
                      source={Images.DASHBOARD_APPOINTMENTS_ICON}
                    />
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          marginTop: 2,
                          fontFamily: Fonts.Gibson_SemiBold,
                          fontSize: 14,
                          color: Colors.PRIMARY_TEXT_COLOR,
                          textAlign: 'left',
                        }}>
                        {(
                          dashboardCountInfo?.allAppointmentsCount || 0
                        ).toString()}
                      </Text>
                      <View
                        style={{
                          marginLeft: 3,
                          borderWidth: 1,
                          borderColor: Colors.PRIMARY_COLOR,
                          justifyContent: 'center',
                          padding: 3,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: 10,
                            color: Colors.PRIMARY_COLOR,
                          }}>
                          {dashboardCountInfo?.appointmentSign === 'minus'
                            ? '-'
                            : ''}
                          {(
                            dashboardCountInfo?.allAppointmentsCountPercentage ||
                            0
                          ).toString()}
                          %
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {t(Translations.APPOINTMENT)}
                    </Text>
                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Light,
                        fontSize: 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {selectedWeekDayText}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      borderWidth: 0.5,
                      borderColor: Colors.LINE_SEPARATOR_COLOR,
                    }}>
                    <Image
                      style={{
                        width: 18,
                        height: 18,
                        marginTop: 12,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: Colors.SECONDARY_COLOR,
                      }}
                      source={Images.DASHBOARD_NEW_CUSTOMERS_ICON}
                    />

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          marginTop: 2,
                          fontFamily: Fonts.Gibson_SemiBold,
                          fontSize: 14,
                          color: Colors.PRIMARY_TEXT_COLOR,
                        }}>
                        {(dashboardCountInfo?.customersCount || 0).toString()}
                      </Text>
                      <View
                        style={{
                          marginLeft: 3,
                          borderWidth: 1,
                          borderColor: Colors.PRIMARY_COLOR,
                          justifyContent: 'center',
                          padding: 3,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: 10,
                            color: Colors.PRIMARY_COLOR,
                          }}>
                          {dashboardCountInfo?.customerSign === 'minus'
                            ? '-'
                            : ''}
                          {(
                            dashboardCountInfo?.customersCountPercentage || 0
                          ).toString()}
                          %
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                        textAlign: 'left',
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {t(Translations.NEW_CUSTOMERS)}
                    </Text>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Light,
                        fontSize: 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                        textAlign: 'left',
                      }}>
                      {selectedWeekDayText}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      borderWidth: 0.5,
                      borderColor: Colors.LINE_SEPARATOR_COLOR,
                    }}>
                    <Image
                      style={{
                        width: 18,
                        height: 18,
                        marginTop: 12,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: Colors.SECONDARY_COLOR,
                      }}
                      source={Images.DASHBOARD_WALK_IN_ICON}
                    />

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          marginTop: 2,
                          fontFamily: Fonts.Gibson_SemiBold,
                          fontSize: 14,
                          color: Colors.PRIMARY_TEXT_COLOR,
                          textAlign: 'left',
                        }}>
                        {(dashboardCountInfo?.walkinCount || 0).toString()}
                      </Text>
                      <View
                        style={{
                          marginLeft: 3,
                          borderWidth: 1,
                          borderColor: Colors.PRIMARY_COLOR,
                          justifyContent: 'center',
                          padding: 3,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: 10,
                            color: Colors.PRIMARY_COLOR,
                          }}>
                          {dashboardCountInfo?.walkinSign === 'minus'
                            ? '-'
                            : ''}
                          {(
                            dashboardCountInfo?.walkinCountPercentage || 0
                          ).toString()}
                          %
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {t(Translations.WALK_IN)}
                    </Text>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Light,
                        fontSize: 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {selectedWeekDayText}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    height: isTablet === true ? 120 : 110,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flex: 0.5,
                      borderWidth: 0.5,
                      borderColor: Colors.LINE_SEPARATOR_COLOR,
                    }}>
                    <Image
                      style={{
                        width: isTablet === true ? 22 : 18,
                        height: isTablet === true ? 22 : 18,
                        marginTop: 12,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: Colors.SECONDARY_COLOR,
                      }}
                      source={Images.DASHBOARD_CANCELLED_ICON}
                    />

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          marginTop: 2,
                          fontFamily: Fonts.Gibson_SemiBold,
                          fontSize: isTablet === true ? 15 : 14,
                          color: Colors.PRIMARY_TEXT_COLOR,
                        }}>
                        {(dashboardCountInfo?.cancellCount || 0).toString()}
                      </Text>
                      <View
                        style={{
                          marginLeft: 3,
                          borderWidth: 1,
                          borderColor: Colors.PRIMARY_COLOR,
                          justifyContent: 'center',
                          padding: 3,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: isTablet === true ? 12 : 10,
                            color: Colors.PRIMARY_COLOR,
                          }}>
                          {dashboardCountInfo?.cancellSign === 'minus'
                            ? '-'
                            : ''}
                          {(
                            dashboardCountInfo?.cancellCountPercentage || 0
                          ).toString()}
                          %
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet === true ? 14 : 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                        textAlign: 'left',
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {t(Translations.CANCELLED)}
                    </Text>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Light,
                        fontSize: isTablet === true ? 14 : 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {selectedWeekDayText}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      borderWidth: 0.5,
                      borderColor: Colors.LINE_SEPARATOR_COLOR,
                    }}>
                    <Image
                      style={{
                        width: isTablet === true ? 22 : 18,
                        height: isTablet === true ? 22 : 18,
                        marginTop: 12,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: Colors.SECONDARY_COLOR,
                      }}
                      source={Images.DASHBOARD_NO_SHOW_ICON}
                    />

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          marginTop: 2,
                          fontFamily: Fonts.Gibson_SemiBold,
                          fontSize: isTablet === true ? 15 : 14,
                          color: Colors.PRIMARY_TEXT_COLOR,
                        }}>
                        {(dashboardCountInfo?.noshowCount || 0).toString()}
                      </Text>
                      <View
                        style={{
                          marginLeft: 3,
                          borderWidth: 1,
                          borderColor: Colors.PRIMARY_COLOR,
                          justifyContent: 'center',
                          padding: 3,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: isTablet === true ? 12 : 10,
                            color: Colors.PRIMARY_COLOR,
                          }}>
                          {dashboardCountInfo?.noshowSign === 'minus'
                            ? '-'
                            : ''}
                          {(
                            dashboardCountInfo?.noshowCountPercentage || 0
                          ).toString()}
                          %
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet === true ? 14 : 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {t(Translations.DASH_BOARD_NO_SHOW)}
                    </Text>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Light,
                        fontSize: isTablet === true ? 14 : 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {selectedWeekDayText}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      borderWidth: 0.5,
                      borderColor: Colors.LINE_SEPARATOR_COLOR,
                    }}>
                    <Image
                      style={{
                        width: isTablet === true ? 22 : 18,
                        height: isTablet === true ? 22 : 18,
                        marginTop: 12,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: Colors.SECONDARY_COLOR,
                      }}
                      source={Images.DASHBOARD_SERVING_TIME_ICON}
                    />

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          marginTop: 2,
                          fontFamily: Fonts.Gibson_SemiBold,
                          fontSize: isTablet === true ? 15 : 14,
                          color: Colors.PRIMARY_TEXT_COLOR,
                        }}>
                        {(dashboardCountInfo?.avgTime || 0).toString()}
                      </Text>
                      <View
                        style={{
                          marginLeft: 3,
                          borderWidth: 1,
                          borderColor: Colors.GREEN_COLOR,
                          justifyContent: 'center',
                          padding: 3,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: isTablet === true ? 12 : 10,
                            color: Colors.PRIMARY_TEXT_COLOR,
                          }}>
                          {t(Translations.MINS)}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet === true ? 14 : 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                        textAlign: 'left',
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      {t(Translations.AVERAGE_WAITING)}
                    </Text>

                    <Text
                      style={{
                        marginTop: 6,
                        alignSelf: 'center',
                        fontFamily: Fonts.Gibson_Light,
                        fontSize: isTablet === true ? 14 : 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {selectedWeekDayText}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View
              style={{
                marginTop: 8,
                marginLeft: 28,
                marginRight: 28,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  marginTop: 15,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: isTablet === true ? 18 : 14,
                  color: Colors.DARK_BROWN_COLOR,
                }}>
                {t(Translations.AVERAGE_SERVING)}
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_COLOR,
                  }}>
                  {' '}
                  {t(Translations.TIME)}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => servingTimeFilterButtonAction()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: Colors.DARK_BROWN_COLOR,
                  borderRadius: 4,
                  height: 26,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    marginLeft: 8,
                    marginRight: 5,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: isTablet === true ? 14 : 12,
                    color: Colors.WHITE_COLOR,
                  }}>
                  {selectedServingTimeOption === 'weekly'
                    ? t(Translations.WEEKLY)
                    : t(Translations.DAILY)}
                </Text>
                <Image
                  source={Images.DROP_DOWN_ICON}
                  style={{
                    marginRight: 8,
                    width: 12,
                    height: 8,
                    tintColor: Colors.WHITE_COLOR,
                    resizeMode: 'contain',
                    marginLeft: 4,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 320,
                marginTop: 10,
                marginLeft: 28,
                marginRight: 28,
                //Shadow props
                borderWidth: 0.1,
                borderColor: Colors.GREY_COLOR,
                backgroundColor: Colors.WHITE_COLOR,
                shadowColor: Colors.SHADOW_COLOR,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 8,
              }}>
              <View style={{marginTop: 20, marginRight: 10}}>
                <BarChart
                  key={'graphKey'}
                  width={
                    isTablet
                      ? DisplayUtils.setWidth(88)
                      : DisplayUtils.setWidth(72)
                  }
                  data={servingTimeGraphData}
                  barWidth={30}
                  spacing={isTablet ? 30 : 10}
                  initialSpacing={10}
                  xAxisThickness={0.5}
                  xAxisIndicesWidth={10}
                  yAxisThickness={0.5}
                  yAxisTextStyle={{
                    fontSize: isTablet ? 16 : 13,
                    color: Colors.BLACK_COLOR,
                  }}
                  noOfSections={4}
                  maxValue={servingTimeMaxValue}
                  // isAnimated={true}
                  animationDuration={1000}
                  scrollToEnd
                  hideRules
                  showReferenceLine1
                  referenceLine1Position={servingTimeAverage}
                  referenceLine1Config={{
                    type: 'solid',
                    color: 'blue',
                    thickness: 1,
                    width: isTablet
                      ? DisplayUtils.setWidth(86)
                      : DisplayUtils.setWidth(70),
                  }}
                />

                {/* <Text>{servingTimeAverage}</Text> */}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 26,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{width: 10, height: 10, backgroundColor: 'blue'}}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 16 : 12,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      textAlign: 'left',
                    }}>
                    {t(Translations.AVERAGE)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 8,
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: Colors.SECONDARY_COLOR,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 16 : 12,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {t(Translations.ACTUAL)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 8,
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: Colors.PRIMARY_COLOR,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 16 : 12,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {t(Translations.PREVIOUS)}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                marginTop: 8,
                marginLeft: 28,
                marginRight: 28,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  marginTop: 15,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: isTablet === true ? 18 : 14,
                  color: Colors.DARK_BROWN_COLOR,
                }}>
                {t(Translations.AVERAGE_BOOKING)}
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_COLOR,
                  }}>
                  {' '}
                  {t(Translations.COUNT)}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => bookingCountFilterButtonAction()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: Colors.DARK_BROWN_COLOR,
                  borderRadius: 4,
                  height: 26,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    marginLeft: 8,
                    marginRight: 5,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: isTablet === true ? 15 : 12,
                    color: Colors.WHITE_COLOR,
                  }}>
                  {selectedBookingCountOption === 'weekly'
                    ? t(Translations.WEEKLY)
                    : t(Translations.DAILY)}
                </Text>
                <Image
                  source={Images.DROP_DOWN_ICON}
                  style={{
                    marginRight: 8,
                    width: 12,
                    height: 8,
                    tintColor: Colors.WHITE_COLOR,
                    resizeMode: 'contain',
                    marginLeft: 4,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 320,
                marginTop: 10,
                marginLeft: 28,
                marginRight: 28,
                //Shadow props
                borderWidth: 0.1,
                borderColor: Colors.GREY_COLOR,
                backgroundColor: Colors.WHITE_COLOR,
                shadowColor: Colors.SHADOW_COLOR,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 8,
              }}>
              <View style={{marginTop: 20, marginRight: 10}}>
                <BarChart
                  key={'graphKey'}
                  width={
                    isTablet
                      ? DisplayUtils.setWidth(88)
                      : DisplayUtils.setWidth(72)
                  }
                  data={bookingCountGraphData}
                  barWidth={30}
                  spacing={isTablet ? 30 : 10}
                  xAxisThickness={0.5}
                  yAxisThickness={0.5}
                  yAxisTextStyle={{
                    fontSize: isTablet ? 16 : 13,
                    color: Colors.BLACK_COLOR,
                  }}
                  noOfSections={4}
                  maxValue={bookingTimeMaxValue}
                  // isAnimated={true}
                  initialSpacing={8}
                  scrollToEnd
                  hideRules
                  animationDuration={1000}
                  showReferenceLine1
                  referenceLine1Position={bookingTimeAverage}
                  referenceLine1Config={{
                    type: 'solid',
                    color: 'blue',
                    thickness: 1,
                    width: isTablet
                      ? DisplayUtils.setWidth(86)
                      : DisplayUtils.setWidth(70),
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 26,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{width: 10, height: 10, backgroundColor: 'blue'}}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 16 : 12,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {t(Translations.AVERAGE)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 8,
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: Colors.SECONDARY_COLOR,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 16 : 12,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {t(Translations.ACTUAL)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 8,
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: Colors.PRIMARY_COLOR,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 16 : 12,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {t(Translations.PREVIOUS)}
                  </Text>
                </View>
              </View>
            </View>

            {isDepartmentChartNeeded() === true ? (
              <>
                <View
                  style={{
                    marginTop: 8,
                    marginLeft: 28,
                    marginRight: 28,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      marginTop: 15,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 18 : 14,
                      color: Colors.DARK_BROWN_COLOR,
                    }}>
                    {t(Translations.DEPARTMENTS)}
                    <Text
                      style={{
                        fontFamily: Fonts.Gibson_SemiBold,
                        color: Colors.PRIMARY_COLOR,
                      }}>
                      {' '}
                      {t(Translations.VISITS)}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => departmentFilterButtonAction()}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.DARK_BROWN_COLOR,
                      borderRadius: 4,
                      height: 26,
                      marginTop: 12,
                    }}>
                    <Text
                      style={{
                        marginLeft: 8,
                        marginRight: 5,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet ? 14 : 12,
                        color: Colors.WHITE_COLOR,
                      }}>
                      {selectedDepartmentVisitOption === 'hourly'
                        ? t(Translations.TODAY)
                        : selectedDepartmentVisitOption === 'daily'
                        ? t(Translations.LAST_7_DAYS)
                        : t(Translations.LAST_30_DAYS)}
                    </Text>
                    <Image
                      source={Images.DROP_DOWN_ICON}
                      style={{
                        marginRight: 8,
                        width: 12,
                        height: 8,
                        tintColor: Colors.WHITE_COLOR,
                        resizeMode: 'contain',
                        marginLeft: 4,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    //height: 370,
                    marginTop: 10,
                    alignSelf: 'center',
                    width: responsiveWidth(85),
                    //Shadow props
                    borderWidth: 0.1,
                    borderColor: Colors.GREY_COLOR,
                    backgroundColor: Colors.WHITE_COLOR,
                    shadowColor: Colors.SHADOW_COLOR,
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                    elevation: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      marginTop: 20,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    {departmentVisitGraphData[0]?.departmentName !==
                    'No Visit' ? (
                      <View style={{paddingLeft: responsiveWidth(5)}}>
                        <PieChart
                          strokeColor="white"
                          strokeWidth={2}
                          donut
                          innerCircleBorderWidth={4}
                          innerCircleBorderColor={Colors.LINE_SEPARATOR_COLOR}
                          data={departmentVisitGraphData || []}
                          showText
                          textSize={14}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          alignSelf: 'center',
                          width: '90%',
                          alignItems: 'center',
                          marginTop: 24,
                          marginBottom: 12,
                          height: 200,
                        }}>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: 12,
                            color: Colors.PRIMARY_TEXT_COLOR,
                            marginTop: '20%',
                          }}>
                          {t(Translations.NO_DEPARTMENT_VISIT)}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Gibson_Regular,
                            fontSize: isTablet ? 30 : 24,
                            color: Colors.PRIMARY_TEXT_COLOR,
                            marginTop: 40,
                          }}>
                          0
                        </Text>
                      </View>
                    )}
                  </View>

                  {departmentVisitGraphData[0]?.departmentName !==
                  'No Visit' ? (
                    <View
                      style={{
                        alignSelf: 'center',
                        width: '90%',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: 24,
                        marginBottom: 12,
                        flexWrap: 'wrap',
                      }}>
                      {departmentVisitGraphData.map(
                        (departmentItem, departmentItemIndex) => {
                          let color =
                            Colors.PIE_CHART_COLORS[
                              departmentItemIndex %
                                departmentVisitGraphData?.length
                            ];
                          return renderLegend(
                            departmentItem.departmentName +
                              ` (${departmentItem.value.toString()})`,
                            color,
                          );
                        },
                      )}
                    </View>
                  ) : null}

                  {/* </View> */}
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>

        {/* BottomBar */}
        <View
          style={{
            borderTopColor: Colors.SHADOW_COLOR,
            justifyContent: 'center',
            borderTopWidth: 0.5,
            height: 81,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
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
              height: 81,
              width: 75,
              justifyContent: 'center',
            }}>
            <Image
              source={Images.YWAIT_Y_LOGO}
              style={{
                width: isTablet === true ? 45 : 30,
                height: isTablet === true ? 45 : 30,
                alignSelf: 'center',
                tintColor: Colors.SECONDARY_COLOR,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ManageQueueScreen')}
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Colors.SHADOW_COLOR,
              height: 81,
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={Images.MANAGE_QUEUE_ICON}
              style={{
                width: isTablet === true ? 25 : 16,
                height: isTablet === true ? 25 : 16,
                alignSelf: 'center',
                tintColor: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                marginLeft: 8,
                marginRight: 8,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: isTablet === true ? 18 : 14,
                color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                alignSelf: 'center',
              }}>
              {t(Translations.MANAGE_QUEUE)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (Globals.HIDE_FOR_PRACTO === true) {
                navigation.navigate('PractoReportTab');
              } else {
                navigation.navigate('ReportTabScreen');
              }
            }}
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Colors.SHADOW_COLOR,
              height: 81,
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={Images.REPORTS_ICON}
              style={{
                width: isTablet === true ? 25 : 16,
                height: isTablet === true ? 25 : 16,
                alignSelf: 'center',
                tintColor: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                marginLeft: 8,
                marginRight: 8,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: isTablet === true ? 18 : 14,
                color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                alignSelf: 'center',
              }}>
              {t(Translations.REPORTS)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default DashboardScreen;
