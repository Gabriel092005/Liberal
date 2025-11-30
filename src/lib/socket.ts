import { io } from 'socket.io-client';

const URL = 'http://localhost:3333'; // URL do seu backend

export const socket = io(URL, {
  transports: ['websocket'],
  withCredentials: true,
});
