import { withInAppNotification } from '@chatkitty/react-native-in-app-notification';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useEffect } from 'react';
import { IconButton } from 'react-native-paper';
import { useContext } from 'react';
import { Text } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import { getChannelDisplayName, kitty } from '../chatkitty';
import BrowseChannelsScreen from '../screens/BrowseChannelsScreen';
import ChatScreen from '../screens/ChatScreen';
import CreateChannelScreen from '../screens/CreateChannelScreen';
import HomeScreen from '../screens/HomeScreen';
import AuthStack from './AuthStack';
export const ChatStack = createStackNavigator();
const Stack = createStackNavigator();

export default function HomeStack() {
  
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      kitty.updateCurrentUser((user) => {
        user.properties = {
          ...user.properties,
          'expo-push-token': token,
        };

        return user;
      });
    });
  }, []);

  return (
      <Stack.Navigator mode="modal" headerMode="none">
        <Stack.Screen
            name="ChatApp"
            component={ChatComponent}
        />
        <Stack.Screen name="CreateChannel" component={CreateChannelScreen} />
      </Stack.Navigator>
  );
}

function ChatComponent({ navigation, showNotification }) {
  useEffect(() => {
    return kitty.onNotificationReceived((notification) => {
      showNotification({
        title: notification.title,
        message: notification.body,
        onPress: () => {
          switch (notification.data.type) {
            case 'USER:SENT:MESSAGE':
            case 'SYSTEM:SENT:MESSAGE':
              kitty.getChannel(notification.data.channelId).then((result) => {
                navigation.navigate('Chat', { channel: result.channel });
              });
              break;
          }
        },
      });
    });
  }, [navigation, showNotification]);
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    
      <ChatStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#5b3a70',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 22,
            },
          }}
      >
        <ChatStack.Screen
            name="Tus chats"
            component={HomeScreen}
            options={(options) => ({
              headerRight: () => (
                  <><IconButton
                  icon="account-group"
                  size={28}
                  color="#ffffff"
                  onPress={() => options.navigation.navigate('Grupos')} /></>
              ),
            })}
        />
        <ChatStack.Screen
            name="Grupos"
            component={BrowseChannelsScreen}
            options={(options) => ({
              headerRight: () => (
                <><IconButton
                  icon="plus"
                  size={28}
                  color="#ffffff"
                  onPress={() => options.navigation.navigate('CreateChannel')} /></>
              ),
            })}
        />
        <ChatStack.Screen
            name="Chat"
            component={ChatScreen}
            options={({ route }) => ({
              title: getChannelDisplayName(route.params.channel, user.displayName),
            })}
        />
      </ChatStack.Navigator>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice && Platform.OS !== 'web') {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
