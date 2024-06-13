import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  I18nManager,
  Image,
  ScrollView
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import React from 'react';
import {Fonts, Colors, Images, Translations} from '../../../constants';
import Utilities from '../../../helpers/utils/Utilities';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {useNavigation} from '@react-navigation/core';
import {GetImage} from '../../shared/getImage/GetImage';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import {t} from 'i18next';
import {Globals} from '../../../constants';
import { useSelector } from 'react-redux';
const HistoryDataCell = ({item, isLoading}) => {
  const navigation = useNavigation();
   //redux state for tabletview
   const isTablet = useSelector((state)=>state.tablet.isTablet);
  var userIdText = '';
  var userIdValue = '';
  let savedUserIdInfo = Utilities.getSavedBusinessUserIdInfo();
  userIdText = savedUserIdInfo?.label || 'CustomerID';
  if (item?.customer_id?.additionalInfo?.length > 0) {
    const userIdIndex = item?.customer_id?.additionalInfo.findIndex(
      _item => _item.key === (savedUserIdInfo?.key || 'customerId'),
    );
    var _userIdValue = item?.customer_id?.customerId || 0;
    if (userIdIndex !== -1) {
      _userIdValue = item?.customer_id?.additionalInfo[userIdIndex]?.value;
    }
    userIdValue = _userIdValue;
  } else {
    userIdValue = 'N/A';
  }

  //Shimmer loader for the flatList
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={120}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="60" y="20" rx="5" ry="5" width="120" height="8" />
      <Rect x="60" y="40" rx="5" ry="5" width="180" height="8" />
      <Rect x="60" y="60" rx="5" ry="5" width="220" height="8" />
      <Rect x="60" y="80" rx="5" ry="5" width="160" height="8" />
      <Rect x="60" y="100" rx="5" ry="5" width="80" height="8" />
      <Rect x="300" y="65" rx="0" ry="0" width="80" height="15" />
      <Rect x="300" y="85" rx="0" ry="0" width="80" height="15" />
      <Rect x="10" y="10" rx="20" ry="20" width="40" height="40" />
    </ContentLoader>
  );
  // return (
  //   <TouchableOpacity
  //     onPress={() =>
  //       isLoading
  //         ? null
  //         : navigation.navigate('AppointmentDetailsScreen', {
  //             selectedAppointment_id: item._id,
  //             selectedAppointmentType: item.name,
  //             isFrom: 'UPCOMING_LIST_SCREEN',
  //           })
  //     }
  //     style={{
  //       borderTopWidth: 0.7,
  //       borderBottomWidth: 0.7,
  //       borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
  //       borderTopColor: Colors.LINE_SEPARATOR_COLOR,
  //       flexDirection: 'row',
  //       backgroundColor: Colors.WHITE_COLOR,
  //     }}>
  //     {isLoading ? (
  //       <ListLoader />
  //     ) : (
  //       <>
  //         <View
  //           style={{
  //             marginHorizontal: 12,
  //             marginTop: 15,
  //             // width: responsiveWidth(10),
  //           }}>
  //           <GetImage
  //             style={{
  //               width: 38,
  //               height: 38,
  //               borderRadius: 38 / 2,
  //               borderWidth: 1,
  //               borderColor: Colors.PRIMARY_COLOR,
  //             }}
  //             fullName={(
  //               (item.customer_id.firstName || 'N/A') +
  //               ' ' +
  //               (item.customer_id.lastName || '')
  //             ).trim()}
  //             alphabetColor={Colors.SECONDARY_COLOR}
  //             url={item.customer_id.image}
  //           />
  //         </View>
  //         <View style={{flex: 1,}}>
  //           <View style={{marginBottom: 20, paddingRight: 15}}>
  //             <Text
  //               style={{
  //                 fontSize: 12,
  //                 fontFamily: Fonts.Gibson_SemiBold,
  //                 color: Colors.CUSTOMER_NAME_COLOR,
  //                 marginTop: 10,
  //                 textAlign: 'left',
  //               }}
  //               numberOfLines={1}>
  //               {item.customer_id.firstName} {''}
  //               {item.customer_id.lastName}
  //             </Text>
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 marginTop: 10,
  //               }}>
  //               <Text
  //                 style={{
  //                   color: Colors.HOSPITAL_NAME_COLOR,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   fontSize: 12,
  //                 }}>
  //                 {userIdText}
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: Colors.HOSPITAL_NAME_COLOR,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   fontSize: 12,
  //                 }}>
  //                 {''} #
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: Colors.SECONDARY_COLOR,
  //                   fontFamily: Fonts.Gibson_SemiBold,
  //                   fontSize: 12,
  //                 }}>
  //                 {' '}
  //                 {userIdValue}
  //               </Text>
  //             </View>
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 marginTop: 10,
  //               }}>
  //               <Text
  //                 style={{
  //                   color: Colors.HOSPITAL_NAME_COLOR,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   fontSize: 12,
  //                 }}>
  //                 {t(Translations.TIME)}
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: Colors.HOSPITAL_NAME_COLOR,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   fontSize: 12,
  //                 }}>
  //                 {''}#
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: Colors.SECONDARY_COLOR,
  //                   fontFamily: Fonts.Gibson_SemiBold,
  //                   fontSize: 12,
  //                 }}>
  //                 {' '}
  //                 {Utilities.getUtcToLocalWithFormat(item.dateFrom, 'hh:mm A')}
  //               </Text>
  //             </View>
  //             <View style={{marginTop: 8, flexDirection: 'row', width: '100%'}}>
  //               <Image
  //                 style={{width: 9, height: 12, marginTop: 5}}
  //                 source={Images.LOCATION_ICON}
  //               />
  //               <Text
  //                 style={{
  //                   color: Colors.SECONDARY_COLOR,
  //                   fontSize: 12,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   marginLeft: 5,
  //                   textAlign: 'left',
  //                   // width: '100%',
  //                   marginTop: 3,
  //                   lineHeight: 15,
  //                 }}
  //                 numberOfLines={2}>
  //                 {item.customer_id.addressLineOne}
  //               </Text>
  //             </View>
  //             <View style={{marginTop: 8, flexDirection: 'row'}}>
  //               <Image
  //                 style={{width: 12, height: 12}}
  //                 source={Images.PHONE_ICON}
  //               />
  //               <Text
  //                 style={{
  //                   color: Colors.CUSTOMER_NAME_COLOR,
  //                   fontSize: 12,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   marginLeft: 5,
  //                 }}>
  //                 {item.customer_id.phoneNumber}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //           <View style={{
  //             //  marginTop:70,marginRight:10
  //              alignItems: 'flex-end',
  //             position: 'absolute',
  //             right: 10,
  //             bottom: 20,
  //             }}>
  //             <TouchableOpacity
  //               style={{
  //                 backgroundColor: Colors.PRIMARY_COLOR,
  //                 padding: 5,
  //                 width: 90,
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //               }}>
  //               <Text
  //                 style={{
  //                   color: Colors.WHITE_COLOR,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   fontSize: 12,
  //                 }}>
  //                 {item.name === 'Booking'
  //                   ? t(Translations.BOOKING).toUpperCase()
  //                   : t(Translations.QUEUE).toUpperCase()}
  //               </Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={{
  //                 backgroundColor: Colors.SECONDARY_COLOR,
  //                 padding: 5,
  //                 width: 90,
  //                 marginTop: 8,
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //               }}>
  //               <Text
  //                 style={{
  //                   color: Colors.WHITE_COLOR,
  //                   fontFamily: Fonts.Gibson_Regular,
  //                   fontSize: 12,
  //                 }}>
  //                 {item.status.toUpperCase()}
  //               </Text>
  //             </TouchableOpacity>
  //           </View>
  //       </>
  //     )}
  //   </TouchableOpacity>
  // );
  return (
    <ScrollView>
    <TouchableOpacity
         onPress={() =>
          isLoading
            ? null
            : navigation.navigate('AppointmentDetailsScreen', {
                selectedAppointment_id: item._id,
                selectedAppointmentType: item.name,
                isFrom: 'UPCOMING_LIST_SCREEN',
              })
        }
          >
      <View
        style={{
          borderTopWidth: 0.7,
          borderBottomWidth: 0.7,
          borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
          borderTopColor: Colors.LINE_SEPARATOR_COLOR,
          flexDirection: 'row',
          backgroundColor: Colors.WHITE_COLOR,
        }}>
        {isLoading ? (
          <ListLoader />
        ) : (
          <>
            <View style={{marginHorizontal: 12, marginTop: 15}}>
              <GetImage
                style={{
                  width: isTablet===true?50:38,
                  height: isTablet===true?50:38,
                  borderRadius:isTablet===true?50/2: 38 / 2,
                  borderWidth: 1,
                  borderColor: Colors.SECONDARY_COLOR,
                }}
                fullName={(
                  (item.customer_id.firstName || 'N/A') +
                  ' ' +
                  (item.customer_id.lastName || '')
                ).trim()}
                alphabetColor={Colors.PRIMARY_COLOR}
                url={item.customer_id.image}
              />
            </View>
            <View style={{width: DisplayUtils.setWidth(60)}}>
              <View style={{marginBottom: 20, paddingRight: 15}}>
                <Text
                  style={{
                    fontSize:isTablet===true?18: 12,
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.CUSTOMER_NAME_COLOR,
                    marginTop: 10,
                    textAlign: 'left',
                  }}
                  numberOfLines={1}>
                  {item.customer_id.firstName} {''}
                  {item.customer_id.lastName}
                </Text>
                <View
                  style={{
                    flexDirection:'row',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:isTablet===true?18: 12,
                    }}>
                     {I18nManager.isRTL===true?
                         (t(Translations.CUSTOMER_ID))+ " : " : (t(Translations.CUSTOMER_ID))+":"
                        } 
                  </Text>
                  <View style={{ flexDirection:I18nManager.isRTL===true?'row-reverse':'row',
                  marginLeft:I18nManager.isRTL===true?responsiveHeight(7):0}}>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet===true?18:12,
                    }}>
                    {Globals.BUSINESS_DETAILS.customerPrefix}
                  </Text>
                  {Globals.HIDE_FOR_PRACTO ===true?
            <Text
            style={{
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize:isTablet===true?16: 12,
              color: Colors.SECONDARY_COLOR,
              alignSelf: 'center',
            }}
            numberOfLines={1}>
            {item?.customer_id?.customerId || 'N/A'}
          </Text>:
                  <Text
                    style={{
                      color: Colors.SECONDARY_COLOR,
                      fontFamily: Fonts.Gibson_SemiBold,
                      fontSize:isTablet===true?18: 12,
                    }}>
                    {userIdValue}
                  </Text>}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet===true?18:12,
                    }}>
                    {t(Translations.TIME)}
                  </Text>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:isTablet===true?18: 12,
                    }}>
                    {''}#
                  </Text>
                  <Text
                    style={{
                      color: Colors.SECONDARY_COLOR,
                      fontFamily: Fonts.Gibson_SemiBold,
                      fontSize:isTablet===true?18: 12,
                    }}>
                    {' '}
                    {Utilities.getUtcToLocalWithFormat(
                      item.dateFrom,
                      'hh:mm A',
                    )}
                  </Text>
                </View>
                <View style={{marginTop: 8, flexDirection: 'row'}}>
                  <Image
                    style={{width:isTablet===true?13: 9, height:isTablet===true?16: 12, marginTop: 5}}
                    source={Images.LOCATION_ICON}
                  />
                  <Text
                    style={{
                      color: Colors.SECONDARY_COLOR,
                      fontSize:isTablet===true?16: 12,
                      fontFamily: Fonts.Gibson_Regular,
                      marginLeft: 5,
                      textAlign: 'left',
                      lineHeight: 15,
                      marginTop: 3,
                    }}
                    numberOfLines={2}>
                    {item.customer_id.addressLineOne ? item.customer_id.addressLineOne : <Text>N/A</Text>}
                  </Text>
                </View>
                <View style={{marginTop: 8, flexDirection: 'row'}}>
                  <Image
                    style={{width:isTablet===true?15: 12, height:isTablet===true?15: 12}}
                    source={Images.PHONE_ICON}
                  />
                  <Text
                    style={{
                      color: Colors.CUSTOMER_NAME_COLOR,
                      fontSize: isTablet===true?16:12,
                      fontFamily: Fonts.Gibson_Regular,
                      marginLeft: 5,
                    }}>
                    {item.customer_id.phoneNumber ? item.customer_id.phoneNumber : <Text>N/A</Text>}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                position: 'absolute',
                right: 10,
                bottom: 45,
              }}>
              <View
                activeOpacity={1}
                style={{
                  backgroundColor: Colors.PRIMARY_COLOR,
                  padding: 5,
                  width:isTablet===true?95: 80,
                  height:isTablet===true?responsiveHeight(4.5):responsiveHeight(3),
                    marginRight:isTablet===true?responsiveHeight(10):0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize:isTablet===true?16:10,
                  }}>
                  {item.name === 'Booking'
                    ? t(Translations.BOOKING)
                    : t(Translations.QUEUE)}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.SECONDARY_COLOR,
                  padding: 5,
                  width: isTablet===true?95:80,
                  height:isTablet===true?responsiveHeight(4.5):responsiveHeight(3),
                    marginRight:isTablet===true?responsiveHeight(10):0,
                  marginTop: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: isTablet===true?16:10,
                  }}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HistoryDataCell;

const styles = StyleSheet.create({});
