import { Button } from "@/components/ui/button"
import { Camera, Pencil, MapPin, Briefcase, Globe, Podcast } from "lucide-react"

export function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-white right-5 relative dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Foto de capa */}
      <div className="relative w-full h-60 bg-gray-300 dark:bg-zinc-800">
        <img
          src="https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1600"
          alt="Capa"
          className=" object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white dark:bg-zinc-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-zinc-700">
          <Camera className="h-5 w-5 text-gray-700 dark:text-zinc-300" />
        </button>
      </div>
      <div className="max-w-5xl mx-auto px-4 relative">
        {/* Foto de perfil */}
        <div className="relative -mt-20 flex items-center">
          <div className="relative">
            <img
              src="https://avatars.githubusercontent.com/u/9919?s=280&v=4"
              alt="Perfil"
              className="h-36 w-36 rounded-full border-4 border-white dark:border-zinc-900 object-cover"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-zinc-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-zinc-700">
              <Pencil className="h-5 w-5 text-gray-700 dark:text-zinc-300" />
            </button>
          </div>
          <div className="ml-6 flex flex-col">
            <span className="text-2xl font-bold">Gabriel Cavala</span>
            <span className="text-sm text-gray-600 dark:text-zinc-400">
              Desenvolvedor Fullstack | Criador de Soluções Inteligentes
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="text-sm">Luanda, Angola</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-500" />
            <span className="text-sm">Trabalha na DevTech Solutions</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-500" />
            <a
              href="https://github.com/"
              target="_blank"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              github.com/gabriel
            </a>
          </div>
           <div>
          <Button variant='outline'>
                  <Podcast/>
                <span className="text-muted-foreground">Colocar na vitrine</span>
          </Button>
         </div>
        </div>
      </div>
    </div>
  )
}
