import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import Translations from '../constants/Translations';
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      [Translations.LOGIN]: 'Login',
      [Translations.RESTART_APP]:
        'You need to restart the application to change the language',
      [Translations.CONFIRM]: 'Confirm',
      [Translations.CANCEL]: 'Cancel',
      [Translations.PLEASE_CONFIRM]: 'Please confirm',

      // language switch screen
      [Translations.CHANGE_LANGUAGE]: 'Change language',
      [Translations.ARABIC]: 'Arabic',
      [Translations.ENGLISH]: 'English',
      // profile screen
      [Translations.PROFILE]: 'Profile',
      [Translations.CHANGE_PHOTO]: 'Change Photo',
      [Translations.UPDATE_EMAIL]: 'Update Email',
      [Translations.CHANGE_PASSWORD]: 'Change Password',
      [Translations.LOG_OUT]: 'Log Out',
      [Translations.EDIT_PERSONAL_INFO]: 'Edit personal info',
      [Translations.PERSONAL_INFO]: 'Personal Info',
      [Translations.ARE_YOU_SURE_YOU_WANT_LOG_OUT]:
        'Are you sure you want to logout?',
      // dashboard
      [Translations.VIEW_ALL]: 'View All',
      [Translations.SEARCH]: 'Search',
      [Translations.WELCOME_TO]: 'Welcome to',
      [Translations.HI]: 'Hi',
      [Translations.MY]: 'My',
      [Translations.VISITS]: 'Visits',
      [Translations.AVAILABLE_TO]: ' Available to',
      [Translations.CONSULT]: 'Consult',
      [Translations.SCAN_QR]: 'SCAN QR',
      [Translations.FIND_YOUR]: 'Find your',
      [Translations.NO_DEPARTMENT_AVAILABLE]: 'No department available',
      [Translations.NO_SERVICE_AVAILABLE]: ' No service available',
      [Translations.ENABLE_CAMERA_PERMISSION]:
        'Please enable camera permission from device settings',
      [Translations.FAILED]: 'Failed!',
      [Translations.YOU_ARE_NOT_AUTHORIZED_TO_USE_THIS_APP]:
        'You are not authorized to use this app',
      [Translations.EXIT_CONFIRMATION]:
        'Are you sure you want to exit from app',
      [Translations.YES]: 'YES',
      [Translations.PREVIOUS]: 'Previous',
      [Translations.UPCOMING]: 'Upcoming',
      [Translations.NO_SERVICE_FOUND]: 'No Service Found',
      [Translations.NO_DEPARTMENT_FOUND]: 'No Department Found',
      [Translations.FIND_YOUR_SERVICE_NOW]: 'Find your service now',
      [Translations.NO_CONSULTANT_FOUND]: 'No consultant found',
      [Translations.SUCCESSFULLY_SUBMITTED_YOUR_REVIEW]:
        'Successfully submitted your review',
      [Translations.NO_REVIEWS]: 'No reviews',
      [Translations.NO_STORY_FOUND]: 'No story found',
      [Translations.NO_CONSULTANT_NO_AVAILABLE]: 'Consultant not available',
      [Translations.GUEST]: 'Guest',
      [Translations.CHOOSE]: 'Choose',
      [Translations.SERVICES]: 'Services',
      [Translations.NEW]: 'New',
      [Translations.STORIES]: 'Stories',
      [Translations.HEALTH_TIPS]: 'Health Tips',
      [Translations.KNOW_MORE]: 'Know More',
      //Bottom Tab
      [Translations.FAVORITES]: 'Favorites',
      [Translations.NEW_BOOKING]: 'New Booking',
      // login register screen
      [Translations.REGISTER]: 'Register',
      [Translations.CONTINUE_WITH_GOOGLE]: 'Continue with Google',
      [Translations.CONTINUE_WITH_FACEBOOK]: 'Continue with Facebook',
      [Translations.CONTINUE_WITH_APPLE]: 'Continue with Apple',
      [Translations.CONTINUE_AS_A_GUEST]: 'Continue as a guest',
      // Specialist listing screen
      [Translations.FOUND]: 'Found',
      [Translations.Y_WAIT]: 'Why wait?',
      [Translations.FIND_YOUR_SPECIALIST_NOW]: 'Find your specialists now',
      [Translations.NO_CHOICE]: 'No choice',
      [Translations.SMALL_NO]:'No',

      //Department selection popup
      [Translations.NO_RESULT_FOUND]: 'No result found!',
      [Translations.DEPARTMENT]: 'Department',
      [Translations.FIND_YOUR_DEPARTMENT_NOW]: 'Find your department now',

      // Register screen
      [Translations.SENT]: 'Send',
      [Translations.INVALID_EMAIL_ADDRESS]: 'Please enter valid email address',
      [Translations.FORGOT_PASSWORD_DESCRIPTION]:
        'Enter your email to receive the confirmation link',
      [Translations.EMAIL_ADDRESS]: 'Email Address',
      [Translations.PASSWORD]: 'Password',
      [Translations.INVALID_PASSWORD]: 'Please enter a password',
      [Translations.FORGOT_PASSWORD]: 'Forgot Password?',
      [Translations.CONTINUE]: 'Continue',
      // BookingQueue screen
      [Translations.RESCHEDULE]: 'Reschedule',
      [Translations.BOOKING]: 'Booking',
      [Translations.WHICH]: 'Which',
      [Translations.DAY]: 'day',
      [Translations.YOU_WOULD_LIKE_TO_SELECT]: 'you would like to select ?',
      [Translations.WHAT]: 'What',
      [Translations.TIME]: 'time',
      [Translations.YOU_WOULD_LIKE_TO_CHOOSE]: 'you would like to choose ?',
      // booking slot list
      [Translations.JOIN_QUEUE]: 'Join Queue',
      [Translations.QUEUE]: 'Queue',
      [Translations.BOOKING_ARE_FULL_YOU_CAN_SWITCH_TO_THE]:
        'Bookings are full you can switch to the',
      BOOKING_IS_DISABLED_YOU_CAN_SWITCH_TO_THE:
        'Bookings is disabled you can switch to the',
      [Translations.CONSULTATION_NOT_AVAILABLE_FOR_THE_SELECTED_DAY]:
        'not available for selected day',

      //Queue slot
      [Translations.CHOOSE_A]: 'Choose a',
      [Translations.QUEUE_IS_FULL]: 'Queue is full',
      [Translations.QUEUE_IS_NOT_AVAILABLE]: 'No queue available',
      [Translations.FROM_THE_BELOW_TIME_INTERVALS_FOR_CONSULTATION]:
        'from the below time intervals for consultation.',
      [Translations.YOU_ARE_IN]: 'You are in',
      [Translations.MODE]: 'Mode',
      [Translations.THE_BEST_SUGGESTED_TIME]: 'The best suggested time',
      [Translations.FOR_THE_CONSULTATION_IS]: 'for consultation is',
      [Translations.OR]: 'OR',

      //Booking confirmation popup
      [Translations.CONFIRM_BOOKING]: 'Confirm Booking',
      [Translations.YES_IAM_SURE]: 'Yes I’m Sure',
      [Translations.PRICE_DETAILS]: 'Price details',
      [Translations.CONFIRM_AND_PAY_NOW]: 'Confirm & Pay Now',
      [Translations.CONFIRM_QUEUE]: 'Confirm Queue',
      [Translations.AT]: 'at',
      [Translations.NO]: 'NO',
      [Translations.OK]: 'OK',
      // Booking Success popup
      [Translations.DONE]: 'Done',
      [Translations.YOUR_APPOINTMENT_IS_RESCHEDULED]:
        'Your appointment is rescheduled',
      [Translations.YOUR_APPOINTMENT_IS_CONFIRMED]:
        'Your appointment is confirmed.',
      [Translations.VIEW_DETAILS]: 'View Details',
      [Translations.FAILED_TITLE]: 'Failed',

      //QUEUE SUCCESS POPUP
      [Translations.YOUR_QUEUE_IS_CONFIRMED]: ' Your queue is confirmed',
      [Translations.PLEASE_SCAN_YOUR_QR_CODE]: 'Please scan your Qr Code',
      [Translations.MAP_PERMISSION]:
        'Please enable map permission from settings',
      [Translations.INVALID_QR_CODE]: 'Invalid Qr code',

      // Business selection screen
      [Translations.NO_BUSINESS_IS_FOUND]: ' No Business is found',
      [Translations.CHOOSE_A_BUSINESS]: 'Choose a business',

      //Todays Banner component
      [Translations.YOU_WILL_BE_SERVED_BY]: 'You will be served by',
      [Translations.WITHIN]: 'within',
      [Translations.ETS]: 'ETS',
      [Translations.YOU_ARE_BEING_SERVED_BY]: 'You are being served by',
      [Translations.THANK_YOU]: 'Thank you',
      [Translations.YOU_WERE_SERVED_SUCCESSFULLY_BY]:
        'You were served successfully by',
      [Translations.LEAVE_A_RATING]: ' Leave a Rating',
      [Translations.YOUR_REVIEW_HAS_BEEN]: ' Your review has been',
      [Translations.SUBMITTED]: 'Submitted',
      [Translations.OKAY]: 'Okay',
      [Translations.OH_SORRY]: ' Oh Sorry!',
      [Translations.YOUR_APPOINTMENT_WAS]: 'Your appointment was',
      [Translations.NOT_SUCCESSFUL]: 'Not Successful',
      [Translations.TRY_AGAIN]: 'Try Again',
      //Gender selection screen
      [Translations.CHOOSE_GENDER]: 'Choose Gender',
      //OTP validation screen
      [Translations.SUCCESS]: 'Success!',
      [Translations.PLEASE_ENTER_VALID_OTP_TO_SENT]:
        'Please enter valid OTP to proceed.',
      [Translations.VERIFICATION]: 'Verification',
      [Translations.A_FOUR_DIGIT_VERIFICATION_CODE_IS_SENT_TO_YOUR_MOBILE_NUMBER]:
        'A four digit verification code is send to your mobile number',
      [Translations.SEC]: 'sec',
      [Translations.VERIFY]: 'Verify',
      [Translations.RESENT]: 'Resent',
      //phone login screen
      [Translations.PHONE_LOGIN_DESCRIPTION]:
        'Please enter your mobile number to register and proceed',
      [Translations.MOBILE_NUMBER]: 'Mobile Number',
      [Translations.INVALID_PHONE_NUMBER]: 'Please enter valid phone number',
      // Register update screen
      [Translations.TELL_US_MORE]: 'Tell us more to serve you better',

      // Previous appointment list
      [Translations.NO_PREVIOUS_DATA_AVAILABLE]: ' No Previous data available!',
      [Translations.NO_SHOW]: 'NOSHOW',
      //upcoming appointment list
      [Translations.NO_APPOINTMENTS_RIGHT_NOW]: 'No Appointments Right Now !',

      //My visits
      [Translations.MY_VISITS]: 'My Visits',

      // notification list

      [Translations.MARK_ALL_AS_READ]: 'Mark all as read',
      [Translations.NOTIFICATION]: 'Notifications',
      [Translations.YOU_HAVE_NO_NOTIFICATIONS]: 'You have no notifications',
      [Translations.HEY_NOTHING_HERE]: 'Hey! Nothing here',
      //Password reset screen
      [Translations.RESET_PASSWORD]: 'Reset Password',
      [Translations.RESET_PASSWORD_DESCRIPTION]:
        'Please enter a new password\nand confirm it',
      [Translations.CONFIRM_PASSWORD]: 'Confirm Password',
      [Translations.RESET_NOW]: 'Reset Now',
      [Translations.ACCOUNT_NOT_VERIFIED_PLEASE_CONTACT_ADMINISTER]:
        'Account not verified.Please contact administrator',
      [Translations.PASSWORD_DO_NOT_MATCH]: 'Passwords do not match',
      [Translations.PASSWORD_MIN_LENGTH_VALIDATION_TEXT]:
        'Please enter a password of minimum 8 characters',
      //add review popup
      [Translations.ADD_REVIEW]: 'Add review',
      [Translations.OUT_OF]: 'out of',
      [Translations.HOW_IS_THE_EXPERIENCE_WITH]: `How's the experience with`,
      [Translations.REVIEW_AND_RATING]: 'Review & Rating',

      //Previous appointment details
      [Translations.SCHEDULE_AN_APPOINTMENT]: 'Schedule an Appointment',
      [Translations.WRITE_A_REVIEW]: 'Write a review',
      [Translations.CALL]: 'Call',
      [Translations.YOUR_COMMENT]: 'Your comment',
      [Translations.REVIEW_ADDED_ON]: 'Review added on',
      [Translations.YOUR_RATING]: 'Your Rating',
      [Translations.RATING_AND_REVIEW]: 'Rating and Review',
      [Translations.NO_NOTES_ADDED]: 'No Notes added',
      [Translations.PLEASE_SELECT_SERVED_DATE]: 'Please select served date',
      [Translations.NOTES_CAN_NOT_EMPTY]: 'Notes can not be empty',
      [Translations.ALERT]: 'Alert',
      [Translations.NOTES]: 'Notes',
      [Translations.REFUND]: 'Refund status',
      [Translations.WAS_SERVED_BY]: 'was served by',
      [Translations.SERVED_BY]: 'Served by',
      [Translations.ADDED_BY]: 'Added by',
      [Translations.WAS_WITH]: 'was with',
      [Translations.YOUR]: 'Your',
      [Translations.CONSULTATION]: 'consultation',
      [Translations.APPOINTMENT_DETAILS]: 'Appointment Details',
      [Translations.PHONE_NUMBER_IS_EMPTY]: 'Phone number is empty',
      [Translations.REFUND_FOR]: 'Refund for ',
      [Translations.HAS_BEEN_SUCCESSFULLY_COMPLETED]:
        ' has been successfully completed.',
      [Translations.REFUND_AVAILABLE]: ' refund available',
      [Translations.HAS_BEEN_INITIATED_SUCCESSFULLY_REFUND_WILL_BE_PROCESSED_IN]:
        ' has been initiated successfully. Refund will be processed in 2 to 3 business days',
      [Translations.STAYS_CONNECTED]: ' stays cancelled',
      [Translations.STAYS_CANCELLED_ON_ABSENCE_OF_CUSTOMER]:
        ' stays cancelled on absence of customer',

      //Change Email screen
      [Translations.EMAIL_UPDATE]: 'Email Update',
      [Translations.EMAIL_UPDATE_DESCRIPTION]:
        'Enter your new email to \nreceive a password to login again',
      [Translations.EMAIL_RESET_MESSAGE]:
        'An email has been sent to your email address.\nFollow the instructions to update email.',

      //Change password
      [Translations.CHANGE_NOW]: 'Change Now',
      [Translations.CHANGE_PASSWORD_DESCRIPTION]:
        'Please enter your old, new passwords\nand confirm it.',
      [Translations.OLD_PASSWORD]: 'Old Password',
      [Translations.NEW_PASSWORD]: 'New Password',
      [Translations.CONFIRM_NEW_PASSWORD]: 'Confirm New Password',

      //Profile update

      [Translations.PROFILE_UPDATE]: 'Profile Update',
      [Translations.PROFILE_UPDATED_SUCCESS]: 'Profile updated successfully',
      [Translations.UPDATE]: 'Update',
      [Translations.PLEASE_SELECT_STATE_FIRST]: 'Please select state first.',
      [Translations.PLEASE_SELECT_COUNTRY_FIRST]:
        'Please select country first.',

      //profile image update
      [Translations.PROFILE_IMAGE_UPDATED_SUCCESS]:
        'Profile image updated successfully',
      //ScanQR Popup
      [Translations.YOUR_ATTENDANCE_IS_MARKED]: 'Your attendance is marked.',
      [Translations.CHOOSE_SERVICE]: 'Choose Service',

      //ReportLate popup
      [Translations.REPORT_LATE]: 'Report Late',
      [Translations.MINS]: 'mins',
      [Translations.HOUR]: 'hour',
      [Translations.MINUTES]: 'minutes',

      // Ticket screen
      [Translations.SHARE_TICKET]: 'Share Ticket',
      [Translations.WE_LOOK_FORWARD_TO_SERVE_YOU_SOON]:
        ' We look forward to serve you soon!',
      [Translations.DATE_AND_TIME]: 'Date and time',
      [Translations.CONSULTATION_WITH]: 'Consultation with',
      [Translations.SHARE]: 'Share',

      // Reminder Ppopup
      [Translations.YOU_HAVE_AN_APPOINTMENT_WITH]:
        'You have an appointment with ',
      [Translations.ON]: ' on ',
      [Translations.IN]: ' in',
      [Translations.APPOINTMENT_WITH]: 'Appointment with ',
      [Translations.FROM_Y_WAIT]: ' from Ywait',
      [Translations.REMINDER]: 'Reminder',
      [Translations.SET_REMINDER_ON]: 'Set reminder on',
      [Translations.REMINDER_ME_BEFORE]: 'Remind me before',
      // reminder success
      [Translations.NO_REMINDER]: 'No reminder',
      [Translations.SET_REMINDER]: 'Set Reminder',
      [Translations.REMINDER_SET]: 'Reminder Set',
      [Translations.YOU_WILL_BE_REMINDED_WITH]: 'You will be reminded with',
      [Translations.IS_THE_POSITION_OF_YOUR_TOKEN]:
        'is the position of your token',

      //Upcoming detail popup

      [Translations.PAY_NOW]: 'Pay Now',
      [Translations.TOKEN_NUMBER]: 'Token Number',
      [Translations.DATE]: 'Date',
      [Translations.YOUR_QUEUE_POSITION]: 'Your Queue Position',

      // VitalsDetails popup
      [Translations.VITALS_DETAILS]: ' Vital Details',
      [Translations.LOW]: 'Low',
      [Translations.HIGH]: 'High',
      [Translations.NORMAL]: 'Normal',
      //Shared
      //Appointment cancel popup

      [Translations.ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT]:
        'Are you sure to cancel this appointment?',
      [Translations.WILL_BE_APPLICABLE_UPON_CANCELLATION_ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT]:
        'will be applicable upon cancellation. Are you sure to cancel this appointment?',
      [Translations.A_FEE_OF]: 'A fee of',
      [Translations.CONFIRM_CANCEL]: 'Confirm Cancel',
      //Appointment cancel success popup
      [Translations.YOUR_APPOINTMENT_IS_CANCELED]:
        ' Your appointment is cancelled',
      // AppointmentRescheduleConfirmPopup
      [Translations.ARE_YOU_SURE_TO_RESCHEDULE_THIS_APPOINTMENT]:
        ' Are you sure to reschedule this appointment?',

      [Translations.WILL_BE_APPLICABLE_UPON_RESCHEDULE_ARE_YOU_SURE_TO_RESCHEDULE_THIS_APPOINTMENT]:
        'will be applicable upon reschedule. Are you sure to reschedule this appointment?',
      [Translations.PERCENTAGE]: 'percentage',
      [Translations.CONFIRM_RESCHEDULE]: 'Confirm Reschedule',

      //country code popup

      //File upload
      [Translations.SELECT_AN_OPTION]: 'Select an option',
      [Translations.FILES]: 'Files',
      [Translations.GALLERY]: 'Gallery',
      [Translations.CAMERA]: 'Camera',
      [Translations.REMOVE_ATTACHMENT_CONFIRM_MESSAGE]:
        'Are you sure you want to remove this attachment?',
      [Translations.UN_SAVED_CHANGES_WILL_BE_LOST]:
        'Are you sure you want to go back?\nany unsaved changes will be lost',

      //Add review popup
      [Translations.ARE_YOU_SURE]: 'Are you sure?',
      [Translations.IF_ANY_REMINDER_ADDED_FOR_THIS_APPOINTMENT_WILL_BE_REMOVED_DO_YOU_WANT_TO_CONTINUE]:
        'If any reminder added for this appointment will be removed.\nDo you want to continue?',
      [Translations.PLEASE_SELECT_RATING]: 'Please select rating',
      [Translations.PLEASE_ENTER_REVIEW]: 'Please enter review',

      // new translations for serve

      // AvailabilityStatusChangePopup
      [Translations.NOT_AVAILABLE]: 'Not Available',
      [Translations.ON_A_BREAK]: 'On a Break',
      [Translations.AVAILABLE]: 'Available',
      [Translations.STATUS]: 'Status',
      [Translations.TODAY]: 'Today',
      [Translations.FILTER]: 'Filter',
      [Translations.YESTERDAY]: 'Yesterday',
      [Translations.DASH_BOARD]: 'Dashboard',
      [Translations.APPOINTMENT]: 'Appointment',
      [Translations.NEW_CUSTOMERS]: 'New customers',
      [Translations.WALK_IN]: 'Walk In',
      [Translations.CANCELLED]: 'Cancelled',
      [Translations.DASH_BOARD_NO_SHOW]: 'No Show',
      [Translations.AVERAGE_WAITING]: 'Average Waiting',
      [Translations.AVERAGE_SERVING]: 'Average Serving',
      [Translations.WEEKLY]: 'Weekly',
      [Translations.DAILY]: 'Daily',
      [Translations.AVERAGE]: 'Average',
      [Translations.ACTUAL]: 'Actual',
      [Translations.AVERAGE_BOOKING]: 'Average Booking',
      [Translations.COUNT]: 'Count',
      [Translations.DEPARTMENTS]: 'Departments',
      [Translations.LAST_7_DAYS]: 'Last 7 days',
      [Translations.LAST_30_DAYS]: 'Last 30 days',
      [Translations.NO_DEPARTMENT_VISIT]: 'Department visit',

      //BottomBar
      [Translations.MANAGE_QUEUE]: 'Manage Queue',
      [Translations.REPORTS]: 'Reports',
      [Translations.PLEASE_ADD_VITALS]: 'Please add vitals',
      [Translations.BILL_NOT_PAID]: 'Customer bill is not paid',

      //NewBookingCustomerListScreen
      [Translations.CUSTOMER_PROFILE_IS_INCOMPLETE_PLEASE_UPDATE_AND_CONTINUE]:
        'Customer profile is incomplete, please update and continue',
      [Translations.LAST_VISITED]: 'Last Visited',
      [Translations.NO_VISIT]: 'No visit',
      [Translations.SELECT_CUSTOMER]: 'Select Customer',

      [Translations.NO_CHOICE_CAPITAL]: 'NO CHOICE',
      //AllServingUserList
      [Translations._CHOOSE]: 'Choose',

      [Translations.CHOOSE_THE_BREAK_TIME]: 'Choose the break time',
      [Translations.FROM]: 'From',
      [Translations.TO]: 'To',
      [Translations.IS_WITH]: 'is with',
      [Translations.PREVIOUS_VISITS]: ' Previous Visits',
      [Translations.ADD_VISITS]: 'Add Visits',
      [Translations.EDIT_VITALS]: 'Edit Vitals',
      [Translations.ADD_VITALS]: 'Add Vitals',
      [Translations.PAY_REFUND]: 'Pay Refund',
      [Translations.ADD_NOTE]: 'Add note',
      [Translations.EDIT_NOTE]: 'Edit note',
      [Translations.DELETE_NOTE]: 'Delete note',
      [Translations.CONSULTATION_DATE]: ' Consultation date',
      [Translations.ADD_ATTACHMENT]: 'Add Attachment',

      // Report tab screen
      [Translations.CALENDAR]: 'Calendar',
      [Translations.HISTORY]: 'History',
      [Translations.CUSTOMER]: 'Customer',
      [Translations.BOOKED]: 'Booked',
      [Translations.ALL]: 'All',
      [Translations.ADD_APPOINTMENT]: 'Add Appointment',
      [Translations.ADD_QUEUE]: 'Add Queue',

      [Translations.TOMORROW]: 'Tomorrow',
      [Translations.HEY]: 'Hey',
      [Translations.YOU_DONT_HAVE_ANY_CONSULTATION_FOR_THE_DAY]: `You don't have any consultation for the day`,
      [Translations.NO_INTERNET]: 'No internet connection!',

      [Translations.YOU_HAVE_NO_VISITORS]: 'You have no visitors',
      [Translations.STARTED_SERVING_AT]: 'Started serving at',
      [Translations.IS_SCHEDULED_AT]: 'is scheduled at',
      [Translations.PRESENTS_IS_MARKED_AT]: 'presence is marked at',
      [Translations.CUSTOMER_DETAILS]: 'Customer Details',
      [Translations.CUSTOMER_ID]: 'CustomerID',

      // Manage Queue Screen
      [Translations.STOP_SESSION]: 'Stop session',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_START_A_NEW_SESSION]:
        'Are you sure you want to start a new session?',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_END_THE_NEW_SESSION]:
        'Are you sure you want to end the session?',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_CANCEL_THIS_APPOINTMENT]:
        'Are you sure you want to cancel this appointment?',
      [Translations.ARE_YOU_SURE_WANT_TO_MOVE_THIS_USER_TO_FULFILLED]:
        'Are you sure you want to move this user to fulfilled?',
      [Translations.PLEASE_START_SESSION_FIRST]: 'Please start session first.',
      [Translations.FOR_SERVING_YOUR_CUSTOMER]: 'For serving your customer',
      [Translations.PLEASE_START_YOUR_SESSION]: 'Please start your session ',
      [Translations.SHOULD_START_THE_SESSION_TO_SERVE_CUSTOMER]:
        'should start the session to serve customer',
      [Translations.NO_CONSULTATION]: 'No consultation',
      [Translations.ONLY_FROM_ARRIVED_LIST_IS_ACCEPTED]:
        'Only from arrived list is accepted.',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_MOVE_THIS_USER_TO_FULFILLED]:
        'Are you sure you want to move this user to fulfilled?',
      [Translations.ONLY_FROM_SERVING_LIST_IS_ACCEPTED]:
        'Only from serving list is accepted.',

      [Translations.DRAG_AND_DROP_HERE]: 'Drag and drop here',
      [Translations.MORE]: 'More',
      [Translations.LAST_CUSTOMER]: 'Last customer',
      [Translations.FULFILLED]: ' Fulfilled',
      [Translations.NOT_ARRIVED]: 'Not Arrived',
      [Translations.NOTHING_HERE]: 'Nothing here..',
      [Translations.TOKEN_NOT_FOUND]: 'Authorization token not found!.',
      [Translations.NOT_AUTH_TO_USE_APP]:
        'You are not authorized to login to the app.',
      [Translations.PIN_AUTH]: 'Pin authentication',
      [Translations.ADD_NOTES]: 'Add Notes',
      [Translations._EDIT_NOTES]: 'Edit Notes',

      [Translations.ARRIVED]: 'Arrived',
      [Translations.SERVING]: 'Serving',
      [Translations.MOVE_TO_FULFILLED]: 'Move to Fulfilled',
      [Translations.SESSION_ENDED]: 'Session ended',

      // Customer info screen
      [Translations.TOKEN]: 'Token',
      [Translations.LAST_VISIT]: 'Last Visit',
      [Translations.CLOSE_CAPITAL]: 'CLOSE',
      [Translations.NEXT_VISIT]: 'Next Visit',
      //Mark as paid
      [Translations.REFERENCE_NUMBER_IS_REQUIRED]:
        'Reference number is required',
      [Translations.ENTER_REFERENCE_NUMBER]: 'Enter reference number',
      [Translations.PAYMENT_MARKED_SUCCESSFULLY]:
        'Payment marked successfully!',
      [Translations.ADD_PAYMENT_DETAILS]: 'Add payment details',
      [Translations.SELECT_PAYMENT]: 'Select Payment',
      [Translations.PAYMENT_PERMISSION_DISABLED_TEXT]: `You don't have permission to collect the payment from the customer. `,
      [Translations.PLEASE_CONTACT_YOUR_ADMINISTRATOR]:
        ' Please contact your administrator',
      [Translations.BY_CARD]: 'By card',
      [Translations.BY_CASH]: 'By cash',
      [Translations.MARK_AS_PAID]: 'Mark as paid',
      [Translations.NO_CONSULTANTS]: '  No Consultants',
      [Translations.NO_CONSULTANTS_FOUND_YET]: 'No Consultants found yet',
      [Translations.CONSULTANTS]: 'Consultants',
      [Translations.ARE_YOU_SURE_WANT_TO_CONFIRM]:
        'Are you sure you want to confirm',
      [Translations.REFUND_PAYMENT]: 'refund payment?',
      [Translations.SEND]: 'Send',

      // schedule next visit screen
      [Translations.SCHEDULE_NEXT_VISIT]: 'Schedule next visit',
      [Translations.SELECT_NEXT_VISIT_DATE_USER_WILL_BE_REMIND_BEFORE_3_DAYS_BEFORE_1_DAY_AND_VISIT_DAY_MORNING]:
        'Select next visit date, user will be remind before 3 days, before 1 day,and visit day morning.',

      [Translations.SUBMIT]: 'Submit',
      //ADD NOTE POPUP SCREEN
      [Translations.DETAILS]: 'Details',
      [Translations.SERVING_TIME]: 'Serving time',

      //Manage queue list tab  screen
      [Translations.SERVED]: 'Served',
      // NotArrivedListTabScreen

      [Translations.BOOKING_ID]: 'BookingID',
      [Translations.QUEUE_ID]: 'QueueID',
      [Translations.APPOINTMENT_AT]: 'Appointment at',
      [Translations.ARRIVED_AT]: 'Arrived at',
      [Translations.SERVING_STARTED_AT]: 'Serving started at',
      [Translations.SERVED_AT]: 'Served at',
      [Translations.START_SESSION]: 'Start session',
      [Translations.NOTIFICATION_SENT_SUCCESSFULLY]:
        'Notification sent successfully!',
      [Translations.SELECT_AN_OPTION_FROM_LIST_TO_NOTIFY_EXTENDED_SERVING_TIME_ARRIVED_VISITORS_WILL_BE_NOTIFIED]:
        'Select an option from list to notify extended serving time. Arrived visitors will be notified.',
      [Translations.CREATE_CUSTOMER]: 'Create Customer',
      [Translations.CREATE]: 'Create',
      // validations
      [Translations.SELECT]: 'Select',
      [Translations.SELECT_CODE]: 'Select code',
      [Translations.DIGITS_NOT_ALLOWED_FOR]: 'Digits not allowed for',
      [Translations.THIS_FIELD]: 'this field',
      [Translations.IS_REQUIRED]: 'is required',
      [Translations.PLEASE_ENTER_VALID_EMAIL_ADDRESS]:
        'Please enter valid email address',
      [Translations.MINIMUM]: 'Minimum',
      [Translations.CHARACTERS_REQUIRED]: 'characters required',
      [Translations.ONLY]: 'Only',
      [Translations.PLEASE_ENTER_A_VALID]: 'Please enter a valid',
      [Translations.CONFIRM_PIN]: 'Confirm PIN',

      [Translations.CONFIRM_PIN_DESCRIPTION]: 'Confirm your New PIN',

      [Translations.BACK]: 'Back',
      [Translations.PIN_DONT_MATCH]: 'PIN do not match',
      //PIN Verify
      [Translations.ENTER_PIN]: 'Enter PIN',
      [Translations.PIN_VERIFY_DESCRIPTION]:
        'Enter your PIN number\nto use the Ywait',

      [Translations.FORGOT_PIN]: 'Forgot PIN',
      [Translations.INVALID_PIN]: 'Please enter valid PIN to proceed.',
      //New PIN
      [Translations.NEW_PIN]: 'New PIN',
      [Translations.NEW_PIN_DESCRIPTION]: 'Enter your New PIN',
      [Translations.NEXT]: 'Next',
      [Translations.SKIP]: 'Skip',
      [Translations.SELECTED_DATE_IS_A_HOLIDAY]: 'Selected day is a holiday',

      [Translations.FORGOT_PASSWORD_TITLE]: 'Forgot Password',
      //
      [Translations.SELECTED_DATE_IS_A_HOLIDAY]: 'Selected day is a holiday',
      [Translations.NO_VISITS_FOUND]: 'No visits found',
      [Translations.STAYS_CANCELLED]: 'stays cancelled',
      [Translations.REFUND_STATUS]: 'Refund status',
      [Translations.IS_COMPLETED]: 'is completed',
      [Translations.ENABLE_PERMISSION]: 'Enable Permission',
      [Translations.OPEN_SETTINGS]: 'Open Settings',
      [Translations.CAMERA_PERMISSION]: `"Aster Serve" Would Like to Access the Camera `,
      [Translations.NO_VISIT]: 'No Visit',
      [Translations.SELECT_TIME]: 'Select a time',
      [Translations.SPECIALIST]: 'Specialist',
      [Translations.SMALL_AVAILABLE]: 'available',
      [Translations.SMALL_NO]: 'No',
      [Translations.SAVE]: 'Save',
      [Translations.VITALS_SAVED_SUCCESS]: 'Vitals saved successfully',
      [Translations.WILL_BE_APPLICABLE_UPON_CANCELLATION_ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT]:
        'will be applicable upon cancellation. Are you sure to cancel this appointment?',
      [Translations.A_FEE_OF]: 'A fee of',
      [Translations.CONFIRM_CANCEL]: 'Confirm Cancel',
      [Translations.UPDATE_PROFILE]: 'Update profile',
      [Translations.PROFILE_CHANGE_ALERT_MESSAGE]:
        'Are you sure you want to leave without updating your profile?',
      [Translations.DISCARD]: 'Discard',
      [Translations.CUSTOMER_CREATION_ALERT_MESSAGE]:
        'You have made changes. Do you want to discard or save?',
      [Translations.REVIEW_CHANGES]: 'Review changes',
      [Translations.VITAL_CHANGE_ALERT_MESSAGE]:
        'You are made changes.Do you want to discard or save ?',
      [Translations.ADD_VITAL_CHANGE_ALERT_MESSAGE]:
        'Are you sure you want to go back without adding vitals ?',
      [Translations.BOOKING_NOT_AVAILABLE_SWITCH_TO_QUEUE]:
        'Booking not available switch to',

      [Translations.OLD_PASSWORD_IS_REQUIRED]: 'Please enter old password',
      [Translations.NEW_PASSWORD_IS_REQUIRED]: 'Please enter new password',
      [Translations.CONFIRM_PASSWORD_IS_REQUIRED]:
        'Please enter confirm password',
      [Translations.PIN_AUTHENTICATION]: 'Pin Authentication',
      [Translations.NO_BOOKING_AVAILABLE]: 'No bookings available',
      [Translations.NO_QUEUE_AVAILABLE]: 'No queue available',
    },
  },
  ar: {
    translation: {
      [Translations.NO_QUEUE_AVAILABLE]: 'لا توجد قائمة انتظار متاحة',
      [Translations.NO_BOOKING_AVAILABLE]: 'لا حجوزات متاحة',
      [Translations.NO_INTERNET]: 'لا يوجد اتصال بالإنترنت!',
      [Translations.LOGIN]: 'تسجيل الدخول',
      [Translations.RESTART_APP]: 'تحتاج إلى إعادة تشغيل التطبيقلتغيير اللغة.',
      [Translations.CONFIRM]: 'يتأكد',
      [Translations.CANCEL]: 'يلغي',
      [Translations.PLEASE_CONFIRM]: 'يرجى تأكيد',

      // language switch screen
      [Translations.CHANGE_LANGUAGE]: 'تغيير اللغة',
      [Translations.ARABIC]: 'عربي',
      [Translations.ENGLISH]: 'إنجليزي',
      // profile screen
      [Translations.PROFILE]: 'الملف الشخصي',
      [Translations.CHANGE_PHOTO]: 'غير الصوره',
      [Translations.UPDATE_EMAIL]: 'تحديث البريد الإلكتروني',
      [Translations.CHANGE_PASSWORD]: 'غير كلمة السر',
      [Translations.LOG_OUT]: 'تسجيل خروج.',
      [Translations.EDIT_PERSONAL_INFO]: 'تحرير المعلومات الشخصية',
      [Translations.PERSONAL_INFO]: 'معلومات شخصية',
      [Translations.ARE_YOU_SURE_YOU_WANT_LOG_OUT]:
        'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      // dashboard
      [Translations.VIEW_ALL]: 'مشاهدة الكل',
      [Translations.SEARCH]: 'يبحث',
      [Translations.WELCOME_TO]: 'مرحبا بك في',
      [Translations.HI]: 'أهلاً',
      [Translations.MY]: 'لي',
      [Translations.VISITS]: 'الزيارات',
      [Translations.AVAILABLE_TO]: 'متاحة لل',
      [Translations.CONSULT]: 'شاور',
      [Translations.SCAN_QR]: 'مسح QR',
      [Translations.FIND_YOUR]: 'تجد الخاص بك',
      [Translations.NO_DEPARTMENT_AVAILABLE]: 'لا يوجد قسم متاح',
      [Translations.NO_SERVICE_AVAILABLE]: 'لا توجد خدمة متاحة',
      [Translations.ENABLE_CAMERA_PERMISSION]:
        'يرجى تمكين إذن الكاميرا من إعدادات الجهاز',
      [Translations.FAILED]: 'باءت بالفشل!',
      [Translations.YOU_ARE_NOT_AUTHORIZED_TO_USE_THIS_APP]:
        'غير مصرح لك باستخدام هذا التطبيق',
      [Translations.EXIT_CONFIRMATION]:
        'هل أنت متأكد أنك تريد الخروج من التطبيق؟',
      [Translations.YES]: 'نعم',
      [Translations.PREVIOUS]: 'سابق',
      [Translations.UPCOMING]: 'القادمة',
      [Translations.NO_SERVICE_FOUND]: 'لا توجد خدمة',
      [Translations.NO_DEPARTMENT_FOUND]: 'لم يتم العثور على قسم',
      [Translations.FIND_YOUR_SERVICE_NOW]: 'ابحث عن خدمتك الآن',
      [Translations.NO_CONSULTANT_FOUND]: 'لم يتم العثور على استشاري',
      [Translations.SUCCESSFULLY_SUBMITTED_YOUR_REVIEW]: 'قدم بنجاح رأيك',
      [Translations.NO_REVIEWS]: 'لم يتم تقديم تعليقات',
      [Translations.NO_STORY_FOUND]: 'لم يتم العثور على قصة',
      [Translations.NO_CONSULTANT_NO_AVAILABLE]: 'استشاري غير متوفر',
      [Translations.GUEST]: 'زائر',
      [Translations.CHOOSE]: 'يختار',
      [Translations.SERVICES]: 'خدمات',
      [Translations.NEW]: 'جديد',
      [Translations.STORIES]: 'القصص',
      [Translations.HEALTH_TIPS]: 'نصائح صحية',
      [Translations.KNOW_MORE]: 'تعرف أكثر',
      //Bottom Tab
      [Translations.FAVORITES]: 'المفضلة',
      [Translations.NEW_BOOKING]: 'حجز جديد',
      // login register screen
      [Translations.REGISTER]: 'يسجل',
      [Translations.CONTINUE_WITH_GOOGLE]: 'تواصل مع جوجل',
      [Translations.CONTINUE_WITH_FACEBOOK]: 'تواصل مع الفيسبوك',
      [Translations.CONTINUE_WITH_APPLE]: 'تواصل مع أبل',
      [Translations.CONTINUE_AS_A_GUEST]: 'تواصل كضيف',
      // Specialist listing screen
      [Translations.FOUND]: 'وجد',
      [Translations.Y_WAIT]: 'لماذا الانتظار؟',
      [Translations.FIND_YOUR_SPECIALIST_NOW]: 'ابحث عن المتخصصين الآن',
      [Translations.NO_CHOICE]: 'لا خيار',
      [Translations.SMALL_NO]:'لا',

      //Department selection popup
      [Translations.NO_RESULT_FOUND]: 'لم يتم العثور على نتائج!',
      [Translations.DEPARTMENT]: 'قسم',
      [Translations.FIND_YOUR_DEPARTMENT_NOW]: 'ابحث عن قسمك الآن',

      // Register screen
      [Translations.SENT]: 'إرسال',
      [Translations.INVALID_EMAIL_ADDRESS]:
        'الرجاء إدخال عنوان بريد إلكتروني صالح',
      [Translations.FORGOT_PASSWORD_DESCRIPTION]:
        'أدخل بريدك الإلكتروني  n لتلقي ارتباط التأكيد',
      [Translations.EMAIL_ADDRESS]: 'عنوان البريد الالكترونى',

      [Translations.PASSWORD]: 'كلمة المرور',
      [Translations.INVALID_PASSWORD]: 'الرجاء إدخال كلمة المرور',
      [Translations.FORGOT_PASSWORD]: 'هل نسيت كلمة السر؟',
      [Translations.CONTINUE]: 'يكمل',

      [Translations.RESCHEDULE]: 'إعادة الجدولة',
      [Translations.BOOKING]: 'الحجز',
      [Translations.WHICH]: 'أيّ',
      [Translations.DAY]: 'يوم',
      [Translations.YOU_WOULD_LIKE_TO_SELECT]: 'هل تود أن تختار؟',
      [Translations.WHAT]: 'ماذا او ما',
      [Translations.TIME]: 'زمن',
      [Translations.YOU_WOULD_LIKE_TO_CHOOSE]: 'هل تود أن تختار؟',
      // booking slot list
      [Translations.JOIN_QUEUE]: 'الانضمام إلى قائمة الانتظار',
      [Translations.QUEUE]: 'طابور.',
      [Translations.BOOKING_ARE_FULL_YOU_CAN_SWITCH_TO_THE]:
        'الحجوزات ممتلئة يمكنك التبديل إلى',
      BOOKING_IS_DISABLED_YOU_CAN_SWITCH_TO_THE:
        'الحجوزات معطلة يمكنك التبديل إلى',
      [Translations.CONSULTATION_NOT_AVAILABLE_FOR_THE_SELECTED_DAY]:
        'غير متوفر لليوم المحدد',

      //Queue slot
      [Translations.CHOOSE_A]: 'اختر أ',
      [Translations.QUEUE_IS_FULL]: 'قائمة الانتظار ممتلئة',
      [Translations.QUEUE_IS_NOT_AVAILABLE]: 'لا توجد قائمة انتظار متاحة',
      [Translations.FROM_THE_BELOW_TIME_INTERVALS_FOR_CONSULTATION]:
        'من الفترات الزمنية أدناه للتشاور.',
      [Translations.YOU_ARE_IN]: 'أنت في',
      [Translations.MODE]: 'الوضع',
      [Translations.THE_BEST_SUGGESTED_TIME]: 'أفضل وقت مقترح',
      [Translations.FOR_THE_CONSULTATION_IS]: 'للتشاور',
      [Translations.OR]: 'أو',

      //Booking confirmation popup
      [Translations.CONFIRM_BOOKING]: 'تأكيد الحجز',
      [Translations.YES_IAM_SURE]: 'نعم أنا متأكد',
      [Translations.PRICE_DETAILS]: 'تفاصيل السعر',
      [Translations.CONFIRM_AND_PAY_NOW]: 'التأكيد والدفع الآن',
      [Translations.CONFIRM_QUEUE]: 'تأكيد قائمة الانتظار',
      [Translations.AT]: 'في',
      [Translations.NO]: 'رقم',

      [Translations.OK]: 'نعم',
      // Booking Success popup
      [Translations.DONE]: 'فعله',
      [Translations.YOUR_APPOINTMENT_IS_RESCHEDULED]: 'تم إعادة جدولة موعدك.',
      [Translations.YOUR_APPOINTMENT_IS_CONFIRMED]: 'تم تأكيد موعدك.',
      [Translations.VIEW_DETAILS]: 'عرض التفاصيل',
      [Translations.FAILED_TITLE]: 'باءت بالفشل',
      //QUEUE SUCCESS POPUP
      [Translations.YOUR_QUEUE_IS_CONFIRMED]:
        'تم تأكيد قائمة الانتظار الخاصة بك',
      [Translations.PLEASE_SCAN_YOUR_QR_CODE]:
        'يرجى مسح رمز الاستجابة السريعة الخاص بك',
      [Translations.MAP_PERMISSION]: 'الرجاء تمكين إذن الخريطة من الإعدادات',
      [Translations.INVALID_QR_CODE]: 'رمز ريال قطري غير صحيح',

      // Business selection screen
      [Translations.NO_BUSINESS_IS_FOUND]: 'لم يتم العثور على أعمال',
      [Translations.CHOOSE_A_BUSINESS]: 'اختر شركة',

      //Todays Banner component
      [Translations.YOU_WILL_BE_SERVED_BY]: 'سوف يخدمك',
      [Translations.WITHIN]: 'داخل',
      [Translations.ETS]: 'إي تي إس',
      [Translations.YOU_ARE_BEING_SERVED_BY]: 'يتم خدمتك من قبل',
      [Translations.THANK_YOU]: 'شكرًا لك',
      [Translations.YOU_WERE_SERVED_SUCCESSFULLY_BY]:
        'لقد تم خدمتك بنجاح من قبل',
      [Translations.LEAVE_A_RATING]: 'Leave a Rating',
      [Translations.YOUR_REVIEW_HAS_BEEN]: 'كنت مراجعة كان',
      [Translations.SUBMITTED]: 'مُقَدَّم',
      [Translations.OKAY]: 'تمام',
      [Translations.OH_SORRY]: 'أه آسف!',
      [Translations.YOUR_APPOINTMENT_WAS]: 'كان موعدك',
      [Translations.NOT_SUCCESSFUL]: 'غير ناجح',
      [Translations.TRY_AGAIN]: 'حاول ثانية',
      //Gender selection screen
      [Translations.CHOOSE_GENDER]: 'اختر الجنس',
      //OTP validation screen
      [Translations.SUCCESS]: 'النجاح!',
      [Translations.PLEASE_ENTER_VALID_OTP_TO_SENT]:
        'الرجاء إدخال OTP صالح للمتابعة.',
      [Translations.VERIFICATION]: 'تَحَقّق',
      [Translations.A_FOUR_DIGIT_VERIFICATION_CODE_IS_SENT_TO_YOUR_MOBILE_NUMBER]:
        'يتم إرسال رمز التحقق المكون من أربعة أرقام إلى رقم هاتفك المحمول',
      [Translations.SEC]: 'ثانية',
      [Translations.VERIFY]: 'يؤكد',
      [Translations.RESENT]: 'مستاء',
      //phone login screen
      [Translations.PHONE_LOGIN_DESCRIPTION]:
        'الرجاء إدخال رقم هاتفك المحمول للتسجيل والمتابعة',
      [Translations.MOBILE_NUMBER]: 'رقم الهاتف المحمول',
      [Translations.INVALID_PHONE_NUMBER]: 'الرجاء إدخال رقم هاتف صحيح',
      // Register update screen
      [Translations.TELL_US_MORE]: 'أخبرنا بالمزيد لخدمتك بشكل أفضل',

      // Previous appointment list
      [Translations.NO_PREVIOUS_DATA_AVAILABLE]: 'لا توجد بيانات سابقة متاحة!',
      [Translations.NO_SHOW]: 'الآن',
      //upcoming appointment list
      [Translations.NO_APPOINTMENTS_RIGHT_NOW]: 'لا توجد مواعيد الآن!',

      //My visits
      [Translations.MY_VISITS]: 'زياراتي',

      // notification list

      [Translations.MARK_ALL_AS_READ]: 'اشر عليها بانها قرات',
      [Translations.NOTIFICATION]: 'إشعارات',
      [Translations.YOU_HAVE_NO_NOTIFICATIONS]: 'ليس لديك إخطارات',
      [Translations.HEY_NOTHING_HERE]: 'يا! لا شيء هنا',
      //Password reset screen
      [Translations.RESET_PASSWORD]: 'إعادة تعيين كلمة المرور',
      [Translations.RESET_PASSWORD_DESCRIPTION]:
        'الرجاء إدخال كلمة مرور جديدة وتأكيدها.',
      [Translations.CONFIRM_PASSWORD]: 'تأكيد كلمة المرور',
      [Translations.RESET_NOW]: 'إعادة التعيين الآن',
      [Translations.ACCOUNT_NOT_VERIFIED_PLEASE_CONTACT_ADMINISTER]:
        'لم يتم التحقق من الحساب. يرجى الاتصال بالمسؤول',
      [Translations.PASSWORD_DO_NOT_MATCH]: 'كلمة المرور غير مطابقة',
      [Translations.PASSWORD_MIN_LENGTH_VALIDATION_TEXT]:
        'الرجاء إدخال كلمة مرور لا تقل عن 8 أحرف',
      //add review popup
      [Translations.ADD_REVIEW]: 'إضافة مراجعة',
      [Translations.OUT_OF]: 'بعيدا عن المكان',
      [Translations.HOW_IS_THE_EXPERIENCE_WITH]: `كيف هي التجربة مع`,
      [Translations.REVIEW_AND_RATING]: 'مراجعة وتقييم',

      //Previous appointment details
      [Translations.SCHEDULE_AN_APPOINTMENT]: 'ترتيب موعد',
      [Translations.WRITE_A_REVIEW]: 'أكتب مراجعة',
      [Translations.CALL]: 'مكالمة',
      [Translations.YOUR_COMMENT]: 'تعليقك',
      [Translations.REVIEW_ADDED_ON]: 'تمت إضافة المراجعة في',
      [Translations.YOUR_RATING]: 'تقييمك',
      [Translations.RATING_AND_REVIEW]: 'التقييم والمراجعة',
      [Translations.NO_NOTES_ADDED]: 'لا توجد ملاحظات مضافة',
      [Translations.PLEASE_SELECT_SERVED_DATE]: 'يرجى تحديد تاريخ الخدمة',
      [Translations.NOTES_CAN_NOT_EMPTY]: 'لا يمكن أن تكون الملاحظات فارغة',
      [Translations.ALERT]: 'انذار',
      [Translations.NOTES]: 'ملحوظات',
      [Translations.REFUND]: 'حالة رد الأموال',
      [Translations.WAS_SERVED_BY]: 'كان يخدم من قبل',
      [Translations.SERVED_BY]: 'قدم بواسطة',
      [Translations.ADDED_BY]: 'أضيفت من قبل',
      [Translations.WAS_WITH]: 'كان مع',
      [Translations.YOUR]: 'لك',
      [Translations.CONSULTATION]: 'التشاور',
      [Translations.APPOINTMENT_DETAILS]: 'تفاصيل الموعد',
      [Translations.PHONE_NUMBER_IS_EMPTY]: 'رقم الهاتف فارغ',
      [Translations.REFUND_FOR]: 'برد ل ',
      [Translations.HAS_BEEN_SUCCESSFULLY_COMPLETED]: 'تم الانتهاء بنجاح.',
      [Translations.REFUND_AVAILABLE]: 'استرداد متاح',
      [Translations.HAS_BEEN_INITIATED_SUCCESSFULLY_REFUND_WILL_BE_PROCESSED_IN]:
        'بدأ بنجاح. ستتم معالجة رد الأموال في غضون 2 إلى 3 أيام عمل ',
      [Translations.STAYS_CONNECTED]: 'يبقى ملغيا. ',
      [Translations.STAYS_CANCELLED_ON_ABSENCE_OF_CUSTOMER]:
        'يبقى ملغيا في حالة عدم وجود العميل. ',

      //Change Email screen
      [Translations.EMAIL_UPDATE]: 'تحديث البريد الإلكتروني',
      [Translations.EMAIL_UPDATE_DESCRIPTION]:
        'أدخل بريدك الإلكتروني الجديد  n لتلقي كلمة مرور لتسجيل الدخول مرة أخرى.',
      [Translations.EMAIL_RESET_MESSAGE]:
        'تم إرسال بريد إلكتروني إلى عنوان بريدك الإلكتروني.  n اتبع الإرشادات لتحديث البريد الإلكتروني.',

      //Change password
      [Translations.CHANGE_NOW]: 'تغيير الآن',
      [Translations.CHANGE_PASSWORD_DESCRIPTION]:
        'الرجاء إدخال كلمات المرور القديمة والجديدة  n وتأكيدها.',
      [Translations.OLD_PASSWORD]: 'كلمة المرور القديمة',
      [Translations.NEW_PASSWORD]: 'كلمة السر الجديدة',
      [Translations.CONFIRM_NEW_PASSWORD]: 'تأكيد كلمة المرور الجديدة',

      //Profile update

      [Translations.PROFILE_UPDATE]: 'تحديث الملف الشخصي',
      [Translations.PROFILE_UPDATED_SUCCESS]: 'تم تحديث الملف الشخصي بنجاح',
      [Translations.UPDATE]: 'تحديث',
      [Translations.PLEASE_SELECT_STATE_FIRST]: 'الرجاء تحديد الولاية أولاً.',
      [Translations.PLEASE_SELECT_COUNTRY_FIRST]: 'الرجاء تحديد الدولة أولاً.',

      //profile image update
      [Translations.PROFILE_IMAGE_UPDATED_SUCCESS]:
        'تم تحديث صورة الملف الشخصي بنجاح',
      //ScanQR Popup
      [Translations.YOUR_ATTENDANCE_IS_MARKED]: 'تم وضع علامة على حضورك.',
      [Translations.CHOOSE_SERVICE]: 'اختر الخدمة',

      //ReportLate popup
      [Translations.REPORT_LATE]: 'تقرير متأخر',
      [Translations.MINS]: 'دقيقة',
      [Translations.HOUR]: 'ساعة',
      [Translations.MINUTES]: 'الدقائق',

      // Ticket screen
      [Translations.SHARE_TICKET]: 'مشاركة التذكرة',
      [Translations.WE_LOOK_FORWARD_TO_SERVE_YOU_SOON]:
        'نحن نتطلع لخدمتك قريبا!',
      [Translations.DATE_AND_TIME]: 'التاريخ و الوقت',
      [Translations.CONSULTATION_WITH]: 'بالتشاور مع',
      [Translations.SHARE]: 'يشارك',

      // Reminder Ppopup
      [Translations.YOU_HAVE_AN_APPOINTMENT_WITH]: 'لديك موعد مع',
      [Translations.ON]: 'على',
      [Translations.IN]: 'في',
      [Translations.APPOINTMENT_WITH]: 'موعد مع',
      [Translations.FROM_Y_WAIT]: 'من يوويت',
      [Translations.REMINDER]: 'تذكير',
      [Translations.SET_REMINDER_ON]: 'ضبط التذكير على',
      [Translations.REMINDER_ME_BEFORE]: 'ذكرني من قبل',
      // reminder success
      [Translations.NO_REMINDER]: 'لا تذكير',
      [Translations.SET_REMINDER]: 'تعيين تذكير',
      [Translations.REMINDER_SET]: 'مجموعة تذكير',
      [Translations.YOU_WILL_BE_REMINDED_WITH]: 'سيتم تذكيرك بـ',
      [Translations.IS_THE_POSITION_OF_YOUR_TOKEN]: 'هو موضع رمزك المميز',

      //Upcoming detail popup

      [Translations.PAY_NOW]: 'ادفع الآن',
      [Translations.TOKEN_NUMBER]: 'رقم الرمز',
      [Translations.DATE]: 'تاريخ',
      [Translations.YOUR_QUEUE_POSITION]: 'موقف قائمة الانتظار الخاص بك',

      // VitalsDetails popup
      [Translations.VITALS_DETAILS]: 'تفاصيل حيوية',
      [Translations.LOW]: 'قليل',
      [Translations.HIGH]: 'عالٍ',
      [Translations.NORMAL]: 'طبيعي',
      //Shared
      //Appointment cancel popup

      [Translations.ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT]:
        'هل أنت متأكد من إلغاء هذا الموعد؟',
      [Translations.WILL_BE_APPLICABLE_UPON_CANCELLATION_ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT]:
        'سوف تكون قابلة للتطبيق عند الإلغاء. هل أنت متأكد من إلغاء هذا الموعد؟',
      [Translations.A_FEE_OF]: 'رسوم',
      [Translations.CONFIRM_CANCEL]: 'تأكيد إلغاء',
      //Appointment cancel success popup
      [Translations.YOUR_APPOINTMENT_IS_CANCELED]: 'تم إلغاء موعدك',
      // AppointmentRescheduleConfirmPopup
      [Translations.ARE_YOU_SURE_TO_RESCHEDULE_THIS_APPOINTMENT]:
        'هل أنت متأكد من إعادة تحديد هذا الموعد؟',

      [Translations.WILL_BE_APPLICABLE_UPON_RESCHEDULE_ARE_YOU_SURE_TO_RESCHEDULE_THIS_APPOINTMENT]:
        'سوف تكون قابلة للتطبيق عند إعادة الجدولة. هل أنت متأكد من إعادة تحديد هذا الموعد؟',
      [Translations.PERCENTAGE]: 'النسبة المئوية',
      [Translations.CONFIRM_RESCHEDULE]: 'تأكيد إعادة الجدولة',

      //country code popup

      //File upload
      [Translations.SELECT_AN_OPTION]: 'حدد اختيارا',
      [Translations.FILES]: 'الملفات',
      [Translations.GALLERY]: 'صالة عرض',
      [Translations.CAMERA]: 'آلة تصوير',
      [Translations.REMOVE_ATTACHMENT_CONFIRM_MESSAGE]:
        'هل أنت متأكد أنك تريد إزالة هذا المرفق؟',
      [Translations.UN_SAVED_CHANGES_WILL_BE_LOST]:
        'هل أنت متأكد أنك تريد العودة؟ ستفقد أية تغييرات غير محفوظة',

      //Add review popup
      [Translations.ARE_YOU_SURE]: 'هل أنت واثق؟',
      [Translations.IF_ANY_REMINDER_ADDED_FOR_THIS_APPOINTMENT_WILL_BE_REMOVED_DO_YOU_WANT_TO_CONTINUE]:
        'إذا تمت إزالة أي تذكير مضاف لهذا الموعد ، فهل تريد المتابعة؟',
      [Translations.PLEASE_SELECT_RATING]: 'الرجاء تحديد التصنيف',
      [Translations.PLEASE_ENTER_REVIEW]: 'الرجاء إدخال المراجعة',

      // new translations for serve

      // AvailabilityStatusChangePopup
      [Translations.NOT_AVAILABLE]: 'غير متوفر',
      [Translations.ON_A_BREAK]: 'في استراحة',
      [Translations.AVAILABLE]: 'متوفرة',
      [Translations.STATUS]: 'حالة',
      [Translations.TODAY]: 'اليوم',
      [Translations.FILTER]: 'منقي',
      [Translations.YESTERDAY]: 'في الامس',
      [Translations.DASH_BOARD]: 'لوحة القيادة',
      [Translations.APPOINTMENT]: 'ميعاد',
      [Translations.NEW_CUSTOMERS]: 'زبائن الجدد',
      [Translations.WALK_IN]: 'ادخل',
      [Translations.CANCELLED]: 'ألغيت',
      [Translations.DASH_BOARD_NO_SHOW]: 'لا تظهر',
      [Translations.AVERAGE_WAITING]: 'متوسط ​​الانتظار',
      [Translations.AVERAGE_SERVING]: 'متوسط ​​التقديم',
      [Translations.WEEKLY]: 'أسبوعي',
      [Translations.DAILY]: 'اليومي',
      [Translations.AVERAGE]: 'متوسط',
      [Translations.ACTUAL]: 'فِعلي',
      [Translations.AVERAGE_BOOKING]: 'متوسط ​​الحجز',
      [Translations.COUNT]: 'عدد',
      [Translations.DEPARTMENTS]: 'الإدارات',
      [Translations.LAST_7_DAYS]: 'اخر 7 ايام',
      [Translations.LAST_30_DAYS]: 'آخر 30 يومًا',
      [Translations.NO_DEPARTMENT_VISIT]: 'لا زيارة القسم',

      //BottomBar
      [Translations.MANAGE_QUEUE]: 'إدارة قائمة الانتظار',
      [Translations.REPORTS]: 'التقارير',
      [Translations.PLEASE_ADD_VITALS]: 'الرجاء إضافة العناصر الحيوية',
      [Translations.BILL_NOT_PAID]: 'لم يتم دفع فاتورة العميل',
      //NewBookingCustomerListScreen
      [Translations.CUSTOMER_PROFILE_IS_INCOMPLETE_PLEASE_UPDATE_AND_CONTINUE]:
        'ملف تعريف العميل غير مكتمل ، يرجى التحديث والمتابعة',

      [Translations.LAST_VISITED]: 'آخر زيارة',
      [Translations.NO_VISIT]: 'لا زيارة',
      [Translations.SELECT_CUSTOMER]: 'حدد العميل',
      [Translations.NO_CHOICE_CAPITAL]: 'لا خيار',
      //AllServingUserList
      [Translations._CHOOSE]: 'يختار',

      [Translations.CHOOSE_THE_BREAK_TIME]: 'اختر وقت الاستراحة',
      [Translations.FROM]: 'من',
      [Translations.TO]: 'إلى',
      [Translations.IS_WITH]: 'يكون مع',
      [Translations.PREVIOUS_VISITS]: 'الزيارات السابقة',
      [Translations.ADD_VISITS]: 'أضف زيارات',
      [Translations.EDIT_VITALS]: 'تحرير العناصر الحيوية',
      [Translations.ADD_VITALS]: 'أضف العناصر الحيوية',
      [Translations.PAY_REFUND]: 'دفع المبلغ المسترد',
      [Translations.ADD_NOTE]: 'اضف ملاحظة',
      [Translations.EDIT_NOTE]: 'تحرير مذكرة',
      [Translations.DELETE_NOTE]: 'حذف الملاحظة',
      [Translations.CONSULTATION_DATE]: 'تاريخ الاستشارة',
      [Translations.ADD_ATTACHMENT]: 'إضافة مرفق',

      // Report tab screen
      [Translations.CALENDAR]: 'تقويم',
      [Translations.HISTORY]: 'تاريخ',
      [Translations.CUSTOMER]: 'عميل',
      [Translations.BOOKED]: 'حجز',
      [Translations.ALL]: 'الجميع',
      [Translations.ADD_APPOINTMENT]: 'أضف موعد',
      [Translations.ADD_QUEUE]: 'إضافة قائمة الانتظار',
      [Translations.TOMORROW]: 'الغد',
      [Translations.HEY]: 'يا',
      [Translations.YOU_DONT_HAVE_ANY_CONSULTATION_FOR_THE_DAY]: `ليس لديك أي استشارة لهذا اليوم`,

      [Translations.YOU_HAVE_NO_VISITORS]: 'ليس لديك زوار',
      [Translations.STARTED_SERVING_AT]: 'بدأ التقديم في',
      [Translations.IS_SCHEDULED_AT]: 'من المقرر في',
      [Translations.PRESENTS_IS_MARKED_AT]: 'تم وضع علامة على التواجد في',
      [Translations.CUSTOMER_DETAILS]: 'تفاصيل العميل',
      [Translations.CUSTOMER_ID]: 'هوية الزبون',
      // Manage Queue Screen
      [Translations.STOP_SESSION]: 'توقف الجلسة',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_START_A_NEW_SESSION]:
        'هل أنت متأكد أنك تريد بدء جلسة جديدة؟',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_END_THE_NEW_SESSION]:
        'هل أنت متأكد أنك تريد إنهاء الجلسة؟',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_CANCEL_THIS_APPOINTMENT]:
        'هل أنت متأكد أنك تريد إلغاء هذا الموعد؟',
      [Translations.ARE_YOU_SURE_WANT_TO_MOVE_THIS_USER_TO_FULFILLED]:
        'هل أنت متأكد أنك تريد نقل هذا المستخدم للوفاء؟',
      [Translations.PLEASE_START_SESSION_FIRST]: 'الرجاء بدء الجلسة أولا.',
      [Translations.FOR_SERVING_YOUR_CUSTOMER]: 'لخدمة عميلك',
      [Translations.PLEASE_START_YOUR_SESSION]: 'يرجى بدء الجلسة الخاصة بك',
      [Translations.SHOULD_START_THE_SESSION_TO_SERVE_CUSTOMER]:
        'يجب أن تبدأ الجلسة لخدمة العملاء',
      [Translations.NO_CONSULTATION]: 'لا تشاور',
      [Translations.ONLY_FROM_ARRIVED_LIST_IS_ACCEPTED]:
        'فقط من وصلت القائمة مقبولة.',
      [Translations.ARE_YOU_SURE_YOU_WANT_TO_MOVE_THIS_USER_TO_FULFILLED]:
        'هل أنت متأكد أنك تريد نقل هذا المستخدم للوفاء؟',
      [Translations.ONLY_FROM_SERVING_LIST_IS_ACCEPTED]:
        'فقط من قائمة الخدمة مقبولة.',

      [Translations.DRAG_AND_DROP_HERE]: 'اسحب واسقط هنا',
      [Translations.MORE]: 'أكثر',
      [Translations.LAST_CUSTOMER]: 'آخر عميل',
      [Translations.FULFILLED]: 'استيفاء',
      [Translations.NOT_ARRIVED]: 'لم يصل',
      [Translations.NOTHING_HERE]: 'لا شيء هنا..',
      [Translations.TOKEN_NOT_FOUND]: 'رمز التفويض غير موجود!',
      [Translations.NOT_AUTH_TO_USE_APP]:
        'غير مصرح لك بتسجيل الدخول إلى التطبيق.',
      [Translations.PIN_AUTH]: 'مصادقة رقم التعريف الشخصي',
      [Translations.ADD_NOTES]: 'أضف ملاحظات',
      [Translations._EDIT_NOTES]: 'تحرير الملاحظات',

      [Translations.ARRIVED]: 'وصل',
      [Translations.SERVING]: 'خدمة',
      [Translations.MOVE_TO_FULFILLED]: 'انتقل إلى تم الاستيفاء',
      [Translations.SESSION_ENDED]: 'انتهت الجلسة',

      // Customer info screen
      [Translations.TOKEN]: 'رمز',
      [Translations.LAST_VISIT]: 'الزيارة الأخيرة',
      [Translations.CLOSE_CAPITAL]: 'أغلق',
      [Translations.NEXT_VISIT]: 'في المرة القادمة',
      //Mark as paid
      [Translations.REFERENCE_NUMBER_IS_REQUIRED]: 'الرقم المرجعي مطلوب',
      [Translations.ENTER_REFERENCE_NUMBER]: 'أدخل الرقم المرجعي',
      [Translations.PAYMENT_MARKED_SUCCESSFULLY]:
        'تم وضع علامة على الدفع بنجاح!',
      [Translations.ADD_PAYMENT_DETAILS]: 'أضف تفاصيل الدفع',
      [Translations.SELECT_PAYMENT]: 'حدد الدفع',
      [Translations.PAYMENT_PERMISSION_DISABLED_TEXT]: `ليس لديك إذن لتحصيل المدفوعات من العميل.`,
      [Translations.PLEASE_CONTACT_YOUR_ADMINISTRATOR]:
        ' الرجاء الاتصال بالمسؤول الخاص بك',
      [Translations.BY_CARD]: 'عن طريق البطاقة',
      [Translations.BY_CASH]: 'نقدا',
      [Translations.MARK_AS_PAID]: 'وضع علامة كمدفوع',
      [Translations.NO_CONSULTANTS]: 'لا يوجد استشاريين',
      [Translations.NO_CONSULTANTS_FOUND_YET]:
        'لم يتم العثور على استشاريين حتى الآن',
      [Translations.CONSULTANTS]: 'استشاريون',
      [Translations.ARE_YOU_SURE_WANT_TO_CONFIRM]:
        'هل أنت متأكد أنك تريد التأكيد',
      [Translations.REFUND_PAYMENT]: 'دفع مبلغ معاد؟',
      [Translations.SEND]: 'إرسال',

      // schedule next visit screen
      [Translations.SCHEDULE_NEXT_VISIT]: 'حدد موعد الزيارة التالية',
      [Translations.SELECT_NEXT_VISIT_DATE_USER_WILL_BE_REMIND_BEFORE_3_DAYS_BEFORE_1_DAY_AND_VISIT_DAY_MORNING]:
        'حدد تاريخ الزيارة التالية ، وسيتم تذكير المستخدم قبل 3 أيام ، قبل يوم واحد ، وزيارة اليوم الصباح.',

      [Translations.SUBMIT]: 'يُقدِّم',
      //ADD NOTE POPUP SCREEN
      [Translations.DETAILS]: 'تفاصيل',
      [Translations.SERVING_TIME]: 'خدمة الوقت',

      //Manage queue list tab  screen
      [Translations.SERVED]: 'خدم',
      // NotArrivedListTabScreen

      [Translations.BOOKING_ID]: 'معرف الحجز',
      [Translations.QUEUE_ID]: 'قائمة الانتظار',
      [Translations.APPOINTMENT_AT]: 'موعد في',
      [Translations.ARRIVED_AT]: 'وصل في',
      [Translations.SERVING_STARTED_AT]: 'بدأ التقديم في',
      [Translations.SERVED_AT]: 'خدم في',

      //

      [Translations.START_SESSION]: 'ابدأ الجلسة',
      [Translations.NOTIFICATION_SENT_SUCCESSFULLY]: 'تم إرسال الإخطار بنجاح!',
      [Translations.SELECT_AN_OPTION_FROM_LIST_TO_NOTIFY_EXTENDED_SERVING_TIME_ARRIVED_VISITORS_WILL_BE_NOTIFIED]:
        'حدد خيارًا من القائمة لإخطار وقت العرض الممتد. سيتم إخطار الزوار القادمين.',
      [Translations.CREATE_CUSTOMER]: 'إنشاء العميل',
      [Translations.CREATE]: 'خلق',
      // validations
      [Translations.SELECT]: 'يختار',
      [Translations.SELECT_CODE]: 'حدد الرمز',
      [Translations.DIGITS_NOT_ALLOWED_FOR]: 'الأرقام غير مسموح بها لـ',
      [Translations.THIS_FIELD]: 'هذا الحقل',
      [Translations.IS_REQUIRED]: 'مطلوب',
      [Translations.PLEASE_ENTER_VALID_EMAIL_ADDRESS]:
        'الرجاء إدخال عنوان بريد إلكتروني صالح',
      [Translations.MINIMUM]: 'الحد الأدنى',
      [Translations.CHARACTERS_REQUIRED]: 'الأحرف المطلوبة',
      [Translations.ONLY]: 'فقط',
      [Translations.PLEASE_ENTER_A_VALID]: 'الرجاء إدخال',
      //
      [Translations.CONFIRM_PIN]: 'تأكيد PIN',

      [Translations.CONFIRM_PIN_DESCRIPTION]:
        'قم بتأكيد رقم التعريف الشخصي الجديد الخاص بك',

      [Translations.BACK]: 'خلف',
      [Translations.PIN_DONT_MATCH]: 'رقم التعريف الشخصي غير متطابق',
      //PIN Verify
      [Translations.ENTER_PIN]: 'أدخل رقم التعريف الشخصي',
      [Translations.PIN_VERIFY_DESCRIPTION]:
        'أدخل رقم PIN الخاص بك لاستخدام Ywait',

      [Translations.FORGOT_PIN]: 'نسيت رقم التعريف الشخصي',
      [Translations.INVALID_PIN]: 'الرجاء إدخال PIN صالح للمتابعة.',
      //New PIN
      [Translations.NEW_PIN]: 'دبوس جديد',
      [Translations.NEW_PIN_DESCRIPTION]:
        'أدخل رقم التعريف الشخصي الجديد الخاص بك',
      [Translations.NEXT]: 'التالي',
      [Translations.SKIP]: 'يتخطى',
      [Translations.SELECTED_DATE_IS_A_HOLIDAY]: 'اليوم المحدد هو يوم عطلة',
      [Translations.FORGOT_PASSWORD_TITLE]: 'هل نسيت كلمة السر',
      //
      [Translations.SELECTED_DATE_IS_A_HOLIDAY]: 'اليوم المحدد هو يوم عطلة',
      [Translations.NO_VISITS_FOUND]: 'لم يتم العثور على زيارات',
      [Translations.STAYS_CANCELLED]: 'يبقى ملغيا.',
      [Translations.REFUND_STATUS]: 'حالة رد الأموال',
      [Translations.IS_COMPLETED]: 'قد اكتمل.',
      [Translations.ENABLE_PERMISSION]: 'تمكين الإذن',
      [Translations.OPEN_SETTINGS]: 'أفتح الإعدادات',
      [Translations.CAMERA_PERMISSION]: `"Aster Serve" هل ترغب في الوصول إلى الكاميرا `,
      [Translations.NO_VISIT]: 'لا زيارة',
      [Translations.SELECT_TIME]: 'حدد وقتًا',
      [Translations.SPECIALIST]: 'متخصص',
      [Translations.SMALL_AVAILABLE]: 'متوفرة',
      [Translations.SMALL_NO]: 'رقم',
      [Translations.SAVE]: 'يحفظ',
      [Translations.VITALS_SAVED_SUCCESS]: 'تم حفظ العناصر الحيوية بنجاح',
      [Translations.WILL_BE_APPLICABLE_UPON_CANCELLATION_ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT]:
        'سوف تكون قابلة للتطبيق عند الإلغاء. هل أنت متأكد من إلغاء هذا الموعد؟',
      [Translations.A_FEE_OF]: 'رسوم',
      [Translations.CONFIRM_CANCEL]: 'تأكيد إلغاء',
      [Translations.UPDATE_PROFILE]: 'تحديث الملف',
      [Translations.PROFILE_CHANGE_ALERT_MESSAGE]:
        'هل أنت متأكد أنك تريد المغادرة دون تحديث ملف التعريف الخاص بك؟',
      [Translations.DISCARD]: 'تجاهل',
      [Translations.CUSTOMER_CREATION_ALERT_MESSAGE]:
        'لقد قمت بإجراء تغييرات. هل تنتظر التخلص أو الحفظ؟',
      [Translations.REVIEW_CHANGES]: 'مراجعة التغييرات',
      [Translations.VITAL_CHANGE_ALERT_MESSAGE]:
        'لقد أجريت تغييرات ، هل تريد تجاهلها أو حفظها ?',
      [Translations.ADD_VITAL_CHANGE_ALERT_MESSAGE]:
        'هل أنت متأكد أنك تريد العودة بدون إضافة عناصر حيوية ?',
      [Translations.BOOKING_NOT_AVAILABLE_SWITCH_TO_QUEUE]:
        'الحجز غير متوفر ، قم بالتبديل إلى قائمة الانتظار',

      [Translations.OLD_PASSWORD_IS_REQUIRED]:
        'الرجاء إدخال كلمة المرور القديمة',
      [Translations.NEW_PASSWORD_IS_REQUIRED]:
        'الرجاء إدخال كلمة المرور الجديدة',
      [Translations.CONFIRM_PASSWORD_IS_REQUIRED]:
        'الرجاء إدخال تأكيد كلمة المرور',
      [Translations.PIN_AUTHENTICATION]: 'مصادقة رقم التعريف الشخصي',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    compatibilityJSON: 'v3',
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
