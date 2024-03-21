import React, { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function App() {
  const [totalDistance, setTotalDistance] = useState(0); // Total Distance
  const [coordinates, setCoordinates] = useState([]); // Coordinates

  // Fixed coordinates for SP and Santos
  const saoPauloCoords = { latitude: -23.55052, longitude: -46.633308 };
  const santosCoords = { latitude: -23.96083, longitude: -46.333057 };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Calculate and set total distance
  const calculateTotalDistance = () => {
    const distance = calculateDistance(saoPauloCoords.latitude, saoPauloCoords.longitude, santosCoords.latitude, santosCoords.longitude);
    setTotalDistance(distance);
    setCoordinates([saoPauloCoords, santosCoords]);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ latitude: -23.7, longitude: -46.6, latitudeDelta: 0.8, longitudeDelta: 0.8 }}>
        {/* Marker for São Paulo */}
        <Marker coordinate={saoPauloCoords} title="São Paulo" />
        {/* Marker for Santos */}
        <Marker coordinate={santosCoords} title="Santos" />
        {/* Polyline showing the route between SP and Santos */}
        <Polyline coordinates={coordinates} strokeWidth={5} strokeColor="rgba(255,0,0,0.5)" />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Calculate Distance" onPress={calculateTotalDistance} />
      </View>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>Total Distance: {totalDistance.toFixed(2)} km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  distanceContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 1,
  },
  distanceText: {
    fontSize: 18,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
  },
});
