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
import {GetImage} from '../../shared/getImage/GetImage';
import {useFocusEffect} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/core';
import Utilities from '../../../helpers/utils/Utilities';
import LottieView from 'lottie-react-native';
import {t} from 'i18next';

const NotesOptionPopup = props => {
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'Globals.SHARED_VALUES.SELECTED_NOTES_INFO',
        Globals.SHARED_VALUES.SELECTED_NOTES_INFO,
      );
      return () => {
        // Globals.SHARED_VALUES.SELECTED_NOTES_INFO = {};
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

  const onSelectionAction = option => {
    //Closing bottom sheet
    if (props.refRBSheet !== undefined) {
      if (props.refRBSheet.current !== undefined) {
        props.refRBSheet.current.close();
      }
    }
    const timer = setTimeout(() => {
      //Callback to parent. Delay is to bypass iOS modal presentation
      props.handleOptionSelection(option);
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
          color: Colors.PRIMARY_TEXT_COLOR,
          marginTop: 20,
          marginLeft: 30,
          textAlign: 'left',
        }}>
        {t(Translations.SELECT_AN_OPTION)}
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
      {Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.notes?.trim().length === 0 &&
      Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.images?.length === 0 ? (
        <TouchableOpacity
          onPress={() => onSelectionAction('ADD_NOTES')}
          style={{
            marginHorizontal: 30,
            marginTop: 30,
            justifyContent: 'center',
            height: 30,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.Gibson_SemiBold,
              color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
              textAlign: 'left',
            }}>
            {t(Translations.ADD_NOTE)}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => onSelectionAction('EDIT_NOTES')}
            style={{
              marginHorizontal: 30,
              marginTop: 40,
              justifyContent: 'center',
              height: 30,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.Gibson_SemiBold,
                color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                textAlign: 'left',
              }}>
              {t(Translations.EDIT_NOTE)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSelectionAction('DELETE_NOTES')}
            style={{
              marginHorizontal: 30,
              marginTop: 20,
              justifyContent: 'center',
              height: 30,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.Gibson_SemiBold,
                color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                textAlign: 'left',
              }}>
              {t(Translations.DELETE_NOTE)}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
export default NotesOptionPopup;
