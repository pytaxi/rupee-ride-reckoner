
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarTaxiFront, IndianRupee, Download, Plus } from 'lucide-react';
import TripEntryForm from './TripEntryForm';
import TripsList from './TripsList';
import { TaxiTrip } from '@/types/taxi';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

const TaxiTripManager = () => {
  const [trips, setTrips] = useState<TaxiTrip[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const addTrip = (trip: TaxiTrip) => {
    setTrips(prev => [...prev, { ...trip, id: Date.now().toString() }]);
    setShowForm(false);
    toast({
      title: "Trip Added Successfully! 🚕",
      description: "Your taxi trip has been recorded.",
    });
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
    toast({
      title: "Trip Deleted",
      description: "Trip has been removed from records.",
    });
  };

  const exportToExcel = () => {
    if (trips.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please add some trips before exporting.",
        variant: "destructive",
      });
      return;
    }

    const exportData = trips.map(trip => ({
      'Trip ID': trip.id,
      'Date': new Date(trip.date).toLocaleDateString('en-IN'),
      'From': trip.from,
      'To': trip.to,
      'Distance (km)': trip.distance,
      'Taxi Type': trip.taxiType,
      'Driver Name': trip.driverName,
      'Passenger Count': trip.passengerCount,
      'Base Fare (₹)': trip.baseFare,
      'Per KM Rate (₹)': trip.perKmRate,
      'Trip Amount (₹)': trip.tripAmount,
      'Diesel Rate (₹/L)': trip.dieselRate,
      'Fuel Consumed (L)': trip.fuelConsumed,
      'Diesel Expense (₹)': trip.dieselExpense,
      'Total Expense (₹)': trip.totalExpense,
      'Profit/Loss (₹)': trip.profit,
      'Remarks': trip.remarks || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Taxi Trips');

    // Add some styling to the Excel sheet
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "4F46E5" } }
      };
    }

    const fileName = `Taxi_Trips_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Excel Export Successful! 📊",
      description: `Downloaded ${fileName}`,
    });
  };

  const totalRevenue = trips.reduce((sum, trip) => sum + trip.tripAmount, 0);
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.totalExpense, 0);
  const totalProfit = trips.reduce((sum, trip) => sum + trip.profit, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <CarTaxiFront className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-800">Taxi Trip Manager</h1>
          <IndianRupee className="h-12 w-12 text-green-600" />
        </div>
        <p className="text-lg text-gray-600">Manage your taxi trips, expenses, and profits efficiently</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Total Expenses</p>
                <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString('en-IN')}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-red-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Net Profit</p>
                <p className="text-2xl font-bold">₹{totalProfit.toLocaleString('en-IN')}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Trips</p>
                <p className="text-2xl font-bold">{trips.length}</p>
              </div>
              <CarTaxiFront className="h-8 w-8 text-purple-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Trip
        </Button>
        
        <Button 
          onClick={exportToExcel}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
          size="lg"
          disabled={trips.length === 0}
        >
          <Download className="mr-2 h-5 w-5" />
          Export to Excel
        </Button>
      </div>

      {/* Trip Entry Form */}
      {showForm && (
        <TripEntryForm 
          onSubmit={addTrip}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Trips List */}
      <TripsList trips={trips} onDelete={deleteTrip} />
    </div>
  );
};

export default TaxiTripManager;
