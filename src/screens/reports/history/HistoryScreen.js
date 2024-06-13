import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  ScrollView,
  SectionList,
  I18nManager,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../constants';
import {t} from 'i18next';
import LottieView from 'lottie-react-native';
import HistoryDataCell from './HistoryDataCell';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GetImage} from '../../shared/getImage/GetImage';
import Utilities from '../../../helpers/utils/Utilities';
import DataManager from '../../../helpers/apiManager/DataManager';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import StorageManager from '../../../helpers/storageManager/StorageManager';
import LoadingIndicator from '../../shared/loadingIndicator/LoadingIndicator';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import NO_CONSULTATION_SVG from '../../../assets/images/noConsultationSvgImage.svg';
import ConsultantFilterPopupScreen from '../../shared/consultantFilterPopup/ConsultantFilterPopupScreen';
import { useSelector } from 'react-redux';
import ManageQueueTabletHeader from '../../manageQueue/ManageQueueTabletHeader';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import moment from 'moment';

const HistoryScreen = () => {
  const isConnected = useNetInfo();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const consultantFilterPopupRBsheet = useRef();
  const [isLoading, setIsLoading] = useState(true);
  // const [loadImage, setLoadImage] = useState(true);
  const [isPageEnded, setIsPageEnded] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [consultantList, setConsultantList] = useState([]);
  const [historyDataList, setHistoryDataList] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);
    console.log('isUserIsConsultant', Utilities.isUserIsConsultant());

    Utilities.isUserIsConsultant()
      ? performHistoryList(Globals.USER_DETAILS?._id, true, 1, '')
      : performGetConsultantList();
  }, []);
   //redux state for tabletview
   const isTablet = useSelector((state)=>state.tablet.isTablet);

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

 
  //Shimmer loader for the date
  const DateLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={40}
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="20" y="15" rx="0" ry="0" width="120" height="12" />
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
          performHistoryList(todayOnlyWorkingConsultants[0]?._id, true, 1, '');
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
  /**
   * Purpose: list on end reached component
   * Created/Modified By: Vijn
   * Created/Modified Date: 10 Aug 2021
   * Steps:
   */
  const listOnEndReach = () => {
    console.log(
      `Detected on end reach isPaginating: ${isPaginating}, isPageEnded: ${isPageEnded}`,
    );

    if (!isPageEnded && !isLoading && !isPaginating) {
      let newPageNo = pageNo + 1;
      console.log('PageNo:', newPageNo);
      if (newPageNo !== 1) {
        setIsPaginating(true);
      }
      console.log('setIndicator:', isPaginating);
      setPageNo(newPageNo);
      performHistoryList(
        Utilities.isUserIsConsultant() === true
          ? Globals.USER_DETAILS._id
          : selectedConsultant?._id,
        false,
        newPageNo,
        search,
      );
    }
  };

  /**
          * Purpose: List empty component
          * Created/Modified By: Sudhin Sudhakaran
          * Created/Modified Date: 11 Oct 2021
          * Steps:
              1.Return the component when list is empty
      */
  const HistoryEmptyComponent = () => {
    return search === '' ? (
      <View
        style={{
          //   width: Display.setWidth(60),
          //   height: Display.setHeight(30),
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 80,
        }}>
        <LottieView
          style={{width: DisplayUtils.setWidth(50)}}
          source={Images.LOTTIE_DATE_CALENDAR_ANIMATION}
          autoPlay
          loop
          colorFilters={[
            {
              keypath: 'calendar.x',
              color: Colors.PRIMARY_COLOR,
            },
            {
              keypath: 'calendar.x 2',
              color: Colors.PRIMARY_COLOR,
            },
            {
              keypath: 'calendar.x 3',
              color: Colors.PRIMARY_COLOR,
            },
            {
              keypath: 'calendar.tabs',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'calendar.tabs.Rectangle 2',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'calendar.page Comp 1.page.Shape 1.Stroke 1',
              color: Colors.SECONDARY_COLOR,
            },
          ]}
        />
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.ERROR_RED_COLOR,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: isTablet===true?27:20,
            marginTop: -10,
          }}>
          {t(Translations.HEY_NOTHING_HERE)}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.PRIMARY_TEXT_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize:  isTablet===true?20:14,
            marginTop: 20,
          }}>
          {t(Translations.YOU_HAVE_NO_VISITORS)}
        </Text>
      </View>
    ) : (
      <View
        style={{
          //   width: Display.setWidth(60),
          //   height: Display.setHeight(30),
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 80,
        }}>
        <LottieView
          style={{width: DisplayUtils.setWidth(50)}}
          source={Images.LOTTIE_SEARCH_NO_RESULT}
          autoPlay
          loop
          colorFilters={[
            {
              keypath: 'main.magnifier.矩形.矩形.Fill 1',
              color: Colors.SECONDARY_COLOR,
            },
          ]}
        />

        <Text
          style={{
            alignSelf: 'center',
            color: Colors.ERROR_RED_COLOR,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize:  isTablet===true?22:18,
            marginTop: 20,
          }}>
          {t(Translations.NO_RESULT_FOUND)}
        </Text>
      </View>
    );
  };
  /**
   * Purpose: pagination loader component
   * Created/Modified By: Vijin
   * Created/Modified Date: 10 Nov 2021
   * Steps:
   */
  const paginationComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator
          style={{marginBottom: 20}}
          color={Colors.PRIMARY_COLOR}
          size="small"
        />
      </View>
    );
  };

  /**
   * Purpose: sort the data by date
   * Created/Modified By: Vijin
   * Created/Modified Date: 10 Nov 2021
   * Steps:
   */
  const DATA = dummyHistoryList.reduce((re, o) => {
    let existObj = re.find(
      obj =>
        obj.title ===
        Utilities.getUtcToLocalWithFormat(o.dateTo, 'DD MMM YYYY'),
    );

    if (existObj) {
      existObj.data.push(o);
    } else {
      re.push({
        title: Utilities.getUtcToLocalWithFormat(o.dateTo, 'DD MMM YYYY'),
        data: [o],
      });
    }
    return re;
  }, []);

  const HISTORY_DATA = historyDataList.reduce((re, o) => {
    let existObj = re.find(
      obj =>
        obj.title ===
        Utilities.getUtcToLocalWithFormat(o.dateTo, 'DD MMM YYYY'),
    );

    if (existObj) {
      existObj.data.push(o);
    } else {
      re.push({
        title: Utilities.getUtcToLocalWithFormat(o.dateTo, 'DD MMM YYYY'),
        data: [o],
      });
    }
    return re;
  }, []);

  // console.log('converted array', HISTORY_DATA)
  const searchButtonAction = () => {
    Keyboard.dismiss();
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performHistoryList(
        Utilities.isUserIsConsultant() === true
          ? Globals.USER_DETAILS._id
          : selectedConsultant?._id,
        true,
        1,
        search,
      );
    }
  };
  const closeButtonAction = () => {
    Keyboard.dismiss();
    setSearch('');
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performHistoryList(
        Utilities.isUserIsConsultant() === true
          ? Globals.USER_DETAILS._id
          : selectedConsultant?._id,
        true,
        1,
        '',
      );
    }
  };

  //API CALLS
  /**
            *
            * Purpose: Business listing
            * Created/Modified By: Jenson
            * Created/Modified Date: 27 Dec 2021
            * Steps:
                1.fetch business list from API and append to state variable
    */

  const performHistoryList = (
    _userId = Utilities.isUserIsConsultant()
      ? Globals.USER_DETAILS._id
      : selectedConsultant?._id,
    isLoaderRequired,
    pageNumber,
    searchValue,
  ) => {
    var userId = _userId;
    if (isLoaderRequired) {
      setIsLoading(true);
    }
    DataManager.getHistoryList(pageNumber, searchValue, userId).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            if (pageNumber !== 1) {
              if (data.objects.length === 0) {
                console.log('END FOUND');
                setIsPageEnded(true);
              } else {
                //Appending data
                //setSearchList(...searchList, ...data.data.objects)
                setHistoryDataList(customerList => {
                  return [...customerList, ...data.objects];
                });
              }
            } else {
              setHistoryDataList(data.objects);
              // console.log('history data',data.objects)
            }
          } else {
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
        setIsLoading(false);
        setRefresh(false);
        setIsPaginating(false);
      },
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
        onClose={() => {
          // performHistoryList(Utilities.isUserIsConsultant() === true ? Globals.USER_DETAILS._id : selectedConsultant?._id, true, 1, search);
        }}>
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
    performHistoryList(
      Utilities.isUserIsConsultant() === true
        ? Globals.USER_DETAILS._id
        : selectedOption?._id,
      true,
      1,
      search,
    );
  };
  const onRefresh = () => {
    //set isRefreshing to true
    setIsLoading(false);
    setRefresh(true);
    performHistoryList(
      Utilities.isUserIsConsultant() === true
        ? Globals.USER_DETAILS._id
        : selectedConsultant?._id,
      false,
      1,
      '',
    );
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  const renderHeader = ({section}) => {
    return (
      <View style={{backgroundColor: Colors.WHITE_COLOR}}>
        {isLoading ? (
          <DateLoader />
        ) : (
          <Text
            style={{
              fontSize: isTablet===true?22:12,
              fontFamily: Fonts.Gibson_SemiBold,
              color: Colors.CUSTOMER_NAME_COLOR,
              marginVertical: 8,
              marginLeft: 15,
              textAlign: 'left',
            }}>
            {section.title}
          </Text>
        )}
      </View>
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
    return <HistoryDataCell item={item} index={index} isLoading={isLoading} />;
  };

  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1, backgroundColor: Colors.WHITE_COLOR}}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE_COLOR,
        }}>
        {isTablet===true?
        <ManageQueueTabletHeader
          onConsultantSelection={handleConsultantSelection}
          selectedConsultant={selectedConsultant}
          from={'HISTORY_SCREEN'}
        />:null}
        <ConsultantFilterPopupComponent />
        <View
          style={{
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
            height: 40,
            justifyContent: 'center',
            //Shadow props
            borderWidth: 0.1,
            borderColor: Colors.GREY_COLOR,
            backgroundColor: Colors.WHITE_COLOR,
            shadowColor: Colors.SHADOW_COLOR,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 8,
            marginBottom: 16,
          }}>
          <TextInput
            style={{
              marginLeft: 16,
              marginRight: 50,
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              fontSize:isTablet===true?20:14,
            }}
            placeholder={t(Translations.SEARCH)}
            color={Colors.PRIMARY_TEXT_COLOR}
            placeholderTextColor={Colors.TEXT_PLACEHOLDER_COLOR}
            autoCorrect={false}
            returnKeyType="search"
            editable={true}
            value={search}
            onSubmitEditing={() => {
              searchButtonAction();
            }}
            onChangeText={text =>
              text === '' ? closeButtonAction() : setSearch(text.trimStart())
            }
            // onClear={() => closeButtonAction()}
          />
          {search !== '' ? (
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: Colors.WHITE_COLOR,
                position: 'absolute',
                right: 45,
              }}
              onPress={() => closeButtonAction()}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                }}
                source={Images.CROSS_BUTTON_ICON}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => (search !== '' ? searchButtonAction() : null)}
            style={{
              position: 'absolute',
              right: 8,
              justifyContent: 'center',
              backgroundColor: Colors.SECONDARY_COLOR,
              height: 31,
              width: 31,
              borderRadius: 4,
            }}>
            <Image
              style={{
                width: isTablet===true?20:16,
                height: isTablet===true?20:16,
                resizeMode: 'contain',
                tintColor: Colors.WHITE_COLOR,
                alignSelf: 'center',
              }}
              source={Images.SEARCH_ICON}
            />
          </TouchableOpacity>
        </View>
        {/* check current user is consultant or non-consultant */}
        { isTablet===true?null:
          Utilities.isUserIsConsultant() ? null : (
          <TouchableOpacity
            onPress={() => servingUserSelectionDropDownAction()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginBottom: 10,
            }}>
            {isLoading ? (
              <ConsultantNameLoader />
            ) : (
              <>
                <Text
                  style={{
                    color: Colors.DARK_BROWN_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: isTablet===true?20:14,
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
        <View
          style={{ 
            marginTop: 20,
            marginBottom: 105,
          }}>
          <SectionList
            sections={isLoading ? DATA : HISTORY_DATA}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            renderSectionHeader={renderHeader}
            contentContainerStyle={{paddingBottom: 100}}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              listOnEndReach();
            }}
            ListEmptyComponent={
              isLoading ? dummyHistoryList : HistoryEmptyComponent
            }
            ListFooterComponent={isPaginating ? paginationComponent : null}
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
    </KeyboardAvoidingView>
  );
};

export default React.memo(HistoryScreen);

const styles = StyleSheet.create({});
