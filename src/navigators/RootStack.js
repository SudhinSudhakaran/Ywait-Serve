import React from 'react';
import {View,Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import SplashScreen from '../screens/splash/SplashScreen';
import BusinessSelectionScreen from '../screens/businessSelection/BusinessSelectionScreen';
import EmailLoginScreen from '../screens/login/emailLogin/EmailLoginScreen';
import PhoneLoginScreen from '../screens/login/phoneLogin/PhoneLoginScreen';
import EnterPinScreen from '../screens/pin/enterPin/EnterPinScreen';
import NewPinScreen from '../screens/pin/newPin/NewPinScreen';
import ConfirmPinScreen from '../screens/pin/confirmPin/ConfirmPinScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import DashboardLabelScreen from '../screens/dashboard/DashboardLabelScreen';
import ForgotPasswordScreen from '../screens/forgotPassword/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/forgotPassword/resetPassword/ResetPasswordScreen';
import ForgotPinScreen from '../screens/pin/forgotPin/ForgotPinScreen';
import UserProfileScreen from '../screens/profile/userProfile/UserProfile';
import UpdateProfileScreen from '../screens/profile/updateProfile/UpdateProfileScreen';
import ReportTabScreen from '../screens/reports/reportTabComponent/ReportTabScreen';
import PractoReportTab from '../screens/reports/reportTabComponent/PractoReportTab';
import ManageQueueScreen from '../screens/manageQueue/ManageQueueScreen';
import NewBookingCustomerListScreen from '../screens/newBookingCustomerList/NewBookingCustomerListScreen'
import ServiceListScreen from '../screens/serviceList/serviceListScreen'
import NotificationListScreen from '../screens/notifications/NotificationsListScreen'
import GenderSelectionScreen from '../screens/genderSelection/GenderSelectionScreen'
import AllServingUsersList from '../screens/allServingUsersList/AllServingUsersList'
import CustomerDetailsScreen from '../screens/customerDetails/CustomerDetailsScreen';
import AppointmentDetailsScreen from '../screens/appointmentDetails/AppointmentDetailsScreen';
import BookingQueueScreen from '../screens/bookingQueue/BookingQueueScreen';
import ManageQueueListTabScreen from '../screens/manageQueueListTab/manageQueueTab/ManageQueueListTabScreen'
import AddCustomerScreen from '../screens/addCustomer/AddCustomerScreen';
import AddVitalsScreen from '../screens/addVitalsPopup/AddVitalsScreen';
import ChangePasswordScreen from '../screens/profile/changePassword/ChangePasswordScreen';
import ChangeEmailScreen from '../screens/profile/changeEmail/ChangeEmailScreen';
import {navigationRef} from './RootNavigator'
import FilePreviewScreen from '../screens/shared/filePreviewScreen/FilePreviewScreen';
import LanguageListScreen from '../screens/languageList/LanguageListScreen';
import { Colors,Fonts } from '../constants';
const RootStack = () => {
 
  const Stack = createNativeStackNavigator();
//redux state for tabletview
const isTablet = useSelector((state)=>state.tablet.isTablet);
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: Colors.GREEN_COLOR}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: isTablet===true?16:12,
        marginTop: 5,
        textAlign: 'left',
      }}
      text2Style={{
        fontSize: isTablet===true?14:10,
        textAlign: 'left',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: Colors.ERROR_RED_COLOR}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: isTablet===true?16:12,
        marginTop: 5,
        textAlign: 'left',
      }}
      text2Style={{
        fontSize:isTablet===true?14: 10,
        textAlign: 'left',
      }}
    />
  ),
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  info: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#5ED4FF',width:'90%'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: isTablet===true?16:12,
        marginTop: 5,
        textAlign: 'left',
      }}
      text2Style={{
        fontSize: isTablet===true?14:10,
        textAlign: 'left',
      }}
    />
  ),

  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({text1, props}) => (
    <View
      style={{
        height: 50,
        width: '80%',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: 'white', textAlign: 'left'}}>{text1}</Text>
    </View>
  ),
};






  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen
          name="BusinessSelectionScreen"
          component={BusinessSelectionScreen}
        />
        <Stack.Screen name="EmailLoginScreen" component={EmailLoginScreen} />
        <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} />
        <Stack.Screen name="EnterPinScreen" component={EnterPinScreen} />
        <Stack.Screen name="NewPinScreen" component={NewPinScreen} />
        <Stack.Screen name="ConfirmPinScreen" component={ConfirmPinScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="DashboardLabelScreen" component={DashboardLabelScreen}/>
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
        <Stack.Screen name="ForgotPinScreen" component={ForgotPinScreen} />
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen
          name="UpdateProfileScreen"
          component={UpdateProfileScreen}
        />
        <Stack.Screen name="ReportTabScreen" component={ReportTabScreen} />
        <Stack.Screen name="PractoReportTab" component={PractoReportTab}/>
        <Stack.Screen name="ManageQueueScreen" component={ManageQueueScreen} />
        <Stack.Screen
          name="NewBookingCustomerListScreen"
          component={NewBookingCustomerListScreen}
        />
        <Stack.Screen name="ServiceListScreen" component={ServiceListScreen} />
        <Stack.Screen
          name="NotificationListScreen"
          component={NotificationListScreen}
        />
        <Stack.Screen
          name="GenderSelectionScreen"
          component={GenderSelectionScreen}
        />
        <Stack.Screen
          name="AllServingUsersList"
          component={AllServingUsersList}
        />
        <Stack.Screen
          name="CustomerDetailsScreen"
          component={CustomerDetailsScreen}
        />
        <Stack.Screen
          name="AppointmentDetailsScreen"
          component={AppointmentDetailsScreen}
        />
        <Stack.Screen
          name="BookingQueueScreen"
          component={BookingQueueScreen}
        />
        <Stack.Screen
          name="ManageQueueListTabScreen"
          component={ManageQueueListTabScreen}
        />
        <Stack.Screen name="AddCustomerScreen" component={AddCustomerScreen} />
        <Stack.Screen name="AddVitalsScreen" component={AddVitalsScreen} />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen name="ChangeEmailScreen" component={ChangeEmailScreen} />
        <Stack.Screen name="FilePreviewScreen" component={FilePreviewScreen} />
        <Stack.Screen
          name="LanguageListScreen"
          component={LanguageListScreen}
        />
      </Stack.Navigator>
      <Toast setRef={Toast.setRootRef} config={toastConfig} />
    </NavigationContainer>
  );
};

export default RootStack;
