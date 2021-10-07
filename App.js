import React, {useState, useEffect} from 'react';
import {View, LogBox} from 'react-native';
import 'regenerator-runtime/runtime';

import * as nearAPI from 'near-api-js';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import FlashMessage from 'react-native-flash-message';

import Home from './src/InstructionalCode/AccountCreation/1-UsingAPI/screens/Home';
import SignIn from './src/InstructionalCode/UserAuthentication/SignIn';
import VideoPlayer from './src/InstructionalCode/SendMoney/VideoPlayer';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const {utils} = nearAPI;
const Stack = createNativeStackNavigator();
const axios = require('axios');

const App = () => {
  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Video Player" component={VideoPlayer} />
          
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" />
    </View>
  );
};

export default App;
