import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Title } from 'react-native-paper';
import Rumi from '../../assets/Rumi.png';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import Loading from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  Geocoder.init("AIzaSyBOwM2XjFQrhLTyIUExPJRxJbxQ1y7Kfjk");
  const { login, loading } = useContext(AuthContext);
  Geocoder.from("Tunal Reservado")
		.then(json => {
			var location = json.results[0].geometry.location;
			console.log(location);
		})
		.catch(error => console.warn(error));

  if (loading) {
    return <Loading />;
  }

  return (
      <View style={styles.container}>
        
        <Title style={styles.titleText}>Bienvenido a </Title>
        <Image source={Rumi} style={{width:200, height:100, resizeMode: 'contain',marginTop: -24, marginLeft: -5}}/>
        <FormInput
            labelName="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={(userEmail) => setEmail(userEmail)}
        />
        <FormInput
            labelName="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(userPassword) => setPassword(userPassword)}
        />
        <FormButton
            title="Ingresar"
            modeValue="contained"
            labelStyle={styles.loginButtonLabel}
            onPress={() => {
              try{
                login(email, password)
              }catch{
                navigation.navigate('Signup')
              }
          }}
        />
        <FormButton
            title="Registrate!"
            modeValue="text"
            uppercase={false}
            labelStyle={styles.navButtonText}
            onPress={() => navigation.navigate('Signup')}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',


  },
  titleText: {
    fontSize: 18,
    marginBottom: 10,
  },
  loginButtonLabel: {
    fontSize: 17,
  },
  navButtonText: {
    fontSize: 14,
  },
});