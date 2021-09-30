/**
 * @format
 */
 import {Buffer} from 'buffer';
 global.Buffer = Buffer;
 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 
 //Initializing localStorage in react native window
 let localStorageData = {};
 window.localStorage = {
   getItem: key => localStorageData[key],
  
   removeItem: key => localStorageData[key],
   setItem: (key, value) => {
     localStorageData[key] = value;
   },
   clear: () => {
     localStorageData = {};
   },
 };
 
 window.location = {...window.location, href: ''};
 AppRegistry.registerComponent(appName, () => App);
 