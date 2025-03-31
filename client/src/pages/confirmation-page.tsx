import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Confirmation from "@/components/booking/confirmation";
import { Steps, Step } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Printer, Home, Search } from "lucide-react";

export default function ConfirmationPage() {
  const [, navigate] = useLocation();
  const [bookingId, setBookingId] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get booking ID from session storage
  useEffect(() => {
    const id = sessionStorage.getItem('confirmedBookingId');
    if (id) {
      setBookingId(parseInt(id));
    } else {
      // If no booking ID, redirect to home
      navigate('/');
    }
  }, [navigate]);
  
  // Fetch booking data
  const { data: booking, isLoading, error } = useQuery({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: bookingId !== null
  });
  
  // Handle print
  const handlePrint = useReactToPrint({
    documentTitle: `RailConnect_Ticket_${bookingId}`,
    // @ts-ignore - this parameter exists in the library's latest version
    content: () => contentRef.current,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading booking confirmation...</span>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-500">Error Loading Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>There was an error loading your booking confirmation. Please check your booking history in your profile.</p>
              <div className="flex space-x-4 mt-6">
                <Button onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Button>
                <Button variant="outline" onClick={() => navigate('/profile')}>
                  View My Bookings
                </Button>
              </div>
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
          <Steps currentStep={4} className="mb-8">
            <Step title="Seat Selection" />
            <Step title="Passenger Information" />
            <Step title="Payment" />
            <Step title="Confirmation" />
          </Steps>
          
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
            <p className="text-neutral-600">
              Your booking has been confirmed. Your e-ticket is ready below.
            </p>
          </div>
          
          <div ref={contentRef}>
            <Confirmation booking={booking} />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button 
              // @ts-ignore - type mismatch between useReactToPrint and Button onClick
              onClick={handlePrint} 
              className="flex-1 sm:flex-initial"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Ticket
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="flex-1 sm:flex-initial"
            >
              View My Bookings
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-initial"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/search')}
              className="flex-1 sm:flex-initial"
            >
              <Search className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
