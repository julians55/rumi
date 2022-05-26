import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext  } from 'react';
import CreateChannelScreen from '../screens/CreateChannelScreen';
import UserScreen from '../screens/UserScreen';
import EditPostScreen from '../screens/EditPostScreen';
import HomeStack from './HomeStack';
import { getChannelDisplayName, kitty } from '../chatkitty';
import ChatScreen from '../screens/ChatScreen';
import { AuthContext } from './AuthProvider';
import PostDetails
 from '../screens/PostDetails';
const Stack = createStackNavigator();

export default function PostStack() {
  const {user} = useContext(AuthContext);
  return (
    <Stack.Navigator mode="modal" headerMode="none">
    <Stack.Screen
        name="Posts"
        component={UserScreen}
    />
    <Stack.Screen name="Details" component={EditPostScreen} />
  </Stack.Navigator>
  );
}