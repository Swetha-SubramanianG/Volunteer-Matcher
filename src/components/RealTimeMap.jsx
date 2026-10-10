import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RealTimeMap.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to update map view when location changes
function MapUpdater({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  
  return null;
}

// Custom moving marker icon
const createMovingIcon = () => {
  return L.divIcon({
    className: 'moving-marker',
    html: '<div class="pulse-ring"></div><div class="marker-dot"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const RealTimeMap = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Cleanup watchPosition on unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError(null);
    setIsTracking(true);

    // Watch position for real-time updates
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPosition);
        setAccuracy(pos.coords.accuracy);
        setLastUpdate(new Date());
        
        // Animate marker update
        if (markerRef.current) {
          markerRef.current.setLatLng(newPosition);
        }
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setIsTracking(false);
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0, // Always get fresh location
      }
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPosition);
        setAccuracy(pos.coords.accuracy);
        setLastUpdate(new Date());
      },
      (err) => {
        setError(`Error: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  };

  return (
    <div className="realtime-map-container">
      <div className="map-controls">
        <h2>Real-Time Location Tracker</h2>
        <div className="controls-buttons">
          {!isTracking ? (
            <>
              <button onClick={getCurrentLocation} className="btn-location">
                Get Current Location
              </button>
              <button onClick={startTracking} className="btn-track">
                Start Real-Time Tracking
              </button>
            </>
          ) : (
            <button onClick={stopTracking} className="btn-stop">
              Stop Tracking
            </button>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {position && (
          <div className="location-info">
            <div className="info-item">
              <strong>Latitude:</strong> {position[0].toFixed(6)}
            </div>
            <div className="info-item">
              <strong>Longitude:</strong> {position[1].toFixed(6)}
            </div>
            {accuracy && (
              <div className="info-item">
                <strong>Accuracy:</strong> {Math.round(accuracy)}m
              </div>
            )}
            {lastUpdate && (
              <div className="info-item">
                <strong>Last Update:</strong> {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            {isTracking && (
              <div className="tracking-indicator">
                <span className="pulse-dot"></span> Tracking active
              </div>
            )}
          </div>
        )}
      </div>

      <div className="map-wrapper">
        {position ? (
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater position={position} />
            <Marker
              position={position}
              icon={isTracking ? createMovingIcon() : undefined}
              ref={markerRef}
            >
              <Popup>
                <div>
                  <strong>Your Location</strong>
                  <br />
                  Lat: {position[0].toFixed(6)}
                  <br />
                  Lng: {position[1].toFixed(6)}
                  {accuracy && <><br />Accuracy: {Math.round(accuracy)}m</>}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="map-placeholder">
            <p>Click "Get Current Location" or "Start Real-Time Tracking" to see your location on the map</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeMap;
