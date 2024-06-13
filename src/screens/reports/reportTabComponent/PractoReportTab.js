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
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import FastImage from 'react-native-fast-image';

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
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import HistoryScreen from '../history/HistoryScreen';
import UpComingBookingScreen from '../upcoming/UpComingBookingScreen';
import {t} from 'i18next';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import { useSelector } from 'react-redux';
export default function PractoReportTab() {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const FirstRoute = () => <UpComingBookingScreen />;
  const SecondRoute = () => <HistoryScreen />;
  
//redux state for tabletview
const isTablet = useSelector((state)=>state.tablet.isTablet);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,

  });
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    
    {key: 'first', title: t(Translations.UPCOMING)},
    {key: 'second', title: t(Translations.HISTORY)},
    
  ]);

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: 'transparent'}}
        // activeColor="#000000"
        // inactiveColor="#FFFFFF"
        pressColor={Colors.WHITE_COLOR}
        bounces={false}
        style={{
          backgroundColor: Colors.WHITE_COLOR,
          elevation: 0,
          height: 43,
          shadowColor: 'transparent',
          shadowOpacity: 0,
        }}
        renderLabel={({route, focused, color}) => (
          <View
            style={{
              height: 30,
              borderBottomWidth: focused ? 2 : 0,
              borderBottomColor: focused
                ? Colors.DARK_BROWN_COLOR
                : Colors.TAB_VIEW_LABEL_COLOR,
              width: DisplayUtils.setWidth(100) / 2,
              alignItems: 'center',
              // paddingHorizontal: 3,
            }}>
            <Text
              style={{
                fontSize: isTablet===true?25:17,
                fontFamily: Fonts.Gibson_SemiBold,
                color: focused
                  ? Colors.DARK_BROWN_COLOR
                  : Colors.TAB_VIEW_LABEL_COLOR,
                backgroundColor: 'transparent',
                //   marginTop: 5,
              }}>
              {route.title}
            </Text>
          </View>
        )}
        tabStyle={{
          flexDirection: 'row',
          // width: I18nManager.isRTL ? undefined : 'auto',
        }}
        labelStyle={{}}
        getLabelText={({route}) => route.title}
      />
    );

  const Tabs = () => {
    return (
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        lazy={true}
        // onIndexChange={i => (I18nManager.isRTL ? setIndex(4 - i) : setIndex(i))}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        style={styles.tabContainer}
        initialLayout={{width: layout.width}}
      />
    );
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE_COLOR,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}>
        <LoadingIndicator visible={isLoading} />
        <StatusBar
          backgroundColor={Colors.BACKGROUND_COLOR}
          barStyle="dark-content"
        />
        <View style={{flex:1}}>
          <Tabs />
        </View>

        {/* BottomBar */}
        <View
          style={{
            borderTopColor: Colors.SHADOW_COLOR,
            justifyContent: 'center',
            borderTopWidth: 0.5,
            height: 81,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            //Shadow props
            backgroundColor: Colors.WHITE_COLOR,
            shadowColor: Colors.SHADOW_COLOR,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 8,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DashboardScreen')}
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Colors.SHADOW_COLOR,
              height: 81,
              width: 75,
              justifyContent: 'center',
            }}>
            <Image
              source={Images.YWAIT_Y_LOGO}
              style={{
                width:isTablet===true? 45:30,
                height: isTablet===true?45:30,
                alignSelf: 'center',
                tintColor: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ManageQueueScreen')}
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Colors.SHADOW_COLOR,
              height: 81,
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={Images.MANAGE_QUEUE_ICON}
              style={{
                width: isTablet===true?25:16,
                height: isTablet===true?25:16,
                alignSelf: 'center',
                tintColor: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                resizeMode: 'contain',
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
            <Text
              style={{
                marginLeft: 8,
                marginRight: 8,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: isTablet===true?18:14,
                color: Colors.INACTIVE_BOTTOM_BAR_COLOR,
                alignSelf: 'center',
              }}>
              {t(Translations.MANAGE_QUEUE)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Colors.SHADOW_COLOR,
              height: 81,
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={Images.REPORTS_ICON}
              style={{
                width: isTablet===true?25: 16,
                height: isTablet===true?25: 16,
                alignSelf: 'center',
                tintColor: Colors.SECONDARY_COLOR,
                resizeMode: 'contain',
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
            <Text
              style={{
                marginLeft: 8,
                marginRight: 8,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: isTablet===true?18:14,
                color: Colors.SECONDARY_COLOR,
                alignSelf: 'center',
              }}>
              {t(Translations.REPORTS)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  tabContainer: {
    marginTop: 20,
  },
});
