export type DeckType = 'lower' | 'upper';
export type SeatStatus = 'available' | 'selected' | 'booked' | 'ladies';
export type StepNumber = 1 | 2 | 3 | 4;

export interface Seat {
  id: string;
  deck: DeckType;
  price: number;
  type: 'Single' | 'Middle' | 'Window' | 'Aisle' | 'Ladies Only';
  status: SeatStatus;
  label: string;
  row: number;
  col: number; // 0 for left solo, 1 for middle, 2 for right window
}

export interface Passenger {
  id: string;
  name: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Other';
  seatId: string;
  seatType: string;
}

export interface StoppagePoint {
  name: string;
  time: string;
  address?: string;
  landmark?: string;
}

export interface BookingRecord {
  id: string;
  userId: string;
  pnr: string;
  serviceName: string;
  fleetNumber: string;
  coachNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  duration: string;
  boardingPoint: string;
  droppingPoint: string;
  seats: Array<{ id: string; price: number; type: string; deck: string }>;
  passengers: Passenger[];
  baseFare: number;
  tax: number;
  insurance: number;
  discount: number;
  totalPaid: number;
  paymentMethod: 'upi' | 'card' | 'net' | 'wallet';
  paymentRef: string;
  status: 'CONFIRMED' | 'CANCELLED';
  contactEmail: string;
  contactPhone: string;
  whatsappUpdates: boolean;
  bookingTimestamp: string;
  qrData?: string;
}
