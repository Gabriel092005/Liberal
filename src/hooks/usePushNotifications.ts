import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { api } from "@/lib/axios";

export async function registerPushNotifications() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { 
        vapidKey: "BKkx2Rgqfa4lLbFfkImVR2tougXlJ1t8l5putz64U00F6gTUTs2n7pM5h-dFIsfPk8z5eaMF6Eo-1m9cr5tLlHs" 
      });
      console.log("token Push:", token)

      if (token) {
        await api.patch("/users/fcm-token", { fcmToken: token });
        return token 
      }
      return null;
    }
  } catch (err) {
    console.error("Erro ao registrar push:", err);
  }
}