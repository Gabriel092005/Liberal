// import { useUserLocation } from "./location-services";

// export default function LocationDemo() {
  

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h3 className="text-lg font-semibold mb-4">Localização do usuário</h3>

//       <button
//         onClick={requestLocation}
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//         disabled={loading}
//       >
//         {loading ? "Buscando..." : "Obter minha localização"}
//       </button>

//       {error && <p className="mt-3 text-red-500">⚠️ {error}</p>}

//       {coords && (
//         <div className="mt-4 border rounded p-3 bg-gray-50">
//           <strong className="block mb-2">📍 Coordenadas:</strong>
//           <div>Latitude: {coords.latitude}</div>
//           <div>Longitude: {coords.longitude}</div>
//         </div>
//       )}

//       {place && (
//         <div className="mt-4 border rounded p-3 bg-gray-50">
//           <strong className="block mb-2">🏠 Endereço aproximado:</strong>
      
//           <div><b>Estado:</b> {place.state || "—"}</div>
//           <div><b>País:</b> {place.country || "—"}</div>
//           <div><b>CEP:</b> {place.postcode || "—"}</div>
//         </div>
//       )}
//     </div>
//   );
// }
