import { api } from "@/lib/axios";

interface SignUpUseCaseRequest {
  nome: string;
  celular: string;
  image_path: File | null;
  nif: string;
  profissao: string;
  palavraPasse: string;
  provincia: string;
  municipio: string;
  nomeRepresentante?: string;
  role: 'ADMIN' | 'PRESTADOR_INDIVIDUAL' | 'PRESTADOR_COLECTIVO' | 'CLIENTE_COLECTIVO' | 'CLIENTE_INDIVIDUAL';
}
export async function signUp({
  role, // <── minusculo
  celular,
  image_path,
  municipio,
  nif,
  nome,
  nomeRepresentante,
  palavraPasse,
  profissao,
  provincia
}: SignUpUseCaseRequest) {
  const formData = new FormData();

  formData.append("nome", nome);
  formData.append("palavraPasse", palavraPasse);
  formData.append("municipio", municipio);
  formData.append("provincia", provincia);
  formData.append("nif", nif);
  formData.append("profissao", profissao);
  formData.append("role", role); // 👈 aqui corrigido
  if (celular) formData.append("celular", celular);
  if (nomeRepresentante) formData.append("nomeRepresentante", nomeRepresentante);
  if (image_path) formData.append("image", image_path);

  try {
    console.log(formData)
    const response = await api.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
  }
}

