import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { customIcon } from './LeafLetIcons';

const MapSelector = ({
  onLocationSelect,
  externalLat,
  externalLng,
  clearMarker,
  onDragChange,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  externalLat?: number | null;
  externalLng?: number | null;
  clearMarker?: boolean;
  onDragChange?: (isDragging: boolean) => void;
}) => {
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

  // Clear marker when clearMarker prop is true
  useEffect(() => {
    if (clearMarker) {
      setMarkerPos(null);
    }
  }, [clearMarker]);

  // Component to update map center when external coordinates change
  const MapUpdater = () => {
    const map = useMap();
    
    useEffect(() => {
      if (externalLat && externalLng) {
        map.setView([externalLat, externalLng], 15);
        setMarkerPos({ lat: externalLat, lng: externalLng });
        // Don't call onLocationSelect here to avoid interfering with manual clicking
        // The parent already has these coordinates from the geolocation
      }
    }, [externalLat, externalLng, map]);

    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos({ lat, lng });
        onLocationSelect(lat, lng);
      },
      dragstart() {
        setIsDragging(true);
        onDragChange?.(true);
        console.log('Map dragging started: true');
      },
      drag() {
        onDragChange?.(true);
        console.log('Map is being dragged: true');
      },
      dragend() {
        setIsDragging(false);
        onDragChange?.(false);
        console.log('Map dragging ended: true');
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
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <MapUpdater />
          <LocationMarker />
        </MapContainer>
      )}
    </>
  );
};

export default MapSelector;
