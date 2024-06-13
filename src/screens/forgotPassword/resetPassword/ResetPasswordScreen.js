import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  I18nManager,Dimensions
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import {HelperText, TextInput} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations
} from '../../../constants';
import Utilities from '../../../helpers/utils/Utilities';
import DataManager from '../../../helpers/apiManager/DataManager';
import LoadingIndicator from '../../shared/loadingIndicator/LoadingIndicator';
import StorageManager from '../../../helpers/storageManager/StorageManager';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import MessageAlertModalScreen from '../../shared/messageAlertModal/MessageAlertModalScreen';
import {t} from 'i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  //Declaration
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  //Validations
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('');
  //refs
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  //Button actions
  const continueButtonAction = () => {
    Keyboard.dismiss();
    if (isValidInputs() === true) {
      //api call
      performResetPassword();
    }
  };

  const cancelButtonAction = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  //Other functions
  const isValidInputs = () => {
    var _isValidPassword = 0;
    var _isValidConfirmPassword = 0;
    if (password.length === 0) {
      setPasswordErrorMessage(t(Translations.NEW_PASSWORD_IS_REQUIRED));
      setIsValidPassword(false);
      _isValidPassword = 0;
    } else if (password.length < 8 && password.length > 0) {
      setPasswordErrorMessage(
        t(Translations.PASSWORD_MIN_LENGTH_VALIDATION_TEXT),
      );
      setIsValidPassword(false);
      _isValidPassword = 0;
    } else {
      setPasswordErrorMessage('');
      setIsValidPassword(true);
      _isValidPassword = 1;
    }
    if (confirmPassword.length > 0) {
      if (confirmPassword === password) {
        setConfirmPasswordErrorMessage('');
        setIsValidConfirmPassword(true);
        _isValidConfirmPassword = 1;
      } else {
        setConfirmPasswordErrorMessage(t(Translations.PASSWORD_DO_NOT_MATCH));
        setIsValidConfirmPassword(false);
        _isValidConfirmPassword = 0;
      }
    } else {
      setConfirmPasswordErrorMessage(
        t(Translations.CONFIRM_PASSWORD_IS_REQUIRED),
      );
      setIsValidConfirmPassword(false);
      _isValidConfirmPassword = 0;
    }
    if (_isValidConfirmPassword === 1 && _isValidPassword === 1) {
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
  const performResetPassword = () => {
    setIsLoading(true);
    var userId = '';
    if (Globals.IS_AUTHORIZED === true) {
      userId = Globals.USER_DETAILS._id;
    } else {
      userId = Globals.TEMP_USER_DETAILS._id;
    }
    const body = {
      [APIConnections.KEYS.USER_ID]: userId,
      [APIConnections.KEYS.PASSWORD]: password,
    };
    DataManager.performPasswordReset(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          //Email Login API call
          performLogin();
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

  const performLogin = () => {
    var userEmail = '';
    if (Globals.IS_AUTHORIZED === true) {
      userEmail = Globals.USER_DETAILS.email;
    } else {
      userEmail = Globals.TEMP_USER_DETAILS.email;
    }
    const body = {
      [APIConnections.KEYS.USERNAME]: userEmail,
      [APIConnections.KEYS.PASSWORD]: password,
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
    };
    DataManager.performEmailLogin(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          let _verificationData = responseData?.objects;
          if (_verificationData !== undefined && _verificationData !== null) {
            setIsLoading(false);
            //Check app use permission
            if (_verificationData.allowAppUse === true) {
              if (_verificationData.role_id?.canServe === true) {
                proceedToAppEntry(_verificationData);
              } else if (Utilities.isAllowNonConsultantLogin() === true) {
                //NON consultant user login enabled for selected business
                proceedToAppEntry(_verificationData);
              } else if (Utilities.isOMHBuild() === true) {
                //NON consultant user login only for OMH business
                proceedToAppEntry(_verificationData);
              } else {
                Utilities.showToast(
                  t(Translations.FAILED),
                  Strings.NOT_AUTH_TO_USE_APP,
                  'error',
                  'bottom',
                );
              }
            } else {
              Utilities.showToast(
                t(Translations.FAILED),
                Strings.NOT_AUTH_TO_USE_APP,
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

  const MessageAlertModal = () => {
    return (
      <Modal
        isVisible={isModalVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => {
          messageAlertOkButtonHandler();
        }}>
        <MessageAlertModalScreen
          onOkAction={messageAlertOkButtonHandler}
          message={alertMessage}
        />
      </Modal>
    );
  };

  const messageAlertOkButtonHandler = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.BACKGROUND_COLOR,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={220}
          extraScrollHeight={50}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={{}}
          contentContainerStyle={{height: Dimensions.get('window').height}}>
          <MessageAlertModal />
          <LoadingIndicator visible={isLoading} />
          <StatusBar
            backgroundColor={Colors.BACKGROUND_COLOR}
            barStyle="dark-content"
          />
          <TouchableOpacity
            style={{
              marginTop: 8,
              backgroundColor: Colors.TRANSPARENT,
              height: 50,
              width: 50,
              marginLeft: 30,
              justifyContent: 'center',
            }}
            onPress={() => cancelButtonAction()}>
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
              marginTop: 16,
              marginLeft: 30,
              marginRight: 30,
              color: Colors.BLACK_COLOR,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 28,
            }}
            numberOfLines={1}>
            {t(Translations.RESET_PASSWORD)}
          </Text>

          <Text
            style={{
              marginTop: 64,
              marginLeft: 30,
              marginRight: 30,
              color: Colors.BLACK_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 17,
              textAlign: 'left',
            }}
            numberOfLines={3}>
            {t(Translations.RESET_PASSWORD_DESCRIPTION)}
          </Text>

          <View style={{marginTop: 50, marginLeft: 30, marginRight: 30}}>
            <View style={{}}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  ref={passwordRef}
                  style={{
                    backgroundColor: Colors.TRANSPARENT,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                    flex: 1,
                  }}
                  activeUnderlineColor={Colors.PRIMARY_COLOR}
                  secureTextEntry={!isShowPassword}
                  error={!isValidPassword}
                  //label={Strings.PASSWORD}
                  label={
                    <Text
                      style={{
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: 16,
                        color: Colors.TEXT_GREY_COLOR_9B,
                      }}>
                      {t(Translations.NEW_PASSWORD)}
                    </Text>
                  }
                  value={password}
                  onChangeText={text => setPassword(text.trim())}
                  returnKeyType={'default'}
                  onSubmitEditing={() => {
                    confirmPasswordRef.current.focus();
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

              <HelperText type="error" visible={!isValidPassword}>
                {passwordErrorMessage}
              </HelperText>
            </View>
            <View style={{marginTop: 8}}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  ref={confirmPasswordRef}
                  style={{
                    backgroundColor: Colors.TRANSPARENT,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                    flex: 1,
                  }}
                  activeUnderlineColor={Colors.PRIMARY_COLOR}
                  secureTextEntry={!isShowConfirmPassword}
                  error={!isValidConfirmPassword}
                  //label={Strings.PASSWORD}
                  label={
                    <Text
                      style={{
                        fontFamily: Fonts.Gibson_Regular,
                        fontSize: 16,
                        color: Colors.TEXT_GREY_COLOR_9B,
                      }}>
                      {t(Translations.CONFIRM_PASSWORD)}
                    </Text>
                  }
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  returnKeyType={'default'}
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
                    name={isShowConfirmPassword ? 'eye' : 'eye-off-outline'}
                    onPress={() =>
                      setIsShowConfirmPassword(!isShowConfirmPassword)
                    }
                    color={
                      isShowConfirmPassword
                        ? Colors.PRIMARY_COLOR
                        : Colors.TEXT_PLACEHOLDER_COLOR
                    }
                  />
                </View>
              </View>

              <HelperText type="error" visible={!isValidConfirmPassword}>
                {confirmPasswordErrorMessage}
              </HelperText>
            </View>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 60,
              backgroundColor: Colors.SECONDARY_COLOR,
              height: 50,
              marginLeft: 30,
              marginRight: 30,
              justifyContent: 'center',
            }}
            onPress={() => continueButtonAction()}>
            <Text
              style={{
                color: Colors.WHITE_COLOR,
                fontSize: 18,
                fontFamily: Fonts.Gibson_SemiBold,
                alignSelf: 'center',
              }}>
              {t(Translations.RESET_NOW)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: Colors.TRANSPARENT,
              height: 40,
              marginLeft: 30,
              marginRight: 30,
              justifyContent: 'center',
              marginBottom: 20,
            }}
            onPress={() => cancelButtonAction()}>
            <Text
              style={{
                color: Colors.PRIMARY_COLOR,
                fontSize: 14,
                fontFamily: Fonts.Gibson_SemiBold,
                alignSelf: 'center',
              }}>
              {t(Translations.CANCEL)}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};
export default ResetPasswordScreen;
