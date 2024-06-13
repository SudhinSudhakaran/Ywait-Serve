import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../constants';
import {t} from 'i18next';
import LottieView from 'lottie-react-native';
import Utilities from '../../helpers/utils/Utilities';
import {useFocusEffect} from '@react-navigation/core';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import StorageManager from '../../helpers/storageManager/StorageManager';

const GenderSelectionScreen = props => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [genderList, setGenderList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    configureGenderFromBusiness();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const configureGenderFromBusiness = () => {
    let genderOptions = Utilities.getGenderOptions();
    setGenderList(genderOptions);
  };

  /**
            * Purpose: List empty component
            * Created/Modified By: Sudhin Sudhakaran
            * Created/Modified Date: 11 Oct 2021
            * Steps:
                1.Return the component when list is empty
        */
  const GenderEmptyComponent = () => {
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
  const cellPressAction = item => {
    if (Utilities?.isUserIsAdmin() === true||Utilities?.isUserIsAdmin() === false) {
      navigation.navigate('AllServingUsersList', {selectedGender: item});
    } else {
      navigation.navigate('NewBookingCustomerListScreen', {
        isServingUserSelected: true,
        selectedServingUserId: Globals.USER_DETAILS?._id,
        selectedGender: item,
        parentSource: 'dashboard',
      });
    }
  };
  /**
         * Purpose:Render function of flat list
         * Created/Modified By: Sudhin Sudhakaran
         * Created/Modified Date: 8 Oct 2021
         * Steps:
             1.pass the data from api to customer details child component
     */
  const renderItem = ({item, index}) => {
    return <GenderListData item={item} index={index} />;
  };

  const GenderListData = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.WHITE_COLOR,
          marginLeft: 10,
          borderColor: Colors.LINE_SEPARATOR_COLOR,
          borderWidth: 1,
          width: '30%',
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
        }}
        onPress={() => cellPressAction(item)}>
        {item === 'Male' ? (
          <LottieView
            style={{width: 40, height: 40}}
            source={Images.MALE_ANIMATION_ICON}
            autoPlay
            loop
            colorFilters={[
              {
                keypath: 'ywait#primary',
                color: Colors.PRIMARY_COLOR,
              },
              {
                keypath: 'ywait#secondary',
                color: Colors.SECONDARY_COLOR,
              },
            ]}
          />
        ) : item === 'Female' ? (
          <LottieView
            style={{width: 40, height: 40}}
            source={Images.FEMALE_ANIMATION_ICON}
            autoPlay
            loop
            colorFilters={[
              {
                keypath: 'ywait#primary',
                color: Colors.PRIMARY_COLOR,
              },
              {
                keypath: 'ywait#secondary',
                color: Colors.SECONDARY_COLOR,
              },
            ]}
          />
        ) : (
          <LottieView
            style={{width: 40, height: 40}}
            source={Images.OTHER_ANIMATION_ICON}
            autoPlay
            loop
            colorFilters={[
              {
                keypath: 'ywait#primary',
                color: Colors.PRIMARY_COLOR,
              },
              {
                keypath: 'ywait#secondary',
                color: Colors.SECONDARY_COLOR,
              },
            ]}
          />
        )}
        <Text
          style={{
            marginTop: 16,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 14,
            color: Colors.PRIMARY_TEXT_COLOR,
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  //final return
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.BACKGROUND_COLOR,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}>
        <StatusBar
          backgroundColor={Colors.BACKGROUND_COLOR}
          barStyle="dark-content"
        />
        <View style={styles.header}>
          <View
            style={{
              marginTop: 25,
              marginLeft: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center', marginRight: 20}}
              onPress={() => navigation.goBack()}>
              <Image
                style={{
                  height: 17,
                  width: 24,
                  transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                }}
                source={Images.BACK_ARROW_IMAGE}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Fonts.Gibson_SemiBold,
                color: Colors.PRIMARY_TEXT_COLOR,
                fontSize: 18,
              }}>
              {t(Translations.CHOOSE_GENDER)}
            </Text>
          </View>
        </View>

        <FlatList
          // contentContainerStyle={{ paddingBottom: 85 }}
          style={{ marginTop: 12}}
          data={genderList}
          renderItem={renderItem}
          horizontal={false}
          numColumns={3}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          ListEmptyComponent={isLoading ? null : GenderEmptyComponent}
        />
      </View>
    </>
  );
};

export default GenderSelectionScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.PRIMARY_WHITE,
    width: DisplayUtils.setWidth(100),
    height: 70,
    borderBottomColor: Colors.LINE_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
  },
});
