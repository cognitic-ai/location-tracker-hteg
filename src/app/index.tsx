import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import * as Location from "expo-location";
import * as AC from "@bacons/apple-colors";
import LocationMap from "@/components/location-map";

export default function IndexRoute() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocation();
  }, []);

  async function requestLocation() {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
      setLoading(false);

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    } catch (error) {
      setErrorMsg("Failed to get location: " + (error as Error).message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AC.systemBackground as any,
        }}
      >
        <ActivityIndicator size="large" color={AC.systemBlue as any} />
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: AC.secondaryLabel as any,
          }}
        >
          Getting your location...
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
          backgroundColor: AC.systemBackground as any,
        }}
      >
        <Text
          selectable
          style={{
            fontSize: 18,
            color: AC.systemRed as any,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {errorMsg}
        </Text>
        <Pressable
          onPress={requestLocation}
          style={{
            backgroundColor: AC.systemBlue as any,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            borderCurve: "continuous",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!location) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AC.systemBackground as any,
        }}
      >
        <Text style={{ color: AC.label as any }}>No location data</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LocationMap
        latitude={location.coords.latitude}
        longitude={location.coords.longitude}
      />
      <View
        style={{
          position: "absolute",
          bottom: process.env.EXPO_OS === "web" ? 32 : 0,
          left: 16,
          right: 16,
          backgroundColor: AC.systemBackground as any,
          padding: 16,
          borderRadius: 16,
          borderCurve: "continuous",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          marginBottom: process.env.EXPO_OS === "web" ? 0 : 32,
        }}
      >
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: AC.secondaryLabel as any, fontSize: 14 }}>Latitude</Text>
            <Text
              selectable
              style={{ color: AC.label as any, fontSize: 14, fontWeight: "600", fontVariant: "tabular-nums" }}
            >
              {location.coords.latitude.toFixed(6)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: AC.secondaryLabel as any, fontSize: 14 }}>Longitude</Text>
            <Text
              selectable
              style={{ color: AC.label as any, fontSize: 14, fontWeight: "600", fontVariant: "tabular-nums" }}
            >
              {location.coords.longitude.toFixed(6)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: AC.secondaryLabel as any, fontSize: 14 }}>Accuracy</Text>
            <Text
              selectable
              style={{ color: AC.label as any, fontSize: 14, fontWeight: "600", fontVariant: "tabular-nums" }}
            >
              ±{location.coords.accuracy?.toFixed(0) ?? "N/A"}m
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
