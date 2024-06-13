import React, {useState, useRef, useEffect, Fragment} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  I18nManager,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Fonts,
  Colors,
  Images,
  Globals,
  Strings,
  Translations,
} from '../../../constants';
import {t} from 'i18next';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Utilities from '../../../helpers/utils/Utilities';
import {AppointmentType} from '../../../helpers/enums/Enums';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import DataManager from '../../../helpers/apiManager/DataManager';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import NoVisitorEmptyComponent from './NoVisitorEmptyComponent';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import ConsultantFilterPopupScreen from '../../shared/consultantFilterPopup/ConsultantFilterPopupScreen';
import HollyDayEmptyComponent from '../../bookingQueue/emptyScreens/HollyDayEmptyComponent';
import SpecialistEmptyComponent from '../../bookingQueue/emptyScreens/SpecialistEmptyComponent';
import NoConsultationToday from '../upcoming/NoConsultationToday';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
const CalendarScreen = () => {
  const isConnected = useNetInfo();
  const navigation = useNavigation();
  const [dateDataIndex, setDateDataIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    Utilities.convertorTimeToBusinessTimeZone(moment().format()),
  );
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadImage, setLoadImage] = useState(true);
  const [dateRefresh, setDateRefresh] = useState(false);
  const [consultantList, setConsultantList] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [calendarDataList, setCalendarDataList] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState([]);
  const [selectedQueueIndex, setSelectedQueueIndex] = useState(null);
  const [selectedServingUserId, setSelectedServingUserId] = useState(
    Utilities.isUserIsConsultant() ? Globals.USER_DETAILS._id : '',
  );
  const [selectedButtonOption, setSelectedButtonOption] = useState('all');
  const [selectedDayIsHolyday, setSelectedDayIsHolyDay] = useState(false);
  const [isSpecialistAvailable, setIsSpecialistAvailable] = useState(true);
  var dateStart = moment(
    moment()
      .utcOffset(Globals.BUSINESS_DETAILS.timeZone.offset)
      .format('MM-DD-YYYY'),
    'MM-DD-YYYY',
  );

  const [DATA, setDATA] = useState([]);
  var dateEnd = moment().add(
    Globals.BUSINESS_DETAILS?.bookingSettings?.advanceBookingAvialability
      ?.isActive
      ? Globals.BUSINESS_DETAILS?.bookingSettings?.advanceBookingAvialability
          ?.days
      : 30,
    'days',
  );

  var tempData = [];
  var monthNames = [];
  var dateIndex =
    moment().utcOffset(Globals.BUSINESS_DETAILS.timeZone.offset).format('D') -
    1;

  // references

  const consultantFilterPopupRBsheet = useRef();
  const dateFlatListRef = useRef();
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

  useEffect(() => {
    console.log('consultant======/////////',selectedConsultant)
    setIsLoading(true);
    // console.log('current time', moment().format('ddd MMM YYYY h:mm:ss a'));
    console.log('isUserIsConsultant', Utilities.isUserIsConsultant());
    Utilities.isUserIsConsultant()
      ? performGetCalendarBookingList(
          selectedDate,
          'all',
          selectedServingUserId,
        )
      : performGetConsultantList();
  }, []);
  const dummyCalendarList = [
    {
      id: '1',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '2',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '3',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '4',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '5',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '6',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '7',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '8',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '9',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '10',
      title: t(Translations.ADD_APPOINTMENT),
      time: '2022-01-14T08:25:35.240Z',
    },
  ];
  useEffect(() => {
    checkHoliday(selectedDate);
    checkSpecialistAvailable(selectedDate);
  }, []);

  const checkHoliday = _day => {
    let _holiday = Utilities.checkSelectedDateIsHoliday(_day);
    console.log('.....................is selected day is holyday' , _holiday)
    setSelectedDayIsHolyDay(_holiday);
  };
  const checkSpecialistAvailable = date => {
    const _day = moment(date).format('dddd');
    if (
      Globals.BUSINESS_DETAILS?._id !== undefined &&
      Globals.BUSINESS_DETAILS?._id !== null
    ) {
      if (Globals.BUSINESS_DETAILS?.generalHours?.length > 0) {
        Globals.BUSINESS_DETAILS?.generalHours?.map(item => {
          if (_day.toUpperCase() === item.label.toUpperCase()) {
            if (item?.activeFlag === false) {
              setIsSpecialistAvailable(false);
            }
          }
        });
      }
    }
  };
  //Shimmer loader for the flatList
  const ListLoader = props => (
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
      <Rect x="60" y="10" rx="5" ry="5" width="70" height="8" />
      <Rect x="60" y="30" rx="5" ry="5" width="140" height="8" />
      <Rect x="10" y="10" rx="20" ry="20" width="10" height="10" />
    </ContentLoader>
  );
  const ConsultantNameLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={12}
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="35%" y="0" rx="0" ry="0" width="120" height="12" />
    </ContentLoader>
  );
  const available = [
    {
      from: '2022-01-31T08:40:00.000Z',
      to: '2022-01-31T08:45:00.000Z',
      name: 'Free-slot',
      expectedTimeOfServing: '2022-01-31T08:40:00.000Z',
      dateFrom: '2022-01-31T08:40:00.000Z',
      dateTo: '2022-01-31T08:45:00.000Z',
      type: 'queue',
      canBook: true,
    },
    {
      from: '2022-01-31T08:40:00.000Z',
      to: '2022-01-31T08:45:00.000Z',
      name: 'Free-slot',
      expectedTimeOfServing: '2022-01-31T08:40:00.000Z',
      dateFrom: '2022-01-31T08:40:00.000Z',
      dateTo: '2022-01-31T08:45:00.000Z',
      type: 'queue',
      canBook: true,
    },
    {
      from: '2022-01-31T08:40:00.000Z',
      to: '2022-01-31T08:45:00.000Z',
      name: 'Free-slot',
      expectedTimeOfServing: '2022-01-31T08:40:00.000Z',
      dateFrom: '2022-01-31T08:40:00.000Z',
      dateTo: '2022-01-31T08:45:00.000Z',
      type: 'queue',
      canBook: true,
    },
  ];
  const populateDates = (monthForDate, indexForDate) => {
    console.log('dateEnd', dateEnd);
    console.log('dateStart', dateStart);
    var count = 0;
    while (dateEnd > dateStart) {
      // console.log('date func called');
      count = count + 1;
      tempData.push(dateStart.format());

      dateStart.add(1, 'days');
    }
    console.log('count', count);
    console.log(tempData);
    //2
    setDATA(tempData);
    setDateRefresh(!dateRefresh);

    // getDataAsync().then(res => {
    // goToIndex(indexForDate);
    // });
  };

  const getDataAsync = async () => {
    const _DATA = await DATA;
    return _DATA;
  };

  const goToIndex = scrollIndex => {
    if (dateDataIndex !== undefined && DATA.length > dateDataIndex) {
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
    setSelectedDate(
      Utilities.convertorTimeToBusinessTimeZone(moment(item).format()),
    );
    checkHoliday(moment(item).format());
    checkSpecialistAvailable(moment(item).format());
    setDateDataIndex(index);
    // goToIndex(index);
    // console.log('selected date', item)
    performGetCalendarBookingList(
      Utilities.convertorTimeToBusinessTimeZone(moment(item).format()),
      selectedButtonOption,
      selectedServingUserId,
    );
  };

  /**
           * Purpose:show consultant filter popup
           * Created/Modified By: Sudhin
           * Created/Modified Date: 20 jan 2022
           * Steps:
               1.Open the rbSheet
       */
  const ConsultantFilterPopupComponent = () => {
    return (
      <RBSheet
        ref={consultantFilterPopupRBsheet}
        closeOnDragDown={false}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}
        height={DisplayUtils.setHeight(75)}
        // onClose={() => {

        // }}
      >
        <ConsultantFilterPopupScreen
          refRBSheet={consultantFilterPopupRBsheet}
          onConsultantSelection={handleConsultantSelection}
          selectedConsultant={selectedConsultant}
        />
      </RBSheet>
    );
  };

  const handleConsultantSelection = selectedOption => {
    console.log('selected consultant', selectedOption);
    setSelectedGender(selectedOption?.canServeGenders);
    setSelectedServingUserId(selectedOption?._id);
    setSelectedConsultant(selectedOption);
    performGetCalendarBookingList(
      selectedDate,
      selectedButtonOption,
      selectedOption?._id,
    );
  };
  /**
       * Purpose:Render function of flat list
       * Created/Modified By: Sudhin Sudhakaran
       * Created/Modified Date: 8 Oct 2021
       * Steps:
           1.pass the data from api to customer details child component
   */
  const renderItem = ({item, index}) => {
    return <CalendarDataCell item={item} index={index} />;
  };
  /**
       * Purpose:Render function of flat list
       * Created/Modified By: Sudhin Sudhakaran
       * Created/Modified Date: 8 Oct 2021
       * Steps:
           1.pass the data from api to customer details child component
   */
  const renderQueueSlotItem = ({item, index}) => {
    return <QueueSlotDataCell item={item} index={index} />;
  };
  const bookingCellPressAction = item => {
    console.log('//', item);
    console.log(selectedServingUserId);
    console.log(selectedGender);
    if (Globals.BUSINESS_DETAILS.allowNonConsultantLogin === true) {
      if (!isLoading) {
        if (item?.canBook) {
          navigation.navigate('NewBookingCustomerListScreen', {
            appointmentType: AppointmentType.booking,
            selectedServingUserId: selectedServingUserId,
            selectedGender: selectedGender,
            selectedAppointmentDateFrom: item.dateFrom,
            selectedQueueSlotInfo: null,
            isServingUserSelected: true,
            parentSource: 'calender',
          });
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

  const queueCellPressAction = (item, index) => {
    if (Globals.BUSINESS_DETAILS.allowNonConsultantLogin === true) {
      if (index === selectedQueueIndex) {
        setSelectedQueueIndex(null);
      } else {
        setSelectedQueueIndex(index);
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
  const queueSlotCellPressAction = item => {
    console.log(item);
    console.log(selectedServingUserId);
    console.log(selectedGender);
    if (!isLoading) {
      if (item?.canBook) {
        navigation.navigate('NewBookingCustomerListScreen', {
          appointmentType: AppointmentType.queue,
          selectedServingUserId: selectedServingUserId,
          selectedGender: selectedGender,
          selectedAppointmentDateFrom: item.dateFrom,
          selectedQueueSlotInfo: item,
          isServingUserSelected: true,
          parentSource: 'calender',
        });
      }
    }
  };
  const CalendarDataCell = ({item, index}) => {
    let statusColor =
      item.name === 'Free-slot' && item.canBook
        ? Colors.GREEN_COLOR
        : item.customer_id !== undefined
        ? Colors.ERROR_RED_COLOR
        : Colors.INACTIVE_BOTTOM_BAR_COLOR;

    let customerName = `${item?.customer_id?.firstName} ${
      item?.customer_id?.lastName || ' '
    }`;
    return isLoading ? (
      <ListLoader />
    ) : (
      <Fragment>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
          }}>
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: statusColor,
              marginLeft: 20,
              borderRadius: 4,
              marginTop: 4,
            }}
          />
          <Text
            style={{
              color: Colors.TAB_VIEW_LABEL_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 14,
              marginLeft: 20,
            }}>
            {Utilities.getUtcToLocalWithFormat(item.dateFrom, 'hh:mm A')}
          </Text>
          <View>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => bookingCellPressAction(item)}>
              {item.name === 'Free-slot' && item.canBook === true ? (
                <Image
                  source={Images.PLUS_CALENDER_ICON}
                  style={{
                    tintColor: statusColor,
                    marginLeft: 20,
                    height: 12,
                    width: 12,
                    resizeMode: 'contain',
                  }}
                />
              ) : item.customer_id !== undefined ? null : (
                <Image
                  source={Images.PLUS_CALENDER_ICON}
                  style={{
                    tintColor: statusColor,
                    marginLeft: 20,
                    height: 12,
                    width: 12,
                    resizeMode: 'contain',
                  }}
                />
              )}
              <Text
                style={{
                  color: statusColor,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 14,
                  marginLeft:
                    item.name === 'Free-slot' && item.canBook === true
                      ? 10
                      : item.customer_id !== undefined
                      ? 20
                      : 10,
                }}>
                {item.name === 'Free-slot' && item.canBook === true
                  ? t(Translations.ADD_APPOINTMENT)
                  : item?.customer_id !== undefined
                  ? customerName
                  : t(Translations.ADD_APPOINTMENT)}
              </Text>
            </TouchableOpacity>
            {/* ADD QUEUE */}
            {item.available !== undefined && item.available.length > 0 ? (
              <Fragment>
                <TouchableOpacity
                  style={{flexDirection: 'row', marginTop: 10}}
                  onPress={() => queueCellPressAction(item, index)}>
                  {selectedQueueIndex === index ? (
                    <Image
                      source={Images.MINUS_ICON}
                      style={{
                        tintColor: Colors.GREEN_COLOR,
                        marginLeft: 20,
                        height: 12,
                        width: 12,
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Image
                      source={Images.PLUS_CALENDER_ICON}
                      style={{
                        tintColor: Colors.GREEN_COLOR,
                        marginLeft: 20,
                        height: 12,
                        width: 12,
                        resizeMode: 'contain',
                      }}
                    />
                  )}

                  <Text
                    style={{
                      color: Colors.GREEN_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    {t(Translations.ADD_QUEUE)}
                  </Text>
                </TouchableOpacity>
                {selectedQueueIndex === index ? (
                  <View style={{flex: 1}}>
                    <FlatList
                      style={{marginLeft: 20, marginRight: 20, marginTop: 5}}
                      // contentContainerStyle={{ paddingBottom: 85 }}
                      data={item.available}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      renderItem={renderQueueSlotItem}
                      horizontal={false}
                      numColumns={2}
                      keyExtractor={(item, index) =>
                        item._id ? item._id.toString() : index.toString()
                      }
                      scrollEnabled={false}
                    />
                  </View>
                ) : null}
              </Fragment>
            ) : null}
          </View>
        </View>
      </Fragment>
    );
  };
  const QueueSlotDataCell = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor:
            item.name === 'Free-slot' && item.canBook
              ? Colors.WHITE_COLOR
              : Colors.BACKGROUND_COLOR,
          marginTop: 15,
          marginRight: 12,
          height: 30,
          borderWidth: 0.5,
          borderColor: Colors.SEARCH_INPUT_BORDER_GRAY_COLOR,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => queueSlotCellPressAction(item)}>
        <Text
          style={{
            color: Colors.TAB_VIEW_LABEL_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 14,
            marginRight: 6,
            marginLeft: 6,
          }}>
          {Utilities.getUtcToLocalWithFormat(item.dateFrom, 'hh:mm A')}
        </Text>
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

  const UpcomingBookingEmptyComponent = () => {
    if (selectedDayIsHolyday === true) {
      return <HollyDayEmptyComponent />;
    } else if (isSpecialistAvailable === false) {
      return <NoConsultationToday />;
    } else {
      return <NoVisitorEmptyComponent />;
    }
  };
//filter available consultants
  const filterTodayAvailableConsultants = nonBlockedConsultants => {
    var _todaysConsultants = [];
    if(Globals?.USER_DETAILS?.role_id?.canServe === true ||
      Globals?.USER_DETAILS?.role_id?.isAdmin === true ||
      Globals?.BUSINESS_DETAILS?.allowSelectiveQueueManagement === false){
    //Check current date
    let currentBusinessDay = moment(
      Utilities.convertorTimeToBusinessTimeZone(moment()),
    ).format('dddd');
    nonBlockedConsultants.map(consultant => {
      let _workingHours = consultant?.workingHours || [];
      console.log(`filterTodayAvailableConsultants ${consultant?.name} `);
      console.log(`consultantsDesignation ${consultant?.designation}`);
      console.log('_workingHours: ', _workingHours);
      let currentDayIndex = _workingHours.findIndex(
        obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
      );
      if (currentDayIndex !== -1) {
        if (_workingHours[currentDayIndex]?.activeFlag === true) {
          _todaysConsultants.push(consultant);
        }
      }
    });
  }
  else if(Globals?.USER_DETAILS?.role_id?.canServe === false &&
    Globals?.USER_DETAILS?.role_id?.isAdmin === false &&
     Globals?.BUSINESS_DETAILS?.allowSelectiveQueueManagement === true)
    {
    //Check current date
    let currentBusinessDay = moment(
      Utilities.convertorTimeToBusinessTimeZone(moment()),
    ).format('dddd');
    nonBlockedConsultants.map(consultant => {
      if(Globals?.USER_DETAILS?.consultantMapping?.length>0){
      Globals?.USER_DETAILS?.consultantMapping?.map(item => {
        let id=item;
      let _workingHours = consultant?.workingHours || [];
      let consultant_id=consultant?._id
      let currentDayIndex = _workingHours.findIndex(
        obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
      );
      if (currentDayIndex !== -1) {
        if (_workingHours[currentDayIndex]?.activeFlag === true) {
          if(id===consultant_id){
            console.log('=====',consultant);
            console.log('=====',item);
          _todaysConsultants.push(consultant);
        }}
      }
    });
  }
  else if(Globals?.USER_DETAILS?.departmentMapping?.length>0){
    Globals?.USER_DETAILS?.departmentMapping?.map(item => {
      let id=item;
    let _workingHours = consultant?.workingHours || [];
    let consultant_id=consultant?.department_id?._id
    let currentDayIndex = _workingHours.findIndex(
      obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
    );
    if (currentDayIndex !== -1) {
      if (_workingHours[currentDayIndex]?.activeFlag === true) {
        if(id===consultant_id){
          console.log('=====',consultant);
          console.log('=====',item);
        _todaysConsultants.push(consultant);
      }}
    }
  });
  }
  });
}
    return _todaysConsultants;
  };
  //API CALLS
  /**
              *
              * Purpose:UpcomingBookingList listing
              * Created/Modified By: Sudhin
              * Created/Modified Date: 20 jan 2022
              * Steps:
                  1.fetch UpcomingBookingLists list from API and append to state variable
      */

  const performGetConsultantList = () => {
    console.log(' performGetConsultantList called');
    DataManager.getConsultantList().then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        let allConsultants = data.objects;
        if (allConsultants !== undefined && allConsultants !== null) {
          var _todaysConsultants = [];
          //Check current date
    let currentBusinessDay = moment(
      Utilities.convertorTimeToBusinessTimeZone(moment()),
    ).format('dddd');
    allConsultants.map(consultant => {
      let _workingHours = consultant?.workingHours || [];
      let currentDayIndex = _workingHours.findIndex(
        obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
      );
      if (currentDayIndex !== -1) {
        if (_workingHours[currentDayIndex]?.activeFlag === true) {
          _todaysConsultants.push(consultant);
        }
      }
    });
          //Need to filter non-blocked consultants
          let nonBlockedConsultants = _todaysConsultants.filter(
            _data =>
              (_data?.is_blocked === undefined || _data?.is_blocked === null
                ? false
                : _data.is_blocked) === false,
          );
          let todayOnlyWorkingConsultants = filterTodayAvailableConsultants(
            nonBlockedConsultants,
          );
          setConsultantList(todayOnlyWorkingConsultants);
          // setRefresh(false);
          setIsLoading(false);
          setSelectedConsultant(todayOnlyWorkingConsultants[0]);
          setSelectedGender(todayOnlyWorkingConsultants[0]?.canServeGenders);
          setSelectedServingUserId(todayOnlyWorkingConsultants[0]?._id);
          performGetCalendarBookingList(
            selectedDate,
            'all',
            todayOnlyWorkingConsultants[0]?._id,
          );
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
          // setRefresh(false);
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
        // setRefresh(false);
      }
    });
  };
  //API CALLS
  /**
              *
              * Purpose:UpcomingBookingList listing
              * Created/Modified By: Sudhin
              * Created/Modified Date: 20 jan 2022
              * Steps:
                  1.fetch UpcomingBookingLists list from API and append to state variable
      */

  const performGetCalendarBookingList = (date, filterOption, serveUserId) => {
    console.log('start time ', selectedDate);
    console.log('filter Option', filterOption);
    let dateSelected = Utilities.appendBusinessTimeZoneToDate(date);

    let startDate =
      moment(dateSelected).format('dddd D MMMM YYYY 00:00:00 ') +
      Utilities.getBusinessTimeZoneOffset();
    let endDate =
      moment(dateSelected).format('dddd D MMMM YYYY 11:59:59 ') +
      Utilities.getBusinessTimeZoneOffset();
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.SERVING_USER_ID]: serveUserId,
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_DETAILS._id,
      [APIConnections.KEYS.START_DATE]: startDate,
      [APIConnections.KEYS.END_DATE]: endDate,
    };
    DataManager.getCalendarListData(filterOption, body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            console.log('Calendar data', data.objects);
            setCalendarDataList(data.objects);
            setRefresh(false);
            setIsLoading(false);
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            setIsLoading(false);
            setRefresh(false);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
          setRefresh(false);
        }
      },
    );
  };
  const onRefresh = () => {
    //set isRefreshing to true
    setIsLoading(false);
    setRefresh(true);
    performGetCalendarBookingList(
      selectedDate,
      selectedButtonOption,
      selectedServingUserId,
    );
    // and set isRefreshing to false at the end of your callApiMethod()
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
          width:  DisplayUtils.setWidth(100) / 5,
          height: 77,
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
  const allButtonPressAction = () => {
    setSelectedButtonOption('all');
    performGetCalendarBookingList(selectedDate, 'all', selectedServingUserId);
  };
  const bookedButtonPressAction = () => {
    setSelectedButtonOption('booked');
    performGetCalendarBookingList(
      selectedDate,
      'booked',
      selectedServingUserId,
    );
  };
  const availableButtonPressAction = () => {
    setSelectedButtonOption('freeslots');
    performGetCalendarBookingList(
      selectedDate,
      'freeslots',
      selectedServingUserId,
    );
  };
  const servingUserSelectionDropDownAction = () => {
    if (isConnected.isConnected === false) {
      Utilities.showToast(
        t(Translations.FAILED),
        t(Translations.NO_INTERNET),
        'error',
        'bottom',
      );
    } else {
      Globals.SHARED_VALUES.IS_FILER_TODAY_AVAILABLE_CONSULTANT = true;
      consultantFilterPopupRBsheet.current.open();
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE_COLOR,
        }}>
        <ConsultantFilterPopupComponent />
        <View
          style={{
            marginBottom: 15,
            marginTop: 15,
            backgroundColor: Colors.WHITE_COLOR,
            height: DisplayUtils.setWidth(100) / 5 + 15,
          }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DATA.length === 0
              ? null
              : DATA.map((item, index) => {
                  return <DateItem item={item} index={index} />;
                })}
          </ScrollView>
        </View>
        {/* check current user is consultant or non-consultant */}
        {Utilities.isUserIsConsultant() ? null : (
          <TouchableOpacity
            onPress={() => servingUserSelectionDropDownAction()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginBottom: 10,
              height: 40,
            }}>
            {isLoading ? (
              <ConsultantNameLoader />
            ) : (
              <>
                <Text
                  style={{
                    color: Colors.DARK_BROWN_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: 14,
                  }}>
                  {selectedConsultant?.name ||
                    t(Translations.SMALL_NO) +
                      ' ' +
                      Utilities.getSpecialistName().toLowerCase() +
                      ' ' +
                      t(Translations.SMALL_AVAILABLE)}{' '}
                </Text>
                <Image
                  source={Images.DROP_DOWN_ICON}
                  style={{
                    tintColor: Colors.DARK_BROWN_COLOR,
                    marginLeft: 10,
                  }}
                />
              </>
            )}
          </TouchableOpacity>
        )}

        <View />

        <View
          style={{
            flexDirection: 'row',

            marginTop: 10,
            marginLeft: 30,
            marginRight: 30,
          }}>
          <TouchableOpacity
            onPress={() => allButtonPressAction()}
            style={{
              backgroundColor:
                selectedButtonOption === 'all'
                  ? Colors.DARK_BROWN_COLOR
                  : Colors.WHITE_COLOR,
              height: 40,

              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color:
                  selectedButtonOption === 'all'
                    ? Colors.WHITE_COLOR
                    : Colors.DARK_BROWN_COLOR,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 14,
                marginLeft: 25,
                marginRight: 25,
              }}>
              {t(Translations.ALL)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => bookedButtonPressAction()}
            style={{
              backgroundColor:
                selectedButtonOption === 'booked'
                  ? Colors.DARK_BROWN_COLOR
                  : Colors.WHITE_COLOR,
              height: 40,
              marginLeft: 35,
              marginRight: 25,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              zIndex: 1,
            }}>
            <Text
              style={{
                color:
                  selectedButtonOption === 'booked'
                    ? Colors.WHITE_COLOR
                    : Colors.DARK_BROWN_COLOR,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 14,
                marginLeft: 25,
                marginRight: 25,
              }}>
              {t(Translations.BOOKED)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => availableButtonPressAction()}
            style={{
              backgroundColor:
                selectedButtonOption === 'freeslots'
                  ? Colors.DARK_BROWN_COLOR
                  : Colors.WHITE_COLOR,
              height: 40,

              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color:
                  selectedButtonOption === 'freeslots'
                    ? Colors.WHITE_COLOR
                    : Colors.DARK_BROWN_COLOR,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 14,
                marginLeft: 25,
                marginRight: 25,
              }}>
              {t(Translations.AVAILABLE)}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: DisplayUtils.setWidth(90),
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 20,
            borderWidth: 0.4,
            borderColor: Colors.SHADOW_COLOR,
            paddingTop: 15,
            height: DisplayUtils.setHeight(45),
          }}>
          <FlatList
            data={isLoading ? dummyCalendarList : calendarDataList}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            contentContainerStyle={{
              width: DisplayUtils.setWidth(80),
              paddingBottom: 10,
            }}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={
              isLoading ? dummyCalendarList : UpcomingBookingEmptyComponent
            }
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
              />
            }
          />
        </View>
      </View>
    </>
  );
};

export default React.memo(CalendarScreen);

const styles = StyleSheet.create({});
