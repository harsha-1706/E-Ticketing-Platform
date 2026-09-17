import React, { useState } from 'react';
import { BookingRecord } from '../types/transit';

interface ConfirmationTicketViewProps {
  booking: BookingRecord;
  onReturnHome: () => void;
  onGoToMyBookings: () => void;
  onOpenTerminalGuide?: (terminalName: string, city: string) => void;
}

export const ConfirmationTicketView: React.FC<ConfirmationTicketViewProps> = ({
  booking,
  onReturnHome,
  onGoToMyBookings,
  onOpenTerminalGuide,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    setToastMessage(`Digital boarding pass dispatched to ${booking.contactPhone} via WhatsApp!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-margin py-space-xl flex flex-col gap-space-xl">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-status-success text-on-error px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 font-label-md animate-in fade-in slide-in-from-top duration-200">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Success Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-status-success/15 via-primary-container/10 to-surface-container p-space-lg border border-status-success/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md no-print shadow-sm">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-2xl bg-status-success text-on-primary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-3xl font-bold">check</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Booking Confirmed Successfully!
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-status-success text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                Instant Lock
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
              Booking Reference <strong className="text-on-surface font-mono">{booking.pnr}</strong>{' '}
              &bull; Confirmation email &amp; SMS dispatched to{' '}
              <strong className="text-on-surface">{booking.contactEmail}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-xs text-status-success font-label-md text-label-md bg-surface px-3 py-1.5 rounded-xl border border-status-success/20">
          <span className="material-symbols-outlined text-lg">shield</span>
          <span>Trip Insurance: Active &amp; Covered</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-space-sm no-print">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReturnHome}
            className="px-4 py-2 rounded-xl bg-surface-container font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Return to Search</span>
          </button>
          <button
            type="button"
            onClick={onGoToMyBookings}
            className="px-4 py-2 rounded-xl bg-surface-container font-label-md text-label-md text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">inventory</span>
            <span>View in My Bookings</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="px-4 py-2 rounded-xl bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366]/25 font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Send to WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download PDF Ticket</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-secondary font-label-md text-label-md font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Print Ticket</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Official Printable Digital E-Ticket Card */}
      <div
        id="printable-ticket"
        className="bg-surface-container-lowest rounded-3xl shadow-lg border-2 border-border-subtle overflow-hidden relative"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none text-9xl font-black rotate-[-25deg] text-primary">
          E-TICKET SECURE PASS
        </div>

        {/* Official Header Bar */}
        <div className="bg-primary text-on-primary px-space-xl py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-xl bg-surface/10 flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-2xl">confirmation_number</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] tracking-widest uppercase text-on-primary/80 block">
                Official Electronic Transit Pass
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-primary">
                National E-Ticket Transit Repository
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-success text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>Status: {booking.status}</span>
            </div>
            <p className="text-[11px] text-on-primary/80 mt-0.5">
              Issued on: {booking.bookingTimestamp}
            </p>
          </div>
        </div>

        {/* Ticket Body: Two Column Perforated Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 relative">
          {/* Left Main (8 cols): Journey, Operator, Passengers, Instructions */}
          <div className="lg:col-span-8 p-space-xl flex flex-col gap-space-lg">
            {/* Service & Coach Head */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-border-subtle">
              <div>
                <span className="px-2 py-0.5 rounded bg-primary-container/15 text-primary font-label-sm text-label-sm font-bold">
                  {booking.serviceName}
                </span>
                <p className="font-body-sm text-body-sm text-text-muted mt-1">
                  Coach No: <strong className="text-on-surface">{booking.coachNumber}</strong> &bull;{' '}
                  {booking.fleetNumber}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-text-muted">Travel Date</span>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {booking.travelDate}
                </h4>
              </div>
            </div>

            {/* Origin & Destination Banner */}
            <div className="p-space-md rounded-2xl bg-surface-container-low border border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-space-md items-center">
              <div>
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">
                  Departure Point
                </span>
                <h5 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                  {booking.departureTime}
                </h5>
                <p className="font-label-md text-label-md text-primary font-semibold">
                  {booking.origin}
                </p>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  {booking.boardingPoint}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-label-sm text-label-sm text-text-muted">
                  {booking.duration}
                </span>
                <div className="w-full max-w-[120px] h-0.5 bg-primary relative my-1.5">
                  <span className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-primary"></span>
                  <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <span className="font-label-sm text-[10px] text-primary uppercase font-bold">
                  Direct Multi-Axle
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">
                  Arrival Destination
                </span>
                <h5 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                  {booking.arrivalTime}
                </h5>
                <p className="font-label-md text-label-md text-primary font-semibold">
                  {booking.destination}
                </p>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  {booking.droppingPoint}
                </p>
              </div>
            </div>

            {/* Passenger & Berth Allocation Table */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">
                Passenger &amp; Berth Allocation
              </span>

              <div className="overflow-x-auto rounded-xl border border-border-subtle">
                <table className="w-full text-left text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-text-muted font-label-sm text-label-sm border-b border-border-subtle">
                      <th className="p-3">#</th>
                      <th className="p-3">Passenger Name</th>
                      <th className="p-3">Age / Gender</th>
                      <th className="p-3">Berth No</th>
                      <th className="p-3">Class</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-body-sm">
                    {booking.passengers.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-surface-container-low/50">
                        <td className="p-3 text-text-muted font-bold">{idx + 1}</td>
                        <td className="p-3 font-semibold text-on-surface">{p.name}</td>
                        <td className="p-3 text-text-muted">
                          {p.age} Yrs &bull; {p.gender}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded bg-primary text-on-primary font-bold text-xs">
                            {p.seatId}
                          </span>
                        </td>
                        <td className="p-3 text-text-muted">Lower AC Sleeper</td>
                        <td className="p-3 text-right">
                          <span className="text-status-success font-bold text-xs">CONFIRMED</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Essential Boarding Instructions */}
            <div className="p-space-md rounded-2xl bg-surface-container-low/50 border border-border-subtle flex flex-col gap-1.5 text-body-sm text-text-muted">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                Essential Boarding &amp; Transit Guidelines
              </span>
              <ul className="list-decimal pl-5 space-y-1 text-xs">
                <li>
                  Carry a government-issued photo identification (Aadhaar, Driving License, Passport, or Student ID).
                </li>
                <li>
                  Report to <strong>{booking.boardingPoint}</strong> at least 20 minutes prior to departure for boarding.
                </li>
                <li>
                  Luggage allowance includes up to 15 kg in the lower cargo bay per passenger.
                </li>
                <li>
                  Conductor handheld QR verification is valid without physical printout when presented on phone.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Stub (4 cols): PNR, Vector QR, Payment Breakdown */}
          <div className="lg:col-span-4 bg-surface-container-low/40 p-space-xl border-t lg:border-t-0 lg:border-l border-dashed border-border-subtle flex flex-col justify-between gap-space-lg relative">
            {/* PNR Box */}
            <div className="flex flex-col gap-space-sm text-center">
              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest font-bold">
                Ticket PNR Number
              </span>
              <div className="p-space-sm rounded-xl bg-surface border border-border-subtle font-mono text-xl font-bold text-primary tracking-wider shadow-sm">
                {booking.pnr}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-2 text-center my-auto">
              <div className="p-4 rounded-2xl bg-surface border-2 border-border-subtle shadow-md">
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" rx="8" />
                  {/* Position squares */}
                  <rect x="10" y="10" width="24" height="24" rx="4" fill="#004ac6" />
                  <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                  <rect x="18" y="18" width="8" height="8" rx="1" fill="#004ac6" />

                  <rect x="66" y="10" width="24" height="24" rx="4" fill="#004ac6" />
                  <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                  <rect x="74" y="18" width="8" height="8" rx="1" fill="#004ac6" />

                  <rect x="10" y="66" width="24" height="24" rx="4" fill="#004ac6" />
                  <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                  <rect x="18" y="74" width="8" height="8" rx="1" fill="#004ac6" />

                  {/* Matrix payload */}
                  <rect x="42" y="14" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="52" y="14" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="42" y="24" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="52" y="28" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#004ac6" />
                  <rect x="14" y="42" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="24" y="48" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="70" y="44" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="80" y="52" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="42" y="66" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="54" y="74" width="6" height="6" rx="1" fill="#0b1c30" />
                  <rect x="68" y="68" width="8" height="8" rx="1" fill="#0b1c30" />
                  <rect x="80" y="76" width="8" height="8" rx="1" fill="#0b1c30" />
                </svg>
              </div>
              <span className="font-label-sm text-[10px] text-text-muted uppercase font-bold tracking-widest">
                HMAC-SHA256 Conductor Handheld Ready
              </span>
            </div>

            {/* Payment Summary */}
            <div className="flex flex-col gap-1.5 p-space-md rounded-xl bg-surface border border-border-subtle text-body-sm text-text-muted">
              <div className="flex items-center justify-between">
                <span>Base Fare</span>
                <span className="text-on-surface font-medium">₹{booking.baseFare}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST &amp; Toll Surcharge</span>
                <span className="text-on-surface font-medium">₹{booking.tax}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transit Insurance</span>
                <span className="text-on-surface font-medium">₹{booking.insurance}</span>
              </div>
              <div className="flex items-center justify-between text-status-success font-medium">
                <span>Promo STUDENTGO</span>
                <span className="font-bold">-₹{booking.discount}</span>
              </div>
              <div className="pt-2 border-t border-border-subtle flex items-center justify-between font-headline-sm text-headline-sm font-bold text-on-surface">
                <span>Total Paid</span>
                <span className="text-primary">₹{booking.totalPaid}</span>
              </div>
              <div className="mt-1 pt-1 border-t border-border-subtle/60 text-[10px] text-text-muted font-mono truncate">
                Ref: {booking.paymentRef}
              </div>
            </div>

            {/* Official seal note */}
            <div className="text-center text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Issued under National E-Ticket Transit Repository &bull; Valid with Registered Photo ID
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
