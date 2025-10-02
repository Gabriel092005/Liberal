import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil,  } from "lucide-react"
import photo4 from "@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg"
import { Link } from "react-router-dom"

export function Profile() {
  return (
    <div className="flex justify-center relative right-5 p-4">
      <div className="w-full max-w-md rounded-xl overflow-hidden  border shadow-md">
        <div className="relative">
          {/* Capa */}
          <div className="h-40 md:h-56 w-full">
            <img
              src={photo4}
              alt="Capa"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Foto de perfil */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <img
              src={photo4}
              alt="Perfil"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="mt-16 px-6 pb-6 text-center">
          {/* Nome e bio */}
          <h2 className="text-xl font-bold">João Silva</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Especialista em serviços domésticos e jardinagem
          </p>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
           <Link to='/config'>
            <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <Pencil size={18} />
              Editar
            </Button>
           </Link>
          </div>

          {/* Sobre mim */}
          <Card className="mt-6 text-left">
            <CardContent className="p-4">
              <h3 className="font-semibold text-base mb-2">Sobre</h3>
              <p className="text-sm text-muted-foreground">
                Tenho mais de 5 anos de experiência em jardinagem e manutenção de
                quintais. Trabalho com dedicação e responsabilidade, oferecendo
                serviços personalizados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
