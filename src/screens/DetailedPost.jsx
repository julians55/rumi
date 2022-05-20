import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { View, Text, FlatList, Image, Button, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Titles } from "../../styles/AddPost";
import Intl from "intl";
import Routes from "../navigation/Routes";
import ChatScreen from "./ChatScreen";
import HomeStack from "../navigation/HomeStack";
import { ChatStack } from "../navigation/HomeStack";
import Rumi from '../../assets/Rumi.png'
import Geocoder from 'react-native-geocoding';
import MapView, { Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { kitty } from "../chatkitty";
const DetailedPost = ({route ,navigation}) => {
const {number} = route.params;
const [latitude, setLatitud] = useState(0);
const [longitude, setLongitude] = useState(0);

const latDelta = 0.0222;
const lonDelta = 0.021;
Geocoder.init("AIzaSyBOwM2XjFQrhLTyIUExPJRxJbxQ1y7Kfjk");

const [posts, setPosts] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  useEffect(() => {
    getPosts();
  }, [refreshData]);

  const getPosts = () => {
    firebase
      .firestore()
      .collection('posts')
      .where(firebase.firestore.FieldPath.documentId(),'==',number)
      .get()
      .then((snapshot) => {
        let myData = [];
        snapshot.forEach((doc) => {
          const places = doc.data();
  
          myData.push({
            id: places.id,
            userId: places.userId,
            image: places.image,
            title: places.title,
            description: places.description,
            cost: places.cost,
            locality: places.locality,
            neighborhood: places.neighborhood
          });
        });
        setPosts(myData);
        console.log(myData);
        Geocoder.from(myData[0].locality)
  .then(json => {
    var location = json.results[0].geometry.location;
    console.log(location);
    setLatitud(location.lat);
    setLongitude(location.lng);
    console.log(latitude);
  })
  .catch(error => console.warn(error));
      })
      .catch((error) => {
        console.log("Error getting data: ", error);
      });
  };
  
  const Item = ({ title, cost, image, locality, neighborhood, description, userId}) => (
    
    <View style={{
      display: 'flex',
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#D7CFFA',
      borderStyle: "solid",
      borderRadius: 6,
      marginLeft:'3.5%',
      marginTop: 20,
      shadowRadius:0.2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.7,
      shadowRadius: 3.84,
  
      elevation: 5,
      width:'93%',
      height: 500
    
    }}>
      <MapView style={{flex: 1,width:300, height: 300}} provider={PROVIDER_GOOGLE} region={{
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    }}>
          <Marker coordinate={{latitude: latitude, longitude: longitude,}}>

          </Marker>
        </MapView>
      <Text style={styles.textUs}>
        {title}
      </Text>
      <Image source={{uri: image}} style={{width:'91%', height:260, marginTop:3}}/>
      <Text style={styles.textUs}>
        {description}
      </Text>
      <Text style={styles.textUs}>
        {neighborhood}, {locality} - {'$'+cost}
      </Text>
      <TouchableOpacity style={{ height: 20, marginTop: 10 }} 
      onPress={()=>{
        kitty
        .createChannel({
          type: 'DIRECT',
          members: [{ id: posts[0].userId} ],
        })
        .then((result) => {
          navigation.navigate('Chat', { channel: result.channel });
        });
        }}>
       <Text>Ir a mensaje</Text>
      </TouchableOpacity>
    </View>
  );

 
  const renderItem = ({ item }) => (
    <Item title={item.title} cost={item.cost} image={item.image} locality={item.locality} neighborhood={item.neighborhood} description={item.description} userId={item.userId} />
  );

  return (
    <><Image source={Rumi} style={{width:150, height:75, resizeMode: 'contain',marginTop: 7,marginBottom: 17, marginLeft: '29%'}}/><View style={styles.postsContainer}>


   
      <Button title="Atras" color="#D24D30" onPress={() => {
          navigation.goBack();
        }}/>
      
      
   
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} />
    </View></>
  );
};

export default DetailedPost;
const styles = StyleSheet.create({
  postsContainer: {
    backgroundColor: '#2e64e515',
    height: '100%',
    marginTop: '-7%',
  },
  bar: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7CFFA',
    borderStyle: "solid",
    borderRadius: 6,
    marginLeft:'3.5%',
 
    shadowRadius:0.2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.7,
    shadowRadius: 3.84,

    elevation: 5,
    width:'93%',
  },
  barUs:{
    display: 'flex',
    flexDirection: 'row'
  },
  text:{
    marginTop: '10%',
  },
  textUs:{
    marginTop: '0.4%',
  },
  btnStyle: {
    color: '#2e64e515',
  }
});