import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  I18nManager,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {t} from 'i18next';
import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GetImage} from '../../shared/getImage/GetImage';
import {useFocusEffect} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/core';
import Utilities from '../../../helpers/utils/Utilities';
import RADIO_ON_ICON from '../../../assets/images/radioButtonON.svg';
import {useHeaderHeight} from '@react-navigation/elements';

const BookingPaymentConfirmationPopUp = props => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [paymentDetails, setPaymentDetails] = useState();
  const [paymentType, setPaymentType] = useState('card'); //card,bycash
  const [referenceNumber, setReferenceNumber] = useState('');
  const [referenceNumberError, setReferenceNumberError] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'Globals.SELECTED_CUSTOMER_INFO',
        Globals.SELECTED_CUSTOMER_INFO,
      );
      configurePaymentInfo();
      return () => {
        // Globals.SELECTED_CUSTOMER_INFO = {};
        // Globals.SELECTED_DATE_FROM = '';
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
    const timer = setTimeout(() => {
      //Callback to parent. Delay is to bypass iOS modal presentation
      props.didSelectNo();
    }, 500);
    return () => clearTimeout(timer);
  };

  const payNowButtonAction = () => {
    if (paymentType === 'card') {
      if (referenceNumber === '') {
        setReferenceNumberError(t(Translations.REFERENCE_NUMBER_IS_REQUIRED));
      } else {
        setReferenceNumberError('');
        if (props.refRBSheet !== undefined) {
          if (props.refRBSheet.current !== undefined) {
            props.refRBSheet.current.close();
          }
        }
        const timer = setTimeout(() => {
          //Callback to parent. Delay is to bypass iOS modal presentation
          props.didSelectYes(paymentType, referenceNumber);
        }, 500);
        return () => clearTimeout(timer);
      }
    } else {
      //Closing bottom sheet
      if (props.refRBSheet !== undefined) {
        if (props.refRBSheet.current !== undefined) {
          props.refRBSheet.current.close();
        }
      }
      const timer = setTimeout(() => {
        //Callback to parent. Delay is to bypass iOS modal presentation
        props.didSelectYes(paymentType, referenceNumber);
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  //Final return
  return (
    <KeyboardAwareScrollView
    enableOnAndroid={true}
    extraHeight={75}
    extraScrollHeight={80}
    keyboardShouldPersistTaps="always"
    style={{
      flex: 1,
    }}>
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
      }}>
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 16,
          marginTop: 15,
          marginLeft: 20,
          color: Colors.PRIMARY_COLOR,
          textAlign:'left',
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
      <View
        style={{
          height: 1,
          backgroundColor: Colors.SLIM_LINE_SEPARATOR_COLOR,
          marginTop: 15,
          marginRight: 0,
          marginLeft: 0,
        }}
      />
      <ScrollView style={{marginTop: 10}}>
        <View style={{marginTop: 16, flexDirection: 'row'}}>
          <GetImage
            style={{
              marginLeft: 15,
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
        <Text
          style={{
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 14,
            marginTop: 15,
            marginLeft: 14,
            color: Colors.PRIMARY_TEXT_COLOR,
            marginBottom: 15,
          }}>
          {t(Translations.PRICE_DETAILS)}
        </Text>

        {paymentDetails !== undefined
          ? paymentDetails.map((paymentItem, paymentIndex) => {
              return (
                <View
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
            textAlign:'left',
          }}>
          {t(Translations.SELECT_PAYMENT)}
        </Text>

        <View style={{flexDirection: 'row', marginLeft: 22,marginBottom:25}}>
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
                // marginTop: 20,
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
          onPress={() => payNowButtonAction()}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 16,
              color: Colors.WHITE_COLOR,
              alignSelf: 'center',
            }}>
            {t(Translations.PAY_NOW)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAwareScrollView>
  );
};
export default BookingPaymentConfirmationPopUp;
