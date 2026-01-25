// Configuração do Axios (exemplo)
import axios from 'axios';
import {  redirect } from 'react-router-dom';

export const api = axios.create({
  baseURL: 'https://liberalconnect.org/api',  
  // baseURL: 'http://localhost:3333',
  withCredentials: true
});

// Interceptor para adicionar o token
  // if)
api.interceptors.request.use(config => {
  const token = document.cookie
    .split(';')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

    if (token) {
      localStorage.setItem('@Liberal:token', token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Função utilitária para delay
// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// Interceptor de resposta com atraso artificial
api.interceptors.response.use(
  async response => {
    // ⏳ adiciona 1 segundo de atraso (1000ms)
        // await delay(5000);
    return response;
  },
  async error => {
    // também aplica delay em caso de erro (opcional)
    // await delay(20000);

    if(error){
            if (error.response.status===401) {
              redirect('/sign-in')
        
    }

    }



    return Promise.reject(error);
  }
);
