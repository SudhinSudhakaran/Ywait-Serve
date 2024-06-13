import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  I18nManager,
  ScrollView,
} from 'react-native';
import {Globals, Translations, Colors, Fonts} from '../../constants';
import Utilities from '../../helpers/utils/Utilities';
import {t} from 'i18next';
import {useSelector, useDispatch} from 'react-redux';
import DataManager from '../../helpers/apiManager/DataManager';
import moment from 'moment';
import {GetImage} from '../shared/getImage/GetImage';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import ContentLoader, {Rect} from 'react-content-loader/native';

const ManageQueueTabletHeader = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [consultantList, setConsultantList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); //state for highlight selected consultant
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  //  const [refFlatList, setrefFlatList] = useState();

  useEffect(() => {
    setIsLoading(true);
    performGetConsultantList();
  

    // scrollToSelectedItem();
    // setCurrentIndex(currentIndex);
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

  const ListLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={100}
      height={120}
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      style={{marginLeft: 60}}
      {...props}>
      <Rect x="10" y="10" rx="40" ry="40" width="80" height="80" />
      <Rect x="10" y="100" rx="5" ry="5" width="80" height="8" />
    </ContentLoader>
  );

  const filterTodayAvailableConsultants = nonBlockedConsultants => {
    var _todaysConsultants = [];
    if (
      Globals?.USER_DETAILS?.role_id?.canServe === true ||
      Globals?.USER_DETAILS?.role_id?.isAdmin === true ||
      Globals?.BUSINESS_DETAILS?.allowSelectiveQueueManagement === false
    ) {
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
    } else if (
      Globals?.USER_DETAILS?.role_id?.canServe === false &&
      Globals?.USER_DETAILS?.role_id?.isAdmin === false &&
      Globals?.BUSINESS_DETAILS?.allowSelectiveQueueManagement === true
    ) {
      //Check current date
      let currentBusinessDay = moment(
        Utilities.convertorTimeToBusinessTimeZone(moment()),
      ).format('dddd');
      nonBlockedConsultants.map(consultant => {
        if (Globals?.USER_DETAILS?.consultantMapping?.length > 0) {
          Globals?.USER_DETAILS?.consultantMapping?.map(item => {
            let id = item;
            let _workingHours = consultant?.workingHours || [];
            let consultant_id = consultant?._id;
            let currentDayIndex = _workingHours.findIndex(
              obj =>
                obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
            );
            if (currentDayIndex !== -1) {
              if (_workingHours[currentDayIndex]?.activeFlag === true) {
                if (id === consultant_id) {
                  console.log('consultant 1=====', consultant);
                  console.log('item id 1=====', item);
                  _todaysConsultants.push(consultant);
                }
              }
            }
          });
        } else if (Globals?.USER_DETAILS?.departmentMapping?.length > 0) {
          Globals?.USER_DETAILS?.departmentMapping?.map(item => {
            let id = item;
            let _workingHours = consultant?.workingHours || [];
            let consultant_id = consultant?.department_id?._id;
            let currentDayIndex = _workingHours.findIndex(
              obj =>
                obj.label.toUpperCase() === currentBusinessDay.toUpperCase(),
            );
            if (currentDayIndex !== -1) {
              if (_workingHours[currentDayIndex]?.activeFlag === true) {
                if (id === consultant_id) {
                  _todaysConsultants.push(consultant);
                }
              }
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
            * Purpose:perform get consulatant listing
            * Created/Modified By: Loshith
            * Created/Modified Date: 04 may 2023
            * Steps:
                1.fetch consultant  list from API and append to state variable
    */

  const performGetConsultantList = () => {
    DataManager.getConsultantList().then(([isSuccess, message, data]) => {
      console.log(
        '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
      );
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
            const index = todayOnlyWorkingConsultants.findIndex(
              obj =>
                obj._id ===
                Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
            );
            setConsultantList(todayOnlyWorkingConsultants);

            // scrollToSelectedItem(index);
            console.log('index of selected item<><><> 0000000000', index);
            console.log(
              'todayOnlyWorkingConsultants',
              todayOnlyWorkingConsultants,
            );
            setTimeout(() => {
              scrollToSelectedItem(index);
            }, 3000);
          } else {
            const index = nonBlockedConsultants.findIndex(
              obj =>
                obj._id ===
                Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id,
            );
            setConsultantList(nonBlockedConsultants);

            console.log('index of selected item  =====', index);
            //  setCurrentIndex(index);

            setTimeout(() => {
              scrollToSelectedItem(index);
            }, 3000);
          }

          setRefresh(false);
          setIsLoading(false);
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
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

  const scrollToSelectedItem = index => {
    console.log('consult list---', consultantList, index);

    flatListRef?.current&& flatListRef?.current?.scrollToIndex({
      index: index,
      animated: true,
    });
  };

  //  const getItemLayout =(item,index)=>{
  //   return {length:105, offset:105 * index}
  //  }

  /**
                     * Purpose:Render function of flat list
                     * Created/Modified By: Loshith
                     * Created/Modified Date: 4 may 2023
                     * Steps:
                         1.pass the data from api to customer details child component
                 */
  const renderItem = ({item, index}) => {
    return <ConsultantDataCell item={item} index={index} />;
  };
  const ConsultantDataCell = ({item, index}) => {
    let selectedItem = false;
    if (props.from === 'MANAGE_QUEUE') {
      selectedItem =
        Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO?._id ===
        item?._id;
      //  scrollToSelectedItem(index);
      // setCurrentIndex(index);
    } else {
      selectedItem = activeIndex === index;
      // scrollToSelectedItem(currentIndex);
    }

    return (
      <TouchableOpacity
        style={{
          width: 150,
          height: 108,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => consultantCellPressAction(item, index)}>
        {isLoading === true ? (
          <ListLoader />
        ) : (
          <View>
            <View style={{flexDirection: 'row'}}>
              <GetImage
                style={{
                  marginLeft: 40,
                  width: selectedItem ? 70 : 65,
                  height: selectedItem ? 70 : 65,
                  borderRadius: selectedItem ? 70 / 2 : 65 / 2,
                  borderWidth: selectedItem ? 5 : 1,
                  borderColor: selectedItem
                    ? Colors.SECONDARY_COLOR
                    : Colors.PRIMARY_COLOR,
                  flexDirection: 'row',
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
            <View style={{}}>
              <Text
                style={{
                  fontSize: selectedItem ? 24 : 18,
                  fontFamily: Fonts.Gibson_Regular,
                  color: Colors.CUSTOMER_NAME_COLOR,
                  marginTop: 10,
                  textAlign: 'left',
                  marginLeft: 30,
                  textTransform: 'capitalize',
                }}
                numberOfLines={1}>
                {item?.salutation || ''}
                {item?.firstName || ''}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const consultantCellPressAction = (item, index) => {
    console.log('press mee button ======>>');
    props.onConsultantSelection(item);
    setActiveIndex(index);
    scrollToSelectedItem(index);
    setCurrentIndex(index);
  };
  //final return
  return (
    <View style={{marginHorizontal: I18nManager.isRTL ? 0 : 0}}>
      <FlatList
        style={{marginTop: 25}}
        ref={flatListRef}
        data={isLoading === true ? dummyConsultantList : consultantList}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        contentContainerStyle={{flexDirection: 'row', paddingRight: 35}}
        scrollEnabled={true}
        horizontal
        showsHorizontalScrollIndicator={true}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 700));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        //  getItemLayout={getItemLayout}
        // onEndReached={() => {
        //   listOnEndReach();
        // }}
        // ListEmptyComponent={
        //   isLoading === true ? dummyConsultantList : ConsultantEmptyComponent
        // }
        // ListFooterComponent={isPaginating ? paginationComponent : null}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refresh}
        //     onRefresh={onRefresh}
        //     tintColor={Colors.PRIMARY_COLOR}
        //     colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
        //   />
        // }
      />
    </View>
    //     <View style={{marginTop:25}}>
    // <ScrollView horizontal showsHorizontalScrollIndicator={true}>
    //   {consultantList.length === 0
    //   ? null
    //   : consultantList.map((item,index)=>{
    //     return <ConsultantDataCell item={item} index={index} key={item._id}/>
    //   })}
    // </ScrollView>
    // </View>
  );
};

export default ManageQueueTabletHeader;

const styles = StyleSheet.create({});
