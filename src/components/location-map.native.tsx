import { useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet } from "react-native";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onMapReady?: () => void;
}

export default function LocationMap({ latitude, longitude, onMapReady }: LocationMapProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [latitude, longitude]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_DEFAULT}
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation
      showsMyLocationButton
      onMapReady={onMapReady}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title="You are here"
      />
    </MapView>
  );
}
