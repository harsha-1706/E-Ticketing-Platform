import React, { useState, useEffect } from 'react';
import { Seat, DeckType } from '../types/transit';

interface SeatSelectionViewProps {
  onContinue: (selectedSeats: Seat[], boardingPoint: string, droppingPoint: string) => void;
  onOpenTerminalGuide: (terminalName: string, city: string) => void;
}

const INITIAL_SEATS: Seat[] = [
  // Lower Deck (20 seats, 2+1 sleeper layout)
  { id: 'L1', deck: 'lower', price: 750, type: 'Window', status: 'booked', label: 'L1', row: 1, col: 0 },
  { id: 'L2', deck: 'lower', price: 750, type: 'Middle', status: 'available', label: 'L2', row: 1, col: 1 },
  { id: 'L3', deck: 'lower', price: 750, type: 'Window', status: 'available', label: 'L3', row: 1, col: 2 },

  { id: 'L6', deck: 'lower', price: 750, type: 'Window', status: 'booked', label: 'L6', row: 2, col: 0 },
  { id: 'L4', deck: 'lower', price: 750, type: 'Middle', status: 'selected', label: 'L4', row: 2, col: 1 },
  { id: 'L5', deck: 'lower', price: 750, type: 'Window', status: 'selected', label: 'L5', row: 2, col: 2 },

  { id: 'L7', deck: 'lower', price: 750, type: 'Ladies Only', status: 'ladies', label: 'L7', row: 3, col: 0 },
  { id: 'L8', deck: 'lower', price: 750, type: 'Middle', status: 'available', label: 'L8', row: 3, col: 1 },
  { id: 'L9', deck: 'lower', price: 750, type: 'Window', status: 'available', label: 'L9', row: 3, col: 2 },

  { id: 'L10', deck: 'lower', price: 750, type: 'Single', status: 'available', label: 'L10', row: 4, col: 0 },
  { id: 'L11', deck: 'lower', price: 750, type: 'Middle', status: 'booked', label: 'L11', row: 4, col: 1 },
  { id: 'L12', deck: 'lower', price: 750, type: 'Window', status: 'booked', label: 'L12', row: 4, col: 2 },

  // Upper Deck (15 seats)
  { id: 'U1', deck: 'upper', price: 800, type: 'Window', status: 'available', label: 'U1', row: 1, col: 0 },
  { id: 'U2', deck: 'upper', price: 800, type: 'Middle', status: 'available', label: 'U2', row: 1, col: 1 },
  { id: 'U3', deck: 'upper', price: 800, type: 'Window', status: 'booked', label: 'U3', row: 1, col: 2 },

  { id: 'U4', deck: 'upper', price: 800, type: 'Window', status: 'booked', label: 'U4', row: 2, col: 0 },
  { id: 'U5', deck: 'upper', price: 800, type: 'Middle', status: 'available', label: 'U5', row: 2, col: 1 },
  { id: 'U6', deck: 'upper', price: 800, type: 'Window', status: 'available', label: 'U6', row: 2, col: 2 },

  { id: 'U7', deck: 'upper', price: 800, type: 'Ladies Only', status: 'ladies', label: 'U7', row: 3, col: 0 },
  { id: 'U8', deck: 'upper', price: 800, type: 'Middle', status: 'available', label: 'U8', row: 3, col: 1 },
  { id: 'U9', deck: 'upper', price: 800, type: 'Window', status: 'available', label: 'U9', row: 3, col: 2 },

  { id: 'U10', deck: 'upper', price: 800, type: 'Single', status: 'available', label: 'U10', row: 4, col: 0 },
  { id: 'U11', deck: 'upper', price: 800, type: 'Middle', status: 'available', label: 'U11', row: 4, col: 1 },
  { id: 'U12', deck: 'upper', price: 800, type: 'Window', status: 'booked', label: 'U12', row: 4, col: 2 },
];

