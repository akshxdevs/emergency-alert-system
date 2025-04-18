import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { customIcon } from './LeafLetIcons';

const MapSelector = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoadingLocation(false); 
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false); 
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoadingLocation(false);  
    }
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos({ lat, lng });
        onLocationSelect(lat, lng);
      },
    });

    return markerPos ? <Marker position={markerPos} icon={customIcon} /> : null;
  };

  const defaultCenter = userLocation || { lat: 28.6139, lng: 77.2090 };

  return (
    <>
      {loadingLocation ? (
        <div>Loading your location...</div>
      ) : (
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '400px', width: '400px' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <LocationMarker />
        </MapContainer>
      )}
    </>
  );
};

export default MapSelector;
