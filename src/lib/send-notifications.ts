// import { getToken } from "firebase/messaging";

// import { api } from "@/lib/axios";
// import {messaging } from "./firebase";

// async function salvarTokenNoServidor() {
//   try {
//     // 1. Solicita o Token ao Firebase
//     const token = await getToken(messaging, {
//       vapidKey: "BKkx2Rgqfa4lLbFfkImVR2tougXlJ1t8l5putz64U00F6gTUTs2n7pM5h-dFIsfPk8z5eaMF6Eo-1m9cr5tLlHs" 
//     });

//     if (token) {
//       // 2. Acessa a rota PATCH que você criou
//       // O JWT deve ir automaticamente se o seu axios estiver configurado
//       await api.patch("/users/fcm-token", {
//         fcmToken: token
//       });
      
//       console.log("Token atualizado no servidor com sucesso!");
//     }
//   } catch (error) {
//     console.error("Erro ao registrar token:", error);
//   }
// }