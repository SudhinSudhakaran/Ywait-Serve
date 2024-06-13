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
const CustomerScreen = () => {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isPageEnded, setIsPageEnded] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [customerDataList, setCustomerDataList] = useState([]);
  // const [loadImage, setLoadImage] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const searchInputRef = useRef();
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
  useEffect(() => {
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);
    performGetCustomerList(true, 1, '');
  }, []);
  const onRefresh = () => {
    //set isRefreshing to true
    setRefresh(true);
    performGetCustomerList(false, 1, '');
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
      performGetCustomerList(false, newPageNo, search);
    }
  };
  /**
          * Purpose: List empty component
          * Created/Modified By: Sudhin Sudhakaran
          * Created/Modified Date: 11 Oct 2021
          * Steps:
              1.Return the component when list is empty
      */
  const CustomerEmptyComponent = () => {
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
          source={Images.LOTTIE_SEARCH_NO_RESULT}
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
            fontSize: 18,
            marginTop: 20,
          }}>
          {t(Translations.NO_RESULT_FOUND)}
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

  const searchButtonAction = () => {
    Keyboard.dismiss();
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performGetCustomerList(true, 1, search);
    }
  };
  const closeButtonAction = () => {
    Keyboard.dismiss();
    setSearch('');
    if (!isLoading) {
      setIsLoading(true);
      setPageNo(1);
      setIsPageEnded(false);
      performGetCustomerList(true, 1, '');
    }
  };

  const addNewCustomerButtonAction = () => {
    Keyboard.dismiss();
    navigation.navigate('AddCustomerScreen', {
      onCreateCustomer: didCreatedNewCustomer,
    });
  };

  const didCreatedNewCustomer = (info = {}) => {
    console.log('Customer list updating.. New customer info: ', info);
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);
    performGetCustomerList(true, 1, '');
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

  const performGetCustomerList = (
    isLoaderRequired,
    pageNumber,
    searchValue,
  ) => {
    if (isLoaderRequired) {
      setIsLoading(true);
    }
    DataManager.getCustomerList(pageNumber, searchValue).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            if (pageNumber !== 1) {
              if (data.objects.length === 0) {
                console.log('END FOUND');
                setIsPageEnded(true);
              } else {
                //Appending data
                //setSearchList(...searchList, ...data.data.objects)
                setCustomerDataList(customerList => {
                  return [...customerList, ...data.objects];
                });
              }
            } else {
              setCustomerDataList(data.objects);
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

  /**
       * Purpose:Render function of flat list
       * Created/Modified By: Sudhin Sudhakaran
       * Created/Modified Date: 8 Oct 2021
       * Steps:
           1.pass the data from api to customer details child component
   */
  const renderItem = ({item, index}) => {
    return <CustomerListData item={item} index={index} />;
  };

  const CustomerListData = ({item}) => {
    var userIdText = '';
    var userIdValue = '';
    let savedUserIdInfo = Utilities.getSavedBusinessUserIdInfo();
    userIdText = savedUserIdInfo?.label || 'CustomerID';
    if (item?.additionalInfo?.length > 0) {
      const userIdIndex = item?.additionalInfo.findIndex(
        _item => _item.key === (savedUserIdInfo?.key || 'customerId'),
      );
      var _userIdValue = item?.customerId || 0;
      if (userIdIndex !== -1) {
        _userIdValue = item?.additionalInfo[userIdIndex]?.value;
      }
      userIdValue = _userIdValue;
    } else {
      userIdValue = 'N/A';
    }
    return isLoading ? (
      <ListLoader />
    ) : (
      <TouchableOpacity
        onPress={() =>
          isLoading
            ? null
            : navigation.navigate('CustomerDetailsScreen', {
                selectedCustomer: item,
              })
        }
        style={{
          borderTopWidth: 0.7,
          borderBottomWidth: 0.7,
          borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
          borderTopColor: Colors.LINE_SEPARATOR_COLOR,
          flexDirection: 'row',
          backgroundColor: Colors.WHITE_COLOR,
        }}>
        <View style={{marginHorizontal: 12, marginTop: 10}}>
          <GetImage
            style={{
              width: 38,
              height: 38,
              borderRadius: 38 / 2,
              borderWidth: 1,
              borderColor: Colors.PRIMARY_COLOR,
            }}
            fullName={(
              (item.firstName || 'N/A') +
              ' ' +
              (item.lastName || '')
            ).trim()}
            alphabetColor={Colors.SECONDARY_COLOR}
            url={item.image}
          />
        </View>
        <View style={{marginBottom: 20, paddingRight: 40}}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: Fonts.Gibson_SemiBold,
              color: Colors.CUSTOMER_NAME_COLOR,
              marginTop: 10,
              //  paddingRight: 120,
              textAlign: 'left',
            }}
            numberOfLines={1}>
            {item.firstName} {''}
            {item.lastName}
          </Text>
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              marginRight: 10,
              width: '66%',
              // backgroundColor:'red',
              // paddingRight:5,
            }}>
            <Image
              style={{width: 9, height: 12, marginTop: 3}}
              source={Images.LOCATION_ICON}
            />
            <Text
              style={{
                color: Colors.LOCATION_TEXT_COLOR,
                fontSize: 12,
                fontFamily: Fonts.Gibson_Regular,
                marginLeft: 5,
                // marginRight:25,
                textAlign: 'left',
                lineHeight: 15,
                width: '100%',
                marginHorizontal:40,
              }}
              numberOfLines={2}>
              {item.addressLineOne ? item.addressLineOne : <Text>N/A</Text>}
            </Text>
          </View>
          <View style={{marginTop: 8, flexDirection: 'row'}}>
            <Image style={{width: 12, height: 12}} source={Images.PHONE_ICON} />
            <Text
              style={{
                color: Colors.CUSTOMER_NAME_COLOR,
                fontSize: 12,
                fontFamily: Fonts.Gibson_Regular,
                marginLeft: 5,
              }}>
              {item.phoneNumber ? item.phoneNumber : <Text>N/A</Text>}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection:'row',
            position: 'absolute',
            right: 10,
            top: 10,
          }}>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 12,
            }}>
            {I18nManager.isRTL===true?
                        (t(Translations.CUSTOMER_ID))+ " : " : (t(Translations.CUSTOMER_ID))+":"
                        } 
          </Text>
          <View style={{ flexDirection:I18nManager.isRTL===true?'row-reverse':'row',
          }}>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 12,
            }}>
             {Globals.BUSINESS_DETAILS.customerPrefix}
          </Text>
          <Text
            style={{
              color: Colors.TEXT_GREY_COLOR_9B,
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 12,
            }}>
            
            {userIdValue}
          </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            right: 10,
            bottom: 10,
          }}>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Light,
              fontSize: 10,
            }}>
            {t(Translations.LAST_VISITED)}
          </Text>
          <Text
            style={{
              color: Colors.HOSPITAL_NAME_COLOR,
              fontFamily: Fonts.Gibson_Light,
              fontSize: 10,
              marginLeft: 3,
            }}>
            :
          </Text>
          <Text
            style={{
              color: Colors.LAST_VISITED_DATE_COLOR,
              fontSize: 12,
              fontFamily: Fonts.Gibson_Regular,
              marginLeft: 3,
            }}>
            {' '}
            {''}
            {item.lastVisit
              ? Utilities.getUtcToLocalWithFormat(item.lastVisit, 'DD MMM YYYY')
              : t(Translations.NO_VISIT)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1, backgroundColor: Colors.WHITE_COLOR}}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE_COLOR,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginBottom: 16,
            }}>
            <View
              style={{
                marginTop: 20,
                marginLeft: 20,
                marginRight: 10,
                width: DisplayUtils.setWidth(75),
                height: 40,
                justifyContent: 'center',
                //Shadow props
                borderWidth: 0.1,
                borderColor: Colors.GREY_COLOR,
                backgroundColor: Colors.WHITE_COLOR,
                shadowColor: Colors.SHADOW_COLOR,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 8,
              }}>
              <TextInput
                style={{
                  marginLeft: 16,
                  marginRight: 50,
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                  paddingRight: 30,
                }}
                placeholder={t(Translations.SEARCH)}
                color={Colors.PRIMARY_TEXT_COLOR}
                placeholderTextColor={Colors.TEXT_PLACEHOLDER_COLOR}
                autoCorrect={false}
                returnKeyType="search"
                editable={true}
                value={search}
                onSubmitEditing={() => {
                  searchButtonAction();
                }}
                onChangeText={text =>
                  text === ''
                    ? closeButtonAction()
                    : setSearch(text.trimStart())
                }
                ref={searchInputRef}
              />
              {search !== '' ? (
                <TouchableOpacity
                  style={{
                    width: 30,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    right: 45,
                  }}
                  onPress={() => closeButtonAction()}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                    }}
                    source={Images.CROSS_BUTTON_ICON}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => (search !== '' ? searchButtonAction() : null)}
                style={{
                  position: 'absolute',
                  right: 8,
                  justifyContent: 'center',
                  backgroundColor: Colors.SECONDARY_COLOR,
                  height: 31,
                  width: 31,
                  borderRadius: 4,
                }}>
                <Image
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: 'contain',
                    tintColor: Colors.WHITE_COLOR,
                    alignSelf: 'center',
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={Images.SEARCH_ICON}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => addNewCustomerButtonAction()}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                //Shadow props
                borderWidth: 0.4,
                borderColor: Colors.GREY_COLOR,
                backgroundColor: Colors.WHITE_COLOR,
                shadowColor: Colors.SHADOW_COLOR,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 8,
                borderRadius: 8,
              }}>
              <Image
                source={Images.PLUS_SQUARE_ICON}
                style={{
                  width: 26,
                  height: 26,
                  resizeMode: 'contain',
                  tintColor: Colors.SECONDARY_COLOR,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={{paddingBottom: 85}}
            data={isLoading ? dummyCustomerList : customerDataList}
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
              isLoading ? dummyCustomerList : CustomerEmptyComponent
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

export default React.memo(CustomerScreen);

const styles = StyleSheet.create({});
