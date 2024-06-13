import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  useWindowDimensions,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  KeyboardAvoidingView,
  I18nManager,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import FastImage from 'react-native-fast-image';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../constants';
import LoadingIndicator from '../../shared/loadingIndicator/LoadingIndicator';
import StorageManager from '../../../helpers/storageManager/StorageManager';
import DataManager from '../../../helpers/apiManager/DataManager';
import Utilities from '../../../helpers/utils/Utilities';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import NO_VISITORS from '../../../assets/images/noVisitsError.svg';
import {GetImage} from '../../shared/getImage/GetImage';
import {t} from 'i18next';
import { useSelector } from 'react-redux';
const NotArrivedLIstTabScreen = () => {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [notArrivedList, setNotArrivedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

   //redux state for tabletview
   const isTablet = useSelector((state)=>state.tablet.isTablet);

  const dummyNotArrivedListData = [
    {
      id: '1',
      firstName: 'neha',
      lastName: 'kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '2',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: 'No Visit',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '3',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: 'Undefined',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '4',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '5',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '6',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '7',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '8',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '9',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
    {
      id: '10',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      bookingId: '8859',
      lastVisit: '13 jan 2022',
      token: 'A161',
      date: '2022-01-14T08:25:35.240Z',
      name: 'Booking',
    },
  ];
  useEffect(() => {
    // setIsLoading(true);

    getAppointment(true);
  }, []);
  const onRefresh = () => {
    //set isRefreshing to true
    setRefresh(true);
    getAppointment(false);
    // and set isRefreshing to false at the end of your callApiMethod()
  };
  //Shimmer loader for the flatList
  const ListLoader = props => (
     <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={80}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="60" y="20" rx="5" ry="5" width="120" height="8" />
      <Rect x="60" y="40" rx="5" ry="5" width="230" height="8" />
      <Rect x="60" y="60" rx="5" ry="5" width="180" height="8" />
      <Rect x="300" y="20" rx="0" ry="0" width="80" height="10" />
      <Rect x="300" y="60" rx="0" ry="0" width="80" height="10" />
      <Rect x="10" y="10" rx="20" ry="20" width="40" height="40" />
    </ContentLoader>
  );

  /**
           * Purpose: List empty component
           * Created/Modified By: Sudhin Sudhakaran
           * Created/Modified Date: 11 Oct 2021
           * Steps:
               1.Return the component when list is empty
       */
  const NotArrivedListDataEmptyComponent = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 80,
        }}>
        <LottieView
          style={{width: DisplayUtils.setWidth(60)}}
          source={Images.EMPTY_MANAGE_QUEUE_ANIMATION}
          autoPlay
          loop
          colorFilters={[
            {
              keypath: 'main.magnifier.矩形.矩形.Fill 1',
              color: Colors.SECONDARY_COLOR,
            },
          ]}
        />

        <Text
          style={{
            alignSelf: 'center',
            color: Colors.ERROR_RED_COLOR,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize:isTablet===true?27: 20,
            marginTop: 20,
          }}>
          {t(Translations.HEY_NOTHING_HERE)}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.PRIMARY_TEXT_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: isTablet===true?20:14,
            marginTop: 20,
          }}>
          {t(Translations.YOU_HAVE_NO_VISITORS)}
        </Text>
      </View>
    );
  };

  //API Calls
  /**
          *
          * Purpose: Get user details
          * Created/Modified By: Jenson
          * Created/Modified Date: 21 Jan 2022
          * Steps:
              1.fetch business details from API and append to state variable
   */
  const getAppointment = loadingRequire => {
    if (loadingRequire) {
      setIsLoading(true);
    }

    const headers = {
      [APIConnections.KEYS.USER_ID]:
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
    };
    DataManager.getCurrentDayAppointments(headers).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data.object !== undefined && data.object !== null) {
            console.log('not Arriving data', data.object.pending);
            setNotArrivedList(data.object.pending);
            setIsLoading(false);
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            setIsLoading(false);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
        }
      },
    );
  };

  /**
        * Purpose:Render function of flat list
        * Created/Modified By: Sudhin Sudhakaran
        * Created/Modified Date: 8 Oct 2021
        * Steps:
            1.pass the data from api to customer details child component
    */
  const renderItem = ({item, index}) => {
    return <NotArrivedDataCell item={item} index={index} />;
  };

  const NotArrivedDataCell = ({item}) => {
    return isLoading ? (
      <ListLoader />
    ) : (
      <View
        style={{
          borderTopWidth: 0.7,
          borderTopColor: Colors.LINE_SEPARATOR_COLOR,
          borderBottomWidth: 0.7,
          borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
          flexDirection: 'row',
          backgroundColor: Colors.WHITE_COLOR,
          paddingTop: 10,
        }}>
        <View style={{marginHorizontal: 12, marginTop: 15}}>
          <GetImage
            style={{
              width: isTablet===true?65:50,
              height: isTablet===true?65:50,
              borderRadius: isTablet===true?65/2:50 / 2,
              borderWidth: 1,
              borderColor: Colors.SECONDARY_COLOR,
            }}
            fullName={(
              (item?.customer_id?.firstName || 'N/A') +
              ' ' +
              (item?.customer_id?.lastName || '')
            ).trim()}
            alphabetColor={Colors.PRIMARY_COLOR}
            url={item?.customer_id?.image}
          />
        </View>
        <View style={{marginBottom: 20, flex: 1}}>
          <Text
            style={{
              fontSize: isTablet===true?18:14,
              fontFamily: Fonts.Gibson_SemiBold,
              color: Colors.PRIMARY_TEXT_COLOR,
              marginTop: 10,
              // paddingRight: 120,
              textAlign: 'left',
            }}
            numberOfLines={1}>
            {item?.customer_id?.firstName} {''}
            {item?.customer_id?.lastName}
          </Text>
          <View style={{marginTop: 8, flexDirection: 'row', marginRight:10}}>
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: isTablet===true?16:12,
                fontFamily: Fonts.Gibson_Regular,
              }}
              numberOfLines={2}>
              {item.name === 'Booking'
                ? t(Translations.BOOKING_ID)
                : t(Translations.QUEUE_ID)}
            </Text>
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: isTablet===true?16:12,
                fontFamily: Fonts.Gibson_Regular,
              }}
              numberOfLines={2}>
              #
            </Text>
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: isTablet===true?16:12,
                fontFamily: Fonts.Gibson_Regular,
                marginLeft: 3,
              }}
              numberOfLines={2}>
              {item.name === 'Booking' ? item?.bookingId : item?.waitlistId}
            </Text>
          </View>
          <View style={{marginTop: 8, flexDirection: 'row'}}>
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: isTablet===true?16:12,
                fontFamily: Fonts.Gibson_Regular,
              }}>
              {t(Translations.TOKEN)}
            </Text>
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize:isTablet===true?16: 12,
                fontFamily: Fonts.Gibson_Regular,
              }}>
              #
            </Text>
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: isTablet===true?16:12,
                fontFamily: Fonts.Gibson_Regular,
                marginLeft: 3,
              }}>
              {item.token}
            </Text>
          </View>
          <View style={{marginTop: 8, flexDirection: 'row'}}>
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: isTablet===true?16:12,
                fontFamily: Fonts.Gibson_Regular,
              }}>
              {t(Translations.APPOINTMENT_AT)}
            </Text>

            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: isTablet===true?16:12,
                fontFamily: Fonts.Gibson_Regular,
                marginLeft: 5,
              }}>
              {Utilities.getUtcToLocalWithFormat(item.dateFrom, 'hh:mm A')}
            </Text>
          </View>
        </View>

        <View style={{flex: 0.5, paddingTop: 10}}>
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.NOTES_DETAILS_DATE_COLOR,
              alignSelf: 'center',
              borderRadius: 2.5,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Gibson_Regular,
                fontSize: isTablet===true?15:10,
                color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                marginHorizontal: 5,
                marginVertical: 2.5,
              }}>
              {item.name === 'Booking'
                ? t(Translations.BOOKING).toUpperCase()
                : t(Translations.QUEUE).toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AppointmentDetailsScreen', {
                selectedAppointment_id: item._id,
                selectedAppointmentType: item.name,
                isFrom: 'UPCOMING_LIST_SCREEN', // this for use navigation goBack action from appointment details screen
              })
            }
            style={{
              backgroundColor: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
              marginTop: 15,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Gibson_Regular,
                fontSize: isTablet===true?15:10,
                color: Colors.WHITE_COLOR,
                marginHorizontal: 10,
                marginVertical: 5,
              }}>
              {t(Translations.VIEW_DETAILS).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1, backgroundColor: Colors.BACKGROUND_COLOR}}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.BACKGROUND_COLOR,
          }}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 85,

              borderTopWidth: 0.7,
              borderTopColor: Colors.LINE_SEPARATOR_COLOR,
            }}
            data={isLoading ? dummyNotArrivedListData : notArrivedList}
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            ListEmptyComponent={
              isLoading
                ? dummyNotArrivedListData
                : NotArrivedListDataEmptyComponent
            }
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default React.memo(NotArrivedLIstTabScreen);

const styles = StyleSheet.create({});
