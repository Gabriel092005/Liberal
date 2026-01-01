importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyADdjOoKZuhzLFQiSXtYI6uEMw6naZGkhI",
  projectId: "liberal-c2c86",
  messagingSenderId: "754008588356",
  appId: "1:754008588356:web:308a616287ecd9116dbc11",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './apple-splash-2796-1290.jpg' // Certifique-se de ter um ícone aqui
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});