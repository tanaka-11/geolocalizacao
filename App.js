import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  // const [initialLocation, setInitialLocation] = useState(null); // Localização Inicial
  // const [currentLocation, setCurrentLocation] = useState(null); // Localização Atual
  const [totalDistance, setTotalDistance] = useState(0); // Distancia Total
  const [startTime, setStartTime] = useState(null); // Começar Contagem
  const [elapsedTime, setElapsedTime] = useState(0); // Pausa
  const [isRecording, setIsRecording] = useState(false); // Gravando
  const [errorMsg, setErrorMsg] = useState(null); // Mensagem de Erro
  const [coordinates, setCoordinates] = useState([]); // Cordenadas

  const [locationIndex, setLocationIndex] = useState(0); // Valor Fixo para teste

  // Lista de localizações para teste
  const locations = [
    { latitude: -23.55052, longitude: -46.633308 }, // São Paulo
    { latitude: 40.712776, longitude: -74.005974 }, // Nova Iorque
  ];

  // Função para alternar entre as localizações, ela é responsável por alternar entre duas localizações específicas definidas em um array. Ela muda o estado locationIndex, que determina qual localização deve ser exibida no mapa.
  const toggleLocation = () => {
    setLocationIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  };

  // UseEffect para permisão da localização
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
     /*  setInitialLocation(initialLocation); */
      /* setCurrentLocation(initialLocation); */
    })(); // Função imediata para o Effect funcionar como um async/await
  }, []);

  // Efeito para animar o mapa para a nova localização atual
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      const { latitude, longitude } = currentLocation.coords; // Um objeto desestruturado extraindo os valores  que contém as informações sobre a localização atual do usuário. Este objeto tem uma propriedade "coords" que armazena as coordenadas da localização.

      // Animação do mapa para a nova localização
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.05,
      });
    }
  }, [currentLocation]);

  const mapRef = React.createRef(); // Guardando a referencia no mapRef

  // Função para começar a gravar
  // const startRecording = async () => {
  //   // Variavel guardando a função de localização atual
  //   let initialLocation = await Location.getCurrentPositionAsync({});

  //   // States
  //   setInitialLocation(initialLocation);
  //   setCurrentLocation(initialLocation);
  //   setStartTime(new Date().getTime());
  //   setIsRecording(true);
  //   setCoordinates([initialLocation.coords]);

  //   // Variavel guardando função que monitora o movimento do usuario com o primeiro parametro de objeto vazio que recebe a option "default" e uma callback
  //   let subscriber = await Location.watchPositionAsync({}, (newLocation) => {
  //     // Atualização do state recebendo a nova localização
  //     setCurrentLocation(newLocation);

  //     // Variavel distancia guardando a função de calcular a distancia
  //     let distance = calculateDistance(
  //       initialLocation.coords.latitude,
  //       initialLocation.coords.longitude,
  //       newLocation.coords.latitude,
  //       newLocation.coords.longitude
  //     );

  //     // States
  //     setTotalDistance(totalDistance + distance);
  //     setElapsedTime((new Date().getTime() - startTime) / 1000);
  //     setCoordinates([...coordinates, newLocation.coords]);
  //   });

  //   // Die
  //   return () => {
  //     if (subscriber) {
  //       subscriber.remove();
  //     }
  //   };
  // };

  // Função parar gravação
  // const stopRecording = () => {
  //   // Atualização dos states
  //   setIsRecording(false);
  //   setTotalDistance(0);
  //   setElapsedTime(0);
  // };

  // Função para calcular distancia
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Raio da Terra
    const R = 6371;

    // Distancia da Latitude
    const dLat = (lat2 - lat1) * (Math.PI / 180);

    // Distancia da Longitude
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    // Constante guardando a primeira parte da formula de Haversine calcular o raio a
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    // Constante guardando a segunda parte da formula calculando a distancia final
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distancia recebendo o raio vezes a distancia final
    const distance = R * c;

    // Retornando a const Distancia
    return distance;
  };

  // Tratativa de erros
  let text = "Aguardando permissões...";
  if (errorMsg) {
    text = errorMsg;
  }

  return (
    <View style={styles.container}>
      {/* Componente do map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        // Parametro de região inicial recebendo objeto com state de localização inicial
        // initialRegion={{
        //   latitude: initialLocation // State
        //     ? initialLocation.coords.latitude
        //     : -23.55052,
        //   longitude: initialLocation
        //     ? initialLocation.coords.longitude
        //     : -46.633308,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}

        // Parâmetro de região inicial recebendo objeto com state de localização fixa
        initialRegion={{
          latitude: locations[locationIndex].latitude,
          longitude: locations[locationIndex].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Localização Inicial com condicional para aparecer o Maker na primeira localização */}
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

        {/* Localização Atual para aparecer o Maker na localização fixa */}
        <Marker
          coordinate={locations[locationIndex]}
          title="Localização"
          description="Localização de teste"
        />

        {/* Localização Atual para aparecer o Maker na localização atual */}
        {/* {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Sua Localização Atual"
            // Mostrando valores de quantos km e tempo que o usuario andou
            description={`Você andou ${totalDistance.toFixed(
              2
            )} km em ${formatTime(elapsedTime)}`}
          />
        )} */}

        {/* Marcador de percuso */}
        <Polyline
          coordinates={coordinates}
          strokeWidth={5}
          strokeColor="rgba(255,0,0,0.5)"
        />
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
