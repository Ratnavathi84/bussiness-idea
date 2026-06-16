import { useState } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { mockTrips } from '../data';
import { Trip } from '../types';
import { MapPin, Calendar, Compass } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const MarkerWithInfoWindow: React.FC<{ trip: Trip }> = ({ trip }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker ref={markerRef} position={trip.coordinates} onClick={() => setOpen(true)}>
        <Pin background="#1A1A1A" glyphColor="#FAFAFA" borderColor="#1A1A1A" />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-2 max-w-sm font-sans text-ink">
            <h3 className="font-display font-medium text-lg mb-1">{trip.title}</h3>
            <div className="flex items-center space-x-1 text-ink/60 mb-2">
              <MapPin size={14} className="text-terra" />
              <span className="text-xs font-semibold tracking-widest uppercase">{trip.location}</span>
            </div>
            <img src={trip.coverImage} alt={trip.title} className="w-full h-28 object-cover rounded-md mb-3" />
            <div className="flex items-center space-x-2 text-xs font-medium text-ink/50 uppercase tracking-widest">
              <Calendar size={14} className="text-sage" />
              <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function TravelMap() {
  const { trips } = useFirebase();
  const tripsToDisplay = trips.length > 0 ? trips : mockTrips;

  if (!hasValidKey) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center h-full">
        <div className="glass-panel p-10 rounded-3xl max-w-lg">
          <Compass size={48} className="text-terra mx-auto mb-6" strokeWidth={1} />
          <h2 className="text-3xl font-display font-medium text-ink mb-4">Map Setup Required</h2>
          <p className="text-ink/60 mb-6 font-medium">
            To view the interactive global map, you'll need to configure a Google Maps API key.
          </p>
          <ul className="text-left text-ink/70 space-y-3 mb-8 bg-ink/5 p-6 rounded-2xl border border-ink/10 text-sm">
            <li>1. Open <strong className="font-semibold text-ink">Settings</strong> (⚙️ icon, top-right)</li>
            <li>2. Select <strong className="font-semibold text-ink">Secrets</strong></li>
            <li>3. Add <code className="bg-paper px-1 py-0.5 rounded border border-ink/10 font-mono text-xs text-ink mx-1">GOOGLE_MAPS_PLATFORM_KEY</code></li>
            <li>4. Paste your API key</li>
          </ul>
          <a
            href="https://console.cloud.google.com/google/maps-apis/start"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-ink text-paper font-medium rounded-full hover:bg-ink/90 transition-colors shadow-lg shadow-ink/10"
          >
            Configure Key
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full relative"
    >
      <div className="absolute top-8 left-8 z-10 p-6 glass-panel rounded-3xl border-l-[6px] border-terra">
        <h2 className="text-3xl font-display font-medium text-ink mb-1">Atlas</h2>
        <p className="text-ink/50 text-sm font-medium tracking-widest uppercase">Global Footprint</p>
      </div>
      
      <APIProvider apiKey={API_KEY} version="weekly">
        <GoogleMap
          defaultCenter={{ lat: 45, lng: 10 }}
          defaultZoom={3}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
        >
          {tripsToDisplay.map(trip => (
            <MarkerWithInfoWindow key={trip.id} trip={trip} />
          ))}
        </GoogleMap>
      </APIProvider>
    </motion.div>
  );
}
