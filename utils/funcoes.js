// Função para calcular distancia
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Raio da Terra
  const R = 6371;

  // Distancia da Latitude
  const dLat = (lat2 - lat1) * (Math.PI / 180);

  // Distancia da Longitude
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  // Constante guardando a primeira parte da formula de Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  // Constante guardando a distancia final
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distancia recebendo o raio vezes a distancia final
  const distance = R * c;

  // Retornando a const Distancia
  return distance;
};

// Função para formatar a hora
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export { calculateDistance, formatTime };
