import { Button } from "@/components/ui/button";
import { Hammer, House, Link, Wrench } from "lucide-react";


export function CategoriasPopulares(){
    return(
        <section className="w-full relative bottom-16 flex flex-col gap-6 items-center justify-center lg:bottom-0 lg:mt-10">
  {/* <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
    CATEGORIAS POPULARES
  </span> */}

  <div className="flex justify-around w-full max-w-3xl gap-3 lg:gap-6 lg:justify-center">
    {[
      {
        icon: Wrench,
        color: "text-blue-400",
        bg: "from-blue-100 to-blue-50",
        label: "Assistência Técnica",
        to: "/eletricidade",
      },
      {
        icon: Hammer,
        color: "text-orange-400",
        bg: "from-orange-100 to-orange-50",
        label: "Reformas & Reparos",
        to: "/madeira",
      },
      {
        icon: House,
        color: "text-violet-400",
        bg: "from-violet-100 to-violet-50",
        label: "Serviços Domésticos",
        to: "/domestica",
      },
    ].map((c, i) => (
      <div
        className="flex flex-col items-center transition-transform duration-200 hover:-translate-y-1"
        key={i}
      >
        <Link to={c.to}>
          <Button
            variant="outline"
            className={`p-4 w-20 h-20 rounded-xl shadow-md border-0 bg-gradient-to-br ${c.bg} hover:scale-105 transition-transform`}
          >
            <c.icon className={c.color} size={30} />
          </Button>
        </Link>
        <span className="text-xs mt-2 font-medium text-center">{c.label}</span>
      </div>
    ))}
  </div>
</section>
    )
}