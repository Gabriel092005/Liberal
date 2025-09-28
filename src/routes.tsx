import { createBrowserRouter } from 'react-router-dom';
import { AppLayoutAdmin } from './pages/_layouts/app';
import { Home} from './pages/app/dashboard-admin/sidebar/home';
import { SignIn } from './auth/Sign-In';
import { AuthLayout } from './pages/_layouts/auth';
import { SignUp } from './auth/Sign-up-cliente';
import { SignUpEmpresa } from './auth/Sign-up-cliente-empresa';
import { Pedidos } from './pages/app/dashboard-admin/sidebar/prestadores';
import { BuscarPrestadores } from './pages/Buscar/Buscar';
import { Profile } from './pages/profile';
import { BoasVindas } from './pages/app/dashboard-admin/boas-vindas';
import { Config } from './pages/app/dashboard-admin/sidebar/config';
import { MadeiraOficios } from './pages/app/dashboard-admin/sidebar/madeira';
import { Electricidade } from './pages/app/dashboard-admin/sidebar/Electricidade';
import { Domestica } from './pages/app/dashboard-admin/sidebar/domestica';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayoutAdmin />,
    children: [
      { path: '/', element: <Home/> },
      { path: '/pedidos', element: <Pedidos/> },
      { path: '/madeira', element: <MadeiraOficios/> },
      { path: '/electricidade', element: <Electricidade/> },
      { path: '/domestica', element: <Domestica/> },
      { path: '/pedidos', element: <Pedidos/> },
      { path: '/config', element:<Config/> },
      { path: '/me', element: <Profile/>},
    ],
  },
    {
    path: '/',
    element:<AuthLayout/>,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp/> },
      {path:'/empresa', element:<SignUpEmpresa/>}
    ],
  },

]);
