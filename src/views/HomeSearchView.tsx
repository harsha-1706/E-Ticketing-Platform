import React, { useState } from 'react';

interface HomeSearchViewProps {
  onSelectService: (serviceData: {
    origin: string;
    destination: string;
    date: string;
    operator: string;
    departure: string;
    arrival: string;
    duration: string;
    fare: number;
  }) => void;
  onOpenTerminalGuide: (terminal: string, city: string) => void;
}

const AVAILABLE_SERVICES = [
  {
    id: 's1',
    operator: 'Garuda Express Travels',
    type: 'Multi-Axle AC Sleeper (2+1)',
    departure: '08:00 AM',
    arrival: '04:30 PM',
    duration: '8h 30m',
    departureLoc: 'MGBS Central Platform 12',
    arrivalLoc: 'Majestic KSRTC Terminal 1',
    rating: 4.8,
    reviews: 1240,
    fare: 750,
    seatsAvailable: 18,
    tags: ['Live Tracking', 'Water Bottle', 'Charging Point', '5G Wi-Fi'],
  },
  {
    id: 's2',
    operator: 'IntrCity SmartBus Premium',
    type: 'Volvo 9600 Multi-Axle AC Sleeper',
    departure: '10:15 AM',
    arrival: '07:00 PM',
    duration: '8h 45m',
    departureLoc: 'Gachibowli ORR Junction',
    arrivalLoc: 'Hebbal Flyover',
    rating: 4.7,
    reviews: 980,
    fare: 820,
    seatsAvailable: 12,
    tags: ['Safe Transit', 'Clean Berth', 'AC Filtered'],
  },
  {
    id: 's3',
    operator: 'Orange Super Luxury Sleeper',
    type: 'BharatBenz Executive Sleeper (2+1)',
    departure: '09:00 PM',
    arrival: '06:00 AM',
    duration: '9h 00m',
    departureLoc: 'Ameerpet Metro Terminal',
    arrivalLoc: 'Electronic City Toll Plaza',
    rating: 4.6,
    reviews: 2150,
    fare: 890,
    seatsAvailable: 8,
    tags: ['Overnight', 'Reading Light', 'Blanket'],
  },
];

