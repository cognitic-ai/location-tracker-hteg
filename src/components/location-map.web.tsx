import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onMapReady?: () => void;
}

export default function LocationMap({ latitude, longitude, onMapReady }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    L.Icon.Default.mergeOptions({
      imagePath: window.location.origin,
      iconUrl: require("leaflet/dist/images/marker-icon.png").uri,
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").uri,
      shadowUrl: require("leaflet/dist/images/marker-shadow.png").uri,
    });

    const map = L.map(mapRef.current).setView([latitude, longitude], 15);
    mapInstanceRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markerRef.current = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup("You are here")
      .openPopup();

    if (onMapReady) {
      onMapReady();
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLatLng = L.latLng(latitude, longitude);
      mapInstanceRef.current.setView(newLatLng, 15);
      markerRef.current.setLatLng(newLatLng);
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    />
  );
}
