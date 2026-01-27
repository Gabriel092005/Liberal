
interface updateLocationRequest{
     latitude : number|null
     longitude:number|null
     description:string|null
}

export async function changeLocation({latitude,longitude}:updateLocationRequest){
     console.log(latitude,longitude)
    
}