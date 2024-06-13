import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  I18nManager,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import RBSheet from 'react-native-raw-bottom-sheet';
import InputScrollView from 'react-native-input-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {HelperText} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Pdf from 'react-native-pdf';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';
import {
  Fonts,
  Strings,
  Colors,
  Images,
  Globals,
  Translations,
} from '../../constants';
import {BUILD_SOURCE, UploadTypes} from '../../helpers/enums/Enums';
import APIConnections from '../../helpers/apiManager/APIConnections';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import LoadingIndicator from '../shared/loadingIndicator/LoadingIndicator';
import SuccessPopupScreen from '../shared/successPopup/SuccessPopupScreen';
import UploadOptions from '../shared/uploadOptionsPopup/uploadOptions';
import AlertConfirmPopupScreen from '../shared/alertConfirmPopup/AlertConfirmPopupScreen';
import DatePicker from 'react-native-date-picker';
import ImageView from 'react-native-image-viewing-rtl';
import moment from 'moment';
import {t} from 'i18next';
import {useFocusEffect} from '@react-navigation/core';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import PermissionAlert from '../shared/permissionAlert/PermissionAlert';
import {checkMultiplePermissions} from '../../helpers/utils/Permission';
import DisplayUtils from '../../helpers/utils/DisplayUtils';
import FilePreviewComponent from '../shared/filePreviewScreen/FilePreviewComponent';
import Modal from 'react-native-modal';
const AddNotesPopupScreen = props => {
  //Declaration
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  // const item = Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO;
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState({});
  const [enteredNote, setEnteredNote] = useState('');
  const [consultationDate, setConsultationDate] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date())
  const[dateRefresh,setDateRefresh]=useState(false);
  const [fullScreenImages, setFullScreenImages] = useState([]);
  const [imageFullScreenVisible, setImageFullScreenVisible] = useState([]);
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const refRBSheetSuccessPopup = useRef();
  const refRBSheetUploadOptions = useRef();
  const refRBSheetAlertConfirm = useRef();
  const attachmentScrollRef = useRef();
  const fileFullViewComponentRef = useRef();
  const [showFilePreviewPopUp, setShowFilePreviewPopUp] = useState(false);
  const [showChangeAlert, setShowChangeAlert] = useState(false);
  const [showChangeServeAlert, setShowChangeServeAlert] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => props.RBSheet.current?.close();
    }, []),
  );
  //Button actions
  const closePopupAction = () => {
    //Closing bottom sheet
    if (props.RBSheet !== undefined) {
      if (props.RBSheet.current !== undefined) {
        props.RBSheet.current.close();
      }
    }
  };

  const onPressFileAttachmentAddAction = (_item, index) => {
    //Show file upload option popup
    Keyboard.dismiss();
    refRBSheetUploadOptions.current.open();
  };

  const onPressFileAttachmentDeleteAction = (_item, attachmentIndex) => {
    //Show confirmation popup
    Keyboard.dismiss();
    Globals.SHARED_VALUES.ALERT_CONFIRM_MESSAGE =
      Strings.REMOVE_ATTACHMENT_CONFIRM_MESSAGE;
    Globals.SHARED_VALUES.DELETE_ATTACHMENT_SELECTED_INDEX = attachmentIndex;
    refRBSheetAlertConfirm.current.open();
  };

  const filePreviewButtonAction = (url, isLocalFile) => {
    Keyboard.dismiss();
    // navigation.navigate('FilePreviewScreen', {
    //   titleText: Utilities.getFileName(url),
    //   url: url,
    //   isLocalFile: isLocalFile,
    //   refRBSheet: props.RBSheet,
    // });
    let obj = {};
    obj.titleText = Utilities.getFileName(url);
    obj.url = url;
    obj.isLocalFile = isLocalFile;
    Globals.FILE_PREVIEW_DATA = obj;
    console.log(' popup called', obj);

    setShowFilePreviewPopUp(true);
  };

  const FilePreviewComponentPopUp = () => {
    return (
      <Modal
        style={{margin: 0}}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        visible={showFilePreviewPopUp}>
        <FilePreviewComponent
          fileFullViewComponentCloseAction={fileFullViewComponentCloseAction}
        />
      </Modal>
    );
  };
  const fileFullViewComponentCloseAction = () => {
    setShowFilePreviewPopUp(false);
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

  const cancelAction = () => {
    closePopupAction();
  };

  const yesAction = () => {
    console.log('enteredNote yes action');
    if (enteredNote.trim() !== '' || item?.notesAttachments?.length !== 1) {
      if (props.isFromDetailsPage) {
        if (consultationDate !== '') {
          console.log('enteredNote', enteredNote);
          console.log(
            'item?.notesAttachments.length',
            item?.notesAttachments.length,
          );
          console.log('consultationDate:', consultationDate);
          if (
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.notes?.trim() !==
              undefined &&
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.images !== undefined &&
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.consultationDate !==
              undefined
          ) {
            if (
              Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.notes?.trim() !== '' ||
              Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.images?.length > 0 ||
              Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.consultationDate !== ''
            ) {
              console.log('EDIT');
              performNoteEditFromDetails();
            } else {
              console.log('ADD');
              performNoteAddFromDetails();
            }
          } else {
            console.log('ADD');
            performNoteAddFromDetails();
          }
        } else {
          setShowChangeServeAlert(true);
          // alert(t(Translations.PLEASE_SELECT_SERVED_DATE));
        }
      } else {
        performNoteUpdate();
      }
    } else {
      setShowChangeAlert(true);
      // alert(t(Translations.NOTES_CAN_NOT_EMPTY));
    }
  };

  //Other functions
  const loadData = () => {
    console.log('load data called', Globals.SHARED_VALUES.SELECTED_NOTES_INFO);
    var _item = Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO;

    if (props.isFromDetailsPage === true) {
      _item = Globals.SHARED_VALUES.SELECTED_NOTES_INFO;

      setEnteredNote(_item?.notes || '');
      if (
        Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.consultationDate !==
        undefined
      ) {
        setConsultationDate(
          moment(
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.consultationDate,
          ).toISOString(),
        );
        console.log(
          'consultationDate 3rd condition',
          moment(
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.consultationDate,
          ).format('DD MM YYYYY hh:mm A'),
        );
      } else if (
        Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.booking_id?.servingDate !==
        undefined
      ) {
        setConsultationDate(
          moment(
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.booking_id?.servingDate,
          ).toISOString(),
        );
        console.log(
          'bookingDetails => serving Date   1st condition',
          moment(
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.booking_id?.servingDate,
          ).format('DD MM YYYYY hh:mm A'),
        );
      } else if (
        Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.queue_id?.servingDate !==
        undefined
      ) {
        setConsultationDate(
          moment(
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.queue_id?.servingDate,
          ).toISOString(),
        );
        console.log(
          'queueDetails=> serving Date 2nd condition',
          moment(
            Globals.SHARED_VALUES.SELECTED_NOTES_INFO?.queue_id?.servingDate,
          ).format('DD MM YYYYY hh:mm A'),
        );
      }

      if (_item?.images?.length > 0) {
        var attachments = [];
        var existingItems = _item.images;
        existingItems.map((existingItem, itemIndex) => {
          var existingAttach = {};
          existingAttach.type = 'Existing';
          existingAttach.url = existingItem;
          attachments.push(existingAttach);
        });

        var addAttach = {};
        addAttach.type = 'Add';
        attachments.push(addAttach);
        _item.notesAttachments = attachments;
        setItem(_item);
      } else {
        var attachments = [];
        var addAttach = {};
        addAttach.type = 'Add';
        attachments.push(addAttach);
        _item.notesAttachments = attachments;
        setItem(_item);
      }
    } else {
      _item = Globals.SHARED_VALUES.SELECTED_DRAG_ITEM_INFO;

      setEnteredNote(_item?.notes || '');

      if (_item?.images.length > 0) {
        var attachments = [];
        var existingItems = _item.images;
        existingItems.map((existingItem, itemIndex) => {
          var existingAttach = {};
          existingAttach.type = 'Existing';
          existingAttach.url = existingItem;
          attachments.push(existingAttach);
        });

        var addAttach = {};
        addAttach.type = 'Add';
        attachments.push(addAttach);
        _item.notesAttachments = attachments;
        setItem(_item);
      } else {
        var attachments = [];
        var addAttach = {};
        addAttach.type = 'Add';
        attachments.push(addAttach);
        _item.notesAttachments = attachments;
        setItem(_item);
      }
    }
  };

  /**
             *
             * Purpose: Perform notify delay
             * Created/Modified By: Jenson
             * Created/Modified Date: 04 Feb 2022
             * Steps:
                 1.fetch data from API and append to state variable
      */
  const performNoteUpdate = duration => {
    setIsLoading(true);
    var formData = new FormData();
    //Adding values
    if (item?.name === 'Booking') {
      formData.append(APIConnections.KEYS.BOOKING_ID, item?._id);
    } else {
      formData.append(APIConnections.KEYS.QUEUE_ID, item?._id);
    }
    formData.append(APIConnections.KEYS.NOTES, enteredNote);
    // formData.append(APIConnections.KEYS.IMAGE, JSON.stringify(item?.notesAttachments));

    let attachmentsInfoList = item?.notesAttachments || [];
    var existingItems = [];
    if (attachmentsInfoList.length > 1) {
      attachmentsInfoList.map((attachmentItem, attachmentItemIndex) => {
        if (attachmentItem.type === 'Existing') {
          existingItems.push(attachmentItem.url);
        } else if (attachmentItem.type === 'Local') {
          let localItemURL = attachmentItem.url;
          let fileType = Utilities.getFileExtension(localItemURL);
          let fileName = Utilities.getFileName(localItemURL);
          if (fileType.toUpperCase() === 'pdf'.toUpperCase()) {
            formData.append(APIConnections.KEYS.IMAGE, {
              uri: localItemURL,
              type: 'application/pdf',
              name: fileName,
            });
          } else if (fileType.toUpperCase() === 'doc'.toUpperCase()) {
            formData.append(APIConnections.KEYS.IMAGE, {
              uri: localItemURL,
              type: 'application/msword',
              name: fileName,
            });
          } else if (fileType.toUpperCase() === 'docx'.toUpperCase()) {
            formData.append(APIConnections.KEYS.IMAGE, {
              uri: localItemURL,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              name: fileName,
            });
          } else {
            formData.append(APIConnections.KEYS.IMAGE, {
              uri: localItemURL,
              type: 'image/png',
              name: fileName,
            });
          }
        }
      });
    }
    //Append existing values if available
    if (existingItems.length > 0) {
      let existingKey = 'existingImages';
      formData.append(existingKey, JSON.stringify(existingItems));
    }
    DataManager.performNoteUpdate(formData).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          setIsLoading(false);
          if (props.onUpdateNotes !== undefined) {
            props.onUpdateNotes();
          }
          closePopupAction();
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
  /**
           *
           * Purpose: Perform notify delay
           * Created/Modified By: Jenson
           * Created/Modified Date: 04 Feb 2022
           * Steps:
               1.fetch data from API and append to state variable
    */
  const performNoteAddFromDetails = () => {
    console.log('consultation date ===========', consultationDate);
    setIsLoading(true);
    var formData = new FormData();
    //Adding values
    // if (item?.name === 'Booking') {
    //     formData.append(APIConnections.KEYS.BOOKING_ID, item?._id);
    // } else {
    //     formData.append(APIConnections.KEYS.QUEUE_ID, item?._id);
    // }
    formData.append(
      APIConnections.KEYS.BUSINESS_ID,
      Globals.BUSINESS_DETAILS._id,
    );
    formData.append(APIConnections.KEYS.NOTES, enteredNote);
    formData.append(APIConnections.KEYS.CONSULTATION_DATE, consultationDate);
    formData.append(APIConnections.KEYS.CUSTOMER_ID, props.customerDetails._id);
    // formData.append(APIConnections.KEYS.IMAGE, JSON.stringify(item?.notesAttachments));

    let attachmentsInfoList = item?.notesAttachments || [];
    console.log('Item <====> ', item?.notesAttachments);
    var existingItems = [];
    if (attachmentsInfoList.length > 1) {
      attachmentsInfoList.map((attachmentItem, attachmentItemIndex) => {
        if (attachmentItem.type === 'Existing') {
          existingItems.push(attachmentItem.url);
        } else if (attachmentItem.type === 'Local') {
          let localItemURL = attachmentItem.url;
          let fileType = Utilities.getFileExtension(localItemURL);
          let fileName = Utilities.getFileName(localItemURL);
          if (fileType.toUpperCase() === 'pdf'.toUpperCase()) {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'application/pdf',
              name: fileName,
            });
          } else if (fileType.toUpperCase() === 'doc'.toUpperCase()) {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'application/msword',
              name: fileName,
            });
          } else if (fileType.toUpperCase() === 'docx'.toUpperCase()) {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              name: fileName,
            });
          } else {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'image/png',
              name: fileName,
            });
          }
        }
      });
    }
    //Append existing values if available
    if (existingItems.length > 0) {
      let existingKey = 'existingImages';
      formData.append(existingKey, JSON.stringify(existingItems));
    }

    DataManager.performNoteAddFromDetail(formData).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          setIsLoading(false);
          if (props.onUpdateNotes !== undefined) {
            props.onUpdateNotes();
          }
          closePopupAction();
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

  /**
             *
             * Purpose: Perform notify delay
             * Created/Modified By: Jenson
             * Created/Modified Date: 04 Feb 2022
             * Steps:
                 1.fetch data from API and append to state variable
      */
  const performNoteEditFromDetails = () => {
    setIsLoading(true);
    var formData = new FormData();
    console.log('consultation date ===========$', consultationDate);
    //Adding values
    // if (item?.name === 'Booking') {
    //     formData.append(APIConnections.KEYS.BOOKING_ID, item?._id);
    // } else {
    //     formData.append(APIConnections.KEYS.QUEUE_ID, item?._id);
    // }
    formData.append(
      APIConnections.KEYS.BUSINESS_ID,
      Globals.BUSINESS_DETAILS._id,
    );
    formData.append(APIConnections.KEYS.NOTES, enteredNote);
    formData.append(APIConnections.KEYS.CONSULTATION_DATE, consultationDate);
    formData.append(
      APIConnections.KEYS.NOTE_ID,
      Globals.SHARED_VALUES.SELECTED_NOTES_INFO?._id,
    );
    formData.append(APIConnections.KEYS.CUSTOMER_ID, props.customerDetails._id);
    // formData.append(APIConnections.KEYS.IMAGE, JSON.stringify(item?.notesAttachments));

    let attachmentsInfoList = item?.notesAttachments || [];
    var existingItems = [];
    if (attachmentsInfoList.length > 1) {
      attachmentsInfoList.map((attachmentItem, attachmentItemIndex) => {
        if (attachmentItem.type === 'Existing') {
          existingItems.push(attachmentItem.url);
        } else if (attachmentItem.type === 'Local') {
          let localItemURL = attachmentItem.url;
          let fileType = Utilities.getFileExtension(localItemURL);
          let fileName = Utilities.getFileName(localItemURL);
          if (fileType.toUpperCase() === 'pdf'.toUpperCase()) {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'application/pdf',
              name: fileName,
            });
          } else if (fileType.toUpperCase() === 'doc'.toUpperCase()) {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'application/msword',
              name: fileName,
            });
          } else if (fileType.toUpperCase() === 'docx'.toUpperCase()) {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              name: fileName,
            });
          } else {
            formData.append(APIConnections.KEYS.NOTES_IMAGES, {
              uri: localItemURL,
              type: 'image/png',
              name: fileName,
            });
          }
        }
      });
    }
    //Append existing values if available
    if (existingItems.length > 0) {
      let existingKey = 'existingImages';
      formData.append(existingKey, JSON.stringify(existingItems));
    }
    console.log('formData', formData);
    DataManager.performNoteUpdateFromDetail(formData).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true) {
          setIsLoading(false);
          if (props.onUpdateNotes !== undefined) {
            props.onUpdateNotes();
          }
          closePopupAction();
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
        }}>
        <UploadOptions
          RBSheet={refRBSheetUploadOptions}
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
        openDocPicker();
        break;
      case UploadTypes.camera:
        // if (Utilities.checkAppCameraPermission() === true) {
        //   console.log('Opening camera');
        //   openCamera();
        // } else {
        //   console.log('Permission denied');
        //   setShowPermissionAlert(true);
        // }
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
    console.log('isPermissionGranted ===>', isPermissionGranted);
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
  const openGallery = async () => {
    const permissions =
      Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.MEDIA_LIBRARY]
      : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];

    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    console.log('isPermissionGranted ===>', isPermissionGranted);
    if (isPermissionGranted) {
      _openGallery();
    } else {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the storage.',
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
  const openDocPicker = async () => {
    const permissions =
      Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.MEDIA_LIBRARY]
      : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];

    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    console.log('isPermissionGranted ===>', isPermissionGranted);
    if (isPermissionGranted) {
      _openDocPicker();
    } else {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the storage.',
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
        var currentItem = {...item};
        var currentAttachments = currentItem?.notesAttachments;
        //Remove last add item attachment
        currentAttachments.splice(-1);
        //Attaching selected image
        var _attachmentItem = {};
        _attachmentItem.type = 'Local';
        _attachmentItem.url = imageURL;
        currentAttachments.push(_attachmentItem);
        //Insert add type object
        var _addAttachmentItem = {};
        _addAttachmentItem.type = 'Add';
        currentAttachments.push(_addAttachmentItem);
        //update copy object
        currentItem.notesAttachments = currentAttachments;
        setItem(currentItem);
      })
      .catch(err => {
        console.log('catch ==>', err);
      });
  };

  const _openGallery = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 512,
      cropping: Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.OMH ? false : true,
      includeBase64: true,
      multiple: true,
    })
      .then(image => {
        console.log('selected Image', image);

        if (image.length > 0) {
          image.map((_img, _imgIndex) => {
            let imageURL = _img.path;
            var currentItem = {...item};
            var currentAttachments = currentItem?.notesAttachments;
            //Remove last add item attachment
            currentAttachments.splice(-1);
            //Attaching selected image
            var _attachmentItem = {};
            _attachmentItem.type = 'Local';
            _attachmentItem.url = imageURL;
            currentAttachments.push(_attachmentItem);
            //Insert add type object
            var _addAttachmentItem = {};
            _addAttachmentItem.type = 'Add';
            currentAttachments.push(_addAttachmentItem);
            //update copy object
            currentItem.notesAttachments = currentAttachments;
            setItem(currentItem);
            console.log('items: ', currentItem);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const _openDocPicker = async () => {
    try {
      const pickerResult = await DocumentPicker.pickMultiple({
        type: [types.doc, types.docx, types.pdf, types.images],
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });

      console.log('openDocPicker pickerResult: ', [pickerResult]);
      let docItems = pickerResult;

   

      /**********************************************************/

      if (docItems.length > 0) {
        docItems?.map((_doc, _docIndex) => {
          let docURL = '';
          if (
            Utilities.getFileExtension(_doc.fileCopyUri).toUpperCase() ===
            'pdf'.toUpperCase()
          ) {
            docURL = _doc.uri;
          } else {
            docURL = _doc.uri;
          }
          //  let docURL = _doc.uri;
          var currentItem = {...item};
          var currentAttachments = currentItem?.notesAttachments;
          //Remove last add item attachment
          currentAttachments.splice(-1);
          //Attaching selected image
          var _attachmentItem = {};
          _attachmentItem.type = 'Local';
          _attachmentItem.url = docURL;
          // if (Utilities.getFileExtension(docItems[0].fileCopyUri) === 'pdf') {
          //   _attachmentItem.url = docItems[0].fileCopyUri;
          // } else {
          //   _attachmentItem.url = docItems[0].uri;
          // }
          currentAttachments.push(_attachmentItem);
          //Insert add type object
          var _addAttachmentItem = {};
          _addAttachmentItem.type = 'Add';
          currentAttachments.push(_addAttachmentItem);
          //update copy object
          currentItem.notesAttachments = currentAttachments;
          setItem(currentItem);
        });
      }
    } catch (e) {
      handleDocPickerError(e);
    }
  };

  const handleDocPickerError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      // console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const AlertConfirmPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetAlertConfirm}
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
        height={320}>
        <AlertConfirmPopupScreen
          RBSheet={refRBSheetAlertConfirm}
          didSelectNo={alertConfirmPopupSelectedNo}
          didSelectYes={alertConfirmPopupSelectedYes}
        />
      </RBSheet>
    );
  };

  const alertConfirmPopupSelectedNo = () => {
    refRBSheetAlertConfirm.current.close();
  };

  const alertConfirmPopupSelectedYes = () => {
    refRBSheetAlertConfirm.current.close();
    if (Globals.SHARED_VALUES.DELETE_ATTACHMENT_SELECTED_INDEX !== -1) {
      var currentItem = {...item};
      var currentAttachments = currentItem?.notesAttachments;
      if (currentAttachments.length > 0) {
        currentAttachments.splice(
          Globals.SHARED_VALUES.DELETE_ATTACHMENT_SELECTED_INDEX,
          1,
        );
      }
      //update copy object
      currentItem.notesAttachments = currentAttachments;
      setItem(currentItem);
    }
  };
  const DatePickerPopup = () => {
    var end = new Date();
    return (
      <DatePicker
        modal
        mode={'datetime'}
        tintColor={Colors.PRIMARY_COLOR}
        maximumDate={new Date(end.setHours(23,59,59,999))
        }
        open={isDatePickerOpen}
        // date={
        //   consultationDate !== undefined && consultationDate !== ''
        //     ? Utilities.convertorTimeToBusinessTimeZone(consultationDate)
        //     : Utilities.convertorTimeToBusinessTimeZone(new Date())
        // }
         date={new Date()}
        //  onChange={(date) => setDate(date)}
         onDateChange={setDate}
        onConfirm={(date) => {
          setIsDatePickerOpen(false);
           setDate(date);
           setDateRefresh(true)
         console.log(
            'onConfirmDatePicker: ',
            date,
            moment(date).format('DD MM YYYY h:mm'),
          );
          setConsultationDate(moment(date).toISOString());
        }}
        onCancel={() => {
          setIsDatePickerOpen(false);
        }}
      />
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
      <GetUploadOptions />
      <AlertConfirmPopup />
      <DatePickerPopup />
      <FilePreviewComponentPopUp />
      <PermissionAlert
        showPermissionAlert={showPermissionAlert}
        permissionTitle={t(Translations.CAMERA_PERMISSION)}
        setShowPermissionAlert={setShowPermissionAlert}
      />
      <ImageView
        images={fullScreenImages}
        imageIndex={0}
        visible={imageFullScreenVisible}
        onRequestClose={() => setImageFullScreenVisible(false)}
      />
      {/* title */}
      <Text
        style={{
          marginTop: 20,
          fontFamily: Fonts.Gibson_SemiBold,
          fontSize: 14,
          marginLeft: 16,
          color: Colors.PRIMARY_TEXT_COLOR,
          textAlign: 'left',
        }}>
         {item?.notes?.trim().length === 0 
              ? t(Translations.ADD_NOTES)
              : t(Translations._EDIT_NOTES)}
      </Text>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: -10,
          top: 15,
          width: 50,
          height: 50,
        }}
        onPress={() => closePopupAction()}>
        <Image
          style={{width: 14, height: 14, tintColor: Colors.PRIMARY_TEXT_COLOR}}
          source={Images.CLOSE_ICON}
        />
      </TouchableOpacity>

      <InputScrollView
        keyboardOffset={0}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          marginBottom: 100,
        }}>
        {props.isFromEdit === true ? (
          <>
            <Text
              style={{
                marginTop: 22,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 13,
                marginLeft: 16,
                color: Colors.TEXT_LIGHT_BLACK_COLOR,
                textAlign: 'left',
              }}>
              {t(Translations.CONSULTATION_DATE)}
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 12,
                marginLeft: 16,
                color: Colors.GREY_COLOR,
                textAlign: 'left',
              }}>
              {consultationDate !== ''
                ? moment(consultationDate).format(
                    'DD MMM YYYY, ' +
                      (Utilities.isBusiness24HrTimeFormat()
                        ? 'HH:mm'
                        : 'hh:mm A'),
                  )
                : 'Select consultation date'}
            </Text>
          </>
        ) : props.isFromDetailsPage ? (
          <TouchableOpacity onPress={() => setIsDatePickerOpen(true)}>
            <Text
              style={{
                marginTop: 22,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 13,
                marginLeft: 16,
                color: Colors.TEXT_LIGHT_BLACK_COLOR,
                textAlign: 'left',
              }}>
              {t(Translations.CONSULTATION_DATE)}
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 12,
                marginLeft: 16,
                color: Colors.GREY_COLOR,
                textAlign: 'left',
              }}>
              {consultationDate !== ''
                ? moment(consultationDate).format(
                    'DD MMM YYYY, ' +
                      (Utilities.isBusiness24HrTimeFormat()
                        ? 'HH:mm'
                        : 'hh:mm A'),
                  )
                : 'Select consultation date'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text
              style={{
                marginTop: 16,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 14,
                marginLeft: 16,
                color: Colors.TEXT_LIGHT_BLACK_COLOR,
                textAlign: 'left',
              }}>
              {t(Translations.DETAILS)}
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 13,
                marginLeft: 16,
                color: Colors.PRIMARY_TEXT_COLOR,
                textAlign: 'left',
              }}>
              {(
                (item?.customer_id?.firstName || 'N/A') +
                ' ' +
                (item.customer_id?.lastName || '')
              ).trim()}
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 13,
                marginLeft: 16,
                color: Colors.PRIMARY_TEXT_COLOR,
                textAlign: 'left',
              }}>
              {item?.token}
            </Text>
          </View>
        )}

        {item?.customer_id?.lastVisit !== undefined &&
        item?.customer_id?.lastVisit !== null ? (
          <>
            <Text
              style={{
                marginTop: 16,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 14,
                marginLeft: 16,
                color: Colors.TEXT_LIGHT_BLACK_COLOR,
                textAlign: 'left',
              }}>
              {t(Translations.LAST_VISIT)}
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: Fonts.Gibson_Regular,
                fontSize: 13,
                marginLeft: 16,
                color: Colors.PRIMARY_TEXT_COLOR,
                textAlign: 'left',
              }}>
              {Utilities.getUtcToLocalWithFormat(
                item?.customer_id?.lastVisit?.arrivingDate,
                'DD MMM YYYY',
              )}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginTop: 12,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 13,
                  marginLeft: 16,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  textAlign: 'left',
                }}>
                {t(Translations.SERVING_TIME)}
              </Text>
              <Text
                style={{
                  marginTop: 12,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 13,
                  marginLeft: 6,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  textAlign: 'left',
                }}>
                :
              </Text>
              <Text
                style={{
                  marginTop: 12,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 13,
                  marginLeft: 6,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  textAlign: 'left',
                }}>
                {Utilities.getUtcToLocalWithFormat(
                  item?.customer_id?.lastVisit?.servingDate,
                  'hh:mm ',
                )}
              </Text>
              <Text
                style={{
                  marginTop: 12,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 13,
                  marginLeft: 6,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  textAlign: 'left',
                }}>
                {Utilities.getUtcToLocalWithFormat(
                  item?.customer_id?.lastVisit?.servingDate,
                  'A',
                )}
              </Text>
              <Text
                style={{
                  marginTop: 12,
                  fontFamily: Fonts.Gibson_Regular,
                  fontSize: 13,
                  marginLeft: 6,
                  color: Colors.PRIMARY_TEXT_COLOR,
                  textAlign: 'left',
                }}>
                {t(Translations.TO)}{' '}
                {Utilities.getUtcToLocalWithFormat(
                  item?.customer_id?.lastVisit?.servingCompleteDate,
                  'hh:mm A',
                )}
              </Text>
            </View>
            <Text
              style={{
                marginTop: 12,
                fontFamily: Fonts.Gibson_SemiBold,
                fontSize: 13,
                marginLeft: 16,
                color: Colors.PRIMARY_TEXT_COLOR,
                textAlign: 'left',
              }}>
              {item?.customer_id?.lastVisit?.token}
            </Text>
          </>
        ) : null}
        <Text
          style={{
            marginTop: 16,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 14,
            marginLeft: 16,
            color: Colors.TEXT_LIGHT_BLACK_COLOR,
            textAlign: 'left',
          }}>
          {t(Translations.NOTES)}
        </Text>
        <TextInput
          style={{
            marginTop: 12,
            marginLeft: 16,
            marginRight: 16,
            fontFamily: Fonts.Gibson_Regular,
            fontSize: 13,
            color: Colors.PRIMARY_TEXT_COLOR,
            height: 100,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: Colors.LINE_SEPARATOR_COLOR,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}
          textAlignVertical="top"
          multiline={true}
          value={enteredNote}
          onChangeText={text => setEnteredNote(text)}
        />
        <Text
          style={{
            marginTop: 16,
            fontFamily: Fonts.Gibson_SemiBold,
            fontSize: 14,
            marginLeft: 16,
            color: Colors.TEXT_LIGHT_BLACK_COLOR,
            textAlign: 'left',
          }}>
          {t(Translations.ADD_ATTACHMENT)}
        </Text>

        <View style={{alignItems: 'flex-start'}}>
          <ScrollView
            ref={attachmentScrollRef}
            style={{
              marginLeft: 16,
              marginTop: 16,
              marginBottom: 10,
            }}
            contentContainerStyle={{
              alignItems: 'flex-start',
              //  flex: 1,
            }}
            horizontal={true}
            // bounces={false}
            // onContentSizeChange={() =>
            //   attachmentScrollRef?.current?.scrollToEnd({animated: true})
            // }
            >
            {item?.notesAttachments?.map((subItem, subIndex) => {
              if (subItem.type !== undefined) {
                if (subItem.type === 'Add') {
                  return (
                    <TouchableOpacity
                      key={subIndex}
                      onPress={() =>
                        onPressFileAttachmentAddAction(subItem, subIndex)
                      }
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
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          justifyContent: 'center',
                          borderRadius: 50 / 2,
                          borderWidth: 1,
                          borderColor: Colors.SECONDARY_COLOR,
                        }}>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 20 / 2,
                            alignSelf: 'center',
                            tintColor: Colors.SECONDARY_COLOR,
                          }}
                          source={Images.PLUS_FILL_ROUND_ICON}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                } else if (subItem.type === 'Local') {
                  let localItemURL = subItem.url || '';

                  console.log('Local item Url ++++++++++++', localItemURL);
                  let fileType = Utilities.getFileExtension(localItemURL);
                  if (fileType === 'pdf') {
                    return (
                      <View key={subIndex}>
                        <TouchableOpacity
                          onPress={() =>
                            filePreviewButtonAction(localItemURL, true)
                          }
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
                            source={{uri: localItemURL, cache: true}}
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
                              return (
                                <ActivityIndicator
                                  color={Colors.PRIMARY_COLOR}
                                />
                              );
                            }}
                            singlePage
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            onPressFileAttachmentDeleteAction(subItem, subIndex)
                          }
                          style={{
                            position: 'absolute',
                            right: 14,
                            top: 1,
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: 24 / 2,
                            backgroundColor: Colors.WHITE_COLOR,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'cover',
                              tintColor: Colors.PRIMARY_TEXT_COLOR,
                              alignSelf: 'center',
                            }}
                            source={Images.CLOSE_ICON}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  } else if (fileType === 'doc' || fileType === 'docx') {
                    return (
                      <View key={subIndex}>
                        <TouchableOpacity
                          onPress={() =>
                            filePreviewButtonAction(localItemURL, true)
                          }
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
                        <TouchableOpacity
                          onPress={() =>
                            onPressFileAttachmentDeleteAction(subItem, subIndex)
                          }
                          style={{
                            position: 'absolute',
                            right: 14,
                            top: 1,
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: 24 / 2,
                            backgroundColor: Colors.WHITE_COLOR,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'cover',
                              tintColor: Colors.PRIMARY_TEXT_COLOR,
                              alignSelf: 'center',
                            }}
                            source={Images.CLOSE_ICON}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  } else {
                    return (
                      <View key={subIndex}>
                        <TouchableOpacity
                          onPress={() =>
                            imageFullscreenButtonAction(localItemURL)
                          }
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
                              uri: localItemURL,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            onPressFileAttachmentDeleteAction(subItem, subIndex)
                          }
                          style={{
                            position: 'absolute',
                            right: 14,
                            top: 1,
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: 24 / 2,
                            backgroundColor: Colors.WHITE_COLOR,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'cover',
                              tintColor: Colors.PRIMARY_TEXT_COLOR,
                              alignSelf: 'center',
                            }}
                            source={Images.CLOSE_ICON}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }
                } else {
                  let existingItemURL = subItem.url || '';
                  let fileType = Utilities.getFileExtension(existingItemURL);
                  if (fileType === 'pdf') {
                    return (
                      <View key={subIndex}>
                        <TouchableOpacity
                          onPress={() =>
                            filePreviewButtonAction(existingItemURL, false)
                          }
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
                            source={{uri: existingItemURL, cache: true}}
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
                              return (
                                <ActivityIndicator
                                  color={Colors.PRIMARY_COLOR}
                                />
                              );
                            }}
                            singlePage
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            onPressFileAttachmentDeleteAction(subItem, subIndex)
                          }
                          style={{
                            position: 'absolute',
                            right: 14,
                            top: 1,
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: 24 / 2,
                            backgroundColor: Colors.WHITE_COLOR,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'cover',
                              tintColor: Colors.PRIMARY_TEXT_COLOR,
                              alignSelf: 'center',
                            }}
                            source={Images.CLOSE_ICON}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  } else if (fileType === 'doc' || fileType === 'docx') {
                    return (
                      <View key={subIndex}>
                        <TouchableOpacity
                          onPress={() =>
                            filePreviewButtonAction(existingItemURL, false)
                          }
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
                        <TouchableOpacity
                          onPress={() =>
                            onPressFileAttachmentDeleteAction(subItem, subIndex)
                          }
                          style={{
                            position: 'absolute',
                            right: 14,
                            top: 1,
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: 24 / 2,
                            backgroundColor: Colors.WHITE_COLOR,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'cover',
                              tintColor: Colors.PRIMARY_TEXT_COLOR,
                              alignSelf: 'center',
                            }}
                            source={Images.CLOSE_ICON}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  } else {
                    return (
                      <View key={subIndex}>
                        <TouchableOpacity
                          onPress={() =>
                            imageFullscreenButtonAction(existingItemURL)
                          }
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
                              uri: existingItemURL.replace('dl=0', 'dl=1'),
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            onPressFileAttachmentDeleteAction(subItem, subIndex)
                          }
                          style={{
                            position: 'absolute',
                            right: 14,
                            top: 1,
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: 24 / 2,
                            backgroundColor: Colors.WHITE_COLOR,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'cover',
                              tintColor: Colors.PRIMARY_TEXT_COLOR,
                              alignSelf: 'center',
                            }}
                            source={Images.CLOSE_ICON}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }
                }
              } else {
                return null;
              }
            })}
          </ScrollView>
        </View>
        <HelperText
          style={{marginBottom: 80}}
          type="error"
          visible={(item?.userErrorText?.length || 0) > 0}>
          {item.userErrorText}
        </HelperText>
      </InputScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          height: 70,
          width: '100%',
          flex: 1,
          backgroundColor: Colors.WHITE_COLOR,
        }}>
        <TouchableOpacity
          onPress={() => cancelAction()}
          style={{
            flex: 0.5,
            borderColor: Colors.LIGHT_SEPARATOR_COLOR,
            borderWidth: 1,
            justifyContent: 'center',
          }}>
          <Image
            style={{
              height: 18,
              width: 18,
              alignSelf: 'center',
              tintColor: Colors.SECONDARY_COLOR,
              resizeMode: 'contain',
            }}
            source={Images.CLOSE_ICON}
          />
          <Text
            style={{
              marginTop: 8,
              textAlign: 'center',
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 14,
              marginLeft: 16,
              marginRight: 16,
              color: Colors.SECONDARY_COLOR,
            }}>
            {t(Translations.CANCEL)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => yesAction()}
          style={{
            flex: 0.5,
            borderColor: Colors.LIGHT_SEPARATOR_COLOR,
            borderWidth: 1,
            justifyContent: 'center',
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              alignSelf: 'center',
              tintColor: Colors.PRIMARY_COLOR,
              resizeMode: 'contain',
            }}
            source={Images.SAVE_TICK_ICON}
          />
          <Text
            style={{
              marginTop: 8,
              textAlign: 'center',
              fontFamily: Fonts.Gibson_SemiBold,
              fontSize: 14,
              marginLeft: 16,
              marginRight: 16,
              color: Colors.PRIMARY_COLOR,
            }}>
            {t(Translations.YES)}
          </Text>
        </TouchableOpacity>
      </View>
      <AwesomeAlert
        show={showChangeAlert}
        showProgress={false}
        title={t(Translations.ALERT)}
        titleStyle={{
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
        }}
        message={t(Translations.NOTES_CAN_NOT_EMPTY)}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText={t(Translations.OK)}
        onCancelPressed={() => {
          setShowChangeAlert(false);
        }}
        cancelButtonStyle={{
          width: 100,
        }}
        cancelButtonColor={Colors.SECONDARY_COLOR}
        cancelButtonTextStyle={{
          color: Colors.WHITE_COLOR,
          fontFamily: Fonts.Gibson_SemiBold,
          textAlign: 'center',
        }}
        contentContainerStyle={{
          alignSelf: 'center',
          width: 300,
          height: 150,
        }}
        messageStyle={{
          textAlign: 'left',
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 15,
        }}
      />
      <AwesomeAlert
        show={showChangeServeAlert}
        showProgress={false}
        title={t(Translations.ALERT)}
        titleStyle={{
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
        }}
        message={t(Translations.PLEASE_SELECT_SERVED_DATE)}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText={t(Translations.OK)}
        onCancelPressed={() => {
          setShowChangeServeAlert(false);
          (false);
        }}
        cancelButtonStyle={{
          width: 100,
        }}
        cancelButtonColor={Colors.SECONDARY_COLOR}
        cancelButtonTextStyle={{
          color: Colors.WHITE_COLOR,
          fontFamily: Fonts.Gibson_SemiBold,
          textAlign: 'center',
        }}
        contentContainerStyle={{
          alignSelf: 'center',
          width: 300,
          height: 150,
        }}
        messageStyle={{
          textAlign: 'left',
          color: Colors.BLACK_COLOR,
          fontFamily: Fonts.Gibson_Regular,
          fontSize: 15,
        }}
      />
    </View>
  );
};
export default AddNotesPopupScreen;
