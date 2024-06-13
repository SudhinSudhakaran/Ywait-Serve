import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  I18nManager,
} from 'react-native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import DataManager from '../../../helpers/apiManager/DataManager';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../constants';
import Utilities from '../../../helpers/utils/Utilities';
import DisplayUtils from '../../../helpers/utils/DisplayUtils';
import {GetImage} from '../getImage/GetImage';
import {t} from 'i18next';
import { useSelector } from 'react-redux';
const ConsultantFilterPopupScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [consultantList, setConsultantList] = useState([]);
  const [loadImage, setLoadImage] = useState(true);

  //redux state for tabletview
  const isTablet = useSelector((state)=>state.tablet.isTablet);

  useEffect(() => {
    setIsLoading(true);
    performGetConsultantList();
  }, []);

  const dummyConsultantList = [
    {
      id: '1',
      firstName: 'Mr. Paul',
      lastName: 'Bill',
      role_id: {
        label: 'barber specialist',
      },
    },
    {
      id: '2',
      firstName: 'Mr. Paul',
      lastName: 'Bill',
      role_id: {
        label: 'barber specialist',
      },
    },
    {
      id: '3',
      firstName: 'Mr. Paul',
      lastName: 'Bill',
      role_id: {
        label: 'barber specialist',
      },
    },
    {
      id: '4',
      firstName: 'Mr. Paul',
      lastName: 'Bill',
      role_id: {
        label: 'barber specialist',
      },
    },
    {
      id: '5',
      firstName: 'Mr. Paul',
      lastName: 'Bill',
      role_id: {
        label: 'barber specialist',
      },
    },
    {
      id: '6',
      firstName: 'Mr. Paul',
      lastName: 'Bill',
      role_id: {
        label: 'barber specialist',
      },
    },
    {
      id: '7',
      firstName: 'Mr. Paul',
      lastName: 'Bill',
      consultantType: 'barber specialist',
    },
  ];

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
      <Rect x="60" y="40" rx="5" ry="5" width="180" height="8" />

      <Rect x="10" y="10" rx="20" ry="20" width="40" height="40" />
    </ContentLoader>
  );

  /**
          * Purpose: List empty component
          * Created/Modified By: Sudhin Sudhakaran
          * Created/Modified Date: 11 Oct 2021
          * Steps:
              1.Return the component when list is empty
      */
  const ConsultantEmptyComponent = () => {
    return (
      <View
        style={{
          //   width: Display.setWidth(60),
          //   height: Display.setHeight(30),
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          //   marginTop: Display.setHeight(20),
        }}>
        {/* <Image source={Images.CONTACT_EMPTY_IMAGE} /> */}
        <Text
          style={{
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 18,
            color: Colors.NO_CONTACTS_TEXT_COLOR,
            marginTop: DisplayUtils.setHeight(25),
          }}>
          {t(Translations.NO_CONSULTANTS)}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 14,
            color: Colors.NO_CONTACTS_TEXT_GRAY,
            marginTop: 10,
          }}>
          {t(Translations.NO_CONSULTANTS_FOUND_YET)}
        </Text>
      </View>
    );
  };

  const filterTodayAvailableConsultants = nonBlockedConsultants => {
    var _todaysConsultants = [];
    if(Globals?.USER_DETAILS?.role_id?.canServe === true ||
      Globals?.USER_DETAILS?.role_id?.isAdmin === true ||
      Globals?.BUSINESS_DETAILS?.allowSelectiveQueueManagement === false){
    //Check current date
    let currentBusinessDay = moment(
      Utilities.convertorTimeToBusinessTimeZone(moment()),
    ).format('dddd');
    nonBlockedConsultants.map(consultant => {
      let _workingHours = consultant?.workingHours || [];
      console.log(`filterTodayAvailableConsultants ${consultant?.name} `);
      console.log(`consultantsDesignation ${consultant?.designation}`);
      console.log('_workingHours: ', _workingHours);
      let currentDayIndex = _workingHours.findIndex(
        obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
      );
      if (currentDayIndex !== -1) {
        if (_workingHours[currentDayIndex]?.activeFlag === true) {
          _todaysConsultants.push(consultant);
        }
      }
    });
  }
  else if(Globals?.USER_DETAILS?.role_id?.canServe === false &&
    Globals?.USER_DETAILS?.role_id?.isAdmin === false &&
     Globals?.BUSINESS_DETAILS?.allowSelectiveQueueManagement === true)
    {
    //Check current date
    let currentBusinessDay = moment(
      Utilities.convertorTimeToBusinessTimeZone(moment()),
    ).format('dddd');
    nonBlockedConsultants.map(consultant => {
      if(Globals?.USER_DETAILS?.consultantMapping?.length>0){
      Globals?.USER_DETAILS?.consultantMapping?.map(item => {
        let id=item;
      let _workingHours = consultant?.workingHours || [];
      let consultant_id=consultant?._id
      let currentDayIndex = _workingHours.findIndex(
        obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
      );
      if (currentDayIndex !== -1) {
        if (_workingHours[currentDayIndex]?.activeFlag === true) {
          if(id===consultant_id){
            console.log('=====',consultant);
            console.log('=====',item);
          _todaysConsultants.push(consultant);
        }}
      }
    });
  }
  else if(Globals?.USER_DETAILS?.departmentMapping?.length>0){
    Globals?.USER_DETAILS?.departmentMapping?.map(item => {
      let id=item;
    let _workingHours = consultant?.workingHours || [];
    let consultant_id=consultant?.department_id?._id
    let currentDayIndex = _workingHours.findIndex(
      obj => obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
    );
    if (currentDayIndex !== -1) {
      if (_workingHours[currentDayIndex]?.activeFlag === true) {
        if(id===consultant_id){
          console.log('=====',consultant);
          console.log('=====',item);
        _todaysConsultants.push(consultant);
      }}
    }
  });
  }
  });
}
    return _todaysConsultants;
  };

  //API CALLS
  /**
            *
            * Purpose:UpcomingBookingList listing
            * Created/Modified By: Sudhin
            * Created/Modified Date: 20 jan 2022
            * Steps:
                1.fetch UpcomingBookingLists list from API and append to state variable
    */

  const performGetConsultantList = () => {
    DataManager.getConsultantList().then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        let allConsultants = data.objects;
        if (allConsultants !== undefined && allConsultants !== null) {
          console.log('All Consultants', allConsultants);
          //Need to filter non-blocked consultants
          let nonBlockedConsultants = allConsultants.filter(
            _data =>
              (_data?.is_blocked === undefined || _data?.is_blocked === null
                ? false
                : _data.is_blocked) === false,
          );
          console.log('nonBlockedConsultants', nonBlockedConsultants);
          if (
            Globals.SHARED_VALUES.IS_FILER_TODAY_AVAILABLE_CONSULTANT === true
          ) {
            let todayOnlyWorkingConsultants = filterTodayAvailableConsultants(
              nonBlockedConsultants,
            );
            setConsultantList(todayOnlyWorkingConsultants);
            console.log(
              'todayOnlyWorkingConsultants',
              todayOnlyWorkingConsultants,
            );
          } else {
            setConsultantList(nonBlockedConsultants);
          }

          setRefresh(false);
          setIsLoading(false);
        } else {
          Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
          setIsLoading(false);
          setRefresh(false);
        }
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
        setRefresh(false);
      }
    });
  };
  const onRefresh = () => {
    //set isRefreshing to true
    setIsLoading(true);
    setRefresh(true);
    performGetConsultantList();
  };

  const consultantCellPressAction = item => {
    props.onConsultantSelection(item);
    props.refRBSheet.current.close();
  };
  /**
                     * Purpose:Render function of flat list
                     * Created/Modified By: Sudhin Sudhakaran
                     * Created/Modified Date: 8 Oct 2021
                     * Steps:
                         1.pass the data from api to customer details child component
                 */
  const renderItem = ({item, index}) => {
    return <ConsultantDataCell item={item} index={index} />;
  };

  const ConsultantDataCell = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => consultantCellPressAction(item)}
        style={{
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
            <View style={{alignSelf: 'center'}}>
              <GetImage
                style={{
                  marginLeft: 20,
                  width:isTablet===true?65: 50,
                  height: isTablet===true?65:50,
                  borderRadius: isTablet===true?65/2:50 / 2,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_COLOR,
                }}
                fullName={(
                  (item?.firstName || 'N/A') +
                  ' ' +
                  (item?.lastName || '')
                ).trim()}
                alphabetColor={Colors.SECONDARY_COLOR}
                url={item?.image}
              />
            </View>
            <View style={{width: DisplayUtils.setWidth(60)}}>
              <View
                style={{marginLeft: 16, marginBottom: 20, paddingRight: 15}}>
                <Text
                  style={{
                    fontSize: isTablet===true?20:14,
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.CUSTOMER_NAME_COLOR,
                    marginTop: 25,
                    textAlign:'left'
                  }}
                  numberOfLines={1}>
                  {item?.name || ''}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: isTablet===true?18:12,
                      textTransform:'capitalize',
                      textAlign:'left'
                    }}>
                    {item?.designation_id?.designation || item?.role_id?.label ||''}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.WHITE_COLOR}}>
      <View style={{height: 70, paddingTop: 30, flexDirection: 'row'}}>
        <Text
          style={{
            marginLeft: 15,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: isTablet===true?23:18,
            color: Colors.DARK_BROWN_COLOR,
            textAlign:'left'
          }}>
          
          {t(Translations.CONSULTANTS)}
        </Text>

        <TouchableOpacity
          onPress={() => props.refRBSheet.current.close()}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: isTablet===true?40:30,
            height: isTablet===true?40:30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={Images.CLOSE_ICON}
            style={{tintColor: Colors.TAB_VIEW_LABEL_COLOR}}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        style={{marginBottom: 30}}
        data={isLoading === true ? dummyConsultantList : consultantList}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        contentContainerStyle={{}}
        onEndReachedThreshold={0.2}
        // onEndReached={() => {
        //   listOnEndReach();
        // }}
        ListEmptyComponent={
          isLoading === true ? dummyConsultantList : ConsultantEmptyComponent
        }
        // ListFooterComponent={isPaginating ? paginationComponent : null}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}
            tintColor={Colors.PRIMARY_COLOR}
            colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
          />
        }
      />
    </View>
  );
};

export default ConsultantFilterPopupScreen;

const styles = StyleSheet.create({});
