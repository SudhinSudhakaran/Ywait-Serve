import {t} from 'i18next';
import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  I18nManager,
} from 'react-native';

import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../constants';

const RefundConfirmationPopup = props => {
  //Button actions
  const closePopupAction = () => {
    //Closing bottom sheet
    if (props.refRBSheet !== undefined) {
      if (props.refRBSheet.current !== undefined) {
        props.refRBSheet.current.close();
      }
    }
  };

  const noButtonAction = () => {
    if (props.didSelectNo !== undefined && props.didSelectNo !== null) {
      props.didSelectNo();
    }
  };

  const yesButtonAction = () => {
    if (props.didSelectYes !== undefined && props.didSelectYes !== null) {
      props.didSelectYes();
    }
  };

  //Final return
  return (
    <View
      style={{
        flex: 1,
      }}>
      {/* title */}
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{
            width: 25,
            height: 25,
            tintColor: Colors.SECONDARY_COLOR,
            marginTop: 15,
            marginLeft: 15,
          }}
          source={Images.WARNING_ICON}
        />
        <Text
          style={{
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 16,
            marginLeft: 16,
            color: Colors.PRIMARY_TEXT_COLOR,
            marginTop: 20,
            textAlign: 'left',
          }}>
          {t(Translations.PLEASE_CONFIRM)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => closePopupAction()}>
        <Image
          style={{
            position: 'absolute',
            right: 20,
            top: -16,
            tintColor: Colors.PRIMARY_TEXT_COLOR,
          }}
          source={Images.CLOSE_ICON}
        />
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 50,

          color: Colors.PRIMARY_TEXT_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 14,
          textAlign: 'center',
        }}>
        {t(Translations.ARE_YOU_SURE_WANT_TO_CONFIRM)}
      </Text>
      <Text
        style={{
          marginLeft: '25%',
          marginRight: '25%',
          color: Colors.PRIMARY_TEXT_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 14,
          textAlign: 'center',
        }}>
        {t(Translations.REFUND_PAYMENT)}
      </Text>
      <View style={{flex: 1}} />

      <View
        style={{
          marginBottom: 50,
          marginLeft: 20,
          marginRight: 20,
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => noButtonAction()}
          style={{
            width: 80,
            height: 50,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.SECONDARY_COLOR,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              marginLeft: 8,
              marginRight: 8,
              color: Colors.SECONDARY_COLOR,
              fontSize: 16,
              fontFamily: Fonts.Gibson_Regular,
              alignSelf: 'center',
            }}>
            {t(Translations.NO)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => yesButtonAction()}
          style={{
            marginLeft: 16,
            width: 140,
            height: 50,
            borderRadius: 8,
            borderColor: Colors.SECONDARY_COLOR,
            borderWidth: 1,
            backgroundColor: Colors.SECONDARY_COLOR,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              marginLeft: 8,
              marginRight: 8,
              color: Colors.WHITE_COLOR,
              fontSize: 16,
              fontFamily: Fonts.Gibson_Regular,
              alignSelf: 'center',
            }}>
            {t(Translations.YES_IAM_SURE)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default RefundConfirmationPopup;
