import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Payment from "@/components/booking/payment";
import { Steps, Step } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PaymentPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<any>(null);
  
  // Get booking data from session storage
  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      toast({
        title: "Error",
        description: "No booking data found. Please start a new booking.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [toast, navigate]);
  
  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      // Store booking ID for confirmation page
      sessionStorage.setItem('confirmedBookingId', data.id.toString());
      // Clear booking data
      sessionStorage.removeItem('bookingData');
      navigate('/confirmation');
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handlePaymentComplete = (paymentData: any) => {
    if (!user || !bookingData) return;
    
    // Create the booking with payment data
    createBookingMutation.mutate({
      userId: user.id,
      scheduleId: bookingData.scheduleId,
      status: "Confirmed",
      totalPrice: bookingData.totalPrice,
      paymentMethod: paymentData.method,
      paymentStatus: "Paid",
      passengers: bookingData.passengerInfo.passengers
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Steps currentStep={3} className="mb-8">
            <Step title="Seat Selection" />
            <Step title="Passenger Information" />
            <Step title="Payment" />
            <Step title="Confirmation" />
          </Steps>
          
          {bookingData ? (
            <Payment 
              totalAmount={bookingData.totalPrice} 
              onPaymentComplete={handlePaymentComplete}
              isPending={createBookingMutation.isPending}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Loading payment information...</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Please wait while we prepare your payment details.</p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
