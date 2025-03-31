import { format, formatDuration, intervalToDuration } from "date-fns";
import { useLocation } from "wouter";
import { Train, Wifi, Power, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

type TrainCardProps = {
  train: {
    id: number;
    trainId: number;
    departureTime: string;
    arrivalTime: string;
    basePrice: number;
    availableSeats: number;
    train: {
      name: string;
      trainNumber: string;
      type: string;
      amenities: string[];
    };
  };
  departureStation: {
    name: string;
    code: string;
  };
  arrivalStation: {
    name: string;
    code: string;
  };
  passengers: number;
};

export default function TrainCard({ train, departureStation, arrivalStation, passengers }: TrainCardProps) {
  const [, navigate] = useLocation();
  
  const departureTime = new Date(train.departureTime);
  const arrivalTime = new Date(train.arrivalTime);
  
  // Calculate duration
  const duration = intervalToDuration({ start: departureTime, end: arrivalTime });
  const formattedDuration = formatDuration(duration, { format: ['hours', 'minutes'] });
  
  // Handle booking
  const handleSelectTrain = () => {
    navigate(`/booking?schedule=${train.id}&passengers=${passengers}`);
  };
  
  // Check if amenity exists
  const hasAmenity = (amenity: string) => {
    return train.train.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()));
  };
  
  // Check if business or first class is available
  const hasBusinessClass = train.train.type === "Express";
  const hasFirstClass = train.train.name.includes("Flyer");
  
  // Calculate total price
  const totalPrice = train.basePrice * passengers;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="mr-3">
              <Train className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{train.train.name}</h3>
              <p className="text-sm text-neutral-500">Train #{train.train.trainNumber}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-12">
            <div className="mb-3 sm:mb-0">
              <div className="flex items-baseline">
                <span className="text-xl font-bold">{format(departureTime, "HH:mm")}</span>
                <span className="text-sm text-neutral-500 ml-2">{departureStation.code}</span>
              </div>
              <div className="text-sm text-neutral-500">{departureStation.name}</div>
            </div>
            
            <div className="flex flex-col items-center mb-3 sm:mb-0">
              <div className="flex items-center w-full sm:w-32">
                <div className="h-0.5 w-full bg-neutral-300 relative">
                  <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-primary"></div>
                  <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary"></div>
                </div>
              </div>
              <div className="text-sm font-medium mt-1">{formattedDuration}</div>
              <div className="text-xs text-neutral-500">Direct</div>
            </div>
            
            <div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold">{format(arrivalTime, "HH:mm")}</span>
                <span className="text-sm text-neutral-500 ml-2">{arrivalStation.code}</span>
              </div>
              <div className="text-sm text-neutral-500">{arrivalStation.name}</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-4 pt-4 md:border-0 md:mt-0 md:pt-0 flex flex-col md:items-end">
          <div className="flex items-center space-x-1 text-neutral-500 text-sm mb-2">
            {hasAmenity("wifi") && <Wifi className="h-4 w-4" />}
            {hasAmenity("power") && <Power className="h-4 w-4" />}
            {hasAmenity("food") && <Utensils className="h-4 w-4" />}
            <span className="ml-1">
              {hasFirstClass 
                ? "First Class Available" 
                : hasBusinessClass 
                  ? "Business Class Available" 
                  : "Standard Class Only"}
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-500 mb-3">${totalPrice}</div>
          <Button 
            onClick={handleSelectTrain}
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}
