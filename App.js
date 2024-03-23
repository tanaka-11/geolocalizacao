import React, { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function App() {
  const [totalDistance, setTotalDistance] = useState(0); // Total Distance
  const [velocity, setVelocity] = useState(0); // Velocity
  const [coordinates, setCoordinates] = useState([]); // Coordinates

  // Cordenadas fixas de SP e Santos
  const saoPauloCoords = { latitude: -23.55052, longitude: -46.633308 };
  const santosCoords = { latitude: -23.96083, longitude: -46.333057 };

  // Calculando a distancia entre dois pontos com a formula de Harvesine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da terra em Km

    // Distancia Latitude
    const dLat = (lat2 - lat1) * (Math.PI / 180);

    // Distancia Longitude
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    // Primeira parte da formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    // Segunda parte da formula
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distancia em km
    return distance;
  };

  // Calculando e atualizando state de distancia e velocidade
  const calculateTotalDistance = () => {
    const distance = calculateDistance(
      saoPauloCoords.latitude,
      saoPauloCoords.longitude,
      santosCoords.latitude,
      santosCoords.longitude
    );
    const speed = calculateVelocity(distance); // Calculando a velocidade com base na distância
    setTotalDistance(distance);
    setVelocity(speed);
    setCoordinates([saoPauloCoords, santosCoords]);
  };

  // Função para calcular a velocidade média em Km/h
  const calculateVelocity = (distance) => {
    const time = 1; // Tempo em horas (neste caso, 1 hora)
    if (distance === 0) return 0;

    const speed = distance / time; // Distância dividida pelo tempo
    return speed.toFixed(1); // Limitando para 2 casas decimais
  };

  return (
    <View style={styles.container}>
      <View style={styles.clima}>
        <Text style={styles.textoClima}>20º</Text>
      </View>

      <View style={styles.cronometro}>
        <Text style={styles.textoCronometro}>25:00</Text>
      </View>

      <View style={styles.subContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -23.7,
            longitude: -46.6,
            latitudeDelta: 0.8,
            longitudeDelta: 0.8,
          }}
        >
          {/* Marker para São Paulo */}
          <Marker coordinate={saoPauloCoords} title="São Paulo" />
          {/* Marker para Santos */}
          <Marker coordinate={santosCoords} title="Santos" />
          {/* Linha traçada entre São paulo e Santos */}
          <Polyline
            coordinates={coordinates}
            strokeWidth={5}
            strokeColor="rgba(255,0,0,0.5)"
          />
        </MapView>
      </View>

      <View style={styles.marcadores}>
        <View style={styles.distancia}>
          <Text style={styles.text}>Distância</Text>
          <Text style={styles.text}>{totalDistance.toFixed(2)} km</Text>
        </View>

        <View style={styles.velocidade}>
          <Text style={styles.text}>Velocidade</Text>
          <Text style={styles.text}>{velocity} km/h</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Calculate Distance" onPress={calculateTotalDistance} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9B9898",
  },

  subContainer: {
    // flex: 1,
    backgroundColor: "#fff",
  },

  clima: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginLeft: 262,
    backgroundColor: "#d9d9d9",
    padding: 16,
  },

  textoClima: {
    fontSize: 22,
  },

  cronometro: {
    backgroundColor: "#D9D9D9",
    padding: 32,
    borderRadius: 24,
    marginTop: 24,
    marginBottom: 24,
  },

  textoCronometro: {
    fontSize: 24,
  },

  map: {
    width: 350,
    height: 350,
    borderColor: "#FFF",
  },

  marcadores: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 40,
    margin: 24,
  },

  distancia: {
    backgroundColor: "#D9D9D9",
    padding: 16,
  },

  velocidade: {
    backgroundColor: "#D9D9D9",
    padding: 16,
  },

  footer: {
    flex: 1,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 40,
    width: 150,
  },
});
