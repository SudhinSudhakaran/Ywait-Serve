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
  Keyboard,
} from 'react-native';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../../constants';
import DataManager from '../../../helpers/apiManager/DataManager';
import Utilities from '../../../helpers/utils/Utilities';
import {t} from 'i18next';
import SearchBox from '../SearchBox';
import { useSelector } from 'react-redux';

const StateAndCityPopupScreen = props => {
  //Declaration
  const titleText = Globals.SHARED_VALUES.COUNTRY_POPUP_TITLE;
  const [isLoading, setIsLoading] = useState(false);
  const [stateOrCityList, setStateOrCityList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
   //redux state for tabletview
   const isTablet = useSelector((state)=>state.tablet.isTablet);

  useEffect(() => {
    loadData();
  }, []);

  // DUMMY DATA
  const DUMMY_DATA = [
    {
      id: '0',
      name: 'Demo1',
    },
    {
      id: '1',
      name: 'Demo2',
    },
    {
      id: '2',
      name: 'Demo3',
    },
    {
      id: '3',
      name: 'Demo4',
    },
    {
      id: '4',
      name: 'Demo1',
    },
    {
      id: '5',
      name: 'Demo2',
    },
    {
      id: '6',
      name: 'Demo3',
    },
    {
      id: '7',
      name: 'Demo4',
    },
  ];

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
    const selectedItem = filteredDataSource[index];
    if (props.onItemSelection !== undefined && props.onItemSelection !== null) {
      props.onItemSelection(selectedItem);
    }
  };

  //Other functions

  /**
    * Purpose: Local Search functionality
    * Created/Modified By: Jenson
    * Created/Modified Date: 13 Jan 2022
    * Steps:
             1.compare the data with list name
             2.if the item name same as search input store into FilteredDataSource

    */
  const searchFilterFunction = text => {
    // Check if searched text is not blank
    console.log('search Filter', text);
    if (stateOrCityList !== undefined && stateOrCityList !== null) {
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = stateOrCityList.filter(function (item) {
          if (Globals.SHARED_VALUES.IS_FOR_CITY === true) {
            const itemData = item ? item.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          } else {
            const itemData = item.state
              ? item.state.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }
        });
        setFilteredDataSource(newData);
        setSearch(text);
        //setCrossButtonVisible(false);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(stateOrCityList);
        setSearch(text);
        //setCrossButtonVisible(false);
      }
    }
  };

  const loadData = () => {
    if (props.stateOrCityList !== undefined && props.stateOrCityList !== null) {
      if (
        Globals.SHARED_VALUES.IS_FOR_CITY === true &&
        Globals.SHARED_VALUES.SELECTED_STATE_INDEX !== -1
      ) {
        let cityList =
          props.stateOrCityList[Globals.SHARED_VALUES.SELECTED_STATE_INDEX]
            .city;
        console.log(
          'Globals.SHARED_VALUES.SELECTED_STATE_INDEX: ',
          Globals.SHARED_VALUES.SELECTED_STATE_INDEX,
        );
        console.log('loadData CITY cityList: ', cityList);
        setStateOrCityList(cityList);
        setFilteredDataSource(cityList);
      } else {
        setStateOrCityList(props.stateOrCityList);
        setFilteredDataSource(props.stateOrCityList);
      }
    }
  };

  //Render UI

  //Shimmer loader for the flatList
  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={60}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="25" y="15" rx="5" ry="5" width="220" height="13" />
      <Rect x="0" y="55" rx="5" ry="5" width="571" height="1" />
    </ContentLoader>
  );

  /**
        * Purpose: Render cell
        * Created/Modified By: Jenson
        * Created/Modified Date: 13 Jan 2022
        * Steps:
            1.Display the details to component
    */
  const CountryListItem = ({item, index}) => {
    return isLoading ? (
      <ListLoader />
    ) : (
      <TouchableOpacity onPress={() => didSelectItem(index)}>
        <View
          style={{flex: 1, backgroundColor: Colors.WHITE_COLOR, height: 50}}>
          <Text
            style={{
              marginTop: 16,
              marginLeft: 16,
              marginRight: 16,
              color: Colors.BLACK_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?20:14,
              textAlign: 'left',
            }}
            numberOfLines={1}>
            {Globals.SHARED_VALUES.IS_FOR_CITY === true
              ? item || 'N/A'
              : item?.state || 'N/A'}
          </Text>
          <View
            style={{
              height: 0.5,
              backgroundColor: Colors.GREY_COLOR,
              opacity: 0.5,
              marginTop: 8,
            }}
          />
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
    return <CountryListItem item={item} index={index} />;
  };

  const listEmptyComponent = () => {
    return (
      <View
        style={{flex: 2, height: '100%', alignItems: 'center', marginTop: 120}}>
        <Text
          style={{
            marginTop: 20,
            marginLeft: 20,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: isTablet===true?18:14,
            color: '#E0251B',
          }}>
          {t(Translations.NO_RESULT_FOUND)}
        </Text>
        <View style={{flex: 1}} />
      </View>
    );
  };
  const closeButtonAction = () => {
    console.log('close');
    // setIsLoading(true);
    Keyboard.dismiss();
    setSearch('');
    loadData();
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
          fontSize:isTablet===true?23:14,
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
            height: isTablet===true?22:15,
            width: isTablet===true?22:15
          }}
          source={Images.CLOSE_ICON}
        />
      </TouchableOpacity>

      {/* <View
        style={{
          marginTop: 20,
          marginLeft: 20,
          marginRight: 20,
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
            color: Colors.PRIMARY_TEXT_COLOR,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}
          placeholderTextColor={Colors.PLACEHOLDER_COLOR}
          placeholder={t(Translations.SEARCH)}
          onChangeText={text => searchFilterFunction(text.trimStart())}
          onClear={text => searchFilterFunction('')}
          value={search}
        />
        <TouchableOpacity
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
      </View> */}
      <SearchBox
        search={search}
        searchFilterFunction={searchFilterFunction}
        closeButtonAction={closeButtonAction}
      />
      <FlatList
        //ref={(ref) => flatListRef = ref}
        style={{marginTop: 16, marginBottom: 24}}
        //contentContainerStyle={{ paddingVertical: 10 }}
        showsHorizontalScrollIndicator={false}
        data={filteredDataSource}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} //2
        ListEmptyComponent={listEmptyComponent}
        keyboardShouldPersistTaps={'handled'}
      />
    </View>
  );
};
export default StateAndCityPopupScreen;
