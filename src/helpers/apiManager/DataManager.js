import {Strings} from '../../constants';
import {NetworkManager} from './NetworkManager';
import NetworkUtils from '../utils/NetworkUtils';
import APIConnections from '../../helpers/apiManager/APIConnections';
import StorageManager from '../storageManager/StorageManager';
import {Globals, Translations} from '../../constants';
import Utilities from '../utils/Utilities';
import {t} from 'i18next';
export default class DataManager {
  /**
     * Purpose: Get Business List
     * Created/Modified By: Jenson John
     * Created/Modified Date: 27 Dec 2021
     * Steps:
         1.Check network status
         2.Fetch the data
         3.Return data and other info
    */
  static getBusinessList = async pageNo => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.BUSINESS_LIST +
      '/' +
      pageNo +
      '/10';
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
     * Purpose: Get getBusinessDetails
     * Created/Modified By: Jenson John
     * Created/Modified Date: 27 Dec 2021
     * Steps:
            1.Check network status
            2.Fetch the data
            3.Return data and other info
    */
  static getBusinessDetails = async (businessId, headers = {}) => {
    console.log('business -id', businessId);
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.BUSINESS_DETAILS +
      `/${businessId}`;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, headers);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
     * Purpose: Perform login by email
     * Created/Modified By: Jenson John
     * Created/Modified Date: 28 Dec 2021
     * Steps:
            1.Check network status
            2.Fetch the data
            3.Return data and other info
    */
  static performEmailLogin = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.EMAIL_LOGIN;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        //Save token
        if (response.token !== null || response.token !== undefined) {
          StorageManager.saveToken(response.token);
          Globals.TOKEN = response.token;
          return [true, response.message, response.data];
        } else {
          return [false, Strings.TOKEN_NOT_FOUND, null];
        }
      }
    }
  };

  /**
        * Purpose: Perform login by phone
        * Created/Modified By: Jenson John
        * Created/Modified Date: 28 Dec 2021
        * Steps:
            1 .Check network status
            2.Fetch the data
            3.Return data and other info
*/
  static performPhoneLogin = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.PHONE_LOGIN;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        //Save token
        if (response.token !== null || response.token !== undefined) {
          StorageManager.saveToken(response.token);
          Globals.TOKEN = response.token;
          return [true, response.message, response.data];
        } else {
          return [false, Strings.TOKEN_NOT_FOUND, null];
        }
      }
    }
  };

  /**
       * Purpose: Perform login by phone
       * Created/Modified By: Jenson John
       * Created/Modified Date: 31 Dec 2021
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performPINVerification = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.PIN_VERIFY;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        //Save token
        if (response.token !== null || response.token !== undefined) {
          StorageManager.saveToken(response.token);
          Globals.TOKEN = response.token;
          return [true, response.message, response.data];
        } else {
          return [false, Strings.TOKEN_NOT_FOUND, null];
        }
      }
    }
  };

  /**
   * Purpose: Perform login by phone
   * Created/Modified By: Jenson John
   * Created/Modified Date: 31 Dec 2021
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static updateAuthPINSettings = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.UPDATE_AUTH_PIN_SETTINGS;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        //Save token
        if (response.token !== null || response.token !== undefined) {
          StorageManager.saveToken(response.token);
          Globals.TOKEN = response.token;
          return [true, response.message, response.data];
        } else {
          return [false, Strings.TOKEN_NOT_FOUND, null];
        }
      }
    }
  };

  /**
   * Purpose: Perform pin creation
   * Created/Modified By: Jenson John
   * Created/Modified Date: 31 Dec 2021
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static performPINCreation = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPDATE_USER_PIN;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
       * Purpose: Perform forgot password
       * Created/Modified By: Jenson John
       * Created/Modified Date: 03 Jan 2022
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performForgotPassword = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.FORGOT_PASSWORD;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
       * Purpose: Perform password reset
       * Created/Modified By: Jenson John
       * Created/Modified Date: 04 Jan 2022
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performPasswordReset = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.PASSWORD_RESET;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
       * Purpose: Perform forgot PIN email
       * Created/Modified By: Jenson John
       * Created/Modified Date: 04 Jan 2022
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performForgotPinEmail = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.FORGOT_PIN_EMAIL;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
    * Purpose: Get user details
    * Created/Modified By: Jenson John
    * Created/Modified Date: 04 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getUserDetails = async (userId, headers = {}) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.USER_DETAILS +
      `/${Globals.BUSINESS_DETAILS?._id}` +
      `/${userId}`;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, headers);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get country list with code
    * Created/Modified By: Jenson John
    * Created/Modified Date: 13 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getCountryList = async (headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.COUNTRY_CODE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, headers);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get state and city list
    * Created/Modified By: Jenson John
    * Created/Modified Date: 13 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getStateAndCityList = async (countryName, headers = {}) => {
    //let encodeCountryName = countryName.replace(/\s+/g, '%20');

    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.STATE_AND_CITY +
      `/${countryName}`;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, headers);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get customer list
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 14 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getCustomerList = async (pageNo, searchLocalValue) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.CUSTOMER_LIST +
      `/${Globals.BUSINESS_DETAILS?._id}` +
      '/' +
      pageNo +
      '/10' +
      '?search=' +
      searchLocalValue;

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
       * Purpose: Perform profile update
       * Created/Modified By: Jenson John
       * Created/Modified Date: 17 Jan 2022
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performProfileUpdate = async body => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPDATE_PROFILE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.uploadFiles(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
    * Purpose: Get customer list
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 14 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getHistoryList = async (pageNo, searchLocalValue, consultantID) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.HISTORY_LIST +
      '/' +
      consultantID +
      '/' +
      pageNo +
      '/10?filter=past' +
      (searchLocalValue !== '' ? '&search=' + searchLocalValue : '');

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get customer list
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 14 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getUpcomingBookingList = async (body = {}) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.UPCOMING_BOOKING_LIST +
      '/report?visitor=ALL';

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
    * Purpose: Get customer list
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 14 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getConsultantList = async () => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.CAN_SERVE_USERS_LIST +
      `/${Globals.BUSINESS_DETAILS?._id}`;

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get customer list
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 14 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getCalendarListData = async (filterOption, body = {}) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.CALENDAR_BOOKING_LIST +
      '?filter=' +
      filterOption;

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
  * Purpose: Get current day appointments
  * Created/Modified By: Jenson John
  * Created/Modified Date: 21 Jan 2022
  * Steps:
         1.Check network status
         2.Fetch the data
         3.Return data and other info
 */
  static getCurrentDayAppointments = async (headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.APPOINTMENT_LIST;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, headers);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
     * Purpose: Perform Booking Status change
     * Created/Modified By: Jenson John
     * Created/Modified Date: 25 Jan 2022
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performBookingStatusChange = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.BOOKING_STATUS_CHANGE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
     * Purpose: Perform Queue Status change
     * Created/Modified By: Jenson John
     * Created/Modified Date: 25 Jan 2022
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performQueueStatusChange = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.WAITLIST_STATUS_CHANGE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };
  /**
      * Purpose: Get user details
      * Created/Modified By: Jenson John
      * Created/Modified Date: 04 Jan 2022
      * Steps:
             1.Check network status
             2.Fetch the data
             3.Return data and other info
     */
  static getServiceList = async (gender, servingUserId, headers = {}) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.SERVICES_LIST +
      `/${Globals.BUSINESS_DETAILS?._id}` +
      '?gender=' +
      gender +
      '&servingUser_id=' +
      servingUserId;
    console.log('URL', url);
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, headers);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
      * Purpose: Get user availability
      * Created/Modified By: Jenson John
      * Created/Modified Date: 28 Jan 2022
      * Steps:
             1.Check network status
             2.Fetch the data
             3.Return data and other info
     */
  static getAvailability = async (servingUserId, headers = {}) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.USER_AVAILABILITY_INFO +
      `/${servingUserId}`;
    console.log('URL', url);
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, headers);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
     * Purpose: Perform Serving session start
     * Created/Modified By: Jenson John
     * Created/Modified Date: 25 Jan 2022
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performServingSessionStart = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.SESSION_START;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
     * Purpose: Perform Serving session end
     * Created/Modified By: Jenson John
     * Created/Modified Date: 25 Jan 2022
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performServingSessionEnd = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.SESSION_END;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };
  /**
 * Purpose: Perform add new booking
 * Created/Modified By: Vijin raj
 * Created/Modified Date: 29 Dec 2021
 * Steps:
        1.Check network status
        2.Fetch the data
        3.Return data and other info
*/
  static performAddNewBooking = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.ADD_BOOKING;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
