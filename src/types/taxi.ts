
export interface TaxiTrip {
  id: string;
  date: string;
  vehicle: string;
  fromLocation: string;
  destination: string;
  rentAmount: number;
  dieselAmount: number;
  balanceAmount: number; // Amount customer owes or we owe them
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
