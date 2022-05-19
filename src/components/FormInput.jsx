import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function FormInput({ labelName, ...rest }) {
  return (
      <TextInput
          label={labelName}
          style={styles.input}
          numberOfLines={1}
          {...rest}
      />
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
    marginBottom: 20,
    width: width / 1.5,
    height: height / 15,

  },
});