import ChatKitty from 'chatkitty';
import { useContext } from 'react';

export const kitty = ChatKitty.getInstance('c348be22-00c8-48fa-8dce-98d1b6578830');

export function getChannelDisplayName(channel, otherId) {
  
  if (channel.type === 'DIRECT') {
    return channel.members.filter((member) => member.displayName != otherId).map((member) => member.displayName);
  } else {
    return channel.name;
  }
}