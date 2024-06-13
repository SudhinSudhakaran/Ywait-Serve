import {Alert} from 'react-native';

import {Globals} from '../../constants';
import Utilities from '../utils/Utilities';
import APIConnection from './APIConnections';
import * as RootNavigation from '../../navigators/RootNavigator';
import StorageManager from '../storageManager/StorageManager';
export const NetworkManager = {
  get,
  post,
  put,
  delete: _delete,
  uploadFiles,
};

// function get(url, headers = {}) {
//   let encodeUrl = encodeURI(decodeURI(url));
//   const header = {
//     'Content-Type': 'application/json',
//     timezoneOffset: Utilities.getBusinessTimeZoneOffset(false),
//     business_id: Globals.BUSINESS_ID,
//     ...(Globals.USER_DETAILS._id
//       ? {[APIConnection.KEYS.USER_ID]: Globals.USER_DETAILS._id}
//       : null),
//     ...(Globals.TOKEN
//       ? {[APIConnection.KEYS.AUTHORIZATION]: Globals.TOKEN}
//       : null),
//     ...headers,
//   };
//   // console.log("get",Globals.TOKEN);
//   const requestOptions = {
//     method: 'GET',
//     headers: header,
//   };
//   _logApiRequest(encodeUrl, requestOptions);
//   return fetch(encodeUrl, requestOptions).then(handleResponse);
// }


async function get(url, headers = {}) {
  try {
    const encodeUrl = encodeURI(url);
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',

      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // 'Access-Control-Allow-Credentials':true,
      timezoneOffset: Utilities.getBusinessTimeZoneOffset(false),
      business_id: Globals.BUSINESS_ID,
      ...(Globals.USER_DETAILS?._id
        ? { [APIConnection.KEYS.USER_ID]: Globals.USER_DETAILS._id }
        : {}),
      ...(Globals.TOKEN
        ? { [APIConnection.KEYS.AUTHORIZATION]: Globals.TOKEN }
        : {}),
      ...headers,
    };

    const requestOptions = {
      method: 'GET',
      headers: header,
    };

    _logApiRequest(encodeUrl, requestOptions);

    const response = await fetch(encodeUrl, requestOptions);
    return handleResponse(response);
  } catch (error) {
    console.log('Error====', error);
    throw error;
  }
}

function post(url, body, headers = {}) {
  const header = {
    'Content-Type': 'application/json',
    timezoneOffset: Utilities.getBusinessTimeZoneOffset(false),
    business_id: Globals.BUSINESS_ID,
    ...(Globals.USER_DETAILS._id
      ? {[APIConnection.KEYS.USER_ID]: Globals.USER_DETAILS._id}
      : null),
    ...(Globals.TOKEN
      ? {[APIConnection.KEYS.AUTHORIZATION]: Globals.TOKEN}
      : null),
    ...headers,
  };

  const requestOptions = {
    method: 'POST',
    headers: header,
    body: JSON.stringify(body),
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
  const header = {
    'Content-Type': 'application/json',
    'X-Auth-Token': Globals.TOKEN,
  };

  const requestOptions = {
    method: 'PUT',
    headers: header,
    body: JSON.stringify(body),
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const header = {
    'Content-Type': 'application/json',
    'x-auth-token': Globals.TOKEN,
  };
  const requestOptions = {
    method: 'DELETE',
    headers: header,
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}
/*https://medium.com/@ariel.salem1989/how-to-upload-multiple-files-react-native-e9577a5de106
*https://stackoverflow.com/a/61637713/10476608
EG:
    Setup A Form:

    let data = new FormData();
    Fill Form Out:

    this.state.selectedImages.forEach((item, i) => {
    data.append("doc[]", {
        uri: item.uri,
        type: "image/jpeg",
        name: item.filename || `filename${i}.jpg`,
    });
    });
*/
function uploadFiles(url, body, headers = {}) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      timezoneOffset: Utilities.getBusinessTimeZoneOffset(false),
      business_id: Globals.BUSINESS_ID,
      ...(Globals.USER_DETAILS._id
        ? {[APIConnection.KEYS.USER_ID]: Globals.USER_DETAILS._id}
        : null),
      ...(Globals.TOKEN
        ? {[APIConnection.KEYS.AUTHORIZATION]: Globals.TOKEN}
        : null),
      ...headers,
    },
    //body: JSON.stringify(body)
    body: body,
  };
  _logApiRequest(url, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    console.log('Response:=====> ', response);
    console.log('Response status code : ', response.status);
    if (response.status === 401) {
      //Session expired
      console.log('Session expired!');
      createForceLogoutAlert();
    } else {
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        _logApiCallError(error);
        return Promise.reject(error);
      }

      _logApiCallSuccess(data);
      return data;
    }
    return null;
  });
}

// Logs
function _logApiRequest(url, request) {
  console.log('API req URL: ', url);
  console.log('API req: ', {request});
}
function _logApiCallSuccess(data) {
  console.log('Success!', data);
}

function _logApiCallError(error) {
  console.error('There was an error!', error);
}

const createForceLogoutAlert = () =>
  Alert.alert(
    'Session expired',
    'Your session has been expired, Please login to continue',
    [{text: 'Sign out', onPress: () => clearDataAndNavigateToLogin()}],
  );

const clearDataAndNavigateToLogin = () => {

  // console.log('onLogout at set: ', props.onAuthChange)
  try {
    StorageManager?.clearUserRelatedData(); //NEED TO CHANGE TO CLEAR ONLY USER DETAILS
    RootNavigation.resetToLogin();
  } catch (e) {
    console.log(e);
  }
};
// async function reloadApp() {
//   await Updates.reloadAsync();
// }