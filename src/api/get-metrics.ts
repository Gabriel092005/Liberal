import { api } from "@/lib/axios"

interface MetricsResponse {
    
	clientesEmpresa:number,
	clientesIndividual: number,
	prestadoresEmpresa: number,
	prestadoresIndividual: number,
	receitas: number,
	pedidos: number,
	crescimento: {
		clientes: number,
		prestadores: number,
		pedidos: 100
	}

}

export async function Metrics(){
    const response = await api.get<MetricsResponse>("/metrics")
    return response.data
    
}
