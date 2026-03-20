import { api } from "@/lib/axios"


export interface NewPackageRequest {
  title: string;
  preco: number;
  validade: string;
  beneficio1?: string; // Adicione a interrogação aqui
  beneficio2?: string;
}
export async function  newPackage({beneficio1,beneficio2,preco,title,validade}:NewPackageRequest){
       await api.post("/newPackage", {title,preco,validade, beneficio1, beneficio2})
    
}