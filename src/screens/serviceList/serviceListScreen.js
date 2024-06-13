import React, {useState, useEffect, useRef, Fragment} from 'react';
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
import Utilities from '../../helpers/utils/Utilities';
import {AppointmentType} from '../../helpers/enums/Enums';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import APIConnections from '../../helpers/apiManager/APIConnections';
import NO_VISITORS from '../../assets/images/noVisitsError.svg';
import LottieView from 'lottie-react-native';
import NO_DEPARTMENT_ICON from '../../assets/images/departmentEmptyIcon.svg';
import BookingConfirmationPopUp from '../confirmationPopUps/bookingPopUps/BookingConfirmationPopUp';
import QueueConfirmationPopUp from '../confirmationPopUps/queuePopUps/QueueConfirmationPopUp';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect} from '@react-navigation/core';
import BookingSuccessPopUp from '../successAndFailurePopUps/bookingPopUps/BookingSuccessPopUp';
import QueueSuccessPopUp from '../successAndFailurePopUps/queuePopUps/QueueSuccessPopUp';
import BookingFailurePopUp from '../successAndFailurePopUps/bookingPopUps/BookingFailurePopUp';
import QueueFailurePopUp from '../successAndFailurePopUps/queuePopUps/QueueFailurePopUp';
import BookingPaymentConfirmationPopUp from '../confirmationPopUps/bookingPopUps/BookingPaymentConfirmationPopUp';
import QueuePaymentConfirmationPopUp from '../confirmationPopUps/queuePopUps/QueuePaymentConfirmationPopUp';
import {GetLottieImage} from '../shared/getLottieImage/GetLottieImage';
import moment from 'moment';
import {t} from 'i18next';

