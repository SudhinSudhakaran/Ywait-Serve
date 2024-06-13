import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  useWindowDimensions,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  KeyboardAvoidingView,
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import FastImage from 'react-native-fast-image';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {useHeaderHeight} from '@react-navigation/elements';
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
import {AppointmentType} from '../../helpers/enums/Enums';
import Utilities from '../../helpers/utils/Utilities';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import APIConnections from '../../helpers/apiManager/APIConnections';
import NO_VISITORS from '../../assets/images/noVisitsError.svg';
import LottieView from 'lottie-react-native';
import {GetImage} from '../shared/getImage/GetImage';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect} from '@react-navigation/core';
import NO_DEPARTMENT_ICON from '../../assets/images/departmentEmptyIcon.svg';
import DepartmentSelectionPopUp from './DepartmentSelectionPopUp';
import {GetLottieImage} from '../shared/getLottieImage/GetLottieImage';
import {t} from 'i18next';
import moment from 'moment';
const AllServingUsersList = props => {
  const {selectedGender} = props?.route?.params || '';
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isPageEnded, setIsPageEnded] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [serveUserDataList, setServeUserDataList] = useState([]);
  // const [loadImage, setLoadImage] = useState(true);
  const [selectedServeUserImageUrl, setSelectedServeUserImageUrl] =
    useState('');
  const [selectedServeUserTitle, setSelectedServeUserTitle] = useState(
    Globals.BUSINESS_DETAILS.specialistName || t(Translations.SPECIALIST),
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const searchInputRef = useRef();
  const departmentSelectionRBSheetRef = useRef();
console.log('showPriceDetailsToConsultant',Globals?.BUSINESS_DETAILS)
  const dummyCustomerList = [
    {
      id: '1',
      firstName: 'neha',
      lastName: 'kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '2',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: 'No Visit',
    },
    {
      id: '3',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: 'Undefined',
      lastVisit: '13 jan 2022',
    },
    {
      id: '4',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '5',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '6',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '7',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '8',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '9',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '10',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
  ];
  useEffect(() => {
    console.log('props', props);
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);
    performGetServeUserList(true, 1, '', '');
  }, []);

  //Shimmer loader for the flatList
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={80}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="60" y="20" rx="5" ry="5" width="120" height="8" />
      <Rect x="60" y="40" rx="5" ry="5" width="230" height="8" />
      <Rect x="60" y="60" rx="5" ry="5" width="180" height="8" />
      <Rect x="300" y="20" rx="0" ry="0" width="80" height="10" />
      <Rect x="300" y="60" rx="0" ry="0" width="80" height="10" />
      <Rect x="10" y="10" rx="20" ry="20" width="40" height="40" />
    </ContentLoader>
  );
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
      performGetServeUserList(false, newPageNo, search, selectedDepartmentId);
    }
  };
  /**
            * Purpose: List empty component
            * Created/Modified By: Sudhin Sudhakaran
            * Created/Modified Date: 11 Oct 2021
            * Steps:
                1.Return the component when list is empty
        */
  const CustomerEmptyComponent = () => {
    return search.length > 0 ? (
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
          style={{width: 200, height: 180}}
          source={Images.EMPTY_CHAIR_ANIMATION_ICON}
          autoPlay
          loop
          colorFilters={[
            {
              keypath: 'ywait#primary',
              color: Colors.PRIMARY_COLOR,
            },
            {
              keypath: 'ywait#secondary',
              color: Colors.SECONDARY_COLOR,
            },
          ]}
        />
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.PRIMARY_TEXT_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 18,
            marginTop: 8,
            marginLeft:30,
          }}>
        {t(Translations.SMALL_NO)} {Utilities.getSpecialistName()}{' '}
          {t(Translations.FOUND)}        </Text>
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.SECONDARY_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 12,
            marginTop: 12,
          }}>
          {t(Translations.Y_WAIT)}
          <Text
            style={{
              alignSelf: 'center',
              color: Colors.PRIMARY_TEXT_COLOR,
            }}>
            {' '}
            {t(Translations.FIND_YOUR_SPECIALIST_NOW)}
          </Text>
        </Text>
      </View>
    ) : (
      // <View
      //   style={{
      //     //   width: Display.setWidth(60),
      //     //   height: Display.setHeight(30),
      //     alignSelf: 'center',
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //     marginTop: 200,
      //   }}>
      //   <LottieView
      //     style={{width: 200, height: 180}}
      //     source={Images.EMPTY_CHAIR_ANIMATION}
      //     autoPlay
      //     loop
      //     colorFilters={[
      //       {
      //         keypath: 'ywait#primary',
      //         color: Colors.PRIMARY_COLOR,
      //       },
      //       {
      //         keypath: 'ywait#secondary',
      //         color: Colors.SECONDARY_COLOR,
      //       },
      //     ]}
      //   />
      //   <Text
      //     style={{
      //       alignSelf: 'center',
      //       color: Colors.ERROR_RED_COLOR,
      //       fontFamily: Fonts.Gibson_SemiBold,
      //       fontSize: 18,
      //       marginTop: 20,
      //     }}>
      //     {t(Translations.SMALL_NO) +
      //       '  ' +
      //       Utilities.getSpecialistName().toLowerCase() +
      //       '  ' +
      //       t(Translations.SMALL_AVAILABLE)}
      //   </Text>
      // </View>

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
          style={{width: 200, height: 180}}
          source={Images.EMPTY_MANAGE_QUEUE_ANIMATION}
          autoPlay
          loop
          colorFilters={[
            {
              keypath: 'ywait#primary',
              color: Colors.PRIMARY_COLOR,
            },
            {
              keypath: 'ywait#secondary',
              color: Colors.SECONDARY_COLOR,
            },
          ]}
        />
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.PRIMARY_TEXT_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 18,
            marginTop: 8,
          }}>
          {t(Translations.SMALL_NO)} {Utilities.getSpecialistName()}{' '}
          {t(Translations.FOUND)}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.SECONDARY_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 12,
            marginTop: 12,
          }}>
          {t(Translations.Y_WAIT)}
          <Text
            style={{
              alignSelf: 'center',
              color: Colors.PRIMARY_TEXT_COLOR,
            }}>
            {' '}
            {t(Translations.FIND_YOUR_SPECIALIST_NOW)}
          </Text>
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

  const searchButtonAction = () => {
    Keyboard.dismiss();
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performGetServeUserList(true, 1, search, selectedDepartmentId);
    }
  };
  const closeButtonAction = () => {
    Keyboard.dismiss();
    setSearch('');
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performGetServeUserList(true, 1, '', selectedDepartmentId);
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
              * Purpose: Business listing
              * Created/Modified By: Jenson
              * Created/Modified Date: 27 Dec 2021
              * Steps:
                  1.fetch business list from API and append to state variable
      */

  const performGetServeUserList = (
    isLoaderRequired,
    pageNumber,
    searchValue,
    departmentId,
  ) => {
    if (isLoaderRequired) {
      setIsLoading(true);
    }
    let _selectedGender = selectedGender || '';
    DataManager.getServeUserList(
      pageNumber,
      searchValue,
      _selectedGender,
      departmentId,
    ).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data !== undefined && data !== null) {
          if (pageNumber !== 1) {
            if (data.objects.length === 0) {
              console.log('END FOUND');
              setIsPageEnded(true);
            } else {
              let allConsultants = data.objects;
              //Need to filter non-blocked consultants
              let nonBlockedConsultants = allConsultants.filter(
                _data =>
                  (_data?.is_blocked === undefined || _data?.is_blocked === null
                    ? false
                    : _data.is_blocked) === false,
              );

              //Appending data
              setServeUserDataList(serveUserList => {
                return [...serveUserList, ...nonBlockedConsultants];
              });
            }
          } else {
            let allConsultants = data.objects;
            //Need to filter non-blocked consultants
            let nonBlockedConsultants = allConsultants.filter(
              _data =>
                (_data?.is_blocked === undefined || _data?.is_blocked === null
                  ? false
                  : _data.is_blocked) === false,
            );
            let todayOnlyWorkingConsultants = filterTodayAvailableConsultants(
              nonBlockedConsultants,
            );
            setServeUserDataList(todayOnlyWorkingConsultants);
          }
        } else {
          setIsLoading(false);
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
      setIsLoading(false);
      setIsPaginating(false);
    });
  };

  const cellPressAction = item => {
    // console.log(item.requireProfileUpdate)
    if (!isLoading) {
      navigation.navigate('NewBookingCustomerListScreen', {
        isServingUserSelected: true,
        selectedServingUserId: item._id,
        selectedGender: selectedGender,
        parentSource: 'dashboard',
        selectedServingUserInfo : item
      });
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
    return <CustomerListData item={item} index={index} />;
  };

  const CustomerListData = ({item}) => {
    return isLoading ? (
      <ListLoader />
    ) : (
      <TouchableOpacity
        onPress={() => cellPressAction(item)}
        style={{
          borderBottomWidth: 0.7,
          borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
          borderTopColor: Colors.LINE_SEPARATOR_COLOR,
          flexDirection: 'row',
          backgroundColor: Colors.WHITE_COLOR,
        }}>
        {
          <>
            <View style={{alignSelf: 'center'}}>
              <GetImage
                style={{
                  marginLeft: 20,
                  width: 50,
                  height: 50,
                  borderRadius: 50 / 2,
                  borderWidth: 2,
                  borderColor: Colors.PRIMARY_COLOR,
                }}
                fullName={(
                  (item?.firstName || 'N/A') +
                  ' ' +
                  (item?.lastName || '')
                ).trim()}
                alphabetColor={Colors.SECONDARY_COLOR}
                url={item?.image}
              />
            </View>
            <View style={{width: DisplayUtils.setWidth(60)}}>
              <View
                style={{marginLeft: 16, marginBottom: 20, paddingRight: 15}}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.CUSTOMER_NAME_COLOR,
                    marginTop: 20,
                    textAlign: 'left',
                  }}
                  numberOfLines={1}>
                  {item?.name || ''}
                </Text>
                <View>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 12,
                      textAlign:'left',
                      textTransform:'capitalize',
                    }}>
                    {item?.designation_id?.designation ||  item?.role_id?.label || ''}
                  </Text>
                 {Globals?.BUSINESS_DETAILS?.showPriceDetailsToConsultant === false ? null :
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 12,
                      textAlign:'left',
                      textTransform:'capitalize',
                    }}>
                     {item?.consultationFee !== 0 ?
                      Utilities.getCurrencyFormattedPrice(
                      item?.consultationFee
                    ):null}
                  </Text>}
                  </View>
                </View>
                </View>
          </>
        }
      </TouchableOpacity>
    );
  };

  const onPressDepartmentChoose = () => {
    if (!Utilities.isServiceBasedBusiness()) {
      departmentSelectionRBSheetRef.current.open();
    }
  };
  /**
           * Purpose:show consultant filter popup
           * Created/Modified By: Sudhin
           * Created/Modified Date: 20 jan 2022
           * Steps:
               1.Open the rbSheet
       */
  const DepartmentFilterPopupComponent = () => {
    return (
      <RBSheet
        ref={departmentSelectionRBSheetRef}
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
        height={DisplayUtils.setHeight(80)}
        // onClose={() => {

        // }}
      >
        <DepartmentSelectionPopUp
          refRBSheet={departmentSelectionRBSheetRef}
          onDepartmentSelection={handleConsultantSelection}
          selectedDepartmentId={selectedDepartmentId}
        />
      </RBSheet>
    );
  };

  const handleConsultantSelection = selectedOption => {
    console.log('selected consultant', selectedOption);
    if (selectedOption._id === '-1') {
      setSearch('');
      setSelectedDepartmentId('');
      setSelectedServeUserTitle(
        Globals.BUSINESS_DETAILS.specialistName || t(Translations.SPECIALIST),
      );
      setSelectedServeUserImageUrl('');
      setPageNo(1);
      setIsPageEnded(false);
      performGetServeUserList(true, 1, '', '');
    } else {
      setSearch('');
      setSelectedDepartmentId(selectedOption?._id);
      setSelectedServeUserTitle(selectedOption?.department_name);
      if (selectedOption?.lottieImageName !== undefined) {
        setSelectedServeUserImageUrl(selectedOption?.lottieImageName);
      } else {
        setSelectedServeUserImageUrl(selectedOption?.departmentIcon);
      }
      setPageNo(1);
      setIsPageEnded(false);
      performGetServeUserList(true, 1, '', selectedOption?._id);
    }
  };
  const noChoiceButtonAction = () => {
    navigation.navigate('NewBookingCustomerListScreen', {
      isServingUserSelected: false,
      selectedGender: selectedGender,
      parentSource: 'dashboard',
    });
  };
  //final return
  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={useHeaderHeight()}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1, backgroundColor: 'white'}}>
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
          <DepartmentFilterPopupComponent />
          <LoadingIndicator visible={isLoaderLoading} />
          <View style={styles.header}>
            <View
              style={{
                marginTop: 25,
                marginLeft: 20,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', marginRight: 20}}
                onPress={() => navigation.goBack()}>
                <Image
                  style={{
                    height: 17,
                    width: 24,
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={Images.BACK_ARROW_IMAGE}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{justifyContent: 'center', flexDirection: 'row'}}
                onPress={() => onPressDepartmentChoose()}
                activeOpacity={1}>
                {selectedServeUserImageUrl === '' ||
                selectedServeUserImageUrl === undefined ? (
                  <NO_DEPARTMENT_ICON
                    width={24}
                    height={24}
                    fill={Colors.WHITE_COLOR}
                    fillNoDepartmentSecondary={Colors.SECONDARY_COLOR}
                    fillNoDepartmentPrimary={Colors.PRIMARY_COLOR}
                  />
                ) : Utilities.getFileExtension(selectedServeUserImageUrl) ===
                  'json' ? (
                  <GetLottieImage
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    url={selectedServeUserImageUrl}
                  />
                ) : (
                  <FastImage
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    source={{
                      uri: selectedServeUserImageUrl,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                )}
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_TEXT_COLOR,
                    fontSize: 18,
                    marginLeft: 16,
                    marginTop: 3,
                    maxWidth: DisplayUtils.setWidth(70),
                  }}
                  numberOfLines={1}>
                  {t(Translations._CHOOSE)}
                </Text>
                {/* <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_TEXT_COLOR,
                    fontSize: 18,
                    marginLeft: 16,
                    marginTop: 3,
                    maxWidth: DisplayUtils.setWidth(70),
                  }}
                  numberOfLines={1}>
                  {' '}
                </Text> */}
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_TEXT_COLOR,
                    fontSize: 18,
                    marginLeft: 7,
                    marginTop: 3,
                    maxWidth: DisplayUtils.setWidth(70),
                  }}
                  numberOfLines={1}>
                  {selectedServeUserTitle}
                </Text>
                {!Utilities.isServiceBasedBusiness() ? (
                  <Image
                    style={{
                      height: 6,
                      width: 13,
                      marginLeft: 10,
                      marginTop: 11,
                    }}
                    resizeMode="contain"
                    source={Images.DROP_DOWN_ICON}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginBottom: 16,
            }}>
            <View
              style={{
                marginTop: 20,
                marginLeft: 20,
                marginRight: 10,
                width: DisplayUtils.setWidth(90),
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
              }}>
              <TextInput
                style={{
                  marginLeft: 16,
                  marginRight: 50,
                  paddingRight: 30,
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
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
                onChangeText={value => setSearch(value.trimStart())}
                ref={searchInputRef}
              />
              {search !== '' ? (
                <TouchableOpacity
                  style={{
                    width: 30,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    right: 45,
                  }}
                  onPress={() => closeButtonAction()}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
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
                    width: 16,
                    height: 16,
                    resizeMode: 'contain',
                    tintColor: Colors.WHITE_COLOR,
                    alignSelf: 'center',
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={Images.SEARCH_ICON}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            // contentContainerStyle={{paddingBottom:85}}
            style={{
              marginBottom:
              Utilities.isServiceBasedBusiness() &&
              serveUserDataList?.length > 0 &&
              Globals.BUSINESS_DETAILS.autoAssign === true 
                  ? 0
                  : 0,
            }}
            data={isLoading ? dummyCustomerList : serveUserDataList}
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              listOnEndReach();
            }}
            ListEmptyComponent={
              isLoading ? dummyCustomerList : CustomerEmptyComponent
            }
            ListFooterComponent={isPaginating ? paginationComponent : null}
          />
          {Utilities.isServiceBasedBusiness() ? (
            serveUserDataList?.length > 0 &&
            Globals.BUSINESS_DETAILS.autoAssign === true ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.SECONDARY_COLOR,
                  height: 40,
                  justifyContent: 'center',
                }}
                onPress={() => noChoiceButtonAction()}>
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: 14,
                    alignSelf: 'center',
                  }}>
                  {t(Translations.NO_CHOICE_CAPITAL)}
                </Text>
              </TouchableOpacity>
            ) : null
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default AllServingUsersList;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.PRIMARY_WHITE,
    width: DisplayUtils.setWidth(100),
    height: 70,
    borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
  },
});
