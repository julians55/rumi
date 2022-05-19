import React from 'react';
import {decode, encode} from 'base-64'
import Providers from './src/navigation';
import { InAppNotificationProvider } from 'react-native-in-app-notification';
import { LogBox } from 'react-native';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }
LogBox.ignoreAllLogs();
export default function App() {
  return (
    <InAppNotificationProvider>
        <Providers />
    </InAppNotificationProvider>
  );
}