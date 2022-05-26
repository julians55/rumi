import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { ScrollView, View, Text, FlatList, Image, Button, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
Geocoder.init("API_KEY");

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
            neighborhood: places.neighborhood,
            rules: places.rules
          });
        });
        setPosts(myData);
        console.log("Bogota, "+myData[0].locality+", "+myData[0].neighborhood)

        Geocoder.from("Bogota, "+myData[0].locality+", "+myData[0].neighborhood)
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
  
  const Item = ({ title, cost, image, locality, neighborhood, description, rules}) => (
    
    <ScrollView contentContainerStyle={{alignItems:'center',}}style={{
      display: 'flex',
      
      marginBottom: 90,
      backgroundColor: '#D7CFFA',
      borderStyle: "solid",
      borderRadius: 6,
      marginLeft:'3.5%',
      marginTop: 10,
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
      height: 900
    
    }}>
      
      <Text style={styles.textUsTitle}>
        {title} 
      </Text>
      <Image source={{uri: image}} style={{width:'91%', height:200, marginTop:3}}/>
      <Text style={styles.textUsDescription}>
        {description}
      </Text>
      <MaterialCommunityIcons style={{marginTop:'25%'}}name={rules.smoke?'cigar':'cigar-off'} size={24} color="black" /><Text style={styles.textUsDescription}>{rules.smoke?'Se permite fumar':'No se permite fumar'}</Text>
      <MaterialCommunityIcons name={rules.pets?'paw':'paw-off'} size={24} color="black" /><Text style={styles.textUsDescription}>{rules.pets?'Se permiten mascotas':'No se permiten mascotas'}</Text>
      <MaterialCommunityIcons name={rules.schedule?'clock-time-ten':'timer-off'} size={24} color="black" /><Text style={styles.textUsDescription}>{rules.schedule?'Hay restriccion de horario':'No hay restriccion de horario'}</Text>
      <Text style={{fontWeight:"800", marginBottom: 10}}>Precio: {'$'+cost}</Text>
      <Text style={styles.textUs}>
        {neighborhood}, {locality} 
      </Text>
      <MapView style={{flex: 1,width:300, height: 200}} provider={PROVIDER_GOOGLE} region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta,
      }}>
        <Marker coordinate={{latitude: latitude, longitude: longitude,}}>
        <Image source={require('../../assets/Rumir.png')} style={{height: 85, width:85 }} />
        </Marker>
      </MapView>
      <TouchableOpacity style={{paddingTop:'1.5%', height: 30, marginTop: 10, marginBottom: 10, backgroundColor: "#8277A9", borderStyle: 'solid', borderRadius: 6,}} 
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
          
       <Text style={{color: "white"}}>  Ir a mensaje <Ionicons name="chatbubbles-outline" size={15} color="white" />  </Text>
      </TouchableOpacity>
      
    </ScrollView>
  );

 
  const renderItem = ({ item }) => (
    <Item title={item.title} cost={item.cost} image={item.image} locality={item.locality} neighborhood={item.neighborhood} description={item.description} userId={item.userId} rules={item.rules} />
  );

  return (
    <><Image source={Rumi} style={{width:150, height:75, resizeMode: 'contain',marginTop: 18,marginBottom: 17, marginLeft: '30%'}}/><View style={styles.postsContainer}>


   
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
    marginTop: '-8%',
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
    fontFamily: 'Pacifico',
    fontWeight: '1100',
    marginLeft:12,
    marginRight:12,
    marginBottom:5
  },
  textUsTitle:{
    marginTop: '0.4%',
    marginBottom: 5,
    fontFamily: 'PacificoBold',
    marginLeft:12,
    marginRight:12,
    fontSize: 17,
  },
  textUsDescription:{
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'Pacifico',
    marginLeft:12,
    marginRight:12,
    fontWeight: "600"
  },
  btnStyle: {
    color: '#2e64e515',
  }
});