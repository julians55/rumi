import React, {useState, useContext, useEffect} from 'react';
import RNPickerSelect from "react-native-picker-select";
import {
  ScrollView,
  Text,
  Platform,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Switch,
  View,
  Button
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Rumi from '../../assets/Rumir.png';
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
import { set } from 'react-native-reanimated';

const AddPostScreen = ({route, navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const {number} = route.params;
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [link, setLink]=useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState(null);
  const [cost, setCost] = useState(null);
  const [locality, setLocality] = useState(null);
  const [neighborhood, setNeighborhood] = useState(null);
  const [isEnabledPets, setIsEnabledPets] = useState(false);
  const toggleSwitchPets = () => setIsEnabledPets(previousState => !previousState);
  const [isEnabledSmoke, setIsEnabledSmoke] = useState(false);
  const toggleSwitchSmoke = () => setIsEnabledSmoke(previousState => !previousState);
  const [isEnabledSchedule, setIsEnabledSchedule] = useState(false);
  const toggleSwitchSchedule = () => setIsEnabledSchedule(previousState => !previousState);

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
  useEffect(() => {
    getPosts();
  }, []);
  const getPosts = async () => {
    await firebase
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
        console.log(myData);
        setImage(myData[0].image)
        setTitle(myData[0].title) 
        setCost(myData[0].cost)
        setPost(myData[0].description)
        setLocality(myData[0].locality)
        setNeighborhood(myData[0].neighborhood)
        setIsEnabledPets(myData[0].rules.pets)
        setIsEnabledSmoke(myData[0].rules.smoke)
        setIsEnabledSchedule(myData[0].rules.schedule)
  .catch(error => console.warn(error));
      })
      .catch((error) => {
        console.log("Error getting data: ", error);
      });
  };

 
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
        .firestore().collection('posts').doc(number)
        .update({
          userId: user.id,
          title: title,
          image: url,
          description: post,
          locality: locality,
          neighborhood: neighborhood,
          cost: cost,
          rules: {"pets": isEnabledPets, "smoke": isEnabledSmoke, "schedule": isEnabledSchedule}
        })
        .then(() => {
          console.log('Post Updated!');
          Alert.alert(
            'Publicacion actualizada!',
            'Tu publicacion fue exitosamente actualizada!',
          );
          
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
    setIsEnabledPets(false);
    setIsEnabledSchedule(false);
    setIsEnabledSmoke(false);
    
      navigation.goBack();
  }

  

  return (
    <>
    <View style={{marginTop:50}}>
    <Button title="Atras" color="#D24D30" onPress={() => {
      navigation.goBack();
    } } />
    </View>
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 30 }}>
        <InputWrapper style={{
          borderStyle: 'dotted',
          borderColor: 'green',
        }}>
          
          <Titles style={{ marginTop: '-5%' }}><Image source={Rumi} style={{ width: 65, height: 65, resizeMode: 'contain', marginTop: -50, marginLeft: '-78%', marginRight: '10%' }} />Actualiza tu publicacion!</Titles>

          <SubmitBtn2 onPress={pickImage}>
            <SubmitBtnText2>Actualizar Imagen</SubmitBtnText2>
          </SubmitBtn2>
          {image != null ? <AddImage source={{ uri: image }} style={{ width: 240, height: 190 }} /> : null}
          <InputField
            placeholder="Agrega un titulo"

            value={title}

            onChangeText={(content) => setTitle(content)} />
          <Icon
            name='chevron-down-outline'
            color='#000'
            size={14} />
          <InputField
            placeholder="Describe tu inmueble"
            multiline
            numberOfLines={4}
            value={post}
            onChangeText={(content) => setPost(content)} />
          <View style={styles.containerSwitch}>
            <Text>Se permiten mascotas</Text>
            <Text>NO<Switch
              trackColor={{ false: "#767577", true: "#8277A9" }}
              thumbColor={isEnabledPets ? "white" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchPets}
              value={isEnabledPets} />SI</Text>
            <Text style={{ marginTop: 15 }}>Se permite fumar</Text>
            <Text>NO<Switch
              trackColor={{ false: "#767577", true: "#8277A9" }}
              thumbColor={isEnabledSmoke ? "white" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchSmoke}
              value={isEnabledSmoke} />SI</Text>
            <Text style={{ marginTop: 15 }}>Sin restriccion de horario</Text>
            <Text>NO<Switch
              trackColor={{ false: "#767577", true: "#8277A9" }}
              thumbColor={isEnabledSchedule ? "white" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchSchedule}
              value={isEnabledSchedule} />SI</Text>
          </View>
          <Icon
            name='chevron-down-outline'
            color='#000'
            size={14} />
          <RNPickerSelect
            placeholder={{ label: locality, value: locality }}
            onValueChange={(locality) => setLocality(locality)}
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
            style={pickerSelectStyles} />
          <Icon
            name='chevron-down-outline'
            color='#000'
            size={14} />
          <InputField
            placeholder="Ingresa el barrio"
            value={neighborhood}
            onChangeText={(content) => setNeighborhood(content)} />
          <Icon
            name='chevron-down-outline'
            color='#000'
            size={14} />
          <InputField
            placeholder="Establece el costo"
            value={cost}
            onChangeText={(content) => setCost(content)} />
          <Icon
            name='remove-outline'
            color='#000'
            size={14} />
          {uploading ? (
            <StatusWrapper>
              <Text>{transferred} % Completed!</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </StatusWrapper>
          ) : (
            <SubmitBtn style={{ marginBottom: 10 }} onPress={submitPost}>
              <SubmitBtnText>Actualizar</SubmitBtnText>
            </SubmitBtn>
          )}
        </InputWrapper>

      </ScrollView></>

  );
};

export default AddPostScreen;
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
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,

  },
  containerSwitch: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center"
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