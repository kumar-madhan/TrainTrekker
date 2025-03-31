import { useState } from 'react';
import { useLocation } from 'wouter';
import { Check, Download, Home, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RouteWithDetails } from '@shared/schema';
import { SeatData, formatSeatId } from '@/lib/seatmapData';

interface ConfirmationProps {
  route: RouteWithDetails;
  selectedSeat: SeatData;
  bookingReference: string;
  passengerName: string;
}

export default function Confirmation({ 
  route, 
  selectedSeat, 
  bookingReference, 
  passengerName 
}: ConfirmationProps) {
  const [, setLocation] = useLocation();
  
  const handlePrintTicket = () => {
    window.print();
  };

  const handleReturnHome = () => {
    setLocation('/');
  };

  // Format date for display (assuming route.date is YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600">Your ticket has been sent to your email.</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-medium mb-4 text-lg">Booking Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Booking Reference</div>
              <div className="font-medium">#{bookingReference}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Train</div>
              <div className="font-medium">{route.train.name} #{route.train.trainNumber}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Date & Time</div>
              <div className="font-medium">{formatDate(route.date)} • {route.departureTime} - {route.arrivalTime}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Seat</div>
              <div className="font-medium">{formatSeatId(selectedSeat.seatId)}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">From - To</div>
              <div className="font-medium">{route.fromStation.name} - {route.toStation.name}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Passenger</div>
              <div className="font-medium">{passengerName}</div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-lg">E-Ticket</h4>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={handlePrintTicket}
              >
                <Printer className="mr-1 h-4 w-4" /> Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
              >
                <Download className="mr-1 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="font-heading font-semibold text-lg">{route.train.name}</div>
              <div className="text-sm text-gray-600">{route.fromStation.name} to {route.toStation.name}</div>
              <div className="text-sm">
                <span className="font-medium">{formatDate(route.date)}</span> • {route.departureTime} - {route.arrivalTime}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2">
                {/* QR Code will be replaced in a real app with a real QR code generator */}
                <div className="w-24 h-24 bg-white border border-gray-300 flex items-center justify-center">
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,40 L0,40 Z M10,10 L10,30 L30,30 L30,10 Z M20,20 L20,20" stroke="black" fill="none" strokeWidth="5"></path>
                    <path d="M50,0 L90,0 L90,40 L50,40 Z M60,10 L60,30 L80,30 L80,10 Z M70,20 L70,20" stroke="black" fill="none" strokeWidth="5"></path>
                    <path d="M0,50 L40,50 L40,90 L0,90 Z M10,60 L10,80 L30,80 L30,60 Z M20,70 L20,70" stroke="black" fill="none" strokeWidth="5"></path>
                    <path d="M50,50 L50,60 L60,60 L60,50 Z M70,50 L90,50 L90,70 L70,70 Z M50,70 L60,70 L60,90 L80,90 L80,80 L70,80 L70,90 L50,90 Z M90,80 L90,90 L80,90" stroke="black" fill="none" strokeWidth="5"></path>
                  </svg>
                </div>
              </div>
              <div className="text-xs text-gray-500">#{bookingReference}</div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <Button onClick={handleReturnHome} className="bg-primary-600 hover:bg-primary-700">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <div>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-800">Need help? Contact support</a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
