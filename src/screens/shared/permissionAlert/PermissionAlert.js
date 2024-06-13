import {StyleSheet, Text, View, Linking, I18nManager} from 'react-native';
import React from 'react';

import AwesomeAlert from 'react-native-awesome-alerts';
import {Colors, Translations, Fonts, Images} from '../../../constants';
import {t} from 'i18next';
const PermissionAlert = ({
  showPermissionAlert,
  permissionTitle,
  setShowPermissionAlert,
}) => {
  const openSettings = () => {
    setShowPermissionAlert(false);
    Linking.openSettings();
  };
  return (
    <AwesomeAlert
      show={showPermissionAlert}
      showProgress={false}
      title={t(Translations.ENABLE_PERMISSION)}
      titleStyle={{
        color: Colors.BLACK_COLOR,
        fontFamily: Fonts.Gibson_Regular,
      }}
      message={permissionTitle}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      animatedValue={0.8}
      cancelText={t(Translations.CANCEL)}
      confirmText={t(Translations.OPEN_SETTINGS)}
      confirmButtonColor={Colors.PRIMARY_COLOR}
      cancelButtonColor={Colors.SECONDARY_COLOR}
      onCancelPressed={() => {
        setShowPermissionAlert(false);
      }}
      onConfirmPressed={() => {
        openSettings();
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
      }}
      confirmButtonTextStyle={{
        color: Colors.WHITE_COLOR,
        fontFamily: Fonts.Gibson_SemiBold,
      }}
      messageStyle={{
        textAlign: 'center',
        color: Colors.BLACK_COLOR,
        fontFamily: Fonts.Gibson_Regular,
        fontSize: 15,
      }}
    />
  );
};

export default PermissionAlert;

const styles = StyleSheet.create({});
