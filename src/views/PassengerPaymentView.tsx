import React, { useState, useEffect } from 'react';
import { Seat, Passenger, BookingRecord } from '../types/transit';
import { User } from '../firebase';

interface PassengerPaymentViewProps {
  selectedSeats: Seat[];
  boardingPoint: string;
  droppingPoint: string;
  user: User | null;
  onConfirmBooking: (booking: BookingRecord) => Promise<void>;
  onBack: () => void;
}

export const PassengerPaymentView: React.FC<PassengerPaymentViewProps> = ({
  selectedSeats,
  boardingPoint,
  droppingPoint,
  user,
  onConfirmBooking,
  onBack,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(578);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize passengers based on selected seats
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    return selectedSeats.map((seat, index) => {
      if (index === 0) {
        return {
          id: `p-${seat.id}`,
          name: user?.displayName || 'John Doe',
          age: 24,
          gender: 'Male',
          seatId: seat.id,
          seatType: `Seat ${seat.label} - ${seat.deck === 'lower' ? 'Lower' : 'Upper'} Sleeper`,
        };
      }
      return {
        id: `p-${seat.id}`,
        name: 'Sarah Jenkins',
        age: 23,
        gender: 'Female',
        seatId: seat.id,
        seatType: `Seat ${seat.label} - ${seat.deck === 'lower' ? 'Lower' : 'Upper'} Sleeper`,
      };
    });
  });

  const [contactEmail, setContactEmail] = useState(
    user?.email || 'john.doe@university.edu'
  );
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Payment tab state
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'net' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(true);

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8892');
  const [cardName, setCardName] = useState('JOHN DOE');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Calculations
  const baseFare = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const insurance = 35;
  const tax = Math.round(baseFare * 0.05); // ₹75
  const discount = 100; // Promo STUDENTGO
  const totalAmount = baseFare + insurance + tax - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passengers.some((p) => !p.name.trim())) {
      alert('Please enter names for all passengers');
      return;
    }

    try {
      setIsSubmitting(true);
      const randomRef = Math.floor(100000 + Math.random() * 900000);
      const generatedPnr = `ET-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const booking: BookingRecord = {
        id: generatedPnr,
        userId: user?.uid || 'default-user',
        pnr: generatedPnr,
        serviceName: 'Garuda Express Premium AC Multi-Axle Sleeper',
        fleetNumber: '#HYD-BLR-8840 • Volvo B11R Multi-Axle',
        coachNumber: 'TS-09-UB-4022 (2+1 BharatBenz)',
        origin: 'Hyderabad (MGBS)',
        destination: 'Bangalore (Majestic)',
        departureTime: '08:00 AM',
        arrivalTime: '04:30 PM',
        travelDate: 'Fri, 25 Sep 2026',
        duration: '8h 30m',
        boardingPoint,
        droppingPoint,
        seats: selectedSeats.map((s) => ({
          id: s.id,
          price: s.price,
          type: `${s.deck === 'lower' ? 'Lower' : 'Upper'} ${s.type}`,
          deck: s.deck,
        })),
        passengers,
        baseFare,
        tax,
        insurance,
        discount,
        totalPaid: totalAmount,
        paymentMethod: paymentTab,
        paymentRef: `${paymentTab.toUpperCase()}: 20260925/${randomRef}`,
        status: 'CONFIRMED',
        contactEmail,
        contactPhone,
        whatsappUpdates,
        bookingTimestamp: '25 Sep 2026, 08:14 IST',
        qrData: `SEC-VER-88219-OK • HMAC-SHA256 • ${generatedPnr}`,
      };

      await onConfirmBooking(booking);
    } catch (err) {
      console.error('Error confirming booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-margin py-space-xl">
      {/* Session Expire & Demand Alert Bar */}
      <div className="mb-space-lg p-space-md rounded-2xl bg-primary-container/15 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm text-primary">
          <span className="material-symbols-outlined text-xl">timer</span>
          <span className="font-label-md text-label-md font-bold">
            Seats locked temporarily for checkout. Session expires in:{' '}
            <span className="text-status-danger font-mono font-bold text-sm">
              {formatTimer(secondsRemaining)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-space-xs text-status-warning font-label-sm text-label-sm font-semibold">
          <span className="material-symbols-outlined text-base">trending_up</span>
          <span>High Transit Demand: 4 other travelers looking at this service</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column (8 cols): Passenger Details & Payment Methods */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Card 1: Passenger Details */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-border-subtle flex flex-col gap-space-lg">
            <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Passenger Details
                </h2>
                <p className="font-body-sm text-body-sm text-text-muted">
                  {selectedSeats.length} Seats Allocated &bull; Garuda Express Premium AC Sleeper
                </p>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">group</span>
            </div>

            {/* Form for each passenger */}
            <div className="flex flex-col gap-space-lg">
              {passengers.map((passenger, index) => (
                <div
                  key={passenger.id}
                  className="p-space-md rounded-xl bg-surface-container-low/60 border border-border-subtle flex flex-col gap-space-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">person</span>
                      Passenger {index + 1} ({passenger.seatType})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">
                      Seat {passenger.seatId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-md mt-1">
                    {/* Legal Name */}
                    <div className="sm:col-span-6 flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-text-muted">
                        Full Legal Name (as on Govt ID)
                      </label>
                      <input
                        type="text"
                        required
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                        placeholder="e.g. John Doe"
                        className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Age */}
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-text-muted">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        value={passenger.age}
                        onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                        className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-center"
                      />
                    </div>

                    {/* Gender Pills */}
                    <div className="sm:col-span-4 flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-text-muted">Gender</label>
                      <div className="grid grid-cols-3 gap-1 h-[42px]">
                        {(['Male', 'Female', 'Other'] as const).map((gender) => (
                          <button
                            type="button"
                            key={gender}
                            onClick={() => updatePassenger(index, 'gender', gender)}
                            className={`rounded-lg font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                              passenger.gender === gender
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'bg-surface border border-border-subtle text-on-surface-variant hover:bg-surface-container'
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information & WhatsApp Alert */}
            <div className="pt-space-md border-t border-border-subtle flex flex-col gap-space-md">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                Contact &amp; Digital Boarding Pass Delivery
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-text-muted">
                    Email Address (Ticket Dispatch)
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-text-muted">
                    Mobile Phone Number (SMS &amp; Emergency)
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-on-surface text-body-sm font-body-sm select-none">
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
                />
                <span>
                  Send real-time trip status updates, delay alerts, and live coach tracking via
                  WhatsApp
                </span>
              </label>
            </div>
          </div>

          {/* Card 2: Select Payment Method */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-border-subtle flex flex-col gap-space-lg">
            <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Select Payment Method
                </h2>
                <p className="font-body-sm text-body-sm text-text-muted">
                  End-to-End Encrypted &bull; Instant Ticket Generation
                </p>
              </div>
              <span className="material-symbols-outlined text-status-success text-2xl">
                lock
              </span>
            </div>

            {/* Payment Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentTab === 'upi'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/20'
                    : 'border-border-subtle bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">qr_code_2</span>
                <span className="font-label-md text-label-md font-bold">UPI &amp; QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentTab === 'card'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/20'
                    : 'border-border-subtle bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">credit_card</span>
                <span className="font-label-md text-label-md font-bold">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('net')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentTab === 'net'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/20'
                    : 'border-border-subtle bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">account_balance</span>
                <span className="font-label-md text-label-md font-bold">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('wallet')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentTab === 'wallet'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/20'
                    : 'border-border-subtle bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                <span className="font-label-md text-label-md font-bold">Campus Wallet</span>
              </button>
            </div>

            {/* Tab 1: UPI & QR Content */}
            {paymentTab === 'upi' && (
              <div className="p-space-md rounded-2xl bg-surface-container-low/60 border border-border-subtle flex flex-col md:flex-row items-center gap-space-lg">
                {/* QR Visual */}
                <div className="flex flex-col items-center gap-2 p-3 bg-surface rounded-xl border border-border-subtle shadow-sm">
                  {/* Generated clean SVG QR visual */}
                  <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" rx="8" />
                    {/* QR Finder patterns */}
                    <rect x="10" y="10" width="24" height="24" rx="4" fill="#004ac6" />
                    <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                    <rect x="18" y="18" width="8" height="8" rx="1" fill="#004ac6" />

                    <rect x="66" y="10" width="24" height="24" rx="4" fill="#004ac6" />
                    <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                    <rect x="74" y="18" width="8" height="8" rx="1" fill="#004ac6" />

                    <rect x="10" y="66" width="24" height="24" rx="4" fill="#004ac6" />
                    <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                    <rect x="18" y="74" width="8" height="8" rx="1" fill="#004ac6" />

                    {/* QR Data Dots */}
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
                  <span className="font-label-sm text-label-sm text-text-muted">
                    Scan with Any UPI App
                  </span>
                </div>

                {/* VPA Input */}
                <div className="flex-1 flex flex-col gap-space-sm w-full">
                  <label className="font-label-sm text-label-sm text-text-muted">
                    Or Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiVerified(true);
                      }}
                      placeholder="e.g. mobile@upi"
                      className="flex-1 p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setUpiVerified(true)}
                      className="px-4 py-2 rounded-xl bg-surface-container font-label-md text-label-md font-bold text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      {upiVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>

                  {upiVerified && (
                    <div className="flex items-center gap-1.5 text-xs text-status-success font-medium">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>VPA verified for John Doe. Tap Confirm Booking to authorize payment.</span>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-border-subtle flex items-center gap-space-md text-text-muted text-[11px]">
                    <span>Supported apps:</span>
                    <span className="font-bold text-on-surface">GPay</span>
                    <span className="font-bold text-on-surface">PhonePe</span>
                    <span className="font-bold text-on-surface">Paytm</span>
                    <span className="font-bold text-on-surface">BHIM</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Cards */}
            {paymentTab === 'card' && (
              <div className="p-space-md rounded-2xl bg-surface-container-low/60 border border-border-subtle flex flex-col gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-text-muted">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
                  <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-text-muted">Cardholder</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-text-muted">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-text-muted">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="p-2.5 rounded-xl border border-border-subtle bg-surface font-body-md text-body-md text-on-surface text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Net Banking */}
            {paymentTab === 'net' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                  <div
                    key={bank}
                    className="p-3 rounded-xl border border-border-subtle bg-surface text-center font-label-md text-label-md text-on-surface font-semibold hover:border-primary cursor-pointer"
                  >
                    {bank}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Campus Wallet */}
            {paymentTab === 'wallet' && (
              <div className="p-space-md rounded-2xl bg-surface-container-low/60 border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      University Student SmartPass Wallet
                    </span>
                    <p className="font-body-sm text-body-sm text-text-muted">
                      Available Balance: <strong className="text-status-success">₹2,450.00</strong>
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-status-success/20 text-status-success font-label-sm text-label-sm font-bold">
                  Sufficient Balance
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="material-symbols-outlined text-sm text-status-success">
                shield_with_heart
              </span>
              <span>256-Bit Encrypted Secure Payment gateway &bull; Powered by Razorpay/Stripe</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Ticket Stub Journey Summary */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg sticky top-20">
          <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-border-subtle overflow-hidden relative">
            {/* Top Ticket Head */}
            <div className="p-space-lg pb-space-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">
                  Garuda Express Premium
                </span>
                <span className="font-label-sm text-label-sm text-text-muted">Direct Sleeper</span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    HYD 08:00 AM
                  </span>
                  <p className="text-[11px] text-text-muted">MGBS Central</p>
                </div>
                <span className="material-symbols-outlined text-primary text-lg">arrow_forward</span>
                <div className="text-right">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    BLR 04:30 PM
                  </span>
                  <p className="text-[11px] text-text-muted">Majestic Stand</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted pt-1">
                <span>Reserved Berths:</span>
                <span className="font-bold text-on-surface">
                  {selectedSeats.map((s) => s.label).join(', ')} (Lower Sleeper)
                </span>
              </div>
            </div>

            {/* Perforated Stub Line with Circular Cutouts */}
            <div className="relative py-2 flex items-center justify-between">
              {/* Left Cutout */}
              <div className="w-5 h-5 rounded-full bg-background border-r border-border-subtle -ml-2.5 shadow-inner" />
              {/* Dashed Line */}
              <div className="flex-1 border-t-2 border-dashed border-border-subtle mx-2" />
              {/* Right Cutout */}
              <div className="w-5 h-5 rounded-full bg-background border-l border-border-subtle -mr-2.5 shadow-inner" />
            </div>

            {/* Bottom Ticket Body & Fare */}
            <div className="p-space-lg pt-space-md flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-text-muted">
                <div className="flex items-center justify-between">
                  <span>Base Ticket Fare</span>
                  <span className="text-on-surface font-medium">₹{baseFare}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform &amp; Transit Insurance</span>
                  <span className="text-on-surface font-medium">₹{insurance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST &amp; Surcharges (5%)</span>
                  <span className="text-on-surface font-medium">₹{tax}</span>
                </div>
                <div className="flex items-center justify-between text-status-success font-medium">
                  <span>Promo STUDENTGO</span>
                  <span className="font-bold">-₹{discount}</span>
                </div>
                <div className="pt-space-xs border-t border-border-subtle flex items-center justify-between font-headline-md text-headline-md font-bold text-on-surface">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>

              {/* Pay & Confirm CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming with Firestore...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">verified</span>
                    <span>Pay ₹{totalAmount} &amp; Confirm Booking</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-status-success font-medium flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-xs">check</span>
                  <span>Guaranteed Free Cancellation up to 4 hrs before departure</span>
                </span>
              </div>
            </div>
          </div>

          {/* Helpline box */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-border-subtle flex items-center gap-space-md">
            <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
            <div>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                Need Help with Payment?
              </span>
              <p className="font-body-sm text-body-sm text-text-muted">
                Toll-free 24x7 Transit Desk:{' '}
                <strong className="text-on-surface">1800-420-ETICK</strong>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
