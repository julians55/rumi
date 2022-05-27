import ChatKitty from 'chatkitty';
import { useContext } from 'react';

export const kitty = ChatKitty.getInstance('KEY');

export function getChannelDisplayName(channel, otherId) {
  
  if (channel.type === 'DIRECT') {
    return channel.members.filter((member) => member.displayName != otherId).map((member) => member.displayName);
  } else {
    return channel.name;
  }
}