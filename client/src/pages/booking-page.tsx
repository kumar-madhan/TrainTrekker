import { useState } from "react";
import { useLocation, useNavigate } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SeatSelection from "@/components/booking/seat-selection";
import PassengerInfo from "@/components/booking/passenger-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, Train, ArrowLeft, ArrowRight } from "lucide-react";
import { Steps, Step } from "@/components/ui/steps";

export default function BookingPage() {
  const [location] = useLocation();
  const [navigate] = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerInfo, setPassengerInfo] = useState<any>(null);
  
  // Parse query params
  const queryParams = new URLSearchParams(location.split("?")[1] || "");
  const scheduleId = parseInt(queryParams.get("schedule") || "0");
  const passengerCount = parseInt(queryParams.get("passengers") || "1");
  
  // Fetch schedule data
  const { data: schedule, isLoading, error } = useQuery({
    queryKey: [`/api/schedules/${scheduleId}`],
    enabled: scheduleId > 0
  });
  
  // Fetch train data once schedule is loaded
  const { data: train } = useQuery({
    queryKey: [`/api/trains/${schedule?.trainId}`],
    enabled: !!schedule?.trainId
  });
  
  // Fetch departure station data
  const { data: departureRoute } = useQuery({
    queryKey: [`/api/routes/${schedule?.routeId}`],
    enabled: !!schedule?.routeId
  });
  
  // Fetch departure station data
  const { data: departureStation } = useQuery({
    queryKey: [`/api/stations/${departureRoute?.departureStationId}`],
    enabled: !!departureRoute?.departureStationId
  });
  
  // Fetch arrival station data
  const { data: arrivalStation } = useQuery({
    queryKey: [`/api/stations/${departureRoute?.arrivalStationId}`],
    enabled: !!departureRoute?.arrivalStationId
  });
  
  const handleSeatSelection = (seats: number[]) => {
    setSelectedSeats(seats);
  };
  
  const handlePassengerInfoComplete = (data: any) => {
    setPassengerInfo(data);
    // Save to session storage for payment page
    sessionStorage.setItem('bookingData', JSON.stringify({
      scheduleId,
      selectedSeats,
      passengerInfo: data,
      totalPrice: schedule?.basePrice * passengerCount
    }));
    navigate('/payment');
  };
  
  const nextStep = () => {
    if (currentStep === 1 && selectedSeats.length === passengerCount) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading booking information...</span>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !schedule) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-500">Error Loading Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>There was an error loading the booking information. Please try again.</p>
              <Button onClick={() => navigate('/search')} className="mt-4">
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Steps currentStep={currentStep} className="mb-8">
            <Step title="Seat Selection" />
            <Step title="Passenger Information" />
            <Step title="Payment" />
            <Step title="Confirmation" />
          </Steps>
          
          {/* Trip Summary */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-start">
                  <Train className="h-5 w-5 text-primary mt-1 mr-3" />
                  <div>
                    <div className="font-medium">{train?.name} (#{train?.trainNumber})</div>
                    <div className="text-sm text-neutral-500">{passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:space-x-10 mt-4 md:mt-0">
                  <div>
                    <div className="text-sm text-neutral-500">Departure</div>
                    <div className="font-medium">{schedule && format(new Date(schedule.departureTime), "EEE, d MMM, HH:mm")}</div>
                    <div className="text-sm">{departureStation?.name}</div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0">
                    <div className="text-sm text-neutral-500">Arrival</div>
                    <div className="font-medium">{schedule && format(new Date(schedule.arrivalTime), "EEE, d MMM, HH:mm")}</div>
                    <div className="text-sm">{arrivalStation?.name}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Step content */}
          {currentStep === 1 ? (
            <>
              <SeatSelection
                trainId={schedule.trainId}
                scheduleId={scheduleId}
                passengerCount={passengerCount}
                onSeatSelection={handleSeatSelection}
                selectedSeats={selectedSeats}
              />
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
                </Button>
                
                <Button 
                  onClick={nextStep} 
                  disabled={selectedSeats.length !== passengerCount}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <PassengerInfo
                passengerCount={passengerCount}
                selectedSeats={selectedSeats}
                onPassengerInfoComplete={handlePassengerInfoComplete}
              />
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Seat Selection
                </Button>
              </div>
            </>
          )}
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
