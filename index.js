
/**
 * @format
 */
import './i18n';
import {AppRegistry, Platform,} from 'react-native';
import App from './App';
import firebase from '@react-native-firebase/app';
 import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import { setBackgroundMessageHandler } from './src/Utils/fcm';

if(Platform.OS=="android"){
  //AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => setBackgroundMessageHandler);

  AppRegistry.registerComponent("com.nanaudyog", () => App); 

}else{
  AppRegistry.registerComponent("NanaUdyog", () => App); 

}


//register it manually according to types registered in being ho