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
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);  // To track if location is loading

  // Get the user's current location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoadingLocation(false);  // Once the location is fetched, stop loading
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);  // Stop loading even if there's an error
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoadingLocation(false);  // If geolocation is not available
    }
  }, []);

  // Handling Map Event when the user clicks on the map
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

  // Fallback to a default center if userLocation is not yet available
  const defaultCenter = userLocation || { lat: 28.6139, lng: 77.2090 };

  return (
    <>
      {loadingLocation ? (
        <div>Loading your location...</div> // You can display a loading message or spinner here
      ) : (
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}  // Use user's location or fallback
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
