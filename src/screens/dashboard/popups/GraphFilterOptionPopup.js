import { t } from 'i18next';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../constants';
import {
  GraphFilterOption,
  DepartmentGraphFilterOption,
} from '../../../helpers/enums/Enums';
import { useSelector } from 'react-redux';

const GraphFilterOptionPopup = props => {
  //Declaration
  const insets = useSafeAreaInsets();
  const titleText = 'Filter';
  const [contentList, setContentList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
    //redux state for tabletview
    const isTablet = useSelector((state)=>state.tablet.isTablet);

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

    if (Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE === 'DepartmentVisit') {
      if (props.didSelectItem !== undefined) {
        props.didSelectItem(
          selectedItem === t(Translations.TODAY)
            ? DepartmentGraphFilterOption.daily
            : selectedItem === t(Translations.LAST_7_DAYS)
            ? DepartmentGraphFilterOption.weekly
            : DepartmentGraphFilterOption.monthly,
        );
      }
    } else {
      if (props.didSelectItem !== undefined) {
        props.didSelectItem(
          selectedItem === t(Translations.DAILY)
            ? GraphFilterOption.daily
            : GraphFilterOption.weekly,
        );
      }
    }

    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  //Other functions
  const loadData = () => {
    if (Globals.SHARED_VALUES.GRAPH_FILTER_POPUP_SOURCE === 'DepartmentVisit') {
      let items = [t(Translations.TODAY), t(Translations.LAST_7_DAYS), t(Translations.LAST_30_DAYS)];
      setContentList(items);
      let selectedOption = Globals.SHARED_VALUES.SELECTED_GRAPH_FILTER_OPTION;
      if (selectedOption === DepartmentGraphFilterOption.daily) {
        setSelectedIndex(0);
      } else if (selectedOption === DepartmentGraphFilterOption.weekly) {
        setSelectedIndex(1);
      } else {
        setSelectedIndex(2);
      }
    } else {
      let items = [t(Translations.DAILY), t(Translations.WEEKLY)];
      setContentList(items);
      let selectedOption = Globals.SHARED_VALUES.SELECTED_GRAPH_FILTER_OPTION;
      if (selectedOption === GraphFilterOption.weekly) {
        setSelectedIndex(1);
      } else {
        setSelectedIndex(0);
      }
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
              style={{marginLeft: 16, width:isTablet===true?20: 16, height:isTablet===true?20: 16}}
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
                fontSize:isTablet===true?18: 14,
              }}
              numberOfLines={1}>
              {item}
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
      {/* title */}
      <Text
        style={{
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: isTablet===true?20:14,
          marginLeft:16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign:'left'
        }}>
        {t(Translations.FILTER)}
      </Text>
      <TouchableOpacity onPress={() => closePopupAction()}>
        <Image
          style={{
            position: 'absolute',
            right: 20,
            top: isTablet===true?-25:-16,
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
export default GraphFilterOptionPopup;
