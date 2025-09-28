import { useState, useEffect, useCallback } from "react";

type Coords = {
  latitude: number;
  longitude: number;
};

type Place = {
  city: string | null;
  district: string | null;
  neighbourhood: string | null;
  state: string | null;
  country: string | null;
  postcode: string | null;
  raw: any; // resposta completa do Nominatim
};

type UseUserLocationReturn = {
  coords: Coords | null;
  place: Place | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
};

export function useUserLocation(): UseUserLocationReturn {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "pt",
          "User-Agent": "MinhaApp/1.0 (example@domain.com)",
        },
      });
      if (!res.ok) throw new Error("Erro no reverse geocoding");
      const data = await res.json();

      const addr = data.address || {};

      const city: string | null =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        null;

      const neighbourhood: string | null =
        addr.suburb || addr.neighbourhood || addr.quarter || null;

      const district: string | null =
        addr.district || addr.county || addr.state_district || null;

      setPlace({
        city,
        district,
        neighbourhood,
        state: addr.state || addr.region || null,
        country: addr.country || null,
        postcode: addr.postcode || null,
        raw: data,
      });
    } catch (err) {
      console.error("reverseGeocode error", err);
      setError(err instanceof Error ? err.message : "Erro ao obter local");
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation não é suportado pelo navegador");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        reverseGeocode(latitude, longitude).finally(() => setLoading(false));
      },
      (err: GeolocationPositionError) => {
        setLoading(false);
        if (err.code === 1) setError("Permissão negada para localização");
        else setError(err.message || "Erro ao obter localização");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60_000,
      }
    );
  }, [reverseGeocode]);

  useEffect(() => {
    // você pode descomentar se quiser pegar ao montar
    // requestLocation();
  }, [requestLocation]);

  return { coords, place, loading, error, requestLocation };
}
