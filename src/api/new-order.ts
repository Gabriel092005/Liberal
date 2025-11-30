import { api } from "@/lib/axios"
interface NewOrderRequest{
    title:string
    content:string
    brevidade:string
    location:string|null,
    latitude:number|null
    longitude:Number|null
}

export async function CreateNewOrder(data:NewOrderRequest){
     console.log(data)
     const {brevidade,content,latitude,location,longitude,title} = data
    const response = await api.post("/order", {brevidade, content,longitude,latitude,location,title})
   return response.data
}