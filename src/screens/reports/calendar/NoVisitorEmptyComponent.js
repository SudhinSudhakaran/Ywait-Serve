import React from 'react';
import {View, Text} from 'react-native';
import {Colors, Translations, Fonts, Images} from '../../../constants';
import {t} from 'i18next';
import NO_VISITORS from '../../../assets/images/noVisitsError.svg';
import EMPTY_UPCOMING_SVG from '../../../assets/images/emptyUpcomingSvg.svg';
const NoVisitorEmptyComponent = () => (
  <View
    style={{
      //   width: Display.setWidth(60),
      //   height: Display.setHeight(30),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
    }}>
    <View>
      <EMPTY_UPCOMING_SVG
        fill={Colors.WHITE_COLOR}
        fillSecondary={Colors.SECONDARY_COLOR}
      />

      <Text
        style={{
          alignSelf: 'center',
          color: Colors.ERROR_RED_COLOR,
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 20,
          marginTop: 20,
        }}>
        {t(Translations.HEY_NOTHING_HERE)}
      </Text>
      <Text
        style={{
          alignSelf: 'center',
          color: Colors.PRIMARY_TEXT_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 14,
          marginTop: 20,
        }}>
        {t(Translations.YOU_HAVE_NO_VISITORS)}
      </Text>
    </View>
  </View>
);

export default NoVisitorEmptyComponent;