* Purpose: Perform fetch payment info
* Created/Modified By: Vijin raj
* Created/Modified Date: 29 Dec 2021
* Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static performFetchPaymentInfo = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.BOOKING_PAYMENT_INFO;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
* Purpose: Perform add new booking
* Created/Modified By: Vijin raj
* Created/Modified Date: 29 Dec 2021
* Steps:
      1.Check network status
      2.Fetch the data
      3.Return data and other info
*/
  static performAddNewQueue = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.ADD_QUEUE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
* Purpose: Perform fetch payment info
* Created/Modified By: Vijin raj
* Created/Modified Date: 29 Dec 2021
* Steps:
       1.Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static performFetchQueuePaymentInfo = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.QUEUE_PAYMENT_INFO;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get notification list
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 31 Jan 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getNotificationList = async pageNo => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.NOTIFICATION_LIST +
      '/' +
      pageNo +
      '/10';

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
* Purpose: Perform Update notification data
* Created/Modified By: Sudhin Sudhakaran
* Created/Modified Date: 1 Feb 2022
* Steps:
     1.Check network status
     2.pass data
     3.Return data 
*/
  static performUpdateNotificationItem = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPDATE_NOTIFICATION;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
* Purpose: Perform Update notification list
* Created/Modified By: Sudhin Sudhakaran
* Created/Modified Date: 1 Feb 2022
* Steps:
     1.Check network status
     2.pass data
     3.Return data 
