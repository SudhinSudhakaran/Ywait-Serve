import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  I18nManager,
  BackHandler,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import {HelperText, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../constants';
import Utilities from '../../../helpers/utils/Utilities';
import DataManager from '../../../helpers/apiManager/DataManager';
import LoadingIndicator from '../../shared/loadingIndicator/LoadingIndicator';
import StorageManager from '../../../helpers/storageManager/StorageManager';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import {BUILD_SOURCE} from '../../../helpers/enums/Enums';
import {t} from 'i18next';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const PhoneLoginScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  //Validations
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  //refs
  const phoneNumberRef = useRef();

  //Button actions
  const continueButtonAction = () => {
    Keyboard.dismiss();
    if (isValidInputs() === true) {
      //Login api call
      performLogin();
    }
  };

  //Other functions
  const isValidInputs = () => {
    var _isValidPhone = 0;
    if (phoneNumber.trim().length > 9 && phoneNumber.trim().length < 15) {
      setIsValidPhoneNumber(true);
      _isValidPhone = 1;
    } else {
      setIsValidPhoneNumber(false);
      _isValidPhone = 0;
    }
    if (_isValidPhone === 1) {
      return true;
    } else {
      return false;
    }
  };
  const proceedToAppEntry = _verificationData => {
    if (_verificationData !== undefined && _verificationData !== null) {
      if (_verificationData?.canResetPassword === true) {
        //Navigate to password reset page
        navigateToPasswordReset(_verificationData);
      } else if (_verificationData?.enablePinAuthentication === true) {
        if (_verificationData?.pinGenerated === true) {
          //Navigate to pin verify page
          navigateToPinVerify(_verificationData);
        } else {
          //Navigate to pin create page
          navigateToPinCreate(_verificationData);
        }
      } else {
        //Existing user, Navigate to dashboard
        existingUserAuthorizationSuccess(_verificationData);
      }
    }
  };
  const navigateToPasswordReset = _verificationData => {
    //Store user info to temp global object
    Globals.TEMP_USER_DETAILS = _verificationData;
    //Navigate to pin verify page
    navigation.navigate('ResetPasswordScreen');
  };

  const navigateToPinVerify = _verificationData => {
    //Store user info to temp global object
    Globals.TEMP_USER_DETAILS = _verificationData;
    //Navigate to pin verify page
    navigation.navigate('EnterPinScreen');
  };

  const navigateToPinCreate = _verificationData => {
    //Store user info to temp global object
    Globals.TEMP_USER_DETAILS = _verificationData;
    //Navigate to pin create page
    navigation.navigate('NewPinScreen');
  };

  const existingUserAuthorizationSuccess = _verificationData => {
    StorageManager.saveUserDetails(_verificationData);
    Globals.USER_DETAILS = _verificationData;
    Globals.TEMP_USER_DETAILS = {};
    //Navigate to dashboard
    navigation.reset({
      index: 0,
      routes: [{name: 'DashboardScreen'}],
    });
  };
  //API Calls
  const performLogin = () => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.PHONE_NUMBER]: phoneNumber,
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
    };
    DataManager.performPhoneLogin(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        let _verificationData = data?.objects;
        if (_verificationData !== undefined && _verificationData !== null) {
          //Check app use permission
          if (_verificationData.allowAppUse === true) {
            if (_verificationData.role_id?.canServe === true) {
              proceedToAppEntry(_verificationData);
              setIsLoading(false);
            } else if (Utilities.isAllowNonConsultantLogin() === true) {
              //NON consultant user login enabled for selected business
              proceedToAppEntry(_verificationData);
              setIsLoading(false);
            } else if (Utilities.isOMHBuild() === true) {
              //NON consultant user login only for OMH business
              proceedToAppEntry(_verificationData);
              setIsLoading(false);
            } else {
              Utilities.showToast(
                t(Translations.FAILED),
                t(Translations.NOT_AUTH_TO_USE_APP),
                'error',
                'bottom',
              );
              setIsLoading(false);
            }
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              t(Translations.NOT_AUTH_TO_USE_APP),
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
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };
  const backButtonAction = () => {
    BackHandler.exitApp();
  };
  return (
    <>
     <KeyboardAwareScrollView
    enableOnAndroid={true}
    extraHeight={responsiveHeight(28)}
    backgroundColor={Colors.WHITE_COLOR}
    keyboardShouldPersistTaps="always"
    style={{
      flex: 1,
    }}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE_COLOR,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}>
        <LoadingIndicator visible={isLoading} />
        <StatusBar
          backgroundColor={Colors.WHITE_COLOR}
          barStyle="dark-content"
        />
        <InputScrollView
          keyboardOffset={110}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            style={{
              marginTop: 8,
              backgroundColor: Colors.TRANSPARENT,
              height: 50,
              width: 50,
              marginLeft: 30,
              justifyContent: 'center',
            }}
            onPress={() => backButtonAction()}>
            <Image
              source={Images.BACK_ARROW_IMAGE}
              style={{
                width: 24,
                height: 17,
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 58,
              marginLeft: 30,
              marginRight: 30,
              color: Colors.BLACK_COLOR,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 28,
            }}
            numberOfLines={1}>
            {t(Translations.LOGIN)}
          </Text>

          {Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ASTER ? (
            <View style={{marginTop: 10}}>
              <Image
                style={{
                  height: 180,
                  aspectRatio: 2.1,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
                source={Images.ASTER_LOGO}
              />
            </View>
          ) :   Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.YWAIT   || Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.OMH? (
              <View style={{marginTop: responsiveHeight(2.5)}}>
          <Image
            style={{
              height: 180,
              aspectRatio: 1.1,
              alignSelf: 'center',
              resizeMode: 'contain',
              marginTop: responsiveHeight(1),
            }}
            source={Images.YWAIT_LOGO_}
          />
        </View> ) :
         Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.YWAIT_SERVICES_SERVE ? (
          <View style={{marginTop: responsiveHeight(2.5)}}>
      <Image
        style={{
          height: 180,
          aspectRatio: 1.1,
          alignSelf: 'center',
          resizeMode: 'contain',
          marginTop: responsiveHeight(1),
        }}
        source={Images.YWAIT_LOGO_}
      />
    </View> ) :
          Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.AL_NOOR ? (
            <View style={{marginTop: 10}}>
              <Image
                style={{
                  height: 180,
                  aspectRatio: 2.1,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
                source={Images.AL_NOOR_LOGO}
              />
            </View>
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.INSTA ? (
            <View style={{marginTop: 10}}>
              <Image
                style={{
                  height: 180,
                  aspectRatio: 2.1,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
                source={Images.INSTA_LOGO}
              />
            </View>
             ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.FIRST_RESPONSE ? (
              <View style={{marginTop: 10}}>
                <Image
                  style={{
                    height: 150,
                    aspectRatio: 2.1,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                    marginTop: 20,
                  }}
                  source={Images.FIRST_RESPONSE_IMAGE}
                />
              </View>
        

          ): Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SKILLIKZ ? (
            <View style={{marginTop: -20}}>
              <Image
                style={{
                  height: 96,
                  width: 104,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={Images.SKILLIKZ_Q_PINK}
              />
              <Image
                style={{
                  marginTop: 8,
                  height: 35,
                  width: 155,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={Images.SKILLIKZ_Q_TEXT}
              />
            </View>
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.PRINCECOURT ? (
            <View style={{marginTop: 10}}>
              <Image
                style={{
                  height: 136,
                  width: 144,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={Images.PRINCE_COURT_ICON}
              />
              {/* <Image
                style={{
                  marginTop: 8,
                  height: 35,
                  width: 155,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={Images.SKILLIKZ_Q_TEXT_IMAGE}
              /> */}
            </View>
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ADVENTA ? (
            <View style={{marginTop: 10}}>
              <Image
                style={{
                  height: 250,
                  width: 250,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={Images.ADVENTA_ICON}
              />
              {/* <Image
                style={{
                  marginTop: 8,
                  height: 35,
                  width: 155,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={Images.SKILLIKZ_Q_TEXT_IMAGE}
              /> */}
            </View>
          ) : null}

          <Text
            style={{
              marginTop: 40,
              marginLeft: 30,
              marginRight: 30,
              color: Colors.BLACK_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 17,
            }}
            numberOfLines={3}>
            {t(Translations.PHONE_LOGIN_DESCRIPTION)}
          </Text>

          <View
            style={{
              marginTop:
                Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ADVENTA ? 20 : 70,
              marginLeft: 30,
              marginRight: 30,
            }}>
            <View style={{}}>
              <TextInput
                ref={phoneNumberRef}
                style={{backgroundColor: Colors.TRANSPARENT}}
                activeUnderlineColor={Colors.PRIMARY_COLOR}
                error={!isValidPhoneNumber}
                //label={Strings.MOBILE_NUMBER}
                label={
                  <Text
                    style={{
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 20,
                      color: Colors.TEXT_GREY_COLOR_9B,
                    }}>
                    {t(Translations.MOBILE_NUMBER)}
                  </Text>
                }
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
                keyboardType={'phone-pad'}
                autoCapitalize={'none'}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  continueButtonAction();
                }}
              />
              <HelperText type="error" visible={!isValidPhoneNumber}>
                {t(Translations.INVALID_PHONE_NUMBER)}
              </HelperText>
            </View>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 40,
              backgroundColor: Colors.SECONDARY_COLOR,
              height: 50,
              marginLeft: 30,
              marginRight: 30,
              justifyContent: 'center',
              marginBottom: 20,
            }}
            onPress={() => continueButtonAction()}>
            <Text
              style={{
                color: Colors.WHITE_COLOR,
                fontSize: 18,
                fontFamily: Fonts.Gibson_SemiBold,
                alignSelf: 'center',
              }}>
              {t(Translations.CONTINUE)}
            </Text>
          </TouchableOpacity>
          {Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SKILLIKZ ? (
            <View style={{marginTop: 30, marginBottom: 16}}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: Colors.BLACK_COLOR,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 13,
                }}>
                Powered by
              </Text>
              <Image
                style={{
                  width: 150,
                  height: 50,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={Images.SKILLIKZ_BLUE_TEXT_LOGO_IMAGE}
              />
            </View>
          ) : null}
        </InputScrollView>
      </View>
      </KeyboardAwareScrollView>
    </>
  );
};
export default PhoneLoginScreen;
