
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Save, X } from 'lucide-react';
import { TaxiTrip, TAXI_CONFIGS } from '@/types/taxi';

interface TripEntryFormProps {
  onSubmit: (trip: TaxiTrip) => void;
  onCancel: () => void;
}

const TripEntryForm: React.FC<TripEntryFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    from: '',
    to: '',
    distance: '',
    taxiType: '',
    driverName: '',
    passengerCount: '1',
    dieselRate: '95',
    remarks: ''
  });

  const [calculations, setCalculations] = useState({
    baseFare: 0,
    perKmRate: 0,
    tripAmount: 0,
    fuelConsumed: 0,
    dieselExpense: 0,
    totalExpense: 0,
    profit: 0
  });

  useEffect(() => {
    if (formData.taxiType && formData.distance) {
      const config = TAXI_CONFIGS[formData.taxiType];
      const distance = parseFloat(formData.distance) || 0;
      const dieselRate = parseFloat(formData.dieselRate) || 0;

      const baseFare = config.baseFare;
      const perKmRate = config.baseRate;
      const tripAmount = baseFare + (distance * perKmRate);
      const fuelConsumed = distance / config.mileage;
      const dieselExpense = fuelConsumed * dieselRate;
      const totalExpense = dieselExpense;
      const profit = tripAmount - totalExpense;

      setCalculations({
        baseFare,
        perKmRate,
        tripAmount,
        fuelConsumed,
        dieselExpense,
        totalExpense,
        profit
      });
    }
  }, [formData.taxiType, formData.distance, formData.dieselRate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.from || !formData.to || !formData.distance || !formData.taxiType || !formData.driverName) {
      alert('Please fill in all required fields');
      return;
    }

    const trip: TaxiTrip = {
      id: '',
      date: formData.date,
      from: formData.from,
      to: formData.to,
      distance: parseFloat(formData.distance),
      taxiType: formData.taxiType as any,
      driverName: formData.driverName,
      passengerCount: parseInt(formData.passengerCount),
      baseFare: calculations.baseFare,
      perKmRate: calculations.perKmRate,
      tripAmount: calculations.tripAmount,
      dieselRate: parseFloat(formData.dieselRate),
      fuelConsumed: calculations.fuelConsumed,
      dieselExpense: calculations.dieselExpense,
      totalExpense: calculations.totalExpense,
      profit: calculations.profit,
      remarks: formData.remarks
    };

    onSubmit(trip);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          New Trip Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Trip Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from">From *</Label>
              <Input
                id="from"
                placeholder="Starting location"
                value={formData.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To *</Label>
              <Input
                id="to"
                placeholder="Destination"
                value={formData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km) *</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxiType">Taxi Type *</Label>
              <Select value={formData.taxiType} onValueChange={(value) => handleInputChange('taxiType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select taxi type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(TAXI_CONFIGS).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name *</Label>
              <Input
                id="driverName"
                placeholder="Driver's name"
                value={formData.driverName}
                onChange={(e) => handleInputChange('driverName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengerCount">Passengers</Label>
              <Input
                id="passengerCount"
                type="number"
                min="1"
                value={formData.passengerCount}
                onChange={(e) => handleInputChange('passengerCount', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dieselRate">Diesel Rate (₹/L)</Label>
              <Input
                id="dieselRate"
                type="number"
                step="0.01"
                value={formData.dieselRate}
                onChange={(e) => handleInputChange('dieselRate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Additional notes or comments"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows={3}
            />
          </div>

          {/* Calculations Display */}
          {formData.taxiType && formData.distance && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Trip Calculations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Base Fare</p>
                  <p className="text-xl font-bold text-blue-600">₹{calculations.baseFare}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Trip Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{calculations.tripAmount.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Diesel Expense</p>
                  <p className="text-xl font-bold text-red-600">₹{calculations.dieselExpense.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Profit</p>
                  <p className={`text-xl font-bold ${calculations.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{calculations.profit.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Save Trip
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripEntryForm;
