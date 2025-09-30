import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import photo1 from "@/assets/WhatsApp Image 2024-06-27 at 22.21.29_0203fa98.jpg"

export function AvatarScroll() {
  const users = [
    { name: "Carlos", location: "Luanda", number: "+244 923 456 789", photo: photo1 },
    { name: "Ana", location: "Benguela", number: "+244 934 987 123", photo: photo1 },
    { name: "João", location: "Huambo", number: "+244 912 654 321", photo: photo1 },
    { name: "Maria", location: "Lubango", number: "+244 922 345 678", photo: photo1 },
  ]

  return (
    <div className="overflow-hidden w-full py-4">
      <div className="flex gap-6 animate-scroll">
        {users.map((user, i) => (
          <div
            key={i}
            className="flex flex-col items-center min-w-[120px] bg-white dark:bg-zinc-900 rounded-xl shadow-md p-3 relative"
          >
            {/* Avatar */}
            <Avatar className="w-14 h-14">
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>

            {/* Badge de localização */}
            <Badge
              variant="secondary"
              className="mt-2 flex items-center gap-1 text-xs px-2 py-0.5"
            >
              <MapPin className="w-3 h-3 text-orange-500" />
              {user.location}
            </Badge>

            {/* Nome e número */}
            <span className="mt-1 text-sm font-semibold">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.number}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
