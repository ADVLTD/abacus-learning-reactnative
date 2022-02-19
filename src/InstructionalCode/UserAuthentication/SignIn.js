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
} from 'react-native';
import 'regenerator-runtime/runtime';
import {initContract} from '../../NearFunctions/initializeContract.js';

import {showMessage} from 'react-native-flash-message';
import {ColorDotsLoader} from 'react-native-indicator';
const axios = require('axios');



const SignIn = ({navigation, route}) => {
  //to store password
  const [passphrase, onPassPhraseChange] = React.useState('');
  //toggle loader
  const [loader, showLoader] = useState(false);

  //function called on passphrase change
  const onNearPassPhraseChange = async e => {
    onPassPhraseChange(e);
  };

  // function called when sign in button is clicked
  // calls the api to sign in with passphrase that user types in the text input
  const onSignInClick = () => {
    
    showLoader(true);
    axios
      // Get user details like public key,private key from api
      .post('http://localhost:3000/user_details', {
        seed_phrase: passphrase,
      })
      .then(async function (response) {
        // if api response is success, store details in device memory

        global.accountName = response.data.accountName;
        global.publicKey = response.data.publicKey;
        global.privateKey = response.data.privateKey;
        if (response.data.success) {
            // when api is successful reinitialize contract with new keys
          window.nearInitPromise = initContract(
            accountName,
            publicKey,
            privateKey,
          )
            .then(
              async ({contract, currentUser, nearConfig, walletConnection}) => {
                // After connection is established with near and wallet with new keys , we store the details in our state
            
                global.contractObject = contract;
                global.currentUserObject = currentUser;
                global.walletConnection = walletConnection;

                showLoader(false);
                // Navigate to video player
                navigation.navigate('Video Player');
              },
            )

            .catch(async error => {
              showLoader(false);
              // deleteAccount(accountName)

              showMessage({
                message: error.message,
                type: 'danger',
                statusBarHeight: 50,
              });
            });
        } else {
          showLoader(false);
          showMessage({
            message: 'No account found',
            type: 'danger',
            statusBarHeight: 50,
          });
        }
      })
      .catch(err => {
        // if api request fails show this error
        console.log(err);
        showLoader(false);
        showMessage({
          message: err.message,
          type: 'danger',
          statusBarHeight: 50,
        });
      });
  };

  return (
    <SafeAreaView style={{backgroundColor: '#25282A'}}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.nearLogo}
          source={require('../../assets/images/near_icon.png')}
        />
        <Text style={styles.header}>Sign In</Text>
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.inputLabel}>Account Details</Text>

        <TextInput
          style={[styles.input, {height: Platform.OS == 'android' ? 50 : 50}]}
          onChangeText={onNearPassPhraseChange}
          value={passphrase}
          editable={true}
          selectTextOnFocus={true}
          placeholder="Enter passphrase"
          placeholderTextColor="white"
        />

        <TouchableOpacity style={styles.button} onPress={onSignInClick}>
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

  signInCTA: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignIn;
