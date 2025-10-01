import { createBrowserRouter } from 'react-router-dom';
import { AppLayoutAdmin } from './pages/_layouts/app-clientes';
import { Home} from './pages/app/dashboard-admin/sidebar/home';
import { SignIn } from './auth/Sign-In';
import { AuthLayout } from './pages/_layouts/auth';
import { SignUp } from './auth/Sign-up-cliente';
import { SignUpEmpresa } from './auth/Sign-up-cliente-empresa';
// import { BuscarPrestadores } from './pages/Buscar/Buscar';
import { Profile } from './pages/profile';
// import { BoasVindas } from './pages/app/dashboard-admin/boas-vindas';
import { Config } from './pages/app/dashboard-admin/sidebar/config';
import { MadeiraOficios } from './pages/app/dashboard-admin/sidebar/FileInput/madeira';
import { Electricidade } from './pages/app/dashboard-admin/sidebar/Categorias/Electricidade';
import { Domestica } from './pages/app/dashboard-admin/sidebar/Categorias/domestica';
import { BelezaModa } from './pages/app/dashboard-admin/sidebar/Categorias/BelezaModa';
import { MaisProfissao } from './pages/app/dashboard-admin/sidebar/Categorias/MaisProfissao';
import { BuscarPrestadores } from './pages/Buscar/Buscar';
import { SearchPedidos } from './pages/app/dashboard-admin/sidebar/SearchPedidos';
import { TecnologiaDesign } from './pages/app/dashboard-admin/sidebar/Categorias/TecnologiaDesign';
import { Docencia } from './pages/app/dashboard-admin/sidebar/Categorias/Docencia';
import { IdentidadeLayoutAdmin } from './pages/_layouts/indentida-visual';
import { Indentitidade } from './pages/app/home-inicial/Indentidade';
import { AppLayoutPestadores } from './pages/_layouts/app-prestadores';
import { PrestadoresDash } from './pages/app/Prestadores-dash/Prestadores-home';
import { Package } from './pages/app/Prestadores-dash/Pacotes';
import { PrestadoresPedidos } from './pages/app/Prestadores-dash/Pedidos-Prestadores';
import { ProfilePage } from './pages/app/Prestadores-dash/PrestadoresProfile';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayoutAdmin />,
    children: [
      { path: '/', element: <Home/> },
      { path: '/prestadores', element: <BuscarPrestadores/> },  
      { path: '/pedidos', element: <SearchPedidos/> },
      { path: '/madeira', element: <MadeiraOficios/> },
      { path: '/ensino', element: <Docencia/> },
      { path: '/tecnologia', element: <TecnologiaDesign/> },
      { path: '/electricidade', element: <Electricidade/> },
      { path: '/domestica', element: <Domestica/> },
      { path: '/moda', element: <BelezaModa /> },
      { path: '/mais', element: <MaisProfissao /> },
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
    {
    path: '/',
    element:<AppLayoutPestadores/>,
    children: [
      // {path:'/', <PrestadoresLayout}
      { path: '/servicos', element: <PrestadoresDash/> },
      { path: '/prestadores-pedidos', element: <PrestadoresPedidos/> },
      { path: '/profile', element: <ProfilePage/> },
      { path: '/package', element: <Package/> },
    ],
  },
    {
    path: '/',
    element:<IdentidadeLayoutAdmin/>,
    children: [
      { path: '/home', element: <Indentitidade/> },
      { path: '/home', element: <Indentitidade/> },
    ],
  },

]);
