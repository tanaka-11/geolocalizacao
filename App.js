import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [initialLocation, setInitialLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    (async () => {
      // Variavel guardando a permisão
      let { status } = await Location.requestForegroundPermissionsAsync();

      // Condicional para localização negada
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada");
        return;
      }

      // Variavel guardando localização inicial recebendo a localização atual
      let initialLocation = await Location.getCurrentPositionAsync({});

      // State
      setInitialLocation(initialLocation);
      setCurrentLocation(initialLocation);
    })();
  }, []);

  // UseEffect com parametro para funcionamento da localização atual
  useEffect(() => {
    // Condicional
    if (currentLocation) {
      const { latitude, longitude } = currentLocation.coords; // Objeto com mais informações da latitude e longitude.

      // Animação do mapa
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.05,
      });
    }
  }, [currentLocation]); // Parametro (currentLocation)

  const mapRef = React.createRef();

  const startRecording = async () => {
    let initialLocation = await Location.getCurrentPositionAsync({});
    setInitialLocation(initialLocation);
    setCurrentLocation(initialLocation);
    setStartTime(new Date().getTime());
    setIsRecording(true);
    setCoordinates([initialLocation.coords]);

    let subscriber = await Location.watchPositionAsync({}, (newLocation) => {
      setCurrentLocation(newLocation);
      let distance = calculateDistance(
        initialLocation.coords.latitude,
        initialLocation.coords.longitude,
        newLocation.coords.latitude,
        newLocation.coords.longitude
      );
      setTotalDistance(totalDistance + distance);
      setElapsedTime((new Date().getTime() - startTime) / 1000);
      setCoordinates([...coordinates, newLocation.coords]);
    });

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    setTotalDistance(0);
    setElapsedTime(0);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  let text = "Aguardando permissões...";
  if (errorMsg) {
    text = errorMsg;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: initialLocation
            ? initialLocation.coords.latitude
            : -23.55052,
          longitude: initialLocation
            ? initialLocation.coords.longitude
            : -46.633308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={region}
      >
        {initialLocation && (
          <Marker
            coordinate={{
              latitude: initialLocation.coords.latitude,
              longitude: initialLocation.coords.longitude,
            }}
            title="Sua Localização Inicial"
            description="Você começou aqui"
          />
        )}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Sua Localização Atual"
            description={`Você andou ${totalDistance.toFixed(
              2
            )} km em ${formatTime(elapsedTime)}`}
          />
        )}
        <Polyline
          coordinates={coordinates}
          strokeWidth={5}
          strokeColor="rgba(255,0,0,0.5)"
        />
      </MapView>
      <View style={styles.buttonContainer}>
        {isRecording ? (
          <Button title="Parar Gravação" onPress={stopRecording} />
        ) : (
          <Button title="Iniciar Gravação" onPress={startRecording} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
  },
});

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
