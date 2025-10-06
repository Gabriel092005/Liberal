"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Correção para ícones quebrados no React :cite[1]
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Definição de tipos para o Leaflet Routing Machine
declare module "leaflet" {
    namespace Routing {
    interface Control {
        on(event: string, callback: (e: any) => void): this;
        off(event: string): this;
    }
}
}

// Interfaces TypeScript para melhor tipagem
interface Pedido {
    id: number;
    lat: number;
    lng: number;
  nome: string;
  endereco: string;
}

interface RouteInfo {
    distancia: number;
  tempoCarro: number;
  tempoPe: number;
}

// Funções utilitárias
const formatarTempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return horas > 0 ? `${horas}h ${minutos}min` : `${minutos} min`;
};

const formatarDistancia = (metros: number): string => {
    return metros < 1000 ? `${Math.round(metros)} m` : `${(metros / 1000).toFixed(1)} km`;
};

// Componente de Roteamento Corrigido
function Routing({ from, to, onRouteFound }: { 
    from: [number, number]; 
  to: [number, number]; 
  onRouteFound: (info: RouteInfo) => void;
}) {
  const map = useMap();
  const routeLineRef = useRef<L.Polyline | null>(null);
  
  useEffect(() => {
      if (!to) return;

      // Remove rota anterior
    if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    const waypoints = [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])];
    
    // Criar uma linha simples entre os pontos como fallback
    const simpleRoute = L.polyline(waypoints as any, {
        color: '#2929A3',
      weight: 5,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map);
    
    routeLineRef.current = simpleRoute;

    // Calcular distância e tempo estimado
    const distancia = waypoints[0].distanceTo(waypoints[1]);
    const velocidadeCarro = 50; // km/h
    const velocidadePe = 5; // km/h
    
    const routeInfo: RouteInfo = {
      distancia: distancia,
      tempoCarro: Math.round((distancia / 1000) / velocidadeCarro * 3600),
      tempoPe: Math.round((distancia / 1000) / velocidadePe * 3600)
    };
    
    onRouteFound(routeInfo);
    
    // Tentar usar OSRM para rota mais precisa
    const calculateOSRMRoute = async () => {
      try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
        );
        const routeLineRef = useRef<L.Polyline | L.GeoJSON | null>(null);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.routes && data.routes[0]) {
            const route = data.routes[0];
            // const routeGeometry = route.geometry;
            
            // Remover rota simples
            if (routeLineRef.current) {
              map.removeLayer(routeLineRef.current);
            }
            
            // Adicionar rota OSRM
// const osrmRoute = L.geoJSON(routeGeometry as any, {
//   style: {
//     color: '#2929A3',
//     weight: 6,
//     opacity: 0.9
//   }
// }).addTo(map);



            
                                 
            // Atualizar informações da rota
            const updatedRouteInfo: RouteInfo = {
              distancia: route.distance,
              tempoCarro: route.duration,
              tempoPe: Math.round((route.distance / 1000) / 5 * 3600)
            };
            
            onRouteFound(updatedRouteInfo);
          }
        }
      } catch (error) {
        console.log("Usando rota simples - OSRM não disponível");
      }
    };

    calculateOSRMRoute();

    return () => {
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
      }
    };
  }, [from, to, map, onRouteFound]);

  return null;
}

// Componente Principal
export function MapRoute() {
  const [from, setFrom] = useState<[number, number]>([-8.8383, 13.2344]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Carregar pedidos e localização :cite[5]:cite[6]
  useEffect(() => {
    const initializeMap = async () => {
      // Obter localização do usuário
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setFrom([pos.coords.latitude, pos.coords.longitude]);
            setMapReady(true);
          },
          (error) => {
            console.warn("Erro de geolocalização, usando localização padrão:", error);
            setMapReady(true);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      } else {
        setMapReady(true);
      }

      // Pedidos simulados
      const pedidosSimulados: Pedido[] = [
        { 
          id: 1, 
          lat: -8.8383, 
          lng: 13.2400, 
          nome: "Pedido #001", 
          endereco: "Avenida 4 de Fevereiro" 
        },
        { 
          id: 2, 
          lat: -8.8300, 
          lng: 13.2300, 
          nome: "Pedido #002", 
          endereco: "Baía de Luanda" 
        }
      ];
      
      setPedidos(pedidosSimulados);
    };

    initializeMap();
  }, []);

  const handlePedidoClick = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setRouteInfo(null);
    setLoading(true);
  };

  const handleClearRoute = () => {
    setSelectedPedido(null);
    setRouteInfo(null);
    setLoading(false);
  };

  if (!mapReady) {
    return (
      <div className="relative w-full h-[60vh] md:h-[500px] rounded-xl overflow-hidden shadow-md border flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[500px] rounded-xl overflow-hidden shadow-md border">
      {/* Header do Mapa */}
      <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md">
        <h3 className="font-semibold text-gray-800">🗺️ Roteirizador</h3>
        <p className="text-sm text-gray-600">
          {selectedPedido ? `Rota para: ${selectedPedido.nome}` : "Clique em um pedido"}
        </p>
      </div>

      {/* Botão para limpar rota */}
      {selectedPedido && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={handleClearRoute}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
          >
            ✕ Limpar Rota
          </button>
        </div>
      )}

      <MapContainer 
        center={from} 
        zoom={14} 
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Minha localização */}
        <Marker position={from}>
          <Popup>
            <div className="text-center">
              <div className="font-bold text-blue-600">📍 Minha Localização</div>
              <div className="text-sm text-gray-600 mt-1">
                {from[0].toFixed(4)}, {from[1].toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Marcadores dos pedidos */}
        {pedidos.map(pedido => (
          <Marker
            key={pedido.id}
            position={[pedido.lat, pedido.lng]}
            eventHandlers={{
              click: () => handlePedidoClick(pedido)
            }}
          >
            <Popup>
              <div className="min-w-[250px] p-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-800">{pedido.nome}</h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    #{pedido.id}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Endereço:</span> {pedido.endereco}
                  </p>
                </div>
                
                {selectedPedido?.id === pedido.id && routeInfo && (
                  <div className="space-y-3 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-semibold text-blue-800">🚗 De Carro</h3>
                      <div className="mt-1 text-sm text-gray-700 space-y-1">
                        <p><strong>Distância:</strong> {formatarDistancia(routeInfo.distancia)}</p>
                        <p><strong>Tempo:</strong> {formatarTempo(routeInfo.tempoCarro)}</p>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-semibold text-green-800">🚶 A Pé</h3>
                      <div className="mt-1 text-sm text-gray-700 space-y-1">
                        <p><strong>Distância:</strong> {formatarDistancia(routeInfo.distancia)}</p>
                        <p><strong>Tempo:</strong> {formatarTempo(routeInfo.tempoPe)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPedido?.id === pedido.id && loading && !routeInfo && (
                  <div className="text-center py-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Calculando melhor rota...</p>
                  </div>
                )}

                <button
                  className="mt-2 w-full bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                  onClick={() => alert(`Aceitar pedido: ${pedido.nome}`)}
                >
                  Aceitar Pedido
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Componente de roteamento */}
        {selectedPedido && (
          <Routing
            from={from}
            to={[selectedPedido.lat, selectedPedido.lng]}
            onRouteFound={(info) => {
              setRouteInfo(info);
              setLoading(false);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}