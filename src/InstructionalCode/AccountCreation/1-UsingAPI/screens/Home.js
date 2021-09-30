import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  LogBox,
} from 'react-native';
import 'regenerator-runtime/runtime';

import * as nearAPI from 'near-api-js';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {showMessage} from 'react-native-flash-message';
import {ColorDotsLoader} from 'react-native-indicator';
import Clipboard from '@react-native-clipboard/clipboard';
import {initContract} from '../../../../NearFunctions/initializeContract';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const {utils} = nearAPI;
const Stack = createNativeStackNavigator();
const axios = require('axios');

const Home = ({navigation, route}) => {
  //state to store account id values
  const [text, onChangeText] = React.useState('');
  // to toggle loader
  const [loader, showLoader] = useState(false);
  //to store passphrase
  const [passPhrase, setPassPhrase] = useState('');

  //As soon as component is mounted , clear password and account id
  useEffect(() => {
    onChangeText('');
  }, []);

  //Function to store account id on change
  const onNearAccountIdChange = e => {
    onChangeText(e);
  };

  //Function used to create a sub account
  const createAccount = async () => {
    //Star showing loading animation in loader
    showLoader(true);
    //Call to rest api server to create an account
    axios
      .post('http://localhost:3000/create_user', {
        //text is the name of account it stored in state
        name: text,
      })
      .then(async function (response) {
        //Set details received from api
        global.accountName = response.data.accountName;
        global.publicKey = response.data.publicKey;
        global.privateKey = response.data.privateKey;
        //set passphrase received from api in state
        setPassPhrase(response.data.passPhrase);
        // Show success message
        showMessage({
          message: 'Account successfully created',
          type: 'success',
          statusBarHeight: 50,
        });
        showLoader(false);
        //Initialize contract with details received from api
      })
      .catch(function (error) {
        console.log(error);
        //When there is error , stop loader
        showLoader(false);
        // clear account id
        onChangeText('');
        //clear password state

        // display error message to user
        showMessage({
          message: 'Error creating account',
          type: 'danger',
          statusBarHeight: 50,
        });
      });
  };

  //Function to initialize a contract with details of keys received from api
  //Initialized contract with keys
  const clearPassPhraseAndContinue = () => {
    //Initialize contract with details received from API
    window.nearInitPromise = initContract(accountName, publicKey, privateKey)
      .then(async ({contract, currentUser, nearConfig, walletConnection}) => {
        // After connection is established with near and wallet , we store the details in our state
        global.contractObject = contract;
        global.currentUserObject = currentUser;
        global.walletConnection = walletConnection;

        showLoader(false);
        //Clear passphrase and navigate to Home screen
        setPassPhrase('');
        navigation.navigate('Home');
      })

      .catch(async error => {
        showLoader(false);

        showMessage({
          message: error.message,
          type: 'danger',
          statusBarHeight: 50,
        });
      });
  };
  // Copies passphrase to clipboard
  const copyToClipboard = async () => {
    Clipboard.setString(passPhrase);
  };

  return (
    <SafeAreaView style={{backgroundColor: '#25282A'}}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.nearLogo}
          source={require('../../../../assets/images/near_icon.png')}
        />
        <Text style={styles.header}>Create Account</Text>
      </View>

      <View style={styles.settingsContainer}>
        {passPhrase ? (
          <View style={styles.passPhraseMainContainer}>
            <View style={styles.passPhraseContainer}>
              <View style={styles.passPhraseCopyImageContainer}>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Image
                    style={styles.passPhraseCopyImage}
                    source={require('../../../../assets/images/copy.png')}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.passPhraseText}>{passPhrase}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={clearPassPhraseAndContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.inputLabel}>Account Details</Text>
            <TextInput
              style={styles.input}
              onChangeText={e => onNearAccountIdChange(e)}
              value={text}
              placeholder="Enter account id"
              placeholderTextColor="white"
            />

            <TouchableOpacity style={styles.button} onPress={createAccount}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {loader ? (
              <View>
                <ColorDotsLoader
                  color1="#ffffff"
                  color2="#808080"
                  color3="#000000"
                  size={10}
                  color="white"
                />
              </View>
            ) : null}
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.signInText}>
                Already Have an account ?{' '}
                <Text style={styles.signInCTA}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height / 1.7,
    margin: 0,
    padding: 0,
  },
  nearLogo: {
    width: 80,
    height: 80,
    marginTop: 30,
  },
  header: {
    color: 'white',
    fontSize: 20,
  },
  headerContainer: {
    width: Dimensions.get('window').width,
    display: 'flex',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: 'white',
    marginTop: Dimensions.get('window').height / 6,
    alignSelf: 'flex-start',
    marginLeft: 65,
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    marginTop: 40,

    padding: 12,
    color: 'white',

    borderColor: 'white',
    borderWidth: 0.3,
    borderRadius: 8,
    width: 150,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
  },
  input: {
    height: 50,

    borderWidth: 0.3,
    borderColor: 'white',
    borderRadius: 4,
    padding: 10,
    width: Dimensions.get('window').width / 1.5,
    color: 'white',
    marginBottom: 10,
  },
  settingsContainer: {
    backgroundColor: '#25282A',
    minHeight: Dimensions.get('window').height,
    minWidth: Dimensions.get('window').width,
    display: 'flex',
    fontSize: 30,
    alignItems: 'center',
  },
  signInText: {
    color: 'white',

    marginTop: Dimensions.get('window').height / 5,
  },
  signInCTA: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  passPhraseContainer: {
    marginTop: Dimensions.get('window').height / 6,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 0.2,
    borderColor: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  passPhraseText: {
    color: 'white',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 70,
  },
  passPhraseMainContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  passPhraseCopyImage: {
    height: 20,
    width: 20,
    margin: 20,
  },
  passPhraseCopyImageContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
});

export default Home;
