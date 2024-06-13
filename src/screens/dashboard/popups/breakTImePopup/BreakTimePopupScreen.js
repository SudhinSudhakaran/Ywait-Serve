import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import moment from 'moment';
import SelectTimePopupScreen from './SelectTimePopupScreens';
import DataManager from '../../../../helpers/apiManager/DataManager';
import APIConnections from '../../../../helpers/apiManager/APIConnections';
import Utilities from '../../../../helpers/utils/Utilities';
import LoadingIndicator from '../../../shared/loadingIndicator/LoadingIndicator';
import MessageAlertModalScreen from '../../../shared/messageAlertModal/MessageAlertModalScreen';
import Modal from 'react-native-modal';
import {t} from 'i18next';
export default function BreakTimePopupScreen(props) {
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [fromTime, setFromTime] = useState(moment());
  const [toTime, setToTime] = useState(moment().add(1, 'hours'));

  const [isModalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const refRBSheetSelectTimePopup = useRef();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME = fromTime;
    Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME = toTime;
  };

  //Button actions
  const closePopupAction = () => {
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  const doneButtonAction = () => {
    performUpdateBreakTime();
  };

  const fromTimeButtonAction = () => {
    Globals.SHARED_VALUES.IS_BREAK_FROM_TIME_SELECTED = true;
    Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME = fromTime;
    refRBSheetSelectTimePopup.current.open();
  };

  const toTimeButtonAction = () => {
    Globals.SHARED_VALUES.IS_BREAK_FROM_TIME_SELECTED = false;
    Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME = toTime;
    refRBSheetSelectTimePopup.current.open();
  };

  //API Calls
  const performUpdateBreakTime = () => {
    setIsLoading(true);
    let _currentTimeZoneOffset = Utilities.getCurrentTimeZoneOffset(false);
    let _fromTime =
      moment(Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME).format(
        'YYYY-MM-DD[T]HH:mm[:00]',
      ) + _currentTimeZoneOffset;
    let _toTime =
      moment(Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME).format(
        'YYYY-MM-DD[T]HH:mm[:00]',
      ) + _currentTimeZoneOffset;

    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.USER_ID]: Globals.USER_DETAILS?._id,
      [APIConnections.KEYS.FROM_TIME]: _fromTime,
      [APIConnections.KEYS.TO_TIME]: _toTime,
    };

    DataManager.performUpdateBreakTime(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoading(false);
          if (props.didUpdatedBreakTime !== undefined) {
            props.didUpdatedBreakTime();
          }
        } else {
          Utilities.showToast('Failed!', message, 'error', 'bottom');
          setAlertMessage(message);
          setModalVisible(true);
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

  const GetBreakTimePopup = () => {
    return (
      <RBSheet
        ref={refRBSheetSelectTimePopup}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
          draggableIcon: {
            backgroundColor: Colors.PRIMARY_TEXT_COLOR,
          },
        }}
        height={300}>
        <SelectTimePopupScreen
          RBSheet={refRBSheetSelectTimePopup}
          didSelectItem={didSelectedTime}
        />
      </RBSheet>
    );
  };

  const didSelectedTime = selectedTime => {
    if (Globals.SHARED_VALUES.IS_BREAK_FROM_TIME_SELECTED === true) {
      setFromTime(selectedTime);
      setToTime(moment(selectedTime).add(1, 'hours'));
      Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME = selectedTime;
      Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME = moment(selectedTime).add(
        1,
        'hours',
      );
      console.log('didSelectedTime from:', selectedTime);
    } else {
      setToTime(selectedTime);
      Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME = selectedTime;
      console.log('didSelectedTime to:', selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <GetBreakTimePopup />
      <MessageAlertModal />
      <LoadingIndicator visible={isLoading} />
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 14,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign: 'left',
        }}>
        {t(Translations.CHOOSE_THE_BREAK_TIME)}
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
      <View
        style={[
          styles.itemsContainer,
          {flexDirection: 'row', justifyContent: 'center'},
        ]}>
        {/* Items */}

        <TouchableOpacity
          onPress={() => fromTimeButtonAction()}
          style={{flex: 0.5, marginTop: 30}}>
          <Text
            style={{
              color: Colors.PRIMARY_TEXT_COLOR,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 14,
              alignSelf: 'center',
            }}>
            {t(Translations.FROM)}:{' '}
            <Text style={{textDecorationLine: 'underline'}}>
              {moment(fromTime).format('hh:mm A')}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={{flex: 0.1, marginTop: 30, justifyContent: 'center'}}>
          <Text
            style={{
              color: Colors.PRIMARY_TEXT_COLOR,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 16,
              alignSelf: 'center',
            }}>
            —
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => toTimeButtonAction()}
          style={{flex: 0.5, marginTop: 30}}>
          <Text
            style={{
              color: Colors.PRIMARY_TEXT_COLOR,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 14,
              alignSelf: 'center',
            }}>
            {t(Translations.TO)}:{' '}
            <Text style={{textDecorationLine: 'underline'}}>
              {moment(toTime).format('hh:mm A')}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => doneButtonAction()}
        style={{
          marginTop: 70,
          justifyContent: 'center',
          backgroundColor: Colors.SECONDARY_COLOR,
          height: 40,
          width: 200,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 16,
            color: Colors.WHITE_COLOR,
          }}>
          {t(Translations.DONE)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 30,
  },
  title: {
    fontFamily: Fonts.Gibson_SemiBold,
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 20,
  },
  itemsContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  items: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemText: {
    fontFamily: Fonts.Gibson_Regular,
    fontSize: 14,
    marginLeft: 16,
    color: Colors.PRIMARY_TEXT_COLOR,
  },
  cancelText: {
    fontFamily: Fonts.Gibson_SemiBold,
    fontSize: 14,
    textAlign: 'center',
  },
});
