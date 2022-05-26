import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import Rumi from '../../assets/Rumir.png';
import { kitty } from '../chatkitty';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';

export default function CreateChannelScreen({ navigation }) {
  const [channelName, setChannelName] = useState('');

  function handleButtonPress() {
    if (channelName.length > 0) {
      kitty
      .createChannel({
        type: 'PUBLIC',
        name: channelName,
      })
      .then(() => navigation.navigate('Chats'));
    }
  }

  return (
      <View style={styles.rootContainer}>
        <View style={styles.closeButtonContainer}>
          <IconButton
              icon="close-circle"
              size={36}
              color="#5b3a70"
              onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.innerContainer}>
          <Title style={styles.title}><Image source={Rumi} style={{width:50, height:50, resizeMode: 'contain',marginTop:-50, marginLeft: '-58%', marginRight: '20%'}}/>Crea un nuevo grupo</Title>
          <FormInput
              labelName="Nombre del grupo"
              value={channelName}
              onChangeText={(text) => setChannelName(text)}
              clearButtonMode="while-editing"
          />
          <FormButton
              title="Crear"
              modeValue="contained"
              labelStyle={styles.buttonLabel}
              onPress={() => handleButtonPress()}
              disabled={channelName.length === 0}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#2e64e515',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
});