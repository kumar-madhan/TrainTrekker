import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { nanoid } from 'nanoid';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingSteps from '@/components/booking/BookingSteps';
import SeatSelection from '@/components/booking/SeatSelection';
import PassengerDetails from '@/components/booking/PassengerDetails';
import Payment from '@/components/booking/Payment';
import Confirmation from '@/components/booking/Confirmation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { SeatData } from '@/lib/seatmapData';
import { RouteWithDetails } from '@shared/schema';

type PassengerData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
};

export default function BookingPage() {
  const [, params] = useRoute('/booking/:routeId');
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
  const [passengerData, setPassengerData] = useState<PassengerData | null>(null);
  const [bookingReference, setBookingReference] = useState('');
  
  const routeId = params?.routeId ? parseInt(params.routeId) : 0;
  
  // Fetch the route details
  const { data: route, isLoading, error } = useQuery<RouteWithDetails>({
    queryKey: ['/api/routes', routeId],
    enabled: routeId > 0,
  });

  useEffect(() => {
    // Generate a random booking reference for the demo
    setBookingReference(`BR${nanoid(6).toUpperCase()}`);
  }, []);

  const handleSeatSelection = (seats: SeatData[]) => {
    setSelectedSeats(seats);
    setCurrentStep(2);
  };

  const handlePassengerDetails = (data: PassengerData) => {
    setPassengerData(data);
    setCurrentStep(3);
  };

  const handlePayment = (paymentMethod: string) => {
    // In a real app, this would process the payment and create a booking
    setCurrentStep(4);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2">Loading booking details...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Booking</h2>
            <p className="text-gray-600">We couldn't load the booking details. Please try again.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900">Complete Your Booking</h2>
            <p className="text-gray-600 mt-1">
              {route.train.name}: {route.fromStation.name} to {route.toStation.name}
            </p>
          </div>
          
          {/* Booking Steps Progress */}
          <BookingSteps 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep}
          />
          
          {/* Step 1: Seat Selection */}
          {currentStep === 1 && (
            <SeatSelection 
              route={route} 
              onContinue={handleSeatSelection} 
            />
          )}
          
          {/* Step 2: Passenger Details */}
          {currentStep === 2 && selectedSeats.length > 0 && (
            <PassengerDetails 
              selectedSeats={selectedSeats} 
              onContinue={handlePassengerDetails} 
            />
          )}
          
          {/* Step 3: Payment */}
          {currentStep === 3 && passengerData && (
            <Payment 
              route={route} 
              onComplete={handlePayment} 
            />
          )}
          
          {/* Step 4: Confirmation */}
          {currentStep === 4 && passengerData && selectedSeats.length > 0 && (
            <Confirmation 
              route={route}
              selectedSeat={selectedSeats[0]} 
              bookingReference={bookingReference}
              passengerName={`${passengerData.firstName} ${passengerData.lastName}`}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
