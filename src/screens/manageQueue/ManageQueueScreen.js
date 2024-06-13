import React, {useState, useRef, useEffect} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {DraxProvider, DraxList, DraxView} from 'react-native-drax';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
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
import {t} from 'i18next';
import {
  QueueStatus,
  AlertConfirmPopupSource,
  AddVitalType,
} from '../../helpers/enums/Enums';
import {GetImage} from '../shared/getImage/GetImage';
import APIConnections from '../../helpers/apiManager/APIConnections';
import AlertConfirmPopupScreen from '../shared/alertConfirmPopup/AlertConfirmPopupScreen';
import ConsultantFilterPopupScreen from '../shared/consultantFilterPopup/ConsultantFilterPopupScreen';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import NotifyTimeExtensionScreen from './popups/notifyTimeExtension/NotifyTimeExtensionScreen';
import CustomerInfoScreen from './popups/customerInfo/CustomerInfoScreen';
import AddNotesPopupScreen from '../addNotesPopup/AddNotesPopupScreen';
import {TimerViewComponent} from './TimerViewComponent';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import ManageQueueHeader from './ManageQueueHeader';
import ManageQueueTabletHeader from './ManageQueueTabletHeader';
import {useDispatch, useSelector} from 'react-redux';

const ManageQueueScreen = () => {
  const navigation = useNavigation();
  const isConnected = useNetInfo();
  const [isLoading, setIsLoading] = useState(false);
  //Declaration
  const insets = useSafeAreaInsets();

  const [notArrivedList, setNotArrivedList] = useState([]);
  const [arrivedList, setArrivedList] = useState([]);
  const [servingList, setServingList] = useState([]);
  const [fulfilledList, setFulfilledList] = useState([]);

  const [isNotArrivedListDragStarted, setIsNotArrivedListDragStarted] =
    useState(false);
  const [isArrivedListDragStarted, setIsArrivedListDragStarted] =
    useState(false);
  const [isServingListDragStarted, setIsServingListDragStarted] =
    useState(false);
  const [isFulfilledListDragStarted, setIsFulfilledListDragStarted] =
    useState(false);
  const [availabilityInfo, setAvailabilityInfo] = useState({});
  const [morningSessionTime, setMorningSessionTime] = useState('');
  const [eveningSessionTime, setEveningSessionTime] = useState('');
  // const [selectedServingUserInfo, setSelectedServingUserInfo] = useState(Globals.USER_DETAILS);
  let currentDate = Utilities.convertorTimeToBusinessTimeZone(
    moment().toISOString())
    console.log('Today date====>>>>>',currentDate);
    let holiday = Utilities.checkSelectedDateIsHoliday(currentDate);
    console.log('Check Holiday===<<<',holiday);
  var toggleServingFlag = 0;
  var servingItemsList = [];
  //var alertConfirmPopupSource = AlertConfirmPopupSource.none;
  //var moveToFulFilledPayloadInfo = {};

  const gestureRootViewStyle = {flex: 1};
  const refRBSheetAlertConfirm = useRef();
  const consultantFilterPopupRBsheet = useRef();
  const refRBSheetNotifyTimeExtension = useRef();
  const refRBSheetCustomerPrimaryInfo = useRef();
  const refRBSheetAddNotes = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const draxlist = useRef();

  //redux state for tabletview
  const isTablet = useSelector((state)=>state.tablet.isTablet);
  /*
    useEffect(() => {
        setIsLoading(true);

        if (Utilities.isUserIsConsultant() === true) {
            getAvailability(Globals.USER_DETAILS._id);
            getAppointment(Globals.USER_DETAILS._id);
        } else {
            performGetConsultantList();
        }
    }, []);
    */
  useFocusEffect(
    React.useCallback(() => {
      resetAllDragStartedStates();
      return () => {};
    }, []),
  );
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'Notification unread count',
        Globals.UN_READ_NOTIFICATION_COUNT,
      );
      setIsLoading(true);
      if (Utilities.isUserIsConsultant() === true) {
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO =
          Globals.USER_DETAILS;
        getAvailability(Globals.USER_DETAILS._id);
        getAppointment(Globals.USER_DETAILS._id);
      } else {
        if (
          Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id ===
            undefined ||
          Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id ===
            null
        ) {
          performGetConsultantList();
        } else {
          getAvailability(
            Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
          );
          getAppointment(
            Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
          );
        }
      }
      return () => {
        // Globals.SELECTED_CUSTOMER_INFO = {};
        // Globals.SELECTED_DATE_FROM = '';
        // Globals.FAILURE_ERROR_MESSAGE = '';
        // Globals.SELECTED_PAYMENT_INFO = {}
      };
    }, []),
  );

  /*
        useEffect(() => {
    
            let interval = setInterval(() => {
                console.log(`Inside loop isLoading: ${isLoading} servingItemsList.length: ${servingItemsList.length}`);
                if (isLoading === false && servingItemsList.length > 0) {
                    if (toggleServingFlag === 0) {
                        setIsServingTimerFlag(0);
                        toggleServingFlag = 1;
                    } else {
                        setIsServingTimerFlag(1);
                        toggleServingFlag = 0;
                    }
                }
            }, 1000) //each count lasts for a second
            //cleanup the interval on complete
            return () => clearInterval(interval);
        }, []);
    
        useEffect(() => {
            let interval2 = setInterval(() => {
                fetchLatestList();
            }, 45000) //each count lasts for 45 second
            //cleanup the interval on complete
            return () => clearInterval(interval2);
        }, []);
        */

  //Button actions
  const sessionButtonAction = () => {
    Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE =
      AlertConfirmPopupSource.session;
    if (availabilityInfo?.sessionInfo?.enableStartButton === true) {
      //Start session
      Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE = t(
        Translations.ARE_YOU_SURE_YOU_WANT_TO_START_A_NEW_SESSION,
      );
      refRBSheetAlertConfirm.current.open();
    } else if (availabilityInfo?.sessionInfo?.enableEndButton === true) {
      //End session
      Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE = t(
        Translations.ARE_YOU_SURE_YOU_WANT_TO_END_THE_NEW_SESSION,
      );
      refRBSheetAlertConfirm.current.open();
    }
  };

  const arrivedAnnouncementAction = () => {
    refRBSheetNotifyTimeExtension.current.open();
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

  const servingCloseButtonAction = index => {
    Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE = t(
      Translations.ARE_YOU_SURE_YOU_WANT_TO_CANCEL_THIS_APPOINTMENT,
    );
    Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO = servingList[index];
    Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE =
      AlertConfirmPopupSource.removeDirectCheckIn;
    refRBSheetAlertConfirm.current.open();
  };

  const addNotesButtonAction = (sourceType: QueueStatus, item, index) => {
    Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO = item;
    refRBSheetAddNotes.current.open();
  };

  const moveToFulFilledButtonAction = index => {
    resetAllDragStartedStates();
    Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO = servingList[index];
    console.log('Move to fulfilled button action', servingList[index]);

    let isPaymentSuccess = 1;
    let isVitalSuccess = 1;
    //Check payment status
    if (
      // Utilities.isBillingEnabled() === true &&
      // (servingList[index]?.amountPaid || 0) > 0 &&
      // Utilities.isPaymentBeforeConsultation() === true &&
      // servingList[index]?.paymentStatus !== 'PAID'
      // bug 24062
      Utilities.isBillingEnabled() === true &&
      (servingList[index]?.amountPaid || 0) > 0 &&
      servingList[index]?.paymentStatus !== 'PAID'
    ) {
      Utilities.showToast(
        t(Translations.FAILED),
        t(Translations.BILL_NOT_PAID),
        'info',
        'bottom',
      );
      isPaymentSuccess = 0;
    }
    console.log(
      'Globals.BUSINESS_DETAILS==>',
      Globals.BUSINESS_DETAILS,
      'Utilities.isVitalsEnabled() ==>',
      Utilities.isVitalsEnabled(),
      'Utilities.isAnyVitalsRequired() ==>',
      Utilities.isAnyVitalsRequired(),
    );
    if (
      Utilities.isVitalsEnabled() &&
      Utilities.isAnyVitalsRequired() &&
      (Utilities.getAddVitalType() === AddVitalType.afterConsultation ||
        Utilities.getAddVitalType() === AddVitalType.beforeConsultation ||
        Utilities.getAddVitalType() === AddVitalType.anyTime) &&
      Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO?.vitalsUpdated ===
        false
    ) {
      Utilities.showToast(
        t(Translations.FAILED),
        t(Translations.PLEASE_ADD_VITALS),
        'info',
        'bottom',
      );
      isVitalSuccess = 0;
    }

    if (isPaymentSuccess === 1 && isVitalSuccess === 1) {
      Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE = t(
        Translations.ARE_YOU_SURE_WANT_TO_MOVE_THIS_USER_TO_FULFILLED,
      );
      Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO = servingList[index];
      Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE =
        AlertConfirmPopupSource.moveToFulFilled;
      refRBSheetAlertConfirm.current.open();
    }
  };

  const plusButtonAction = () => {
    //Check for session start
    if (availabilityInfo?.sessionInfo?.enableEndButton === true) {
      navigation.navigate('NewBookingCustomerListScreen', {
        selectedServingUserId:
          Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
        isForDirectConsultation: true,
      });
    } else {
      Utilities.showToast(
        t(Translations.FAILED),
        t(Translations.PLEASE_START_SESSION_FIRST),
        'info',
        'bottom',
      );
    }
  };

  const onPressDragItem = (sourceType: QueueStatus, item, index) => {
    console.log(`On touch item sourceType: ${sourceType} index: ${index}`);
    Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO = item;
    refRBSheetCustomerPrimaryInfo.current.open();
  };

  //API Calls
  /**
          *
          * Purpose: Get user details
          * Created/Modified By: Jenson
          * Created/Modified Date: 21 Jan 2022
          * Steps:
              1.fetch business details from API and append to state variable
   */
  const getAppointment = servingUserId => {
    const headers = {
      [APIConnections.KEYS.USER_ID]: servingUserId,
    };
    DataManager.getCurrentDayAppointments(headers).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.object !== undefined && data.object !== null) {
            configureDataToLists(data.object);
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
          * Purpose: Get user details
          * Created/Modified By: Jenson
          * Created/Modified Date: 21 Jan 2022
          * Steps:
              1.fetch business details from API and append to state variable
   */
  const getAvailability = servingUserId => {
    DataManager.getAvailability(servingUserId).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.objects !== undefined && data.objects !== null) {
            setAvailabilityInfo(data.objects);
            configureSessionInfo(data.objects);
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
              * Purpose: Update booking status
              * Created/Modified By: Jenson
              * Created/Modified Date: 27 Jan 2022
              * Steps:
                  1.fetch business details from API and append to state variable
       */
  const updateBookingStatus = (bookingId, status) => {
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.BOOKING_ID]: bookingId,
      [APIConnections.KEYS.STATUS]: status,
      [APIConnections.KEYS.SERVING_USER_ID]:
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    };
    setIsLoading(true);
    DataManager.performBookingStatusChange(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.object !== undefined && data.object !== null) {
            configureDataToLists(data.object);
            setIsLoading(false);
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            // setIsLoading(false);
            getAppointment(
              Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
            );
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          //setIsLoading(false);
          getAppointment(
            Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
          );
        }
      },
    );
  };

  /**
             *
             * Purpose: Update Queue status
             * Created/Modified By: Jenson
             * Created/Modified Date: 27 Jan 2022
             * Steps:
                 1.fetch business details from API and append to state variable
      */
  const updateQueueStatus = (queueId, status) => {
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.WAITLIST_ID]: queueId,
      [APIConnections.KEYS.STATUS]: status,
      [APIConnections.KEYS.SERVING_USER_ID]:
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    };
    setIsLoading(true);
    DataManager.performQueueStatusChange(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.object !== undefined && data.object !== null) {
            configureDataToLists(data.object);
            setIsLoading(false);
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            //setIsLoading(false);
            getAppointment(
              Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
            );
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          //setIsLoading(false);
          getAppointment(
            Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
          );
        }
      },
    );
  };

  /**
             *
             * Purpose: Perform session start
             * Created/Modified By: Jenson
             * Created/Modified Date: 28 Jan 2022
             * Steps:
                 1.fetch business details from API and append to state variable
      */
  const performSessionStart = () => {
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.SERVING_USER_ID]:
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    };
    setIsLoading(true);
    DataManager.performServingSessionStart(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.objects !== undefined && data.objects !== null) {
            getAvailability(
              Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
            );
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
             * Purpose: Perform session end
             * Created/Modified By: Jenson
             * Created/Modified Date: 28 Jan 2022
             * Steps:
                 1.fetch business details from API and append to state variable
      */
  const performSessionEnd = () => {
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.SERVING_USER_ID]:
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    };
    setIsLoading(true);
    DataManager.performServingSessionEnd(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.objects !== undefined && data.objects !== null) {
            getAvailability(
              Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
            );
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
        * Purpose: Fetch consultant list
        * Created/Modified By: Jenson
        * Created/Modified Date: 01 Feb 2022
        * Steps:
            1.fetch UpcomingBookingLists list from API and append to state variable
    */

  const performGetConsultantList = () => {
    DataManager.getConsultantList().then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        let allConsultants = data.objects;
        if (allConsultants !== undefined && allConsultants !== null) {
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
          console.log('??????}}}}}}]]]]]',todayOnlyWorkingConsultants)
          if (
            todayOnlyWorkingConsultants[0] !== undefined &&
            todayOnlyWorkingConsultants[0] !== null
          ) {
            // setSelectedServingUserInfo(data?.objects[0]);
            Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO =
              todayOnlyWorkingConsultants[0];
            getAvailability(todayOnlyWorkingConsultants[0]?._id);
            getAppointment(todayOnlyWorkingConsultants[0]?._id);
            console.log(
              'todayOnlyWorkingConsultants: ',
              todayOnlyWorkingConsultants,
            );
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
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };

  /**
                 *
                 * Purpose: Perform remove direct consultation
                 * Created/Modified By: Jenson
                 * Created/Modified Date: 03 Feb 2022
                 * Steps:
                     1.fetch data from API and append to state variable
          */
  const performRemoveDirectCheckIn = () => {
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.CONSULTATION_ID]:
        Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO?._id,
    };
    setIsLoading(true);
    DataManager.performRemoveDirectCheckIn(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          setRefreshing(true);
          draxlist.current.scrollToIndex({index: 0});
          getAppointment(
            Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
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
      },
    );
  };

  //Other function

  // const filterTodayAvailableConsultants = nonBlockedConsultants => {
  //   var _todaysConsultants = [];
  //   //Check current date
  //   let currentBusinessDay = moment(
  //     Utilities.convertorTimeToBusinessTimeZone(moment()),
  //   ).format('dddd');
  //   nonBlockedConsultants.map(consultant => {
  //     let _workingHours = consultant?.workingHours || [];
  //     console.log(
  //       'filterTodayAvailableConsultants _workingHours: ',
  //       _workingHours,
  //     );
  //     let currentDayIndex = _workingHours.findIndex(
  //       obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
  //     );
  //     if (currentDayIndex !== -1) {
  //       if (_workingHours[currentDayIndex]?.activeFlag === true) {
  //         _todaysConsultants.push(consultant);
  //       }
  //     }
  //   });
  //   return _todaysConsultants;
  // };

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
  const configureDataToLists = allListObjects => {
    if (allListObjects !== undefined && allListObjects !== null) {
      resetAllDataStates();

      if (
        allListObjects.serving !== undefined &&
        allListObjects.serving !== null
      ) {
        var _servingList = allListObjects.serving;
        if (_servingList.length > 0) {
          allListObjects.serving.map((item, itemIndex) => {
            _servingList[itemIndex].type = QueueStatus.serving;
          });
          servingItemsList = _servingList;
          setServingList(_servingList);
        }
      }
      if (
        allListObjects.arrived !== undefined &&
        allListObjects.arrived !== null
      ) {
        var _arrivedList = allListObjects.arrived;
        if (_arrivedList.length > 0) {
          allListObjects.arrived.map((item, itemIndex) => {
            _arrivedList[itemIndex].type = QueueStatus.arrived;
          });
          setArrivedList(_arrivedList);
        }
      }
      if (
        allListObjects.pending !== undefined &&
        allListObjects.pending !== null
      ) {
        var _notArrivedList = allListObjects.pending;
        if (_notArrivedList.length > 0) {
          allListObjects.pending.map((item, itemIndex) => {
            _notArrivedList[itemIndex].type = QueueStatus.notArrived;
          });
          setNotArrivedList(_notArrivedList);
        }
      }
      if (
        allListObjects.served !== undefined &&
        allListObjects.served !== null
      ) {
        var _servedList = allListObjects.served;
        if (_servedList.length > 0) {
          allListObjects.served.map((item, itemIndex) => {
            _servedList[itemIndex].type = QueueStatus.fulfilled;
          });
          setFulfilledList(_servedList);
        }
      }
    } else {
      Utilities.showToast(
        t(Translations.FAILED),
        t(Translations.UNKNOWN_ERROR),
        'error',
        'bottom',
      );
    }
  };

  const fetchLatestList = () => {
    if (
      isNotArrivedListDragStarted === false ||
      isArrivedListDragStarted === false ||
      isServingListDragStarted === false ||
      isFulfilledListDragStarted === false
    ) {
      if (isLoading === false) {
        console.log('Started fetching list background');
        getAppointment(
          Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
        );
      }
    }
  };

  const resetAllDataStates = () => {
    setNotArrivedList([]);
    setArrivedList([]);
    setServingList([]);
    setFulfilledList([]);
    servingItemsList = [];
  };

  const resetAllDragStartedStates = () => {
    setIsNotArrivedListDragStarted(false);
    setIsArrivedListDragStarted(false);
    setIsServingListDragStarted(false);
    setIsFulfilledListDragStarted(false);
  };

  const configureSessionInfo = _availabilityInfo => {
    if (_availabilityInfo !== undefined && _availabilityInfo !== null) {
      if (_availabilityInfo?.workingHours?.length > 0) {
        //Check current date
        let currentBusinessDay = moment(
          Utilities.convertorTimeToBusinessTimeZone(moment()),
        ).format('dddd');
        let currentDayWorkingHoursInfo = _availabilityInfo?.workingHours.filter(
          data => data.label.toUpperCase() === currentBusinessDay.toUpperCase(),
        );
        //Morning
        if (
          currentDayWorkingHoursInfo[0]?.hours[0]?.isBookingEnabled === false &&
          currentDayWorkingHoursInfo[0]?.hours[0]?.isQueueEnabled === false
        ) {
          setMorningSessionTime('No consultation');
        } else {
          let morningFromHour =
            currentDayWorkingHoursInfo[0]?.hours[0]?.from?.hour;
          let morningFromMin =
            currentDayWorkingHoursInfo[0]?.hours[0]?.from?.min;
          let _businessMorningFromTime =
            (morningFromHour.length === 1
              ? `0${morningFromHour}`
              : `${morningFromHour}`) +
            ':' +
            (morningFromMin.length === 1
              ? `0${morningFromMin}`
              : `${morningFromMin}`);

          let morningToHour = currentDayWorkingHoursInfo[0]?.hours[0]?.to?.hour;
          let morningToMin = currentDayWorkingHoursInfo[0]?.hours[0]?.to?.min;
          let _businessMorningToTime =
            (morningToHour.length === 1
              ? `0${morningToHour}`
              : `${morningToHour}`) +
            ':' +
            (morningToMin.length === 1
              ? `0${morningToMin}`
              : `${morningToMin}`);

          let businessMorningFromTime = moment(
            Utilities.convertorTimeToBusinessTimeZone(
              `2022-01-31T${_businessMorningFromTime}:00.000Z`,
            ),
          ).format('hh:mm A');
          let businessMorningToTime = moment(
            Utilities.convertorTimeToBusinessTimeZone(
              `2022-01-31T${_businessMorningToTime}:00.000Z`,
            ),
          ).format('hh:mm A');
          console.log(
            `businessMorningFromTime: ${businessMorningFromTime} businessMorningToTime: ${businessMorningToTime}`,
          );

          setMorningSessionTime(
            `${businessMorningFromTime} - ${businessMorningToTime}`,
          );
        }

        //Evening
        if (
          currentDayWorkingHoursInfo[0]?.hours[1]?.isBookingEnabled === false &&
          currentDayWorkingHoursInfo[0]?.hours[1]?.isQueueEnabled === false
        ) {
          setEveningSessionTime(t(Translations.NO_CONSULTATION));
        } else {
          let eveningFromHour =
            currentDayWorkingHoursInfo[0]?.hours[1]?.from?.hour;
          let eveningFromMin =
            currentDayWorkingHoursInfo[0]?.hours[1]?.from?.min;

          let _businessEveningFromTime =
            (eveningFromHour.length === 1
              ? `0${eveningFromHour}`
              : `${eveningFromHour}`) +
            ':' +
            (eveningFromMin.length === 1
              ? `0${eveningFromMin}`
              : `${eveningFromMin}`);

          let eveningToHour = currentDayWorkingHoursInfo[0]?.hours[1]?.to?.hour;
          let eveningToMin = currentDayWorkingHoursInfo[0]?.hours[1]?.to?.min;

          let _businessEveningToTime =
            (eveningToHour.length === 1
              ? `0${eveningToHour}`
              : `${eveningToHour}`) +
            ':' +
            (eveningToMin.length === 1
              ? `0${eveningToMin}`
              : `${eveningToMin}`);

          let businessEveningFromTime = moment(
            Utilities.convertorTimeToBusinessTimeZone(
              `2022-01-31T${_businessEveningFromTime}:00.000Z`,
            ),
          ).format('hh:mm A');
          let businessEveningToTime = moment(
            Utilities.convertorTimeToBusinessTimeZone(
              `2022-01-31T${_businessEveningToTime}:00.000Z`,
            ),
          ).format('hh:mm A');
          console.log(
            `businessEveningFromTime: ${businessEveningFromTime} businessEveningToTime: ${businessEveningToTime}`,
          );
          setEveningSessionTime(
            `${businessEveningFromTime} - ${businessEveningToTime}`,
          );
        }
      }
    }
  };

  const onReceivedDrop = (source: QueueStatus, payload) => {
    console.log(`onReceivedDrop source: ${source}`);
    /*
            case notArrived = "pending"
            case arrived = "arrived"
            case serving = "serving"
            case fulfilled = "served"
        */
    let payloadSource = payload.type;
    // console.log(
    //   `onReceivedDrop source: ${source},
    //     payloadSource: ${payloadSource} payload: ${JSON.stringify(
    //     payload,
    //   )}`,
    // );
    switch (source) {
      case QueueStatus.notArrived:
        if (payloadSource === QueueStatus.arrived) {
          //Deleting from old list
          const arrivedListCopy = [...arrivedList];
          var arrivedListDeleteIndex = arrivedListCopy.indexOf(payload);
          if (arrivedListDeleteIndex > -1) {
            arrivedListCopy.splice(arrivedListDeleteIndex, 1);
          }
          setArrivedList(arrivedListCopy);

          //Copying to new list
          const notArrivedListCopy = [...notArrivedList];
          payload.type = source;
          notArrivedListCopy.push(payload);
          setNotArrivedList(notArrivedListCopy);

          //Perform API call
          if (payload.name.toUpperCase() === 'Booking'.toUpperCase()) {
            updateBookingStatus(payload?._id, 'pending');
          } else {
            updateQueueStatus(payload?._id, 'pending');
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            t(Translations.ONLY),
            'info',
            'bottom',
          );
        }
        break;
      case QueueStatus.arrived:
        //Check for session start
        console.log('====================================');
        console.log(
          'Utilities.isBillingEnabled() \n',
          Utilities.isBillingEnabled(),
          'Utilities.isPaymentBeforeConsultation()\n',
          Utilities.isPaymentBeforeConsultation(),
          'payload?.paymentStatus\n',
          payload?.paymentStatus,
        );
        console.log('====================================');
        if (
          Utilities.isBillingEnabled() === true &&
          (payload?.amountPaid || 0) > 0 &&
          Utilities.isPaymentBeforeConsultation() === true &&
          payload?.paymentStatus !== 'PAID'
        ) {
          Utilities.showToast(
            t(Translations.FAILED),
            t(Translations.BILL_NOT_PAID),
            'info',
            'bottom',
          );
        } else {
          if (payloadSource === QueueStatus.notArrived) {
            //Deleting from old list
            const notArrivedListCopy = [...notArrivedList];
            var notArrivedListDeleteIndex = notArrivedListCopy.indexOf(payload);
            if (notArrivedListDeleteIndex > -1) {
              notArrivedListCopy.splice(notArrivedListDeleteIndex, 1);
            }
            setNotArrivedList(notArrivedListCopy);

            //Copying to new list
            const arrivedListCopy = [...arrivedList];
            payload.type = source;
            arrivedListCopy.push(payload);
            setArrivedList(arrivedListCopy);

            //Perform API call
            if (payload.name.toUpperCase() === 'Booking'.toUpperCase()) {
              updateBookingStatus(payload?._id, 'arrived');
            } else {
              updateQueueStatus(payload?._id, 'arrived');
            }
          } else if (availabilityInfo?.sessionInfo?.enableEndButton === true) {
            if (payloadSource === QueueStatus.serving) {
              //Deleting from old list
              const servingListCopy = [...servingList];
              var servingListDeleteIndex = servingListCopy.indexOf(payload);
              if (servingListDeleteIndex > -1) {
                servingListCopy.splice(servingListDeleteIndex, 1);
              }
              setServingList(servingListCopy);

              //Copying to new list
              const arrivedListCopy = [...arrivedList];
              payload.type = source;
              arrivedListCopy.push(payload);
              setArrivedList(arrivedListCopy);

              //Perform API call
              if (payload.name.toUpperCase() === 'Booking'.toUpperCase()) {
                updateBookingStatus(payload?._id, 'arrived');
              } else {
                updateQueueStatus(payload?._id, 'arrived');
              }
            } else {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.ONLY_FROM_ARRIVED_LIST_IS_ACCEPTED),
                'info',
                'bottom',
              );
            }
          } else {
            if (Utilities.isUserIsAdmin() === true) {
              Utilities.showToast(
                t(Translations.FAILED),
                Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO
                  ?.name +
                  '  ' +
                  t(Translations.SHOULD_START_THE_SESSION_TO_SERVE_CUSTOMER),
                'info',
                'bottom',
              );
            } else {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.FOR_SERVING_YOUR_CUSTOMER) +
                  ' ,' +
                  t(Translations.PLEASE_START_YOUR_SESSION),
                'info',
                'bottom',
              );
            }
          }
        }
        break;

      case QueueStatus.serving:
        if (payloadSource === QueueStatus.arrived) {
          //Check for session start
          if (availabilityInfo?.sessionInfo?.enableEndButton === true) {
            //Check payment status
            if (
              Utilities.isBillingEnabled() === true &&
              (payload?.amountPaid || 0) > 0 &&
              Utilities.isPaymentBeforeConsultation() === true &&
              payload?.paymentStatus !== 'PAID'
            ) {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.BILL_NOT_PAID),
                'info',
                'bottom',
              );
              return;
            }

            //Check vitals entered ifAny
            if (
              Utilities.isVitalsEnabled() &&
              Utilities.isAnyVitalsRequired() &&
              Utilities.getAddVitalType() === AddVitalType.beforeConsultation &&
              payload?.vitalsUpdated === false
            ) {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.PLEASE_ADD_VITALS),
                'info',
                'bottom',
              );
            } else {
              //Deleting from old list
              const arrivedListCopy = [...arrivedList];
              var arrivedListDeleteIndex = arrivedListCopy.indexOf(payload);
              if (arrivedListDeleteIndex > -1) {
                arrivedListCopy.splice(arrivedListDeleteIndex, 1);
              }
              setArrivedList(arrivedListCopy);

              //Copying to new list
              const servingListCopy = [...servingList];
              payload.type = source;
              servingListCopy.push(payload);
              setServingList(servingListCopy);

              //Perform API call
              if (payload.name.toUpperCase() === 'Booking'.toUpperCase()) {
                updateBookingStatus(payload?._id, 'serving');
              } else {
                updateQueueStatus(payload?._id, 'serving');
              }
            }
          } else {
            // Utilities.showToast(
            //   t(Translations.FAILED),

            //   t(Translations.PLEASE_START_SESSION_FIRST),
            //   'info',
            //   'bottom',
            // );

            if (Utilities.isUserIsAdmin() === true) {
              Utilities.showToast(
                t(Translations.FAILED),
                Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO
                  ?.name +
                  '  ' +
                  t(Translations.SHOULD_START_THE_SESSION_TO_SERVE_CUSTOMER),
                'info',
                'bottom',
              );
            } else {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.FOR_SERVING_YOUR_CUSTOMER) +
                  ' ,' +
                  t(Translations.PLEASE_START_YOUR_SESSION),
                'info',
                'bottom',
              );
            }
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            t(Translations.ONLY_FROM_ARRIVED_LIST_IS_ACCEPTED),
            'info',
            'bottom',
          );
        }
        break;
      case QueueStatus.fulfilled:
        if (payloadSource === QueueStatus.serving) {
          //Check for session start
          if (availabilityInfo?.sessionInfo?.enableEndButton === true) {
            console.log('inside serving <----------------------------> ');
            console.log(
              'Globals.BUSINESS_DETAILS==> \n',
              Globals.BUSINESS_DETAILS,
              'Utilities.isVitalsEnabled() ==> \n',
              Utilities.isVitalsEnabled(),
              'Utilities.isAnyVitalsRequired() ==>\n',
              Utilities.isAnyVitalsRequired(),
              'Utilities.getAddVitalType() === AddVitalType.afterConsultation \n',
              Utilities.getAddVitalType() === AddVitalType.afterConsultation,
              'Utilities.getAddVitalType() === AddVitalType.anyTime\n',
              Utilities.getAddVitalType() === AddVitalType.anyTime,
              'payload?.vitalsUpdated',
              payload?.vitalsUpdated,
            );
            //Check vitals entered ifAny
            if (
              Utilities.isVitalsEnabled() &&
              Utilities.isAnyVitalsRequired() &&
              (Utilities.getAddVitalType() === AddVitalType.afterConsultation ||
                Utilities.getAddVitalType() ===
                  AddVitalType.beforeConsultation ||
                Utilities.getAddVitalType() === AddVitalType.anyTime) &&
              payload?.vitalsUpdated === false
            ) {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.PLEASE_ADD_VITALS),
                'info',
                'bottom',
              );
              // return;
            } else if (
              Utilities.isBillingEnabled() === true &&
              (payload?.amountPaid || 0) > 0 &&
              payload?.paymentStatus !== 'PAID'
            ) {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.BILL_NOT_PAID),
                'info',
                'bottom',
              );
            } else {
              setTimeout(() => {
                // Show alert confirm
                Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE = t(
                  Translations.ARE_YOU_SURE_YOU_WANT_TO_MOVE_THIS_USER_TO_FULFILLED,
                );
                Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO = payload;
                Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE =
                  AlertConfirmPopupSource.moveToFulFilled;
                refRBSheetAlertConfirm.current.open();
              }, 500);

              /*
                        //Deleting from old list
                        const servingListCopy = [...servingList];
                        var servingListDeleteIndex = servingListCopy.indexOf(payload);
                        if (servingListDeleteIndex > -1) {
                            servingListCopy.splice(servingListDeleteIndex, 1);
                        }
                        setServingList(servingListCopy);

                        //Copying to new list
                        const fulfilledListCopy = [...fulfilledList];
                        payload.type = source;
                        fulfilledListCopy.push(payload);
                        setFulfilledList(fulfilledListCopy);

                        //Perform API call
                        if (payload.name.toUpperCase() === 'Booking'.toUpperCase()) {
                            updateBookingStatus(payload?._id, 'served');
                        } else {
                            updateQueueStatus(payload?._id, 'served');
                        }
                        */
            }
          } else if (Utilities.isUserIsAdmin() === true) {
            Utilities.showToast(
              t(Translations.FAILED),
              Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?.name +
                '  ' +
                t(Translations.SHOULD_START_THE_SESSION_TO_SERVE_CUSTOMER),
              'info',
              'bottom',
            );
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              t(Translations.FOR_SERVING_YOUR_CUSTOMER) +
                ' ,' +
                t(Translations.PLEASE_START_YOUR_SESSION),
              'info',
              'bottom',
            );
          }
          // } else {
          //   Utilities.showToast(
          //     t(Translations.FAILED),
          //     t(Translations.ONLY_FROM_SERVING_LIST_IS_ACCEPTED),
          //     'info',
          //     'bottom',
          //   );
        }

      default:
        break;
    }
  };

  //Popup callbacks

  const alertConfirmPopupSelectedNo = () => {
    refRBSheetAlertConfirm.current.close();
  };

  const alertConfirmPopupSelectedYes = () => {
    refRBSheetAlertConfirm.current.close();

    console.log(
      'Other Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE: ',
      Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE,
    );

    if (
      Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE ===
      AlertConfirmPopupSource.session
    ) {
      if (availabilityInfo?.sessionInfo?.enableStartButton === true) {
        //Start session
        performSessionStart();
      } else if (availabilityInfo?.sessionInfo?.enableEndButton === true) {
        //End session
        performSessionEnd();
      }
    } else if (
      Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE ===
      AlertConfirmPopupSource.moveToFulFilled
    ) {
      //Deleting from old list
      const servingListCopy = [...servingList];
      var servingListDeleteIndex = servingListCopy.indexOf(
        Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO,
      );
      if (servingListDeleteIndex > -1) {
        servingListCopy.splice(servingListDeleteIndex, 1);
      }
      setServingList(servingListCopy);

      //Copying to new list
      const fulfilledListCopy = [...fulfilledList];
      Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO.type =
        QueueStatus.fulfilled;
      fulfilledListCopy.push(
        Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO,
      );
      setFulfilledList(fulfilledListCopy);

      //Perform API call
      if (
        Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO.name.toUpperCase() ===
        'Booking'.toUpperCase()
      ) {
        updateBookingStatus(
          Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO?._id,
          'served',
        );
      } else {
        updateQueueStatus(
          Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO?._id,
          'served',
        );
      }
    } else if (
      Globals.SHARED_VALUES.ALERT_CONFIRM_POPUP_SOURCE ===
      AlertConfirmPopupSource.removeDirectCheckIn
    ) {
      performRemoveDirectCheckIn();
    }
  };

  //Render UI

  const AlertConfirmPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetAlertConfirm}
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
        height={320}>
        <AlertConfirmPopupScreen
          RBSheet={refRBSheetAlertConfirm}
          didSelectNo={alertConfirmPopupSelectedNo}
          didSelectYes={alertConfirmPopupSelectedYes}
        />
      </RBSheet>
    );
  };

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
          //selectedConsultant={selectedConsultant}
        />
      </RBSheet>
    );
  };

  const handleConsultantSelection = selectedOption => {
    console.log('selected consultant', selectedOption);
    // setSelectedServingUserInfo(selectedOption);
    Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO = selectedOption;
    setIsLoading(true);
    getAvailability(selectedOption?._id);
    getAppointment(selectedOption?._id);
  };

  const NotifyTimeExtensionPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetNotifyTimeExtension}
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
        height={320}>
        <NotifyTimeExtensionScreen
          RBSheet={refRBSheetNotifyTimeExtension}
          didSelectItem={didSelectedItemNotifyTimeExtension}
        />
      </RBSheet>
    );
  };

  const didSelectedItemNotifyTimeExtension = selectedItem => {
    console.log('didSelectNotifyTimeExtension item: ', selectedItem);
  };

  const CustomerPrimaryPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetCustomerPrimaryInfo}
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
            backgroundColor: Colors.TRANSPARENT,
          },
          draggableIcon: {
            backgroundColor: Colors.TRANSPARENT,
          },
        }}
        height={450}>
        <CustomerInfoScreen
          RBSheet={refRBSheetCustomerPrimaryInfo}
          updateListAction={updateListHandler}
        />
      </RBSheet>
    );
  };

  const updateListHandler = () => {
    console.log('Updating..');
    setIsLoading(true);
    getAvailability(
      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    );
    getAppointment(
      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
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
        height={520}>
        <AddNotesPopupScreen
          RBSheet={refRBSheetAddNotes}
          isFromDetailsPage={false}
          customerDetails={''}
          onUpdateNotes={onUpdateNotesHandler}
        />
      </RBSheet>
    );
  };

  const onUpdateNotesHandler = () => {
    console.log('Updating..');
    getAvailability(
      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    );
    getAppointment(
      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    );
  };

  const NotArrivedDragUIComponent = ({item, index}) => {
    console.log('Render NotArrivedDragUIComponent');

    return (
      <DraxView
        style={{
          flex: 1,
          width:isTablet?'90%':'100%',
          height: isTablet===true?95:80,
          borderRadius: 6,
          marginRight: 5,
          //Shadow props
          backgroundColor: Colors.WHITE_COLOR,
          shadowColor: Colors.SHADOW_COLOR,
          shadowOffset: {width: 5, height: 4},
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 4,
        }}
        draggingStyle={{
          opacity: 0.2,
        }}
        dragReleasedStyle={{
          opacity: 0.2,
        }}
        hoverDraggingStyle={{
          borderColor: Colors.NOT_ARRIVED_TOP_COLOR,
          borderWidth: 2,
        }}
        onDragStart={() => {
          console.log('Not Arrived drag started');
          setIsNotArrivedListDragStarted(true);
        }}
        onDragEnd={() => {
          console.log('Not Arrived drag ended');
          setIsNotArrivedListDragStarted(true);
        }}
        dragPayload={item}
        longPressDelay={150}
        key={index}
        animateSnapback={false}>
        <TouchableOpacity
          onPress={() => onPressDragItem(QueueStatus.notArrived, item, index)}>
          <View
            style={{
              backgroundColor: Colors.NOT_ARRIVED_TOP_COLOR,
              height: 4,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <GetImage
              style={{
                marginTop: 5,
                marginLeft: 10,
                width: isTablet===true?40: 30,
                height:  isTablet===true?40:30,
                borderRadius: isTablet===true?40/2:30 / 2,
                borderWidth: 1,
                borderColor: Colors.SECONDARY_COLOR,
              }}
              fullName={(
                (item?.customer_id?.firstName || 'N/A') +
                ' ' +
                (item.customer_id?.lastName || '')
              ).trim()}
              url={item?.customer_id?.image}
            />

            <View>
              <Text
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet===true?20:14,
                  color: Colors.DARK_BROWN_COLOR,
                  width: 100,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                #{item.token}
              </Text>
              <Text
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet===true?16:10,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  width: 100,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                {Utilities.getUtcToLocalWithFormat(item.dateFrom, 'hh:mm A')}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginLeft: 9,
              marginRight: 9,
              marginTop: 11,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: isTablet===true?16:12,
              color: Colors.PRIMARY_TEXT_COLOR,
              textAlign: 'left',
              width:100,
            }}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {(
              (item.customer_id?.firstName || 'N/A') +
              ' ' +
              (item.customer_id?.lastName || '')
            ).trim()}
          </Text>
        </TouchableOpacity>
      </DraxView>
    );
  };

  const ArrivedDragUIComponent = ({item, index}) => {
    console.log('Render ArrivedDragUIComponent');

    return (
      <DraxView
        style={{
          flex: 1,
          width:isTablet?'90%':'100%',
          height: isTablet===true?120:100,
          borderRadius: 6,
          marginRight: 5,
          //Shadow props
          backgroundColor: Colors.WHITE_COLOR,
          shadowColor: Colors.SHADOW_COLOR,
          shadowOffset: {width: 5, height: 4},
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 4,
        }}
        draggingStyle={{
          opacity: 0.2,
        }}
        dragReleasedStyle={{
          opacity: 0.2,
        }}
        hoverDraggingStyle={{
          borderColor: Colors.ARRIVED_TOP_COLOR,
          borderWidth: 2,
        }}
        onDragStart={() => {
          console.log('Arrived drag started');
          setIsArrivedListDragStarted(true);
        }}
        onDragEnd={() => {
          console.log('Arrived drag ended');
          setIsArrivedListDragStarted(true);
        }}
        dragPayload={item}
        longPressDelay={150}
        key={index}
        animateSnapback={false}>
        <TouchableOpacity
          onPress={() => onPressDragItem(QueueStatus.arrived, item, index)}>
          <View
            style={{
              backgroundColor: Colors.ARRIVED_TOP_COLOR,
              height: 4,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <GetImage
              style={{
                marginTop: 5,
                marginLeft: 10,
                width: isTablet===true?40:30,
                height: isTablet===true?40:30,
                borderRadius:isTablet===true?40/2: 30 / 2,
                borderWidth: 1,
                borderColor: Colors.SECONDARY_COLOR,
                textAlign: 'left',
              }}
              fullName={(
                (item?.customer_id?.firstName || 'N/A') +
                ' ' +
                (item.customer_id?.lastName || '')
              ).trim()}
              url={item?.customer_id?.image}
            />
            <View>
              <Text
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet===true?20:14,
                  color: Colors.DARK_BROWN_COLOR,
                  width: 100,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                #{item.token}
              </Text>
              <Text
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet===true?16:10,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  width: 100,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                {Utilities.getUtcToLocalWithFormat(item.dateFrom, 'hh:mm A')}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginLeft: 9,
              marginRight: 9,
              marginTop: 11,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: isTablet===true?16:12,
              color: Colors.PRIMARY_TEXT_COLOR,
              textAlign: 'left',
              width:100,
            }}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {(
              (item.customer_id?.firstName || 'N/A') +
              ' ' +
              (item.customer_id?.lastName || '')
            ).trim()}
          </Text>

          <Text
            style={{
              marginLeft: 9,
              marginRight: 9,
              marginTop: 11,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?16:12,
              color: Colors.PRIMARY_TEXT_COLOR,
            }}
            numberOfLines={1}>
            {t(Translations.ETS)}:{' '}
            {Utilities.getUtcToLocalWithFormat(item.estimatedTime, 'hh:mm A')}
          </Text>
        </TouchableOpacity>
      </DraxView>
    );
  };

  const ServingDragUIComponent = ({item, index}) => {
    return (
      
      <DraxView
        style={{
          flex:1,
          width: isTablet?responsiveWidth(20):responsiveWidth(40),
          maxHeight: isTablet?'100%':availabilityInfo?.sessionInfo?.enableEndButton === true && Globals.HIDE_FOR_PRACTO === false?'80%':'55%',
          // marginBottom:
          //   availabilityInfo?.sessionInfo?.enableEndButton === true
          //     ? responsiveHeight(3)
          //     : responsiveHeight(3),
          borderRadius: 6,
          marginRight: 20,
          //Shadow props
          backgroundColor: Colors.WHITE_COLOR,
          shadowColor: Colors.SHADOW_COLOR,
          shadowOffset: {width: 5, height: 4},
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 4,
        }}
        draggingStyle={{
          opacity: 0.2,
        }}
        dragReleasedStyle={{
          opacity: 0.2,
        }}
        hoverDraggingStyle={{
          borderColor: Colors.SERVING_TOP_COLOR,
          borderWidth: 2,
        }}
        onDragStart={() => {
          console.log('Serving drag started');
          // Globals.HIDE_FOR_PRACTO === true? setIsServingListDragStarted(false):setIsServingListDragStarted(true);
          setIsServingListDragStarted(true);
        }}
        onDragEnd={() => {
          console.log('Serving drag ended');
          Globals.HIDE_FOR_PRACTO === true? setIsServingListDragStarted(false):setIsServingListDragStarted(true);
        }}
        dragPayload={item}
        longPressDelay={150}
        key={index}
        animateSnapback={false}>
        <TouchableOpacity
          onPress={() =>  onPressDragItem(QueueStatus.serving, item, index)}>
          <View
            style={{
              backgroundColor: Colors.SERVING_TOP_COLOR,
              height: 4,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <GetImage
              style={{
                marginTop: 5,
                marginLeft: 10,
                width: isTablet===true?40:30,
                height: isTablet===true?40:30,
                borderRadius: isTablet===true?40/2:30 / 2,
                borderWidth: 1,
                borderColor: Colors.SECONDARY_COLOR,
              }}
              fullName={(
                (item?.customer_id?.firstName || 'N/A') +
                ' ' +
                (item.customer_id?.lastName || '')
              ).trim()}
              url={item?.customer_id?.image}
            />

            <View style={{width: '75%'}}>
              <Text
                style={{
                  width: '70%',
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet===true?20:14,
                  color: Colors.DARK_BROWN_COLOR,
                  textAlign: 'center',
                }}
                numberOfLines={1}
                adjustsFontSizeToFit>
                #{item.token}
              </Text>
              <Text
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize:isTablet===true?16: 10,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  width: '70%',
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                {Utilities.getUtcToLocalWithFormat(item.dateFrom, 'hh:mm A')}
              </Text>
            </View>

            <TouchableOpacity
              disabled={
                item?.name?.toUpperCase() === 'directConsultation'.toUpperCase()
                  ? false
                  : true
              }
              onPress={() => servingCloseButtonAction(index)}>
              <Image
                style={{
                  opacity:
                    item?.name?.toUpperCase() ===
                    'directConsultation'.toUpperCase()
                      ? 1
                      : 0,
                  position: 'absolute',
                  right: 12,
                  top: 4,
                  width: 13,
                  height: 13,
                  resizeMode: 'contain',
                  tintColor: Colors.PRIMARY_TEXT_COLOR,
                }}
                source={Images.CLOSE_ICON}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginLeft: 9,
              marginRight: 9,
              marginTop: 11,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize:isTablet===true?16: 12,
              color: Colors.PRIMARY_TEXT_COLOR,
              textAlign: 'left',
              width:100
            }}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {(
              (item.customer_id?.firstName || 'N/A') +
              ' ' +
              (item.customer_id?.lastName || '')
            ).trim()}
          </Text>

          {availabilityInfo?.sessionInfo?.enableEndButton === true ? (
            <TimerViewComponent
              style={{
                marginLeft: 9,
                marginRight: 9,
                marginTop: 11,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: isTablet===true?16:12,
                color: Colors.PRIMARY_TEXT_COLOR,
                textAlign: 'left',
              }}
              item={item}
              availabilityInfo={availabilityInfo}
            />
          ) : null}
        </TouchableOpacity>
        {Globals.HIDE_FOR_PRACTO ===true?
        <View/>:
          availabilityInfo?.sessionInfo?.enableEndButton === true ? (
          <View
            style={{
              height: 1,
              backgroundColor: Colors.LINE_SEPARATOR_COLOR,
              marginTop: 10,
            }}
          />
        ) : null}

        {Globals.HIDE_FOR_PRACTO===true?
        <View/>:
          availabilityInfo?.sessionInfo?.enableEndButton === true ? (
          <TouchableOpacity
            onPress={() =>
              addNotesButtonAction(QueueStatus.serving, item, index)
            }
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'blue',
              paddingVertical: 12,
            }}>
            <Image
              style={{
                // marginTop: 20,
                width: 12,
                height: 12,
                resizeMode: 'contain',
                tintColor: Colors.TEXT_GREY_COLOR_9B,
              }}
              source={
                item?.notes?.trim().length === 0 && item?.images?.length === 0
                  ? Images.PLUS_ICON
                  : Images.EDIT_PERSONAL_INFO_IMAGE
              }
            />

            <Text
              style={{
                marginLeft: 9,
                marginRight: 9,
                // marginTop: 20,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 12,
                color: Colors.TEXT_GREY_COLOR_9B,
                textAlign: 'left',
              }}
              numberOfLines={1}>
              {item?.notes?.trim().length === 0 && item?.images?.length === 0
                ? t(Translations.ADD_NOTES)
                : t(Translations._EDIT_NOTES)}
            </Text>
          </TouchableOpacity>
        ) : null}
        {Globals.HIDE_FOR_PRACTO ===true?
        <View/>:
          availabilityInfo?.sessionInfo?.enableEndButton === true ? (
          <View
            style={{
              height: 1,
              backgroundColor: Colors.LINE_SEPARATOR_COLOR,
            }}
          />
        ) : null}
        {
          availabilityInfo?.sessionInfo?.enableEndButton === true ? (
          <TouchableOpacity
            onPress={() => moveToFulFilledButtonAction(index)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              //  backgroundColor: 'blue',
              paddingVertical:10,
            }}>
            <Text
              style={{
                marginLeft: 9,
                marginRight: 9,
                marginTop:isTablet===true?5:18,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: isTablet===true?16:12,
                color: Colors.PRIMARY_TEXT_COLOR,
                textAlign: 'center',
              }}
              numberOfLines={1}>
              {t(Translations.MOVE_TO_FULFILLED)}
            </Text>
          </TouchableOpacity>
        ) : null}
      </DraxView>
    );
  };

  const FulfilledDragUIComponent = ({item, index}) => {
    console.log('Render ArrivedDragUIComponent');

    return (
      <DraxView
        style={{
          flex: 1,
          width:isTablet?'90%':'100%',
          height:isTablet===true?95:80,
          borderRadius: 6,
          marginRight: 5,
          //Shadow props
          backgroundColor: Colors.WHITE_COLOR,
          shadowColor: Colors.SHADOW_COLOR,
          shadowOffset: {width: 5, height: 4},
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 4,
        }}
        draggingStyle={{
          opacity: 0.2,
        }}
        dragReleasedStyle={{
          opacity: 0.2,
        }}
        hoverDraggingStyle={{
          borderColor: Colors.FULFILLED_TOP_COLOR,
          borderWidth: 2,
        }}
        onDragStart={() => {
          console.log('Fulfilled drag started');
          setIsFulfilledListDragStarted(true);
        }}
        onDragEnd={() => {
          console.log('Fulfilled drag ended');
          setIsFulfilledListDragStarted(true);
        }}
        dragPayload={item}
        longPressDelay={150}
        key={index}
        animateSnapback={false}>
        <TouchableOpacity
          onPress={() => onPressDragItem(QueueStatus.fulfilled, item, index)}>
          <View
            style={{
              backgroundColor: Colors.FULFILLED_TOP_COLOR,
              height: 4,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <GetImage
              style={{
                marginTop: 5,
                marginLeft: 10,
                width:isTablet===true?40: 30,
                height:isTablet===true?40: 30,
                borderRadius:isTablet===true?40/2: 30 / 2,
                borderWidth: 1,
                borderColor: Colors.SECONDARY_COLOR,
              }}
              fullName={(
                (item?.customer_id?.firstName || 'N/A') +
                ' ' +
                (item.customer_id?.lastName || '')
              ).trim()}
              url={item?.customer_id?.image}
            />

            <View>
              <Text
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: isTablet===true?20:14,
                  color: Colors.DARK_BROWN_COLOR,
                  width: 100,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                #{item.token}
              </Text>
              <Text
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 5,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize:isTablet===true? 16:10,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  width: 100,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                {Utilities.getUtcToLocalWithFormat(
                  item?.servingCompleteDate || item?.dateFrom,
                  'hh:mm A',
                )}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginLeft: 9,
              marginRight: 9,
              marginTop: 11,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: isTablet===true?16:12,
              color: Colors.PRIMARY_TEXT_COLOR,
              textAlign: 'left',
              width:100
            }}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {(
              (item.customer_id?.firstName || 'N/A') +
              ' ' +
              (item.customer_id?.lastName || '')
            ).trim()}
          </Text>
        </TouchableOpacity>
      </DraxView>
    );
  };

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 15,
        }}
      />
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <LottieView
          style={{
            marginBottom: 55,
            width: isTablet===true?120:100,
            height: isTablet===true?120:100,
            alignSelf: 'center',
          }}
          source={Images.EMPTY_CHAIR_ANIMATION}
          autoPlay
          loop
        />
        <Text
          style={{
            marginTop: -65,
            textAlign: 'center',
            fontFamily: Fonts.Gibson_Regular,
            fontSize:isTablet===true?18:12,
            color: Colors.GREY_COLOR,
          }}>
          {t(Translations.NOTHING_HERE)}
        </Text>
      </View>
    );
  };
  const ServingListEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <View
          style={{
            marginTop: responsiveHeight(-1.3),
          }}>
          <LottieView
            style={{
              // marginBottom: 55,
              width: isTablet===true?120:100,
              height: isTablet===true?120:100,
              alignSelf: 'center',
            }}
            source={Images.EMPTY_CHAIR_ANIMATION}
            autoPlay
            loop
          />
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?18:12,
              color: Colors.GREY_COLOR,
              marginTop: responsiveHeight(-1.5),
            }}>
            {t(Translations.NOTHING_HERE)}
          </Text>
        </View>
      </View>
    );
  };
  var _allowDirectConsultation = true;
  if (Utilities.isUserIsAdmin() === true) {
    console.log(' user is admin ', Utilities.isUserIsAdmin());
    _allowDirectConsultation =
      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO
        ?.allowDirectConsultation === true
        ? true
        : false;
  } else {
    console.log('<><><>', Globals.USER_DETAILS);
    _allowDirectConsultation =
      Globals.USER_DETAILS?.allowDirectConsultation === true ? true : false;
  }
  // Final return
  return (
    <GestureHandlerRootView style={gestureRootViewStyle}>
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
        <StatusBar
          backgroundColor={Colors.BACKGROUND_COLOR}
          barStyle="dark-content"
        />
        <AlertConfirmPopup />
        <ConsultantFilterPopupComponent />
        <NotifyTimeExtensionPopup />
        <CustomerPrimaryPopup />
        <AddNotesPopup />
        
        {isTablet===true? <ManageQueueTabletHeader
          onConsultantSelection={handleConsultantSelection}
          from ={'MANAGE_QUEUE'}
        /> :
        <ManageQueueHeader
          availabilityInfo={availabilityInfo}
          morningSessionTime={morningSessionTime}
          eveningSessionTime={eveningSessionTime}
          sessionButtonAction={sessionButtonAction}
        />}

        {/* Center items */}
        <View style={{flex: 1, width: responsiveWidth(100)}}>
          <DraxProvider>
            <View style={{flex: 1, flexDirection: 'row'}}>
              {/* Arrived */}
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: Colors.SHADOW_COLOR,
                  borderRightWidth: 0.5,
                  borderRightColor: Colors.SHADOW_COLOR,
                  width: responsiveWidth(50),

                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                
                <View style={{flex: 1, flexDirection: 'column'}}>
                  {isTablet===true?null:
                    <TouchableOpacity
                    onPress={() =>
                      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO
                        ?.name
                        ? servingUserSelectionDropDownAction()
                        : null
                    }
                    activeOpacity={
                      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO
                        ?.name
                        ? 1
                        : 0.5
                    }
                    style={{
                      width: '100%',
                      height: Utilities.isUserIsConsultant() === false ? 40 : 0,
                      opacity: Utilities.isUserIsConsultant() === false ? 1 : 0,
                      backgroundColor: Colors.PRIMARY_COLOR,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.WHITE_COLOR,
                        textAlign: 'center',
                        marginRight: 30,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize:isTablet===true?18: 12,
                      }}
                      numberOfLines={1}>
                      {!isLoading
                        ? isConnected.isConnected === true
                          ? Globals.SHARED_VALUES
                              .MANAGE_Q_SELECTED_SERVING_USER_INFO?.name ||
                            t(Translations.SMALL_NO) +
                              ' ' +
                              Utilities.getSpecialistName().toLowerCase() +
                              ' ' +
                              t(Translations.SMALL_AVAILABLE)
                          : t(Translations.SMALL_NO) +
                            ' ' +
                            Utilities.getSpecialistName().toLowerCase() +
                            ' ' +
                            t(Translations.SMALL_AVAILABLE)
                        : null}
                    </Text>
               {Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO.availability==='ON A BREAK'?
               <Text style={{
                        color: Colors.WHITE_COLOR,
                        textAlign: 'center',
                        marginRight: 30,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize:isTablet===true?14: 12,
                      }}>{'('+t(Translations.ON_A_BREAK)+')'}
</Text>:null}
                    <Image
                      style={{
                        position: 'absolute',
                        right: 10,
                        width: isTablet===true?20:18,
                        height: isTablet===true?20:18,
                        tintColor: Colors.WHITE_COLOR,
                        resizeMode: 'contain',
                      }}
                      source={Images.DROP_DOWN_ICON}
                    />
                  </TouchableOpacity>}

                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        marginLeft: 20,
                        marginTop: 8,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:isTablet===true?23:16,
                        color: Colors.BLACK_COLOR,
                        textAlign: 'left',
                      }}>
                      {t(Translations.ARRIVED)}
                    </Text>
                    {Globals.HIDE_FOR_PRACTO===true?null:
                    <TouchableOpacity
                      disabled={arrivedList.length > 0 ? false : true}
                      onPress={() => arrivedAnnouncementAction()}>
                      <Image
                        style={{
                          opacity: arrivedList.length > 0 ? 1 : 0,
                          marginLeft: 20,
                          height: 24,
                          width: 24,
                          tintColor: Colors.PRIMARY_COLOR,
                          resizeMode: 'contain',
                        }}
                        source={Images.ANNOUNCEMENT_ICON}
                      />
                    </TouchableOpacity>}
                  </View>
                  {Utilities.isUserIsAdmin() ||
                  arrivedList.length > 0 ? null : (
                    <View
                      style={{backgroundColor: 'transparent', height: 40}}
                    />
                  )}
                  <DraxList
                    style={{
                      flex:
                        isNotArrivedListDragStarted === true ||
                        isServingListDragStarted === true
                          ? 0
                          : 1,
                      height:
                        isNotArrivedListDragStarted === true ||
                        isServingListDragStarted === true
                          ? '0%'
                          : '90%',
                      marginLeft: 16,
                      marginRight: 16,
                      marginTop: 12,
                      paddingBottom: 12,
                    }}
                    data={arrivedList}
                    renderItemContent={ArrivedDragUIComponent}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    scrollEnabled={true}
                    numColumns={isTablet?2:0}
                    viewPropsExtractor={() => ({animateSnapback: false})}
                    contentContainerStyle={{flexGrow: 1}}
                    ListEmptyComponent={ListEmptyComponent}
                  />

                  <DraxView
                    style={{
                      opacity:
                        isNotArrivedListDragStarted === true ||
                        isServingListDragStarted === true
                          ? 1
                          : 0,
                      flex: 1,
                      height:
                        isNotArrivedListDragStarted === true ||
                        isServingListDragStarted === true
                          ? '80%'
                          : '0%',
                      borderStyle: 'dotted',
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: Colors.PRIMARY_COLOR,
                      position: 'absolute',
                      top: 45,
                      bottom: 0,
                      left: 10,
                      right: 10,
                      backgroundColor: Colors.WHITE_COLOR,
                      justifyContent: 'center',
                    }}
                    onReceiveDragEnter={({dragged: {payload}}) => {
                      console.log(
                        `Entered to Arrived ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragExit={({dragged: {payload}}) => {
                      console.log(
                        `Exited from Arrived ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragDrop={({dragged: {payload}}) => {
                      console.log(`Received ${payload.customer_id.firstName}`);
                      resetAllDragStartedStates();

                      onReceivedDrop(QueueStatus.arrived, payload);
                    }}>
                    <TouchableOpacity
                      onPress={() => resetAllDragStartedStates()}
                      style={{position: 'absolute', top: 5, right: 5}}>
                      <Image
                        style={{
                          width: isTablet===true?16: 12,
                          height:  isTablet===true?16:12,
                          tintColor: Colors.GREY_COLOR,
                        }}
                        source={Images.CLOSE_ICON}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: Colors.PRIMARY_TEXT_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize:  isTablet===true?16:12,
                        textAlign: 'center',
                      }}>
                      {t(Translations.DRAG_AND_DROP_HERE)}
                    </Text>
                  </DraxView>
                </View>
              </View>

              {/* Serving */}
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: Colors.SHADOW_COLOR,
                  width: responsiveWidth(52),
                  // flexDirection: 'row',
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      width: '100%',
                      backgroundColor: Colors.PRIMARY_COLOR,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ManageQueueListTabScreen')
                      }
                      style={{marginLeft: 8, marginRight: 8}}>
                      <Image
                        style={{width: isTablet===true?30:26, height:isTablet===true?30: 26, resizeMode: 'contain'}}
                        source={Images.EYE_ICON}
                      />
                    </TouchableOpacity>

                    {Utilities.checkSelectedDateIsHoliday(currentDate)=== false &&
                    Utilities.isDisplayForBookingEnabled() &&
                    _allowDirectConsultation &&
                    Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO
                      .availability !== 'ON A BREAK' && 
                    availabilityInfo?.sessionInfo?.enableStatusChange ===
                      true &&
                      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO
                      .availability !== 'NOTAVAILABLE'
                      ? (
                      <TouchableOpacity
                        onPress={() => plusButtonAction()}
                        style={{marginLeft: 8, marginRight: 8}}>
                        <Image
                          style={{width: 20, height: 20, resizeMode: 'contain'}}
                          source={Images.PLUS_ICON}
                        />
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('NotificationListScreen')
                      }
                      style={{marginLeft: 8, marginRight: 8}}>
                      <LottieView
                        style={{width: isTablet===true?30:26, height:isTablet===true?30:26, alignSelf: 'center'}}
                        source={Images.WHITE_NOTIFICATION_ANIMATION}
                        autoPlay={
                          Globals.UN_READ_NOTIFICATION_COUNT > 0 ? true : false
                        }
                        loop={
                          Globals.UN_READ_NOTIFICATION_COUNT > 0 ? true : false
                        }
                      />
                    </TouchableOpacity>

        {/* session button for tablet version of Insta  */}
        {  isTablet===true?         
        <TouchableOpacity
          disabled={
            availabilityInfo?.sessionInfo?.enableStartButton === true
              ? false
              :availabilityInfo?.sessionInfo?.enableEndButton === true
              ? false
              : true
          }
          onPress={() =>sessionButtonAction()}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <Image
            style={{
              opacity:
              availabilityInfo?.sessionInfo?.enableStartButton === true
                  ? 1
                  :availabilityInfo?.sessionInfo?.enableEndButton ===
                    true
                  ? 1
                  : 0.5,
              width:20,
              height:20,
              tintColor:
                availabilityInfo?.sessionInfo?.enableStartButton === true
                  ? Colors.START_SESSION_COLOR
                  : availabilityInfo?.sessionInfo?.enableEndButton ===
                    true
                  ? Colors.WHITE_COLOR
                  : Colors.START_SESSION_COLOR,
            }}
            source={
              availabilityInfo?.sessionInfo?.enableStartButton === true
                ? Images.PLAY_ICON
                :availabilityInfo?.sessionInfo?.enableEndButton === true
                ? Images.STOP_ICON
                : Images.PLAY_ICON
            }
          />
          <Text
            style={{
              opacity:
                availabilityInfo?.sessionInfo?.enableStartButton === true
                  ? 1
                  :availabilityInfo?.sessionInfo?.enableEndButton ===
                    true
                  ? 1
                  : 0.5,
              marginLeft: 8,
              fontFamily: Fonts.Gibson_Regular,
              fontSize:19,
              color: Colors.WHITE_COLOR,
            }}>
            {availabilityInfo?.sessionInfo?.enableStartButton === true
              ? t(Translations.START_SESSION)
              :availabilityInfo?.sessionInfo?.enableEndButton === true
              ? t(Translations.STOP_SESSION)
              : t(Translations.SESSION_ENDED)}
          </Text>
        </TouchableOpacity>:null}
                  </View>

                  <Text
                    style={{
                      marginLeft: 20,
                      marginTop: 8,
                      fontFamily: Fonts.Gibson_SemiBold,
                      fontSize: isTablet===true?23:16,
                      color: Colors.BLACK_COLOR,
                      textAlign: 'left',
                    }}>
                    {t(Translations.SERVING)}
                  </Text>
{/* <View style={{flex:1,flexDirection:I18nManager.isRTL ?'row-reverse':'row',
}}> */} 
                { isTablet?
                <DraxList
                    style={{
                      flex: isArrivedListDragStarted === true ? 0 : 1,
                      marginLeft: 16,
                      marginRight: 16,
                      marginTop: 12,
                  }}
                    ref={draxlist}
                    refreshing={refreshing}
                    data={servingList}
                    renderItemContent={ServingDragUIComponent}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    scrollEnabled={true}
                    viewPropsExtractor={() => ({animateSnapback: false})}
                    numColumns={2}
                    contentContainerStyle={{flexGrow:1}}
                    ListEmptyComponent={ServingListEmptyComponent}
                  />
                 : <DraxList
                    style={{
                      flex: isArrivedListDragStarted === true ? 0 : 1,
                      marginLeft: 16,
                      marginRight: 16,
                      marginTop: 12,
                  }}
                    ref={draxlist}
                    refreshing={refreshing}
                    data={servingList}
                    initialScrollIndex={-1}
                    renderItemContent={ServingDragUIComponent}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    scrollEnabled={true}
                    viewPropsExtractor={() => ({animateSnapback: false})}
                    horizontal={true}
                    contentContainerStyle={{flexGrow:1}}
                    ListEmptyComponent={ServingListEmptyComponent}
                  />}
                  {/* </View> */}
                  <DraxView
                    style={{
                      opacity: isArrivedListDragStarted === true ? 1 : 0,
                      flex: 1,
                      height: isArrivedListDragStarted === true ? '75%' : '0%',
                      borderStyle: 'dotted',
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: Colors.PRIMARY_COLOR,
                      position: 'absolute',
                      top: 70,
                      bottom: 50,
                      left: 10,
                      right: 10,
                      backgroundColor: Colors.WHITE_COLOR,
                      justifyContent: 'center',
                    }}
                    onReceiveDragEnter={({dragged: {payload}}) => {
                      console.log(
                        `Entered to Serving ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragExit={({dragged: {payload}}) => {
                      console.log(
                        `Exited from Serving ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragDrop={({dragged: {payload}}) => {
                      console.log(`received ${payload.customer_id.firstName}`);
                      resetAllDragStartedStates();

                      onReceivedDrop(QueueStatus.serving, payload);
                    }}>
                    <TouchableOpacity
                      onPress={() => resetAllDragStartedStates()}
                      style={{position: 'absolute', top: 5, right: 5}}>
                      <Image
                        style={{
                          width: isTablet===true?16: 12,
                          height:  isTablet===true?16:12,
                          tintColor: Colors.GREY_COLOR,
                        }}
                        source={Images.CLOSE_ICON}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: Colors.PRIMARY_TEXT_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize:  isTablet===true?16:12,
                        textAlign: 'center',
                      }}>
                      {t(Translations.DRAG_AND_DROP_HERE)}
                    </Text>
                  </DraxView>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row',height: '45%'}}>
              {/* Not Arrived */}
              <View
                style={{
                  borderRightWidth: 0.5,
                  borderRightColor: Colors.SHADOW_COLOR,
                  width: responsiveWidth(50),

                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <Text
                    style={{
                      marginLeft: 20,
                      marginTop: 16,
                      fontFamily: Fonts.Gibson_SemiBold,
                      fontSize:isTablet===true?23: 16,
                      color: Colors.BLACK_COLOR,
                      textAlign: 'left',
                    }}>
                    {t(Translations.NOT_ARRIVED)}
                  </Text>

                  <DraxList
                    style={{
                      height: isArrivedListDragStarted === true ? '0%' : '95%',
                      marginLeft: 16,
                      marginRight: 16,
                      marginTop: 12,
                       paddingBottom: responsiveHeight(6.5),
                    }}
                    data={notArrivedList}
                    renderItemContent={NotArrivedDragUIComponent}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    scrollEnabled={true}
                    numColumns={isTablet?2:0}
                    viewPropsExtractor={() => ({animateSnapback: false})}
                    contentContainerStyle={{flexGrow: 1 ,}}
                    ListEmptyComponent={ListEmptyComponent}
                  />

                  <DraxView
                    style={{
                      opacity: isArrivedListDragStarted === true ? 1 : 0,
                      flex: 1,
                      height: isArrivedListDragStarted === true ? '80%' : '0%',
                      borderStyle: 'dotted',
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: Colors.PRIMARY_COLOR,
                      position: 'absolute',
                      top: 36,
                      left: 10,
                      right: 10,
                      backgroundColor: Colors.WHITE_COLOR,
                      justifyContent: 'center',
                    }}
                    onReceiveDragEnter={({dragged: {payload}}) => {
                      console.log(
                        `Entered to Not Arrived ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragExit={({dragged: {payload}}) => {
                      console.log(
                        `Exited from Not Arrived ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragDrop={({dragged: {payload}}) => {
                      console.log(`received ${payload.customer_id.firstName}`);
                      resetAllDragStartedStates();

                      onReceivedDrop(QueueStatus.notArrived, payload);
                    }}>
                    <TouchableOpacity
                      onPress={() => resetAllDragStartedStates()}
                      style={{position: 'absolute', top: 5, right: 5}}>
                      <Image
                        style={{
                          width: isTablet===true?16: 12,
                          height:  isTablet===true?16:12,
                          tintColor: Colors.GREY_COLOR,
                        }}
                        source={Images.CLOSE_ICON}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: Colors.PRIMARY_TEXT_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize:  isTablet===true?16:12,
                        textAlign: 'center',
                      }}>
                      {t(Translations.DRAG_AND_DROP_HERE)}
                    </Text>
                  </DraxView>
                </View>
              </View>
              {/* Fulfilled */}
              <View
                style={{
                  width: responsiveWidth(50),

                  flexDirection: 'row',
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <Text
                    style={{
                      marginLeft: 20,
                      marginTop: 16,
                      fontFamily: Fonts.Gibson_SemiBold,
                      fontSize: isTablet===true?23:16,
                      color: Colors.BLACK_COLOR,
                      textAlign: 'left',
                    }}>
                    {t(Translations.FULFILLED)}
                  </Text>
                  {fulfilledList.length > 0 ? (
                    <Text
                      style={{
                        marginLeft: 20,
                        marginTop: 8,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: 12,
                        color: Colors.PRIMARY_TEXT_COLOR,
                        textAlign: 'left',
                      }}>
                      {t(Translations.LAST_CUSTOMER)}
                    </Text>
                  ) : null}

                  <DraxList
                    style={{
                      height: isServingListDragStarted === true ? '0%' : '95%',
                      marginLeft: 16,
                      marginRight: 16,
                       marginTop: '4%',
      
                         paddingBottom:fulfilledList.length>0? responsiveHeight(4.5):0,
                  
                    }}
                    data={fulfilledList}
                    renderItemContent={FulfilledDragUIComponent}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    scrollEnabled={true}
                    numColumns={isTablet?2:0}
                    viewPropsExtractor={() => ({animateSnapback: false})}
                    contentContainerStyle={{flexGrow: 1,paddingBottom:responsiveHeight(4.5)}}
                    ListEmptyComponent={ListEmptyComponent}
                  />

                  <DraxView
                    style={{
                      opacity: isServingListDragStarted === true ? 1 : 0,
                      flex: 1,
                      height: isServingListDragStarted === true ? '80%' : '0%',
                      borderStyle: 'dotted',
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: Colors.PRIMARY_COLOR,
                      position: 'absolute',
                      top: 36,
                      left: 10,
                      right: 10,
                      backgroundColor: Colors.WHITE_COLOR,
                      justifyContent: 'center',
                    }}
                    onReceiveDragEnter={({dragged: {payload}}) => {
                      console.log(
                        `Entered to Fulfilled ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragExit={({dragged: {payload}}) => {
                      console.log(
                        `Exited from Fulfilled ${payload.customer_id.firstName}`,
                      );
                    }}
                    onReceiveDragDrop={({dragged: {payload}}) => {
                      console.log(`received ===>`, payload);
                      resetAllDragStartedStates();

                      onReceivedDrop(QueueStatus.fulfilled, payload);
                    }}>
                    <TouchableOpacity
                      onPress={() => resetAllDragStartedStates()}
                      style={{position: 'absolute', top: 5, right: 5}}>
                      <Image
                        style={{
                          width: 12,
                          height: 12,
                          tintColor: Colors.GREY_COLOR,
                        }}
                        source={Images.CLOSE_ICON}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: Colors.PRIMARY_TEXT_COLOR,
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: 12,
                        textAlign: 'center',
                      }}>
                      {t(Translations.DRAG_AND_DROP_HERE)}
                    </Text>
                  </DraxView>
                </View>
              </View>
            </View>
          </DraxProvider>
        </View>

        {/* BottomBar */}
        <View
          style={{
            borderTopColor: Colors.SHADOW_COLOR,
            justifyContent: 'center',
            borderTopWidth: 0.5,
            height: 81,
            // position: 'absolute',
            // left: 0,
            // right: 0,
            // bottom: 0,
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
            onPress={() => navigation.navigate('DashboardScreen')}
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
                width: isTablet===true?45:30,
                height: isTablet===true?45:30,
                alignSelf: 'center',
                tintColor: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
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
                width:isTablet===true?25: 16,
                height:isTablet===true?25: 16,
                alignSelf: 'center',
                tintColor: Colors.SECONDARY_COLOR,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                marginLeft: 8,
                marginRight: 8,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: isTablet===true?18:14,
                color: Colors.SECONDARY_COLOR,
                alignSelf: 'center',
              }}>
              {t(Translations.MANAGE_QUEUE)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
             onPress={() =>
  {
    if(Globals.HIDE_FOR_PRACTO === true){
   navigation.navigate( 'PractoReportTab')
    }else{
   navigation.navigate( 'ReportTabScreen')
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
                width:isTablet===true?25: 16,
                height: isTablet===true?25:16,
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
                fontSize: isTablet===true?18:14,
                color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                alignSelf: 'center',
              }}>
              {t(Translations.REPORTS)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default ManageQueueScreen;
