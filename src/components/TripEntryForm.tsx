
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, CarTaxiFront } from 'lucide-react';
import { TaxiTrip, TAXI_TYPES } from '@/types/taxi';

interface TripEntryFormProps {
  onSubmit: (trip: TaxiTrip) => void;
  onCancel: () => void;
  editingTrip?: TaxiTrip | null;
}

const TripEntryForm: React.FC<TripEntryFormProps> = ({ onSubmit, onCancel, editingTrip }) => {
  const [formData, setFormData] = useState({
    date: editingTrip?.date || new Date().toISOString().split('T')[0],
    vehicle: editingTrip?.vehicle || '',
    fromLocation: editingTrip?.fromLocation || '',
    destination: editingTrip?.destination || '',
    rentAmount: editingTrip?.rentAmount?.toString() || '',
    dieselAmount: editingTrip?.dieselAmount?.toString() || '',
    balanceAmount: editingTrip?.balanceAmount?.toString() || '',
    remarks: editingTrip?.remarks || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.vehicle || !formData.fromLocation || !formData.destination || !formData.rentAmount || !formData.dieselAmount) {
      alert('Please fill in all required fields');
      return;
    }

    const trip: TaxiTrip = {
      id: editingTrip?.id || '',
      date: formData.date,
      vehicle: formData.vehicle,
      fromLocation: formData.fromLocation,
      destination: formData.destination,
      rentAmount: parseFloat(formData.rentAmount),
      dieselAmount: parseFloat(formData.dieselAmount),
      balanceAmount: parseFloat(formData.balanceAmount) || 0,
      remarks: formData.remarks
    };

    onSubmit(trip);
  };

  const netProfit = (parseFloat(formData.rentAmount) || 0) - (parseFloat(formData.dieselAmount) || 0);

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CarTaxiFront className="h-6 w-6" />
          {editingTrip ? 'Edit Trip Details' : 'Add Trip Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="vehicle">Vehicle Type *</Label>
              <Select value={formData.vehicle} onValueChange={(value) => handleInputChange('vehicle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {TAXI_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromLocation">From Location *</Label>
              <Input
                id="fromLocation"
                placeholder="Starting point"
                value={formData.fromLocation}
                onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">To Location *</Label>
              <Input
                id="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentAmount">Rent Amount (₹) *</Label>
              <Input
                id="rentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.rentAmount}
                onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dieselAmount">Diesel Amount (₹) *</Label>
              <Input
                id="dieselAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.dieselAmount}
                onChange={(e) => handleInputChange('dieselAmount', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="balanceAmount">Balance Amount (₹)</Label>
              <Input
                id="balanceAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.balanceAmount}
                onChange={(e) => handleInputChange('balanceAmount', e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Positive: Customer owes you | Negative: You owe customer
              </p>
            </div>

            <div className="space-y-2">
              <Label>Net Profit</Label>
              <div className={`text-2xl font-bold p-3 rounded border ${netProfit >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                ₹{netProfit.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Additional notes"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              {editingTrip ? 'Update Trip' : 'Save Trip'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripEntryForm;
