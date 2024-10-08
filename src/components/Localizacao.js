// src/components/Localizacao.js
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -25.4333, // Substitua pelas coordenadas corretas
  lng: -49.2617  // Substitua pelas coordenadas corretas
};

const Localizacao = () => {
  return (
    <div className="mt-5">
      <LoadScript googleMapsApiKey="SUA_CHAVE_API_AQUI"> {/* Substitua pela sua chave de API */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Localizacao;