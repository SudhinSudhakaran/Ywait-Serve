import * as React from 'react';
import {useEffect} from 'react';
import RootStack from './src/navigators/RootStack';
import {LogBox} from 'react-native';
import i18next from 'i18next';
import './src/i18n/i18n';
import {Globals} from './src/constants';
import StorageManager from './src/helpers/storageManager/StorageManager';
import * as RNLocalize from 'react-native-localize';
import {Provider} from 'react-redux';
import store from './src/redux/store/store';

const getLanguage = async () => {
  Globals.DEVICE_LANGUAGE = RNLocalize.getLocales()[0].languageCode;
  const selectedLanguage = await StorageManager.getSavedLanguage();

  Globals.SELECTED_LANGUAGE = selectedLanguage;
  Globals.IS_LANGUAGE_CHANGED =
    (await StorageManager.getSavedLanguageChanged()) === 'CHANGED'
      ? true
      : false;
  console.log('Globals.SELECTED_LANGUAGE in app.js', Globals.SELECTED_LANGUAGE);
  if (Globals.SELECTED_LANGUAGE !== null) {
    if (Globals.SELECTED_LANGUAGE === 'ar') {
      i18next.changeLanguage('ar').then(t => {});
    } else {
      i18next.changeLanguage('en').then(t => {});
    }
  } else {
    Globals.SELECTED_LANGUAGE = 'en';
  }
};
const App = () => {
  LogBox.ignoreLogs(['EventEmitter.removeListener']);
  useEffect(() => {
    getLanguage().then(res => {});
  }, []);
  return (
    // provide is used to pass the store to all component
    //  store is a location that state can store globally
    <Provider store={store}>
      <RootStack />
    </Provider>
  );
};

export default App;
