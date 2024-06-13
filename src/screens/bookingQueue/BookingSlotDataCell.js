import {
  StyleSheet,
  Text,
  View,
  I18nManager,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Images, Translations, Fonts} from '../../constants';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import Utilities from '../../helpers/utils/Utilities';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const BookingSlotDataCell = ({
  item,
  index,
  onPressSlotCell,
  appointmentDetails,
  selectedBookingSlotIndex,
  isLoading,
}) => {
  const {
    selectedDayIsHolyday,
    bookingQueueIsLoading,
    selectedDate,
    specialistAvailable,
  } = useSelector(state => state?.BookingQueueState);

  var backgroundColor = Colors.WHITE_COLOR;
  var textColor = Colors.PRIMARY_TEXT_COLOR;
  if (selectedBookingSlotIndex === index) {
    backgroundColor = Colors.SECONDARY_COLOR;
    textColor = Colors.WHITE_COLOR;
  } else if (item?.canBook === true) {
    backgroundColor = Colors.WHITE_COLOR;
    textColor = Colors.PRIMARY_TEXT_COLOR;
  } else {
    if (module === 'reschedule') {
      let appointmentDate = moment(appointmentDetails?.dateFrom).format(
        'DD MM YYYY hh mm',
      );
      // console.log(appointmentDate);
      // console.log(
      //   'moment(item.dateFrom).format(DD MM YYYY hh mm)',
      //   moment(item?.dateFrom).format('DD MM YYYY hh mm'),
      // );
      if (
        appointmentDate === moment(item?.dateFrom).format('DD MM YYYY hh mm')
      ) {
        backgroundColor = Colors.PRIMARY_COLOR;
        textColor = Colors.WHITE_COLOR;
      } else {
        backgroundColor = Colors.TAB_VIEW_LABEL_COLOR;
        textColor = Colors.WHITE_COLOR;
      }
    } else {
      backgroundColor = Colors.TAB_VIEW_LABEL_COLOR;
      textColor = Colors.WHITE_COLOR;
    }
  }

  //Shimmer loader for the flatList
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={'100%'}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="0" y="0" rx="5" ry="5" width="98%" height="100%" />
    </ContentLoader>
  );
  return (
    <TouchableOpacity
      key={`12345_item-${index}`}
      onPress={() => onPressSlotCell(item, index)}
      style={{
        borderWidth: bookingQueueIsLoading ? 0 : 0.3,
        borderColor: Colors.NOT_ARRIVED_TOP_COLOR,
        width: responsiveWidth(28),
        height: responsiveHeight(4),
        backgroundColor: backgroundColor,
        marginLeft:responsiveWidth(4),
        marginTop: responsiveHeight(1),
        marginBottom:responsiveHeight(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
      }}>
      {bookingQueueIsLoading ? (
        <ListLoader />
      ) : (
        <>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.Gibson_Regular,
              color: textColor,
            }}>
            { Utilities.getUtcToLocalWithFormat(
              item.dateFrom,
              Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
            )}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default BookingSlotDataCell;

const styles = StyleSheet.create({});
