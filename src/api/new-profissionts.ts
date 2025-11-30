import { api } from "@/lib/axios"

interface RegisterNewProfissionRequest {
     title:string
     categoryId:string
}

export  async function RegisterNewProfission(data:RegisterNewProfissionRequest) {
      const {title,categoryId} = data
       const response = await api.post("/create-profission", {title, categoryId
      })

      return response.data
}