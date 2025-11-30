import { api } from "@/lib/axios";

interface UpdatePhotoRequest{
    image_path: File | null;
}

export async function UpdatePhoto({image_path}:UpdatePhotoRequest) {
      const formData = new FormData();
   if (image_path) formData.append("image", image_path);


      await api.put("/update/profile-image",formData,{
         headers:{
                    "Content-Type": "multipart/form-data",
         }
      })
}