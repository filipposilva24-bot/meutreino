// ==========================================
// 1. IMPORTAÇÕES E CONFIGURAÇÃO DO FIREBASE
// ==========================================
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

// ==========================================
// 2. LÓGICA DE CACHE (FUNCIONAMENTO OFFLINE)
// ==========================================
const CACHE_NAME = 'diario-natural-v2';
const assetsToCache = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[sw.js] Fazendo cache dos arquivos para modo offline');
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos (importante para o Vercel)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[sw.js] Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta as requisições para funcionar sem internet
self.addEventListener('fetch', (event) => {
  // Ignora requisições do Firebase/Google e foca só no app
  if (event.request.url.includes('firestore') || event.request.url.includes('firebase') || event.request.url.includes('google')) {
      return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se tem no cache (offline), retorna. Se não, tenta baixar da internet.
      return response || fetch(event.request).catch(() => {
        // Se estiver offline e a requisição falhar, retorna o index.html por padrão
        return caches.match('./index.html');
      });
    })
  );
});
