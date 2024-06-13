import React, {useState, useRef, useEffect} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {DraxProvider, DraxList, DraxView} from 'react-native-drax';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../constants';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import StorageManager from '../../helpers/storageManager/StorageManager';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import {t} from 'i18next';
import {
  QueueStatus,
  AlertConfirmPopupSource,
  AddVitalType,
} from '../../helpers/enums/Enums';
import {GetImage} from '../shared/getImage/GetImage';
import APIConnections from '../../helpers/apiManager/APIConnections';
import AlertConfirmPopupScreen from '../shared/alertConfirmPopup/AlertConfirmPopupScreen';
import ConsultantFilterPopupScreen from '../shared/consultantFilterPopup/ConsultantFilterPopupScreen';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import NotifyTimeExtensionScreen from './popups/notifyTimeExtension/NotifyTimeExtensionScreen';
import CustomerInfoScreen from './popups/customerInfo/CustomerInfoScreen';
import AddNotesPopupScreen from '../addNotesPopup/AddNotesPopupScreen';
import {TimerViewComponent} from './TimerViewComponent';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';

const ManageQueueHeader = (props) => {
  //redux state for tabletview
  const isTablet = useSelector((state)=>state.tablet.isTablet);
  return (
    <View
      style={{
        height: isTablet===true?65:55,
        flexDirection: 'row',
        marginTop: 8,
        borderBottomColor: Colors.SHADOW_COLOR,
        borderBottomWidth: 0.5,
        backgroundColor: Colors.BACKGROUND_COLOR,
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 16,
          }}>
          <Image
            style={{
              width:isTablet===true? 20:16,
              height: isTablet===true?20:16,
              tintColor: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            source={Images.MORNING_ICON}
          />
          <Text
            style={{
              marginLeft: 8,
              alignSelf: 'center',
              fontFamily: Fonts.Gibson_Regular,
              fontSize:isTablet===true?20:14,
              color: Colors.LAST_VISITED_DATE_COLOR,
            }}>
            {props.morningSessionTime}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginLeft: 16,
            marginTop: 12,
          }}>
          <Image
            style={{
              width: isTablet===true?20:16,
              height: isTablet===true?20:16,
              tintColor: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            source={Images.EVENING_ICON}
          />
          <Text
            style={{
              marginLeft: 8,
              alignSelf: 'center',
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?20:14,
              color: Colors.LAST_VISITED_DATE_COLOR,
            }}>
            {props.eveningSessionTime}
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: Colors.BACKGROUND_COLOR,
          marginLeft:isTablet?235:0,
        }}>
        <TouchableOpacity
          disabled={
            props.availabilityInfo?.sessionInfo?.enableStartButton === true
              ? false
              : props.availabilityInfo?.sessionInfo?.enableEndButton === true
              ? false
              : true
          }
          onPress={() => props.sessionButtonAction()}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 16,
            alignSelf: 'center',
            backgroundColor: Colors.BACKGROUND_COLOR,
          }}>
          <Image
            style={{
              opacity:
                props.availabilityInfo?.sessionInfo?.enableStartButton === true
                  ? 1
                  : props.availabilityInfo?.sessionInfo?.enableEndButton ===
                    true
                  ? 1
                  : 0.5,
              width:isTablet===true?20: 14,
              height: isTablet===true?20:14,
              tintColor:
                props.availabilityInfo?.sessionInfo?.enableStartButton === true
                  ? Colors.START_SESSION_COLOR
                  : props.availabilityInfo?.sessionInfo?.enableEndButton ===
                    true
                  ? Colors.PRIMARY_COLOR
                  : Colors.START_SESSION_COLOR,
            }}
            source={
              props.availabilityInfo?.sessionInfo?.enableStartButton === true
                ? Images.PLAY_ICON
                : props.availabilityInfo?.sessionInfo?.enableEndButton === true
                ? Images.STOP_ICON
                : Images.PLAY_ICON
            }
          />
          <Text
            style={{
              opacity:
                props.availabilityInfo?.sessionInfo?.enableStartButton === true
                  ? 1
                  : props.availabilityInfo?.sessionInfo?.enableEndButton ===
                    true
                  ? 1
                  : 0.5,
              marginLeft: 8,
              fontFamily: Fonts.Gibson_Regular,
              fontSize:isTablet===true?19: 13,
              color: Colors.PRIMARY_TEXT_COLOR,
            }}>
            {props.availabilityInfo?.sessionInfo?.enableStartButton === true
              ? t(Translations.START_SESSION)
              : props.availabilityInfo?.sessionInfo?.enableEndButton === true
              ? t(Translations.STOP_SESSION)
              : t(Translations.SESSION_ENDED)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageQueueHeader;

const styles = StyleSheet.create({});
