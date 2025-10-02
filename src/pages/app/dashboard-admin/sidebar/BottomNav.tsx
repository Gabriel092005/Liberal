import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Home, User, Search,Plus, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";

export function BottomNav() {
  return (
    <nav className="fixed bottom-8 inset-x-0 z-50 bg-white dark:bg-zinc-950 shadow-lg md:hidden">
      <ul className="flex justify-between items-center px-6 h-16 relative">
        {/* Início */}
        <li>
          <Link
            to="/"
            className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Início</span>
          </Link>
        </li>

        {/* Favoritos */}
        <li>
          <Link
            to="/prestadores"
            className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
          >
            <Briefcase className="w-6 h-6" />
            <span className="text-xs">Prestadores</span>
          </Link>
        </li>

        {/* Botão central flutuante */}
        <li className="absolute left-1/2 -translate-x-1/2 -top-6">
          <Dialog>
            <DialogTrigger>
              <Button className="rounded-full h-14 w-14 flex items-center justify-center 
                bg-gradient-to-r from-orange-500 to-pink-500 text-white 
                shadow-xl border-4 border-white dark:border-zinc-950 
                hover:opacity-90 transition-all">
                <Plus size={28} />
              </Button>
            </DialogTrigger>
            <FastFazerPedido />
          </Dialog>
        </li>

        {/* Buscar */}
        <li>
          <Link
            to="/pedidos"
            className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Buscar</span>
          </Link>
        </li>

        {/* Perfil */}
        <li>
          <Link
            to="/me"
            className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
