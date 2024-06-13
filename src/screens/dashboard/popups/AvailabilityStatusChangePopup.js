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
} from '../../../constants';
import RADIO_ON_ICON from '../../../assets/images/radioButtonON.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BreakTimePopupScreen from './breakTImePopup/BreakTimePopupScreen';
import LoadingIndicator from '../../shared/loadingIndicator/LoadingIndicator';
import MessageAlertModalScreen from '../../shared/messageAlertModal/MessageAlertModalScreen';
import Modal from 'react-native-modal';
import DataManager from '../../../helpers/apiManager/DataManager';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import moment from 'moment';
import Utilities from '../../../helpers/utils/Utilities';
import AlertConfirmPopupScreen from '../../shared/alertConfirmPopup/AlertConfirmPopupScreen';
import {t} from 'i18next';
export default function AvailabilityStatusChangePopup(props) {
  const insets = useSafeAreaInsets();

  const [selectedOption, setSelectedOption] = useState(
    Globals.SHARED_VALUES.CURRENT_USER_AVAILABILITY_STATUS,
  );
  const [breakTimeText, setBreakTimeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const refRBSheetBreakTimePopup = useRef();
  const refRBSheetAlertConfirm = useRef();

  useEffect(() => {
    updateBreakTime();
    console.log('SELECTED OPTION IN POPUP ' , selectedOption)
  }, [selectedOption]);

  //Button actions
  const closePopupAction = () => {
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  const availableButtonAction = () => {
    if (selectedOption !== 'AVAILABLE') {
      setSelectedOption('AVAILABLE');
      performUpdateAvailabilityStatus('AVAILABLE');
    }
  };

  const onBreakButtonAction = () => {
    if (selectedOption !== 'ON A BREAK') {
      let _userBreakCount = Globals.USER_DETAILS?.breakCount || 0;
      let _maxAllowedBreak =
        Globals.USER_DETAILS?.userBreakPermission?.allowedBreakCount || 2;
      if (_userBreakCount >= _maxAllowedBreak) {
        setAlertMessage('Break count limit reached.');
        setModalVisible(true);
      } else {
        refRBSheetBreakTimePopup.current.open();
      }
    }
  };

  const notAvailableAction = () => {
    if (selectedOption !== 'NOTAVAILABLE') {
      //Show confirm alert
      Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE =
        'All your appointments today will be cancelled.\nAre you sure to continue?';
      refRBSheetAlertConfirm.current.open();
    }
  };

  //API Calls
  const performUpdateAvailabilityStatus = (
    _selectedOption = selectedOption,
  ) => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.ADMIN_ID]: Globals.USER_DETAILS?._id,
      [APIConnections.KEYS.STATUS]:
        _selectedOption === 'AVAILABLE'
          ? 'Available'
          : _selectedOption === 'ON A BREAK'
          ? 'break'
          : 'notavailable',
    };

    DataManager.performUpdateAvailability(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoading(false);
          closePopupAction();
        } else {
          // Utilities.showToast('Failed!', message, 'error', 'bottom');
          setAlertMessage(message);
          setModalVisible(true);
          setIsLoading(false);
        }
      },
    );
  };

  //Other functions
  const updateBreakTime = () => {
    var _breakTimeText = '';
    try {
      if (selectedOption === 'ON A BREAK') {
        _breakTimeText =
          '(' +
          Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME.format('hh:mm A') +
          ' - ' +
          Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME.format('hh:mm A') +
          ')';
      }
    } catch (error) {
      console.log('error', error)
      _breakTimeText = '';
    }

    console.log('}}}}}}}}}' , _breakTimeText)
    setBreakTimeText(_breakTimeText);
  };

  const AlertConfirmPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetAlertConfirm}
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
        height={320}>
        <AlertConfirmPopupScreen
          RBSheet={refRBSheetAlertConfirm}
          didSelectNo={alertConfirmPopupSelectedNo}
          didSelectYes={alertConfirmPopupSelectedYes}
        />
      </RBSheet>
    );
  };

  const alertConfirmPopupSelectedNo = () => {
    refRBSheetAlertConfirm.current.close();
  };

  const alertConfirmPopupSelectedYes = () => {
    refRBSheetAlertConfirm.current.close();
    setSelectedOption('NOTAVAILABLE');
    performUpdateAvailabilityStatus('NOTAVAILABLE');
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
        ref={refRBSheetBreakTimePopup}
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
        height={270}>
        <BreakTimePopupScreen
          RBSheet={refRBSheetBreakTimePopup}
          didUpdatedBreakTime={didUpdatedBreakTimeHandler}
        />
      </RBSheet>
    );
  };

  const didUpdatedBreakTimeHandler = () => {
    closePopupAction();
  };

  return (
    <View style={styles.container}>
      <GetBreakTimePopup />
      <MessageAlertModal />
      <AlertConfirmPopup />
      <LoadingIndicator visible={isLoading} />
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 14,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign:'left'
        }}>
    {t(Translations.STATUS)}
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
      <View style={styles.itemsContainer}>
        {/* Items */}

        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => availableButtonAction()}>
          {selectedOption === 'AVAILABLE' ? (
            <Image
              style={{height: 16, width: 16}}
              source={Images.RADIO_BUTTON_ON}
            />
          ) : (
            <Image
              style={{height: 16, width: 16}}
              source={Images.STATUS_CHANGE_RADIO_OFF}
            />
          )}

          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 14,
              marginLeft: 16,
              color: Colors.PRIMARY_TEXT_COLOR,
              marginTop: 2,
              textAlign:'left'
            }}>
         {t(Translations.AVAILABLE)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginTop: 20, flexDirection: 'row'}}
          onPress={() => onBreakButtonAction()}>
          {selectedOption === 'ON A BREAK' ? (
            <Image
              style={{height: 16, width: 16}}
              source={Images.RADIO_BUTTON_ON}
            />
          ) : (
            <Image
              style={{height: 16, width: 16}}
              source={Images.STATUS_CHANGE_RADIO_OFF}
            />
          )}

          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 14,
              marginLeft: 16,
              color: Colors.PRIMARY_TEXT_COLOR,
              marginTop: 2,
              textAlign:'left'
            }}>
           {t(Translations.ON_A_BREAK)} {breakTimeText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginTop: 20, flexDirection: 'row'}}
          onPress={() => notAvailableAction()}>
          {selectedOption === 'NOTAVAILABLE' ? (
            
            <Image
              style={{height: 16, width: 16}}
              source={Images.RADIO_BUTTON_ON}
            />
          ) : (
            <Image
              style={{height: 16, width: 16}}
              source={Images.RADIO_BUTTON_OFF}
            />
          )}

          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 14,
              marginLeft: 16,
              color: Colors.PRIMARY_TEXT_COLOR,
              marginTop: 2,
              textAlign:'left'
            }}>
            {t(Translations.NOT_AVAILABLE)}
          </Text>
        </TouchableOpacity>
      </View>
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
