import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  LogBox,
  Keyboard,
  FlatList,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  ScrollView,
  BackHandler,
  I18nManager,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../constants';
import {t} from 'i18next';
import Pdf from 'react-native-pdf';
import FastImage from 'react-native-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GetImage} from '../shared/getImage/GetImage';
import {useDispatch, useSelector} from 'react-redux';
import Utilities from '../../helpers/utils/Utilities';
import VitalsDetailsPopup from './VitalsDetailsPopup';
import ImageFileComponent from './ImageFileComponent';
import {AddVitalType} from '../../helpers/enums/Enums';
import ImageView from 'react-native-image-viewing-rtl';
import {BookingQueueAction} from '../../redux/actions';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import DataManager from '../../helpers/apiManager/DataManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import NO_VISIT_ERROR_SVG from '../../assets/images/noVisitsError.svg';
import AddNotesPopupScreen from '../addNotesPopup/AddNotesPopupScreen';
import {GetLottieImage} from '../shared/getLottieImage/GetLottieImage';
import StorageManager from '../../helpers/storageManager/StorageManager';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import NotesOptionPopup from '../shared/notesOptionPopup/NotesOptionPopup';
import NO_DEPARTMENT_ICON from '../../assets/images/departmentEmptyIcon.svg';
import RefundConfirmationPopup from '../shared/refundConfirmation/RefundConfirmationPopup';
import AppointmentCancelPopup from '../shared/appointmentCancelPopup/AppointmentCancelPopup';
import AppointmentReschedulePopup from '../shared/appointmentReschedulePopUp/AppointmentReschedulePopUp';
import AppointmentCancelSuccessPopup from '../shared/appointmentCancelSuccessPopup/AppointmentCancelSuccessPopup';
import { responsiveWidth } from 'react-native-responsive-dimensions';
const AppointmentDetailsScreen = props => {
  const {selectedAppointment_id, selectedAppointmentType, isFrom} =
    props.route.params;
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refRBSheetAddNotes = useRef();
  const [pageNo, setPageNo] = useState(1);
  const refundConfirmPopupRBsheet = useRef();
  const refNotesOptionsRBsheetPopup = useRef();
  const refVitalDetailsPopupRBsheet = useRef();
  const [refresh, setRefresh] = useState(false);
  const [isFromEdit, setIsFromEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refAppointmentCancelRBsheetPopup = useRef();
  const [isPageEnded, setIsPageEnded] = useState(false);
  const refAppointmentRescheduleRBsheetPopup = useRef();
  const appointmentCancelSuccessPopupRBsheet = useRef();
  const [isPaginating, setIsPaginating] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [customerNotesList, setCustomerNotesList] = useState();
  const [fullScreenImages, setFullScreenImages] = useState([]);
  const [refundStatusText, setRefundStatusText] = useState('');
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [servicessListIdArray, setServicessListIdArray] = useState([]);
  const [visibleRefundStatus, setVisibleRefundStatus] = useState(false);
  const [imageFullScreenVisible, setImageFullScreenVisible] = useState([]);
  const [noteHeader, setNoteHeader] = useState('ADD_NOTE');
  const [previousVisitCount, setPreviousVisitCount] = useState(0);


  useEffect(() => {
    function handleBackButton() {
      backButtonAction();
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => {
      //Clean up
      backHandler.remove();
    };
  });
  const backButtonAction = () => {
    isFrom === 'UPCOMING_LIST_SCREEN'
      ? navigation.goBack()
      : navigation.reset({
          index: 0,
          routes: [{name: 'DashboardScreen'}],
        });
}
  //redux state for tabletview
const isTablet = useSelector((state)=>state.tablet.isTablet);
  const dummyCustomerNoteList = [
    {
      id: '1',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes:
        ' aaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbb cccccccccccccccccc ddddddddddddddd eeeeeeeeeeeeeeeee ffffffffffffff ',
    },
    {
      id: '2',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes:
        ' aaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbb cccccccccccccccccc ddddddddddddddd eeeeeeeeeeeeeeeee ffffffffffffff ',
    },
    {
      id: '3',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes: '',
    },
    {
      id: '4',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes: '',
    },
  ];
  const dummyCustomerDetails = {
    firstName: 'Christy',
    lastName: 'Lawer',
    bookingId: '1563',
    countryCode: '+91',
    phoneNumber: '9653523565',
    location: 'Kollam',
    consultationDate: '2022-01-28T10:06:18.418Z',
  };
  const dummyServicesList = [
    {
      id: '1',
      image: '',
      description: 'aaa bbb ccc dd eee ffff G',
      genderSelection: 'male',
    },
    {
      id: '2',
      image: '',
      description: 'aaa bbb ccc dd eee ffff G',
      genderSelection: 'male',
    },
    {
      id: '3',
      image: '',
      description: 'aaa bbb ccc dd eee ffff G',
      genderSelection: 'male',
    },
    {
      id: '3',
      image: '',
      description: 'aaa bbb ccc dd eee ffff G',
      genderSelection: 'male',
    },
    {
      id: '4',
      image: '',
      description: 'aaa bbb ccc dd eee ffff G',
      genderSelection: 'male',
    },
  ];

  var statusText = t(Translations.AT);
  if (appointmentDetails.status === 'PENDING') {
    statusText = t(Translations.IS_SCHEDULED_AT);
  } else if (appointmentDetails.status === 'ARRIVED') {
    statusText = t(Translations.PRESENTS_IS_MARKED_AT);
  } else if (appointmentDetails.status === 'SERVING') {
    statusText = t(Translations.STARTED_SERVING_AT);
  } else if (appointmentDetails.status === 'SERVED') {
    statusText = t(Translations.AT);
  } else if (appointmentDetails.status === 'CANCELLED') {
    statusText = t(Translations.AT);
  } else if (appointmentDetails.status === 'NOSHOW') {
    statusText = t(Translations.AT);
  } else {
    statusText = t(Translations.AT);
  }

  var CompletedStatusText = '';
  if (appointmentDetails.status === 'PENDING') {
    CompletedStatusText =
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
      ) +
      ' ' +
      Utilities.checkDate(appointmentDetails.dateFrom) +
      ' ' +
      '(' +
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        'DD-MMM-YYYY, dddd',
      ) +
      ')';
  } else if (appointmentDetails.status === 'SERVED') {
    CompletedStatusText =
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.servingDate,
        Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
      ) +
      ' ' +
      Utilities.checkDate(appointmentDetails.servingDate) +
      ' ' +
      '(' +
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.servingDate,
        'DD-MMM-YYYY, dddd',
      ) +
      ')' +
      ' ' +
      t(Translations.IS_COMPLETED);
  } else if (appointmentDetails.status === 'SERVING') {
    CompletedStatusText =
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.servingDate,
        Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
      ) +
      ' ' +
      Utilities.checkDate(appointmentDetails.servingDate) +
      ' ' +
      '(' +
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.servingDate,
        'DD-MMM-YYYY, dddd',
      ) +
      ')';
  } else if (appointmentDetails.status === 'ARRIVED') {
    CompletedStatusText =
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.arrivingDate,
        Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
      ) +
      ' ' +
      Utilities.checkDate(appointmentDetails.arrivingDate) +
      ' ' +
      '(' +
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.arrivingDate,
        'DD-MMM-YYYY, dddd',
      ) +
      ')';
  } else if (appointmentDetails.status === 'CANCELLED') {
    CompletedStatusText =
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
      ) +
      ' ' +
      Utilities.checkDate(appointmentDetails.dateFrom) +
      ' ' +
      '(' +
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        'DD-MMM-YYYY, dddd',
      ) +
      ')' +
      ' ' +
      t(Translations.STAYS_CANCELLED);
  } else if (appointmentDetails.status === 'NOSHOW') {
    CompletedStatusText =
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
      ) +
      ' ' +
      Utilities.checkDate(appointmentDetails.dateFrom) +
      ' ' +
      '(' +
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        'DD-MMM-YYYY, dddd',
      ) +
      ')' +
      ' ' +
      t(Translations.STAYS_CANCELLED);
  } else {
    CompletedStatusText =
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
      ) +
      ' ' +
      Utilities.checkDate(appointmentDetails.dateFrom) +
      ' ' +
      '(' +
      Utilities.getUtcToLocalWithFormat(
        appointmentDetails.dateFrom,
        'DD-MMM-YYYY, dddd',
      ) +
      ')';
  }
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  useEffect(() => {
    console.log(
      'selected Appointment=======',
      selectedAppointment_id,
      selectedAppointmentType,
    );
    console.log('Business details ====', Globals.BUSINESS_DETAILS);
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);

    performGetAppointmentDetails();
  }, []);

  const onRefresh = () => {
    //set isRefreshing to true
    setRefresh(true);
    performGetCustomerNotesList(false, 1, customerDetails._id);
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  const backBUttonPressAction = () => {
    isFrom === 'UPCOMING_LIST_SCREEN'
      ? navigation.goBack()
      : navigation.reset({
          index: 0,
          routes: [{name: 'DashboardScreen'}],
        });
  };

  const vitalsBottomBarButtonAction = () => {
    Globals.SHARED_VALUES.SELECTED_APPOINTMENT_INFO = appointmentDetails;
    navigation.navigate('AddVitalsScreen', {onAddVitals: didAddVitals});
  };
  const refundBottomBarButtonAction = () => {
    setIsLoaderLoading(true);
    console.log('refund button action');

    var body = {};
    if (selectedAppointmentType === 'Booking') {
      body = {
        [APIConnections.KEYS.REFUND_STATUS]: 'PAID',
        [APIConnections.KEYS.BOOKING_ID]: selectedAppointment_id,
      };
    } else {
      body = {
        [APIConnections.KEYS.REFUND_STATUS]: 'PAID',
        [APIConnections.KEYS.WAITLIST_ID]: selectedAppointment_id,
      };
    }
    DataManager.performRefundRequest(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          console.log(' appointment cancelation status success');
          setIsLoaderLoading(false);
          performGetAppointmentDetails();
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoaderLoading(false);
        }
      },
    );
  };

  const didAddVitals = () => {
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);

    performGetAppointmentDetails();
  };

  //API CALLS
  /**
            *
            * Purpose:get appointment details
            * Created/Modified By: Sudhin
            * Created/Modified Date: 8 feb 2022
            * Steps:
                1.fetch UpcomingBookingLists list from API and append to state variable
    */

  const performGetAppointmentDetails = () => {
    setIsLoading(true);
    let selectedEndPoint =
      selectedAppointmentType === 'Booking'
        ? APIConnections.ENDPOINTS.BOOKING_DETAILS
        : APIConnections.ENDPOINTS.QUEUE_DETAILS;
    let url =
      APIConnections.BASE_URL + selectedEndPoint + '/' + selectedAppointment_id;
    DataManager.getAppointmentDetails(url).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            console.log('appointment details', data.objects);
            Globals.SHARED_VALUES.VITALS_PREVIOUS_DATA = data.objects.vitals;
            setAppointmentDetails(data.objects);
            configureRefundStatus(data.objects);
            setCustomerDetails(data.objects.customer_id);
            Utilities.checkDate(data.objects.dateFrom);
            configureServicessListIdArray(data?.objects?.services);
            performGetCustomerNotesList(true, 1, data.objects.customer_id._id);
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

  const configureServicessListIdArray = serviceList => {
    var serviceListId = [];
    if (serviceList !== undefined) {
      if (serviceList.length > 0) {
        serviceList.map((_item, index) => {
          // console.log('_item._id', _item._id);
          serviceListId.push(_item._id);
        });
      }
    }
    console.log('servicess id array', serviceListId);
    setServicessListIdArray(serviceListId);
  };
  //API CALLS
  /**
            *
            * Purpose:cancel appointment
            * Created/Modified By: Sudhin
            * Created/Modified Date: 8 feb 2022
            * Steps:
                1.fetch UpcomingBookingLists list from API and append to state variable
    */

  const performCancelAppointmentDetails = () => {
    setIsLoaderLoading(true);
    let selectedEndPoint =
      selectedAppointmentType === 'Booking'
        ? APIConnections.ENDPOINTS.CANCEL_BOOKING
        : APIConnections.ENDPOINTS.CANCEL_QUEUE;
    let url = APIConnections.BASE_URL + selectedEndPoint;
    var body = {};
    if (selectedAppointmentType === 'Booking') {
      body = {
        [APIConnections.KEYS.STATUS]: 'CANCELLED',
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_DETAILS._id,
        [APIConnections.KEYS.BOOKING_ID]: selectedAppointment_id,
      };
    } else {
      body = {
        [APIConnections.KEYS.STATUS]: 'CANCELLED',
        [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_DETAILS._id,
        [APIConnections.KEYS.WAITLIST_ID]: selectedAppointment_id,
      };
    }

    DataManager.cancelAppointment(url, body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          console.log(' appointment cancelation status success');
          setIsLoaderLoading(false);
          appointmentCancelSuccessPopupRBsheet.current.open();
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoaderLoading(false);
        }
      },
    );
  };

  const notesOptionSelectionAction = selectedNote => {
    Globals.SHARED_VALUES.SELECTED_NOTES_INFO = selectedNote;
    refNotesOptionsRBsheetPopup.current.open();
  };
  const handleNoteOptionSelection = selectedOption => {
    // console.log('Selected option', selectedOption);
    if (selectedOption === 'ADD_NOTES') {
      setNoteHeader('ADD_NOTE');
      setIsFromEdit(true);
      console.log('Add note action');
      refRBSheetAddNotes.current.open();
    } else if (selectedOption === 'EDIT_NOTES') {
      setNoteHeader('EDIT_NOTE');
      setIsFromEdit(true);
      console.log('Edit action');
      refRBSheetAddNotes.current.open();
    } else if (selectedOption === 'DELETE_NOTES') {
      console.log('Delete note action');
      performNotesDelete();
    }
  };

  const configureRefundStatus = appointment => {
    console.log('appointment ----', appointment);
    if (appointment.status === 'CANCELLED') {
      if (appointment.paymentType === 'online') {
        if (appointment.refundStatus === 'PENDING') {
          setVisibleRefundStatus(true);
          setRefundStatusText(
            t(Translations.REFUND_FOR) +
              Utilities.getCurrencyFormattedPrice(appointment.refundAmount) +
              t(
                Translations.HAS_BEEN_INITIATED_SUCCESSFULLY_REFUND_WILL_BE_PROCESSED_IN,
              ),
          );
        } else if (appointment.refundStatus === 'PAID') {
          setVisibleRefundStatus(true);
          setRefundStatusText(
            t(Translations.REFUND_FOR) +
              Utilities.getCurrencyFormattedPrice(appointment.refundAmount) +
              t(Translations.HAS_BEEN_SUCCESSFULLY_COMPLETED),
          );
        } else {
          setVisibleRefundStatus(false);
        }
      } else if (appointment.refundStatus === 'PENDING') {
        setVisibleRefundStatus(true);
        setRefundStatusText(
          Utilities.getCurrencyFormattedPrice(appointment.refundAmount) +
            t(Translations.REFUND_AVAILABLE),
        );
      } else if (appointment.refundStatus === 'PAID') {
        setVisibleRefundStatus(true);
        setRefundStatusText(
          t(Translations.REFUND_FOR) +
            Utilities.getCurrencyFormattedPrice(appointment.refundAmount) +
            t(Translations.HAS_BEEN_SUCCESSFULLY_COMPLETED),
        );
      } else {
        setVisibleRefundStatus(false);
      }
    }
  };

  //API CALLS
  /**
            *
            * Purpose: Get customer notes list
            * Created/Modified By: Sudhin Sudhakaran
            * Created/Modified Date: 7 Feb 2022
            * Steps:
                1.fetch notes list from API and append to state variable
    */
  const performGetCustomerNotesList = (
    isLoaderRequired,
    pageNumber,
    customerId,
  ) => {
    if (isLoaderRequired) {
      // setIsLoading(true);
    }
    DataManager.getCustomerNotesList(pageNumber, customerId).then(
      ([isSuccess, message, data, count]) => {
        if (isSuccess === true) {
          setPreviousVisitCount(count);
          console.log('data in fuc call', data);
          if (data !== undefined && data !== null) {
            if (pageNumber !== 1) {
              if (data.length === 0) {
                console.log('END FOUND');
                setIsPageEnded(true);
              } else {
                //Appending data
                //setSearchList(...searchList, ...data.data.objects)

                setCustomerNotesList(customerNotesList => {
                  return [...customerNotesList, ...data];
                });
              }
            } else {
              // console.log("data", data)
              setCustomerNotesList(data);
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
  const performNotesDelete = () => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.NOTE_ID]:
        Globals.SHARED_VALUES.SELECTED_NOTES_INFO?._id,
    };
    DataManager.performNotesDelete(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoading(true);
          setPageNo(1);
          setIsPageEnded(false);
          performGetAppointmentDetails();
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

  const filePreviewButtonAction = url => {
    Keyboard.dismiss();
    navigation.navigate('FilePreviewScreen', {
      titleText: Utilities.getFileName(url),
      url: url,
      isLocalFile: false,
    });
  };
  const imageFullscreenButtonAction = url => {
    Keyboard.dismiss();

    setFullScreenImages([
      {
        uri: url,
      },
    ]);
    setImageFullScreenVisible(true);
  };
  //Shimmer loader for the flatList
  const ProfileLoader = props => (
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
      <Rect x="90" y="30" rx="5" ry="5" width="120" height="8" />
      <Rect x="90" y="50" rx="5" ry="5" width="180" height="8" />
      <Rect x="90" y="70" rx="5" ry="5" width="230" height="8" />
      <Rect x="90" y="90" rx="5" ry="5" width="120" height="8" />
      <Rect x="90" y="110" rx="5" ry="5" width="60" height="8" />
      <Rect x="30" y="40" rx="25" ry="25" width="50" height="50" />
    </ContentLoader>
  );
  //Shimmer loader for the previous visit
  const NoteLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={100}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="95%" y="25" rx="3" ry="3" width="5" height="5" />
      <Rect x="95%" y="35" rx="3" ry="3" width="5" height="5" />
      <Rect x="95%" y="45" rx="3" ry="3" width="5" height="5" />
      <Rect x="20" y="20" rx="0" ry="0" width="100" height="15" />
      <Rect x="130" y="20" rx="0" ry="0" width="100" height="15" />
      <Rect x="20" y="50" rx="5" ry="5" width="180" height="8" />
      <Rect x="20" y="70" rx="5" ry="5" width="230" height="8" />
      <Rect x="20" y="90" rx="5" ry="5" width="260" height="8" />
    </ContentLoader>
  );

  //Shimmer loader for the previous visit
  const PreviousVisitsLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={50}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="20" y="20" rx="0" ry="0" width="150" height="10" />
    </ContentLoader>
  );
  //Shimmer loader for the status button
  const StatusButtonLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={50}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="20" y="0" rx="15" ry="15" width="100" height="30" />
      <Rect x="130" y="0" rx="15" ry="15" width="100" height="30" />
      <Rect x="80%" y="0" rx="25" ry="25" width="50" height="50" />
    </ContentLoader>
  );
  //Shimmer loader for the previous visit
  const ServicesListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={100}
      height={60}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="35" y="10" rx="0" ry="0" width="40" height="30" />
      <Rect x="10" y="50" rx="2" ry="2" width="90" height="10" />
    </ContentLoader>
  );

  /**
         * Purpose:show notes option popup
         * Created/Modified Date: 20 jan 2022
         * Steps:
             1.Open the rbSheet
     */
  const NotesOptionsPopupComponent = () => {
    return (
      <RBSheet
        ref={refNotesOptionsRBsheetPopup}
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
        height={DisplayUtils.setHeight(30)}
        onClose={() => {}}>
        <NotesOptionPopup
          refRBSheet={refNotesOptionsRBsheetPopup}
          handleOptionSelection={handleNoteOptionSelection}
        />
      </RBSheet>
    );
  };

  /**
         * Purpose:show notes option popup
         * Created/Modified Date: 20 jan 2022
         * Steps:
             1.Open the rbSheet
     */
  const AppointmentCancelSuccessPopupComponent = () => {
    return (
      <RBSheet
        ref={appointmentCancelSuccessPopupRBsheet}
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
        height={350}
        onClose={() => navigationToDashBoard()}>
        <AppointmentCancelSuccessPopup
          refRBSheet={appointmentCancelSuccessPopupRBsheet}
          customerDetails={customerDetails}
          appointmentDetails={appointmentDetails}
          // handleOptionSelection={handleNoteOptionSelection}
        />
      </RBSheet>
    );
  };
  const navigationToDashBoard = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'DashboardScreen'}],
    });
  };

  /**
         * Purpose:show refund confirmation
         * Created/Modified Date: 20 jan 2022
         * Steps:
             1.Open the rbSheet
     */
  const RefundConfirmPopupComponent = () => {
    return (
      <RBSheet
        ref={refundConfirmPopupRBsheet}
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
        height={300}>
        <RefundConfirmationPopup
          refRBSheet={refundConfirmPopupRBsheet}
          didSelectNo={refundConfirmPopupSelectedNo}
          didSelectYes={refundConfirmPopupSelectedYes}
        />
      </RBSheet>
    );
  };
  const refundConfirmPopupSelectedYes = () => {
    refundConfirmPopupRBsheet.current.close();
    refundBottomBarButtonAction();
  };
  const refundConfirmPopupSelectedNo = () => {
    refundConfirmPopupRBsheet.current.close();
  };
  /**
         * Purpose:show notes option popup
         * Created/Modified Date: 20 jan 2022
         * Steps:
             1.Open the rbSheet
     */
  const AppointmentCancelPopupComponent = () => {
    return (
      <RBSheet
        ref={refAppointmentCancelRBsheetPopup}
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
        height={300}
        onClose={() => {}}>
        <AppointmentCancelPopup
          refRBSheet={refAppointmentCancelRBsheetPopup}
          selectedAppointment={appointmentDetails}
          appointmentCancelAction={appointmentCancelAction}
        />
      </RBSheet>
    );
  };
  const appointmentCancelAction = () => {
    performCancelAppointmentDetails();
    console.log('appointmetnt cancel action');
  };

  /**
         * Purpose:show notes option popup
         * Created/Modified Date: 20 jan 2022
         * Steps:
             1.Open the rbSheet
     */
  const AppointmentReschedulePopupComponent = () => {
    return (
      <RBSheet
        ref={refAppointmentRescheduleRBsheetPopup}
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
        height={300}
        onClose={() => {}}>
        <AppointmentReschedulePopup
          refRBSheet={refAppointmentRescheduleRBsheetPopup}
          selectedAppointment={appointmentDetails}
          appointmentCancelAction={appointmentRescheduleAction}
        />
      </RBSheet>
    );
  };
  const appointmentRescheduleAction = () => {
    rescheduleButtonAction();
  };

  /**
         * Purpose:show notes option popup
         * Created/Modified Date: 20 jan 2022
         * Steps:
             1.Open the rbSheet
     */
  const VitalDetailsPopup = () => {
    return (
      <RBSheet
        ref={refVitalDetailsPopupRBsheet}
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
        height={400}
        onClose={() => {}}>
        <VitalsDetailsPopup
          refRBSheet={refVitalDetailsPopupRBsheet}
          vitals={appointmentDetails.vitals}
        />
      </RBSheet>
    );
  };
  /**
   * Purpose: list on end reached component
   * Created/Modified By: Sudhin Sudhakaran
   * Created/Modified Date: 7 Feb 2022
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
      performGetCustomerNotesList(false, newPageNo, customerDetails._id);
    }
  };

  /**
                      * Purpose: List empty component
                      * Created/Modified By: Sudhin Sudhakaran
                      * Created/Modified Date:7 Feb 2022
                      * Steps:
                          1.Return the component when list is empty
                  */
  const NotesEmptyComponent = () => {
    return (
      <View
        style={{
          //   width: Display.setWidth(60),
          //   height: Display.setHeight(30),

          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10%',
        }}>
        <NO_VISIT_ERROR_SVG
          fill={Colors.WHITE_COLOR}
          fillSecondary={Colors.SECONDARY_COLOR}
        />

        <Text
          style={{
            alignSelf: 'center',
            color: Colors.NOTES_EMPTY_COLOR,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize:isTablet===true?18: 12,
            marginTop: 10,
          }}>
          {t(Translations.NO_VISITS_FOUND)}
        </Text>
      </View>
    );
  };
  /**
   * Purpose: pagination loader component
   * Created/Modified By: Sudhin Sudhakaran
   * Created/Modified Date: 7 Feb 2022
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
  const AddVisit = () => {
    setIsFromEdit(false);
    refRBSheetAddNotes.current.open();
  };

  const renderNotesImageItem = ({item, index}) => {
    return <FileAttachmentList item={item} itemIndex={index} />;
  };

  const FileAttachmentList = ({item, itemIndex}) => {
    if (item !== undefined && (item?.length || 0) > 0) {
      let fileType = Utilities.getFileExtension(item);
      if (fileType === 'pdf') {
        return (
          <>
            <TouchableOpacity
              onPress={() => filePreviewButtonAction(item)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                width: 50,
                height: 50,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.PRIMARY_COLOR,
              }}>
              <Pdf
                source={{uri: item, cache: true}}
                pointerEvents={'none'}
                onLoadComplete={(numberOfPages, filePath) => {
                  //console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  //console.log(`Current page: ${page}`);
                }}
                onError={error => {
                  //console.log(`FileAttachmentList error: ${error}`);
                }}
                onPressLink={uri => {
                  //console.log(`Link pressed: ${uri}`);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
                }}
                renderActivityIndicator={progress => {
                  //console.log(progress);
                  return (
                    <ActivityIndicator color={Colors.PRIMARY_COLOR} size={10} />
                  );
                }}
                singlePage
              />
              {/* <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_COLOR,
                }}
                source={Images.PDF_FILE_ICON}
                resizeMode={FastImage.resizeMode.contain}
              /> */}
            </TouchableOpacity>
          </>
        );
      } else if (fileType === 'doc' || fileType === 'docx') {
        return (
          <>
            <TouchableOpacity
              onPress={() => filePreviewButtonAction(item)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_COLOR,
                }}
                source={Images.WORD_FILE_ICON}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </>
        );
      } else {
        return (
          <>
            <ImageFileComponent
              imageFullscreenButtonAction={imageFullscreenButtonAction}
              item={item}
            />
          </>
        );
      }
    } else {
      return null;
    }
  };

  const renderCustomerNotesItem = ({item}) => {
    return isLoading ? (
      <NoteLoader />
    ) : (
      <View style={{marginTop: 20}}>
        <View style={{flexDirection: 'row', paddingLeft: 15, marginBottom: 5}}>
          <Text
            style={{
              color: Colors.NOTES_DETAILS_DATE_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize:isTablet?14: 12,
            }}>
            {Utilities.getUtcToLocalWithFormat(
              item.consultationDate,
              'DD MMM YYYY',
            )}
          </Text>
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: Colors.LINE_SEPARATOR_COLOR,
              marginHorizontal: 15,
            }}
          />
          <Text
            style={{
              color: Colors.NOTES_DETAILS_DATE_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet?14:12,
            }}>
            {Utilities.getUtcToLocalWithFormatANdNoTimezone(
              item.consultationDate,
              Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
            )}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingLeft: 15}}>
          <View style={{flex: 1}}>
            {item.notes !== undefined && item.notes.trimStart() !== '' ? (
              <Text
                style={{
                  color: Colors.NOTES_CONTENT,
                  fontFamily: Fonts.Gibson_Light,
                  fontSize: isTablet?14:12,
                  textAlign: 'left',
                }}>
                {item.notes}
              </Text>
            ) : (
              <Text
                style={{
                  color: Colors.NOTES_EMPTY_COLOR,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet?12:10,
                  marginTop: 5,
                  textAlign: 'left',
                }}>
                {t(Translations.NO_NOTES_ADDED)}
              </Text>
            )}
          </View>
          {Globals.USER_DETAILS.canAddVisit ? (
            <TouchableOpacity
              onPress={() => notesOptionSelectionAction(item)}
              style={{
                width: 45,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -10,
              }}>
              <Image style={{}} source={Images.THREE_DOTS_OPTION} />
            </TouchableOpacity>
          ) : null}
        </View>
        {item?.images?.length > 0 ? (
          <View style={{alignItems: 'flex-start', marginHorizontal: 15}}>
            <FlatList
              contentContainerStyle={{}}
              data={item?.images}
              keyboardShouldPersistTaps="handled"
              renderItem={renderNotesImageItem}
              keyExtractor={(item, index) =>
                item._id ? item._id.toString() : index.toString()
              }
              onEndReachedThreshold={0.2}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}
      </View>
    );
  };

  const renderServicesItem = ({item}) => {
    return <ServicesItem item={item} />;
  };

  const ServicesItem = ({item}) => {
    return (
      <View
        style={{
          borderWidth: 1,
          width: 110,
          height: 80,
          borderRadius: 8,
          borderColor: Colors.SHADOW_COLOR,
          marginRight: 10,
        }}>
        {isLoading ? (
          <ServicesListLoader />
        ) : (
          <>
            {item.lottieImageName !== '' &&
            item.lottieImageName !== undefined ? (
              <View style={{marginTop: 15, height: 35, width: 35, alignSelf: 'center'}}>
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
                  marginTop: 10,
                  width: 40,
                  height: 30,
                  alignSelf: 'center',
                }}
                source={{
                  uri: item.image,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <NO_DEPARTMENT_ICON
                style={{
                  marginTop: 10,
                  width: 40,
                  height: 30,
                  alignSelf: 'center',
                }}
                width={30}
                height={30}
                fill={Colors.WHITE_COLOR}
                fillNoDepartmentSecondary={Colors.SECONDARY_COLOR}
                fillNoDepartmentPrimary={Colors.PRIMARY_COLOR}
              />
            )}
            <View style={{flexDirection: 'row', marginTop: 12}}>
              {item?.genderSelection === 'male' ? (
                <LottieView
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 2,
                    marginTop: 2,
                    marginRight: 8,
                  }}
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
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 2,
                    marginTop: 2,
                    marginRight: 8,
                  }}
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
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 2,
                    marginTop: 2,
                    marginRight: 8,
                  }}
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
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 2,
                    marginTop: 2,
                    marginRight: 8,
                  }}
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
              )}
              <Text
                style={{
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: 12,
                  fontFamily: Fonts.Gibson_SemiBold,
                  width: '70%',
                  textAlign:'left',
                }}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };
  const AddNotesPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetAddNotes}
        closeOnDragDown={false}
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
        height={520}
        onClose={() => {
          Globals.SHARED_VALUES.SELECTED_NOTES_INFO = {};
        }}>
        <AddNotesPopupScreen
          RBSheet={refRBSheetAddNotes}
          isFromDetailsPage={true}
          customerDetails={customerDetails !== undefined ? customerDetails : ''}
          onUpdateNotes={onUpdateNotesHandler}
          setIsFromEdit={setIsFromEdit}
          isFromEdit={isFromEdit}
          heading={noteHeader}
        />
      </RBSheet>
    );
  };

  const onUpdateNotesHandler = () => {
    console.log('Updating..');
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);

    performGetAppointmentDetails();
  };

  const rescheduleButtonAction = () => {
    if (Utilities.isServiceBasedBusiness()) {
      console.log('service based ', appointmentDetails);

      navigation.navigate('ServiceListScreen', {
        module: 'reschedule',
        appointmentType: appointmentDetails?.name,
        selectedServingUserId: appointmentDetails?.servingUser_id._id,
        selectedGender: appointmentDetails?.customer_id?.gender,
        selectedCustomerInfo: appointmentDetails?.customer_id,
        selectedAppointmentDateFrom: appointmentDetails.dateFrom,
        selectedQueueSlotInfo: null,
        isForDirectConsultation: true,
        isServingUserSelected: true,
        parentSource: 'reschedule',
        selectedServices: servicessListIdArray,
        services:appointmentDetails?.services,
      });
    } else {
      if (
        Utilities.getGenderOptions()?.length > 0 &&
        !Utilities.isSingleConsultantBusiness() &&
        Utilities.isGenderSpecificBooking()
      ) {
        console.log('single consultant');
        navigation.navigate('BookingQueueScreen', {
          module: 'reschedule',
          selectedGender: appointmentDetails?.gender,
          selectedCustomerInfo: appointmentDetails?.customer_id,
          appointmentDetails: appointmentDetails,
          selectedServingUserId: appointmentDetails?.servingUser_id._id,
          isServingUserSelected: true,
          selectedAppointmentDateFrom: appointmentDetails.dateFrom,
        });
      } else {
        console.log('multiple consultant');
        navigation.navigate('BookingQueueScreen', {
          module: 'reschedule',
          selectedCustomerInfo: appointmentDetails?.customer_id,
          appointmentDetails: appointmentDetails,
          selectedServingUserId: appointmentDetails?.servingUser_id._id,
          isServingUserSelected: true,
          selectedAppointmentDateFrom: appointmentDetails.dateFrom,
        });
      }
    }
  };
  const AppointmentListHeader = () => {
    let customerName = `${customerDetails?.firstName} ${
      customerDetails?.lastName || ' '
    }`;
    return (
      <View style={{}}>
        <View
          style={{
            borderTopWidth: 0.25,
            borderBottomWidth: 0.25,
            borderBottomColor: Colors.TAB_VIEW_LABEL_COLOR,
            borderTopColor: Colors.TAB_VIEW_LABEL_COLOR,

            paddingBottom: 20,
          }}>
          <View style={{flexDirection: 'row', marginTop: 30}}>
            {isLoading ? (
              <StatusButtonLoader />
            ) : (
              <View style={{flexDirection: 'row', flex: 1}}>
                <View
                  style={{
                    borderColor: Colors.PRIMARY_COLOR,
                    borderWidth: 1,
                    marginLeft: 20,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      color: Colors.PRIMARY_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:  isTablet===true?18:12,
                      marginHorizontal: 15,
                      marginVertical: 5,
                    }}>
                    {/* {selectedAppointmentType.toUpperCase()} */}
                    {appointmentDetails.name === 'Booking'
                      ? t(Translations.BOOKING).toUpperCase()
                      : t(Translations.QUEUE).toUpperCase()}
                  </Text>
                </View>
                <View
                  style={{
                    borderColor: Colors.SECONDARY_COLOR,
                    borderWidth: 1,
                    marginLeft: 15,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      color: Colors.SECONDARY_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:  isTablet===true?18:12,
                      marginHorizontal: 15,
                      marginVertical: 5,
                    }}>
                    {appointmentDetails.status}
                  </Text>
                </View>

                {appointmentDetails?.vitalsUpdated === true ? (
                  <TouchableOpacity
                    onPress={() => refVitalDetailsPopupRBsheet.current.open()}
                    style={{
                      position: 'absolute',
                      right: 15,
                      top: -5,
                      borderWidth: 1,
                      borderColor: Colors.PRIMARY_COLOR,
                      width: 50,
                      height: 50,
                      borderRadius: 50 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={Images.VITALS_ICON}
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                        tintColor: Colors.PRIMARY_COLOR,
                        alignSelf: 'center',
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
          {isLoading ? (
            <PreviousVisitsLoader />
          ) : (
            <>
              <Text
                style={{
                  color: Colors.CUSTOMER_NAME_COLOR,
                  fontSize:isTablet===true?18:14,
                  fontFamily: Fonts.Gibson_Regular,
                  marginLeft: 20,
                  marginTop: 20,
                  textAlign: 'left',
                }}>
                {t(Translations.YOUR)}{' '}
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_TEXT_COLOR,
                  }}>
                  {t(Translations.APPOINTMENT)}
                </Text>{' '}
                {t(Translations.IS_WITH)}
              </Text>
            </>
          )}
          <View style={{flexDirection: 'row'}}>
            {isLoading ? (
              <ProfileLoader />
            ) : (
              <>
                <View style={{marginHorizontal: 12, marginTop: 20}}>
                  <GetImage
                    style={{
                      marginTop: 5,
                      marginLeft: 10,
                      width: isTablet===true?65: 50,
                      height:  isTablet===true?65:50,
                      borderRadius:  isTablet===true?65/2:50 / 2,
                      borderWidth: 1.5,
                      borderColor: Colors.SECONDARY_COLOR,
                    }}
                    fullName={(
                      (customerDetails?.firstName || 'N/A') +
                      ' ' +
                      (customerDetails?.lastName || '')
                    ).trim()}
                    url={customerDetails?.image}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <Text
                    style={{
                      fontFamily: Fonts.Gibson_SemiBold,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      fontSize:  isTablet===true?20:14,
                      textAlign: 'left',
                    }}>
                    

                    {customerName}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: Colors.HOSPITAL_NAME_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize:  isTablet===true?20:14,
                        marginTop: 5,
                        textAlign: 'left',
                      }}>
                      {t(Translations.BOOKING)}#
                    </Text>

                    <Text
                      style={{
                        color: Colors.SECONDARY_COLOR,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:  isTablet===true?20:14,
                        marginTop: 5,
                        marginLeft: 3,
                      }}>
                      {appointmentDetails?.bookingId
                        ? appointmentDetails?.bookingId
                        : appointmentDetails?.waitlistId}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Image
                      style={{
                        width: isTablet===true?16:12,
                        height: isTablet===true?16:12,
                        marginTop: 3,
                        marginRight: 2,
                      }}
                      source={Images.PHONE_ICON}
                    />
                    <Text
                      style={{
                        color: Colors.CUSTOMER_NAME_COLOR,
                        fontSize: isTablet===true?16:12,
                        fontFamily: Fonts.Gibson_Regular,
                        marginLeft: 5,
                      }}>
                      {customerDetails.countryCode !== undefined
                        ? customerDetails.countryCode
                        : null}{' '}
                      {customerDetails?.phoneNumber ? customerDetails?.phoneNumber : <Text>N/A</Text>}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      paddingLeft: 2,
                    }}>
                    <Image
                      style={{
                        width:isTablet===true?12: 9,
                        height: isTablet===true?16:12,
                        marginTop: 3,
                        marginRight: 5,
                      }}
                      source={Images.LOCATION_ICON}
                    />
                    <Text
                      style={{
                        color: Colors.CUSTOMER_NAME_COLOR,
                        fontSize:isTablet===true?16: 12,
                        fontFamily: Fonts.Gibson_Regular,
                        marginLeft: 5,
                        textAlign: 'left',
                        width: '80%',
                        lineHeight: 15,
                      }}
                      numberOfLines={2}>
                      {customerDetails?.addressLineOne ? customerDetails?.addressLineOne : <Text>N/A</Text>}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
          {isLoading ? (
            <PreviousVisitsLoader />
          ) : (
            <View
              style={{flexDirection: 'row', paddingLeft: 15, marginTop: 20}}>
              <>
                <Text
                  style={{
                    color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: isTablet===true?16:10,
                  }}>
                  {statusText}{' '}
                </Text>
                <Text
                  style={{
                    color: Colors.SECONDARY_COLOR,
                    fontSize: isTablet===true?16:11,
                    fontFamily: Fonts.Gibson_SemiBold,
                  }}>
                  {CompletedStatusText}
                </Text>
              </>
            </View>
          )}
          <View>
            {isLoading ? (
              <PreviousVisitsLoader />
            ) : appointmentDetails?.services?.length > 0 ? (
              <Text
                style={{
                  fontFamily: Fonts.Gibson_SemiBold,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: isTablet===true?16:12,
                  marginTop: 15,
                  marginBottom: 15,
                  marginLeft: 15,
                }}>
                {t(Translations.SERVICES)}
              </Text>
            ) : null}
            <View style={{alignItems:'flex-start',paddingLeft:responsiveWidth(3),paddingRight:responsiveWidth(1)}}>
            <FlatList
              contentContainerStyle={{}}
              data={isLoading ? dummyServicesList : appointmentDetails.services}
              keyboardShouldPersistTaps="handled"
              renderItem={renderServicesItem}
              keyExtractor={(item, index) =>
                item._id ? item._id.toString() : index.toString()
              }
              horizontal
              // refreshControl={
              //   <RefreshControl
              //     refreshing={refresh}
              //     onRefresh={onRefresh}
              //     colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
              //   />
              // }
              showsHorizontalScrollIndicator={false}
            />
            </View>
          </View>

          {isLoading ? (
            <PreviousVisitsLoader />
          ) : visibleRefundStatus && Globals.BUSINESS_DETAILS?.enablePricing===true ?  (
            <View style={{paddingRight: 15}}>
              <Text
                style={{
                  fontFamily: Fonts.Gibson_SemiBold,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: 12,
                  marginTop: 8,
                  marginBottom: 10,
                  marginLeft: 15,
                  textAlign: 'left',
                }}>
                {t(Translations.REFUND_STATUS)}
              </Text>
              {/* <Text
                style={{
                  color: Colors.NOTES_DETAILS_DATE_COLOR,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 12,
                  marginLeft: 15,
                  textAlign: 'left',
                }}>
                {refundStatusText}
              </Text> */}
              {appointmentDetails?.refundStatus === 'PENDING' ? (
                <View style={{flexDirection: 'row',}}>
                  <Text
                    style={{
                      color: Colors.NOTES_DETAILS_DATE_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 12,
                      marginLeft: responsiveWidth(4),
                      marginRight: responsiveWidth(4),
                      textAlign: 'left',
                    }}>
                    {appointmentDetails?.paymentStatus === 'PAID'
                    && appointmentDetails?.paymentType === "bycash"
                    ? Utilities.getCurrencyFormattedPrice(
                      appointmentDetails?.refundAmount,
                    ) + ' '
                   : null}

                  <Text
                    style={{
                      color: Colors.NOTES_DETAILS_DATE_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 12,
                      marginLeft:responsiveWidth(4),
                      marginRight:responsiveWidth(4),
                      textAlign: 'left',
                      lineHeight:18,
                    }}
                    numberOfLines={2}
                    >
                    {appointmentDetails?.paymentStatus === 'PAID'
                    && appointmentDetails?.paymentType === "bycash"
                    ? t(Translations.REFUND_AVAILABLE)
                    : refundStatusText}
                  </Text>
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    color: Colors.NOTES_DETAILS_DATE_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: 12,
                    marginLeft: responsiveWidth(4),
                    marginRight:responsiveWidth(4),
                    textAlign: 'left',
                    lineHeight:18,
                  }}
                  numberOfLines={2}
                  >
                  {refundStatusText}
                </Text>
              )}
            </View>
          ) : null}
        </View>

        <View
          style={{
            borderBottomWidth: 0.25,
            borderBottomColor: Colors.TAB_VIEW_LABEL_COLOR,
          }}>
          {isLoading ? (
            <PreviousVisitsLoader />
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: Fonts.Gibson_SemiBold,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: isTablet===true?16:12,
                  marginTop: 15,
                  marginBottom: 15,
                  marginLeft: 15,
                }}>
                {t(Translations.PREVIOUS_VISITS)} ({previousVisitCount})
              </Text>
              {Globals.USER_DETAILS.canAddVisit ? (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: 6,
                    backgroundColor: Colors.BACKGROUND_COLOR,
                    bottom: 6,
                    flexDirection: 'row',
                    borderRadius: 5,
                  }}
                  onPress={() => AddVisit()}>
                  <Image
                    source={Images.PLUS_SQUARE_ICON}
                    style={{
                      width: 16,
                      height: 16,
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                      alignSelf: 'center',
                      marginLeft: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.Gibson_Regular,
                      color: Colors.SECONDARY_COLOR,
                      fontSize: 12,
                      marginTop: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}>
                    {t(Translations.ADD_VISITS)}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>
    );
  };
  //final return
  return (
    <>
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
        <AddNotesPopup />
        <NotesOptionsPopupComponent />
        <AppointmentCancelPopupComponent />
        <VitalDetailsPopup />
        <AppointmentCancelSuccessPopupComponent />
        <RefundConfirmPopupComponent />
        <AppointmentReschedulePopupComponent />
        <LoadingIndicator visible={isLoaderLoading} />
        <ImageView
          images={fullScreenImages}
          imageIndex={0}
          visible={imageFullScreenVisible}
          onRequestClose={() => setImageFullScreenVisible(false)}
        />
        <View
          style={{
            backgroundColor: Colors.PRIMARY_WHITE,
            width: DisplayUtils.setWidth(100),
            height: 70,
          }}>
          <View
            style={{
              marginTop: 25,
              marginLeft: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center', marginRight: 20}}
              onPress={() => backBUttonPressAction()}>
              <Image
                style={{
                  height: isTablet===true?20:17,
                  width: isTablet===true?26:24,
                  transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                }}
                source={Images.BACK_ARROW_IMAGE}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Fonts.Gibson_SemiBold,
                color: Colors.PRIMARY_TEXT_COLOR,
                fontSize: isTablet===true?24:18,
              }}>
              {t(Translations.APPOINTMENT_DETAILS)}
            </Text>
          </View>
        </View>

        <FlatList
          ListHeaderComponent={AppointmentListHeader}
          contentContainerStyle={{paddingBottom: 85, marginTop: 10,}}
          data={isLoading ? dummyCustomerNoteList : customerNotesList}
          keyboardShouldPersistTaps="handled"
          renderItem={renderCustomerNotesItem}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            console.log('==>end reached');
            listOnEndReach();
          }}
          ListEmptyComponent={isLoading ? null : NotesEmptyComponent}
          ListFooterComponent={isPaginating ? paginationComponent : null}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => onRefresh()}
              colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
            />
          }
          showsVerticalScrollIndicator={false}
        />

        {Globals.HIDE_FOR_PRACTO===true?null: appointmentDetails.status === 'PENDING' && !isLoading ? (
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
             {Globals.HIDE_FOR_PRACTO===true?null:
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.WHITE_COLOR,
                borderRightColor: Colors.SHADOW_COLOR,
                borderRightWidth: 0.5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => refAppointmentCancelRBsheetPopup.current.open()}
                style={{marginTop: 10}}>
                <Image
                  source={Images.CLOSE_ICON}
                  style={{
                    tintColor: Colors.SECONDARY_COLOR,
                    alignSelf: 'center',
                    width: 15,
                    height: 15,
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                />
                <Text style={{color: Colors.SECONDARY_COLOR, marginTop: 10}}>
                  {t(Translations.CANCEL)}
                </Text>
              </TouchableOpacity>
            </View>}
            {Globals.HIDE_FOR_PRACTO===true?null:
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.WHITE_COLOR,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{marginTop: 10}}
                onPress={() =>
                  refAppointmentRescheduleRBsheetPopup.current.open()
                }>
                <Image
                  source={Images.RESCHEDULE_ICON}
                  style={{
                    tintColor: Colors.SECONDARY_COLOR,
                    alignSelf: 'center',
                    width: 17,
                    height: 17,
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                />
                <Text style={{color: Colors.SECONDARY_COLOR, marginTop: 10}}>
                  {t(Translations.RESCHEDULE)}
                </Text>
              </TouchableOpacity>
            </View>}
          </View>
        ) : //Check for vitals for bottom bar
        /*
                 "SERVED" "CANCELLED" "NOSHOW" "PENDING" "ARRIVED" "SERVING"
                 */
        /*
                 'before-consultation' | 'after-consultation' | 'anytime' | 'optional'
                 Vitals validation:
                 1.    Before consultation – Vitals should be added on arrived
                 2.    After consultation – Vitals should be added on serving
                 3.    Any time – Vitals should be added before fulfilled (on  arrived or on serving)
                 4.    Optional – Vitals may or may not be added
                 */

        Utilities.isVitalsEnabled() === true ? (
          (Utilities.getAddVitalType() === AddVitalType.beforeConsultation &&
            appointmentDetails.status === 'ARRIVED') ||
          ((Utilities.getAddVitalType() === AddVitalType.beforeConsultation ||
            Utilities.getAddVitalType() === AddVitalType.afterConsultation) &&
            appointmentDetails.status === 'SERVING') ||
          (Utilities.getAddVitalType() === AddVitalType.anyTime &&
            (appointmentDetails.status === 'ARRIVED' ||
              appointmentDetails.status === 'SERVING')) ||
          (Utilities.getAddVitalType() === AddVitalType.optional &&
            (appointmentDetails.status === 'ARRIVED' ||
              appointmentDetails.status === 'SERVING' ||
              appointmentDetails.status === 'SERVED')) ? (
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
                onPress={() => vitalsBottomBarButtonAction()}
                style={{
                  flex: 1,
                  backgroundColor: Colors.WHITE_COLOR,
                  borderRightColor: Colors.SHADOW_COLOR,
                  borderRightWidth: 0.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={Images.VITALS_ICON}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    tintColor: Colors.SECONDARY_COLOR,
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: Fonts.Gibson_Regular,
                    color: Colors.SECONDARY_COLOR,
                    marginTop: 10,
                  }}>
                  {appointmentDetails?.vitalsUpdated === true
                    ? t(Translations.EDIT_VITALS)
                    : t(Translations.ADD_VITALS)}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        ) : null}

        {appointmentDetails.status === 'CANCELLED' &&
        appointmentDetails.refundStatus === 'PENDING' &&
        appointmentDetails.paymentType !== 'online' ? (
          isLoading ? null : (
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
                onPress={() => refundConfirmPopupRBsheet.current.open()}
                style={{
                  flex: 1,
                  backgroundColor: Colors.WHITE_COLOR,
                  borderRightColor: Colors.SHADOW_COLOR,
                  borderRightWidth: 0.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={Images.PAY_NOW_ICON}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    tintColor: Colors.SECONDARY_COLOR,
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: Fonts.Gibson_Regular,
                    color: Colors.SECONDARY_COLOR,
                    marginTop: 10,
                  }}>
                  {t(Translations.PAY_REFUND)}
                </Text>
              </TouchableOpacity>
            </View>
          )
        ) : null}
      </View>
    </>
  );
};

export default AppointmentDetailsScreen;

const styles = StyleSheet.create({});
