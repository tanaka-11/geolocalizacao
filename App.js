import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

const App = () => {
  const [locationIndex, setLocationIndex] = useState(0);

  // Lista de localizações para teste
  const locations = [
    { latitude: -23.55052, longitude: -46.633308 }, // São Paulo
    { latitude: 40.712776, longitude: -74.005974 }, // Nova Iorque
  ];

  // Função para alternar entre as localizações
  const toggleLocation = () => {
    setLocationIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  };

  return (
    <View style={styles.container}>
      {/* Componente do map */}
      <MapView
        style={styles.map}
        // Parâmetro de região inicial recebendo objeto com state de localização inicial
        initialRegion={{
          latitude: locations[locationIndex].latitude,
          longitude: locations[locationIndex].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcador para a localização atual */}
        <Marker
          coordinate={locations[locationIndex]}
          title="Localização"
          description="Localização de teste"
        />
      </MapView>

      {/* Botão para alternar entre as localizações */}
      <TouchableOpacity onPress={toggleLocation} style={styles.button}>
        <Text style={styles.buttonText}>Alternar Localização</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default App;
