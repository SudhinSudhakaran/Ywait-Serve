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

import {Fonts, Strings, Colors, Images, Globals,Translations} from '../../../constants';
import {GetImage} from '../../shared/getImage/GetImage';
import {useFocusEffect} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/core';
import Utilities from '../../../helpers/utils/Utilities';
import LottieView from 'lottie-react-native';
import {t} from 'i18next';
const QueueSuccessPopUp = props => {
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
        props.onClosePopup();
      }
    }
  };

  const okButtonAction = () => {
    //Closing bottom sheet
    if (props.refRBSheet !== undefined) {
      if (props.refRBSheet.current !== undefined) {
        props.refRBSheet.current.close();
        props.onClosePopup();
      }
    }

    // const timer = setTimeout(() => {
    //     //Callback to parent. Delay is to bypass iOS modal presentation
    //     props.didSelectNo();
    // }, 500);
    // return () => clearTimeout(timer);
  };

  const viewDetailsButtonAction = () => {
    //Closing bottom sheet
    if (props.refRBSheet !== undefined) {
      if (props.refRBSheet.current !== undefined) {
        props.refRBSheet.current.close();
      }
    }
    const timer = setTimeout(() => {
      //Callback to parent. Delay is to bypass iOS modal presentation
      props.viewDetails();
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
          color: Colors.BOOKING_SUCCESS_GREEN_COLOR,
          alignSelf: 'center',
        }}>
        {t(Translations.DONE)}
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
      <LottieView
        style={{
          position: 'absolute',
          top: -5,
          alignSelf: 'center',
          width: 180,
          height: 180,
        }}
        source={Images.SUCCESS_ANIMATION}
        autoPlay
        loop={false}
        colorFilters={[
          {
            keypath: 'Shape Layer 1',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 4',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 6',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 7',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 3',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 8',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 5',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 2',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Capa 1/confirmation Outlines',
            color: Colors.SECONDARY_COLOR,
          },
          {
            keypath: 'Shape Layer 9',
            color: Colors.PRIMARY_COLOR,
          },
        ]}
      />
      <View style={{marginTop: 106, flexDirection: 'row'}}>
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
      <Text
        style={{
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 14,
          marginTop: 16,
          marginBottom: 18,
          alignSelf: 'center',
          color: Colors.PRIMARY_TEXT_COLOR,
        }}>
        {t(Translations.YOUR_QUEUE_IS_CONFIRMED)}
      </Text>
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
          onPress={() => okButtonAction()}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 16,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
            }}>
            {t(Translations.OK)}
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
          onPress={() => viewDetailsButtonAction()}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 16,
              color: Colors.WHITE_COLOR,
              alignSelf: 'center',
            }}>
            {t(Translations.VIEW_DETAILS)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default QueueSuccessPopUp;