export const HomeSearchView: React.FC<HomeSearchViewProps> = ({
  onSelectService,
  onOpenTerminalGuide,
}) => {
  const [origin, setOrigin] = useState('Hyderabad (MGBS)');
  const [destination, setDestination] = useState('Bangalore (Majestic)');
  const [travelDate, setTravelDate] = useState('2026-09-25');
  const [transitMode, setTransitMode] = useState<'bus' | 'train' | 'flight'>('bus');

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div className="max-w-7xl mx-auto px-margin py-space-xl flex flex-col gap-space-2xl">
      {/* Hero Transit Search Section */}
      <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary text-on-primary p-space-xl md:p-space-2xl shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col gap-space-lg max-w-4xl">
          <div className="flex items-center gap-space-xs text-on-primary/90 font-label-md text-label-md">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
            <span>Real-time Multi-Modal Transit Booking</span>
          </div>

          <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-primary">
            Next-Generation National E-Ticket Platform
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl">
            Book intercity buses, express rails, and campus shuttles with instant seat allocation,
            authenticated digital boarding passes, and live Google Maps terminal grounding.
          </p>

          {/* Transit Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface/15 backdrop-blur-md self-start">
            <button
              type="button"
              onClick={() => setTransitMode('bus')}
              className={`px-4 py-2 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center gap-2 cursor-pointer ${
                transitMode === 'bus'
                  ? 'bg-surface text-primary shadow-md'
                  : 'text-on-primary hover:bg-surface/10'
              }`}
            >
              <span className="material-symbols-outlined text-lg">directions_bus</span>
              <span>Intercity Buses</span>
            </button>
            <button
              type="button"
              onClick={() => setTransitMode('train')}
              className={`px-4 py-2 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center gap-2 cursor-pointer ${
                transitMode === 'train'
                  ? 'bg-surface text-primary shadow-md'
                  : 'text-on-primary hover:bg-surface/10'
              }`}
            >
              <span className="material-symbols-outlined text-lg">train</span>
              <span>Express Rail</span>
            </button>
            <button
              type="button"
              onClick={() => setTransitMode('flight')}
              className={`px-4 py-2 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center gap-2 cursor-pointer ${
                transitMode === 'flight'
                  ? 'bg-surface text-primary shadow-md'
                  : 'text-on-primary hover:bg-surface/10'
              }`}
            >
              <span className="material-symbols-outlined text-lg">flight</span>
              <span>Regional Flights</span>
            </button>
          </div>

          {/* Search Bar Container */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-2xl text-on-surface grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
            {/* Origin */}
            <div className="md:col-span-4 flex flex-col gap-1 p-2 rounded-xl bg-surface-container-low border border-border-subtle">
              <label className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">trip_origin</span>
                <span>From Station</span>
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="font-headline-sm text-headline-sm font-bold bg-transparent text-on-surface focus:outline-none"
              />
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-primary transition-all flex items-center justify-center shadow-sm cursor-pointer"
                title="Swap routes"
              >
                <span className="material-symbols-outlined text-lg">sync_alt</span>
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-4 flex flex-col gap-1 p-2 rounded-xl bg-surface-container-low border border-border-subtle">
              <label className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-status-success">location_on</span>
                <span>To Destination</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="font-headline-sm text-headline-sm font-bold bg-transparent text-on-surface focus:outline-none"
              />
            </div>

            {/* Date */}
            <div className="md:col-span-3 flex flex-col gap-1 p-2 rounded-xl bg-surface-container-low border border-border-subtle">
              <label className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">calendar_today</span>
                <span>Travel Date</span>
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="font-headline-sm text-headline-sm font-bold bg-transparent text-on-surface focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available Scheduled Services List */}
      <div className="flex flex-col gap-space-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Available Daily Coaches &bull; {origin} &rarr; {destination}
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted">
              Select your preferred departure slot to open the interactive cabin deck.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenTerminalGuide('MGBS Central Platform 12', 'Hyderabad')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-label-md text-label-md hover:bg-primary/20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">pin_drop</span>
            <span>Terminal Guide (Google Maps)</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-md">
          {AVAILABLE_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-border-subtle hover:border-primary/40 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md"
            >
              {/* Operator info */}
              <div className="flex flex-col gap-1 md:w-1/3">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {srv.operator}
                  </h3>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-status-warning/15 text-status-warning text-xs font-bold">
                    <span>★</span>
                    <span>{srv.rating}</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted">{srv.type}</p>
                <div className="flex items-center gap-1 flex-wrap mt-1">
                  {srv.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Time and Stoppages */}
              <div className="flex items-center justify-between gap-space-lg md:w-1/3">
                <div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {srv.departure}
                  </span>
                  <p className="text-[11px] text-text-muted">{srv.departureLoc}</p>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs text-text-muted">{srv.duration}</span>
                  <div className="w-16 h-0.5 bg-primary relative my-1">
                    <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary"></span>
                  </div>
                  <span className="text-[10px] text-primary uppercase font-bold">Direct</span>
                </div>

                <div className="text-right">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {srv.arrival}
                  </span>
                  <p className="text-[11px] text-text-muted">{srv.arrivalLoc}</p>
                </div>
              </div>

              {/* Fare & CTA */}
              <div className="flex items-center justify-between md:flex-col md:items-end gap-space-sm w-full md:w-auto pt-space-sm md:pt-0 border-t md:border-t-0 border-border-subtle">
                <div className="text-left md:text-right">
                  <span className="text-xs text-text-muted">Starts from</span>
                  <div className="font-headline-md text-headline-md font-bold text-primary">
                    ₹{srv.fare}
                  </div>
                  <span className="text-[11px] text-status-success font-medium">
                    {srv.seatsAvailable} berths left
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectService({
                      origin,
                      destination,
                      date: 'Fri, 25 Sep 2026',
                      operator: srv.operator,
                      departure: srv.departure,
                      arrival: srv.arrival,
                      duration: srv.duration,
                      fare: srv.fare,
                    })
                  }
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Seats</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
