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
import {t} from 'i18next';
import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../constants';
import {GetImage} from '../../shared/getImage/GetImage';
import {useFocusEffect} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/core';
import Utilities from '../../../helpers/utils/Utilities';

const BookingConfirmationPopUp = props => {
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'Globals.SELECTED_CUSTOMER_INFO',
        Globals.SELECTED_CUSTOMER_INFO,
      );
      return () => {
        // Globals.SELECTED_CUSTOMER_INFO = {};
        // Globals.SELECTED_DATE_FROM = '';
      };
    }, []),
  );
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
    //Closing bottom sheet
    if (props.refRBSheet !== undefined) {
      if (props.refRBSheet.current !== undefined) {
        props.refRBSheet.current.close();
      }
    }
    const timer = setTimeout(() => {
      //Callback to parent. Delay is to bypass iOS modal presentation
      props.didSelectNo();
    }, 500);
    return () => clearTimeout(timer);
  };

  const yesButtonAction = () => {
    //Closing bottom sheet
    if (props.refRBSheet !== undefined) {
      if (props.refRBSheet.current !== undefined) {
        props.refRBSheet.current.close();
      }
    }
    const timer = setTimeout(() => {
      //Callback to parent. Delay is to bypass iOS modal presentation
      props.didSelectYes();
    }, 500);
    return () => clearTimeout(timer);
  };

  //Final return
  return (
    <View
      style={{
        flex: 1,
      }}>
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 16,
          marginLeft: 16,
          color: Colors.PRIMARY_COLOR,
          alignSelf: 'center',
        }}>
        {t(Translations.CONFIRM_BOOKING)}
      </Text>
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
      <View style={{marginTop: 16, flexDirection: 'row'}}>
        <GetImage
          style={{
            marginLeft: 48,
            width: 93,
            height: 93,
            borderRadius: 93 / 2,
            borderWidth: 2,
            borderColor: Colors.SECONDARY_COLOR,
          }}
          fullName={(
            (Globals.SELECTED_CUSTOMER_INFO?.firstName || 'N/A') +
            ' ' +
            (Globals.SELECTED_CUSTOMER_INFO?.lastName || '')
          ).trim()}
          url={Globals.SELECTED_CUSTOMER_INFO?.image}
        />
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 14,
              marginTop: 20,
              marginLeft: 25,
              color: Colors.PRIMARY_TEXT_COLOR,
              textAlign: 'left',
            }}>
            {Globals.SELECTED_CUSTOMER_INFO?.firstName}{' '}
            {Globals.SELECTED_CUSTOMER_INFO?.lastName}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 14,
              marginTop: 20,
              marginLeft: 25,
              color: Colors.PRIMARY_TEXT_COLOR,
              textAlign: 'left',
            }}>
            {Utilities.getUtcToLocalWithFormat(
              Globals.SELECTED_DATE_FROM,
              'DD MMM YYYY',
            )}{' '}
            at{' '}
            {Utilities.getUtcToLocalWithFormat(
              Globals.SELECTED_DATE_FROM,
              'hh:mm A',
            )}
          </Text>
        </View>
      </View>
      <View style={{flex: 1}} />
      <View
        style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 30}}>
        <TouchableOpacity
          style={{
            width: 80,
            height: 45,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: Colors.SECONDARY_COLOR,
            justifyContent: 'center',
          }}
          onPress={() => noButtonAction()}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 16,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
            }}>
            {t(Translations.NO)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 134,
            height: 45,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: Colors.SECONDARY_COLOR,
            backgroundColor: Colors.SECONDARY_COLOR,
            justifyContent: 'center',
            marginLeft: 15,
          }}
          onPress={() => yesButtonAction()}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 16,
              color: Colors.WHITE_COLOR,
              alignSelf: 'center',
            }}>
            {t(Translations.YES_IAM_SURE)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default BookingConfirmationPopUp;
