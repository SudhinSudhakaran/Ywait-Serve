import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Utilities from '../../../helpers/utils/Utilities';
import LottieView from 'lottie-react-native';
import {Colors, Import, Translations, Images, Fonts} from '../../../constants';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import {t} from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
const QueueFullEmptyComponent = ({title}) => {
   const [localLoading, setLocalLoading] = useState(true);
  const {bookingQueueIsLoading} = useSelector(
    state => state?.BookingQueueState,
  );
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
      {bookingQueueIsLoading && localLoading ? null : (
        <View
          style={{
            height: 220,
            width: DisplayUtils.setWidth(85),
            //Shadow props
            // borderWidth: 0.1,
            // borderColor: Colors.GREY_COLOR,
            // backgroundColor: Colors.WHITE_COLOR,
            // shadowColor: Colors.SHADOW_COLOR,
            // shadowOffset: {width: 0, height: 4},
            // shadowOpacity: 0.8,
            // shadowRadius: 10,
            // elevation: 8,
            // borderRadius: 8,
          }}>
          <Text
            style={{
              marginTop: 20,
              fontFamily: Fonts.Gibson_Regular,
              color: Colors.PRIMARY_TEXT_COLOR,
              fontSize: 16,
              alignSelf: 'center',
              justifyContent: 'center',
              marginRight: 40,
              marginLeft: 40,
              lineHeight: 20,
              textAlign: 'center',
            }}>
            {title}
          </Text>
          <LottieView
            style={{
              width: 170,
              height: 170,
              alignSelf: 'center',
              marginTop: -5,
            }}
            source={Images.SLOT_FULL_ANIMATION}
            autoPlay
            loop
            colorFilters={[
              {
                keypath: 'no-appointment Outlines.Group 1',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 2',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 3',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 4',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 5',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 6',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 7',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 8',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 9',
                color: Colors.SECONDARY_COLOR,
              },
              // {
              //     keypath: 'no-appointment Outlines.Group 10',
              //     color: Colors.SECONDARY_COLOR,
              // },
              {
                keypath: 'no-appointment Outlines.Group 11',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 12',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 13',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 14',
                color: Colors.SECONDARY_COLOR,
              },
              {
                keypath: 'no-appointment Outlines.Group 15',
                color: Colors.SECONDARY_COLOR,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

export default QueueFullEmptyComponent;

const styles = StyleSheet.create({});
