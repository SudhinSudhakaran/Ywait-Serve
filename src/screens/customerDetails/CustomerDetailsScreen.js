import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  I18nManager,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../constants';
import {t} from 'i18next';
import Pdf from 'react-native-pdf';
import FastImage from 'react-native-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GetImage} from '../shared/getImage/GetImage';
import Utilities from '../../helpers/utils/Utilities';
import ImageView from 'react-native-image-viewing-rtl';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import DataManager from '../../helpers/apiManager/DataManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import NO_VISIT_ERROR_SVG from '../../assets/images/noVisitsError.svg';
import AddNotesPopupScreen from '../addNotesPopup/AddNotesPopupScreen';
import StorageManager from '../../helpers/storageManager/StorageManager';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import NotesOptionPopup from '../shared/notesOptionPopup/NotesOptionPopup';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
const CustomerDetailsScreen = props => {
  const {selectedCustomer} = props.route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const refRBSheetAddNotes = useRef();
  const layout = useWindowDimensions();
  const [pageNo, setPageNo] = useState(1);
  const refNotesOptionsRBsheetPopup = useRef();
  const [refresh, setRefresh] = useState(false);
  const [isFromEdit, setIsFromEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageEnded, setIsPageEnded] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [fullScreenImages, setFullScreenImages] = useState([]);
  const [customerNotesList, setCustomerNotesList] = useState([]);
  const [imageFullScreenVisible, setImageFullScreenVisible] = useState([]);
  const [previousVisitCount, setPreviousVisitCount] = useState(0);
  const [noteHeader, setNoteHeader] = useState('ADD_NOTE');
  const dummyCustomerNoteList = [
    {
      id: '1',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes:
        ' aaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbb cccccccccccccccccc ddddddddddddddd eeeeeeeeeeeeeeeee ffffffffffffff ',
    },
    {
      id: '2',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes:
        ' aaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbb cccccccccccccccccc ddddddddddddddd eeeeeeeeeeeeeeeee ffffffffffffff ',
    },
    {
      id: '3',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes: '',
    },
    {
      id: '4',
      consultationDate: '2022-01-28T10:06:18.418Z',
      notes: '',
    },
  ];
  useEffect(() => {
    console.log('selected customer', selectedCustomer);
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);
    performGetCustomerDetails();
  }, []);

  const onRefresh = () => {
    //set isRefreshing to true
    setRefresh(true);
    performGetCustomerNotesList(false, 1, selectedCustomer._id);
    // and set isRefreshing to false at the end of your callApiMethod()
  };
  const notesOptionSelectionAction = selectedNote => {
    Globals.SHARED_VALUES.SELECTED_NOTES_INFO = selectedNote;
    refNotesOptionsRBsheetPopup.current.open();
  };
  const handleNoteOptionSelection = selectedOption => {
    if (selectedOption === 'ADD_NOTES') {
      setNoteHeader('ADD_NOTE');
      setIsFromEdit(true);
      refRBSheetAddNotes.current.open();
      console.log('Add note action');
    } else if (selectedOption === 'EDIT_NOTES') {
      setNoteHeader('EDIT_NOTE');
      setIsFromEdit(true);
      refRBSheetAddNotes.current.open();
      console.log('Edit action');
    } else if (selectedOption === 'DELETE_NOTES') {
      console.log('Delete note action');
      performNotesDelete();
    }
  };
  //Shimmer loader for the flatList
  const ProfileLoader = props => (
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
      <Rect x="90" y="30" rx="5" ry="5" width="120" height="8" />
      <Rect x="90" y="50" rx="5" ry="5" width="180" height="8" />
      <Rect x="90" y="70" rx="5" ry="5" width="230" height="8" />
      <Rect x="90" y="90" rx="5" ry="5" width="120" height="8" />
      <Rect x="90" y="110" rx="5" ry="5" width="60" height="8" />
      <Rect x="30" y="40" rx="25" ry="25" width="50" height="50" />
    </ContentLoader>
  );

  //Shimmer loader for the previous visit
  const PreviousVisitsLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={50}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="20" y="20" rx="0" ry="0" width="150" height="10" />
    </ContentLoader>
  );

  //Shimmer loader for the previous visit
  const NoteLoader = props => (
    <ContentLoader
      transform={[{scaleX: I18nManager.isRTL ? -1 : 1}]}
      speed={1.5}
      width={'100%'}
      height={100}
      //viewBox="0 0 320 "
      backgroundColor="#dadada"
      foregroundColor="#eee"
      animate={true}
      {...props}>
      <Rect x="95%" y="25" rx="3" ry="3" width="5" height="5" />
      <Rect x="95%" y="35" rx="3" ry="3" width="5" height="5" />
      <Rect x="95%" y="45" rx="3" ry="3" width="5" height="5" />
      <Rect x="20" y="20" rx="0" ry="0" width="100" height="15" />
      <Rect x="130" y="20" rx="0" ry="0" width="100" height="15" />
      <Rect x="20" y="50" rx="5" ry="5" width="180" height="8" />
      <Rect x="20" y="70" rx="5" ry="5" width="230" height="8" />
      <Rect x="20" y="90" rx="5" ry="5" width="260" height="8" />
    </ContentLoader>
  );

  const filePreviewButtonAction = url => {
    Keyboard.dismiss();
    navigation.navigate('FilePreviewScreen', {
      titleText: Utilities.getFileName(url),
      url: url,
      isLocalFile: false,
    });
  };
  const imageFullscreenButtonAction = url => {
    Keyboard.dismiss();

    setFullScreenImages([
      {
        uri: url.replace('dl=0', 'dl=1'),
      },
    ]);
    setImageFullScreenVisible(true);
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

  const performGetCustomerDetails = () => {
    DataManager.getCustomerDetails(selectedCustomer._id).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          if (data !== undefined && data !== null) {
            console.log('Consultant data', data.objects);
            setCustomerDetails(data.objects);
            performGetCustomerNotesList(true, 1, selectedCustomer._id);
          } else {
            Utilities.showToast('Failed!', message, 'error', 'bottom');
            setIsLoading(false);
          }
        } else {
          Utilities.showToast('Failed!', message, 'error', 'bottom');
          setIsLoading(false);
        }
      },
    );
  };

  //API CALLS
  /**
            *
            * Purpose: Get customer notes list
            * Created/Modified By: Sudhin Sudhakaran
            * Created/Modified Date: 7 Feb 2022
            * Steps:
                1.fetch notes list from API and append to state variable
    */
  const performGetCustomerNotesList = (
    isLoaderRequired,
    pageNumber,
    customerId,
  ) => {
    if (isLoaderRequired) {
      // setIsLoading(true);
    }
    DataManager.getCustomerNotesList(pageNumber, customerId).then(
      ([isSuccess, message, data, count]) => {
        if (isSuccess === true) {
          setPreviousVisitCount(count);
          if (data !== undefined && data !== null) {
            if (pageNumber !== 1) {
              if (data.length === 0) {
                console.log('END FOUND');
                setIsPageEnded(true);
              } else {
                //Appending data
                //setSearchList(...searchList, ...data.data.objects)

                setCustomerNotesList(customerNotesList => {
                  return [...customerNotesList, ...data];
                });
              }
            } else {
              // console.log("data", data)
              setCustomerNotesList(data);
            }
          } else {
            setIsLoading(false);
          }
        } else {
          Utilities.showToast('Failed!', message, 'error', 'bottom');
          // setIsLoading(false);
        }
        setIsLoading(false);
        setRefresh(false);
        setIsPaginating(false);
      },
    );
  };
  const performNotesDelete = () => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.NOTE_ID]:
        Globals.SHARED_VALUES.SELECTED_NOTES_INFO?._id,
    };
    DataManager.performNotesDelete(body).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          setIsLoading(true);
          setPageNo(1);
          setIsPageEnded(false);
          performGetCustomerDetails();
        } else {
          Utilities.showToast('Failed!', message, 'error', 'bottom');
          setIsLoading(false);
        }
      },
    );
  };
  /**
         * Purpose:show notes option popup
         * Created/Modified By: Sudhin
         * Created/Modified Date: 20 jan 2022
         * Steps:
             1.Open the rbSheet
     */
  const NotesOptionsPopupComponent = () => {
    return (
      <RBSheet
        ref={refNotesOptionsRBsheetPopup}
        closeOnDragDown={false}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}
        height={DisplayUtils.setHeight(30)}
        onClose={() => {}}>
        <NotesOptionPopup
          refRBSheet={refNotesOptionsRBsheetPopup}
          handleOptionSelection={handleNoteOptionSelection}
        />
      </RBSheet>
    );
  };
  /**
   * Purpose: list on end reached component
   * Created/Modified By: Sudhin Sudhakaran
   * Created/Modified Date: 7 Feb 2022
   * Steps:
   */
  const listOnEndReach = () => {
    console.log(
      `Detected on end reach isPaginating: ${isPaginating}, isPageEnded: ${isPageEnded}`,
    );

    if (!isPageEnded && !isLoading && !isPaginating) {
      let newPageNo = pageNo + 1;
      console.log('PageNo:', newPageNo);
      if (newPageNo !== 1) {
        setIsPaginating(true);
      }
      console.log('setIndicator:', isPaginating);
      setPageNo(newPageNo);
      performGetCustomerNotesList(false, newPageNo, selectedCustomer._id);
    }
  };

  /**
          * Purpose: List empty component
          * Created/Modified By: Sudhin Sudhakaran
          * Created/Modified Date:7 Feb 2022
          * Steps:
              1.Return the component when list is empty
      */
  const NotesEmptyComponent = () => {
    return (
      <View
        style={{
          //   width: Display.setWidth(60),
          //   height: Display.setHeight(30),

          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '30%',
        }}>
        <NO_VISIT_ERROR_SVG
          fill={Colors.WHITE_COLOR}
          fillSecondary={Colors.SECONDARY_COLOR}
        />

        <Text
          style={{
            alignSelf: 'center',
            color: Colors.NOTES_EMPTY_COLOR,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 12,
            marginTop: 10,
          }}>
          {t(Translations.NO_VISITS_FOUND)}
        </Text>
      </View>
    );
  };
  /**
   * Purpose: pagination loader component
   * Created/Modified By: Sudhin Sudhakaran
   * Created/Modified Date: 7 Feb 2022
   * Steps:
   */
  const paginationComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator
          style={{marginBottom: 20}}
          color={Colors.PRIMARY_COLOR}
          size="small"
        />
      </View>
    );
  };
  const AddVisit = () => {
    setIsFromEdit(false);
    refRBSheetAddNotes.current.open();
  };
  const renderNotesImageItem = ({item, index}) => {
    return <FileAttachmentList item={item} itemIndex={index} />;
  };

  const FileAttachmentList = ({item, itemIndex}) => {
    console.log('FileAttachment', item);
    if (item !== undefined && (item?.length || 0) > 0) {
      let fileType = Utilities.getFileExtension(item);
      console.log('fileType======>', fileType);
      if (fileType === 'pdf') {
        return (
          <>
            <TouchableOpacity
              onPress={() => filePreviewButtonAction(item)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <Pdf
                source={{uri: item, cache: true}}
                pointerEvents={'none'}
                onLoadComplete={(numberOfPages, filePath) => {
                  //console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  //console.log(`Current page: ${page}`);
                }}
                onError={error => {
                  console.log(`FileAttachmentList error: ${error}`);
                }}
                onPressLink={uri => {
                  //console.log(`Link pressed: ${uri}`);
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_COLOR,
                }}
                renderActivityIndicator={progress => {
                  //console.log(progress);
                  return <ActivityIndicator color={Colors.PRIMARY_COLOR} />;
                }}
                singlePage
              />
            </TouchableOpacity>
          </>
        );
      } else if (fileType === 'doc' || fileType === 'docx') {
        return (
          <>
            <TouchableOpacity
              onPress={() => filePreviewButtonAction(item)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_COLOR,
                }}
                source={Images.WORD_FILE_ICON}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </>
        );
      } else {
        return (
          <>
            <TouchableOpacity
              onPress={() => imageFullscreenButtonAction(item)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <FastImage
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_COLOR,
                }}
                source={{
                  uri: item.replace('dl=0', 'dl=1'),
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          </>
        );
      }
    } else {
      return null;
    }
  };
  const renderCustomerNotesItem = ({item}) => {
    return isLoading ? (
      <NoteLoader />
    ) : (
      <View style={{marginTop: 20}}>
        <View style={{flexDirection: 'row', paddingLeft: 15, marginBottom: 5}}>
          <Text
            style={{
              color: Colors.NOTES_DETAILS_DATE_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 12,
            }}>
            {Utilities.getUtcToLocalWithFormat(
              item.consultationDate,
              'DD MMM YYYY',
            )}
          </Text>
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: Colors.LINE_SEPARATOR_COLOR,
              marginHorizontal: 15,
            }}
          />
          <Text
            style={{
              color: Colors.NOTES_DETAILS_DATE_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: 12,
            }}>
            {Utilities.getUtcToLocalWithFormatANdNoTimezone(
              item.consultationDate,
              Utilities.isBusiness24HrTimeFormat() ? 'HH:mm' : 'hh:mm A',
            )}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingLeft: 15}}>
          <View style={{flex: 1}}>
            {item.notes.trimStart() ? (
              <Text
                style={{
                  color: Colors.NOTES_CONTENT,
                  fontFamily: Fonts.Gibson_Light,
                  fontSize: 12,
                  textAlign: 'left',
                }}>
                {item.notes}
              </Text>
            ) : (
              <Text
                style={{
                  color: Colors.NOTES_EMPTY_COLOR,
                  fontFamily: Fonts.Gibson_SemiBold,
                  fontSize: 10,
                  marginTop: 5,
                  textAlign: 'left',
                }}>
                {t(Translations.NO_NOTES_ADDED)}
              </Text>
            )}
          </View>
          {Globals.USER_DETAILS.canAddVisit ? (
            <TouchableOpacity
              onPress={() => notesOptionSelectionAction(item)}
              style={{
                width: 45,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -10,
              }}>
              <Image style={{}} source={Images.THREE_DOTS_OPTION} />
            </TouchableOpacity>
          ) : null}
        </View>

        {item?.images?.length > 0 ? (
          <View style={{alignItems: 'flex-start'}}>
            <FlatList
              contentContainerStyle={{marginLeft: 15,
                paddingRight:I18nManager.isRTL ? responsiveWidth(0) :
                 responsiveWidth(5),
                 paddingLeft:I18nManager.isRTL ? responsiveWidth(2) :
                 responsiveWidth(0),}}
              data={item?.images}
              keyboardShouldPersistTaps="handled"
              renderItem={renderNotesImageItem}
              keyExtractor={(item, index) =>
                item._id ? item._id.toString() : index.toString()
              }
              onEndReachedThreshold={0.2}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}
      </View>
    );
  };
  const AddNotesPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetAddNotes}
        closeOnDragDown={false}
        closeOnPressMask={true}
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
        height={520}
        onClose={() => {
          Globals.SHARED_VALUES.SELECTED_NOTES_INFO = {};
        }}>
        <AddNotesPopupScreen
          RBSheet={refRBSheetAddNotes}
          isFromDetailsPage={true}
          customerDetails={customerDetails !== undefined ? customerDetails : ''}
          onUpdateNotes={onUpdateNotesHandler}
          setIsFromEdit={setIsFromEdit}
          isFromEdit={isFromEdit}
          heading={noteHeader}
        />
      </RBSheet>
    );
  };

  const onUpdateNotesHandler = () => {
    console.log('Updating..');
    setIsLoading(true);
    setPageNo(1);
    setIsPageEnded(false);
    performGetCustomerDetails();
  };

  let customerName = `${customerDetails?.firstName} ${
    customerDetails?.lastName || ' '
  }`;
  //final return
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
        <StatusBar
          backgroundColor={Colors.BACKGROUND_COLOR}
          barStyle="dark-content"
        />
        <AddNotesPopup />
        <NotesOptionsPopupComponent />
        <ImageView
          images={fullScreenImages}
          imageIndex={0}
          visible={imageFullScreenVisible}
          onRequestClose={() => setImageFullScreenVisible(false)}
        />
        <View
          style={{
            backgroundColor: Colors.PRIMARY_WHITE,
            width: DisplayUtils.setWidth(100),
            height: 70,
          }}>
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
              {t(Translations.CUSTOMER_DETAILS)}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderTopWidth: 0.25,
            borderBottomWidth: 0.25,
            borderBottomColor: Colors.TAB_VIEW_LABEL_COLOR,
            borderTopColor: Colors.TAB_VIEW_LABEL_COLOR,
            flexDirection: 'row',
            paddingBottom: 20,
          }}>
          {isLoading ? (
            <ProfileLoader />
          ) : (
            <>
              <View style={{marginHorizontal: 12, marginTop: 20}}>
                <GetImage
                  style={{
                    marginTop: 5,
                    marginLeft: 10,
                    width: 50,
                    height: 50,
                    borderRadius: 50 / 2,
                    borderWidth: 1.5,
                    borderColor: Colors.SECONDARY_COLOR,
                  }}
                  fullName={(
                    (customerDetails?.firstName || 'N/A') +
                    ' ' +
                    (customerDetails?.lastName || '')
                  ).trim()}
                  url={customerDetails?.image}
                />
              </View>
              <View style={{marginTop: 20, marginleft: 20}}>
                <Text
                  style={{
                    fontFamily: Fonts.Gibson_SemiBold,
                    color: Colors.PRIMARY_TEXT_COLOR,
                    fontSize: 14,
                    textAlign: 'left',
                  }}>
                  {customerName}
                </Text>
                <View style={{
                  flexDirection:"row"}}>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 14,
                      marginTop: 5,
                    }}>
                     {I18nManager.isRTL===true?
                        (t(Translations.CUSTOMER_ID))+ " : " : (t(Translations.CUSTOMER_ID))+":"
                        }
                  </Text>
                  <View style={{
                  flexDirection: I18nManager.isRTL===true?'row-reverse':'row',
                  marginLeft:I18nManager.isRTL===true?responsiveHeight(20):0}}>
                  <Text
                    style={{
                      color: Colors.HOSPITAL_NAME_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 14,
                      marginTop: 5,
                    }}>
                      {Globals.BUSINESS_DETAILS.customerPrefix}
                  </Text>
                  <Text
                    style={{
                      color: Colors.SECONDARY_COLOR,
                      fontFamily: Fonts.Gibson_Regular,
                      fontSize: 14,
                      marginTop: 5,
                    }}>
                    {customerDetails?.customerKey}
                  </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: Colors.HOSPITAL_NAME_COLOR,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: 14,
                    marginTop: 5,
                    textAlign: 'left',
                  }}>
                  {customerDetails?.email}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Image
                    style={{
                      width: 12,
                      height: 12,
                      marginTop: 3,
                      marginRight: 2,
                    }}
                    source={Images.PHONE_ICON}
                  />
                  <Text
                    style={{
                      color: Colors.CUSTOMER_NAME_COLOR,
                      fontSize: 12,
                      fontFamily: Fonts.Gibson_Regular,
                      marginLeft: 5,
                    }}>
                    {customerDetails.countryCode !== undefined
                      ? customerDetails.countryCode
                      : null}{' '}
                    {customerDetails?.phoneNumber ? customerDetails?.phoneNumber : <Text>N/A</Text>}
                  </Text>
                </View>
                <View
                  style={{flexDirection: 'row', marginTop: 5, paddingLeft: 2}}>
                  <Image
                    style={{width: 9, height: 12, marginTop: 3, marginRight: 5}}
                    source={Images.LOCATION_ICON}
                  />
                  <Text
                    style={{
                      color: Colors.CUSTOMER_NAME_COLOR,
                      fontSize: 12,
                      fontFamily: Fonts.Gibson_Regular,
                      marginLeft: 5,
                      textAlign: 'left',
                      width: '80%',
                      lineHeight: 15,
                    }}
                    numberOfLines={2}>
                    {customerDetails?.addressLineOne ? customerDetails?.addressLineOne : <Text>N/A</Text>}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
        <View
          style={{
            borderBottomWidth: 0.25,
            borderBottomColor: Colors.TAB_VIEW_LABEL_COLOR,
          }}>
          {isLoading ? (
            <PreviousVisitsLoader />
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: Fonts.Gibson_SemiBold,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  fontSize: 12,
                  marginTop: 15,
                  marginBottom: 15,
                  marginLeft: 15,
                }}>
                {t(Translations.PREVIOUS_VISITS)} ({previousVisitCount})
              </Text>
              {Globals.USER_DETAILS.canAddVisit ? (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: 6,
                    backgroundColor: Colors.BACKGROUND_COLOR,
                    bottom: 6,
                    flexDirection: 'row',
                    borderRadius: 5,
                  }}
                  onPress={() => AddVisit()}>
                  <Image
                    source={Images.PLUS_SQUARE_ICON}
                    style={{
                      width: 16,
                      height: 16,
                      resizeMode: 'contain',
                      tintColor: Colors.SECONDARY_COLOR,
                      alignSelf: 'center',
                      marginLeft: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.Gibson_Regular,
                      color: Colors.SECONDARY_COLOR,
                      fontSize: 12,
                      marginTop: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}>
                    {t(Translations.ADD_VISITS)}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>

        <FlatList
          contentContainerStyle={{paddingBottom: 85, marginTop: 10}}
          data={isLoading ? dummyCustomerNoteList : customerNotesList}
          keyboardShouldPersistTaps="handled"
          renderItem={renderCustomerNotesItem}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            listOnEndReach();
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={NotesEmptyComponent}
          ListFooterComponent={isPaginating ? paginationComponent : null}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={[Colors.PRIMARY_COLOR, Colors.SECONDARY_COLOR]}
            />
          }
        />
      </View>
    </>
  );
};

export default CustomerDetailsScreen;

const styles = StyleSheet.create({});
