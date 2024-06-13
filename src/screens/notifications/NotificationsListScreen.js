import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  KeyboardAvoidingView,
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {useHeaderHeight} from '@react-navigation/elements';
import {Colors, Fonts, Globals, Images, Translations} from '../../constants';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import LottieView from 'lottie-react-native';
import {GetImage} from '../shared/getImage/GetImage';
import {useFocusEffect} from '@react-navigation/core';
import moment from 'moment';
import {t} from 'i18next';
import APIConnections from '../../helpers/apiManager/APIConnections';
import { useSelector } from 'react-redux';
const NotificationsListScreen = () => {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isPageEnded, setIsPageEnded] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [notificationList, setNotificationList] = useState([]);
  // const [loadImage, setLoadImage] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [unReadCount, setUnReadCount] = useState(0);


  //redux state for tabletview
  const isTablet = useSelector((state)=>state.tablet.isTablet);

  const searchInputRef = useRef();

  const bookingConfirmationRef = useRef();
  const queueConfirmationRef = useRef();
  const bookingPaymentConfirmationRef = useRef();
  const queuePaymentConfirmationRef = useRef();
  const bookingSuccessRef = useRef();
  const queueSuccessRef = useRef();
  const bookingFailureRef = useRef();
  const queueFailureRef = useRef();
  const dummyCustomerList = [
    {
      id: '1',
      firstName: 'neha',
      lastName: 'kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '2',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: 'No Visit',
    },
    {
      id: '3',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: 'Undefined',
      lastVisit: '13 jan 2022',
    },
    {
      id: '4',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '5',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '6',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '7',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '8',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '9',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
    {
      id: '10',
      firstName: 'Neha',
      lastName: 'Kumari',
      addressLineOne: 'Mahathma Gandhi Road',
      phoneNumber: '9596964241',
      hospitalID: '8859',
      lastVisit: '13 jan 2022',
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'Globals.SELECTED_CUSTOMER_INFO',
        Globals.SELECTED_CUSTOMER_INFO,
      );
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performGetNotificationList(true, 1);
      return () => {
        Globals.SELECTED_CUSTOMER_INFO = {};
        Globals.SELECTED_DATE_FROM = '';
        Globals.FAILURE_ERROR_MESSAGE = '';
        Globals.SELECTED_PAYMENT_INFO = {};
      };
    }, []),
  );
  const onRefresh = () => {
    //set isRefreshing to true
    setRefresh(true);
    performGetNotificationList(false, 1);
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  const notificationCellPressAction = selectedNotificationItem => {
    console.log('Selected notification item', selectedNotificationItem);

    if (selectedNotificationItem?.booking_id) {
      console.log('booking');
      if (
        selectedNotificationItem.type === 'BOOKING-PENDING' ||
        selectedNotificationItem.type === 'BOOKING-SERVING' ||
        selectedNotificationItem.type === 'BOOKING-CANCELLED' ||
        selectedNotificationItem.type === 'BOOKING-UPDATE' ||
        selectedNotificationItem.type === 'BOOKING-SERVED' ||
        selectedNotificationItem.type === 'WAITLIST-PENDING' ||
        selectedNotificationItem.type === 'WAITLIST-SERVING' ||
        selectedNotificationItem.type === 'WAITLIST-SERVED' ||
        selectedNotificationItem.type === 'QUEUE-CANCELLED' ||
        selectedNotificationItem.type === 'DIRECT-CONSULTATION-SERVING'
      ) {
        console.log('item type', selectedNotificationItem.type);

        navigation.navigate('AppointmentDetailsScreen', {
          selectedAppointment_id: selectedNotificationItem.booking_id._id,
          selectedAppointmentType: 'Booking',
          isFrom: 'UPCOMING_LIST_SCREEN',
        });
        updateNotificationItem(selectedNotificationItem, false);
      }
      updateNotificationItem(selectedNotificationItem, true);
    } else if (selectedNotificationItem?.waitlist_id) {
      console.log('queue');
      if (
        selectedNotificationItem.type === 'BOOKING-PENDING' ||
        selectedNotificationItem.type === 'BOOKING-SERVING' ||
        selectedNotificationItem.type === 'BOOKING-CANCELLED' ||
        selectedNotificationItem.type === 'BOOKING-UPDATE' ||
        selectedNotificationItem.type === 'BOOKING-SERVED' ||
        selectedNotificationItem.type === 'WAITLIST-PENDING' ||
        selectedNotificationItem.type === 'WAITLIST-SERVING' ||
        selectedNotificationItem.type === 'WAITLIST-SERVED' ||
        selectedNotificationItem.type === 'QUEUE-CANCELLED' ||
        selectedNotificationItem.type === 'DIRECT-CONSULTATION-SERVING'
      ) {
        console.log('item type', selectedNotificationItem.type);

        navigation.navigate('AppointmentDetailsScreen', {
          selectedAppointment_id: selectedNotificationItem.waitlist_id._id,
          selectedAppointmentType: 'Queue',
          isFrom: 'UPCOMING_LIST_SCREEN',
        });
        updateNotificationItem(selectedNotificationItem, false);
      }
      updateNotificationItem(selectedNotificationItem, true);
    } else {
      updateNotificationItem(selectedNotificationItem, true);
    }
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

      <Rect x="10" y="30" rx="20" ry="20" width="40" height="40" />
    </ContentLoader>
  );
  /**
   * Purpose: list on end reached component
   * Created/Modified By: Vijn
   * Created/Modified Date: 10 Aug 2021
   * Steps:
   */
  const listOnEndReach = () => {
    console.log(
      `Detected on end reach isPaginating: ${isPaginating}, isPageEnded: ${isPageEnded}`,
    );

    if (!isPageEnded && !isLoading && !isPaginating) {
      let newPageNo = pageNo + 1;
      console.log('PageNo:', newPageNo);
      if (newPageNo !== 1) {
        setIsPaginating(true);
      }
      console.log('setIndicator:', isPaginating);
      setPageNo(newPageNo);
      performGetNotificationList(false, newPageNo);
    }
  };
  /**
            * Purpose: List empty component
            * Created/Modified By: Sudhin Sudhakaran
            * Created/Modified Date: 11 Oct 2021
            * Steps:
                1.Return the component when list is empty
        */
  const NotificationEmptyComponent = () => {
    return (
      <View
        style={{
          //   width: Display.setWidth(60),
          //   height: Display.setHeight(30),
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 80,
        }}>
        <LottieView
          style={{width: DisplayUtils.setWidth(50)}}
          source={Images.EMPTY_NOTIFICATION_LIST}
          autoPlay
          loop
          colorFilters={[
            {
              keypath: 'No-Notification 2.star-2 Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.star-1 Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.buble-2 Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.buble-2 Outlines.Group 2',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.buble1 Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.buble1 Outlines.Group 2',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.buble1 Outlines.Group 3',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-sleep3 Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-sleep2 Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-sleep Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath:
                'No-Notification 2.bell-dialog Outlines.Group 1.Stroke 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-eyes Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-eyes Outlines.Group 2',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-mouth Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-home Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-home Outlines.Group 2.Stroke 1',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell-home Outlines.Group 3',
              color: Colors.SECONDARY_COLOR,
            },
            {
              keypath: 'No-Notification 2.bell Outlines.Group 1',
              color: Colors.SECONDARY_COLOR,
            },
          ]}
        />

        <Text
          style={{
            alignSelf: 'center',
            color: Colors.ERROR_RED_COLOR,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: isTablet===true?25:20,
            marginTop: 20,
          }}>
          {t(Translations.HEY_NOTHING_HERE)}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.PRIMARY_TEXT_COLOR,
            fontFamily: Fonts.Gibson_Regular,
            fontSize:  isTablet===true?18:14,
            marginTop: 20,
          }}>
          {t(Translations.YOU_HAVE_NO_NOTIFICATIONS)}
        </Text>
      </View>
    );
  };
  /**
   * Purpose: pagination loader component
   * Created/Modified By: Vijin
   * Created/Modified Date: 10 Nov 2021
   * Steps:
   */
  const paginationComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator
          style={{marginBottom: 20}}
          color={Colors.PRIMARY_COLOR}
          size="small"
        />
      </View>
    );
  };

  //API CALLS
  /**
              *
              * Purpose: Business listing
              * Created/Modified By: Jenson
              * Created/Modified Date: 27 Dec 2021
              * Steps:
                  1.fetch business list from API and append to state variable
      */

  const performGetNotificationList = (isLoaderRequired, pageNumber) => {
    if (isLoaderRequired) {
      // setIsLoading(true);
    }
    DataManager.getNotificationList(pageNumber).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            if (pageNumber !== 1) {
              if (data.objects?.list?.length === 0) {
                console.log('END FOUND');
                setIsPageEnded(true);
              } else {
                //Appending data
                //setSearchList(...searchList, ...data.data.objects)
                setNotificationList(notificationList => {
                  return [...notificationList, ...data.objects.list];
                });
              }
            } else {
              setNotificationList(data.objects.list);
              console.log('UNread count', data.objects.unreadingCount);
              Utilities.setNotificationCount(data.objects.unreadingCount);
              setUnReadCount(data.objects.unreadingCount);
              Globals.UN_READ_NOTIFICATION_COUNT = data.objects.unreadingCount;
            }
          } else {
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
        setIsLoading(false);
        setRefresh(false);
        setIsPaginating(false);
      },
    );
  };

  //API CALLS
  /**
            *
            * Purpose:Update notification item
            * Created/Modified By: Sudhin
            * Created/Modified Date: 1 feb 2022
            * Steps:
                1.pass the notification id
    */

  const updateNotificationItem = (selectedItem, apiCallNeed) => {
    const body = {
      [APIConnections.KEYS.READ_STATUS]: true,
      [APIConnections.KEYS.NOTIFICATION_ID]: selectedItem._id,
    };
    DataManager.performUpdateNotificationItem(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            console.log('Consultant data', data);
            setUnReadCount(data.objects.unreadingCount);
            apiCallNeed ? performGetNotificationList(false, 1) : null;
            Globals.UN_READ_NOTIFICATION_COUNT = data.objects.unreadingCount;
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            setIsLoading(false);
            // setRefresh(false);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
          // setRefresh(false);
        }
      },
    );
  };

  //API CALLS
  /**
            *
            * Purpose:Update notification List
            * Created/Modified By: Sudhin
            * Created/Modified Date: 1 feb 2022
            * Steps:
                1.pass the notification id
    */

  const updateNotificationList = () => {
    const body = {
      [APIConnections.KEYS.READ_STATUS]: true,
      [APIConnections.KEYS.ADMIN_ID]: Globals.USER_DETAILS._id,
    };
    DataManager.performUpdateNotificationList(body).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            console.log('Consultant data', data);

            performGetNotificationList(false, 1);
          } else {
            Utilities.showToast(
              t(Translations.FAILED),
              message,
              'error',
              'bottom',
            );
            setIsLoading(false);
            // setRefresh(false);
          }
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
          // setRefresh(false);
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
    return <NotificationListDataCell item={item} index={index} />;
  };

  const NotificationListDataCell = ({item}) => {
    // let name =
    //     item.firstName + '+' + item.lastName;
    // let placeholderImageUrl = 'https://ui-avatars.com/api/?background=fff&color=' + Colors.PRIMARY_COLOR + '&name=' + name;
    // console.log('item placeholderImageUrl', placeholderImageUrl)

    // var IMAGE = item.image;
    // if (item.additionalInfo?.length > 0) {

    // }
    return isLoading ? (
      <ListLoader />
    ) : (
      <TouchableOpacity
        onPress={() => (isLoading ? null : notificationCellPressAction(item))}
        style={{
          borderTopWidth: 0.25,
          borderBottomWidth: 0.25,
          borderBottomColor: Colors.TAB_VIEW_LABEL_COLOR,
          borderTopColor: Colors.TAB_VIEW_LABEL_COLOR,
          flexDirection: 'row',
          backgroundColor: item.readStatus
            ? Colors.WHITE_COLOR
            : Colors.NOTIFICATION_BACKGROUND_COLOR,
        }}>
        <View style={{marginHorizontal: 12, marginTop: 10}}>
          <GetImage
            style={{
              marginTop: 10,
              marginLeft: 10,
              width:  isTablet===true?52:42,
              height:  isTablet===true?52:42,
              borderRadius:  isTablet===true?52/2:42 / 2,
              borderWidth: 1,
              borderColor: Colors.SECONDARY_COLOR,
            }}
            fullName={(
              (item.admin_id?.firstName || 'N/A') +
              ' ' +
              (item.admin_id1?.lastName || '')
            ).trim()}
            url={item?.admin_id?.image}
          />
        </View>
        <View
          style={{
            marginTop: 15,
            marginBottom: 15,
            width: DisplayUtils.setWidth(75),
            textAlign: 'left',
          }}>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              color: Colors.NOTIFICATION_TITLE_COLOR,
              fontSize: isTablet===true?16: 12,
              textAlign: 'left',
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              color: Colors.GREY_COLOR,
              fontSize:  isTablet===true?16:12,
              marginTop: 5,
              textAlign: 'left',
            }}
            numberOfLines={2}>
            {item.message}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Light,
              color: Colors.LOCATION_TEXT_COLOR,
              fontSize:  isTablet===true?15:11,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {moment(item.date).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //final return
  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={useHeaderHeight()}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE_COLOR,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          }}>
          <StatusBar
            backgroundColor={Colors.BACKGROUND_COLOR}
            barStyle="dark-content"
          />

          <LoadingIndicator visible={isLoaderLoading} />
          <View
            style={{
              backgroundColor: Colors.PRIMARY_WHITE,
              width: DisplayUtils.setWidth(100),
              height: 70,
            }}>
            <View
              style={{
                marginTop: 25,
                marginLeft: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Gibson_SemiBold,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: isTablet===true?24:18,
                }}>
                {t(Translations.NOTIFICATION)}
              </Text>
              <TouchableOpacity
                style={{justifyContent: 'center', marginRight: 20}}
                onPress={() => navigation.goBack()}>
                <Image
                  style={{
                    height:  isTablet===true?23:18,
                    width:  isTablet===true?23:18,
                    tintColor: Colors.LOCATION_TEXT_COLOR,
                  }}
                  source={Images.CLOSE_ICON}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginBottom: 16,
              justifyContent: 'flex-end',
            }}>
            {unReadCount <= 0 ? null : (
              <TouchableOpacity
                onPress={() => updateNotificationList()}
                style={{marginRight: 38}}>
                <Text
                  style={{
                    color: Colors.CUSTOMER_NAME_COLOR,
                    fontSize: isTablet===true?20: 14,
                    fontFamily: Fonts.Gibson_Regular,
                  }}>
                  {t(Translations.MARK_ALL_AS_READ)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 55,
              //   borderTopWidth: 0.5,
              //   borderTopColor: Colors.GREY_COLOR,
            }}
            showsVerticalScrollIndicator={false}
            data={isLoading ? dummyCustomerList : notificationList}
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              listOnEndReach();
            }}
            ListEmptyComponent={
              isLoading ? dummyCustomerList : NotificationEmptyComponent
            }
            ListFooterComponent={isPaginating ? paginationComponent : null}
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

export default React.memo(NotificationsListScreen);
