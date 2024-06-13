import {t} from 'i18next';
import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  I18nManager,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../../constants';
import APIConnections from '../../../../helpers/apiManager/APIConnections';
import DataManager from '../../../../helpers/apiManager/DataManager';
import Utilities from '../../../../helpers/utils/Utilities';
import LoadingIndicator from '../../../shared/loadingIndicator/LoadingIndicator';
import SuccessPopupScreen from '../../../shared/successPopup/SuccessPopupScreen';

const NotifyTimeExtensionScreen = props => {
  //Declaration
  const insets = useSafeAreaInsets();
  const titleText = 'Notify time extension';
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const refRBSheetSuccessPopup = useRef();

  useEffect(() => {
    loadData();
  }, []);

  //Button actions
  const closePopupAction = () => {
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  const didSelectItem = index => {
    setSelectedIndex(index);
    setIsLoading(true);
    const selectedItem = contentList[index];
    let mins = Utilities.convertSecondsToMins(selectedItem);
    // console.log('mins: ',mins);
    performNotifyDelay(mins);
  };

  //Other functions
  const loadData = () => {
    let items = [900, 1800, 3600];
    setContentList(items);
  };

  /**
             *
             * Purpose: Perform notify delay
             * Created/Modified By: Jenson
             * Created/Modified Date: 04 Feb 2022
             * Steps:
                 1.fetch data from API and append to state variable
      */
  const performNotifyDelay = duration => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.BUSINESS_ID]: Globals.BUSINESS_ID,
      [APIConnections.KEYS.USER_ID]: Globals.USER_DETAILS._id,
      [APIConnections.KEYS.DURATION]: duration,
    };

    DataManager.performNotifyDelay(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        Globals.SHARED_VALUES.SUCCESS_MESSAGE = t(
          Translations.NOTIFICATION_SENT_SUCCESSFULLY,
        );
        setIsLoading(false);
        refRBSheetSuccessPopup.current.open();
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };

  const SuccessPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetSuccessPopup}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
          draggableIcon: {
            backgroundColor: Colors.PRIMARY_TEXT_COLOR,
          },
        }}
        height={320}
        onClose={successPopupOnCloseHandler}>
        <SuccessPopupScreen
          RBSheet={refRBSheetSuccessPopup}
          //didSelectOk={selectedOkHandler}
        />
      </RBSheet>
    );
  };

  const successPopupOnCloseHandler = () => {
    closePopupAction();
  };

  /**
        * Purpose: Render cell
        * Created/Modified By: Jenson
        * Created/Modified Date: 13 Jan 2022
        * Steps:
            1.Display the details to component
    */
  const RenderListItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => didSelectItem(index)}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE_COLOR,
            height: 40,
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', alignContent: 'center'}}>
            <Image
              style={{marginLeft: 16, width: 16, height: 16}}
              source={
                selectedIndex === index
                  ? Images.RADIO_BUTTON_ON
                  : Images.RADIO_BUTTON_OFF
              }
            />
            <Text
              style={{
                marginTop: 2,
                marginLeft: 8,
                marginRight: 16,
                color: Colors.BLACK_COLOR,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 14,
                textAlign: 'left',
              }}
              numberOfLines={1}>{`${Utilities.convertHMS(item)}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /**
       * Purpose:Render function of flat list
       * Created/Modified By: Jenson John
       * Created/Modified Date: 27 Dec 2021
       * Steps:
           1.pass the data from local model to render child component
   */
  const renderItem = ({item, index}) => {
    return <RenderListItem item={item} index={index} />;
  };

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          backgroundColor: Colors.GREY_COLOR,
          opacity: 0.5,
          marginTop: 8,
        }}
      />
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={{flex: 2, height: '100%'}}>
        <Text
          style={{
            marginTop: 20,
            marginLeft: 20,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 14,
            color: '#E0251B',
          }}>
          {t(Translations.NO_RESULT_FOUND)}
        </Text>
        <View style={{flex: 1}} />
      </View>
    );
  };

  //Final return
  return (
    <View
      style={{
        flex: 1,
      }}>
      <LoadingIndicator visible={isLoading} />
      <SuccessPopup />
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 14,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign: 'left',
        }}>
        {titleText}
      </Text>
      <TouchableOpacity onPress={() => closePopupAction()}>
        <Image
          style={{
            position: 'absolute',
            right: 20,
            top: -16,
            tintColor: Colors.PRIMARY_TEXT_COLOR,
          }}
          source={Images.CLOSE_ICON}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 14,
          marginTop: 20,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
        }}>
        {t(
          Translations.SELECT_AN_OPTION_FROM_LIST_TO_NOTIFY_EXTENDED_SERVING_TIME_ARRIVED_VISITORS_WILL_BE_NOTIFIED,
        )}
      </Text>

      <FlatList
        //ref={(ref) => flatListRef = ref}
        style={{marginTop: 20, marginBottom: 24}}
        //contentContainerStyle={{ paddingVertical: 10 }}
        showsHorizontalScrollIndicator={false}
        data={contentList}
        renderItem={renderItem}
        extraData={contentList}
        keyExtractor={(item, index) => index.toString()} //2
        ListEmptyComponent={listEmptyComponent}
        ItemSeparatorComponent={FlatListItemSeparator}
        keyboardShouldPersistTaps={'handled'}
      />
    </View>
  );
};
export default NotifyTimeExtensionScreen;