export const SeatSelectionView: React.FC<SeatSelectionViewProps> = ({
  onContinue,
  onOpenTerminalGuide,
}) => {
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
  const [activeDeck, setActiveDeck] = useState<DeckType>('lower');
  const [boardingPoint, setBoardingPoint] = useState('MGBS Platform 12 - 08:00 AM');
  const [droppingPoint, setDroppingPoint] = useState('Majestic KSRTC Terminal 1 - 04:30 PM');
  const [secondsRemaining, setSecondsRemaining] = useState(578); // 09:38

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedSeats = seats.filter((s) => s.status === 'selected');

  const toggleSeat = (id: string) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (s.status === 'booked') return s;
        if (s.status === 'selected') return { ...s, status: 'available' };
        if (s.status === 'available' || s.status === 'ladies') {
          return { ...s, status: 'selected' };
        }
        return s;
      })
    );
  };

  const removeSeat = (id: string) => {
    setSeats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'available' } : s))
    );
  };

  // Fare calculations
  const baseFare = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const tax = Math.round(baseFare * 0.05); // 5% GST & safe transit surcharge
  const discount = selectedSeats.length > 0 ? 100 : 0; // College Student Special
  const totalPayable = Math.max(0, baseFare + tax - discount);

  return (
    <div className="max-w-7xl mx-auto px-margin py-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column (7 cols): Interactive Cabin Deck */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-border-subtle">
            {/* Card Header & Deck Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md border-b border-border-subtle">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Interactive Cabin Deck
                </h2>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Garuda 2+1 Multi-Axle Sleeper Configuration &bull; Select Berths
                </p>
              </div>

              {/* Deck Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setActiveDeck('lower')}
                  className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    activeDeck === 'lower'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Lower Deck (20)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck('upper')}
                  className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    activeDeck === 'upper'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Upper Deck (15)
                </button>
              </div>
            </div>

            {/* Legend Bar */}
            <div className="py-space-md flex items-center justify-around flex-wrap gap-space-sm border-b border-border-subtle bg-surface-container-low/50 rounded-xl my-space-md px-space-md">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-surface-container border border-seat-available-border flex items-center justify-center text-[10px] text-text-muted font-bold">
                  L
                </div>
                <span className="font-label-sm text-label-sm text-on-surface">Available (₹750)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold">
                  &check;
                </div>
                <span className="font-label-sm text-label-sm text-on-surface">Selected</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-seat-booked text-seat-booked-text flex items-center justify-center text-[10px] font-bold">
                  <span className="material-symbols-outlined text-xs">lock</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface">Booked</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-pink-50 border border-pink-300 text-pink-600 flex items-center justify-center text-[10px] font-bold">
                  &female;
                </div>
                <span className="font-label-sm text-label-sm text-on-surface">Ladies Only</span>
              </div>
            </div>

            {/* Bus Cabin Visual Layout */}
            <div className="mt-space-md bg-surface-container-low/60 rounded-3xl p-space-lg border-2 border-border-subtle relative max-w-md mx-auto">
              {/* Bus Front & Driver */}
              <div className="pb-space-md mb-space-md border-b-2 border-dashed border-border-subtle flex items-center justify-between px-space-md text-text-muted">
                <div className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  <span className="material-symbols-outlined text-base text-primary">directions_bus</span>
                  <span>Front Entrance</span>
                </div>
                <div className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider font-semibold bg-surface px-2.5 py-1 rounded-full border border-border-subtle">
                  <span className="material-symbols-outlined text-base">airline_seat_recline_extra</span>
                  <span>Driver</span>
                </div>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-space-md">
                {[1, 2, 3, 4].map((rowNum) => {
                  const rowSeats = seats.filter(
                    (s) => s.deck === activeDeck && s.row === rowNum
                  );
                  const leftSolo = rowSeats.find((s) => s.col === 0);
                  const rightMiddle = rowSeats.find((s) => s.col === 1);
                  const rightWindow = rowSeats.find((s) => s.col === 2);

                  return (
                    <div
                      key={rowNum}
                      className="flex items-center justify-between gap-space-md"
                    >
                      {/* Left Sleeper Berth */}
                      <div className="w-24">
                        {leftSolo && (
                          <button
                            type="button"
                            onClick={() => toggleSeat(leftSolo.id)}
                            disabled={leftSolo.status === 'booked'}
                            className={`w-full h-14 rounded-xl flex flex-col items-center justify-center transition-all relative border cursor-pointer ${
                              leftSolo.status === 'selected'
                                ? 'bg-primary text-on-primary border-primary shadow-md scale-102 ring-2 ring-primary/30'
                                : leftSolo.status === 'booked'
                                ? 'bg-seat-booked border-transparent text-seat-booked-text cursor-not-allowed'
                                : leftSolo.status === 'ladies'
                                ? 'bg-pink-50 border-pink-300 text-pink-700 hover:border-pink-500'
                                : 'bg-surface border-seat-available-border hover:border-primary hover:bg-primary/5 text-on-surface'
                            }`}
                          >
                            <span className="font-label-md text-label-md font-bold">
                              {leftSolo.label}
                            </span>
                            <span className="text-[10px] opacity-80">
                              {leftSolo.status === 'booked' ? 'Sold' : `₹${leftSolo.price}`}
                            </span>
                            {leftSolo.status === 'ladies' && (
                              <span className="absolute top-1 right-1 text-xs text-pink-600 font-bold">
                                &female;
                              </span>
                            )}
                            {leftSolo.status === 'selected' && (
                              <span className="absolute top-1 right-1 text-xs text-on-primary">
                                &check;
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Aisle Walkway */}
                      <div className="flex-1 flex flex-col items-center justify-center text-text-muted/40 font-label-sm text-[10px] uppercase tracking-widest">
                        <span>Aisle</span>
                      </div>

                      {/* Right Double Sleeper Berths */}
                      <div className="flex items-center gap-space-xs w-48">
                        {rightMiddle && (
                          <button
                            type="button"
                            onClick={() => toggleSeat(rightMiddle.id)}
                            disabled={rightMiddle.status === 'booked'}
                            className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center transition-all relative border cursor-pointer ${
                              rightMiddle.status === 'selected'
                                ? 'bg-primary text-on-primary border-primary shadow-md scale-102 ring-2 ring-primary/30'
                                : rightMiddle.status === 'booked'
                                ? 'bg-seat-booked border-transparent text-seat-booked-text cursor-not-allowed'
                                : rightMiddle.status === 'ladies'
                                ? 'bg-pink-50 border-pink-300 text-pink-700 hover:border-pink-500'
                                : 'bg-surface border-seat-available-border hover:border-primary hover:bg-primary/5 text-on-surface'
                            }`}
                          >
                            <span className="font-label-md text-label-md font-bold">
                              {rightMiddle.label}
                            </span>
                            <span className="text-[10px] opacity-80">
                              {rightMiddle.status === 'booked' ? 'Sold' : `₹${rightMiddle.price}`}
                            </span>
                            {rightMiddle.status === 'selected' && (
                              <span className="absolute top-1 right-1 text-xs text-on-primary">
                                &check;
                              </span>
                            )}
                          </button>
                        )}

                        {rightWindow && (
                          <button
                            type="button"
                            onClick={() => toggleSeat(rightWindow.id)}
                            disabled={rightWindow.status === 'booked'}
                            className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center transition-all relative border cursor-pointer ${
                              rightWindow.status === 'selected'
                                ? 'bg-primary text-on-primary border-primary shadow-md scale-102 ring-2 ring-primary/30'
                                : rightWindow.status === 'booked'
                                ? 'bg-seat-booked border-transparent text-seat-booked-text cursor-not-allowed'
                                : rightWindow.status === 'ladies'
                                ? 'bg-pink-50 border-pink-300 text-pink-700 hover:border-pink-500'
                                : 'bg-surface border-seat-available-border hover:border-primary hover:bg-primary/5 text-on-surface'
                            }`}
                          >
                            <span className="font-label-md text-label-md font-bold">
                              {rightWindow.label}
                            </span>
                            <span className="text-[10px] opacity-80">
                              {rightWindow.status === 'booked' ? 'Sold' : `₹${rightWindow.price}`}
                            </span>
                            {rightWindow.status === 'selected' && (
                              <span className="absolute top-1 right-1 text-xs text-on-primary">
                                &check;
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rear Emergency Exit */}
              <div className="mt-space-md pt-space-md border-t-2 border-dashed border-border-subtle flex items-center justify-center text-text-muted gap-space-xs font-label-sm text-[11px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">emergency</span>
                <span>Rear Axle &bull; Emergency Evacuation Exit</span>
              </div>
            </div>

            {/* Coach Amenities & Perks */}
            <div className="mt-space-lg pt-space-md border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-space-sm text-center">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-xl">wifi</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">5G Wi-Fi</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-xl">power</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">220V Plug</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-xl">ac_unit</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Individual AC</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-xl">water_drop</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Free Water</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Journey & Fare Summary */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg sticky top-20">
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-border-subtle flex flex-col gap-space-md">
            {/* Operator Head */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  Instant Confirmation Bus
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
                  Garuda Express Travels
                </h3>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Fleet #HYD-BLR-8840 &bull; Volvo B11R Multi-Axle
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-status-warning/15 text-status-warning font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-sm font-bold">star</span>
                <span>4.8</span>
                <span className="text-text-muted text-[10px] font-normal">(1,240)</span>
              </div>
            </div>

            {/* Departure & Arrival Badges */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between border border-border-subtle">
              <div>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  08:00 AM
                </span>
                <p className="font-body-sm text-body-sm text-text-muted">MGBS Central Station</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-label-sm text-label-sm text-text-muted">8h 30m</span>
                <div className="w-16 h-0.5 bg-primary my-1 relative">
                  <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="font-label-sm text-[10px] text-primary uppercase font-bold">
                  Direct Transit
                </span>
              </div>
              <div className="text-right">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  04:30 PM
                </span>
                <p className="font-body-sm text-body-sm text-text-muted">Majestic Bus Stand</p>
              </div>
            </div>

            {/* Selected Seats Pills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Selected Berths ({selectedSeats.length})
                </span>
                {selectedSeats.length > 0 && (
                  <span className="font-label-sm text-label-sm text-text-muted">
                    Tap &times; to deselect
                  </span>
                )}
              </div>

              {selectedSeats.length === 0 ? (
                <div className="p-space-sm rounded-xl border border-dashed border-status-warning/40 bg-status-warning/10 text-on-surface text-center font-body-sm">
                  Please tap at least 1 berth on the deck layout to proceed.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md flex items-center gap-2 shadow-sm"
                    >
                      <span className="font-bold">
                        Seat {seat.label} ({seat.deck === 'lower' ? 'Lower' : 'Upper'} Sleeper)
                      </span>
                      <span className="opacity-75">&bull; ₹{seat.price}</span>
                      <button
                        type="button"
                        onClick={() => removeSeat(seat.id)}
                        className="hover:text-status-danger transition-colors cursor-pointer"
                        title="Remove seat"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boarding Point with Google Maps Grounding Trigger */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-base">trip_origin</span>
                  <span>Boarding Point</span>
                </label>
                {/* Google Maps Grounding CTA Button */}
                <button
                  type="button"
                  onClick={() => onOpenTerminalGuide(boardingPoint, 'Hyderabad')}
                  className="text-xs font-semibold text-primary hover:text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">pin_drop</span>
                  <span>Terminal Guide (Maps Grounding)</span>
                </button>
              </div>
              <select
                value={boardingPoint}
                onChange={(e) => setBoardingPoint(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="MGBS Platform 12 - 08:00 AM">
                  MGBS Central Platform 12 &ndash; 08:00 AM
                </option>
                <option value="Ameerpet Metro Station - 08:30 AM">
                  Ameerpet Metro Station Bay 2 &ndash; 08:30 AM
                </option>
                <option value="Gachibowli Outer Ring Road - 09:00 AM">
                  Gachibowli Outer Ring Road &ndash; 09:00 AM
                </option>
                <option value="Shamshabad Airport Toll - 09:30 AM">
                  Shamshabad Airport Toll Gate &ndash; 09:30 AM
                </option>
              </select>
            </div>

            {/* Dropping Point with Google Maps Grounding Trigger */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-status-success text-base">
                    location_on
                  </span>
                  <span>Dropping Point</span>
                </label>
                <button
                  type="button"
                  onClick={() => onOpenTerminalGuide(droppingPoint, 'Bangalore')}
                  className="text-xs font-semibold text-primary hover:text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">pin_drop</span>
                  <span>Terminal Guide (Maps Grounding)</span>
                </button>
              </div>
              <select
                value={droppingPoint}
                onChange={(e) => setDroppingPoint(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Hebbal Esteem Mall Flyover - 04:00 PM">
                  Hebbal Esteem Mall Flyover &ndash; 04:00 PM
                </option>
                <option value="Majestic KSRTC Terminal 1 - 04:30 PM">
                  Majestic KSRTC Terminal 1 &ndash; 04:30 PM
                </option>
                <option value="Shantinagar BMTC Depot - 05:00 PM">
                  Shantinagar BMTC Depot &ndash; 05:00 PM
                </option>
                <option value="Electronic City Toll Gate - 05:30 PM">
                  Electronic City Toll Gate &ndash; 05:30 PM
                </option>
              </select>
            </div>

            {/* Fare Breakdown */}
            <div className="pt-space-md border-t border-border-subtle flex flex-col gap-space-xs font-body-sm text-body-sm text-text-muted">
              <div className="flex items-center justify-between">
                <span>Base Fare ({selectedSeats.length} Berths)</span>
                <span className="text-on-surface font-medium">₹{baseFare}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST &amp; Safe Transit Surcharge (5%)</span>
                <span className="text-on-surface font-medium">₹{tax}</span>
              </div>
              {selectedSeats.length > 0 && (
                <div className="flex items-center justify-between text-status-success">
                  <span>College Student Privilege Pass</span>
                  <span className="font-bold">-₹{discount}</span>
                </div>
              )}
              <div className="pt-space-xs border-t border-border-subtle flex items-center justify-between font-headline-sm text-headline-sm font-bold text-on-surface">
                <span>Total Payable</span>
                <span className="text-primary">₹{totalPayable}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => onContinue(selectedSeats, boardingPoint, droppingPoint)}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3.5 rounded-xl font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedSeats.length > 0
                  ? 'bg-primary text-on-primary hover:bg-secondary shadow-lg shadow-primary/20'
                  : 'bg-surface-container text-text-muted cursor-not-allowed opacity-60'
              }`}
            >
              <span>Continue to Passenger Details</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-status-warning">
                  schedule
                </span>
                <span>Seats held for {formatTimer(secondsRemaining)} mins</span>
              </span>
              <span className="text-status-success font-medium">Free cancellation eligible</span>
            </div>
          </div>

          {/* Student Special Banner */}
          <div className="p-space-md rounded-2xl bg-gradient-to-r from-primary-container/15 to-surface-container-high border border-primary/20 flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <span className="font-label-md text-label-md font-bold text-primary">
                Intercity Student Special Applied
              </span>
              <p className="font-body-sm text-body-sm text-text-muted">
                Flat ₹100 instant waiver verified for university pass holders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
