import React, { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { View, Text, FlatList, Image } from "react-native";
import { StyleSheet } from "react-native";
import { Titles } from "../../styles/AddPost";
import Intl from "intl";
const PostDetails = (userId) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  });

  const getPosts = () => {
    firebase
      .firestore()
      .collection("posts")
      .get()
      .then((snapshot) => {
        let myData = [];
        snapshot.forEach((doc) => {
          const places = doc.data();
          myData.push({
            id: places.id,
            image: places.image,
            title: places.title,
            cost: places.cost,
          });
        });
        setPosts(myData);
      })
      .catch((error) => {
        console.log("Error getting data: ", error);
      });
  };

  const Item = ({ title, cost, image }) => (
    <View style={styles.bar}>
      <Image source={{uri: image}} style={{width:600, height:210, marginTop:10}}/>
      <Text style={styles.text}>
        {title} - {cost}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} cost={item.cost} image={item.image} />
  );

  return (
    <View style={styles.postsContainer}>
      <Text>{userId}</Text>
    </View>
  );
};

export default PostDetails;
const styles = StyleSheet.create({
  postsContainer: {
    backgroundColor: '#2e64e515',
    height: '100%',
  },
  bar: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7CFFA',
    borderStyle: "solid",
    borderRadius: 9,
    marginLeft:'5%',
    
    width:'90%',
  },
  text:{
    marginTop: 50,
  },
});