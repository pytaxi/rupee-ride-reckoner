
export interface TaxiTrip {
  id: string;
  date: string;
  from: string;
  to: string;
  distance: number;
  taxiType: 'Sedan' | 'SUV' | 'Hatchback' | 'Luxury' | 'Auto Rickshaw';
  driverName: string;
  passengerCount: number;
  baseFare: number;
  perKmRate: number;
  tripAmount: number;
  dieselRate: number;
  fuelConsumed: number;
  dieselExpense: number;
  totalExpense: number;
  profit: number;
  remarks?: string;
}

export interface TaxiTypeConfig {
  mileage: number; // km per liter
  baseRate: number; // per km
  baseFare: number;
}

export const TAXI_CONFIGS: Record<string, TaxiTypeConfig> = {
  'Sedan': { mileage: 15, baseRate: 12, baseFare: 50 },
  'SUV': { mileage: 12, baseRate: 15, baseFare: 70 },
  'Hatchback': { mileage: 18, baseRate: 10, baseFare: 40 },
  'Luxury': { mileage: 10, baseRate: 25, baseFare: 100 },
  'Auto Rickshaw': { mileage: 25, baseRate: 8, baseFare: 25 }
};
