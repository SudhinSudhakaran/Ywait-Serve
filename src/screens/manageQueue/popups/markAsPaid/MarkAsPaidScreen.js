import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  I18nManager,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../../constants';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoadingIndicator from '../../../shared/loadingIndicator/LoadingIndicator';
import SuccessPopupScreen from '../../../shared/successPopup/SuccessPopupScreen';
import APIConnections from '../../../../helpers/apiManager/APIConnections';
import DataManager from '../../../../helpers/apiManager/DataManager';
import Utilities from '../../../../helpers/utils/Utilities';
import RADIO_ON_ICON from '../../../../assets/images/radioButtonON.svg';
import {t} from 'i18next';
const MarkAsPaidScreen = props => {
  const insets = useSafeAreaInsets();
  const item = Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO;
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState();
  const [paymentType, setPaymentType] = useState('card'); //card,bycash
  const [referenceNumber, setReferenceNumber] = useState('');
  const [referenceNumberError, setReferenceNumberError] = useState('');
  const refRBSheetSuccessPopup = useRef();

  useFocusEffect(
    React.useCallback(() => {
      //Utilities.changeKeyboardManager(false);//disabling keyboard manager to avoid extra bottom space
      configurePaymentInfo();
      return () => {
        //  Utilities.changeKeyboardManager(true);
      };
    }, []),
  );

  const configurePaymentInfo = () => {
    var paymentArray = [];
    var paymentObject = {};
    Globals.SELECTED_PAYMENT_INFO.charges.map((paymentItem, paymentIndex) => {
      paymentArray.push(paymentItem);
    });
    Globals.SELECTED_PAYMENT_INFO.discounts.map((paymentItem, paymentIndex) => {
      paymentArray.push(paymentItem);
    });
    paymentObject.type = 'total';
    paymentObject.amounts = Globals.SELECTED_PAYMENT_INFO.total;
    paymentObject.item = 'Total';
    paymentArray.push(paymentObject);
    console.log('paymentArray', paymentArray);
    setPaymentDetails(paymentArray);
  };
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
  };

  const payNowButtonAction = () => {
    if (paymentType === 'card') {
      if (referenceNumber === '') {
        setReferenceNumberError(t(Translations.REFERENCE_NUMBER_IS_REQUIRED));
      } else {
        setReferenceNumberError('');
        updatePaymentInfo();
      }
    } else {
      updatePaymentInfo();
    }
  };

  //API Calls
  /**
             *
             * Purpose: Update payment info
             * Created/Modified By: Jenson
             * Created/Modified Date: 14 Feb 2022
             * Steps:
                 1.fetch data from API and append to state variable
      */
  const updatePaymentInfo = () => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.PAYMENT_TYPE]: paymentType,
    };
    if (item?.name === 'Booking') {
      body[APIConnections.KEYS.BOOKING_ID] = item?._id;
    } else {
      body[APIConnections.KEYS.QUEUE_ID] = item?._id;
    }
    if (paymentType === 'card') {
      body[APIConnections.KEYS.PAYMENT_REFERENCE_ID] = referenceNumber;
    }

    DataManager.updatePaymentInfo(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        Globals.SHARED_VALUES.SUCCESS_MESSAGE = t(
          Translations.PAYMENT_MARKED_SUCCESSFULLY,
        );
        setIsLoading(false);
        refRBSheetSuccessPopup.current.open();
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };

  const SuccessPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetSuccessPopup}
        closeOnDragDown={true}
        closeOnPressMask={false}
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
        height={320}
        onClose={successPopupOnCloseHandler}>
        <SuccessPopupScreen
          RBSheet={refRBSheetSuccessPopup}
          //didSelectOk={selectedOkHandler}
        />
      </RBSheet>
    );
  };

  const successPopupOnCloseHandler = () => {
    closePopupAction();
    if (props.updateListAction !== undefined) {
      props.updateListAction();
    }
  };

  //Final return
  return (
    // <View
    //   style={{
    //     flex: 1,
    //     marginBottom: 10,
    //   }}>
    <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={130}
          extraScrollHeight={80}
          keyboardShouldPersistTaps="always"
          style={{
            flex: 1,
          }}>
      <LoadingIndicator visible={isLoading} />
      <SuccessPopup />
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 16,
          marginTop: 25,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign: 'left',
        }}>
        {t(Translations.ADD_PAYMENT_DETAILS)}
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
        style={{
          height: 1,
          backgroundColor: Colors.SLIM_LINE_SEPARATOR_COLOR,
          marginTop: 15,
          marginRight: 0,
          marginLeft: 0,
        }}
      />
      <ScrollView style={{marginTop: 10, marginBottom: 20}}>
        <Text
          style={{
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 14,
            marginTop: 15,
            marginLeft: 14,
            color: Colors.PRIMARY_TEXT_COLOR,
            marginBottom: 15,
            textAlign: 'left',
          }}>
          {t(Translations.PRICE_DETAILS)}
        </Text>

        {paymentDetails !== undefined
          ? paymentDetails.map((paymentItem, paymentIndex) => {
              return (
                <View
                  key={paymentIndex}
                  style={{
                    borderTopColor: Colors.BACKGROUND_COLOR,
                    borderTopWidth: 1,
                    marginRight: 0,
                    marginLeft: 0,
                    flexDirection: 'row',
                    height: 42,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        paymentItem.type === 'total'
                          ? Fonts.Gibson_SemiBold
                          : Fonts.Gibson_Regular,
                      fontSize: 14,
                      marginLeft: 20,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {paymentItem.type === 'discount'
                      ? paymentItem.item + '(discount)'
                      : paymentItem.item}
                  </Text>

                  <Text
                    style={{
                      fontFamily:
                        paymentItem.type === 'total'
                          ? Fonts.Gibson_SemiBold
                          : Fonts.Gibson_Regular,
                      fontSize: 14,
                      marginRight: 16,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {paymentItem.type === 'discount'
                      ? '- ' +
                        Utilities.getCurrencyFormattedPrice(
                          parseFloat(paymentItem.amounts),
                        )
                      : Utilities.getCurrencyFormattedPrice(
                          parseFloat(paymentItem.amounts),
                        )}
                  </Text>
                </View>
              );
            })
          : null}

        <Text
          style={{
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 14,
            marginTop: 15,
            marginLeft: 14,
            color: Colors.PRIMARY_TEXT_COLOR,
            marginBottom: 25,
            textAlign: 'left',
          }}>
          {t(Translations.SELECT_PAYMENT)}
        </Text>

        <View style={{flexDirection: 'row', marginLeft: 22}}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setPaymentType('card')}>
            {paymentType === 'card' ? (
              <RADIO_ON_ICON
                width={16}
                height={16}
                fillRadioPrimary={Colors.PRIMARY_COLOR}
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
                marginLeft: 6,
                color: Colors.PRIMARY_TEXT_COLOR,
                marginTop: 2,
                textAlign: 'left',
              }}>
              {t(Translations.BY_CARD)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row', marginLeft: 40}}
            onPress={() => setPaymentType('bycash')}>
            {paymentType === 'bycash' ? (
              <RADIO_ON_ICON
                width={16}
                height={16}
                fillRadioPrimary={Colors.PRIMARY_COLOR}
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
                marginLeft: 6,
                color: Colors.PRIMARY_TEXT_COLOR,
                marginTop: 2,
                textAlign: 'left',
              }}>
              {t(Translations.BY_CASH)}
            </Text>
          </TouchableOpacity>
        </View>
        {paymentType === 'card' ? (
          <View>
            <TextInput
              style={{
                marginRight: 14,
                marginLeft: 14,
                padding: 10,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 14,
                color: Colors.PRIMARY_TEXT_COLOR,
                borderWidth: 1,
                borderColor: Colors.BACKGROUND_COLOR,
                marginTop: 20,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              placeholder={t(Translations.ENTER_REFERENCE_NUMBER)}
              autoCorrect={false}
              editable={true}
              value={referenceNumber}
              onChangeText={text => setReferenceNumber(text.trimStart())}
            />
            <Text
              style={{
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 12,
                marginLeft: 16,
                color: Colors.ERROR_RED_COLOR,
                marginTop: 4,
                marginBottom: 12,
              }}>
              {referenceNumberError}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={{flex: 1}} />
      <View
        style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 10}}>
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
            {t(Translations.CANCEL)}
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
          onPress={() => payNowButtonAction()}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 16,
              color: Colors.WHITE_COLOR,
              alignSelf: 'center',
            }}>
            {t(Translations.MARK_AS_PAID)}
          </Text>
        </TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
  );
};
export default MarkAsPaidScreen;
