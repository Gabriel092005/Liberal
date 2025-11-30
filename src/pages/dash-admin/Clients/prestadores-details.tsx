import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard,MapPin, Phone, Briefcase, Star } from "lucide-react";
import { api } from "@/lib/axios";

export interface PrestadorDetails {
  name: string;
  address: string;
  description:string
  estrelas:number|null
  phone: string;
  accountBalance: number;
  image:string|undefined,
  profissao: string;
}



export function PrestadoresDetailsDialog({image,accountBalance,address,estrelas,description,name,phone,profissao}:PrestadorDetails) {
  return (
 
      <DialogContent className="sm:max-w-md sm:w-full p-6 rounded-xl shadow-lg">
        <DialogHeader className="flex flex-col items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
          <Avatar className="w-16 h-16 bg-orange-500">
            <AvatarImage src={`${api.defaults.baseURL}/uploads/${image}`}></AvatarImage>
            <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
          <DialogDescription>
              {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-500" />
            <span><strong>Saldo em conta:</strong>
            {accountBalance? (
              <>
               {accountBalance}
              </>
            ):(
              <>0</>
            )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span><strong>Morada:</strong> {address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-purple-500" />
            <span><strong>Telefone:</strong> {phone}</span>
          </div>
           <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span><strong>Estrelas : {estrelas}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-orange-500" />
            <span><strong>Profissão</strong> {profissao}</span>
          </div>
        </div>
      </DialogContent>

  );
}
