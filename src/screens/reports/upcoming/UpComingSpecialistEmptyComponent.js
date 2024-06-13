import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Utilities from '../../../helpers/utils/Utilities';
import LottieView from 'lottie-react-native';
import {Colors, Import, Translations, Images, Fonts} from '../../../constants';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import {t} from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
const UpComingSpecialistEmptyComponent = () => {

   //redux state for tabletview
   const isTablet = useSelector((state)=>state.tablet.isTablet);
 
  return (
    <View
      style={{
        //   width: Display.setWidth(60),
        //   height: Display.setHeight(30),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
      }}>
    
        <View>
          <LottieView
            style={{width: DisplayUtils.setWidth(50), height: 150}}
            source={Images.BUSINESS_CLOSED_ANIMATION}
            autoPlay
            loop
          />
          <Text
            style={{
              alignSelf: 'center',
              color: Colors.PRIMARY_TEXT_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize:  isTablet===true?20:14,
            }}>
            {Utilities.getSpecialistName() +
              ' ' +
              t(Translations.CONSULTATION_NOT_AVAILABLE_FOR_THE_SELECTED_DAY)}
          </Text>
        </View>
  
    </View>
  );
};

export default UpComingSpecialistEmptyComponent;

const styles = StyleSheet.create({});
