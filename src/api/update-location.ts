import { api } from "@/lib/axios"

interface updateLocationRequest{
     latitude : number|null
     longitude:number|null
     description:string|null
}

export async function changeLocation({latitude,longitude,description}:updateLocationRequest){
     api.put("/update-location", {latitude,longitude,description})
}