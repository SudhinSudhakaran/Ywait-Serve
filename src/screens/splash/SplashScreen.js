import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Platform,
  View,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import KeyboardManager from 'react-native-keyboard-manager';

import {Colors, Globals, Images, Strings, Translations} from '../../constants';
import StorageManager from '../../helpers/storageManager/StorageManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import {AccessModules, AccessPermissions} from '../../helpers/enums/Enums';
import {BUILD_SOURCE} from '../../helpers/enums/Enums';
import {t} from 'i18next';

const SplashScreen = () => {
  const navigation = useNavigation();
  const refVideo = useRef();
  const splashVideo = require('../../assets/animations/Y_Wait_Logo_Anim.mp4');
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  var repeaterId = {}; //setI nterval();

  useEffect(() => {
    // getBaseURL().then(urlRes => {
    //   console.log('url Result', urlRes);
      // getUrlType();
      //Get user details if logged in
      getIsUserLoggedIn().then(res => {
        console.log('splash screen Globals.IS_AUTHORIZED', res);
        Globals.IS_AUTHORIZED = res === 'true' ? true : false;
        if (Globals.IS_AUTHORIZED === true) {
          console.log('1 Globals.IS_AUTHORIZED', Globals.IS_AUTHORIZED);
          getJWTToken().then(_token => {
            Globals.TOKEN = _token;
            getUserDetails().then(userIfo => {
              Globals.USER_DETAILS = userIfo;
              getSelectedBusinessDetails().then(businessInfo => {
                getBusinessDetails(businessInfo._id || '');
              });
            });
            getNotificationCount().then(data => {
              Globals.UN_READ_NOTIFICATION_COUNT = data;
            });
          });
        } else {
          console.log('2 Globals.IS_AUTHORIZED', Globals.IS_AUTHORIZED);
          if (Globals.IS_STANDALONE_BUILD === true) {
            getBusinessDetailsWithoutUserDetails(
              Globals.STANDALONE_BUSINESS_ID,
            );
          }
        }
      });
    // });
  }, []);

  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        setTime(time + 1);
        if (
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SKILLIKZ ||
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.PRINCECOURT ||
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ADVENTA ||
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SPOTLESS ||
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ASTER ||
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.AL_NOOR ||
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.INSTA ||
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.FIRST_RESPONSE
        ) {
          updateVideoEndedIfNeeded();
        } else {
          clearTimeout(timer);
        }
      },
      Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.PRINCECOURT
        ? 2000
        : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ADVENTA
        ? 2000
        : 6000,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  //Local storage fetch
  const getNotificationCount = async () => {
    return await Utilities.getNotificationCount();
  };
  const getIsUserLoggedIn = async () => {
    return await StorageManager.getIsAuthorized();
  };
  const getJWTToken = async () => {
    return await StorageManager.getSavedToken();
  };
  const getUserDetails = async () => {
    return await StorageManager.getUserDetails();
  };
  const getSelectedBusinessDetails = async () => {
    return await StorageManager.getBusinessDetails();
  };
  // const getUrlType = async () => {
  //   const urlType = await StorageManager.getBaseURLType();
  //   if (urlType === null || urlType === undefined) {
  //     StorageManager.saveBaseURL('Prod', APIConnections.DEFAULT_URL);
  //   }
  //   const _urlType =
  //     urlType !== null || urlType === undefined ? urlType : 'Prod';
  //   APIConnections.URL_TYPE = _urlType;
  //   console.log('App getUrlType: ', _urlType);
  //   return urlType;
  // };

  const getBaseURL = async () => {
    const baseURL = await StorageManager.getBaseURL();
    if (baseURL === null || baseURL === undefined) {
      StorageManager.saveBaseURL('Prod', APIConnections.DEFAULT_URL);
    }
    const _baseURL =
      baseURL !== null || baseURL === undefined
        ? baseURL
        : APIConnections.DEFAULT_URL;
    APIConnections.BASE_URL = _baseURL;
    console.log('App getBaseURL: ', _baseURL);
    return _baseURL;
  };
  const updateVideoEndedIfNeeded = () => {
    console.log('updateVideoEndedIfNeeded called');
    setIsVideoEnded(true);
    navigateToScreen();
  };
  const updateUserInfo = info => {
    console.log('userAuthInfo: ', info);

    var _userInfo = Globals.USER_DETAILS;
    _userInfo.pinGenerated = info.pinGenerated;
    _userInfo.enablePinAuthentication = info.enablePinAuthentication;
    _userInfo.canAddVisit = info.canAddVisit;
    _userInfo.menus = info.menus;
    _userInfo.allowAppUse = info.allowAppUse;
    _userInfo.roleDetails = info.roleDetails;
    _userInfo.role_id.canServe = info.roleDetails.canServe;
    _userInfo.role_id.isAdmin = info.roleDetails.isAdmin;

    //update user info
    StorageManager.saveUserDetails(_userInfo);
    Globals.USER_DETAILS = _userInfo;
    console.log('updated user info: ', _userInfo);

    //let isAccessTo = Utilities.isAccess(AccessModules.appointments, AccessPermissions.view);
    // console.log('isAccessTo: ', isAccessTo);
  };

  const navigateToScreen = async () => {
    configureKeyboardManager();
    if (Globals.IS_AUTHORIZED === true) {
      if (isAPILoaded === true && isVideoEnded === true) {
        //Navigate to dashboard
        navigation.reset({
          index: 0,
          routes: [{name: 'DashboardScreen'}],
        });
      }
    } else {
      //Check for standalone build to navigate to login
      if (Globals.IS_STANDALONE_BUILD === true) {
        if (isAPILoaded === true && isVideoEnded === true) {
          checkAuthType(Globals.BUSINESS_DETAILS);
        }
      } else {
        //Navigate to business selection
        navigation.reset({
          index: 0,
          routes: [{name: 'BusinessSelectionScreen'}],
        });
      }
    }
  };
  /**
          *
          * Purpose: Change base url action
          * Created/Modified By: Jenson
          * Created/Modified Date: 28 Dec 2021
          * Steps:
              1.Check authentication type and navigate.
  */
  const checkAuthType = businessDetails => {
    configureKeyboardManager();
    if (businessDetails !== undefined && businessDetails !== null) {
      if (businessDetails.authenticationType?.length > 0) {
        if (businessDetails.authenticationType?.includes('email')) {
          //Navigate to Email login page
          navigation.reset({
            index: 0,
            routes: [{name: 'EmailLoginScreen'}],
          });
        } else {
          //Navigate to Phone number login page
          navigation.reset({
            index: 0,
            routes: [{name: 'PhoneLoginScreen'}],
          });
        }
      }
    }
  };

  const configureKeyboardManager = () => {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setToolbarTintColor(Colors.PRIMARY_COLOR);
      KeyboardManager.setToolbarPreviousNextButtonEnable(true);
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
    }
  };

  //Video delegates
  const onVideoError = () => {
    console.log('video error');
    setIsVideoEnded(true);
    navigateToScreen();
  };
  const onVideoEnd = () => {
    console.log('video ended..');
    setIsPaused(true);
    setTimeout(() => {
      if (refVideo?.current !== null) {
        refVideo?.current?.seek(1, 50);
        setIsPaused(false);
      }
    }, 10);
    setIsVideoEnded(true);
    navigateToScreen();
  };

  //API Calls
  /**
       *
       * Purpose: Get selected business details
       * Created/Modified By: Jenson
       * Created/Modified Date: 28 Dec 2021
       * Steps:
           1.fetch business details from API and append to state variable
*/
  const getBusinessDetails = businessId => {
    DataManager.getBusinessDetails(businessId).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            if (data?.objects !== undefined && data?.objects !== null) {
              //Save business info to local storage
              StorageManager.saveBusinessDetails(data?.objects);
              Globals.BUSINESS_DETAILS = data?.objects;
              Globals.BUSINESS_ID = data?.objects?._id;

              //Update themes
              if (
                data?.objects?.primaryColor !== undefined &&
                data.objects.primaryColor !== null &&
                data.objects.primaryColor !== ''
              ) {
                Colors.PRIMARY_COLOR = data.objects.primaryColor;
              } else {
                Colors.PRIMARY_COLOR = '#FF5264';
              }
              if (
                data?.objects?.secondaryColor !== undefined &&
                data.objects.secondaryColor !== null &&
                data.objects.secondaryColor !== ''
              ) {
                Colors.SECONDARY_COLOR = data.objects.secondaryColor;
              } else {
                Colors.SECONDARY_COLOR = '#5F73FC';
              }

              getUserAuthDetails(Globals.USER_DETAILS?._id);
            }
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
        }
      },
    );
  };
  /**
      *
      * Purpose: Get selected business details
      * Created/Modified By: Jenson
      * Created/Modified Date: 28 Dec 2021
      * Steps:
          1.fetch business details from API and append to state variable
*/
  const getBusinessDetailsWithoutUserDetails = businessId => {
    DataManager.getBusinessDetails(businessId).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            if (data?.objects !== undefined && data?.objects !== null) {
              //Save business info to local storage
              StorageManager.saveBusinessDetails(data?.objects);
              Globals.BUSINESS_DETAILS = data?.objects;
              Globals.BUSINESS_ID = data?.objects?._id;

              //Update themes
              if (
                data?.objects?.primaryColor !== undefined &&
                data.objects.primaryColor !== null &&
                data.objects.primaryColor !== ''
              ) {
                Colors.PRIMARY_COLOR = data.objects.primaryColor;
              } else {
                Colors.PRIMARY_COLOR = '#FF5264';
              }
              if (
                data?.objects?.secondaryColor !== undefined &&
                data.objects.secondaryColor !== null &&
                data.objects.secondaryColor !== ''
              ) {
                Colors.SECONDARY_COLOR = data.objects.secondaryColor;
              } else {
                Colors.SECONDARY_COLOR = '#5F73FC';
              }

              setIsAPILoaded(true);
              //Navigate to next screen
              navigateToScreen();
            }
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
        }
      },
    );
  };

  /**
      *
      * Purpose: Get logged-in user additional details
      * Created/Modified By: Jenson
      * Created/Modified Date: 11 Feb 2022
      * Steps:
          1.fetch user details from API and append to state variable
*/
  const getUserAuthDetails = userId => {
    DataManager.getUserAuthInfo(userId).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data?.objects !== undefined && data?.objects !== null) {
          updateUserInfo(data?.objects);
          setIsAPILoaded(true);
          //Navigate to next screen
          navigateToScreen();
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
      }
    });
  };

  return (
    <>
      {
       Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.FIRST_RESPONSE ? (
    <>
        {/* <View style= {{flex:1, backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
        <Image
              style={{
                height: 180,
                aspectRatio: 2.1,
                resizeMode: 'contain',
                marginTop:-60,
              }}
              source={Images.FIRST_RESPONSE_SPLASH_SCREEN}
            />
        </View> */}
          <ImageBackground
            style={{flex: 1}}
             source={Images.FIRST_RESPONSE_SPLASH_SCREEN}
          />
          </>
      ) :Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.AL_NOOR ? (
        <>
          <ImageBackground
            style={{flex: 1}}
            source={Images.AL_NOOR_SPLASH_IMAGE}
          />
        </>
      ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.INSTA ? (
        // <>
        //   <ImageBackground
        //     style={{flex: 1}}
        //     source={Images.INSTA_LOGO}
        //   />
        // </>
        <View style= {{flex:1, backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
        <Image
              style={{
                height: 180,
                aspectRatio: 2.1,
                resizeMode: 'contain',
                marginTop:-60,
              }}
              source={Images.INSTA_LOGO}
            />
        </View>
      ) :
       Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ASTER ? (
        <>
          {/* <ImageBackground
            style={{flex: 1}}
            source={Images.ASTER_SPLASH_SCREEN}
          /> */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#E2E3E9',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Images.ASTER_LOGO}
              style={{width: 240, height: 240}}
            />
          </View>
        </>
      ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SPOTLESS ? (
        <>
          <ImageBackground
            style={{flex: 1}}
            source={Images.SPOTLESS_SPLASH_IMAGE}
          />
        </>
      ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SKILLIKZ ? (
        <>
          <ImageBackground
            style={{flex: 1, resizeMode: 'contain'}}
            source={Images.SKILLIKZ_SPLASH_ANIMATION}
          />
        </>
      ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.PRINCECOURT ? (
        <>
          <ImageBackground
            style={{flex: 1}}
            source={Images.PRINCE_COURT_SPLASH_SCREEN}
          />
        </>
      ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ADVENTA ? (
        <>
          <ImageBackground
            style={{flex: 1}}
            source={Images.ADVENTA_SPLASH_SCREEN}
          />
        </>
      ) : (
        <Video
          source={splashVideo}
          ref={refVideo}
          style={styles.backgroundVideo}
          resizeMode={'contain'}
          paused={isPaused}
          onEnd={() => onVideoEnd()}
          onError={() => onVideoError()}
        />
      )}
      <Text
        style={{
          color: Colors.TEXT_GREY_COLOR_9B,
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
        {Strings.APP_VERSION}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.WHITE_COLOR,
  },
});

export default SplashScreen;
