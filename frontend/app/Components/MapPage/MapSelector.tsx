import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import 'leaflet/dist/leaflet.css';
import { customIcon } from './LeafLetIcons';

const MapSelector = memo(({
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


  const defaultCenter = useMemo(() => {
    return userLocation || { lat: 28.6139, lng: 77.2090 };
  }, [userLocation]);

  const mapCenter = useMemo(() => {
    return [defaultCenter.lat, defaultCenter.lng] as [number, number];
  }, [defaultCenter]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoadingLocation(false); 
        },
        () => {
          setLoadingLocation(false); 
        }
      );
    } else {
      setLoadingLocation(false);  
    }
  }, []);

  useEffect(() => {
    if (clearMarker) {
      setMarkerPos(null);
    }
  }, [clearMarker]);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setMarkerPos({ lat, lng });
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  const handleDragChange = useCallback((dragging: boolean) => {
    onDragChange?.(dragging);
  }, [onDragChange]);

  // Component to update map center when external coordinates change
  const MapUpdater = memo(() => {
    const map = useMap();
    
    useEffect(() => {
      if (externalLat && externalLng) {
        map.setView([externalLat, externalLng], 15);
        setMarkerPos({ lat: externalLat, lng: externalLng });
      }
    }, [externalLat, externalLng, map]);

    return null;
  });
  
  MapUpdater.displayName = 'MapUpdater';

  const LocationMarker = memo(() => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleLocationSelect(lat, lng);
      },
      dragstart() {
        handleDragChange(true);
      },
      drag() {
        handleDragChange(true);
      },
      dragend() {
        handleDragChange(false);
      },
    });

    return markerPos ? <Marker position={markerPos} icon={customIcon} /> : null;
  });
  
  LocationMarker.displayName = 'LocationMarker';

  return (
    <>
      {loadingLocation ? (
        <div>Loading your location...</div>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          key={`map-${mapCenter[0]}-${mapCenter[1]}`}
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
});

MapSelector.displayName = 'MapSelector';

export default MapSelector;
