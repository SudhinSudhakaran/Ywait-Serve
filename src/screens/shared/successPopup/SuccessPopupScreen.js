import React from 'react';
import {Text, View, Image, TouchableOpacity, I18nManager} from 'react-native';

import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../constants';
import LottieView from 'lottie-react-native';
import {t} from 'i18next';
const SuccessPopupScreen = props => {
  const messageText = Globals.SHARED_VALUES.SUCCESS_MESSAGE;

  //Button actions
  const closePopupAction = () => {
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  const okButtonAction = () => {
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
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
          top: 8,
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
        {messageText}
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
      </View>
    </View>
  );
};
export default SuccessPopupScreen;
