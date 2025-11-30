import { api } from "@/lib/axios"

interface NewPackageRequest{
    title:string,
    preco:number,
    validade:string,
    beneficio1:string,
    beneficio2:string
}
export async function  newPackage({beneficio1,beneficio2,preco,title,validade}:NewPackageRequest){
       await api.post("/newPackage", {title,preco,validade, beneficio1, beneficio2})
    
}