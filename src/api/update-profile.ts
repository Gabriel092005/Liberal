import { api } from "@/lib/axios"

interface UpdateProfileRequest {
  nome?: string | null
  celular?: string | null
  province?: string | null
  municipio?: string | null
  profissao?: string | null
}

export async function UpdateProfile({
  celular,
  municipio,
  nome,
  profissao,
  province,
}: UpdateProfileRequest) {
  // Cria objeto base
  const data = { celular, municipio, nome, profissao, province }

  // Remove campos vazios, nulos ou undefined
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v != null && v !== "")
  )

  // Envia apenas o que mudou
  const response = await api.put("/update", filteredData)

  return response.data
}
