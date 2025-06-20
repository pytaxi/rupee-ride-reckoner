
export interface TaxiTrip {
  id: string;
  date: string;
  vehicle: string; // Vehicle name/number
  destination: string;
  rentAmount: number;
  dieselAmount: number;
  remarks?: string;
}

export interface TaxiTypeConfig {
  name: string;
}

export const TAXI_TYPES = [
  'Sedan',
  'SUV', 
  'Hatchback',
  'Luxury',
  'Auto Rickshaw'
];
