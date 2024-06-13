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
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../../constants';
import APIConnections from '../../../../helpers/apiManager/APIConnections';
import DataManager from '../../../../helpers/apiManager/DataManager';
import Utilities from '../../../../helpers/utils/Utilities';
import LoadingIndicator from '../../../shared/loadingIndicator/LoadingIndicator';
import {GetImage} from '../../../shared/getImage/GetImage';
import ScheduleNextVisitScreen from '../scheduleNextVisit/ScheduleNextVisitScreen';
import MarkAsPaidScreen from '../markAsPaid/MarkAsPaidScreen';
import {t} from 'i18next';
import { useSelector } from 'react-redux';
const CustomerInfoScreen = props => {
  //Declaration
  const insets = useSafeAreaInsets();
  const item = Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO;
  const [isLoading, setIsLoading] = useState(false);
  const [locationInfo, setLocationInfo] = useState('');
  const [userIdText, setUserIdText] = useState('');
  const [userIdValue, setUserIdValue] = useState('');
  const [lastVisit, setLastVisit] = useState('');
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState('');
  const refRBSheetScheduleNextVisitPopup = useRef();
  const refPayNowPopup = useRef();
 //redux state for tabletview
 const isTablet = useSelector((state)=>state.tablet.isTablet);
  useEffect(() => {
    loadData();
  }, []);

  //Button actions
  const closePopupAction = () => {
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };
  const nextVisitButtonAction = () => {
    console.log('selectedCustomerInfo <===>', selectedCustomerInfo);
    refRBSheetScheduleNextVisitPopup.current.open();
  };
  const payNowButtonAction = () => {
    fetchPaymentInfo();
  };

  const loadData = () => {
    var _locationInfo = '';
    let _customerInfo =
      Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO?.customer_id;
    setSelectedCustomerInfo(
      Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO?.customer_id,
    );
    if (
      _customerInfo?.addressLineOne !== undefined &&
      _customerInfo?.addressLineOne !== null &&
      _customerInfo?.addressLineOne?.length > 0
    ) {
      _locationInfo += _customerInfo.addressLineOne + ', ';
    }
    if (
      _customerInfo?.addressLineTwo !== undefined &&
      _customerInfo?.addressLineTwo !== null &&
      _customerInfo?.addressLineTwo?.length > 0
    ) {
      _locationInfo += _customerInfo.addressLineTwo + ', ';
    }
    if (
      _customerInfo?.city !== undefined &&
      _customerInfo?.city !== null &&
      _customerInfo?.city?.length > 0
    ) {
      _locationInfo += _customerInfo.city + ', ';
    }
    if (
      _customerInfo?.zipCode !== undefined &&
      _customerInfo?.zipCode !== null &&
      _customerInfo?.zipCode?.length > 0
    ) {
      _locationInfo += _customerInfo.zipCode + ', ';
    }
    if (
      _customerInfo?.state !== undefined &&
      _customerInfo?.state !== null &&
      _customerInfo?.state?.length > 0
    ) {
      _locationInfo += _customerInfo.state + ', ';
    }
    _locationInfo = _locationInfo.trim();
    _locationInfo = _locationInfo.slice(0, -1);

    let savedUserIdInfo = Utilities.getSavedBusinessUserIdInfo();
    setUserIdText(savedUserIdInfo?.label || 'CustomerID');
    if (_customerInfo?.additionalInfo?.length > 0) {
      const userIdIndex = _customerInfo?.additionalInfo.findIndex(
        _item => _item.key === (savedUserIdInfo?.key || 'customerId'),
      );
      var _userIdValue = _customerInfo?.customerId || 0;
      if (userIdIndex !== -1) {
        _userIdValue = _customerInfo?.additionalInfo[userIdIndex]?.value;
      }
      setUserIdValue(_userIdValue);
    } else {
      setUserIdValue('N/A');
    }

    let lastVisitInfo = _customerInfo?.lastVisit;
    if (lastVisitInfo !== undefined && lastVisitInfo !== null) {
      let lastVisitDate = lastVisitInfo?.arrivingDate;

      let datertl = Utilities.getUtcToLocalWithFormat(
        lastVisitDate,
        'YYYY MMM DD',
      );
      let timertl = Utilities.getUtcToLocalWithFormat(lastVisitDate, 'A hh:mm');

      let dateOnly = Utilities.getUtcToLocalWithFormat(
        lastVisitDate,
        'DD MMM YYYY',
      );
      let timeOnly = Utilities.getUtcToLocalWithFormat(
        lastVisitDate,
        'hh:mm A',
      );
      if (I18nManager.isRTL) {
        setLastVisit(`${datertl} @ ${timertl}`);
      } else {
        setLastVisit(`${dateOnly} @ ${timeOnly}`);
      }
    } else {
      setLastVisit(t(Translations.NO_VISIT));
    }

    setLocationInfo(_locationInfo);
  };

  //API Calls
  /**
             *
             * Purpose: Fetch payment info
             * Created/Modified By: Jenson
             * Created/Modified Date: 04 Feb 2022
             * Steps:
                 1.fetch data from API and append to state variable
      */
  const fetchPaymentInfo = () => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
    };
    if (item?.name === 'Booking') {
      body[APIConnections.KEYS.BOOKING_ID] = item?._id;
    } else {
      body[APIConnections.KEYS.QUEUE_ID] = item?._id;
    }

    DataManager.fetchPaymentInfo(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        Globals.SELECTED_PAYMENT_INFO = data?.objects;
        setIsLoading(false);
        refPayNowPopup.current.open();
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'top');
        setIsLoading(false);
      }
    });
  };

  const NextVisitPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetScheduleNextVisitPopup}
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
        height={450}>
        <ScheduleNextVisitScreen
          RBSheet={refRBSheetScheduleNextVisitPopup}
          updateListAction={updateListHandler}
        />
      </RBSheet>
    );
  };

  const updateListHandler = () => {
    closePopupAction();
    if (props.updateListAction !== undefined) {
      props.updateListAction();
    }
  };

  const PayNowPopup = () => {
    return (
      <RBSheet
        ref={refPayNowPopup}
        closeOnDragDown={false}
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
        height={600}
        keyboardAvoidingViewEnabled={false}>
        <MarkAsPaidScreen
          refRBSheet={refPayNowPopup}
          updateListAction={updateListHandler}
        />
      </RBSheet>
    );
  };

  //Final return
  return (
    <View
      style={{
        flex: 1,
        marginTop: 30,
        backgroundColor: Colors.WHITE_COLOR,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}>
      <LoadingIndicator visible={isLoading} />
      <NextVisitPopup />
      <PayNowPopup />
      <GetImage
        style={{
          zIndex: 1000,
          width: 90,
          height: 90,
          borderRadius: 90 / 2,
          borderWidth: 2,
          borderColor: Colors.SECONDARY_COLOR,
          backgroundColor: Colors.WHITE_COLOR,
          position: 'absolute',
          top: -45,
          alignSelf: 'center',
        }}
        fullName={(
          (item?.customer_id?.firstName || 'N/A') +
          ' ' +
          (item.customer_id?.lastName || '')
        ).trim()}
        url={item?.customer_id?.image}
      />
      <View style={{paddingBottom: 80}}>
        {/* name */}
        <Text
          style={{
            marginTop: 70,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: isTablet===true?20:16,
            color: Colors.CUSTOMER_INFO_2F_COLOR,
            alignSelf: 'center',
          }}
          numberOfLines={1}>
          {(
            (item?.customer_id?.firstName || 'N/A') +
            ' ' +
            (item.customer_id?.lastName || '')
          ).trim()}
        </Text>
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: isTablet===true?16:12,
              height: isTablet===true?16:12,
              tintColor: Colors.CUSTOMER_INFO_2F_COLOR,
              resizeMode: 'contain',
            }}
            source={Images.PHONE_ICON}
          />
          <Text
            style={{
              marginLeft: 8,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?16:12,
              color: Colors.CUSTOMER_INFO_2F_COLOR,
            }}
            numberOfLines={1}>
            {item.customer_id?.phoneNumber ? (
              (item?.customer_id?.countryCode || '') +
              ' ' +
              (item.customer_id?.phoneNumber || '')
            ).trim() : <Text>N/A</Text>}
          </Text>
        </View>
        {item?.customer_id?.email ?
        <Text
          style={{
            marginTop: 12,
            alignSelf: 'center',
            fontFamily: Fonts.Gibson_Light,
            fontSize:isTablet===true?16: 12,
            color: '#4C4D4E',
          }}
          numberOfLines={1}>
          {(item?.customer_id?.email || '').trim()}
        </Text>
:null}
        <View
          style={{
            marginHorizontal: 40,
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Image
            style={{
              width: isTablet===true?12:10,
              height: isTablet===true?15:13,
              tintColor: Colors.CUSTOMER_INFO_2F_COLOR,
              // resizeMode: 'contain',
              marginTop: 3,
            }}
            source={Images.LOCATION_ICON}
          />
          <Text
            style={{
              marginLeft: 8,
              fontFamily: Fonts.Gibson_Regular,
              fontSize:isTablet===true?16: 12,
              color: Colors.CUSTOMER_INFO_2F_COLOR,
              // width: '45%',
              textAlign: 'center',
              lineHeight: 15,
              marginTop: 2,
            }}
            // addressLineOne={1}
            numberOfLines={2}>
            {locationInfo ? locationInfo : <Text>N/A</Text>}
          </Text>
        </View>

        <View
          style={{
            width: '70%',
            marginTop: 25,
            backgroundColor: Colors.LIGHT_SEPARATOR_COLOR,
            height: 1,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection:'row',
            alignSelf: 'center',
            marginTop: 25,
          }}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize:isTablet===true?16: 12,
              color: Colors.HOSPITAL_NAME_COLOR,
            }}
            numberOfLines={1}>
             {I18nManager.isRTL===true?
                         (t(Translations.CUSTOMER_ID))+ " : " : (t(Translations.CUSTOMER_ID))+":"
                        } 
          </Text>
          <View style={{ flexDirection:I18nManager.isRTL===true?'row-reverse':'row',}}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize:isTablet===true?16: 12,
              color: Colors.HOSPITAL_NAME_COLOR,
            }}
            numberOfLines={1}>
             {Globals.BUSINESS_DETAILS.customerPrefix}
          </Text>
          {Globals.HIDE_FOR_PRACTO ===true?
            <Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize:isTablet===true?16: 12,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
            }}
            numberOfLines={1}>
            {item?.customer_id?.customerId || 'N/A'}
          </Text>
            :<Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize:isTablet===true?16: 12,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
            }}
            numberOfLines={1}>
            {userIdValue || 'N/A'}
          </Text>}
          </View>
        </View>
        <Text
          style={{
            marginTop: 12,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: isTablet===true?16:12,
            color: Colors.HOSPITAL_NAME_COLOR,
            alignSelf: 'center',
          }}
          numberOfLines={1}>
          {t(Translations.TOKEN)}#{' '}
          <Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize:isTablet===true?16: 12,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
            }}
            numberOfLines={1}>
            {item?.token || 'N/A'}
          </Text>
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              marginTop: 12,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?16:12,
              color: Colors.HOSPITAL_NAME_COLOR,
              alignSelf: 'center',
            }}
            numberOfLines={1}>
            {t(Translations.LAST_VISIT)}{' '}
          </Text>
          <Text
            style={{
              marginTop: 12,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 12,
              color: Colors.HOSPITAL_NAME_COLOR,
              alignSelf: 'center',
            }}
            numberOfLines={1}>
            :
          </Text>
          <Text
            style={{
              marginLeft: 8,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize:isTablet===true?16: 12,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
              marginTop: 12,
            }}
            numberOfLines={1}>
            {lastVisit}
          </Text>
        </View>
      </View>
      {item?.type === 'Fulfilled' &&
      Utilities.isEnabledScheduleNextVisit() === true ? (
        <View
          style={{
            flexDirection: 'row',
            width: '65%',
            alignSelf: 'center',
            position: 'absolute',
            bottom: 20,
            justifyContent: 'space-between',
            alignItems: 'stretch',
            alignContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => closePopupAction()}
            style={{
              height: 35,
              width: 92,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#BCBCBC',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                color: Colors.HOSPITAL_NAME_COLOR,
                fontFamily: Fonts.Gibson_Light,
                fontSize: isTablet===true?20:12,
              }}>
              {t(Translations.CLOSE_CAPITAL)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => nextVisitButtonAction()}
            style={{
              height: 35,
              width: 98,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#BCBCBC',
              backgroundColor: Colors.PRIMARY_COLOR,
              flexDirection: 'row',
            }}>
            <Image
              style={{
                width: 12,
                height: 12,
                alignSelf: 'center',
                tintColor: Colors.WHITE_COLOR,
              }}
              source={Images.RESCHEDULE_ICON}
            />
            <Text
              style={{
                marginLeft: 8,
                alignSelf: 'center',
                color: Colors.WHITE_COLOR,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 12,
              }}>
              {t(Translations.NEXT_VISIT)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : item?.paymentStatus !== 'PAID' &&
        Utilities.isBillingEnabled() === true ? (
        <View
          style={{
            flexDirection: 'row',
            width: '65%',
            alignSelf: 'center',
            position: 'absolute',
            bottom: 20,
            justifyContent: 'space-between',
            alignItems: 'stretch',
            alignContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => closePopupAction()}
            style={{
              height: 35,
              width: 92,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#BCBCBC',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                color: Colors.HOSPITAL_NAME_COLOR,
                fontFamily: Fonts.Gibson_Light,
                fontSize: isTablet===true?16:12,
              }}>
              {t(Translations.CLOSE_CAPITAL)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => payNowButtonAction()}
            style={{
              height: 35,
              width: 98,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#BCBCBC',
              backgroundColor: Colors.PRIMARY_COLOR,
              flexDirection: 'row',
            }}>
            <Image
              style={{
                width: 12,
                height: 12,
                alignSelf: 'center',
                tintColor: Colors.WHITE_COLOR,
              }}
              source={Images.PAY_NOW_ICON}
            />
            <Text
              style={{
                marginLeft: 8,
                alignSelf: 'center',
                color: Colors.WHITE_COLOR,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 12,
              }}>
              {t(Translations.PAY_NOW)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => closePopupAction()}
          style={{
            alignSelf: 'center',
            position: 'absolute',
            bottom: 20,
            height: 35,
            width: 92,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#BCBCBC',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Light,
              fontSize: isTablet===true?16:12,
            }}>
            {t(Translations.CLOSE_CAPITAL)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default CustomerInfoScreen;
