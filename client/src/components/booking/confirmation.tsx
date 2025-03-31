import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, Calendar, Clock, User, CreditCard, TicketCheck } from "lucide-react";

type ConfirmationProps = {
  booking: any;
};

export default function Confirmation({ booking }: ConfirmationProps) {
  if (!booking || !booking.schedule) {
    return (
      <div className="text-center p-6 bg-neutral-50 rounded-lg">
        <p>Booking information not available</p>
      </div>
    );
  }
  
  const generateBarcode = () => {
    return `RC-${booking.id}-${format(new Date(booking.bookingDate), "yyyyMMdd")}`;
  };
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEE, d MMM yyyy");
  };

  return (
    <Card className="overflow-hidden border-2 border-dashed border-neutral-200 bg-white">
      <div className="bg-primary p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Train className="h-5 w-5 mr-2" />
            <span className="font-bold">RailConnect</span>
          </div>
          <div className="text-sm">E-Ticket</div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Train Ticket</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Train className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="font-medium">{booking.schedule.train?.name}</div>
                  <div className="text-sm text-neutral-500">Train #{booking.schedule.train?.trainNumber}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-neutral-500">From</div>
                    <div className="font-medium">
                      {booking.schedule.departureStation?.name || "Departure Station"}
                    </div>
                    <div className="text-sm">
                      {booking.schedule.departureStation?.code || "---"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-neutral-500">To</div>
                    <div className="font-medium">
                      {booking.schedule.arrivalStation?.name || "Arrival Station"}
                    </div>
                    <div className="text-sm">
                      {booking.schedule.arrivalStation?.code || "---"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-neutral-500">Date</div>
                    <div className="font-medium">
                      {formatDate(booking.schedule.departureTime)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-neutral-500">Time</div>
                    <div className="font-medium">
                      {formatTime(booking.schedule.departureTime)} - {formatTime(booking.schedule.arrivalTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-2">Passenger Information</h3>
              <div className="space-y-3">
                {booking.passengers && booking.passengers.map((passenger: any, index: number) => (
                  <div key={passenger.id} className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">
                        {passenger.firstName} {passenger.lastName}
                      </div>
                      <div className="text-sm text-neutral-500">
                        Age: {passenger.age} | Seat: {passenger.seat?.seatNumber || `#${passenger.seatId}`} {passenger.seat?.coach ? `(Coach ${passenger.seat.coach})` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-start space-x-3 mb-3 md:mb-0">
                <CreditCard className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-sm text-neutral-500">Payment</div>
                  <div className="font-medium">${booking.totalPrice.toFixed(2)}</div>
                  <div className="text-sm text-neutral-500 capitalize">
                    {booking.paymentMethod || "Credit Card"} • {booking.paymentStatus || "Paid"}
                  </div>
                </div>
              </div>
              
              <Badge variant="outline" className={
                booking.status === "Confirmed" ? "border-green-500 text-green-700 bg-green-50" :
                booking.status === "Pending" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                "border-red-500 text-red-700 bg-red-50"
              }>
                {booking.status}
              </Badge>
            </div>
          </div>
          
          <div className="md:ml-6 mt-6 md:mt-0 flex flex-col items-center justify-center">
            <div className="bg-white p-2 border border-neutral-200 rounded-lg">
              <QRCodeSVG 
                value={generateBarcode()} 
                size={120} 
                level="H" 
                includeMargin={true}
              />
            </div>
            <div className="mt-2 text-xs text-center font-mono">
              {generateBarcode()}
            </div>
            <div className="mt-4 flex items-center text-xs text-neutral-500">
              <TicketCheck className="h-3 w-3 mr-1" />
              <span>Booking #{booking.id}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-dashed text-xs text-neutral-500">
          <p className="mb-1">• Please arrive at least 30 minutes before departure.</p>
          <p className="mb-1">• Keep this e-ticket handy for inspection.</p>
          <p>• For assistance call our helpline at 1-800-123-4567.</p>
        </div>
      </CardContent>
    </Card>
  );
}
