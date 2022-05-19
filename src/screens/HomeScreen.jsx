import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { Button, Dialog, Divider, List, Portal } from 'react-native-paper'; /* Add this */
import { getChannelDisplayName } from '../chatkitty';

import { kitty } from '../chatkitty';
import Loading from '../components/Loading';



export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  console.log(user.displayName);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveChannel, setLeaveChannel] = useState(null); 
  const isFocused = useIsFocused();

  function handleLeaveChannel() {
    kitty.leaveChannel({ channel: leaveChannel }).then(() => {
      setLeaveChannel(null);
  
      kitty.getChannels({ filter: { joined: true } }).then((result) => {
        setChannels(result.paginator.items);
      });
    });
  }
  
function handleDismissLeaveChannel() {
  setLeaveChannel(null);
}

  useEffect(() => {
    let isCancelled = false;

    kitty.getChannels({ filter: { joined: true } }).then((result) => {
      if (!isCancelled) {
        setChannels(result.paginator.items);

        if (loading) {
          setLoading(false);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [isFocused, loading]);

  if (loading) {
    return <Loading />;
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={channels}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item }) => (
                <List.Item
                    title={getChannelDisplayName(item, user.displayName)}
                    description={item.type}
                    titleNumberOfLines={1}
                    titleStyle={styles.listTitle}
                    descriptionStyle={styles.listDescription}
                    descriptionNumberOfLines={1}
                    onPress={() => navigation.navigate('Chat', { channel: item })}
                    onLongPress={() => { 
                     setLeaveChannel(item);
                   }}
                />
                
            )}
        />
        <Portal>
         <Dialog visible={leaveChannel} onDismiss={handleDismissLeaveChannel}>
           <Dialog.Title>Cerrar chat?</Dialog.Title>
           <Dialog.Actions>
             <Button onPress={handleDismissLeaveChannel}>Cancel</Button>
             <Button onPress={handleLeaveChannel}>Confirm</Button>
           </Dialog.Actions>
         </Dialog>
       </Portal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e64e515',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});