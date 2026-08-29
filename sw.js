// Service Worker para lidar com Push Notifications do Firebase
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: ["AIzaSy", "A_oYOr2t7", "LoRqOKu", "PLuQxWfd_4lDi3Jec"].join(""),
  authDomain: "diario-natural-push.firebaseapp.com",
  projectId: "diario-natural-push",
  storageBucket: "diario-natural-push.firebasestorage.app",
  messagingSenderId: "629001525446",
  appId: "1:629001525446:web:24fe67c300957c36979fc7",
  measurementId: "G-7MDYWKZLYT"
});

const messaging = firebase.messaging();

// Ouve as mensagens em background do Firebase
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Mensagem em background recebida: ', payload);
  const notificationTitle = payload.notification.title || '⏰ Descanso Finalizado!';
  const notificationOptions = {
    body: payload.notification.body || 'Hora de voltar para o treino!',
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="%233b82f6"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
