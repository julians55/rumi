import React, { useState, useEffect, useContext } from "react";
import { firebase } from "../firebase";
import { View, Text, FlatList, Image, Button,TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Titles } from "../../styles/AddPost";
import { AuthContext } from "../navigation/AuthProvider";
import PostDetails from "./PostDetails";
import { NavigationContainer } from "@react-navigation/native";
import { kitty } from "../chatkitty";
const UserProfile = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const{user} = useContext(AuthContext);
  useEffect(() => {
    getPosts();
  }, [refreshData]);
  
  const getPosts = () => {
    firebase
      .firestore()
      .collection("posts").where("userId","!=",user.id)
      .get()
      .then((snapshot) => {
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
        setPosts(myData);
        console.log(myData);
      })
      .catch((error) => {
        console.log("Error getting data: ", error);
      });
  };

const deletePost = () => {
  
}

  const Item = ({ title, cost, image, locality, neighborhood, postId  }) => (
    <View style={styles.bar}>
      <Text style={styles.textUs}>
        {title}
      </Text>
      <Image source={{uri: image}} style={{width:'91%', height:200, marginTop:3}}/>
      <Text style={styles.textUs}>
        {neighborhood}, {locality} - {'$'+cost}
      </Text>
      <TouchableOpacity style={{ height: 20, marginTop: 10 }} 
      onPress={()=>navigation.navigate('Details',{number: postId})}>
       <Text>Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} cost={item.cost} image={item.image} locality={item.locality} neighborhood={item.neighborhood} postId={item.postId} description={item.post}/>
  );

  return (
    <><Titles style={styles.text}>Hola de nuevo, {user.displayName}</Titles><View style={styles.postsContainer}>

    
   
      <Button title="Recargar" color="#D24D30" onPress={() => setRefreshData(!refreshData)} />
      <View style={styles.bar}>
    
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} />
    </View></>
  );
};

export default UserProfile;
const styles = StyleSheet.create({
  postsContainer: {
    backgroundColor: '#2e64e515',
    height: '90%',
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