*/
  static performUpdateNotificationList = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.UPDATE_NOTIFICATION_ALL;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
      * Purpose: Get customer list
      * Created/Modified By: Sudhin Sudhakaran
      * Created/Modified Date: 14 Jan 2022
      * Steps:
             1.Check network status
             2.Fetch the data
             3.Return data and other info
     */
  static getServeUserList = async (
    pageNo,
    searchLocalValue,
    selectedGender = '',
    departmentId,
  ) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.SERVING_USER_LIST +
      '/' +
      pageNo +
      '/10' +
      '?search=' +
      searchLocalValue +
      '&gender=' +
      selectedGender?.toLowerCase() +
      '&filter=' +
      departmentId;

    let header = {
      customerbusiness_id: Globals.BUSINESS_ID,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, header);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
      * Purpose: Get customer list
      * Created/Modified By: Sudhin Sudhakaran
      * Created/Modified Date: 14 Jan 2022
      * Steps:
             1.Check network status
             2.Fetch the data
             3.Return data and other info
     */
  static getDepartmentList = async (pageNo, searchLocalValue) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.DEPARTMENT_LIST +
      '/' +
      pageNo +
      '/10' +
      '?search=' +
      searchLocalValue;

    let header = {
      customerbusiness_id: Globals.BUSINESS_ID,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, header);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
* Purpose: Perform Direct check in
* Created/Modified By: Jenson John
* Created/Modified Date: 3 Feb 2022
* Steps:
   1.Check network status
   2.pass data
   3.Return data
