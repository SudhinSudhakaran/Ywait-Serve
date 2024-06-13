import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  I18nManager,
  Linking,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';
import FastImage from 'react-native-fast-image';
import Pdf from 'react-native-pdf';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-viewing-rtl';
import {
  PERMISSIONS,
  check,
  request,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import {t} from 'i18next';
import {
  Colors,
  Fonts,
  Globals,
  Images,
  Strings,
  Translations,
} from '../../../constants';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';
import {GetImage} from '../../shared/getImage/GetImage';
import Utilities from '../../../helpers/utils/Utilities';
import {BUILD_SOURCE, UploadTypes} from '../../../helpers/enums/Enums';
import DataManager from '../../../helpers/apiManager/DataManager';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import UploadOptions from '../../shared/uploadOptionsPopup/uploadOptions';
import PermissionAlert from '../../shared/permissionAlert/PermissionAlert';
import {checkMultiplePermissions} from '../../../helpers/utils/Permission';
import StorageManager from '../../../helpers/storageManager/StorageManager';
import LoadingIndicator from '../../shared/loadingIndicator/LoadingIndicator';
import PinSettingsPopupScreen from '../pinSettingsPopup/PinSettingsPopupScreen';
import { useSelector } from 'react-redux';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [personalInfoList, setPersonalInfoList] = useState([]);
  const [dynamicInfoWithUserValueList, setDynamicInfoWithUserValueList] =
    useState([]); //
  const [fullScreenImages, setFullScreenImages] = useState([]);
  const [imageFullScreenVisible, setImageFullScreenVisible] = useState([]);
  //Declaration
  const insets = useSafeAreaInsets();
  const refRBSheetPinSettings = useRef();
  const refRBSheetUploadOptions = useRef();
  const [showAlert, setShowAlert] = useState(false);
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  //redux state for tabletview
  const isTablet = useSelector((state)=>state.tablet.isTablet);

  // useEffect(() => {
  //     setIsLoading(true);
  //     getUserDetails(Globals.USER_DETAILS?._id);
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getUserDetails(Globals.USER_DETAILS?._id);
    }, []),
  );

  //Button actions
  const backButtonAction = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  const userImageButtonAction = () => {
    if (
      Globals.USER_DETAILS?.image !== undefined &&
      Globals.USER_DETAILS?.image !== null &&
      Globals.USER_DETAILS?.image !== ''
    ) {
      Keyboard.dismiss();
      setFullScreenImages([
        {
          uri: Globals.USER_DETAILS?.image,
        },
      ]);
      setImageFullScreenVisible(true);
    }
  };

  const changePhotoButtonAction = () => {
    Keyboard.dismiss();
    refRBSheetUploadOptions.current.open();
  };

  const updateEmailButtonAction = () => {
    Keyboard.dismiss();
    navigation.navigate('ChangeEmailScreen');
  };

  const changePasswordButtonAction = () => {
    Keyboard.dismiss();
    navigation.navigate('ChangePasswordScreen');
  };

  const pinSettingsButtonAction = () => {
    Keyboard.dismiss();
    Globals.SHARED_VALUES.SELECTED_PIN_AUTH_SETTINGS =
      Globals.USER_DETAILS?.enablePinAuthentication;
    refRBSheetPinSettings.current.open();
  };

  const logoutButtonAction = () => {
    Keyboard.dismiss();
    showLogoutConfirmationAlert();
  };

  const editProfileButtonAction = () => {
    console.log('profile', APIConnections.KEYS.EMAIL);
    Keyboard.dismiss();
    // navigation.navigate('UpdateProfileScreen', {
    //   dynamicInfoWithUserValueList: dynamicInfoWithUserValueList,
    // });

    NetInfo.fetch().then(state => {
      console.log('isConnected', state.isConnected);

      if (state.isConnected === false) {
        Utilities.showToast(
          t(Translations.FAILED),
          t(Translations.NO_INTERNET),
          'error',
          'bottom',
        );
      } else {
        if (dynamicInfoWithUserValueList.length > 0) {
          navigation.navigate('UpdateProfileScreen', {
            dynamicInfoWithUserValueList: dynamicInfoWithUserValueList,
          });
        } else {
          setIsLoading(true);
          getUserDetails(Globals.USER_DETAILS?._id);
        }
      }
    });
  };

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
        uri: url,
      },
    ]);
    setImageFullScreenVisible(true);
  };

  const showLogoutConfirmationAlert = () => {
    setShowAlert(true);
  };

  const performLogout = async () => {
    //Create OR use Token UUID
    getTokenUUID().then(res => {
      Globals.TOKEN_UUID = res;
      performLogoutAPI();
    });
  };

  const getTokenUUID = async () => {
    const uuid = await Utilities.getTokenUUID();
    if (uuid === null || uuid === undefined) {
      let timeStamp = Date.parse(new Date());
      console.log('timeStamp created: ', timeStamp);
      Globals.TOKEN_UUID = timeStamp;
      Utilities.saveTokenUUID(timeStamp);
      return timeStamp;
    }
    Globals.TOKEN_UUID = uuid;
    return uuid;
  };
  const clearUserDataAndResetNavigation = async () => {
    try {
      // Utilities.ClearUserRelatedData();
      Globals.IS_AUTHORIZED = false;
      Globals.NOTIFICATION_COUNT = 0;
      Globals.TOKEN = '';
      Globals.UN_READ_NOTIFICATION_COUNT = 0;
      //Resets Global shared values
      Globals.SHARED_VALUES.DYNAMIC_SELECTION_ITEMS = [];
      Globals.SHARED_VALUES.SELECTED_NOTES_INFO = {};
      Globals.SHARED_VALUES.SELECTED_CUSTOMER_INFO = {};
      Globals.SHARED_VALUES.SELECTED_PAYMENT_INFO = {};
      Globals.SHARED_VALUES.MANAGE_Q_SELECTED_SERVING_USER_INFO = {};
      Globals.SHARED_VALUES.MOVE_TO_FULFILLED_PAYLOAD_INFO = {};
      Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO = {};
    } catch (err) {
      console.log(err);
    }
    //Navigate to business selection
    if (Globals.IS_STANDALONE_BUILD === true) {
      checkAuthType(Globals.BUSINESS_DETAILS);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'BusinessSelectionScreen'}],
      });
    }
  };
  const checkAuthType = businessDetails => {
    if (businessDetails !== undefined && businessDetails !== null) {
      if (businessDetails.authenticationType?.length > 0) {
        if (businessDetails.authenticationType?.includes('email')) {
          //Navigate to Email login page
          navigation.reset({
            index: 0,
            routes: [{name: 'EmailLoginScreen'}],
          });
        } else {
          //Navigate to Phone number login page
          navigation.reset({
            index: 0,
            routes: [{name: 'PhoneLoginScreen'}],
          });
        }
      }
    }
  };
  const performLogoutAPI = () => {
    const body = {
      [APIConnections.KEYS.DEVICE_ID]: Globals.TOKEN_UUID,
      [APIConnections.KEYS.DEVICE]: Platform.OS,
      [APIConnections.KEYS.USER_ID]: Globals.USER_DETAILS._id,
    };
    DataManager.performLogOut(body).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        //Clear user related data
        StorageManager.clearUserRelatedData();

        clearUserDataAndResetNavigation();
      } else {
        Utilities.showToast(t(Translations.FAILED), message, 'error', 'bottom');
        setIsLoading(false);
        // setRefresh(false);
      }
    });
  };

  //Other methods
  const createPersonalInfoList = userDetails => {
    let additionalInfo = userDetails?.additionalInfo; //holds user values
    let dynamicInfo = userDetails?.dynamicInfo; //dynamic list structure
    var _dynamicInfoWithUserValueList = userDetails?.dynamicInfo; //copy dynamic list structure, and add user values

    if (
      additionalInfo !== undefined &&
      additionalInfo !== null &&
      dynamicInfo !== undefined &&
      dynamicInfo !== null
    ) {
      dynamicInfo.map((item, dynamicItemIndex) => {
        additionalInfo.map((userValueItem, userValueItemIndex) => {
          if (
            item.key === userValueItem.key &&
            item.type === userValueItem.type
          ) {
            _dynamicInfoWithUserValueList[dynamicItemIndex].userValue =
              userValueItem.value;
          }
        });
      });
    }

    console.log(
      '_dynamicInfoWithUserValueList: ',
      _dynamicInfoWithUserValueList,
    );
    setDynamicInfoWithUserValueList(_dynamicInfoWithUserValueList); //To pass data and value to update
    //Filter only ACTIVE and required with userValue if any
    let activeOnlyDynamicList = _dynamicInfoWithUserValueList.filter(data => {
      return (
        data.status?.toUpperCase() === 'ACTIVE' &&
        (data.isRequired === true || data.userValue !== undefined)
      );
    });
    console.log('activeOnlyDynamicList: ', activeOnlyDynamicList);
    //Adding Role, Departments, Designation, Can serve gender
    //Role
    if (userDetails?.role_id?.label !== undefined) {
      var roleRow = {};
      roleRow.key = userDetails?.role_id?.key;
      roleRow.label = 'Role';
      roleRow.userValue = userDetails?.role_id?.label;
      roleRow.type = 'Text';
      roleRow.status = userDetails?.role_id?.status;
      activeOnlyDynamicList.push(roleRow);
    }
    //Department
    if (userDetails?.department_id?.department_name !== undefined) {
      var departmentRow = {};
      departmentRow.key = 'department';
      departmentRow.label = 'Departments';
      departmentRow.userValue = userDetails?.department_id?.department_name;
      departmentRow.type = 'Text';
      departmentRow.status = userDetails?.department_id?.status;
      activeOnlyDynamicList.push(departmentRow);
    }
    //Designation
    if (userDetails?.designation_id?.designation !== undefined) {
      var designationRow = {};
      designationRow.key = 'designation';
      designationRow.label = 'Designation';
      designationRow.userValue = userDetails?.designation_id?.designation;
      designationRow.type = 'Text';
      designationRow.status = userDetails?.designation_id?.status;
      activeOnlyDynamicList.push(designationRow);
    }
    setPersonalInfoList(activeOnlyDynamicList);
  };

  const _openCamera = () => {
    ImagePicker.openCamera({
      width: 512,
      height: 512,
      cropping: Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.OMH ? false : true,
      includeBase64: true,
    })
      .then(image => {
        // const filename = image.path.replace(/^.*[\\\/]/, '')
        // const source = {
        //     uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
        //     type: image.mime,
        //     name: `${filename}`
        // };
        console.log(image);
        let imageURL = image.path;
        uploadProfilePic(imageURL);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 512,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        // const filename = image.path.replace(/^.*[\\\/]/, '')
        // const source = {
        //     uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
        //     type: image.mime,
        //     name: `${filename}`
        // };
        console.log('<><><>',image);
        let imageURL = image.path;
        uploadProfilePic(imageURL);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const GetUploadOptions = () => {
    return (
      <RBSheet
        ref={refRBSheetUploadOptions}
        closeOnDragDown={true}
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
        height={ isTablet===true?230:200}>
        <UploadOptions
          RBSheet={refRBSheetUploadOptions}
          isHideFileUpload={true}
          onUploadOptionSelection={handleUploadOptionSelection}
        />
      </RBSheet>
    );
  };

  //Callback from UploadOptions
  const handleUploadOptionSelection = (type: UploadTypes) => {
    console.log('Callback:', type);
    // setSelectedUploadOption(type)
    switch (type) {
      case UploadTypes.file:
        console.log('Opening file browser');

        break;
      case UploadTypes.camera:
        //   if (Utilities.checkAppCameraPermission() === true) {
        //     console.log('Opening camera');
        //     openCamera();
        //   } else {
        //     console.log('Permission denied');
        // //    request(PERMISSIONS.ANDROID.CAMERA);
        //     setShowPermissionAlert(true);
        //   }

        openCamera();
        break;
      case UploadTypes.image:
        console.log('Opening image picker');
        openGallery();
        break;
    }
  };
  const openCamera = async () => {
    console.log(' Camera selected');
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA]
        : [PERMISSIONS.ANDROID.CAMERA];

    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    console.log('isPermissionGranted', isPermissionGranted);
    if (isPermissionGranted) {
      _openCamera();
    } else {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the camera.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };

  //API Calls
  /**
            *
            * Purpose: Get user details
            * Created/Modified By: Jenson
            * Created/Modified Date: 04 Jan 2022
            * Steps:
                1.fetch business details from API and append to state variable
     */
  const getUserDetails = userId => {
    DataManager.getUserDetails(userId).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (data.objects !== undefined && data.objects !== null) {
          StorageManager.saveUserDetails(data.objects);
          Globals.USER_DETAILS = data.objects;
          createPersonalInfoList(data.objects);
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

  /**
            *
            * Purpose: Get user details
            * Created/Modified By: Jenson
            * Created/Modified Date: 04 Jan 2022
            * Steps:
                1.fetch business details from API and append to state variable
     */
  const uploadProfilePic = imageURL => {
    setIsLoading(true);
    var formData = new FormData();
    //Adding static required values
    formData.append(APIConnections.KEYS.BUSINESS_ID, Globals.BUSINESS_ID);
    formData.append(APIConnections.KEYS.ADMIN_ID, Globals.USER_DETAILS._id);
    formData.append(APIConnections.KEYS.IMAGE, {
      uri: imageURL,
      type: 'image/png',
      name: Utilities.getFileName(imageURL),
    });
    DataManager.performProfileImageUpload(formData).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          getUserDetails(Globals.USER_DETAILS._id);
          Utilities.showToast(
            t(Translations.SUCCESS),
            t(Translations.PROFILE_IMAGE_UPDATED_SUCCESS),
            'success',
            'bottom',
          );
        } else {
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
        }
      },
    );
  };

  const changePINAuthForUser = status => {
    setIsLoading(true);
    const body = {
      [APIConnections.KEYS.STATUS]: status,
      [APIConnections.KEYS.USER_ID]: Globals.USER_DETAILS._id,
    };
    DataManager.updateAuthPINSettings(body).then(
      ([isSuccess, message, responseData]) => {
        console.log('responseData<><><><><>', responseData);
        if (isSuccess === true) {
          let _verificationData = responseData?.objects;
          if (_verificationData !== undefined && _verificationData !== null) {
            getUserDetails(Globals.USER_DETAILS._id);
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
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
          setIsLoading(false);
        }
      },
    );
  };

  //Render UI

  const PINAuthSettingsPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetPinSettings}
        closeOnDragDown={true}
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
        height={200}>
        <PinSettingsPopupScreen
          RBSheet={refRBSheetPinSettings}
          didSelectItem={didSelectedPINSettingsOption}
        />
      </RBSheet>
    );
  };

  const didSelectedPINSettingsOption = status => {
    console.log('<><> status in pin auth' , status)
    changePINAuthForUser(status);
  };

  const renderFileAttachmentList = ({item, index}) => {
    return <FileAttachmentList item={item} itemIndex={index} />;
  };

  const FileAttachmentList = ({item, itemIndex}) => {
    if (item !== undefined && (item?.length || 0) > 0) {
      let fileType = Utilities.getFileExtension(item);
      if (fileType === 'pdf') {
        return (
          <>
            <TouchableOpacity
              onPress={() => filePreviewButtonAction(item)}
              style={{
                width: 100,
                height: 100,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.WHITE_COLOR,
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
                  //console.log(`FileAttachmentList error: ${error}`);
                }}
                onPressLink={uri => {
                  //console.log(`Link pressed: ${uri}`);
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
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
                width: 100,
                height: 100,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.WHITE_COLOR,
                marginRight: 12,
              }}>
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
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
                width: 100,
                height: 100,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.WHITE_COLOR,
                marginRight: 12,
              }}>
              <FastImage
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.TEXT_PLACEHOLDER_COLOR,
                }}
                source={{
                  uri: item,
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

  const DynamicList = ({item, itemIndex}) => {
    if (item.type?.toUpperCase() === 'File'.toUpperCase()) {
      if (item?.userValue instanceof Array) {
        //File type
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 16,
                marginRight: 16,
                marginBottom: 20,
              }}>
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    color: Colors.TEXT_LIGHT_GREY_COLOR_3E,
                    fontFamily: Fonts.Gibson_Regular,
                    fontSize: 14,
                    textAlign: 'left',
                  }}>
                  {item.label || '-'}
                </Text>
              </View>
              <View style={{width: '60%'}}>
                <FlatList
                  data={item?.userValue || []}
                  horizontal
                  renderItem={renderFileAttachmentList}
                  keyExtractor={(fileItem, fileItemIndex) =>
                    fileItemIndex.toString()
                  }
                  listKey={(fileItem, fileItemIndex) =>
                    fileItemIndex.toString()
                  }
                  contentContainerStyle={{paddingTop: 10, paddingBottom: 20}}
                />
              </View>
            </View>
          </>
        );
      } else {
        return null;
      }
    } else {
      return (
        <>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 16,
              marginRight: 16,
              marginBottom: 20,
            }}>
            <View style={{width: '40%'}}>
              <Text
                style={{
                  marginRight: 16,
                  color: Colors.TEXT_LIGHT_GREY_COLOR_3E,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: isTablet===true?18:14,
                  textAlign: 'left',
                }}>
                {item.label || '-'}
              </Text>
            </View>
            <View style={{width: '60%'}}>
              <Text
                style={{
                  color: Colors.SECONDARY_COLOR,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: isTablet===true?18:14,
                  textAlign: 'left',
                }}>
                {item.userValue || '-'}
              </Text>
            </View>
          </View>
        </>
      );
    }
  };

  const renderPersonalInfoDynamicIList = ({item, index}) => {
    return <DynamicList item={item} itemIndex={index} />;
  };

  /**
   * Header part above dynamic list
   * Purpose: Get user details
   * Created/Modified By: Jenson
   * Created/Modified Date: 04 Jan 2022
   */
  const ListHeaderComponent = (
    <>
      <View style={{flexDirection: 'row'}}>
        <View>
          <TouchableOpacity
            onPress={() => userImageButtonAction()}
            style={{
              marginLeft: 16,
              marginTop: 10,
              width: isTablet===true?70:66,
              height:isTablet===true?70:66,
              borderWidth: 3,
              borderRadius: isTablet===true?70/2:66 / 2,
              borderColor: Colors.PRIMARY_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <GetImage
              style={{
                width: isTablet===true?65:60,
                height: isTablet===true?65:60,
                borderRadius: isTablet===true?65/2:60 / 2,
                borderWidth: 1,
                borderColor: Colors.WHITE_COLOR,
              }}
              fullName={(
                (Globals.USER_DETAILS?.firstName || 'N/A') +
                ' ' +
                (Globals.USER_DETAILS?.lastName || '')
              ).trim()}
              alphabetColor={Colors.SECONDARY_COLOR}
              url={Globals.USER_DETAILS?.image}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changePhotoButtonAction()}>
            <Text
              style={{
                fontFamily: Fonts.Gibson_Regular,
                fontSize:  isTablet===true?16:12,
                marginLeft: 16,
                marginTop: 8,
                color: Colors.PRIMARY_COLOR,
                textAlign: 'left',
              }}>
              {t(Translations.CHANGE_PHOTO)}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              marginLeft: 18,
              marginTop: 32,
              marginRight: 20,
              color: Colors.BLACK_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?23: 16,
              textAlign: 'left',
            }}
            numberOfLines={1}>
            {Globals.USER_DETAILS?.name}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => updateEmailButtonAction()}
              style={{
                marginLeft: 15,
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={Images.EMAIL_UPDATE_IMAGE}
                style={{
                  width: isTablet===true?15: 13,
                  height:  isTablet===true?15:13,
                  tintColor: Colors.PRIMARY_COLOR,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  marginLeft: 4,
                  color: Colors.PRIMARY_COLOR,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize:  isTablet===true?14:10,
                  textAlign: 'left',
                }}
                numberOfLines={1}>
                {t(Translations.UPDATE_EMAIL)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => changePasswordButtonAction()}
              style={{
                marginLeft: 14,
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={Images.PASSWORD_UPDATE_IMAGE}
                style={{
                  width:  isTablet===true?15:13,
                  height:  isTablet===true?15:13,
                  tintColor: Colors.PRIMARY_COLOR,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  marginLeft: 4,
                  color: Colors.PRIMARY_COLOR,
                  fontFamily: Fonts.Gibson_Regular,
                  textAlign: 'left',
                  fontSize:  isTablet===true?14:10,
                }}
                numberOfLines={1}>
                {t(Translations.CHANGE_PASSWORD)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginLeft: 14,
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => logoutButtonAction()}>
              <Image
                source={Images.LOGOUT_IMAGE}
                style={{
                  width:  isTablet===true?15:13,
                  height:  isTablet===true?15:13,
                  tintColor: Colors.PRIMARY_COLOR,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  marginLeft: 4,
                  color: Colors.PRIMARY_COLOR,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize:  isTablet===true?14:10,
                  textAlign: 'left',
                }}
                numberOfLines={1}>
                {t(Translations.LOG_OUT)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{marginTop: 16, marginBottom: 20}}>
        <Text
          style={{
            marginLeft: 16,
            fontFamily: Fonts.Gibson_Regular,
            fontSize:  isTablet===true?20:14,
            color: Colors.BLACK_COLOR,
            textAlign: 'left',
          }}>
          {t(Translations.PERSONAL_INFO)}
        </Text>
        <View
          style={{
            marginTop: 4,
            marginLeft: 16,
            backgroundColor: Colors.SECONDARY_COLOR,
            height: 2,
            width: 30,
          }}
        />
      </View>
    </>
  );

  /**
   * Footer part below dynamic list
   * Purpose: Show bottom buttons
   * Created/Modified By: Jenson
   * Created/Modified Date: 05 Jan 2022
   */
  const ListFooterComponent = (
    <>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => editProfileButtonAction()}
          style={{
            marginLeft: 16,
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={Images.EDIT_PERSONAL_INFO_IMAGE}
            style={{
              width:  isTablet===true?18:13,
              height:  isTablet===true?18:13,
              tintColor: Colors.PRIMARY_COLOR,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              marginLeft: 4,
              color: Colors.PRIMARY_COLOR,
              fontFamily: Fonts.Gibson_Regular,
              fontSize:  isTablet===true?14:10,
              textAlign: 'left',
            }}
            numberOfLines={1}>
            {t(Translations.EDIT_PERSONAL_INFO)}
          </Text>
        </TouchableOpacity>

        {Utilities.isBusinessPINAuthEnabled() === true ? (
          <TouchableOpacity
            onPress={() => pinSettingsButtonAction()}
            style={{
              marginLeft: 16,
              marginTop: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={Images.PIN_AUTH_IMAGE}
              style={{
                width: 13,
                height: 13,
                tintColor: Colors.PRIMARY_COLOR,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                marginLeft: 4,
                color: Colors.PRIMARY_COLOR,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 10,
                textAlign: 'left',
              }}
              numberOfLines={1}>
              {t(Translations.PIN_AUTH)}
            </Text>
          </TouchableOpacity>
        ) : null}

        {/*
                    Utilities.isPINAuthEnabled() === true

                        ?

                        <TouchableOpacity
                            onPress={() => pinSettingsButtonAction()}
                            style={{ marginLeft: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Images.EDIT_PERSONAL_INFO_IMAGE} style={{ width: 13, height: 13, tintColor: Colors.PRIMARY_COLOR, resizeMode: 'contain' }} />
                            <Text style={{
                                marginLeft: 4,
                                color: Colors.PRIMARY_COLOR,
                                fontFamily: Fonts.Gibson_Regular, fontSize: 10,
                            }} numberOfLines={1}>{Strings.UPDATE_PIN}</Text>
                        </TouchableOpacity>

                        :

                        null

               */}
      </View>
    </>
  );

  //Final return
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
        <LoadingIndicator visible={isLoading} />
        <GetUploadOptions />
        <PINAuthSettingsPopup />
        <StatusBar
          backgroundColor={Colors.PRIMARY_COLOR}
          barStyle="dark-content"
        />
        {/* <ImageView
          images={fullScreenImages}
          imageIndex={0}
          visible={imageFullScreenVisible}
          onRequestClose={() => setImageFullScreenVisible(false)}
        /> */}
        <ImageViewer
          images={fullScreenImages}
          index={0}
          visible={imageFullScreenVisible}
          enablePreload={true}
          useNativeDriver={true}
          onRequestClose={() => setImageFullScreenVisible(false)}
        />
        <View
          style={{
            backgroundColor: Colors.PRIMARY_COLOR,
            height: isTablet===true?55:45,
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              position: 'absolute',
              left: 20,
              alignSelf: 'center',
            }}
            onPress={() => backButtonAction()}>
            <Image
              source={Images.BACK_ARROW_IMAGE}
              style={{
                width:isTablet===true?30: 20,
                height: isTablet===true?30:20,
                resizeMode: 'contain',
                tintColor: Colors.WHITE_COLOR,
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: Fonts.Gibson_Regular,
              fontSize: isTablet===true?22:16,
              color: Colors.WHITE_COLOR,
              alignSelf: 'center',
            }}>
            {t(Translations.PROFILE)}
          </Text>
        </View>

        <FlatList
          data={personalInfoList}
          renderItem={renderPersonalInfoDynamicIList}
          keyExtractor={(item, index) => index.toString()}
          listKey={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 20,
            paddingRight: 10,
          }}
          bounces={false}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={isLoading ? null : ListFooterComponent}
        />
      </View>
      <PermissionAlert
        showPermissionAlert={showPermissionAlert}
        permissionTitle={t(Translations.CAMERA_PERMISSION)}
        setShowPermissionAlert={setShowPermissionAlert}
      />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={t(Translations.PLEASE_CONFIRM)}
        titleStyle={{
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: isTablet===true?20:18
        }}
        message={t(Translations.ARE_YOU_SURE_YOU_WANT_LOG_OUT)}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        animatedValue={0.8}
        cancelText={t(Translations.CANCEL)}
        confirmText={t(Translations.CONFIRM)}
        confirmButtonColor={Colors.PRIMARY_COLOR}
        cancelButtonColor={Colors.SECONDARY_COLOR}
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          performLogout();
        }}
        cancelButtonStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
        }}
        confirmButtonStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
        }}
        actionContainerStyle={{
          width: '100%',
        }}
        cancelButtonTextStyle={{
          color: Colors.WHITE_COLOR,
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: isTablet===true?20:10
        }}
        confirmButtonTextStyle={{
          color: Colors.WHITE_COLOR,
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: isTablet===true?20:10
        }}
        messageStyle={{
          textAlign: 'left',
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize:  isTablet===true?20:15,
        }}
      />
    </>
  );
};
export default UserProfileScreen;
