import React, { useEffect, useState } from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from 'react-native-geolocation-service';
import Config from 'react-native-config';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

function App(): React.JSX.Element {
  const [userInfo,setUserInfo] = useState(null);
  const [mLat, setMLat] = useState(0); //latitude position
  const [mLong, setMLong] = useState(0); //longitude position
  const [location, setLocation] = useState(null);

  async function onGoogleButtonPress() {
    try{
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    console.log('response',response);
    if(isSuccessResponse(response)){
      const {data} = response;
      const idToken = data?.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken!);
      return auth().signInWithCredential(googleCredential);
    }
    }catch(error){
      console.log(error);
    }
  }

  async function onLogoutPress(){
    auth()
    .signOut()
    .then(() => console.log('User signed out!'));
  }

  function onAuthStateChanged(user) {
    setUserInfo(user);
  }

  const requestLocationPermission = async () => {
    try {
      if(Platform.OS === 'android'){ // Android only
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'KangBakso App Location Permission',
          message:
            'KangBakso App needs access to your location' +
            'so you order the Bakso',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getLocation();
      } else {
        console.log('Location permission denied');
      }
    }else{
      console.log('here');
      const granted = await Geolocation.requestAuthorization('whenInUse');
      if (granted === 'granted') {
        console.log('You can use the location');
        getLocation();
      } else {
        console.log('Location permission denied');
      }
    }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setMLat(position.coords.latitude);
          setMLong(position.coords.longitude);
          console.log(position);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
      } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    requestLocationPermission();
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <SafeAreaView>
      {!userInfo && <Button title="Sign in" onPress={onGoogleButtonPress} />}

      {userInfo &&
      <View style={styles.main}>
        <Text>Hello World {userInfo.displayName}</Text>
        <View style={styles.mapContainer}>
        <MapView
        provider={PROVIDER_GOOGLE}
        // provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        region={{
          latitude: mLat,
          longitude: mLong,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        >
           <Marker
            coordinate={{latitude:mLat,longitude:mLong}}
            title={'here'}
            description={'im here'}
          />
          </MapView>
      <Button title="Sign Out" onPress={onLogoutPress} />
      <Button title="GetLocation" onPress={getLocation} />
      </View>
      </View>}
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  main:{
    display:'flex',
  },
  mapContainer:{
    width:'100%',
    height:'100%',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 800,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });
