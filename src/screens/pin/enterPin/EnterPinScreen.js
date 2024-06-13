import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import {HelperText, TextInput} from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {useRoute} from '@react-navigation/native';

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
import {PINSource} from '../../../helpers/enums/Enums';
import {t} from 'i18next';
import { responsiveWidth,responsiveHeight } from 'react-native-responsive-dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView } from 'react-native';
const EnterPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //Set from parent
  const source = route?.params?.source || PINSource.none;
  const isPasswordChangeSuccess =
    route?.params?.isPasswordChangeSuccess || false;

  //Declaration
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  //Validations
  const [isValidEnteredPin, setIsValidEnteredPin] = useState(true);
  const [otpValidationMessage, setOtpValidationMessage] = useState('');

  //Button actions
  const continueButtonAction = () => {
    Keyboard.dismiss();
    if (isValidInputs() === true) {
      //PIN Verify api call
      performPINVerification();
    }
  };

  const forgotButtonAction = () => {
    Keyboard.dismiss();
    resetValidation();
    //Navigate to forgot PIN flow
    navigation.navigate('ForgotPinScreen');
  };

  //Other functions
  const isValidInputs = () => {
    var _isValidEnteredPin = 0;
    console.log('isValidInputs code: ', enteredPin);
    if (enteredPin.trim().length === 4) {
      setOtpValidationMessage('');
      setIsValidEnteredPin(true);
      _isValidEnteredPin = 1;
    } else {
      setOtpValidationMessage(t(Translations.INVALID_PIN));
      setIsValidEnteredPin(false);
      _isValidEnteredPin = 0;
    }
    if (_isValidEnteredPin === 1) {
      return true;
    } else {
      return false;
    }
  };

  const resetValidation = () => {
    setOtpValidationMessage('');
    setIsValidEnteredPin(true);
  };

  const navigateToPinCreate = _verificationData => {
    //Store user info to temp global object
    Globals.TEMP_USER_DETAILS = _verificationData;
    //Navigate to pin create page
    navigation.push('NewPinScreen');
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
  const performPINVerification = () => {
    setIsLoading(true);
    var userId = '';
    if (Globals.IS_AUTHORIZED === true) {
      userId = Globals.USER_DETAILS._id;
    } else {
      userId = Globals.TEMP_USER_DETAILS._id;
    }
    const body = {
      [APIConnections.KEYS.AUTHENTICATION_PIN]: enteredPin,
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.USER_ID]: userId,
    };
    DataManager.performPINVerification(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          let _verificationData = responseData?.objects;
          if (_verificationData !== undefined && _verificationData !== null) {
            setIsLoading(false);
            if (
              (_verificationData.canResetAuthenticationPin || false) === true
            ) {
              //Navigate to pin reset
              navigateToPinCreate(_verificationData);
            } else if (source === PINSource.forPINChange) {
              if (isPasswordChangeSuccess === true) {
                // UIApplication.shared.keyWindow?.makeToast(self.messages.PINUpdatedSuccess)
                //self.popToViewController(ofClass: UserProfileViewController.self)
              } else {
                //navigate to new pin creation flow
                // let vc = NewPinViewController()
                // vc.source = self.source
                // vc.forOldPasswordChange = true
                // self.push(vc)
                navigateToPinCreate(_verificationData);
              }
            } else {
              //Existing user, Navigate to dashboard
              existingUserAuthorizationSuccess(_verificationData);
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

  return (
    <>
     <KeyboardAwareScrollView
    enableOnAndroid={true}
    extraHeight={responsiveHeight(36)}
    keyboardShouldPersistTaps="always"
    style={{
      flex: 1,
    }}>
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

        <TouchableOpacity
          style={{
            marginTop: 8,
            backgroundColor: Colors.BACKGROUND_COLOR,
            height: 50,
            width: 50,
            marginLeft: 30,
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
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
            textAlign: 'left',
          }}
          numberOfLines={1}>
          {t(Translations.ENTER_PIN)}
        </Text>

        <InputScrollView
          keyboardOffset={110}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
          }}>
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
            {t(Translations.PIN_VERIFY_DESCRIPTION)}
          </Text>

          <View
            style={{
              marginTop: 70,
              marginLeft: 30,
              marginRight: 30,
              alignItems: 'center',
              transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
            }}>
            <OTPInputView
              style={{
                width: responsiveWidth(80),
                height: 100,
              }}
              pinCount={4}
              //code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged={code => setEnteredPin(code)}
              autoFocusOnLoad={false}
              codeInputFieldStyle={{
                width: 45,
                height: 50,
                borderWidth: 0,
                borderBottomWidth: 2,
                borderColor: Colors.OTP_INACTIVE_FIELD_COLOR,
                color: Colors.PRIMARY_TEXT_COLOR,
                fontSize: 24,
                fontFamily: Fonts.Gibson_SemiBold,

                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
              codeInputHighlightStyle={{
                borderColor: Colors.PRIMARY_COLOR,
              }}
              onCodeFilled={code => {
                console.log(`Code is ${code}, you are good to go!`);
              }}
              isRTL={I18nManager?.isRTL ? true : false}
            />
            <HelperText type="error" visible={!isValidEnteredPin}>
              {otpValidationMessage}
            </HelperText>
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
              {t(Translations.VERIFY)}
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
            onPress={() => forgotButtonAction()}>
            <Text
              style={{
                color: Colors.PRIMARY_COLOR,
                fontSize: 14,
                fontFamily: Fonts.Gibson_SemiBold,
                alignSelf: 'center',
              }}>
              {t(Translations.FORGOT_PIN)}
            </Text>
          </TouchableOpacity>
        </InputScrollView>
      </View>
      </KeyboardAwareScrollView>
    </>
  );
};
export default EnterPinScreen;