const ServiceListScreen = props => {
  const {
    appointmentType,
    selectedGender,
    selectedServingUserId,
    selectedCustomerInfo,
    selectedAppointmentDateFrom,
    selectedQueueSlotInfo,
    isServingUserSelected,
    parentSource,
    selectedServices,
    module,
    services,
  } = props.route.params;
  const isForDirectConsultation =
    props?.route?.params?.isForDirectConsultation === undefined
      ? false
      : props?.route?.params?.isForDirectConsultation;
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isPageEnded, setIsPageEnded] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [serviceList, setServiceList] = useState([]);
  const [selectedServicesId, setSelectedServicesId] =
    useState(selectedServices);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [selectedServiceImageUrl, setSelectedServiceImageUrl] = useState('');
  const [selectedServiceTitle, setSelectedServiceTitle] =
    useState();
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
  useEffect(() => {
    // configureTitleAndImage();
    RescheduleTitle();
  }, [serviceList]);
  useFocusEffect(
    React.useCallback(() => {
      getServiceList();
      // setSelectedServicesId(...selectedServicesId, selectedServices);
      console.log(
        'selectedAppointmentDateFrom .....',
        selectedAppointmentDateFrom,
      );
      console.log('selected Services', selectedServices);
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
  const dummyServiceList = [
    {
      _id: '5f4ad97e7cb43e030f443061',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443062',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443063',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443064',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443065',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443066',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443067',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443068',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443069',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443060',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443010',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
    {
      _id: '5f4ad97e7cb43e030f443011',
      customHours: [],
      isDeleted: false,
      image: 'https://ywait.in:2003/services/haircut.jpeg',
      name: 'Hair Bleaching m',
      category: 'Hair Cut',
      serviceIs: 'public',
      for: 'booking',
      during: 'all_hours',
      description:
        'Hair bleaching is a chemical hair dye technique that strips the color of your hair strands',
      duration: 30,
      price: 100,
      business_id: '5cf610fb384ef274d2f3c79c',
      __v: 0,
      status: 'ACTIVE',
      parallelService: true,
      sortIndex: 25,
      lottieImageName: '',
      genderSelection: 'unisex',
      consultantServiceFare: 100,
    },
  ];
  //Shimmer loader for the flatList
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={90}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="30%" y="10" rx="5" ry="5" width="40" height="40" />
      <Rect x="10" y="60" rx="5" ry="5" width="80%" height="8" />
      <Rect x="25%" y="72" rx="5" ry="5" width="50%" height="8" />
    </ContentLoader>
  );
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
        {/* <LottieView
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
        </Text> */}
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
        {t(Translations.NO_SERVICE_FOUND)}    </Text>
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
            {t(Translations.FIND_YOUR_SERVICE_NOW)}
          </Text>
        </Text>
      </View>
    );
  };

  const searchButtonAction = () => {
    Keyboard.dismiss();
  };
  // const closeButtonAction = () => {
  //     Keyboard.dismiss();
  //     setSearch('');
  // };
  //API Calls
  /**
          *
          * Purpose: Get user details
          * Created/Modified By: Jenson
          * Created/Modified Date: 04 Jan 2022
          * Steps:
              1.fetch business details from API and append to state variable
   */
  const getServiceList = () => {
    setIsLoading(true);
    var gender = '';
    var servingUserId = '';
    if (
      Utilities.getGenderOptions()?.length > 0 &&
      !Utilities.isSingleConsultantBusiness() &&
      Utilities.isGenderSpecificBooking()
    ) {
      console.log('GENDER SELECTION');
      gender = selectedGender;
    } else {
      console.log('GENDER NON SELECTION');
      gender = '';
    }
    if (
      selectedServingUserId !== undefined &&
      Utilities.isBillingEnabled() &&
      Utilities.getServiceBillingType() === 'consultant-service'
    ) {
      servingUserId = selectedServingUserId;
    } else {
      servingUserId = '';
    }
    DataManager.getServiceList(gender, servingUserId).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.objects !== undefined && data.objects !== null) {
            setIsLoading(false);
            setServiceList(data.objects);
            setFilteredDataSource(data.objects);
            console.log('data2======',data.objects,serviceList)
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
        body = {
          [APIConnections.KEYS.TIME]: Globals.SELECTED_DATE_FROM,
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.DURATION]: Utilities.getDuration(),
          [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
          [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
          [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
          [APIConnections.KEYS.SERVICES]: selectedServicesId,
        };
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
    } else if (Utilities.isServiceBasedBusiness()) {
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

    DataManager.performAddNewBooking(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoaderLoading(false);
          setNewBookingSuccessData(responseData.objects);
          bookingSuccessRef.current.open();
        } else {
          setIsLoaderLoading(false);
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
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
      if (Utilities.isServiceBasedBusiness()) {
        body = {
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.GENDER]: selectedGender,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
          [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
          [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
          [APIConnections.KEYS.SERVICES]: selectedServicesId,
          [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
            selectedQueueSlotInfo?.expectedTimeOfServing,
          [APIConnections.KEYS.PREFERRED_TIME_FROM]:
            selectedQueueSlotInfo?.from,
          [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
        };
      } else {
        body = {
          [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
          [APIConnections.KEYS.GENDER]: selectedGender,
          [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
          [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
          [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
          [APIConnections.KEYS.PAYMENT_REFERENCE_ID]: referenceNumber,
          [APIConnections.KEYS.PAYMENT_STATUS]: paymentStatus,
          [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
            selectedQueueSlotInfo?.expectedTimeOfServing,
          [APIConnections.KEYS.PREFERRED_TIME_FROM]:
            selectedQueueSlotInfo?.from,
          [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
        };
      }
    } else if (Utilities.isServiceBasedBusiness()) {
      body = {
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.GENDER]: selectedGender,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.SERVICES]: selectedServicesId,
        [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
          selectedQueueSlotInfo?.expectedTimeOfServing,
        [APIConnections.KEYS.PREFERRED_TIME_FROM]: selectedQueueSlotInfo?.from,
        [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
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
          setIsLoaderLoading(false);
          setNewBookingSuccessData(responseData.objects);
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
    var body = {};
    if (Utilities.isServiceBasedBusiness()) {
      //if billing enabled and payment is done
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
    var body = {};
    if (Utilities.isServiceBasedBusiness()) {
      //if billing enabled and payment is done
      body = {
        [APIConnections.KEYS.SERVING_USER_ID]: selectedServingUserId,
        [APIConnections.KEYS.GENDER]: selectedGender,
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
        [APIConnections.KEYS.CUSTOMER_ID]: Globals.SELECTED_CUSTOMER_INFO._id,
        [APIConnections.KEYS.SERVICES]: selectedServicesId,
        [APIConnections.KEYS.EXPECTED_TIME_OF_SERVING]:
          selectedQueueSlotInfo?.expectedTimeOfServing,
        [APIConnections.KEYS.PREFERRED_TIME_FROM]: selectedQueueSlotInfo?.from,
        [APIConnections.KEYS.PREFERRED_TIME_TO]: selectedQueueSlotInfo?.to,
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
          // Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
          setIsLoaderLoading(false);
          Globals.FAILURE_ERROR_MESSAGE = message;
          queueFailureRef.current.open();
        }
      },
    );
  };


const RescheduleTitle=()=>{
  var serviceName = '';
  var serviceImageUrl = null;
  serviceName = '';
  serviceImageUrl = null;

  console.log('services.....',services,serviceList)
  if (services?.length === 1) {
    if (services?.length > 0 && serviceList?.length > 0 ) {
      serviceList.map((serviceItem, serviceItemIndex) => {
        services.map((selectedServiceId, selectedServiceIdIndex) => {
          if (selectedServiceId._id === serviceItem._id) {
            if (serviceImageUrl === null || serviceImageUrl === undefined) {
              if (
                serviceItem.lottieImageName !== undefined ||
                serviceItem.lottieImageName !== ''
              ) {
                serviceImageUrl = serviceItem.lottieImageName;
              } else {
                serviceImageUrl = serviceItem.image;
              }
            }
            serviceName += serviceItem.name;
          }
        });
      });
    }
    setSelectedServiceImageUrl(serviceImageUrl);
    setSelectedServiceTitle(serviceName);
    console.log('1===',serviceName)
  } else if (services?.length === 2) {
    if (services?.length > 0 && serviceList?.length > 0) {
      serviceList.map((serviceItem, serviceItemIndex) => {
        services.map((selectedServiceId, selectedServiceIdIndex) => {
          if (selectedServiceId._id === serviceItem._id) {
            if (serviceImageUrl === null || serviceImageUrl === undefined) {
              if (
                serviceItem.lottieImageName !== undefined ||
                serviceItem.lottieImageName !== ''
              ) {
                serviceImageUrl = serviceItem.lottieImageName;
              } else {

                serviceImageUrl = serviceItem.image;
              }
            }
            serviceName += serviceItem.name + ' and ';
          }
        });
      });
    }
    setSelectedServiceImageUrl(serviceImageUrl);
    let last5WordsDropped = serviceName.substring(0, serviceName.length - 5);
    setSelectedServiceTitle(last5WordsDropped);
  } else if (services?.length > 2) {
    if (services?.length > 0 && serviceList?.length > 0) {
      serviceList.map((serviceItem, serviceItemIndex) => {
        services.map((selectedServiceId, selectedServiceIdIndex) => {
          if (selectedServiceId._id === serviceItem._id) {
            let firstItemIndex = serviceList.findIndex(
                  item => item._id === serviceItem,
                  console.log('ser',serviceItem)
                  );
            if (serviceImageUrl === null || serviceImageUrl === undefined) {
              if (
                      serviceItem.lottieImageName !== undefined ||
                      serviceItem.lottieImageName !== ''
                    ) {
                      serviceImageUrl = serviceItem.lottieImageName;
                    } else {
                      serviceImageUrl = serviceItem.image;
                    } 
            }
            serviceName =
            services[0].name +
        ' and ' +
        (services.length - 1) +
        ' others';
          }
        });
      });
    }
    // if (services?.length > 0 && serviceList?.length > 0) {
    //   let firstItemIndex = serviceList.findIndex(
    //     item => item._id === services[0],
    //     console.log('///item',firstItemIndex,services[0])

    //   );
    //   // if (serviceImageUrl === null || serviceImageUrl === undefined) {
    //   //   console.log('///',firstItemIndex)

    //   //   if (
    //   //     serviceItem[firstItemIndex].lottieImageName !== undefined ||
    //   //     serviceItem[firstItemIndex].lottieImageName !== ''
    //   //   ) {
    //   //     serviceImageUrl = serviceItem[firstItemIndex].lottieImageName;
    //   //   } else {
    //   //     serviceImageUrl = serviceItem[firstItemIndex].image;
    //   //   }
    //   // }
    //   console.log('serviceImageUrl', serviceImageUrl);
    // //   serviceName =
    // //     serviceList[firstItemIndex].name +
    // //     ' and ' +
    // //     (services.length - 1) +
    // //     ' others';
    // }
    setSelectedServiceImageUrl(serviceImageUrl);
    setSelectedServiceTitle(serviceName);
  }
  else{
  // services.map((item)=>{
  //   var list=[];
  //   item=item.name;
  //   list.push(item  );
  // console.log('item====',item)
  // })
  setSelectedServiceImageUrl('');
  setSelectedServiceTitle(t(Translations.CHOOSE_SERVICE));
  }
}


  /**
   * Purpose:Configure the title text and title image
   * Created/Modified By: Vijin Raj
   * Created/Modified Date: 28 Jan 2022
   * Steps:
   */

  const configureTitleAndImage = serviceIdList => {
    console.log('serviceIdList', serviceIdList);
    var serviceName = '';
    var serviceImageUrl = null;
    serviceName = '';
    serviceImageUrl = null;

    if (serviceIdList?.length === 1) {
      if (serviceIdList?.length > 0 && serviceList?.length > 0) {
        serviceList.map((serviceItem, serviceItemIndex) => {
          serviceIdList.map((selectedServiceId, selectedServiceIdIndex) => {
            if (selectedServiceId === serviceItem._id) {
              if (serviceImageUrl === null || serviceImageUrl === undefined) {
                if (
                  serviceItem.lottieImageName !== undefined ||
                  serviceItem.lottieImageName !== ''
                ) {
                  serviceImageUrl = serviceItem.lottieImageName;
                } else {
                  serviceImageUrl = serviceItem.image;
                }
              }
              serviceName += serviceItem.name;
            }
          });
        });
      }
      setSelectedServiceImageUrl(serviceImageUrl);
      setSelectedServiceTitle(serviceName);
    } else if (serviceIdList?.length === 2) {
      if (serviceIdList?.length > 0 && serviceList?.length > 0) {
        serviceList.map((serviceItem, serviceItemIndex) => {
          serviceIdList.map((selectedServiceId, selectedServiceIdIndex) => {
            if (selectedServiceId === serviceItem._id) {
              if (serviceImageUrl === null || serviceImageUrl === undefined) {
                if (
                  serviceItem.lottieImageName !== undefined ||
                  serviceItem.lottieImageName !== ''
                ) {
                  serviceImageUrl = serviceItem.lottieImageName;
                } else {
                  serviceImageUrl = serviceItem.image;
                }
              }
              serviceName += serviceItem.name + ' and ';
            }
          });
        });
      }
      setSelectedServiceImageUrl(serviceImageUrl);
      let last5WordsDropped = serviceName.substring(0, serviceName.length - 5);
      setSelectedServiceTitle(last5WordsDropped);
    } else if (serviceIdList?.length > 2) {
      if (serviceIdList?.length > 0 && serviceList?.length > 0) {
        let firstItemIndex = serviceList.findIndex(
          item => item._id === serviceIdList[0],
        );
        if (serviceImageUrl === null || serviceImageUrl === undefined) {
          console.log('///',firstItemIndex)
          if (
            serviceList[firstItemIndex].lottieImageName !== undefined ||
            serviceList[firstItemIndex].lottieImageName !== ''
          ) {
            serviceImageUrl = serviceList[firstItemIndex].lottieImageName;
          } else {
            serviceImageUrl = serviceList[firstItemIndex].image;
          }
        }
        console.log('serviceImageUrl', serviceImageUrl);
        serviceName =
          serviceList[firstItemIndex].name +
          ' and ' +
          (serviceIdList.length - 1) +
          ' others';
      }
      setSelectedServiceImageUrl(serviceImageUrl);
      setSelectedServiceTitle(serviceName);
    } else {
     RescheduleTitle();
    }
  };
  /**
        * Purpose:On click flatlist cell
        * Created/Modified By: Vijin Raj
        * Created/Modified Date: 28 Jan 2022
        * Steps:
            1.removes the selected service
            2.add the selected service
    */
  const onClickCell = item => {
    var equalServicesFound = false;
    equalServicesFound = selectedServicesId.some(id => id === item._id);
    if (equalServicesFound) {
      //1
      const filteredItems = selectedServicesId.filter(id => id !== item._id);
      setSelectedServicesId(filteredItems);
      configureTitleAndImage(filteredItems);
    } else {
      //2
      let newServiceList = [];
      selectedServicesId.map((selectedServiceId, selectedServiceIdIndex) => {
        newServiceList.push(selectedServiceId);
      });
      newServiceList.push(item._id);
      setSelectedServicesId(newServiceList);
      configureTitleAndImage(newServiceList);
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
    return <ServiceListData item={item} index={index} />;
  };
  const ServiceListData = ({item}) => {
    var equalServicesFound = false;
    let durationInSeconds = item.duration * 60;
    equalServicesFound =
      selectedServicesId.some(id => id === item._id) ||
      selectedServices.some(_item => _item?._id === item._id);
    return (
      <TouchableOpacity
        style={{
          marginLeft: 10,
          marginBottom: 25,
          backgroundColor: Colors.WHITE_COLOR,
          width: '30%',
          borderRadius: 6,
          borderWidth: equalServicesFound ? 1 : 0.1,
          borderColor: equalServicesFound
            ? Colors.SECONDARY_COLOR
            : Colors.GREY_COLOR,
          shadowColor: Colors.SHADOW_COLOR,
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.8,
          shadowRadius: 5,
          elevation: 8,
          alignItems: 'center',
        }}
        onPress={() => onClickCell(item)}>
        {isLoading ? (
          <ListLoader />
        ) : (
          <Fragment>
            {item.lottieImageName !== '' &&
            item.lottieImageName !== undefined ? (
              <View style={{marginTop: 15, height: 35, width: 35}}>
                <GetLottieImage
                  style={{
                    height: 35,
                    width: 35,
                  }}
                  url={item.lottieImageName}
                />
              </View>
            ) : item.image !== '' && item.image !== undefined ? (
              <FastImage
                style={{
                  marginTop: 15,
                  height: 35,
                  width: 35,
                }}
                source={{
                  uri: item.image,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <View style={{marginTop: 15}}>
                <NO_DEPARTMENT_ICON
                  width={35}
                  height={35}
                  fill={Colors.WHITE_COLOR}
                  fillNoDepartmentSecondary={Colors.SECONDARY_COLOR}
                  fillNoDepartmentPrimary={Colors.PRIMARY_COLOR}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                marginRight: 10,
                marginLeft: 10,
                marginTop: 20,
              }}>
              {Utilities.isGenderSpecificBooking() ? (
                item?.genderSelection === 'male' ? (
                  <LottieView
                    style={{width: 10, height: 10, marginRight: 3}}
                    source={Images.MALE_ANIMATION_ICON}
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
                ) : item?.genderSelection === 'female' ? (
                  <LottieView
                    style={{width: 10, height: 10, marginRight: 3}}
                    source={Images.FEMALE_ANIMATION_ICON}
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
                ) : item?.genderSelection === 'unisex' ? (
                  <LottieView
                    style={{width: 10, height: 10, marginRight: 3}}
                    source={Images.UNISEX_ANIMATION_ICON}
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
                ) : (
                  <LottieView
                    style={{width: 10, height: 10, marginRight: 3}}
                    source={Images.OTHER_ANIMATION_ICON}
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
                )
              ) : null}
              <Text
                style={{
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: 12,
                  color: Colors.PRIMARY_TEXT_COLOR,
                }}
                numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginRight: 2,
                marginLeft: 2,
                marginTop: 6,
              }}>
              <Image
                source={Images.CLOCK_CIRCULAR_ICON}
                style={{
                  height: 10,
                  width: 10,
                  marginRight: 4,
                  marginTop: 0,
                  tintColor: Colors.TEXT_GREY_COLOR_9B,
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 10,
                  color: Colors.TEXT_GREY_COLOR_9B,
                  marginBottom: 10,
                }}
                numberOfLines={1}>
                {/* {Utilities.convertHMS(durationInSeconds)} */}
                {item?.duration} min
              </Text>
            </View>

            {Utilities.isBillingEnabled() ? (
              Utilities.getServiceBillingType() === 'service' ? (
                <Text
                  Text
                  style={{
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: 10,
                    color: Colors.TEXT_GREY_COLOR_9B,
                    marginBottom: 10,
                  }}
                  numberOfLines={1}>
                  {item.price !== undefined
                    ? Utilities.getCurrencyFormattedPrice(item.price)
                    : ''}
                </Text>
              ) : (
                <Text
                  Text
                  style={{
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: 10,
                    color: Colors.TEXT_GREY_COLOR_9B,
                    marginBottom: 10,
                  }}
                  numberOfLines={1}>
                  {item.consultantServiceFare !== undefined
                    ? Utilities.getCurrencyFormattedPrice(
                        item.consultantServiceFare,
                      )
                    : ''}
                </Text>
              )
            ) : null}

            {equalServicesFound ? (
              <Image
                source={Images.SERVICE_SELECT_ICON}
                style={{
                  height: 14,
                  width: 20,
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  tintColor: Colors.SECONDARY_COLOR,
                }}
              />
            ) : null}
          </Fragment>
        )}
      </TouchableOpacity>
    );
  };
  const confirmButtonAction = () => {
    console.log('confirm pressed', parentSource);

    if (parentSource === 'reschedule') {
      console.log('navigation start');
      navigation.navigate('BookingQueueScreen', {
        appointmentType:appointmentType,
        selectedServingUserId: selectedServingUserId,
        selectedGender: selectedGender,
        selectedCustomerInfo: selectedCustomerInfo,
        isServingUserSelected: isServingUserSelected,
        selectedServicesId: selectedServicesId,
        selectedAppointmentDateFrom: selectedAppointmentDateFrom,
        module: 'reschedule',
      });
    } else {
      //Check for DirectConsultation

      if (isForDirectConsultation === true) {
        props?.route?.params?.didSelectedConfirm(
          selectedServicesId,
          selectedCustomerInfo,
        );
        navigation.goBack();
      } else {
        if (parentSource === 'calender') {
          if (
            Utilities.isBillingEnabled() === true &&
            Utilities.isPaymentBeforeConsultation() === true
          ) {
            Globals.SELECTED_CUSTOMER_INFO = selectedCustomerInfo;
            Globals.SELECTED_DATE_FROM = selectedAppointmentDateFrom;
            if (appointmentType === AppointmentType.booking) {
              fetchBookingPaymentInfo();
            } else {
              fetchQueuePaymentInfo();
            }
          } else {
            Globals.SELECTED_CUSTOMER_INFO = selectedCustomerInfo;
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
            selectedCustomerInfo: selectedCustomerInfo,
            isServingUserSelected: isServingUserSelected,
            selectedServicesId: selectedServicesId,
            selectedAppointmentDateFrom:
              Utilities.convertorTimeToBusinessTimeZone(moment().format()),
          });
        }
      }
    }
  };
  const searchFilterFunction = text => {
    // Check if searched text is not blank
    console.log('search Filter', text);
    if (serviceList !== undefined && serviceList !== null) {
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = serviceList.filter(function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
        // setCrossButtonVisible(false);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(serviceList);
        setSearch(text);
        // setCrossButtonVisible(false);
      }
    }
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
        * Purpose:QUEUE CONFIRMATION
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
          onClosePopup={bookingSuccessOnClose}
        />
      </RBSheet>
    );
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

  const handleViewBookingDetails = () => {
    navigation.navigate('AppointmentDetailsScreen', {
      selectedAppointment_id: newBookingSuccessData._id,
      selectedAppointmentType: newBookingSuccessData.name,
      isFrom: 'NEW_BOOKING_SCREEN',
    });
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
              {selectedServiceImageUrl === '' ||
              selectedServiceImageUrl === undefined ? (
                <NO_DEPARTMENT_ICON
                  width={24}
                  height={24}
                  fill={Colors.WHITE_COLOR}
                  fillNoDepartmentSecondary={Colors.SECONDARY_COLOR}
                  fillNoDepartmentPrimary={Colors.PRIMARY_COLOR}
                />
              ) : Utilities.getFileExtension(selectedServiceImageUrl) ===
                'json' ? (
                <View style={{height: 17, width: 24}}>
                  <GetLottieImage
                    style={{
                      height: 17,
                      width: 24,
                    }}
                    url={selectedServiceImageUrl}
                  />
                </View>
              ) : (
                <FastImage
                  style={{
                    height: 17,
                    width: 24,
                  }}
                  source={{
                    uri: selectedServiceImageUrl,
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
                  marginLeft: 3,
                  // marginTop: 3,
                  lineHeight:21,
                  marginHorizontal:100,
                  // width: DisplayUtils.setWidth(70),
                }}
                numberOfLines={2}>
                {selectedServiceTitle}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 24,
              marginLeft: 28,
              marginRight: 28,
              height: 42,
              justifyContent: 'center',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.SEARCH_INPUT_BORDER_GRAY_COLOR,
              backgroundColor: Colors.WHITE_COLOR,
            }}>
            <TouchableOpacity
              onPress={() => (search !== '' ? searchButtonAction() : null)}
              style={{
                position: 'absolute',
                left: 8,
                justifyContent: 'center',
                height: 31,
                width: 31,
              }}>
              <Image
                style={{
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={Images.GRAY_SEARCH_ICON}
              />
            </TouchableOpacity>
            <TextInput
              style={{
                marginLeft: 53,
                paddingRight: 45,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 16,
                color: Colors.SECONDARY_TEXT_COLOR,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              placeholder={t(Translations.SEARCH)}
              autoCorrect={false}
              returnKeyType="search"
              editable={true}
              value={search}
              onSubmitEditing={() => {
                searchButtonAction();
              }}
              onChangeText={text => searchFilterFunction(text.trimStart())}
              onClear={text => searchFilterFunction('')}
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
                  right: 10,
                }}
                onPress={() => searchFilterFunction('')}>
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
          </View>
          <FlatList
            style={{marginLeft: 20, marginRight: 20, marginTop: 20}}
            contentContainerStyle={{paddingBottom: 85}}
            data={isLoading ? dummyServiceList : filteredDataSource}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            horizontal={false}
            numColumns={3}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            ListEmptyComponent={
              isLoading ? dummyServiceList : CustomerEmptyComponent
            }
          />
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.APP_MAIN_BACKGROUND_COLOR,
          height: 60,
        }}>
        <TouchableOpacity
          style={{
            width: 130,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              selectedServicesId.length > 0 &&  filteredDataSource.length > 0 
                ? Colors.SECONDARY_COLOR
                : Colors.DISABLE_BUTTON_COLOR,
            borderRadius: 8,
            marginBottom: 50,
          }}
          activeOpacity={1}
          onPress={() =>
            selectedServicesId.length > 0 &&  filteredDataSource.length > 0 ? confirmButtonAction() : null
          }>
          <Text
            Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 16,
              color: Colors.WHITE_COLOR,
            }}
            numberOfLines={1}>
            {t(Translations.CONFIRM)}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ServiceListScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.APP_MAIN_BACKGROUND_COLOR,
    width: DisplayUtils.setWidth(100),
    height: 70,
    borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
  },
});
