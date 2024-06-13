import {t} from 'i18next';
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  TextInput,
  I18nManager,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Fonts,
  Colors,
  Images,
  Strings,
  Globals,
  Translations,
} from '../../../constants';
import {GraphFilterOption} from '../../../helpers/enums/Enums';

const PinSettingsPopupScreen = props => {
  //Declaration
  const insets = useSafeAreaInsets();
  const titleText = t(Translations.PIN_AUTHENTICATION);
  const [contentList, setContentList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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
    const selectedItem = contentList[index];

    if (props.didSelectItem !== undefined) {
      props.didSelectItem(selectedItem === 'Yes' ? true : false);
    }

    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  //Other functions
  const loadData = () => {
    let items = ['Yes', 'No'];
    setContentList(items);
    let selectedOption = Globals.SHARED_VALUES.SELECTED_PIN_AUTH_SETTINGS;
    if (selectedOption === true) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(1);
    }
  };

  /**
        * Purpose: Render cell
        * Created/Modified By: Jenson
        * Created/Modified Date: 13 Jan 2022
        * Steps:
            1.Display the details to component
    */
  const RenderListItem = ({item, index}) => {
    let _item =
      item.toUpperCase() === 'Yes'.toUpperCase()
        ? t(Translations.YES)
        : t(Translations.NO);
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
              numberOfLines={1}>
              {_item}
            </Text>
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
          height: 0.3,
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
export default PinSettingsPopupScreen;
