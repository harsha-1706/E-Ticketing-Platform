import React, { useState, useEffect } from 'react';
import { BookingRecord } from '../types/transit';
import { getBookingsFromFirestore, cancelBookingInFirestore } from '../services/bookingService';
import { User } from '../firebase';

interface MyBookingsViewProps {
  user: User | null;
  onSelectBooking: (booking: BookingRecord) => void;
  onNewBooking: () => void;
  onOpenTerminalGuide: (terminal: string, city: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  user,
  onSelectBooking,
  onNewBooking,
  onOpenTerminalGuide,
}) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const records = await getBookingsFromFirestore(user?.uid);
        setBookings(records);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleCancel = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this reservation? Full refund will be processed to original payment method.')) {
      await cancelBookingInFirestore(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
      );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-margin py-space-xl flex flex-col gap-space-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md border-b border-border-subtle">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            My Bookings &amp; Passes
          </h1>
          <p className="font-body-sm text-body-sm text-text-muted">
            Synchronized with Firebase Firestore &bull; Real-Time Verified Transit Archive
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-border-subtle">
            {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onNewBooking}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Book New Ticket</span>
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-space-md text-text-muted">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body-md text-body-md">Connecting to Firestore and fetching bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-space-md text-center bg-surface-container-lowest rounded-3xl border border-dashed border-border-subtle p-space-2xl">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-text-muted">
            <span className="material-symbols-outlined text-3xl">confirmation_number</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              No reservations found
            </h3>
            <p className="font-body-sm text-body-sm text-text-muted max-w-sm mt-1">
              You do not have any {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings at the moment.
            </p>
          </div>
          <button
            type="button"
            onClick={onNewBooking}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-colors cursor-pointer"
          >
            Reserve Your Seats Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredBookings.map((b) => {
            const isCancelled = b.status === 'CANCELLED';
            return (
              <div
                key={b.id}
                onClick={() => onSelectBooking(b)}
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-border-subtle hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between gap-space-md cursor-pointer group relative overflow-hidden"
              >
                {/* Top Status & PNR */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-text-muted block">PNR NUMBER</span>
                    <span className="font-mono text-base font-bold text-primary group-hover:underline">
                      {b.pnr}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-status-danger/15 text-status-danger'
                        : 'bg-status-success/15 text-status-success'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* Journey & Operator */}
                <div>
                  <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {b.origin} &rarr; {b.destination}
                  </h4>
                  <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                    {b.serviceName}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-on-surface font-medium bg-surface-container-low p-2 rounded-lg">
                    <span>
                      {b.travelDate} &bull; {b.departureTime}
                    </span>
                    <span>
                      {b.seats.length} Seat{b.seats.length > 1 ? 's' : ''} ({b.seats.map((s) => s.id).join(', ')})
                    </span>
                  </div>
                </div>

                {/* Stoppages */}
                <div className="text-[11px] text-text-muted flex flex-col gap-1 border-t border-border-subtle pt-2">
                  <div className="truncate">
                    <strong>Boarding:</strong> {b.boardingPoint}
                  </div>
                  <div className="truncate">
                    <strong>Dropping:</strong> {b.droppingPoint}
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold">Total Paid</span>
                    <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      ₹{b.totalPaid}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Google Maps grounding trigger */}
                    <button
                      type="button"
                      title="Explore Terminal on Google Maps"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTerminalGuide(b.boardingPoint, b.origin);
                      }}
                      className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">pin_drop</span>
                    </button>

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={(e) => handleCancel(b.id, e)}
                        className="px-2.5 py-1.5 rounded-lg border border-status-danger/30 text-status-danger hover:bg-status-danger/10 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectBooking(b)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-secondary transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Pass</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
