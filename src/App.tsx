import { RouterProvider } from 'react-router-dom'
import './global.css'
import { router } from './routes'
import {Helmet,HelmetProvider} from 'react-helmet-async'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { ThemeProvider } from './components/theme/theme-provider'
import { useEffect } from 'react'
import { api } from './lib/axios'
import { socket } from './lib/socket'





export function App() {


   socket.on("order_call", (data) => {
      console.log("📦 Nova ordem recebida:", data);
      // Aqui você pode disparar um evento global ou atualizar um store (Redux/Zustand)
    });
  


// Função auxiliar necessária para o Chrome/Edge converter a VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}





const registerPush = async () => {
    try {
      console.log("Iniciando processo de registro..."); // Log de teste

      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn("Push não suportado neste navegador.");
        return;
      }

      const permission = await Notification.requestPermission();
if (permission !== 'granted') {
  console.error("Permissão de notificação negada pelo usuário.");
  return;
}

      // IMPORTANTE: Remova a linha "registerPush()" que estava aqui dentro, 
      // pois ela causava um erro de recursão infinita.

      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log("Service Worker registrado com sucesso:", registration);

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const { data } = await api.get('push/public_key');
        const convertedVapidKey = urlBase64ToUint8Array(data.publickey);

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
        console.log("Nova subscrição criada:", subscription);
      }

      await api.post("/push/register", { subscription });
      console.log("Subscrição sincronizada com o backend.");

    } catch (error) {
      console.error("Erro ao configurar Push:", error);
    }
  };

  // 2. DISPARAR A FUNÇÃO
  useEffect(() => {
    registerPush();
  }, []); // Executa apenas uma vez ao carregar o App

// Chame a função em um useEffect ou após o login

  return(
    <HelmetProvider>
      <Helmet titleTemplate='%s | Liberal.'/>
        <Toaster richColors/>
      <ThemeProvider storageKey="vite-ui-theme" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
           <RouterProvider router={router}/>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
  )

}


