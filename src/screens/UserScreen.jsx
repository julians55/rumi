import React, { useContext, useState } from 'react';
import { StyleSheet, View , Button, FlatList, Image, Text, Alert} from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { firebase } from '../firebase';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import Loading from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import { Titles } from '../../styles/AddPost';
import { useEffect } from 'react';
import { kitty } from '../chatkitty';
import { NavigationRouteContext } from '@react-navigation/native';
export default function userScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const{user} = useContext(AuthContext);
  useEffect(() => {
    getPosts();
  }, [refreshData]);

  const getPosts = async () => {
    await firebase
      .firestore()
      .collection("posts").where("userId","==",user.id)
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
            postId: doc.id,
          });
        });
        setPosts(myData);
      })
      .catch((error) => {
        console.log("Error getting data: ", error);
      });
  };
const deletePost = async (id) =>{
  await firebase.firestore().collection("posts").where(firebase.firestore.FieldPath.documentId(),'==',id).get()
.then(querySnapshot => {
    querySnapshot.docs[0].ref.delete();
});
Alert.alert(
  'Publicacion eliminada',
  'Tu post fue exitosamente eliminado',
);
}
  const Item = ({ title, cost, postId }) => (
    <View style={styles.bar}>
      <Text style={styles.text}>
        {title} - {'$'+cost}
      </Text>
      <Button color={"#5b3a70"} title={"editar"} ></Button>
      <Button color={"#5b3a70"} title={"eliminar"} onPress={()=>deletePost(postId)}></Button>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} cost={item.cost} image={item.image} postId={item.postId} />
  );

  return (
    <><Titles style={styles.textUs}>Tus publicaciones</Titles><View style={styles.postsContainer}>

      <View style={styles.viewButtons}>
      <Button title="Recargar" onPress={() => setRefreshData(!refreshData)} />
      <Button title="cerrar sesion" onPress={() => kitty.endSession()} />
      </View>
      <View style={styles.bar}>

      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} />
    </View></>
  );
};
  
const styles = StyleSheet.create({
  postsContainer: {
    backgroundColor: '#2e64e515',
    height: '70%',
    marginTop: '-7%',

  },
  viewButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  bar: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7CFFA',
    borderStyle: "solid",
    marginLeft:'5%',
    
    width:'90%',
  },
  text:{
    marginTop: '1%',
  },
  textUs:{
    marginTop: '10%',
  }
});
  
  