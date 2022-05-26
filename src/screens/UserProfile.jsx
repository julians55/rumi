import React, { useState, useEffect, useContext } from "react";
import { firebase } from "../firebase";
import { View, Text, FlatList, Image, Button,TouchableOpacity, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { Titles } from "../../styles/AddPost";
import { AuthContext } from "../navigation/AuthProvider";
import Rumi from '../../assets/Rumir.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from "react-native-picker-select";

const UserProfile = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [locality, setLocality] = useState(null);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);

  const{user} = useContext(AuthContext);
  useEffect(() => {
    getPosts();
  }, [locality, min, max]);

  const Query = firebase.firestore().collection("posts").where("userId","!=",user.id)
  const userQuery = locality?firebase.firestore().collection("posts").where('locality','==',locality).where('userId',"!=",user.id):Query
  
  const getPosts = () => {
    const suscriber = userQuery
      .onSnapshot((snapshot) => {
        let myData = [];
        snapshot.forEach((doc) => {
          const places = doc.data();
          console.log(doc.id);
          myData.push({
            postId: doc.id,
            id: places.id,
            description: places.description,
            documentID: places.documentID,
            image: places.image,
            title: places.title,
            cost: places.cost,
            locality: places.locality,
            neighborhood: places.neighborhood,
          });
        });
        const B = myData.filter(function (element) {
          if(min&&!max){return element.cost > min}
          if(!min&&max){return element.cost < max}
          if(!min&&!max){return element.cost >0}
          if(min&&max){return element.cost > min && element.cost < max}
      });

        setPosts(B);
        
      })
      return() => suscriber()
      .catch((error) => {
        console.log("Error getting data: ", error);
      });
  };

  const Item = ({ title, cost, image, locality, neighborhood, postId  }) => (
    <View style={styles.bar}>
      <Text style={styles.textUsTitle}>
        {title}
      </Text>
      <Image source={{uri: image}} style={{width:'91%', height:200, marginTop:3}}/>
      <Text style={styles.textUsDescription}>
        {neighborhood}, {locality} - {'$'+cost}
      </Text>
      <TouchableOpacity style={{ height: 20, marginTop: 10, marginBottom: 10, backgroundColor: "#8277A9", borderStyle: 'solid', borderRadius: 6, }} 
      onPress={()=>navigation.navigate('Details',{number: postId})}>
       <Text style={{color: "white"}}> Detalles <Ionicons name="enter-outline" size={15} color="white" /> </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} cost={item.cost} image={item.image} locality={item.locality} neighborhood={item.neighborhood} postId={item.postId} description={item.post}/>
  );

  return (
    <><Titles style={styles.text}><Image source={Rumi} style={{width:80, height:80, resizeMode: 'contain',marginTop:-50, marginLeft: '-38%', marginRight: '20%'}}/>Hola de nuevo, {user.displayName}</Titles><View style={styles.postsContainer}>
      <View style={styles.filter}>
            <RNPickerSelect
                placeholder={{ label: "Todas las localidades", value: null, color:'black' }}
                onValueChange={(locality) =>{setRefreshData(true), setLocality(locality)}}
                items={[
                    { label: "Teusaquillo", value: "Teusaquillo" },
                    { label: "Rafael Uribe Uribe", value: "Rafael Uribe Uribe" },
                    { label: "Kennedy", value: "Kennedy" },
                    { label: "Usme", value: "Usme" },
                    { label: "Engativa", value: "Engativa" },
                    { label: "Fontibon", value: "Fontibon" },
                    { label: "Antonio Nariño", value: "Antonio Nariño" },
                    { label: "Chapinero", value: "Chapinero" },
                    { label: "Santa Fe", value: "Santa Fe" },
                    { label: "Puente Aranda", value: "Puente Aranda" },
                    { label: "Barrios Unidos", value: "Barrios Unidos" },
                    { label: "Suba", value: "Suba" },
                ]}
                style={pickerSelectStyles}
            />
            <View style={styles.filterSearch}>
              <Text style={{marginLeft:'20%', marginTop:-11, marginBottom:5}}>$ </Text>
            <TextInput placeholder="Precio Minimo" 
              style={{ marginRight:18, marginTop:-15, marginBottom:5}}
              value={min}
              onChangeText={(content) => {setMin(parseInt(content))}}
            />
            <Text style={{marginTop:-11, marginBottom:5}}>$ </Text>
            <TextInput placeholder="Precio Maximo" 
              style={{marginRight:'18%', marginTop:-15, marginBottom:5}}
              value={max}
              onChangeText={(content)=> { setMax(parseInt(content))}}
            />
            </View>
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} />
    </View></>
  );
};

export default UserProfile;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    alignItems: 'center',
    alignContent:'center',
    marginLeft:35,
    marginRight:35,
    marginTop:-5,
    fontSize: 24,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
const styles = StyleSheet.create({
  postsContainer: {
    backgroundColor: '#2e64e515',
    height: '87%',
    marginTop: '-8%',
  },
  filter:{
    grid: 1,
  },
  filterSearch:{
    display:'flex',
    flexDirection: 'row'

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
    marginTop: '0%',
    marginLeft:'-12%',
  
  },
  textUs:{
    marginTop: '0.4%',
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
    marginBottom: 1,
    fontSize:15,
    fontFamily: 'Pacifico',
    marginLeft:12,
    marginRight:12,
  },
  btnStyle: {
    color: '#2e64e515',
  }
});