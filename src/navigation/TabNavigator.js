import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import AuthStack from "./AuthStack";

import PostStack from "./PostStack";
import UserProfile from "../screens/UserProfile";
import userScreen from "../screens/UserScreen";
import { Ionicons } from "@expo/vector-icons";
import AddPostScreen from "../screens/AddPostScreen";
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
<Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBarOptions={{
        activeTintColor: "#fff",
        activeBackgroundColor: "#5b3a70",
        inactiveTintColor: "#fff",
        inactiveBackgroundColor: "#8277A9"
      }}
    >      
    <Tab.Screen name="Inicio" component={PostStack} options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home-outline" size={size} color={color} />
          )
        }}/>
      <Tab.Screen name ="asdf" component={AddPostScreen}options={{
          title: "Publicacion",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-newspaper-outline" size={size} color={color} />
          )
        }}/>
      <Tab.Screen name="Chats" component={HomeStack} options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-chatbox-ellipses-outline" size={size} color={color} />
          )
        }}/>
        <Tab.Screen name="Perfil" component={userScreen} options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-happy-outline" size={size} color={color} />
          )
        }}/>
    </Tab.Navigator>
  );
}; 

export default BottomTabNavigator;