import { Home, MessageCircle, Bell, User, Briefcase, Users2, Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-black  md:hidden">
      <ul className="flex justify-around items-center h-14">
      <Link to='/'>
          <li className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-600">
          <Home className="w-6 h-6" />
          <span className="text-xs">Início</span>
        </li>
      </Link>
        <Link to='/pedidos'>
             <li className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400">
          <Heart className="w-6 h-6" />
          {/* <Briefcase className="w-6 h-6" /> */}
          <span className="text-xs">Favoritos</span>
        </li>
        </Link>
       <Link to='/prestadores'>
          <li className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400">
          <Search className="w-6 h-6" />
          <span className="text-xs">Buscar</span>
        </li>
       </Link>
       <Link  to='/me'>
         <li className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400">
          <User className="w-6 h-6" />
          <span className="text-xs">Perfil</span>
        </li>
       </Link>
      </ul>
    </nav>
  );
}