*/
  static performDirectCheckIn = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.DIRECT_CHECK_IN;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
  * Purpose: Perform Remove Direct check in
  * Created/Modified By: Jenson John
  * Created/Modified Date: 3 Feb 2022
  * Steps:
     1.Check network status
     2.pass data
     3.Return data
  */
  static performRemoveDirectCheckIn = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.REMOVE_DIRECT_CHECK_IN;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
  * Purpose: Perform Notify delay
  * Created/Modified By: Jenson John
  * Created/Modified Date: 4 Feb 2022
  * Steps:
     1.Check network status
     2.pass data
     3.Return data
  */
  static performNotifyDelay = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.NOTIFY_DELAY;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
    * Purpose: Get customer details
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 7 feb 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getCustomerDetails = async customerId => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.CUSTOMER_DETAILS +
      '?customer_id=' +
      customerId;

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get customer details notes list
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 7 feb 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getCustomerNotesList = async (pageNo, customer_id) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.CUSTOMER_NOTES +
      '/' +
      customer_id +
      '/' +
      Globals.USER_DETAILS._id +
      '/' +
      pageNo +
      '/' +
      10;
    let header = {
      customerbusiness_id: `/${Globals.BUSINESS_DETAILS?._id}`,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url, header);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data, response.totalCount];
      }
    }
  };
  /**
    * Purpose: Get appointment details
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 8 feb 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getAppointmentDetails = async url => {
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
     * Purpose: Perform notes update
     * Created/Modified By: Jenson John
     * Created/Modified Date: 09 Feb 2022
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performNoteUpdate = async body => {
    var endpoint =
      Utilities.isImageLocationIsDropbox() === true
        ? APIConnections.ENDPOINTS.UPDATE_NOTES_DROPBOX
        : APIConnections.ENDPOINTS.UPDATE_NOTES;
    let url = APIConnections.BASE_URL + endpoint;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.uploadFiles(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };
  /**
   * Purpose: Perform notes update
   * Created/Modified By: Jenson John
   * Created/Modified Date: 09 Feb 2022
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static performNoteUpdateFromDetail = async body => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.UPDATE_NOTES_FROM_DETAIL;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.uploadFiles(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };
  /**
* Purpose: Perform notes update
* Created/Modified By: Jenson John
* Created/Modified Date: 09 Feb 2022
* Steps:
   1 .Check network status
   2.Fetch the data
   3.Return data and other info
*/
  static performNoteAddFromDetail = async body => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.ADD_NOTES_FROM_DETAIL;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.uploadFiles(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
     * Purpose: Perform login by email
     * Created/Modified By: Jenson John
     * Created/Modified Date: 28 Dec 2021
     * Steps:
            1.Check network status
            2.Fetch the data
            3.Return data and other info
    */
  static performNotesDelete = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.REMOVE_NOTES;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
   * Purpose: Cancel appointment
   * Created/Modified By: Sudhin Sudhakaran
   * Created/Modified Date: 9 feb 2022
   * Steps:
          1.Check network status
          2.Fetch the data
          3.Return data and other info
  */
  static cancelAppointment = async (url, body = {}) => {
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
* Purpose: Get user auth info
* Created/Modified By: Jenson John
* Created/Modified Date: 11 Feb 2022
* Steps:
  1.Check network status
  2.Fetch the data
  3.Return data and other info
*/
  static getUserAuthInfo = async userId => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.USER_AUTH_INFO +
      '/' +
      userId;

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
   * Purpose: Next visit
   * Created/Modified By: Jenson John
   * Created/Modified Date: 14 Feb 2022
   * Steps:
          1.Check network status
          2.Fetch the data
          3.Return data and other info
  */
  static performNextVisit = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.SCHEDULE_NEXT_VISIT;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
   * Purpose: Fetch payment info
   * Created/Modified By: Jenson John
   * Created/Modified Date: 14 Feb 2022
   * Steps:
          1.Check network status
          2.Fetch the data
          3.Return data and other info
  */
  static fetchPaymentInfo = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.FETCH_PAYMENT_INFO;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
 * Purpose: Update payment info
 * Created/Modified By: Jenson John
 * Created/Modified Date: 14 Feb 2022
 * Steps:
        1.Check network status
        2.Fetch the data
        3.Return data and other info
*/
  static updatePaymentInfo = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPDATE_PAYMENT_INFO;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
     * Purpose: Get customer list
     * Created/Modified By: Sudhin Sudhakaran
     * Created/Modified Date: 14 Jan 2022
     * Steps:
            1.Check network status
            2.Fetch the data
            3.Return data and other info
    */
  static getBookingSlotList = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.AVAILABLE_BOOKING;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
     * Purpose: Get customer list
     * Created/Modified By: Sudhin Sudhakaran
     * Created/Modified Date: 14 Jan 2022
     * Steps:
            1.Check network status
            2.Fetch the data
            3.Return data and other info
    */
  static getAllServingUserBookingSlot = async (body = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.ALL_SLOTS;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
     * Purpose: Get customer list
     * Created/Modified By: Sudhin Sudhakaran
     * Created/Modified Date: 14 Jan 2022
     * Steps:
            1.Check network status
            2.Fetch the data
            3.Return data and other info
    */
  static getQueueSlotList = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.AVAILABLE_QUEUE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };
  /**
     * Purpose: Get customer list
     * Created/Modified By: Sudhin Sudhakaran
     * Created/Modified Date: 14 Jan 2022
     * Steps:
            1.Check network status
            2.Fetch the data
            3.Return data and other info
    */
  static getAllQueueSlots = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.ALL_QUEUE_SLOTS;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
       * Purpose: Perform customer create
       * Created/Modified By: Jenson John
       * Created/Modified Date: 15 Feb 2022
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performCustomerCreate = async body => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.CREATE_CUSTOMER;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.uploadFiles(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
       * Purpose: Perform update vitals
       * Created/Modified By: Jenson John
       * Created/Modified Date: 15 Feb 2022
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performUpdateVitals = async body => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPDATE_VITALS;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
    * Purpose: Get dashboard counts
    * Created/Modified By: Jenson John
    * Created/Modified Date: 17 Feb 2022
    * Steps:
           1.Check network status
           2.Fetch the data
           3.Return data and other info
   */
  static getDashboardCounts = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.DASHBOARD_COUNTS;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
  * Purpose: GET_AVERAGE_SERVING_TIME_DATA
  * Created/Modified By: Jenson John
  * Created/Modified Date: 11 Feb 2022
  * Steps:
      1.Check network status
      2.Fetch the data
      3.Return data and other info
  */
  static getAverageServingTimeData = async (body = {}, filter) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.AVERAGE_SERVING_TIME_DATA +
      '?filter=' +
      filter;

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
  * Purpose: getAverageBookingCountData
  * Created/Modified By: Jenson John
  * Created/Modified Date: 17 Feb 2022
  * Steps:
      1.Check network status
      2.Fetch the data
      3.Return data and other info
  */
  static getAverageBookingCountData = async (body = {}, filter) => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.AVERAGE_SERVING_COUNT +
      '?filter=' +
      filter;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
  * Purpose: getDepartmentCountData
  * Created/Modified By: Jenson John
  * Created/Modified Date: 17 Feb 2022
  * Steps:
      1.Check network status
      2.Fetch the data
      3.Return data and other info
  */
  static getDepartmentCountData = async filter => {
    let url =
      APIConnections.BASE_URL +
      APIConnections.ENDPOINTS.DEPARTMENT_VISIT +
      '?filter=' +
      filter;

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.get(url);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
  * Purpose: getAverageBookingCountData
  * Created/Modified By: Jenson John
  * Created/Modified Date: 17 Feb 2022
  * Steps:
      1.Check network status
      2.Fetch the data
      3.Return data and other info
  */
  static performDeviceRegister = async (body = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.DEVICE_REGISTRATION;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      //2
      const response = await NetworkManager.post(url, body);
      //3
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
       * Purpose: Perform password reset
       * Created/Modified By: Jenson John
       * Created/Modified Date: 18 Feb 2022
       * Steps:
           1 .Check network status
           2.Fetch the data
           3.Return data and other info
    */
  static performChangePassword = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.PASSWORD_CHANGE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
     * Purpose: Perform forgot password
     * Created/Modified By: Jenson John
     * Created/Modified Date: 03 Jan 2022
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performEmailUpdate = async (body = {}, headers = {}) => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.EMAIL_UPDATE;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
   * Purpose: Perform notes update
   * Created/Modified By: Jenson John
   * Created/Modified Date: 20 Feb 2022
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static performProfileImageUpload = async body => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.PROFILE_IMAGE_UPLOAD;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.uploadFiles(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
     * Purpose: Perform logout
     * Created/Modified By:Sudhin Sudhakaran
     * Created/Modified Date: 21 FEB 2022
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performLogOut = async body => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.LOGOUT;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };
  /**
   * Purpose: Perform refund status
   * Created/Modified By:Sudhin Sudhakaran
   * Created/Modified Date: 7 march  2022
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static performRefundRequest = async body => {
    let url = APIConnections.BASE_URL + APIConnections.ENDPOINTS.REFUND;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };
  /**
* Purpose: Perform add new booking
* Created/Modified By: Vijin raj
* Created/Modified Date: 29 Dec 2021
* Steps:
 1.Check network status
 2.Fetch the data
 3.Return data and other info
*/
  static performRescheduleAppointment = async (body = {}, headers = {}) => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.RESCHEDULE_APPOINTMENT;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        return [true, response.message, response.data];
      }
    }
  };

  /**
   * Purpose: Perform update availability
   * Created/Modified By:Jenson John
   * Created/Modified Date: 25 march  2022
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static performUpdateAvailability = async body => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPDATE_AVAILABILITY;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };

  /**
   * Purpose: Perform update break time
   * Created/Modified By:Jenson John
   * Created/Modified Date: 25 march  2022
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
*/
  static performUpdateBreakTime = async body => {
    let url =
      APIConnections.BASE_URL + APIConnections.ENDPOINTS.UPDATE_BREAK_TIME;
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, t(Translations.NO_INTERNET), null];
    } else {
      const response = await NetworkManager.post(url, body);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, null];
        } else {
          return [true, response.message, response.data];
        }
      }
    }
  };
}
