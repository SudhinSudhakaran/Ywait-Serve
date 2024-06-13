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
import {t} from 'i18next';
import Utilities from '../../../helpers/utils/Utilities';
import { useSelector } from 'react-redux';
const AlertConfirmPopupScreen = props => {
   //redux state for tabletview
   const isTablet = useSelector((state)=>state.tablet.isTablet);
  //Button actions
  const closePopupAction = () => {
    if(props?.hideText === true){
      props?.setHideText(false);
    }
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  const noButtonAction = () => {
    if(props?.hideText === true){
      props?.setHideText(false);
    }
    if (props.didSelectNo !== undefined && props.didSelectNo !== null) {
      props.didSelectNo();
    }
  };

  const yesButtonAction = () => {
    if(props?.hideText === true){
      props?.setHideText(false);
    }
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
            width:isTablet===true?35: 25,
            height: isTablet===true?35:25,
            tintColor: Colors.SECONDARY_COLOR,

            marginLeft: 15,
          }}
          source={Images.WARNING_ICON}
        />
        <Text
          style={{
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: isTablet===true?22:16,
            marginLeft: 16,
            color: Colors.PRIMARY_TEXT_COLOR,
            marginTop: 5,
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
            top: -22,
            tintColor: Colors.PRIMARY_TEXT_COLOR,
          }}
          source={Images.CLOSE_ICON}
        />
      </TouchableOpacity>
      <View style={{flex: 1}} />

      {props?.hideText && Globals.BUSINESS_DETAILS.enableCancellationFee ? (
        <Text
          style={{
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 14,
            marginBottom: 18,
            alignSelf: 'center',
            color: Colors.PRIMARY_TEXT_COLOR,
            marginHorizontal: 15,
            textAlign: 'center',
          }}>
          {t(Translations.A_FEE_OF)}{' '}
          {Globals.BUSINESS_DETAILS.fineForCancellation.factor === 'percentage'
            ? Globals.BUSINESS_DETAILS.fineForCancellation.figure + '%'
            : Utilities.getCurrencyFormattedPrice(
                Globals.BUSINESS_DETAILS.fineForCancellation.figure,
              )}{' '}
          {t(
            Translations.WILL_BE_APPLICABLE_UPON_CANCELLATION_ARE_YOU_SURE_TO_CANCEL_THIS_APPOINTMENT,
          )}
        </Text>
      ) : 
      <Text
        style={{
          marginTop: 50,
          marginLeft: '25%',
          marginRight: '25%',
          color: Colors.PRIMARY_TEXT_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: isTablet===true?20:14,
          textAlign: 'center',
        }}>
        {Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE}
      </Text>
}
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
              fontSize: isTablet===true?20:16,
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
              fontSize: isTablet===true?20:16,
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
export default AlertConfirmPopupScreen;
