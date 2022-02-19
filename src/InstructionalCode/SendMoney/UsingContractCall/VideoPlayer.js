import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import * as nearAPI from 'near-api-js';

import {showMessage} from 'react-native-flash-message';

const {utils} = nearAPI;

export default function VideoPlayer({navigation}) {

  //Function to receive tokens when video played has ended
  const receiveTokens = async videoNumber => {
    try {
        // checkUserVideoWatchHistory is a view contract method defined in contract that checks whether a user has watched a video
      const result = await contractObject.checkUserVideoWatchHistory({
        mainAccount: accountName,
        videoId: videoNumber,
      });
      // if result is false i.e user has not watched video
      if (!result) {
        // send token is a change method defined in contract method
        // sends token to the wallet address in params with the given near amount
        await contractObject.sendToken({
          yoctonearAsU128: utils.format.parseNearAmount('1'),
          walletAddress: currentUserObject.accountId,
        });
        // saveUserVideoDetails saves users video id so that reward is not given again.
        // it is a change contract method call
        await contractObject.saveUserVideoDetails({
          mainAccount: accountName,
          videoId: videoNumber,
        });
        //show success message
        showMessage({
          message: 'Successfully sent tokens',
          type: 'success',
          statusBarHeight: 50,
        });
      } else {
        //show success message
        showMessage({
          message: 'Video reward already given',
          type: 'success',
          statusBarHeight: 50,
        });
      }
    } catch (err) {
      //show failed message if token couldn't be sent
      console.log(err.message);
      showMessage({
        message: "Couldn't send tokens",
        type: 'danger',
        statusBarHeight: 50,
      });
    }
  };

  //function called when sign out icon is clicked
  const onSignOutButtonClick = () => {
   //Clear keys and account details stored in local storage
    localStorage.clear();

    // navigate to Home screen
    navigation.navigate('Home');
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.topBar}>
        <Text style={styles.topText}>Near Learning App</Text>

        <View style={styles.rightIconContainer}>
          <TouchableOpacity
            onPress={() => {
              onSignOutButtonClick();
            }}>
            <Image
              style={styles.topBarIcons}
              source={require('../../../assets/images/logout.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image
              style={styles.topBarIcons}
              source={require('../../../assets/images/gear.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.videoPlayerContainer}>
          <View style={styles.videoMaiContainer}>
            <View style={styles.videoContainer}>
              <Video
                source={{
                  uri: 'https://cdn.videvo.net/videvo_files/video/free/2016-04/large_watermarked/Audio_bands_Feed_preview.mp4',
                }}
                style={styles.backgroundVideo}
                controls={true}
                paused={true}
                //on End function is called when video is finished
                onEnd={() => receiveTokens('11')}
              />
            </View>
            <Text style={styles.videoText}>Near Video 1</Text>
          </View>
          <View style={styles.videoMaiContainer}>
            <View style={styles.videoContainer}>
              <Video
                source={{
                  uri: 'https://cdn.videvo.net/videvo_files/video/free/2016-04/large_watermarked/Audio_bands_Feed_preview.mp4',
                }}
                style={styles.backgroundVideo}
                controls={true}
                paused={true}
                onEnd={() => receiveTokens('12')}
              />
            </View>
            <Text style={styles.videoText}>Near Video 2</Text>
          </View>
          <View style={styles.videoMaiContainer}>
            <View style={styles.videoContainer}>
              <Video
                source={{
                  uri: 'https://cdn.videvo.net/videvo_files/video/free/2016-04/large_watermarked/Audio_bands_Feed_preview.mp4',
                }} // Can be a URL or a local file.
                style={styles.backgroundVideo}
                controls={true}
                paused={true}
                onEnd={() => receiveTokens('13')}
              />
            </View>
            <Text style={styles.videoText}>Near Video 3</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  videoPlayerContainer: {
    backgroundColor: '#25282A',
    minHeight: Dimensions.get('window').height,
  },
  topText: {
    color: 'white',
    fontSize: 20,
  },
  topBar: {
    alignSelf: 'stretch',
    height: 52,
    flexDirection: 'row',
    backgroundColor: '#25282A',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: '#888',
    borderBottomWidth: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 20,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 8,
  },
  videoContainer: {
    height: Dimensions.get('window').height / 3,
    margin: 10,
    marginTop: 0,
  },
  videoText: {
    fontSize: 18,

    marginLeft: 15,
    color: 'white',
    marginTop: 10,
    marginBottom: 15,
  },
  videoMaiContainer: {
    margin: 5,
    borderBottomColor: '#888',
    borderBottomWidth: 1,
  },
  topBarIcons: {height: 20, width: 20, marginLeft: 10, resizeMode: 'cover'},
  rightIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
});
