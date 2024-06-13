import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';
import {t} from 'i18next';
import {Colors, Fonts, Globals, Images, Strings, Translations} from '../../../../constants';
import {useHeaderHeight} from '@react-navigation/elements';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

export default function SelectTimePopupScreen(props) {
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (Globals.SHARED_VALUES.IS_BREAK_FROM_TIME_SELECTED === true) {
      setSelectedTime(
        Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME || new Date(),
      );
    } else {
      setSelectedTime(
        Globals.SHARED_VALUES.SELECTED_BREAK_TO_TIME || new Date(),
      );
    }
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

  /**
    * Purpose: done action.
    * Created/Modified By: Jenson
    * Created/Modified Date: 27 May 2021
    * Steps: 1. Closing bottom sheet
             2. Callback to parent
    */
  const doneButtonAction = () => {
    //Closing bottom sheet
    props.RBSheet.current.close();
    const timer = setTimeout(() => {
      //Callback to parent. Delay is to bypass iOS modal presentation
      props.didSelectItem(selectedTime);
    }, 500);
    return () => clearTimeout(timer);
  };

  return (
    <View style={styles.container}>
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 14,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign:'left',
        }}>
       {t(Translations.SELECT_TIME)}
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

        <DatePicker
          style={{alignSelf: 'center', height: 100}}
          mode={'time'}
          date={new Date(selectedTime)}
          minimumDate={
            Globals.SHARED_VALUES.IS_BREAK_FROM_TIME_SELECTED === true
              ? new Date()
              : new Date(Globals.SHARED_VALUES.SELECTED_BREAK_FROM_TIME)
          }
          onDateChange={value => setSelectedTime(moment(value))}
        />
      </View>

      <TouchableOpacity
        onPress={() => doneButtonAction()}
        style={{
          marginTop: 50,
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
          Done
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
