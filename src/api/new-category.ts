import { api } from "@/lib/axios";

interface RegisterNewCategoryRequest {
  title: string;
  image: File | null;
}
export async function RegisterNewCategory({
  image,
  title

}: RegisterNewCategoryRequest) {
  const formData = new FormData();

  if (image) formData.append("image", image);
  formData.append("title", title);
  try {
    console.log(formData)
    const response = await api.post("/create-category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
  }
}

