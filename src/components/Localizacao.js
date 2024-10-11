// src/components/Localizacao.js
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -25.4333,
  lng: -49.2617 
};

const Localizacao = () => {
  return (
    <div className="mt-5">
      <LoadScript googleMapsApiKey="AIzaSyBahUObidgNkGPbsGIbs62XPlPpULrWKBU">
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