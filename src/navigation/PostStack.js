import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext  } from 'react';
import CreateChannelScreen from '../screens/CreateChannelScreen';
import UserProfile from '../screens/UserProfile';
import DetailedPost from '../screens/DetailedPost';
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
        component={UserProfile}
    />
    <Stack.Screen name="Details" component={DetailedPost} />
    <Stack.Screen
            name="Chat"
            component={ChatScreen}
            
            options={({ route }) => ({
              headerRight: () => (
                <><IconButton
                  icon="plus"
                  size={28}
                  color="black"
                  onPress={() => options.navigation.navigate('CreateChannel')} /></>
              ),
              title: getChannelDisplayName(route.params.channel, user.displayName),
            })}
        />
  </Stack.Navigator>
  );
}