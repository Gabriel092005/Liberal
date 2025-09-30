import { Button } from "@/components/ui/button";
import { Dialog,  DialogTrigger } from "@/components/ui/dialog";
import { Home, User, Search, Heart, Plus} from "lucide-react";
import { Link } from "react-router-dom";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";


export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-11 z-50 left-5 ml-2  bg-white dark:bg-black md:hidden shadow-t">
      <ul className="flex justify-around gap-9 items-center h-14">
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
            to="/prestadores"
            className="flex flex-col items-center text-sm text-gray-600 hover:text-orange-400"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">Favoritos</span>
          </Link>
        </li>

        <li>
          
              <Dialog>
                <DialogTrigger>
                  <Button className="rounded-full h-10 w-10 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:opacity-90">
                    <Plus />
                  </Button>
                </DialogTrigger>
                 <FastFazerPedido/>
              </Dialog>

        </li>

        <li>
          
          <Link
            to="/pedidos"
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

         <li>
  
       
        
        </li>
      </ul>
    </nav>
  );
}
