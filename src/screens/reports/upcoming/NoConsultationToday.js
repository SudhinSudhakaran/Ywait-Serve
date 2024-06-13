import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {t} from 'i18next';
import {Colors, Fonts, Images, Translations} from '../../../constants';
import EMPTY_UPCOMING_SVG from '../../../assets/images/emptyUpcomingSvg.svg';
import { useSelector } from 'react-redux';
const NoConsultationToday = () => {
  //redux state for tabletview
  
  const isTablet = useSelector((state)=>state.tablet.isTablet);
return(
  <View style={{alignItems:'center', marginTop:'20%'}}>
    <EMPTY_UPCOMING_SVG
      fill={Colors.WHITE_COLOR}
      fillSecondary={Colors.SECONDARY_COLOR}
    />

    <Text
      style={{
        alignSelf: 'center',
        color: Colors.ERROR_RED_COLOR,
        fontFamily: Fonts.Gibson_SemiBold,
        fontSize: isTablet===true?25:20,
        marginTop: 20,
      }}>
      {t(Translations.HEY)}
    </Text>
    <Text
      style={{
        alignSelf: 'center',
        color: Colors.PRIMARY_TEXT_COLOR,
        fontFamily: Fonts.Gibson_Regular,
        fontSize:  isTablet===true?18:14,
        marginTop: 20,
      }}>
      {t(Translations.YOU_DONT_HAVE_ANY_CONSULTATION_FOR_THE_DAY)}
    </Text>
  </View>
)
    }
export default NoConsultationToday;

const styles = StyleSheet.create({});
