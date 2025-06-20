
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CarTaxiFront, IndianRupee, Download, Plus } from 'lucide-react';
import TripEntryForm from './TripEntryForm';
import TripsList from './TripsList';
import { TaxiTrip } from '@/types/taxi';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

const TaxiTripManager = () => {
  const [trips, setTrips] = useState<TaxiTrip[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TaxiTrip | null>(null);
  const { toast } = useToast();

  const addOrUpdateTrip = (trip: TaxiTrip) => {
    if (editingTrip) {
      // Update existing trip
      setTrips(prev => prev.map(t => t.id === trip.id ? trip : t));
      toast({
        title: "Trip Updated Successfully! 🚕",
        description: "Your trip has been updated.",
      });
    } else {
      // Add new trip
      setTrips(prev => [...prev, { ...trip, id: Date.now().toString() }]);
      toast({
        title: "Trip Added Successfully! 🚕",
        description: "Your trip has been recorded.",
      });
    }
    setShowForm(false);
    setEditingTrip(null);
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
    toast({
      title: "Trip Deleted",
      description: "Trip has been removed from records.",
    });
  };

  const editTrip = (trip: TaxiTrip) => {
    setEditingTrip(trip);
    setShowForm(true);
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

    const exportData = trips.map(trip => {
      const netProfit = trip.rentAmount - trip.dieselAmount;
      return {
        'Date': new Date(trip.date).toLocaleDateString('en-IN'),
        'Vehicle': trip.vehicle,
        'From': trip.fromLocation,
        'To': trip.destination,
        'Rent Amount (₹)': trip.rentAmount,
        'Diesel Amount (₹)': trip.dieselAmount,
        'Balance Amount (₹)': trip.balanceAmount,
        'Net Profit (₹)': netProfit,
        'Remarks': trip.remarks || '-'
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Taxi Trips');

    const fileName = `Taxi_Trips_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Excel Export Successful! 📊",
      description: `Downloaded ${fileName}`,
    });
  };

  const totalRent = trips.reduce((sum, trip) => sum + trip.rentAmount, 0);
  const totalDiesel = trips.reduce((sum, trip) => sum + trip.dieselAmount, 0);
  const totalBalance = trips.reduce((sum, trip) => sum + trip.balanceAmount, 0);
  const totalProfit = totalRent - totalDiesel;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <CarTaxiFront className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-800">Taxi Trip Tracker</h1>
          <IndianRupee className="h-12 w-12 text-green-600" />
        </div>
        <p className="text-lg text-gray-600">Track your daily trips, rent, diesel expenses and customer balances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Rent</p>
                <p className="text-2xl font-bold">₹{totalRent.toLocaleString('en-IN')}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Total Diesel</p>
                <p className="text-2xl font-bold">₹{totalDiesel.toLocaleString('en-IN')}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-red-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Total Balance</p>
                <p className="text-2xl font-bold">₹{totalBalance.toLocaleString('en-IN')}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-yellow-100" />
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
          onClick={() => {
            setEditingTrip(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Trip
        </Button>
        
        <Button 
          onClick={exportToExcel}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg shadow-lg"
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
          onSubmit={addOrUpdateTrip}
          onCancel={() => {
            setShowForm(false);
            setEditingTrip(null);
          }}
          editingTrip={editingTrip}
        />
      )}

      {/* Trips List */}
      <TripsList trips={trips} onDelete={deleteTrip} onEdit={editTrip} />
    </div>
  );
};

export default TaxiTripManager;
