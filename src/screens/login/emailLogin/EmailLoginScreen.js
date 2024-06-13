import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  I18nManager,
  BackHandler,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import {HelperText, TextInput} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
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
import RNRestart from 'react-native-restart';
import i18next from 'i18next';
import PasswordTextInput from '../../shared/textInputs/PasswordTextInput';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
// import DeviceInfo from 'react-native-device-info';
const EmailLoginScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  //Validations
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  //refs
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showLanguageSwitchingAlert, setShowLanguageSwitchingAlert] =
    useState(false);
  // const isTablet = DeviceInfo.isTablet();
  //redux state for tabletview
  const isTablet = useSelector(state => state.tablet.isTablet);
  useEffect(() => {
    console.log(' login screen', Globals.BUSINESS_DETAILS);
    return () => {};
  }, []);
  useEffect(() => {
    console.log(
      'Device language is ',
      Globals.DEVICE_LANGUAGE,
      'isLanguageIsChanged',
      Globals.IS_LANGUAGE_CHANGED,
    );
    if (
      Globals.IS_LANGUAGE_CHANGED === false &&
      Globals.DEVICE_LANGUAGE === 'ar'
    ) {
      setShowLanguageSwitchingAlert(true);
    }
    return () => {};
  }, []);
  //Button actions
  const continueButtonAction = () => {
    Keyboard.dismiss();
    if (isValidInputs() === true) {
      //Login api call
      performLogin();
    }
  };
  const forgotButtonAction = () => {
    Keyboard.dismiss();
    resetValidation();
    //Navigate to forgot password screen
    navigation.navigate('ForgotPasswordScreen');
  };

  //Other functions

  const isValidInputs = () => {
    var _isValidEmail = 0;
    var _isValidPassword = 0;
    if (Utilities.isEmailValid(email) !== true) {
      setIsValidEmail(false);
      _isValidEmail = 0;
    } else {
      setIsValidEmail(true);
      _isValidEmail = 1;
    }
    if (password.length > 0) {
      setIsValidPassword(true);
      _isValidPassword = 1;
    } else {
      setIsValidPassword(false);
      _isValidPassword = 0;
    }
    if (_isValidEmail === 1 && _isValidPassword === 1) {
      return true;
    } else {
      return false;
    }
  };

  const resetValidation = () => {
    setIsValidEmail(true);
    setIsValidPassword(true);
    setEmail('');
    setPassword('');
  };

  const proceedToAppEntry = _verificationData => {
    console.log(
      'proceed to app entry func call==============',
      _verificationData,
    );
    if (_verificationData !== undefined && _verificationData !== null) {
      if (_verificationData?.canResetPassword === true) {
        //Navigate to password reset page
        navigateToPasswordReset(_verificationData);
      } else if (
        Utilities.isBusinessPINAuthEnabled() === true &&
        _verificationData?.enablePinAuthentication === true
      ) {
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
  const _languageSwitchingAction = () => {
    i18next.changeLanguage('ar').then(t => {
      StorageManager.saveLanguage('ar');
      StorageManager.saveIsLanguageChanged('CHANGED');
      I18nManager.forceRTL(true);
      setTimeout(() => {
        RNRestart.Restart();
      }, 1000);
    });
  };
  //API Calls
  const performLogin = () => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.USERNAME]: email,
      [APIConnections.KEYS.PASSWORD]: password,
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
    };
    DataManager.performEmailLogin(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          let _verificationData = responseData?.objects;
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
  const backButtonAction = () => {
    BackHandler.exitApp();
  };
  // final return
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
        <LoadingIndicator visible={isLoading} />
        <StatusBar
          backgroundColor={Colors.WHITE_COLOR}
          barStyle="dark-content"
        />
        {/* <InputScrollView
          keyboardOffset={110}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            minHeight: '100%',
          }}> */}
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={responsiveHeight(45)}
          keyboardShouldPersistTaps="always"
          style={
            {
              // flex: 1,
            }
          }>
          <TouchableOpacity
            style={{
              marginTop: responsiveHeight(2),
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
                width: isTablet === true ? 30 : 24,
                height: isTablet === true ? 21 : 17,
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
          </TouchableOpacity>
          {isTablet === true ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  marginTop: responsiveHeight(6),
                  // marginLeft:330,
                  // marginRight: 330,
                  color: Colors.BLACK_COLOR,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: 40,
                  textAlign: 'left',
                }}
                numberOfLines={1}>
                {t(Translations.LOGIN)}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                marginTop: responsiveHeight(6),
                marginLeft: 30,
                marginRight: 30,
                color: Colors.BLACK_COLOR,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize:
                  Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SKILLIKZ
                    ? 20
                    : 28,
                textAlign: 'left',
              }}
              numberOfLines={1}>
              {t(Translations.LOGIN)}
            </Text>
          )}

          {Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ASTER ? (
            <View style={{marginTop: responsiveHeight(1)}}>
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
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.AL_NOOR ? (
            <View style={{marginTop: responsiveHeight(1)}}>
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
            <View style={{marginTop: responsiveHeight(0)}}>
              <Image
                style={{
                  height: isTablet === true ? 175 : 180,
                  aspectRatio: isTablet === true ? 1 : 2.1,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginTop: isTablet ? 5 : 20,
                }}
                source={Images.INSTA_LOGO}
              />
            </View>
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.FIRST_RESPONSE ? (
            <View style={{marginTop: responsiveHeight(1)}}>
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
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.YWAIT  || Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.OMH ? (
            <View style={{marginTop: responsiveHeight(1)}}>
              <Image
                style={{
                  height: 180,
                  aspectRatio: 1,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginTop: responsiveHeight(1),
                }}
                source={Images.YWAIT_LOGO_}
              />
            </View>
          ) : Globals.CUSTOM_BUILD_SOURCE ===
            BUILD_SOURCE.YWAIT_SERVICES_SERVE ? (
            <View style={{marginTop: responsiveHeight(5)}}>
              <Image
                style={{
                  height: 180,
                  aspectRatio: 1,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  // marginTop: responsiveHeight(1),
                }}
                source={Images.YWAIT_LOGO_}
              />
            </View>
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SPOTLESS ? (
            <View style={{marginTop: 10}}>
              <Image
                style={{
                  height: 180,
                  aspectRatio: 2.1,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
                source={Images.SPOTLESS_LOGO}
              />
            </View>
          ) : Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SKILLIKZ ? (
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
            <View style={{marginTop: 0}}>
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

          <View
            style={{
              marginTop:
                Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.ADVENTA
                  ? 10
                  : responsiveHeight(3),
              marginLeft: isTablet === true ? 230 : 30,
              marginRight: isTablet === true ? 230 : 30,
            }}>
            <View
              style={{
                marginTop: isTablet
                  ? responsiveHeight(-5)
                  : responsiveHeight(0),
              }}>
              <TextInput
                ref={emailRef}
                style={{
                  backgroundColor: Colors.TRANSPARENT,
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                  fontSize: isTablet === true ? 20 : 0,
                }}
                activeUnderlineColor={Colors.PRIMARY_COLOR}
                error={!isValidEmail}
                //label={Strings.EMAIL_ADDRESS}
                label={
                  <Text
                    style={{
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet === true ? 20 : 16,
                      color: Colors.TEXT_GREY_COLOR_9B,
                    }}>
                    {t(Translations.EMAIL_ADDRESS)}
                  </Text>
                }
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                autoComplete={'off'}
                autoCorrect={false}
                returnKeyType={'next'}
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
              />
              <HelperText
                type="error"
                visible={!isValidEmail}
                style={{fontSize: isTablet === true ? 15 : 10}}>
                {t(Translations.INVALID_EMAIL_ADDRESS)}
              </HelperText>
            </View>
            <View
              style={{
                marginTop: isTablet
                  ? responsiveHeight(-1.5)
                  : responsiveHeight(2),
              }}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  ref={passwordRef}
                  style={{
                    backgroundColor: Colors.TRANSPARENT,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                    flex: 1,
                    fontSize: isTablet === true ? 20 : 0,
                  }}
                  activeUnderlineColor={Colors.PRIMARY_COLOR}
                  secureTextEntry={!isShowPassword}
                  error={!isValidPassword}
                  //label={Strings.PASSWORD}
                  label={
                    <Text
                      style={{
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: isTablet === true ? 20 : 16,
                        color: Colors.TEXT_GREY_COLOR_9B,
                      }}>
                      {t(Translations.PASSWORD)}
                    </Text>
                  }
                  value={password}
                  onChangeText={text => setPassword(text.trim())}
                  returnKeyType={'done'}
                  onSubmitEditing={() => {
                    continueButtonAction();
                  }}
                />
                <View
                  style={{
                    width: 30,
                    height: 24,
                    position: 'absolute',
                    right: 5,
                    top: 20,
                  }}>
                  <TextInput.Icon
                    style={{width: 24, height: 24}}
                    name={isShowPassword ? 'eye' : 'eye-off-outline'}
                    onPress={() => setIsShowPassword(!isShowPassword)}
                    color={
                      isShowPassword
                        ? Colors.PRIMARY_COLOR
                        : Colors.TEXT_PLACEHOLDER_COLOR
                    }
                  />
                </View>
              </View>

              <HelperText
                type="error"
                visible={!isValidPassword}
                style={{fontSize: isTablet === true ? 20 : 10}}>
                {t(Translations.INVALID_PASSWORD)}
              </HelperText>
            </View>
          </View>

          <TouchableOpacity
            style={{
              marginTop: isTablet ? responsiveHeight(1) : responsiveHeight(4),
              height: isTablet === true ? 25 : 20,
              marginLeft: isTablet === true ? 225 : 30,
              marginRight: isTablet === true ? 225 : 30,
              alignSelf: 'flex-end',
            }}
            onPress={() => forgotButtonAction()}>
            <Text
              style={{
                color: Colors.PRIMARY_COLOR,
                fontSize: isTablet === true ? 20 : 16,
                fontFamily: Fonts.Gibson_Regular,
                alignSelf: 'center',
                textDecorationLine: 'underline',
              }}>
              {t(Translations.FORGOT_PASSWORD)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: responsiveHeight(5),
              backgroundColor: Colors.SECONDARY_COLOR,
              height: 50,
              marginLeft: isTablet === true ? 230 : 30,
              marginRight: isTablet === true ? 230 : 30,
              justifyContent: 'center',
              marginBottom: 20,
            }}
            onPress={() => continueButtonAction()}>
            <Text
              style={{
                color: Colors.WHITE_COLOR,
                fontSize: isTablet === true ? 23 : 18,
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
          {/* </InputScrollView> */}
        </KeyboardAwareScrollView>
      </View>

      <AwesomeAlert
        show={showLanguageSwitchingAlert}
        showProgress={false}
        title={t(Translations.PLEASE_CONFIRM)}
        titleStyle={{
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
        }}
        message={'Do you want to switch the language to device language'}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        animatedValue={0.8}
        cancelText={t(Translations.NO)}
        confirmText={t(Translations.YES)}
        confirmButtonColor={Colors.PRIMARY_COLOR}
        cancelButtonColor={Colors.SECONDARY_COLOR}
        onCancelPressed={() => {
          setShowLanguageSwitchingAlert(false);
        }}
        onConfirmPressed={() => {
          _languageSwitchingAction();
        }}
        cancelButtonStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
        }}
        confirmButtonStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
        }}
        actionContainerStyle={{
          width: '100%',
        }}
        cancelButtonTextStyle={{
          color: Colors.WHITE_COLOR,
          fontFamily: Fonts.Gibson_SemiBold,
        }}
        confirmButtonTextStyle={{
          color: Colors.WHITE_COLOR,
          fontFamily: Fonts.Gibson_SemiBold,
        }}
        messageStyle={{
          textAlign: 'left',
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 15,
        }}
      />
    </>
  );
};
export default EmailLoginScreen;
