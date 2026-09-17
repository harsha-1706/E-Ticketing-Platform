import React, { useState, useEffect } from 'react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute: (origin: string, destination: string) => void;
  onOpenTerminalGuide: (terminal: string, city: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectRoute,
  onOpenTerminalGuide,
}) => {
  const [query, setQuery] = useState('');

  const routes = [
    { from: 'Hyderabad (MGBS)', to: 'Bangalore (Majestic)', bus: 'Garuda Express' },
    { from: 'Bangalore (Majestic)', to: 'Chennai (Koyambedu)', bus: 'IntrCity SmartBus' },
    { from: 'Mumbai (Borivali)', to: 'Pune (Swargate)', bus: 'Shivneri AC' },
    { from: 'Delhi (ISBT Kashmiri Gate)', to: 'Jaipur (Sindhi Camp)', bus: 'RSRTC Goldline' },
    { from: 'Hyderabad (MGBS)', to: 'Vijayawada (PNBS)', bus: 'Amaravati AC' },
  ];

  const terminals = [
    { name: 'MGBS Central Platform 12', city: 'Hyderabad' },
    { name: 'Majestic KSRTC Terminal 1', city: 'Bangalore' },
    { name: 'Ameerpet Metro Station', city: 'Hyderabad' },
    { name: 'Gachibowli Outer Ring Road', city: 'Hyderabad' },
    { name: 'Electronic City Toll Gate', city: 'Bangalore' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRoutes = routes.filter(
    (r) =>
      r.from.toLowerCase().includes(query.toLowerCase()) ||
      r.to.toLowerCase().includes(query.toLowerCase()) ||
      r.bus.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTerminals = terminals.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-on-surface/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-xl w-full border border-border-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-space-md border-b border-border-subtle flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search routes, bus operators, or transit terminals..."
            className="w-full bg-transparent font-headline-sm text-on-surface focus:outline-none placeholder:text-text-muted text-base"
          />
          <kbd className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-text-muted text-xs">
            ESC
          </kbd>
        </div>

        <div className="p-space-md max-h-96 overflow-y-auto flex flex-col gap-space-md">
          {/* Quick Routes */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Popular Express Transit Corridors
            </span>
            <div className="flex flex-col gap-1 mt-1">
              {filteredRoutes.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onSelectRoute(r.from, r.to);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-surface-container-low text-left flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">
                      directions_bus
                    </span>
                    <span className="font-label-md text-on-surface group-hover:text-primary">
                      {r.from} &rarr; {r.to}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">{r.bus}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Terminal Guide via Maps Grounding */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-primary">pin_drop</span>
              <span>Terminal Guides (Google Maps Grounding)</span>
            </span>
            <div className="flex flex-col gap-1 mt-1">
              {filteredTerminals.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onOpenTerminalGuide(t.name, t.city);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-surface-container-low text-left flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-success text-base">
                      location_on
                    </span>
                    <span className="font-label-md text-on-surface group-hover:text-primary">
                      {t.name}
                    </span>
                  </div>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <span>Live Guide</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
