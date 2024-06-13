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
import FastImage from 'react-native-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/core';
import {GetImage} from '../shared/getImage/GetImage';
import {useDispatch, useSelector} from 'react-redux';
import Utilities from '../../helpers/utils/Utilities';
import {useFocusEffect} from '@react-navigation/core';
import {AppointmentType} from '../../helpers/enums/Enums';
import {useHeaderHeight} from '@react-navigation/elements';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import InputScrollView from 'react-native-input-scroll-view';
import DataManager from '../../helpers/apiManager/DataManager';
import NO_VISITORS from '../../assets/images/noVisitsError.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import APIConnections from '../../helpers/apiManager/APIConnections';
import StorageManager from '../../helpers/storageManager/StorageManager';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import QueueSuccessPopUp from '../successAndFailurePopUps/queuePopUps/QueueSuccessPopUp';
import QueueFailurePopUp from '../successAndFailurePopUps/queuePopUps/QueueFailurePopUp';
import QueueConfirmationPopUp from '../confirmationPopUps/queuePopUps/QueueConfirmationPopUp';
import BookingSuccessPopUp from '../successAndFailurePopUps/bookingPopUps/BookingSuccessPopUp';
import BookingFailurePopUp from '../successAndFailurePopUps/bookingPopUps/BookingFailurePopUp';
import BookingConfirmationPopUp from '../confirmationPopUps/bookingPopUps/BookingConfirmationPopUp';
import QueuePaymentConfirmationPopUp from '../confirmationPopUps/queuePopUps/QueuePaymentConfirmationPopUp';
import BookingPaymentConfirmationPopUp from '../confirmationPopUps/bookingPopUps/BookingPaymentConfirmationPopUp';
import {BookingQueueAction} from '../../redux/actions';
const NewBookingCustomerListScreen = props => {
  const {
    appointmentType,
    selectedServingUserId,
    selectedGender,
    selectedAppointmentDateFrom,
    selectedQueueSlotInfo,
    parentSource,
    selectedServingUserInfo,
  } = props.route.params;
  const isForDirectConsultation =
    props?.route?.params?.isForDirectConsultation === undefined
      ? false
      : props?.route?.params?.isForDirectConsultation;
  const isServingUserSelected =
    props?.route?.params?.isServingUserSelected === undefined
      ? true
      : props?.route?.params?.isServingUserSelected;
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isPageEnded, setIsPageEnded] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [customerDataList, setCustomerDataList] = useState([]);
  // const [loadImage, setLoadImage] = useState(true);

  const [newBookingSuccessData, setNewBookingSuccessData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const searchInputRef = useRef();

  const bookingConfirmationRef = useRef();
  const queueConfirmationRef = useRef();
  const bookingPaymentConfirmationRef = useRef();
  const queuePaymentConfirmationRef = useRef();
  const bookingSuccessRef = useRef();
  const queueSuccessRef = useRef();
  const bookingFailureRef = useRef();
  const queueFailureRef = useRef();
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
    performGetCustomerList(true, 1, '');
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'selectedAppointmentDateFrom .....>>>',
        props?.route?.params?.selectedAppointmentDateFrom,
      );
      console.log(
        'Globals.SELECTED_CUSTOMER_INFO',
        Globals.SELECTED_CUSTOMER_INFO,
      );
      return () => {
        Globals.SELECTED_CUSTOMER_INFO = {};
        Globals.SELECTED_DATE_FROM = '';
        Globals.FAILURE_ERROR_MESSAGE = '';
        Globals.SELECTED_PAYMENT_INFO = {};
      };
    }, []),
  );
  const onRefresh = () => {
    //set isRefreshing to true
    setRefresh(true);
    performGetCustomerList(false, 1, '');
    // and set isRefreshing to false at the end of your callApiMethod()
  };
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
      performGetCustomerList(false, newPageNo, search);
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
    return (
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
            fontSize: 18,
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

  const searchButtonAction = () => {
    Keyboard.dismiss();
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performGetCustomerList(true, 1, search);
    }
  };
  const closeButtonAction = () => {
    Keyboard.dismiss();
    setSearch('');
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performGetCustomerList(true, 1, '');
    }
  };

  const addNewCustomerButtonAction = () => {
    Keyboard.dismiss();
    navigation.navigate('AddCustomerScreen', {
      onCreateCustomer: didCreatedNewCustomer,
    });
  };

  const didCreatedNewCustomer = (info = {}) => {
    console.log('Customer list updating.. New customer info: ', info);
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);
    performGetCustomerList(true, 1, '');

    cellPressAction(info);
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

  const performGetCustomerList = (
    isLoaderRequired,
    pageNumber,
    searchValue,
  ) => {
    if (isLoaderRequired) {
      setIsLoading(true);
    }
    DataManager.getCustomerList(pageNumber, searchValue).then(
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
                setCustomerDataList(customerList => {
                  return [...customerList, ...data.objects];
                });
              }
            } else {
              setCustomerDataList(data.objects);
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
    } else {
      body = {
        [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
      };
    }

    DataManager.performAddNewBooking(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoaderLoading(false);
          console.log('responcedata', responseData);
          setNewBookingSuccessData(responseData.objects);
          bookingSuccessRef.current.open();
        } else {
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
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
  const performAddNewQueue = (paymentType, referenceNumber, paymentStatus) => {
    setIsLoaderLoading(true);
    var body = {};
    if (Utilities.isBillingEnabled() && paymentStatus === 'PAID') {
      //if billing enabled and payment is done
      body = {
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.GENDER]: selectedGender,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
          selectedQueueSlotInfo?.expectedTimeOfServing,
        [APIConnections.KEYS.PREFERRED_TIME_FROM]: selectedQueueSlotInfo?.from,
        [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
        [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
        [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
        [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
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

    DataManager.performAddNewQueue(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setNewBookingSuccessData(responseData.objects);
          setIsLoaderLoading(false);
          queueSuccessRef.current.open();
        } else {
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          queueFailureRef.current.open();
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
  const fetchBookingPaymentInfo = () => {
    setIsLoaderLoading(true);
    const body = {
      [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
      [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
      [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
    };
    DataManager.performFetchPaymentInfo(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoaderLoading(false);
          let paymentInfo = responseData.objects;
          let totalValDouble = parseFloat(paymentInfo?.total);
          if (totalValDouble > 0) {
            Globals.SELECTED_PAYMENT_INFO = paymentInfo;
            bookingPaymentConfirmationRef.current.open();
          } else {
            bookingConfirmationRef.current.open();
          }
        } else {
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
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
    const body = {
      [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
      [APIConnections.KEYS.GENDER]: selectedGender,
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
      [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
        selectedQueueSlotInfo?.expectedTimeOfServing,
      [APIConnections.KEYS.PREFERRED_TIME_FROM]: selectedQueueSlotInfo?.from,
      [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
    };
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
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          queueFailureRef.current.open();
        }
      },
    );
  };

  /**
              *
              * Purpose: Perform Direct check in
              * Created/Modified By: Jenson
              * Created/Modified Date: 03 Feb 2021
              * Steps:
                  1.fetch data from API and append to state variable
      */
  const performDirectCheckIn = (selectedServicesId = []) => {
    setIsLoaderLoading(true);
    var body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
      [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
    };
    let customerAdditionalInfo = Globals.SELECTED_CUSTOMER_INFO?.additionalInfo;
    if (customerAdditionalInfo?.length > 0) {
      customerAdditionalInfo.map((item, itemIndex) => {
        body[item?.key] = item.value;
      });
    }
    if (Utilities.isServiceBasedBusiness()) {
      if (selectedServicesId.length > 0) {
        body[APIConnections.KEYS.SERVICES] = selectedServicesId;
      }
    }

    DataManager.performDirectCheckIn(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoaderLoading(false);
          //Navigate back to manage queue screen
          navigation.goBack();
        } else {
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          bookingFailureRef.current.open();
        }
      },
    );
  };

  const onSelectServicesHandler = (
    selectedServicesId,
    selectedCustomerInfo,
  ) => {
    //Check for DirectConsultation
    if (isForDirectConsultation === true) {
      Globals.SELECTED_CUSTOMER_INFO = selectedCustomerInfo;
      performDirectCheckIn(selectedServicesId);
    }
  };

  const cellPressAction = item => {
    // console.log(item.requireProfileUpdate)
    dispatch(BookingQueueAction.setSelectedDate(moment().toISOString()));
    if (!isLoading) {
      if (!item?.requireProfileUpdate) {
        if (Utilities.isServiceBasedBusiness()) {
          navigation.navigate('ServiceListScreen', {
            appointmentType: appointmentType,
            selectedServingUserId: selectedServingUserId,
            selectedGender: selectedGender,
            selectedCustomerInfo: item,
            selectedAppointmentDateFrom: selectedAppointmentDateFrom,
            selectedQueueSlotInfo: selectedQueueSlotInfo,
            isForDirectConsultation: isForDirectConsultation,
            isServingUserSelected: isServingUserSelected,
            parentSource: parentSource,
            didSelectedConfirm: onSelectServicesHandler,
            selectedServices: [],
            module: 'newBooking',
            selectedServingUserInfo: selectedServingUserInfo,
          });
        } else {
          //Check for DirectConsultation
          if (isForDirectConsultation === true) {
            Globals.SELECTED_CUSTOMER_INFO = item;
            //API call
            performDirectCheckIn();
          } else {
            if (parentSource === 'calender') {
              if (
                Utilities.isBillingEnabled() === true &&
                Utilities.isPaymentBeforeConsultation() === true
              ) {
                Globals.SELECTED_CUSTOMER_INFO = item;
                Globals.SELECTED_DATE_FROM = selectedAppointmentDateFrom;
                if (appointmentType === AppointmentType.booking) {
                  fetchBookingPaymentInfo();
                } else {
                  fetchQueuePaymentInfo();
                }
              } else {
                Globals.SELECTED_CUSTOMER_INFO = item;
                Globals.SELECTED_DATE_FROM = selectedAppointmentDateFrom;

                if (appointmentType === AppointmentType.booking) {
                  bookingConfirmationRef.current.open();
                } else {
                  queueConfirmationRef.current.open();
                }
              }
            } else if (parentSource === 'dashboard') {
              navigation.navigate('BookingQueueScreen', {
                selectedServingUserId: selectedServingUserId,
                selectedGender: selectedGender,
                selectedCustomerInfo: item,
                isServingUserSelected: isServingUserSelected,
                selectedServingUserInfo: selectedServingUserInfo,
              });
            }
          }
        }
      } else {
        Utilities.showToast(
          t(Translations.FAILED),
          t(
            Translations.CUSTOMER_PROFILE_IS_INCOMPLETE_PLEASE_UPDATE_AND_CONTINUE,
          ),
          'error',
          'bottom',
        );
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
    return <CustomerListData item={item} index={index} />;
  };

  const CustomerListData = ({item}) => {
    var userIdText = '';
    var userIdValue = '';
    let savedUserIdInfo = Utilities.getSavedBusinessUserIdInfo();
    userIdText = savedUserIdInfo?.label || 'CustomerID';
    if (item?.additionalInfo?.length > 0) {
      const userIdIndex = item?.additionalInfo.findIndex(
        _item => _item.key === (savedUserIdInfo?.key || 'customerId'),
      );
      var _userIdValue = item?.customerId || 0;
      if (userIdIndex !== -1) {
        _userIdValue = item?.additionalInfo[userIdIndex]?.value;
      }
      userIdValue = _userIdValue;
    } else {
      userIdValue = 'N/A';
    }
    return isLoading ? (
      <ListLoader />
    ) : (
      <TouchableOpacity
        style={{
          borderTopWidth: 0.7,
          borderBottomWidth: 0.7,
          borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
          borderTopColor: Colors.LINE_SEPARATOR_COLOR,
          flexDirection: 'row',
          backgroundColor: Colors.WHITE_COLOR,
        }}
        onPress={() => cellPressAction(item)}>
        <View style={{marginHorizontal: 12, marginTop: 10}}>
          <GetImage
            style={{
              marginTop: 5,
              marginLeft: 10,
              width: 42,
              height: 42,
              borderRadius: 42 / 2,
              borderWidth: 1,
              borderColor: Colors.SECONDARY_COLOR,
            }}
            fullName={(
              (item?.firstName || 'N/A') +
              ' ' +
              (item.lastName || '')
            ).trim()}
            url={item?.image}
          />
        </View>
        <View style={{marginBottom: 20, paddingRight: 40}}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: Fonts.Gibson_SemiBold,
              color: Colors.CUSTOMER_NAME_COLOR,
              marginTop: 10,
              textAlign: 'left',
            }}
            numberOfLines={1}>
            {item.firstName} {''}
            {item.lastName}
          </Text>
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              width: '66%',
            }}>
            <Image
              style={{width: 9, height: 12, marginTop: 5}}
              source={Images.LOCATION_ICON}
            />
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: 12,
                fontFamily: Fonts.Gibson_Regular,
                 marginTop: 3,
                marginLeft: 8,
                textAlign: 'left',
                width: '100%',
                lineHeight:15,
                marginHorizontal:40,
              }}
              numberOfLines={2}>
              {item.addressLineOne ? item.addressLineOne : <Text>N/A</Text>}
            </Text>
          </View>
          <View style={{marginTop: 8, flexDirection: 'row'}}>
            <Image
              style={{width: 12, height: 12, marginTop: 5}}
              source={Images.PHONE_ICON}
            />
            <Text
              style={{
                color: Colors.CUSTOMER_NAME_COLOR,
                fontSize: 12,
                fontFamily: Fonts.Gibson_Regular,
                marginTop: 5,
                marginLeft: 8,
              }}>
              {item.countryCode} {item.phoneNumber ? item.phoneNumber : <Text>N/A</Text>}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection:'row',
            position: 'absolute',
            right: 10,
            top: 10,
          }}>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 12,
            }}>
              {I18nManager.isRTL===true?
                        (t(Translations.CUSTOMER_ID))+ " : " : (t(Translations.CUSTOMER_ID))+":"
                        }
          </Text>
          <View style={{ flexDirection: I18nManager.isRTL===true?'row-reverse':'row'}}>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 12,
            }}>
              {Globals.BUSINESS_DETAILS.customerPrefix}
          </Text>
          <Text
            style={{
              color: Colors.TEXT_GREY_COLOR_9B,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 12,
            }}>
            {userIdValue}
          </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            right: 10,
            bottom: 20,
          }}>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Light,
              fontSize: 10,
            }}>
            {t(Translations.LAST_VISITED)}
            {/* {!I18nManager.isRTL ? ' :' : ''} */}
          </Text>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Light,
              fontSize: 10,
              marginLeft: 3,
            }}>
            :
          </Text>
          <Text
            style={{
              color: Colors.LAST_VISITED_DATE_COLOR,
              fontSize: 12,
              fontFamily: Fonts.Gibson_Regular,
              marginTop: -2,
              marginLeft: 3,
            }}>
            {' '}
            {item.lastVisit
              ? Utilities.getUtcToLocalWithFormat(item.lastVisit, 'DD MMM YYYY')
              : t(Translations.NO_VISIT)}{' '}
            {/* {I18nManager.isRTL ? ': ' : ''} */}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
    console.log('Yes');
    performAddNewBooking('', '', '');
  };
  const handleDidSelectBookingNo = () => {
    console.log('No');
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
    console.log('Yes');
    performAddNewQueue('', '', '');
  };
  const handleDidSelectQueueNo = () => {
    console.log('No');
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
    console.log('Yes');
    performAddNewBooking(paymentType, referenceNumber, 'PAID');
  };
  const handleDidSelectPaymentBookingNo = () => {
    console.log('No');
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
    console.log('Yes');
    performAddNewQueue(paymentType, referenceNumber, 'PAID');
  };
  const handleDidSelectPaymentQueueNo = () => {
    console.log('No');
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
        <BookingSuccessPopUp
          refRBSheet={bookingSuccessRef}
          viewDetails={handleViewBookingDetails}
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
    navigation.reset({
      index: 0,
      routes: [{name: 'DashboardScreen'}],
    });
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
            backgroundColor: Colors.WHITE_COLOR,
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
              <Text
                style={{
                  fontFamily: Fonts.Gibson_SemiBold,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: 18,
                }}>
                {t(Translations.SELECT_CUSTOMER)}
              </Text>
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
                width: DisplayUtils.setWidth(75),
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
            <TouchableOpacity
              onPress={() => addNewCustomerButtonAction()}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                //Shadow props
                borderWidth: 0.4,
                borderColor: Colors.GREY_COLOR,
                backgroundColor: Colors.WHITE_COLOR,
                shadowColor: Colors.SHADOW_COLOR,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 8,
                borderRadius: 8,
              }}>
              <Image
                source={Images.PLUS_SQUARE_ICON}
                style={{
                  width: 26,
                  height: 26,
                  resizeMode: 'contain',
                  tintColor: Colors.SECONDARY_COLOR,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={{paddingBottom: 85}}
            data={isLoading ? dummyCustomerList : customerDataList}
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
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default NewBookingCustomerListScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.PRIMARY_WHITE,
    width: DisplayUtils.setWidth(100),
    height: 70,
    borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
  },
});


