/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProgressStepper } from './components/ProgressStepper';
import { SeatSelectionView } from './views/SeatSelectionView';
import { PassengerPaymentView } from './views/PassengerPaymentView';
import { ConfirmationTicketView } from './views/ConfirmationTicketView';
import { MyBookingsView } from './views/MyBookingsView';
import { HomeSearchView } from './views/HomeSearchView';
import { AboutUsView } from './views/AboutUsView';
import { HelpContactView } from './views/HelpContactView';
import { TerminalMapsModal } from './components/TerminalMapsModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { Seat, StepNumber, BookingRecord } from './types/transit';
import { auth, onAuthStateChanged, User } from './firebase';
import { SAMPLE_BOOKING, saveBookingToFirestore } from './services/bookingService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('search-tickets');
  const [currentStep, setCurrentStep] = useState<StepNumber>(2); // Default to Step 2: Select Seat as in Screen 1

  const [user, setUser] = useState<User | null>(null);

  // Selected seats state
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([
    {
      id: 'L4',
      deck: 'lower',
      price: 750,
      type: 'Middle',
      status: 'selected',
      label: 'L4',
      row: 2,
      col: 1,
    },
    {
      id: 'L5',
      deck: 'lower',
      price: 750,
      type: 'Window',
      status: 'selected',
      label: 'L5',
      row: 2,
      col: 2,
    },
  ]);

  const [boardingPoint, setBoardingPoint] = useState<string>('MGBS Platform 12 - 08:00 AM');
  const [droppingPoint, setDroppingPoint] = useState<string>(
    'Majestic KSRTC Terminal 1 - 04:30 PM'
  );

  // Current confirmed booking for Screen 3
  const [activeBooking, setActiveBooking] = useState<BookingRecord>(SAMPLE_BOOKING);

  // Google Maps Grounding Modal
  const [mapsModalOpen, setMapsModalOpen] = useState(false);
  const [mapsTargetTerminal, setMapsTargetTerminal] = useState('MGBS Platform 12');
  const [mapsTargetCity, setMapsTargetCity] = useState('Hyderabad');

  // Quick Search Modal
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openTerminalGuide = (terminalName: string, city: string) => {
    setMapsTargetTerminal(terminalName);
    setMapsTargetCity(city);
    setMapsModalOpen(true);
  };

  const handleContinueFromSeatSelection = (
    seats: Seat[],
    boarding: string,
    dropping: string
  ) => {
    setSelectedSeats(seats);
    setBoardingPoint(boarding);
    setDroppingPoint(dropping);
    setCurrentStep(3); // Go to Step 3: Passenger & Payment
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = async (booking: BookingRecord) => {
    // Save to Firestore
    await saveBookingToFirestore(booking);
    setActiveBooking(booking);
    setCurrentStep(4); // Go to Step 4: Confirmation Pass
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceFromHome = (service: any) => {
    setCurrentTab('search-tickets');
    setCurrentStep(2);
    setBoardingPoint(service.departureLoc || 'MGBS Platform 12 - 08:00 AM');
    setDroppingPoint(service.arrivalLoc || 'Majestic KSRTC Terminal 1 - 04:30 PM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Fixed Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'search-tickets' && currentStep === 4) {
            setCurrentStep(2);
          }
        }}
        user={user}
        onOpenQuickSearch={() => setQuickSearchOpen(true)}
        notificationCount={3}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'search-tickets' && (
          <>
            {/* Step Progress Stepper (Screens 1, 2, 3) */}
            <ProgressStepper
              currentStep={currentStep}
              onStepClick={(step) => setCurrentStep(step)}
              onBack={() => {
                if (currentStep === 3) setCurrentStep(2);
                if (currentStep === 4) setCurrentStep(3);
              }}
              origin="Hyderabad (MGBS)"
              destination="Bangalore (Majestic)"
              travelDate="Fri, 25 Sep 2026"
              departureTime="08:00 AM"
              arrivalTime="04:30 PM"
              duration="8h 30m"
              serviceName="Garuda Express Multi-Axle AC Sleeper (2+1)"
            />

            {/* Screen 1: Select Seat */}
            {currentStep === 2 && (
              <SeatSelectionView
                onContinue={handleContinueFromSeatSelection}
                onOpenTerminalGuide={openTerminalGuide}
              />
            )}

            {/* Screen 2: Passenger & Payment */}
            {currentStep === 3 && (
              <PassengerPaymentView
                selectedSeats={selectedSeats}
                boardingPoint={boardingPoint}
                droppingPoint={droppingPoint}
                user={user}
                onConfirmBooking={handleConfirmBooking}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {/* Screen 3: Booking Confirmed & Digital Pass */}
            {currentStep === 4 && (
              <ConfirmationTicketView
                booking={activeBooking}
                onReturnHome={() => {
                  setCurrentTab('home');
                }}
                onGoToMyBookings={() => {
                  setCurrentTab('my-bookings');
                }}
                onOpenTerminalGuide={openTerminalGuide}
              />
            )}
          </>
        )}

        {/* Home & Scheduled Coach Explorer */}
        {currentTab === 'home' && (
          <div className="pt-20">
            <HomeSearchView
              onSelectService={handleSelectServiceFromHome}
              onOpenTerminalGuide={openTerminalGuide}
            />
          </div>
        )}

        {/* My Bookings with Firestore Sync */}
        {currentTab === 'my-bookings' && (
          <div className="pt-20">
            <MyBookingsView
              user={user}
              onSelectBooking={(b) => {
                setActiveBooking(b);
                setCurrentTab('search-tickets');
                setCurrentStep(4);
              }}
              onNewBooking={() => {
                setCurrentTab('search-tickets');
                setCurrentStep(2);
              }}
              onOpenTerminalGuide={openTerminalGuide}
            />
          </div>
        )}

        {/* About Us View */}
        {currentTab === 'about-us' && (
          <div className="pt-20">
            <AboutUsView />
          </div>
        )}

        {/* Help & Contact View */}
        {currentTab === 'help-and-contact' && (
          <div className="pt-20">
            <HelpContactView />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* Google Maps Grounding Guidance Modal */}
      <TerminalMapsModal
        isOpen={mapsModalOpen}
        onClose={() => setMapsModalOpen(false)}
        terminalName={mapsTargetTerminal}
        cityName={mapsTargetCity}
      />

      {/* Quick Search Shortcut Modal */}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        onSelectRoute={(from, to) => {
          setCurrentTab('search-tickets');
          setCurrentStep(2);
        }}
        onOpenTerminalGuide={openTerminalGuide}
      />
    </div>
  );
}
