import { DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Phone} from "lucide-react"
import photo4 from "@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg"

export function PrestadoreProfile() {
  return (
    <DialogContent className="max-w-2xl p-0 rounded-xl overflow-hidden">
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
        <div className="absolute -bottom-12 left-6">
          <img
            src={photo4}
            alt="Perfil"
            className="w-28 h-28 rounded-full border-4 border-background shadow-md object-cover"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mt-16 px-6 pb-6">
        {/* Nome e bio */}
        <h2 className="text-xl font-bold">João Silva</h2>
        <p className="text-muted-foreground text-sm">
          Especialista em serviços domésticos e jardinagem
        </p>

        {/* Ações */}
        <div className="flex gap-3 mt-4">
          <Button className="flex items-center gap-2">
            <Phone size={18} />
             Solicitar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageCircle size={18} />
            Mensagem
          </Button>
        </div>

        {/* Sobre mim */}
        <Card className="mt-6">
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
    </DialogContent>
  )
}
