import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Button, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

// Funções utilitárias
import { calculateDistance, formatTime } from "./utils/funcoes.js";

export default function App() {
  const [initialLocation, setInitialLocation] = useState(null); // Localização Inicial
  const [currentLocation, setCurrentLocation] = useState(null); // Localização Atual
  const [totalDistance, setTotalDistance] = useState(0); // Distancia Total
  const [startTime, setStartTime] = useState(null); // Começar Contagem
  const [elapsedTime, setElapsedTime] = useState(0); // Pausa
  const [isRecording, setIsRecording] = useState(false); // Gravando
  const [coordinates, setCoordinates] = useState([]); // Cordenadas

  // useEffect de permissão e localização inial
  useEffect(() => {
    async () => {
      // Variavel guardando a permisão
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Condicional para localização negada
      if (status !== "granted") {
        Alert.alert(
          "Permissão Necessária",
          "Ative a localização para usar o app."
        );
        return;
      }

      // Obtendo a localização atual
      const initialLocation = await Location.getCurrentPositionAsync({});

      // State para centralização inicial do usuario
      setInitialLocation(initialLocation);
      setCurrentLocation(initialLocation);
    },
      [];
  })(); // Função imediata usada para o Effect funcionar como um async/await ou Função assíncrona IIFE (Immediately Invoked Function Expression)

  // UseEffect com parametro para funcionamento da localização atual
  useEffect(() => {
    // Função para animar o mapa para a nova localização
    const animateMap = ({ latitude, longitude }) => {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.05,
      });
    };

    // Condicional caso usuario tenha feito permissão
    if (currentLocation) {
      // Extrai latitude e longitude da propriedade coords de currentLocation
      const { latitude, longitude } = currentLocation.coords;
      // Chama a função animateMap com a latitude e longitude da localização atual
      animateMap({ latitude, longitude });
    }

    // Dependencia do efeito: só reexecutar quando a currentLocation mudar
  }, [currentLocation]);

  // Função que cria um objeto de referência atraves do hook React.createRef
  const mapRef = React.createRef(null);

  // Função para começar a gravar
  const startRecording = async () => {
    // Obter a localização atual
    const initialLocation = await Location.getCurrentPositionAsync({});

    // Atualizar states
    setInitialLocation(initialLocation); // Valor inicial
    setCurrentLocation(initialLocation); // Armazena a localização atual e sempre sera atualizado quando a localização do usuário mudar
    setStartTime(new Date().getTime()); // Armazena o momento em que a gravação é iniciada
    setIsRecording(true); // Indica se a gravação está em andamento
    setCoordinates([initialLocation.coords]); // Armazena um array de coordenadas do usuário ao longo do tempo.

    // Monitorar movimento do usuário
    useEffect(() => {
      // Função para atualizações da localização em tempo real, recebe dois parametros o primeiro sendo um objeto vazio que pode ser usado para configurar opções da API de localização e o segundo parametro uma função callback chamada sempre que a nova posição do usuário for obtida
      const subscriber = Location.watchPositionAsync({}, (newLocation) => {
        // Atualizar state com nova localização
        setCurrentLocation(newLocation);

        // Calcular a distancia percorrida (Calcula a distância entre a localização inicial e a nova)
        const distance = calculateDistance(
          initialLocation.coords.latitude,
          initialLocation.coords.longitude,
          newLocation.coords.latitude,
          newLocation.coords.longitude
        );

        // Atualizar state ( Atualiza a distância total, tempo decorrido e array de coordenadas)
        setTotalDistance(totalDistance + distance);
        setElapsedTime((new Date().getTime() - startTime) / 1000);
        setCoordinates([...coordinates, newLocation.coords]);
      });

      return () => subscriber.remove(); // Limpar listener ao desmontar o componente

      // Dependencia do efeito: só reexecutar quando a initialLocation mudar
    }, [initialLocation]);
  };

  // Função parar gravação
  const stopRecording = () => {
    // Atualização dos states
    setIsRecording(false);
    setTotalDistance(0);
    setElapsedTime(0);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Componente do map */}
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
        >
          {/* Marker na Localização Inicial  */}
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

          {/* Marker na Localização Atual  */}
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
              pinColor="blue" // Cor azul para o marcador atual
            />
          )}

          {/* Marcador de percuso */}
          {coordinates.length > 1 && (
            <Polyline
              coordinates={coordinates}
              strokeColor="rgba(255,0,0,0.5)"
              strokeWidth={5}
            />
          )}
        </MapView>

        {/* Botão de gravação */}
        <View style={styles.buttonContainer}>
          {isRecording ? (
            <Button title="Parar Gravação" onPress={stopRecording} />
          ) : (
            <Button title="Iniciar Gravação" onPress={startRecording} />
          )}
        </View>
      </View>
    </>
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
