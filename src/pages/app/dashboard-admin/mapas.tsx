import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Loader2, Navigation2 } from "lucide-react";

// === Ícones personalizados ===
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

const pedidoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// === Corrige o tamanho do mapa dentro de modais ===
function FixMapResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  return null;
}

// === Interface de Pedido ===
interface Pedido {
  id: number;
  nome: string;
  endereco: string;
  lat: number;
  lng: number;
}

export function MapRoute() {
  const [from, setFrom] = useState<[number, number] | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selected, setSelected] = useState<Pedido | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  // === Obter localização atual ===
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFrom([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao obter localização:", err);
        setFrom([-8.8383, 13.2344]); // fallback (Luanda)
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // === Simular pedidos próximos ===
  useEffect(() => {
    if (!from) return;
    const pedidosSimulados: Pedido[] = [
      {
        id: 1,
        nome: "Reparo Elétrico",
        endereco: "Avenida 4 de Fevereiro",
        lat: from[0] + 0.002,
        lng: from[1] + 0.004,
      },
      {
        id: 2,
        nome: "Canalização Rápida",
        endereco: "Rua da Missão",
        lat: from[0] - 0.003,
        lng: from[1] - 0.003,
      },
      {
        id: 3,
        nome: "Pintura Express",
        endereco: "Kinaxixi",
        lat: from[0] + 0.004,
        lng: from[1] - 0.002,
      },
    ];
    setPedidos(pedidosSimulados);
  }, [from]);

  // === Traçar rota ===
  const calculateRoute = async (dest: Pedido) => {
    if (!from) return;
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        setRouteCoords(coords);
        setSelected(dest);

        // 🔎 Ajustar zoom para mostrar a rota inteira
        if (mapRef.current) {
          const bounds = L.latLngBounds(coords);
          mapRef.current.fitBounds(bounds, { padding: [60, 60] });
        }
      }
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
    }
  };

  if (loading || !from) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8 mb-2" />
        <p className="text-sm text-muted-foreground">
          Obtendo sua localização...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] sm:h-[500px] rounded-xl overflow-hidden">
      <MapContainer
        center={from}
        zoom={15}
        zoomControl={false}
        ref={(ref) => (mapRef.current = ref)}
        className="w-full h-full z-0"
      >
        <FixMapResize />
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🧭 Posição atual */}
        <Marker position={from} icon={userIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Você está aqui 📍</p>
            </div>
          </Popup>
        </Marker>

        {/* 🧱 Pedidos próximos */}
        {pedidos.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pedidoIcon}
            eventHandlers={{
              click: () => calculateRoute(p),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{p.nome}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {p.endereco}
                </p>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => calculateRoute(p)}
                >
                  Traçar rota
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 🛣️ Linha da rota */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: "#ff6b00",
              weight: 6,
              opacity: 0.9,
              lineJoin: "round",
            }}
          />
        )}
      </MapContainer>

      {/* 📦 Painel de detalhes do pedido selecionado */}
      {selected && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-900 p-4 rounded-2xl shadow-lg w-[90%] flex justify-between items-center backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="font-semibold text-lg">{selected.nome}</h3>
            <p className="text-xs text-muted-foreground">{selected.endereco}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => {
              setSelected(null);
              setRouteCoords([]);
              if (mapRef.current) mapRef.current.setView(from, 15);
            }}
          >
            <Navigation2 className="text-orange-500" size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
