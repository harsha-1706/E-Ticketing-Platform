import React, { useState, useEffect } from 'react';

interface GroundingMapsChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeId?: string;
    address?: string;
    placeAnswerSources?: {
      reviewSnippets?: Array<{ snippet: string; reviewUri?: string }>;
    };
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

interface TerminalMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminalName: string;
  cityName: string;
}

export const TerminalMapsModal: React.FC<TerminalMapsModalProps> = ({
  isOpen,
  onClose,
  terminalName,
  cityName,
}) => {
  const [selectedTerminal, setSelectedTerminal] = useState(terminalName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guideText, setGuideText] = useState<string>('');
  const [groundingChunks, setGroundingChunks] = useState<GroundingMapsChunk[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');

  useEffect(() => {
    if (terminalName) {
      setSelectedTerminal(terminalName);
    }
  }, [terminalName]);

  // Request browser geolocation for grounding toolConfig
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLocationStatus('Precise coordinates enabled');
        },
        () => {
          setLocationStatus('Default regional center');
        },
        { timeout: 5000 }
      );
    } else {
      setLocationStatus('Geolocation unavailable');
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !selectedTerminal) return;

    let isMounted = true;
    async function fetchTerminalInfo() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/terminal-maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            terminalName: selectedTerminal,
            cityName: cityName || 'Hyderabad/Bangalore',
            userLatLng: userLocation,
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setGuideText(data.text || 'No live data available.');
          setGroundingChunks(data.groundingChunks || []);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Maps Grounding error:', err);
          setError(
            'Unable to fetch live terminal maps guidance at this moment. You can still open direct Google Maps.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTerminalInfo();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedTerminal, cityName, userLocation]);

  if (!isOpen) return null;

  // Extract maps chunks
  const mapsChunks = groundingChunks.filter((chunk) => chunk.maps?.uri);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 overflow-y-auto"
      id="maps-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-border-subtle animate-in fade-in zoom-in-95 duration-200"
        id="terminal-maps-dialog"
      >
        {/* Header */}
        <div className="bg-primary text-on-primary p-space-lg flex items-start justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-surface/10 flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-2xl">pin_drop</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                  Live Terminal Guide & Navigation
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-status-success/20 text-on-primary text-[10px] font-bold uppercase tracking-wider">
                  Google Maps Grounded
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
                Powered by Gemini 3.5 Flash with Real-Time Google Maps Platform data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-primary/80 hover:text-on-primary hover:bg-surface/10 transition-colors"
            title="Close modal"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Quick Stoppage Switcher */}
        <div className="bg-surface-container-low px-space-lg py-space-sm flex items-center justify-between flex-wrap gap-space-sm border-b border-border-subtle">
          <div className="flex items-center gap-space-xs text-text-muted font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm text-primary">my_location</span>
            <span>GPS: {locationStatus}</span>
          </div>

          <div className="flex items-center gap-space-xs overflow-x-auto py-1">
            {[
              'MGBS Central Station',
              'Majestic Bus Stand',
              'Ameerpet Metro Station',
              'Gachibowli ORR',
              'Electronic City Toll',
            ].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedTerminal(name)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedTerminal.includes(name)
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-space-lg max-h-[70vh] overflow-y-auto flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div>
              <span className="text-xs text-text-muted uppercase font-bold tracking-wider">
                Transit Point Selected
              </span>
              <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
                {selectedTerminal}
              </h4>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                selectedTerminal + ' ' + cityName
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Open in Google Maps</span>
            </a>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-space-md text-text-muted">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-body-md text-body-md text-center">
                Retrieving verified terminal coordinates, platforms & traveler tips via Google Maps
                grounding...
              </p>
            </div>
          ) : error ? (
            <div className="p-space-md rounded-xl bg-error-container/20 border border-error/20 text-on-surface flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-error text-xl">error</span>
              <div className="flex flex-col gap-1">
                <span className="font-label-md font-bold text-error">Live Grounding Notice</span>
                <p className="font-body-sm text-body-sm">{error}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedTerminal
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-primary font-semibold text-xs inline-flex items-center gap-1"
                >
                  Direct Google Maps Search <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-space-md">
              {/* Grounded Guide Markdown formatted */}
              <div className="bg-surface-container-low p-space-md rounded-xl text-on-surface font-body-md text-body-md leading-relaxed whitespace-pre-line">
                {guideText}
              </div>

              {/* MANDATORY: Render extracted Google Maps Grounding Chunks with Clickable URIs */}
              {mapsChunks.length > 0 && (
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <span className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">explore</span>
                    Verified Google Maps Locations & Sources
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    {mapsChunks.map((chunk, idx) => {
                      const place = chunk.maps!;
                      const snippet =
                        place.placeAnswerSources?.reviewSnippets?.[0]?.snippet;
                      return (
                        <a
                          key={idx}
                          href={place.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-space-sm rounded-xl bg-surface-container-lowest border border-border-subtle hover:border-primary hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-primary">
                                  location_on
                                </span>
                                {place.title || selectedTerminal}
                              </span>
                              <span className="material-symbols-outlined text-xs text-text-muted group-hover:text-primary transition-colors">
                                open_in_new
                              </span>
                            </div>
                            {place.address && (
                              <p className="font-body-sm text-body-sm text-text-muted line-clamp-2">
                                {place.address}
                              </p>
                            )}
                            {snippet && (
                              <p className="font-body-sm text-body-sm text-text-muted italic mt-1.5 bg-surface-container-low p-1.5 rounded text-[11px]">
                                "{snippet}"
                              </p>
                            )}
                          </div>
                          <div className="mt-2 pt-2 border-t border-border-subtle/50 flex items-center justify-between text-[11px] text-primary font-semibold">
                            <span>View on Google Maps</span>
                            <span className="material-symbols-outlined text-xs">directions</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface-container-low px-space-lg py-space-sm flex items-center justify-between border-t border-border-subtle">
          <span className="text-xs text-text-muted">
            Report 20 minutes before departure for bus boarding and luggage loading.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-secondary transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
