import { RouterProvider } from 'react-router-dom'
import './global.css'
import { router } from './routes'
import {Helmet,HelmetProvider} from 'react-helmet-async'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { ThemeProvider } from './components/theme/theme-provider'
import { useEffect } from 'react'
import { registerPushNotifications } from './hooks/usePushNotifications'
import { api } from './lib/axios'





export function App() {

  // Dentro do seu AuthContext ou App.tsx
useEffect(() => {
  const token = localStorage.getItem('@Liberal:token');
  
  if (token) {
     // Se ele já está logado, garante que o token do Firebase está atualizado no banco
     registerPushNotifications().then(fcmToken => {
       if (fcmToken) {
         api.patch('/users/fcm-token', { fcmToken });
       }
     });
  }
}, []);


  
  return(
    <HelmetProvider>
      <Helmet titleTemplate='%s | quintal.'/>
        <Toaster richColors/>
      <ThemeProvider storageKey="vite-ui-theme" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
           <RouterProvider router={router}/>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
  )

}


