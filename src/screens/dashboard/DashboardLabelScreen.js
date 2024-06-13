
import React,{useState} from 'react'
import { StyleSheet, Text, View,Image,ScrollView,I18nManager } from 'react-native';
import { Colors,Fonts,Images,Strings,Translations,Globals } from '../../constants';
import { useSelector } from 'react-redux';
import Utilities from '../../helpers/utils/Utilities';
import {t} from 'i18next';
import moment from 'moment';
import APIConnections from '../../helpers/apiManager/APIConnections';
import DataManager from '../../helpers/apiManager/DataManager';
import StorageManager from '../../helpers/storageManager/StorageManager';
import { useFocusEffect } from '@react-navigation/core';
import { responsiveHeight,responsiveWidth } from 'react-native-responsive-dimensions';

const DashboardLabelScreen = () => {
//redux state for tabletview
const isTablet = useSelector((state)=>state.tablet.isTablet);

const [dashboardCountInfo, setDashboardCountInfo] = useState({});
const [selectedDate, setSelectedDate] = useState(
    Utilities.convertorTimeToBusinessTimeZone(moment().format()),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWeekDayText, setSelectedWeekDayText] = useState(
    t(Translations.TODAY),
  );



  useFocusEffect(
    React.useCallback(() => {
      getUserDetails(Globals.USER_DETAILS?._id);
      {

      }

      return () => {};
    }, []),
  );



//API Calls
  /**
          *
          * Purpose: Get user details
          * Created/Modified By: loshith
          * Created/Modified Date: 28 april 2023
          * Steps:
              1.fetch business details from API and append to state variable
   */
              const getUserDetails = (userId, isForStatusAvailability = false) => {
                setIsLoading(true);
                DataManager.getUserDetails(userId).then(([isSuccess, message, data]) => {
                  if (isSuccess === true) {
                    if (data.objects !== undefined && data.objects !== null) {
                      StorageManager.saveUserDetails(data.objects);
                      Globals.USER_DETAILS = data.objects;
                      if (isForStatusAvailability === true) {
                        //Need to check user latest break count and show popup
                        setIsLoading(false);
                        // configureUserAvailability();
                        // refRBSheetAvailabilityPopup.current.open();
                      } else {
                        getDashboardCounts();
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
                  } else {
                    Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
                    setIsLoading(false);
                  }
                });
              };

/**
      *
      * Purpose: Get dashboard counts
      * Created/Modified By: Loshith
      * Created/Modified Date: 28 April 2023
      * Steps:
         1.fetch details from API and append to state variable
     */
         const getDashboardCounts = (dateValue = selectedDate) => {
            setIsLoading(true);
            let offsetValue = Utilities.getBusinessTimeZoneOffset();
            let dateSelected = Utilities.appendBusinessTimeZoneToDate(dateValue);
            let dateToSent =
              moment(dateSelected).format('dddd D MMMM YYYY 00:00:00 ') + offsetValue;
            console.log(
              `getDashboardCounts offsetValue: ${offsetValue} dateSelected: ${dateSelected} dateToSent: ${dateToSent} `,
            );
            const body = {
              [APIConnections.KEYS.TIME]: dateToSent,
            };
            DataManager.getDashboardCounts(body).then(([isSuccess, message, data]) => {
              if (isSuccess === true) {
                if (data.objects !== undefined && data.objects !== null) {
                  setDashboardCountInfo(data.objects);
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
                Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
                setIsLoading(false);
              }
            });
          };

  return (
    <View style={{marginHorizontal:0}}>
   {/* <ScrollView 
   horizontal
   showsHorizontalScrollIndicator={false}> */}
    <View
              style={{
                height:responsiveHeight(12),
                width:responsiveWidth(92.5),
                marginTop: 2,
                marginLeft: 30,
                marginRight: 30,
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
              <View style={{height:responsiveHeight(12), flexDirection:'row'}}>
                <View
                  style={{
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderColor: Colors.LINE_SEPARATOR_COLOR,
                  }}>
                  <Image
                    style={{
                      width:22,
                      height:22,
                      marginTop: 12,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                    }}
                    source={Images.DASHBOARD_APPOINTMENTS_ICON}
                  />
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:15,
                        color: Colors.PRIMARY_TEXT_COLOR,
                        textAlign: 'left',
                      }}>
                      {(
                        dashboardCountInfo?.allAppointmentsCount || 0
                      ).toString()}
                    </Text>
                    <View
                      style={{
                        marginLeft: 3,
                        borderWidth: 1,
                        borderColor: Colors.PRIMARY_COLOR,
                        justifyContent: 'center',
                        padding: 3,
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Gibson_Regular,
                          fontSize:12,
                          color: Colors.PRIMARY_COLOR,
                        }}>
                        {dashboardCountInfo?.appointmentSign === 'minus'
                          ? '-'
                          : ''}
                        {(
                          dashboardCountInfo?.allAppointmentsCountPercentage ||
                          0
                        ).toString()}
                        %
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {t(Translations.APPOINTMENT)}
                  </Text>
                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Light,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {selectedWeekDayText}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderColor: Colors.LINE_SEPARATOR_COLOR,
                  }}>
                  <Image
                    style={{
                      width:22,
                      height:22,
                      marginTop: 12,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                    }}
                    source={Images.DASHBOARD_NEW_CUSTOMERS_ICON}
                  />

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:15,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {(dashboardCountInfo?.customersCount || 0).toString()}
                    </Text>
                    <View
                      style={{
                        marginLeft: 3,
                        borderWidth: 1,
                        borderColor: Colors.PRIMARY_COLOR,
                        justifyContent: 'center',
                        padding: 3,
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Gibson_Regular,
                          fontSize:12,
                          color: Colors.PRIMARY_COLOR,
                        }}>
                        {dashboardCountInfo?.customerSign === 'minus'
                          ? '-'
                          : ''}
                        {(
                          dashboardCountInfo?.customersCountPercentage || 0
                        ).toString()}
                        %
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      textAlign: 'left',
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {t(Translations.NEW_CUSTOMERS)}
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Light,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      textAlign: 'left',
                    }}>
                    {selectedWeekDayText}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderColor: Colors.LINE_SEPARATOR_COLOR,
                  }}>
                  <Image
                    style={{
                      width:22,
                      height:22,
                      marginTop: 12,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                    }}
                    source={Images.DASHBOARD_WALK_IN_ICON}
                  />

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:15,
                        color: Colors.PRIMARY_TEXT_COLOR,
                        textAlign: 'left',
                      }}>
                      {(dashboardCountInfo?.walkinCount || 0).toString()}
                    </Text>
                    <View
                      style={{
                        marginLeft: 3,
                        borderWidth: 1,
                        borderColor: Colors.PRIMARY_COLOR,
                        justifyContent: 'center',
                        padding: 3,
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Gibson_Regular,
                          fontSize:12,
                          color: Colors.PRIMARY_COLOR,
                        }}>
                        {dashboardCountInfo?.walkinSign === 'minus' ? '-' : ''}
                        {(
                          dashboardCountInfo?.walkinCountPercentage || 0
                        ).toString()}
                        %
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {t(Translations.WALK_IN)}
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Light,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {selectedWeekDayText}
                  </Text>
                </View>
                
                <View
                  style={{
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderColor: Colors.LINE_SEPARATOR_COLOR,
                  }}>
                  <Image
                    style={{
                      width:22,
                      height:22,
                      marginTop: 12,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                    }}
                    source={Images.DASHBOARD_CANCELLED_ICON}
                  />

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:15,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {(dashboardCountInfo?.cancellCount || 0).toString()}
                    </Text>
                    <View
                      style={{
                        marginLeft: 3,
                        borderWidth: 1,
                        borderColor: Colors.PRIMARY_COLOR,
                        justifyContent: 'center',
                        padding: 3,
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Gibson_Regular,
                          fontSize:12,
                          color: Colors.PRIMARY_COLOR,
                        }}>
                        {dashboardCountInfo?.cancellSign === 'minus' ? '-' : ''}
                        {(
                          dashboardCountInfo?.cancellCountPercentage || 0
                        ).toString()}
                        %
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      textAlign: 'left',
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {t(Translations.CANCELLED)}
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Light,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {selectedWeekDayText}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderColor: Colors.LINE_SEPARATOR_COLOR,
                  }}>
                  <Image
                    style={{
                      width:22,
                      height:22,
                      marginTop: 12,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                    }}
                    source={Images.DASHBOARD_NO_SHOW_ICON}
                  />

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:15,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {(dashboardCountInfo?.noshowCount || 0).toString()}
                    </Text>
                    <View
                      style={{
                        marginLeft: 3,
                        borderWidth: 1,
                        borderColor: Colors.PRIMARY_COLOR,
                        justifyContent: 'center',
                        padding: 3,
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Gibson_Regular,
                          fontSize:12,
                          color: Colors.PRIMARY_COLOR,
                        }}>
                        {dashboardCountInfo?.noshowSign === 'minus' ? '-' : ''}
                        {(
                          dashboardCountInfo?.noshowCountPercentage || 0
                        ).toString()}
                        %
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {t(Translations.DASH_BOARD_NO_SHOW)}
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Light,
                      fontSize: 14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {selectedWeekDayText}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderColor: Colors.LINE_SEPARATOR_COLOR,
                  }}>
                  <Image
                    style={{
                      width:22,
                      height:22,
                      marginTop: 12,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                    }}
                    source={Images.DASHBOARD_SERVING_TIME_ICON}
                  />

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 2,
                        fontFamily: Fonts.Gibson_SemiBold,
                        fontSize:15,
                        color: Colors.PRIMARY_TEXT_COLOR,
                      }}>
                      {(dashboardCountInfo?.avgTime || 0).toString()}
                    </Text>
                    <View
                      style={{
                        marginLeft: 3,
                        borderWidth: 1,
                        borderColor: Colors.GREEN_COLOR,
                        justifyContent: 'center',
                        padding: 3,
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Gibson_Regular,
                          fontSize:12,
                          color: Colors.PRIMARY_TEXT_COLOR,
                        }}>
                        {t(Translations.MINS)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                      textAlign: 'left',
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {t(Translations.AVERAGE_WAITING)}
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      alignSelf: 'center',
                      fontFamily: Fonts.Gibson_Light,
                      fontSize:14,
                      color: Colors.PRIMARY_TEXT_COLOR,
                    }}>
                    {selectedWeekDayText}
                  </Text>
                </View>
              </View>
            </View>
            {/* </ScrollView> */}
            </View>
  );
};

export default DashboardLabelScreen;

const styles = StyleSheet.create({})