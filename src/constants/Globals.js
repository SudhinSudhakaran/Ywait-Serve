import {
  AlertConfirmPopupSource,
  BUILD_SOURCE,
  GraphFilterOption,
} from '../helpers/enums/Enums';
// App business ids
// ywait Serve id : 6082c2c53d655c1d25e0b58d
// spotless id : 62fb976b38ed6141331cd259
// aster id: 6322dec6600e070d1ea35162
// al_noor id : 636ca3af5fee3c66781c200a
// first_response Serve id : 63c15cbbbf847c70f0b31306
// ywait_Services_Serve id : 6136211c8a1fec162da9084e
// OMH serve id : 603df1e23b1f0e6c90227492

// Application ids
// ywait serve : 'com.stackontechnologies.ywaitadmin',
// Aster : 'com.ywait.aster.serve'
// Al noor : 'com.ywait.alNoor.serve'
// first_response Serve :'com.ywait.firstResponse.serve'
// ywait_Services_Serve:'com.ywait.services.serve'
export default {
  IS_STANDALONE_BUILD: true,
  HIDE_FOR_PRACTO: false, // need to true when alnoor and insta build
  STANDALONE_BUSINESS_ID: '6082c2c53d655c1d25e0b58d',
  BUSINESS_ID: '6082c2c53d655c1d25e0b58d',
  APPLICATION_ID: 'com.stackontechnologies.ywaitadmin',
  IS_CUSTOM_SPLASH_IMAGE: false, // Custom Splash image
  CUSTOM_BUILD_SOURCE: BUILD_SOURCE.YWAIT,

  //
  IS_AUTHORIZED: false,
  TOKEN: null,
  TEMP_USER_DETAILS: {}, //user temp verification info if not authorized.
  USER_DETAILS: {},
  FILE_PREVIEW_DATA: {},
  BUSINESS_DETAILS: {},
  QUEUE_DETAILS: {},
  APPOINMENT_LIST: {},
  AVAILABLE_BUTTON: {},
  BOOKING_DETAILS: {},
  SELECTED_SERVICE_TITLE: [],
  UN_READ_NOTIFICATION_COUNT: 0,
  APNS_TOKEN: '',
  PUSH_NOTIFICATION_TOKEN: '',
  PUSH_DEVICE_ID: '',
  NOTIFICATION_DATA: {data: {}},
  TOKEN_UUID: '',
  IS_TOKEN_UUID_CREATED: '',
  IS_NOTIFICATION_NAVIGATION_NEEDED: false,
  SELECTED_LANGUAGE: 'en',
  IS_LANGUAGE_CHANGED: 'false',
  DEVICE_LANGUAGE: 'en',
  IS_FROM_FILE_PREVIEW_SCREEN: false,
  SELECTED_DATE: new Date(),
  SELECTED_DATE_FROM: '',

  //Used for Storage
  STORAGE_KEYS: {
    IS_AUTH: 'isAuthorized',
    TOKEN: 'token',
    BASE_URL: 'baseUrl',
    BASE_URL_TYPE: 'baseUrlType',
    BUSINESS_DETAILS: 'businessDetails',
    QUEUE_DETAILS: 'queueDetails',
    BOOKING_DETAILS: 'bookingdetails',
    APPOINMENT_LIST: 'appoinmentlist',
    AVAILABLE_BUTTON: 'availablebutton',
    USER_DETAILS: 'userDetails',
    PUSH_TOKEN_UUID: 'pushTokenUuid',
    IS_PUSH_TOKEN_UUID_CREATED: 'isPushTokenCreated',
    NOTIFICATION_COUNT: 'notificationCount',
    SELECTED_LANGUAGE: 'language',
    SELECTED_SERVICE_TITLE: 'title',
    IS_LANGUAGE_CHANGED: 'is_language_changed',
  },

  //Shared data
  SHARED_VALUES: {
    COUNTRY_POPUP_TITLE: 'Select Country',
    POPUP_ACTIVE_SOURCE_INDEX: -1,
    DELETE_ATTACHMENT_SELECTED_INDEX: -1,
    SELECTED_STATE_INDEX: -1,
    IS_FOR_CITY: false, //Used in update profile screen popup
    DYNAMIC_SELECTION_ITEMS: [],
    ALERT_CONFIRM_POPUP_SOURCE: AlertConfirmPopupSource.none,
    ALERT_CONFIRM_MESSAGE: 'Are you sure?',
    WILL_BE_APPLICABLE_UPON_CANCELLATION_ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT:
      'will be applicable upon cancellation. Are you sure to cancel this appointment?',
    A_FEE_OF: 'A fee of',
    CONFIRM_CANCEL: 'Confirm Cancel',
    DATE_PICKER_DATE: new Date(),
    DATE_PICKER_MAX_DATE: '',
    SELECTED_NOTES_INFO: {}, // to add / edit notes
    //Confirmation,success,failure pop ups
    SELECTED_CUSTOMER_INFO: {},
    SELECTED_DATE_FROM: '',
    FAILURE_ERROR_MESSAGE: '',
    SELECTED_PAYMENT_INFO: {},
    //ManageQueue
    MANAGE_Q_SELECTED_SERVING_USER_INFO: {},
    MOVE_TO_FULFILLED_PAYLOAD_INFO: {},
    SELECTED_DRAG_ITEM_INFO: {},
    //Success
    SUCCESS_MESSAGE: 'Success',
    //Vitals
    SELECTED_APPOINTMENT_INFO: {},
    //Graph filters
    GRAPH_FILTER_POPUP_SOURCE: '',
    SELECTED_GRAPH_FILTER_OPTION: GraphFilterOption.daily,
    //PIN auth settings
    SELECTED_PIN_AUTH_SETTINGS: false,
    //Availability status change
    CURRENT_USER_AVAILABILITY_STATUS: '',
    CURRENT_USER_AVAILABILITY_INFO: {},
    SELECTED_BREAK_FROM_TIME: new Date(),
    SELECTED_BREAK_TO_TIME: new Date(),
    IS_BREAK_FROM_TIME_SELECTED: true,
    //Consultants for non consultants
    IS_FILER_TODAY_AVAILABLE_CONSULTANT: false,
    PROFILE_PREVIOUS_DATA: {},
    VITALS_PREVIOUS_DATA: {},
  },
};
