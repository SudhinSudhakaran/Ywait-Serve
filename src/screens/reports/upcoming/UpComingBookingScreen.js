import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  I18nManager,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../constants';
import moment from 'moment';
import DataManager from '../../../helpers/apiManager/DataManager';
import Utilities from '../../../helpers/utils/Utilities';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import RBSheet from 'react-native-raw-bottom-sheet';
import ConsultantFilterPopupScreen from '../../shared/consultantFilterPopup/ConsultantFilterPopupScreen';
import NoConsultationToday from './NoConsultationToday';
import {GetImage} from '../../shared/getImage/GetImage';
import {useNavigation} from '@react-navigation/core';
import {t} from 'i18next';
import HollyDayEmptyComponent from '../../bookingQueue/emptyScreens/HollyDayEmptyComponent';
import UpComingSpecialistEmptyComponent from './UpComingSpecialistEmptyComponent';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useSelector } from 'react-redux';
import ManageQueueTabletHeader from '../../manageQueue/ManageQueueTabletHeader';
const UpComingBookingScreen = () => {
  const navigation = useNavigation();
  const isConnected = useNetInfo();
  const [dateDataIndex, setDateDataIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    Utilities.convertorTimeToBusinessTimeZone(moment().format()),
  );
  const [consultantList, setConsultantList] = useState([]);
  const [dateRefresh, setDateRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [upcomingDataList, setUpcomingDataList] = useState([]);
  const [loadImage, setLoadImage] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState([]);
  const [selectedServingUserId, setSelectedServingUserId] = useState(
    Globals.USER_DETAILS._id,
  );
  const [selectedDayIsHolyday, setSelectedDayIsHolyDay] = useState(false);
  const [isSpecialistAvailable, setIsSpecialistAvailable] = useState(true);
  //redux state for tabletview
  const isTablet = useSelector((state)=>state.tablet.isTablet);
  // var dateStart = moment(
  //   moment(moment(moment().subtract(5, 'month')).startOf('month'))
  //     .utcOffset(Globals.BUSINESS_DETAILS.timeZone.offset)
  //     .format('MM-DD-YYYY'),
  //   'MM-DD-YYYY',
  // );
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
    checkHoliday(selectedDate);
    checkSpecialistAvailable(selectedDate);
  }, []);
  useEffect(() => {
    setIsLoading(true);

    // console.log('current time', moment().format('ddd MMM YYYY h:mm:ss a'));
    console.log('isUserIsConsultant', Utilities.isUserIsConsultant());
    Utilities.isUserIsConsultant()
      ? performGetUpcomingBookingList(
          true,
          moment().format(),
          selectedServingUserId,
        )
      : performGetConsultantList();
  }, []);

  const checkHoliday = _day => {
    let _holiday = Utilities.checkSelectedDateIsHoliday(_day);
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
             setIsSpecialistAvailable(true);
              console.log('Businesshour====',isSpecialistAvailable);
            }
            else{
              setIsSpecialistAvailable(false);
              console.log('Businesshourelse',isSpecialistAvailable);
            }
          }
        });
      }
    }
    return isSpecialistAvailable
  };

  const dummyHistoryList = [
    {
      id: '1',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '2',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },

    {
      id: '3',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '4',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '5',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '6',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '7',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '8',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '9',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
    {
      id: '10',
      customer_id: {
        addressLineOne: 'Plavaraputhenveedu',
        addressLineTwo: 'peringanadu',
        firstName: 'neha',
        lastName: 'Kumari',
        gender: 'Female',
        image: '',
        phoneNumber: '95******70',
      },
      hospitalID: '8859',
      lastVisit: '13 Jan 2022',
      date: '17 Jan 2022',
      time: '10:30 AM',
      dateTo: '2022-01-14T08:25:35.240Z',
    },
  ];

  //Shimmer loader for the flatList
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={120}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="60" y="20" rx="5" ry="5" width="120" height="8" />
      <Rect x="60" y="40" rx="5" ry="5" width="180" height="8" />
      <Rect x="60" y="60" rx="5" ry="5" width="220" height="8" />
      <Rect x="60" y="80" rx="5" ry="5" width="160" height="8" />
      <Rect x="60" y="100" rx="5" ry="5" width="80" height="8" />
      <Rect x="300" y="65" rx="0" ry="0" width="80" height="15" />
      <Rect x="300" y="85" rx="0" ry="0" width="80" height="15" />
      <Rect x="10" y="10" rx="20" ry="20" width="40" height="40" />
    </ContentLoader>
  );
  const ConsultantNameLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={40}
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="35%" y="15" rx="0" ry="0" width="120" height="12" />
    </ContentLoader>
  );
  const populateDates = (monthForDate, indexForDate) => {
    while (dateEnd > dateStart) {
      // console.log('date func called');
      tempData.push(dateStart.format());
      dateStart.add(1, 'days');
    }
    // console.log(tempData);
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
    setDateDataIndex(index);
    // goToIndex(index);
    // console.log('selected date', item)
    checkHoliday(moment(item).format());
    checkSpecialistAvailable(moment(item).format());
    performGetUpcomingBookingList(true, item, selectedServingUserId);
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
    setSelectedConsultant(selectedOption);
    setSelectedServingUserId(selectedOption._id);
    performGetUpcomingBookingList(true, selectedDate, selectedOption._id);
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
      return <UpComingSpecialistEmptyComponent isFrom="UPCOMING" />;
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
          console.log('Consultant data', nonBlockedConsultants);
          let todayOnlyWorkingConsultants = filterTodayAvailableConsultants(
            nonBlockedConsultants,
          );
          setConsultantList(todayOnlyWorkingConsultants);
          // setRefresh(false);
          setIsLoading(false);
          setSelectedConsultant(todayOnlyWorkingConsultants[0]);
          setSelectedServingUserId(todayOnlyWorkingConsultants[0]?._id);
          // console.log('consultant ########', data.objects[0]);
          performGetUpcomingBookingList(
            true,
            moment().format(),
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

  const performGetUpcomingBookingList = (
    isLoaderRequired,
    date,
    serveUserId,
  ) => {
    let dateSelected = Utilities.appendBusinessTimeZoneToDate(date);
    if (isLoaderRequired) {
      setIsLoading(true);
    }
    const body = {
      [APIConnections.KEYS.SERVING_USER_ID]: serveUserId,
      [APIConnections.KEYS.TIME]: dateSelected,
    };
    DataManager.getUpcomingBookingList(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            console.log('Upcoming data', data.object.list);
            setUpcomingDataList(data.object.list);
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
    // setIsLoading(true);
    setRefresh(true);
    performGetUpcomingBookingList(false, selectedDate, selectedServingUserId);
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  /**
       * Purpose:Render function of flat list
       * Created/Modified By: Sudhin Sudhakaran
       * Created/Modified Date: 8 Oct 2021
       * Steps:
           1.pass the data from api to customer details child component
   */
  const renderItem = ({item, index}) => {
    return <UpcomingBookingDataCell item={item} index={index} />;
  };

  const UpcomingBookingDataCell = ({item}) => {
    var userIdText = '';
    var userIdValue = '';
    let savedUserIdInfo = Utilities.getSavedBusinessUserIdInfo();
    userIdText = savedUserIdInfo?.label || 'CustomerID';
    if (item?.customer_id?.additionalInfo?.length > 0) {
      const userIdIndex = item?.customer_id?.additionalInfo.findIndex(
        _item => _item.key === (savedUserIdInfo?.key || 'customerId'),
      );
      var _userIdValue = item?.customer_id?.customerId || 0;
      if (userIdIndex !== -1) {
        _userIdValue = item?.customer_id?.additionalInfo[userIdIndex]?.value;
      }
      userIdValue = _userIdValue;
    } else {
      userIdValue = 'N/A';
    }
    return (
      <ScrollView>
        <View
          style={{
            borderTopWidth: 0.7,
            borderBottomWidth: 0.7,
            borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
            borderTopColor: Colors.LINE_SEPARATOR_COLOR,
            flexDirection: 'row',
            backgroundColor: Colors.WHITE_COLOR,
          }}>
          {isLoading ? (
            <ListLoader />
          ) : (
            <>
              <View style={{marginHorizontal: 12, marginTop: 15}}>
                <GetImage
                  style={{
                    width: isTablet===true?45:38,
                    height: isTablet===true?45:38,
                    borderRadius: isTablet===true?45/2:38 / 2,
                    borderWidth: 1,
                    borderColor: Colors.SECONDARY_COLOR,
                  }}
                  fullName={(
                    (item.customer_id.firstName || 'N/A') +
                    ' ' +
                    (item.customer_id.lastName || '')
                  ).trim()}
                  alphabetColor={Colors.PRIMARY_COLOR}
                  url={item.customer_id.image}
                />
              </View>
              <View style={{width: DisplayUtils.setWidth(60)}}>
                <View style={{marginBottom: 20, paddingRight: 15}}>
                  <Text
                    style={{
                      fontSize: isTablet===true?16:12,
                      fontFamily: Fonts.Gibson_SemiBold,
                      color: Colors.CUSTOMER_NAME_COLOR,
                      marginTop: 10,
                      textAlign: 'left',
                    }}
                    numberOfLines={1}>
                    {item.customer_id.firstName} {''}
                    {item.customer_id.lastName}
                  </Text>
                  <View
                    style={{
                      flexDirection:'row',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color: Colors.HOSPITAL_NAME_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet===true?16:12,
                      }}>
                        {I18nManager.isRTL===true?
                         (t(Translations.CUSTOMER_ID))+ " : " : (t(Translations.CUSTOMER_ID))+":"
                        } 
                    </Text>
                    <View  style={{ flexDirection:I18nManager.isRTL===true?'row-reverse':'row',
                  marginLeft:I18nManager.isRTL===true?responsiveHeight(7):0}}>
                    <Text
                      style={{
                        color: Colors.HOSPITAL_NAME_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet===true?16:12,
                      }}>
                        {Globals.BUSINESS_DETAILS.customerPrefix}
                    </Text>
                    {Globals.HIDE_FOR_PRACTO ===true?
            <Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize:isTablet===true?16: 12,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
            }}
            numberOfLines={1}>
            {item?.customer_id?.customerId || 'N/A'}
          </Text>:
                    <Text
                      style={{
                        color: Colors.SECONDARY_COLOR,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize: isTablet===true?16:12,
                      }}>
                      {userIdValue}
                    </Text>}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color: Colors.HOSPITAL_NAME_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet===true?16:12,
                      }}>
                      {t(Translations.TIME)}
                    </Text>
                    <Text
                      style={{
                        color: Colors.HOSPITAL_NAME_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet===true?16:12,
                      }}>
                      {''}#
                    </Text>
                    <Text
                      style={{
                        color: Colors.SECONDARY_COLOR,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize: isTablet===true?16:12,
                      }}>
                      {' '}
                      {Utilities.getUtcToLocalWithFormat(
                        item.dateFrom,
                        'hh:mm A',
                      )}
                    </Text>
                  </View>
                  <View style={{marginTop: 8, flexDirection: 'row'}}>
                    <Image
                      style={{width: isTablet===true?13:9, height:isTablet===true?16:12, marginTop: 5}}
                      source={Images.LOCATION_ICON}
                    />
                    <Text
                      style={{
                        color: Colors.SECONDARY_COLOR,
                        fontSize: isTablet===true?16:12,
                        fontFamily: Fonts.Gibson_Regular,
                        marginLeft: 5,
                        textAlign: 'left',
                        lineHeight: 15,
                        marginTop: 3,
                      }}
                      numberOfLines={2}>
                      {item.customer_id.addressLineOne ? item.customer_id.addressLineOne : <Text>N/A</Text>}
                    </Text>
                  </View>
                  <View style={{marginTop: 8, flexDirection: 'row'}}>
                    <Image
                      style={{width:isTablet===true?15: 12, height: isTablet===true?15:12}}
                      source={Images.PHONE_ICON}
                    />
                    <Text
                      style={{
                        color: Colors.CUSTOMER_NAME_COLOR,
                        fontSize:isTablet===true?16: 12,
                        fontFamily: Fonts.Gibson_Regular,
                        marginLeft: 5,
                      }}>
                      {item.customer_id.phoneNumber ? item.customer_id.phoneNumber : <Text>N/A</Text>}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  position: 'absolute',
                  right: 10,
                  bottom: 45,
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    backgroundColor: Colors.PRIMARY_COLOR,
                    padding: 5,
                    width: isTablet===true?95:80,
                    height:isTablet===true?responsiveHeight(4.5):responsiveHeight(3),
                    marginRight:isTablet===true?responsiveHeight(10):0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.WHITE_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet===true?16:10,
                    }}>
                    {item.name === 'Booking'
                      ? t(Translations.BOOKING)
                      : t(Translations.QUEUE)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    isLoading
                      ? null
                      : navigation.navigate('AppointmentDetailsScreen', {
                          selectedAppointment_id: item._id,
                          selectedAppointmentType: item.name,
                          isFrom: 'UPCOMING_LIST_SCREEN',
                        })
                  }
                  style={{
                    backgroundColor: Colors.SECONDARY_COLOR,
                    padding: 5,
                    width: isTablet===true?95:80,
                    height:isTablet===true?responsiveHeight(4.5):responsiveHeight(3),
                    marginRight:isTablet===true?responsiveHeight(10):0,
                    marginTop: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.WHITE_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet===true?16:10,
                    }}>
                    {t(Translations.VIEW_DETAILS)}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    );
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
          width: isTablet?responsiveWidth(14):responsiveWidth(20),
          height: DisplayUtils.setWidth(100) / 5,
          backgroundColor:
            dateDataIndex === index
              ? Colors.SECONDARY_COLOR
              : Colors.NOTIFICATION_BACKGROUND_COLOR,
        }}>
        <Text
          style={{
            fontFamily: Fonts.Gibson_Regular,
            fontSize:isTablet===true?16: 10,
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
            fontSize: isTablet===true?25:20,
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
            fontSize: isTablet===true?25:20,
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
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE_COLOR,
        }}>
        {/*consultant selection header for insta tablet view  */}
        {isTablet===true?<ManageQueueTabletHeader
          onConsultantSelection={handleConsultantSelection}
           selectedConsultant={selectedConsultant}
           from={'UPCOMING_SCREEN'}
        />:null}
        <ConsultantFilterPopupComponent />
        <View
          style={{
            marginBottom: 15,
            marginTop: 15,
            backgroundColor: Colors.WHITE_COLOR,
            height: DisplayUtils.setWidth(100) / 5 + 15,
          }}>
          {/* <FlatList
            ref={dateFlatListRef}
            style={{flexGrow: 0}}
            refreshing={dateRefresh}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 700));
              wait.then(() => {
                dateFlatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true / false,
                });
              });
            }}
            contentContainerStyle={{
              paddingRight: 10,
              paddingBottom: 10,
              marginTop: 10,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={DATA} //1
            renderItem={renderDates}
            keyExtractor={(item, index) => index.toString()} //2
          /> */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DATA.length === 0
              ? null
              : DATA.map((item, index) => {
                  return <DateItem item={item} index={index} />;
                })}
          </ScrollView>
        </View>
        {/* check current user is consultant or non-consultant */}
        {isTablet===true?null:
          Utilities.isUserIsConsultant() ? null : (
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
                    fontSize:isTablet===true?20: 14,
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
        {/* <ScrollView> */}
        <View style={{marginTop: 10, marginBottom: 180}}>
          <FlatList
            data={isLoading ? dummyHistoryList : upcomingDataList}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{paddingBottom: 100}}
            onEndReachedThreshold={0.2}
            // onEndReached={() => {
            //   listOnEndReach();
            // }}
            ListEmptyComponent={
              isLoading ? dummyHistoryList : UpcomingBookingEmptyComponent
            }
            // ListFooterComponent={isPaginating ? paginationComponent : null}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
              />
            }
          />
        </View>
        {/* </ScrollView> */}
      </View>
    </>
  );
};

export default React.memo(UpComingBookingScreen);

const styles = StyleSheet.create({});
