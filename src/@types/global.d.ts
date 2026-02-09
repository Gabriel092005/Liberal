import { Socket } from "socket.io-client";

// No arquivo: global.d.ts ou types.d.ts
export {};

declare global {
  interface Window {
    socket: Socket; // Você pode substituir 'any' pelo tipo real do seu socket, se souber
  }
}