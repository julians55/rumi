import React, {useState, useContext, useEffect} from 'react';
import {
  ScrollView,
  Text,
  Platform,
  StyleSheet,
  Alert,
  Image,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import { firebase } from '../firebase/index';
import * as ImagePicker from "expo-image-picker";
import {
  InputField,
  Titles,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtn2,
  SubmitBtnText,
  SubmitBtnText2,
  StatusWrapper,
} from '../../styles/AddPost'

import { AuthContext } from '../navigation/AuthProvider';

const AddPostScreen = () => {
  const {user, logout} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [link, setLink]=useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState(null);
  const [cost, setCost] = useState(null);
  const [locality, setLocality] = useState(null);
  const [neighborhood, setNeighborhood] = useState(null);

  useEffect(() =>{
    (async()=>{
      if(Platform.OS != 'web'){
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted'){
          alert('f');
        }
      }
    })();
  },[]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [7,4],
      quality:1,
    });
    console.log(result.uri);
    if(!result.cancelled){
      setImage(result.uri);
    }
    
  };


  const submitPost = async () => {
    console.log('Post: ', post);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      }
      xhr.onerror = function() {
        reject(new TypeError('Network failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    })

    const ref = firebase.storage().ref().child(new Date().toISOString());
    const snapshot = ref.put(blob);
    
    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
      setUploading(true);
    },
    (error)=>{
      setUploading(false);
      console.log(error);
      blob.close();
      return; 
    },
    ()=>{
      snapshot.snapshot.ref.getDownloadURL().then((url)=>{
        setUploading(false);
        console.log(url);
        setLink(url);
        blob.close();
        return firebase
        .firestore()
        .collection('posts', ref => {return ref.orderBy('dateCreated', 'desc')})
        .add({
          userId: user.id,
          title: title,
          image: url,
          description: post,
          locality: locality,
          neighborhood: neighborhood,
          cost: cost,
        })
        .then(() => {
          console.log('Post Added!');
          Alert.alert(
            'Publicacion realizada!',
            'Tu inmueble fue exitosamente publicado!',
          );
          setPost(null);
          setImage(null);
          setCost(null);
          setTitle(null);
          setNeighborhood(null);
          setLocality(null);
        })
        .catch((error) => {
          console.log('Something went wrong with added post to firestore.', error);
        });;
      });
    }
    );
    setPost(null);
    setImage(null);
    setTitle(null);
    setCost(null);
    setNeighborhood(null);
    setLocality(null);
  }

  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 30 }}>
      
      <InputWrapper style={{    borderStyle: 'dotted',
    borderColor: 'green',}}>
      <Titles style={{marginTop:'9%'}}>A un paso de tu proximo Rumi!</Titles>

      <SubmitBtn2 onPress={pickImage}>
            <SubmitBtnText2>Agregar Imagen</SubmitBtnText2>
          </SubmitBtn2>
        {image != null ? <AddImage source={{uri: image}} style={{width:240, height:190}}/> : null}
        <InputField
          placeholder="Agrega un titulo"
          value={title}
          
          onChangeText={(content) => setTitle(content)}
        />
         <Icon
          name='chevron-down-outline'
          color='#000'
          size={14}
        />
        <InputField
          placeholder="Describe tu inmueble"
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={(content) => setPost(content)}
        />
        <Icon
          name='chevron-down-outline'
          color='#000'
          size={14}
        />
        <InputField
          placeholder="Ingresa la localidad"
          value={locality}
          onChangeText={(content) => setLocality(content)}
        />
        <Icon
          name='chevron-down-outline'
          color='#000'
          size={14}
        />
        <InputField
          placeholder="Ingresa el barrio"
          value={neighborhood}
          onChangeText={(content) => setNeighborhood(content)}
        />
        <Icon
          name='chevron-down-outline'
          color='#000'
          size={14}
        />
        <InputField
          placeholder="Establece el costo"
          value={cost}
          onChangeText={(content) => setCost(content)}
        />
        <Icon
          name='remove-outline'
          color='#000'
          size={14}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Publicar</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
      
    </ScrollView>

  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,

  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  image:{
    marginTop:60,
  }
});