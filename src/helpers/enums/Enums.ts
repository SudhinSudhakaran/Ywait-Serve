export enum PINSource {
  fromLogin,
  forPINChange,
  none,
}
export enum UploadTypes {
  file = 'File',
  camera = 'Camera',
  image = 'Image',
  none = 'None',
}
export enum QueueStatus {
  notArrived = 'NotArrived',
  arrived = 'Arrived',
  serving = 'Serving',
  fulfilled = 'Fulfilled',
}

export enum AppointmentType {
  booking = 'booking',
  queue = 'queue',
}

export enum AddVitalType {
  beforeConsultation = 'before-consultation',
  afterConsultation = 'after-consultation',
  anyTime = 'anytime',
  optional = 'optional',
}

export enum AlertConfirmPopupSource {
  session,
  moveToFulFilled,
  removeDirectCheckIn,
  none,
}

export enum AccessModules {
  manageQueue = 'MANAGE QUEUE',
  customers = 'CUSTOMERS',
  appointments = 'APPOINTMENTS',
  notes = 'Notes',
  calendar = 'CALENDER',
  payment = 'PAYMENT',
}

export enum AccessPermissions {
  view,
  edit,
  create,
  delete,
}

export enum GraphFilterOption {
  daily = 'daily',
  weekly = 'weekly',
}

export enum DepartmentGraphFilterOption {
  daily = 'hourly',
  weekly = 'daily',
  monthly = 'weekly',
}

export enum BUILD_SOURCE {
  YWAIT = 'YWAIT',
  SKILLIKZ = 'SKILLIKZ',
  PRINCECOURT = 'PRINCECOURT',
  ADVENTA = 'ADVENTA',
  SPOTLESS = 'SPOTLESS',
  ASTER = 'ASTER',
  AL_NOOR = 'AL_NOOR',
  INSTA='INSTA',
  FIRST_RESPONSE='FIRST_RESPONSE',
  YWAIT_SERVICES_SERVE='YWAIT_SERVICES_SERVE',
  OMH='OH_MY_HEALTH'
}
export enum BOOKING_QUEUE_NEGATIVE_SCREEN_TYPE {
  SPECIALIST_NOT_AVAILABLE = 'SPECIALIST_NOT_AVAILABLE',
  BOOKING_FULL = 'BOOKING_FULL',
  HOLYDAY = 'HOLYDAY',
  QUEUE_FULL = 'QUEUE_FULL',
  QUEUE_NOT_AVAILABLE = 'QUEUE_NOT_AVAILABLE',
  NO_ADVANCE_BOOKING = 'NO_ADVANCE_BOOKING',
  NO_ADVANCE_QUEUE = 'NO_ADVANCE_QUEUE',
  BOOKING_DISABLE = 'BOOKING_DISABLE',
  QUEUE_DISABLE = 'QUEUE_DISABLE',
}
export enum SHOW_TAB {
  BOTH_TAB = 'BOTH_TAB',
  BOOKING = 'BOOKING',
  QUEUE = 'QUEUE',
  NO_TAB = 'NO_TAB',
}
