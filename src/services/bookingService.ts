import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from '../firebase';
import { BookingRecord } from '../types/transit';

const BOOKINGS_COLLECTION = 'bookings';

// Seed initial sample booking if collection is empty
export const SAMPLE_BOOKING: BookingRecord = {
  id: 'ET-94827104',
  userId: 'default-user',
  pnr: 'ET-94827104',
  serviceName: 'Garuda Express Premium AC Multi-Axle Sleeper',
  fleetNumber: '#HYD-BLR-8840 • Volvo B11R Multi-Axle',
  coachNumber: 'TS-09-UB-4022 (2+1 BharatBenz)',
  origin: 'Hyderabad (MGBS)',
  destination: 'Bangalore (Majestic)',
  departureTime: '08:00 AM',
  arrivalTime: '04:30 PM',
  travelDate: 'Fri, 25 Sep 2026',
  duration: '8h 30m',
  boardingPoint: 'MGBS Platform 12 - 08:00 AM',
  droppingPoint: 'Majestic KSRTC Terminal 1 - 04:30 PM',
  seats: [
    { id: 'L4', price: 750, type: 'Lower Middle', deck: 'lower' },
    { id: 'L5', price: 750, type: 'Lower Window', deck: 'lower' },
  ],
  passengers: [
    {
      id: 'p1',
      name: 'John Doe',
      age: 24,
      gender: 'Male',
      seatId: 'L4',
      seatType: 'Seat L4 - Lower Sleeper',
    },
    {
      id: 'p2',
      name: 'Sarah Jenkins',
      age: 23,
      gender: 'Female',
      seatId: 'L5',
      seatType: 'Seat L5 - Lower Sleeper',
    },
  ],
  baseFare: 1500,
  tax: 75,
  insurance: 35,
  discount: 100,
  totalPaid: 1510,
  paymentMethod: 'upi',
  paymentRef: 'UPI: 20260921/847291',
  status: 'CONFIRMED',
  contactEmail: 'john.doe@university.edu',
  contactPhone: '+91 98765 43210',
  whatsappUpdates: true,
  bookingTimestamp: '21 Sep 2026, 14:32 IST',
  qrData: 'SEC-VER-88219-OK • HMAC-SHA256 • ET-94827104',
};

export async function saveBookingToFirestore(booking: BookingRecord): Promise<string> {
  try {
    const colRef = collection(db, BOOKINGS_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...booking,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving booking to Firestore:', error);
    // Persist to local fallback if network / permission fails
    const local = JSON.parse(localStorage.getItem('eticket_bookings') || '[]');
    local.unshift(booking);
    localStorage.setItem('eticket_bookings', JSON.stringify(local));
    return booking.id;
  }
}

export async function getBookingsFromFirestore(userId?: string): Promise<BookingRecord[]> {
  try {
    const colRef = collection(db, BOOKINGS_COLLECTION);
    let q = query(colRef, orderBy('createdAt', 'desc'));
    if (userId) {
      q = query(colRef, where('userId', 'in', [userId, 'guest', 'default-user']));
    }
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      }));
    }
  } catch (error) {
    console.warn('Error fetching from Firestore, loading local fallback:', error);
  }

  // Fallback to local storage or sample booking
  const local = localStorage.getItem('eticket_bookings');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return [SAMPLE_BOOKING];
}

export async function cancelBookingInFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(docRef, { status: 'CANCELLED' });
    return true;
  } catch (error) {
    console.warn('Error updating cancellation in Firestore, updating locally:', error);
    const local = JSON.parse(localStorage.getItem('eticket_bookings') || '[]');
    const updated = local.map((b: BookingRecord) =>
      b.id === id ? { ...b, status: 'CANCELLED' } : b
    );
    localStorage.setItem('eticket_bookings', JSON.stringify(updated));
    return true;
  }
}
