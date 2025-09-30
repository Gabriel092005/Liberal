import { Home, User, Heart} from "lucide-react";
import { Link } from "react-router-dom";



export function BottomNavIndentidade() {
  return (
    <nav className="fixed inset-x-0 bottom-11 z-50   bg-white dark:bg-black md:hidden shadow-t">
      <ul className="flex justify-around gap-9 items-center h-14">
        <li>
          <Link
            to="/home"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Início</span>
          </Link>
        </li>
        <li>
          <Link
            to="/prestadores"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">Favoritos</span>
          </Link>
        </li>
        <li>
          <Link
            to="/sign-in"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </Link>
        </li>

         <li>
  
       
        
        </li>
      </ul>
    </nav>
  );
}
