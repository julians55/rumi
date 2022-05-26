import React, {useState}from 'react';
import {decode, encode} from 'base-64'
import Providers from './src/navigation';
import { InAppNotificationProvider } from 'react-native-in-app-notification';
import { LogBox } from 'react-native';
import useFonts from './styles/useFonts';
import AppLoading from 'expo-app-loading';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
LogBox.ignoreAllLogs();


export default function App() {
  const [IsReady, SetIsReady] = useState(false);

  const LoadFonts = async () => {
    await useFonts();
  };

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={() => SetIsReady(true)}
        onError={() => {}}
      />
    );
  }
 

    return(
      <InAppNotificationProvider>
          <Providers />
      </InAppNotificationProvider>
    )
  }
  
