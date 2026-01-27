import { createBrowserRouter } from 'react-router-dom';
import { SignIn } from './auth/Sign-In';
import { SignUp } from './auth/Sign-up-cliente';
import { SignUpEmpresa } from './auth/Sign-up-cliente-empresa';
import { AppLayoutClients } from './pages/_layouts/app-clientes';
import { AuthLayout } from './pages/_layouts/auth';
import { Home } from './pages/app/dashboard-admin/sidebar/home';
// import { BuscarPrestadores } from './pages/Buscar/Buscar';
import { Profile } from './pages/profile';
// import { BoasVindas } from './pages/app/dashboard-admin/boas-vindas';
import { AppLayoutAdmin } from './pages/_layouts/app-admin';
import { AppLayoutPestadores } from './pages/_layouts/app-prestadores';
import { IdentidadeLayoutAdmin } from './pages/_layouts/indentida-visual';
import { BelezaModa } from './pages/app/dashboard-admin/sidebar/Categorias/BelezaModa';
import { Docencia } from './pages/app/dashboard-admin/sidebar/Categorias/Docencia';
import { Domestica } from './pages/app/dashboard-admin/sidebar/Categorias/domestica';
import { Electricidade } from './pages/app/dashboard-admin/sidebar/Categorias/Electricidade';
import { MaisProfissao } from './pages/app/dashboard-admin/sidebar/Categorias/MaisProfissao';
import { TecnologiaDesign } from './pages/app/dashboard-admin/sidebar/Categorias/TecnologiaDesign';
import { CommentsList } from './pages/app/dashboard-admin/sidebar/comentarios';
import { Config } from './pages/app/dashboard-admin/sidebar/config';
import { MadeiraOficios } from './pages/app/dashboard-admin/sidebar/FileInput/madeira';
import { NotificacoesMobileCostumer } from './pages/app/dashboard-admin/sidebar/Notification/todas-n-costumer';
import { NotificacoesMobile } from './pages/app/dashboard-admin/sidebar/Notification/todas-notificacoes';
import { SearchPedidos } from './pages/app/dashboard-admin/sidebar/SearchPedidos';
import { VerMapas } from './pages/app/dashboard-admin/sidebar/Ver-Mapas';
import { Indentitidade } from './pages/app/home-inicial/Indentidade';
import { Package } from './pages/app/Prestadores-dash/Pacotes';
import { PrestadoresPedidos } from './pages/app/Prestadores-dash/Pedidos-Prestadores';
import { PrestadoresDash } from './pages/app/Prestadores-dash/Prestadores-home';
import { ProfilePage } from './pages/app/Prestadores-dash/PrestadoresProfile';
import { Vitrine } from './pages/app/Prestadores-dash/Vitrine';
import { BuscarPrestadores } from './pages/Buscar/Buscar';
import { CostumerTableFilters } from './pages/dash-admin/Clients/clients';
import { PedidosFilters } from './pages/dash-admin/Clients/Pedidos';
import { Dashboard } from './pages/dash-admin/dasboard';
import { Notificacoes } from './pages/dash-admin/notificacoes';
import { PrestadoresTableFilters } from './pages/dash-admin/prestadores/prestadores';
import { LoadingPage } from './pages/Loading';
import { PaginaProfissoes } from './profissionals-page';
import { PrestadoreProfile } from './pages/app/dashboard-admin/sidebar/PrestadorProfile';
import { ConfigPrestadores } from './pages/app/Prestadores-dash/config-prestadores';
import { AreaEstatisticas } from './pages/app/Prestadores-dash/statisticas';
export const router = createBrowserRouter([
  {

  },
  {
    path: '/',
    element: <AppLayoutClients/>,
    children: [
      { path: '/', element: <Home/> },
      { path: '/favoritos', element: <BuscarPrestadores/> },  
      { path: '/categorias/:id/profissoes', element: <PaginaProfissoes /> }, // ROTA DINÂMICA
      { path: '/pedidos', element: <SearchPedidos/> },
      { path: '/madeira', element: <MadeiraOficios/> },
      { path: '/vitrine', element: <Vitrine/> },
      { path: '/comment', element: <CommentsList/> },
      { path: '/notif-costumer', element: <NotificacoesMobileCostumer/> },
      { path: '/users/:id/profile', element: <PrestadoreProfile /> }, // ROTA DINÂMICA
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
      {path: '/loading', element:<LoadingPage/> },
      { path: '/servicos', element: <PrestadoresDash/> },
      

      { path: '/notif-prestadores', element: <NotificacoesMobile/> },
      { path: '/config-prestadores', element: <ConfigPrestadores/> },
      { path: '/vitrine-prestadores', element: <Vitrine/> },
      { path: '/stats', element: <AreaEstatisticas/> },
      { path: '/prestadores-pedidos', element: <PrestadoresPedidos/> },
      { path: '/profile', element: <ProfilePage/> },
      { path: '/package', element: <Package/> },
      { path: '/mapas', element: <VerMapas/> },
    ],
  },

     {
    path: '/',
    element:<AppLayoutAdmin/>,
    children: [
      {path: '/loading', element:<LoadingPage/> },
      { path: '/Início', element: <Dashboard/> },
      { path: '/clientes', element: <CostumerTableFilters/> },
      { path: '/serviços', element: <PrestadoresTableFilters/> },
      { path: '/notif-admin', element: <Notificacoes/> },
      { path: '/admin-pedidos', element: <PedidosFilters/> },

    ],
  },
    {
    path: '/',
    element:<IdentidadeLayoutAdmin/>,
    children: [
      { path: '/home', element: <Indentitidade/> },
    ],
  },

]);

  