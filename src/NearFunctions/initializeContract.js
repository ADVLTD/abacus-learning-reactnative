import {connect, Contract, WalletConnection} from 'near-api-js';
const {keyStores, KeyPair, utils} = nearAPI;

import * as nearAPI from 'near-api-js';
import {LogBox} from 'react-native';
import getConfig from './config';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// Initialize contract & set global variables .
export async function initContract(accountName, publicKey, privateKey) {
  //get config details for testnet for given contract defined in the config.js file
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  // creating a inMemoryKey keystore
  const keyStore = new keyStores.InMemoryKeyStore();
  // format key
  const PRIVATE_KEY = privateKey.split(':')[1];
  // creates a public / private key pair using the provided private key
  const keyPair = KeyPair.fromString(PRIVATE_KEY);

  // // adds the keyPair you created to keyStore
  await keyStore.setKey('testnet', accountName, keyPair);

  // This is a key that stores the private key in storage
  const obj2Key = 'near-api-js:keystore:' + accountName + ':testnet';
  //Setting the public key in storage
  localStorage.setItem('undefined_wallet_auth_key', publicKey);
  //Setting private key in storage
  localStorage.setItem(obj2Key, privateKey);

  //Connect to near
  const config = {
    networkId: 'testnet',
    keyStore: keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  };
  const near = await connect(config);

  // // Wallet connection is created by using near connection already established

  const walletConnection = new nearAPI.WalletConnection(near);

  // Once we get the wallet details , we save the user details like account it and balance in currentUser object
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  //   // Initializing our contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      //send token is our contract change method that sends token
      changeMethods: ['saveUserSubAccounts', 'sendToken'],
      viewMethods: ['checkUserVideoWatchHistory'],
      //sender is required for signing in
      sender: walletConnection.account(),
    },
  );

  //     //Returns necessary details that will be used in App.js
  return {contract, currentUser, nearConfig, walletConnection};
}
