import {StyleSheet, Text, View, Image, I18nManager} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {HelperText, TextInput} from 'react-native-paper';
import {Colors, Translations, Fonts, Images} from '../../../constants';
import {t} from 'i18next';
import { useSelector } from 'react-redux';
const DropdownTextInput = ({value, placeholder}) => {
   //redux state for tabletview
   const isTablet = useSelector((state)=>state.tablet.isTablet);
  console.log('value', value, 'placeholder', placeholder);
  return (
    <View style={{flexDirection: 'row'}}>
      <TextInput
        editable={false}
        multiline={true}
        numberOfLines={1}
        style={{backgroundColor: Colors.TRANSPARENT, flex: 1,fontSize:isTablet===true?20:0}}
        pointerEvents={'none'}
        activeUnderlineColor={Colors.PRIMARY_COLOR}
        label={
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?28:16,
              color: Colors.TEXT_GREY_COLOR_9B,
            }}>
            {placeholder}
          </Text>
        }
        value={value}
      />
      <View
        style={{
          width: 30,
          height: 24,
          position: 'absolute',
          right: 5,
          top: 20,
        }}>
        <Image
          style={{
            width: isTablet===true?20:18,
            height: isTablet===true?20:18,
            tintColor: Colors.PRIMARY_COLOR,
            resizeMode: 'contain',
            position: 'absolute',
            right: 8,
          }}
          source={Images.DROP_DOWN_ICON}
        />
      </View>
    </View>
  );
};

export default DropdownTextInput;

const styles = StyleSheet.create({});