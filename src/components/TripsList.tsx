
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, CarTaxiFront } from 'lucide-react';
import { TaxiTrip } from '@/types/taxi';

interface TripsListProps {
  trips: TaxiTrip[];
  onDelete: (id: string) => void;
}

const TripsList: React.FC<TripsListProps> = ({ trips, onDelete }) => {
  if (trips.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CarTaxiFront className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips recorded yet</h3>
          <p className="text-gray-500">Start by adding your first trip above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardTitle className="text-xl font-bold">Trip Records ({trips.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Vehicle</TableHead>
                <TableHead className="font-semibold">Destination</TableHead>
                <TableHead className="font-semibold">Rent Amount</TableHead>
                <TableHead className="font-semibold">Diesel Amount</TableHead>
                <TableHead className="font-semibold">Net Profit</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => {
                const netProfit = trip.rentAmount - trip.dieselAmount;
                return (
                  <TableRow key={trip.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {new Date(trip.date).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {trip.vehicle}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{trip.destination}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{trip.rentAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                      ₹{trip.dieselAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{netProfit.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(trip.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripsList;
