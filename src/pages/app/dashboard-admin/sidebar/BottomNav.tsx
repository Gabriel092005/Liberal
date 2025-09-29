import { Home, User, Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50  bg-white dark:bg-black md:hidden shadow-t">
      <ul className="flex justify-around items-center h-14">
        <li>
          <Link
            to="/"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Início</span>
          </Link>
        </li>

        <li>
          <Link
            to="/pedidos"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">Favoritos</span>
          </Link>
        </li>

        <li>
          <Link
            to="/prestadores"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Buscar</span>
          </Link>
        </li>

        <li>
          <Link
            to="/me"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
