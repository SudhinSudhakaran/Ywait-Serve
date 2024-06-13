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
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

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
import SuccessPopupScreen from '../../../shared/successPopup/SuccessPopupScreen';
import {t} from 'i18next';
const ScheduleNextVisitScreen = props => {
  //Declaration
  const insets = useSafeAreaInsets();
  const item = Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO;
  const titleText = t(Translations.SCHEDULE_NEXT_VISIT);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(
    Utilities.convertorTimeToBusinessTimeZone(moment().add(1, 'days').format()),
  );
  const refRBSheetSuccessPopup = useRef();

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

  const submitButtonAction = () => {
    console.log('selectedDate: ', date);

    performScheduleNextVisit();
  };

  //Other functions
  const loadData = () => {};

  /**
             *
             * Purpose: Perform notify delay
             * Created/Modified By: Jenson
             * Created/Modified Date: 04 Feb 2022
             * Steps:
                 1.fetch data from API and append to state variable
      */
  const performScheduleNextVisit = () => {
    setIsLoading(true);
    let toSentDate =
      moment(date).format('dddd D MMMM YYYY 00:00:00.000 ') +
      Utilities.getBusinessTimeZoneOffset();
    console.log('toSentDate: ', toSentDate);

    const body = {
      [APIConnections.KEYS.CUSTOMER_ID]: item?.customer_id?._id,
      [APIConnections.KEYS.NEXT_SCHEDULE_DATE]: toSentDate,
      [APIConnections.KEYS.SERVING_USER_ID]:
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    };

    DataManager.performNextVisit(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        Globals.SHARED_VALUES.SUCCESS_MESSAGE =
          'Next visit reminder added successfully!';
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
        <SuccessPopupScreen RBSheet={refRBSheetSuccessPopup} />
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
    <View
      style={{
        flex: 1,
      }}>
      <LoadingIndicator visible={isLoading} />
      <SuccessPopup />
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 14,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign: 'left',
        }}>
        {titleText}
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

      <Text
        style={{
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 14,
          marginTop: 20,

          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign: 'left',
          paddingHorizontal: 16,
        }}>
        
        {t(
          Translations.SELECT_NEXT_VISIT_DATE_USER_WILL_BE_REMIND_BEFORE_3_DAYS_BEFORE_1_DAY_AND_VISIT_DAY_MORNING,
        )}
      </Text>

      <DatePicker
        style={{marginTop: 16, alignSelf: 'center', height: 230}}
        date={date}
        onDateChange={setDate}
        mode={'date'}
        minimumDate={Utilities.convertorTimeToBusinessTimeZone(
          moment().add(1, 'days').format(),
        )}
      />

      <TouchableOpacity
        onPress={() => submitButtonAction()}
        style={{
          marginTop: 30,
          borderRadius: 8,
          backgroundColor: Colors.SECONDARY_COLOR,
          height: 45,
          width: 134,
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 16,
            color: Colors.WHITE_COLOR,
            alignSelf: 'center',
          }}>
        {t(Translations.SUBMIT)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default ScheduleNextVisitScreen;
