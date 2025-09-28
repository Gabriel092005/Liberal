import { io } from 'socket.io-client';

const URL = 'https://quintal-backend-224.onrender.com'; // URL do seu backend

export const socket = io(URL, {
  transports: ['websocket'],
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});
