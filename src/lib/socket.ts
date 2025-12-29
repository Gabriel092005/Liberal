import { io } from 'socket.io-client';

const URL = 'https://liberalconnect.org/api/'; // URL do seu backend

export const socket = io(URL, {
  transports: ['websocket'],
  withCredentials: true,
});
