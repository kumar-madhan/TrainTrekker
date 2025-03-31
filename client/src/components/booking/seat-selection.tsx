import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Seat } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2 } from "lucide-react";

type SeatSelectionProps = {
  trainId: number;
  scheduleId: number;
  passengerCount: number;
  onSeatSelection: (selectedSeats: number[]) => void;
  selectedSeats: number[];
};

export default function SeatSelection({ 
  trainId, 
  scheduleId, 
  passengerCount, 
  onSeatSelection,
  selectedSeats: initialSelectedSeats = [] 
}: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>(initialSelectedSeats);
  const [selectedCoach, setSelectedCoach] = useState<string>("A");
  
  // Fetch seats for the train
  const { data: seats, isLoading } = useQuery({
    queryKey: [`/api/trains/${trainId}/seats`, { scheduleId }],
  });
  
  // Update parent component when seats are selected
  useEffect(() => {
    onSeatSelection(selectedSeats);
  }, [selectedSeats, onSeatSelection]);
  
  const coaches = seats 
    ? Array.from(new Set(seats.map((seat: Seat) => seat.coach)))
    : [];
  
  const seatsByCoach = seats
    ? seats.filter((seat: Seat) => seat.coach === selectedCoach)
    : [];
  
  const seatTypeColors = {
    "Standard": "bg-green-100 text-green-800 border-green-200",
    "Business": "bg-blue-100 text-blue-800 border-blue-200",
    "First Class": "bg-purple-100 text-purple-800 border-purple-200"
  };
  
  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;
    
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      if (selectedSeats.length < passengerCount) {
        setSelectedSeats([...selectedSeats, seat.id]);
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Seats</h3>
        <p className="text-neutral-500 mb-4">
          Please select {passengerCount} seat{passengerCount !== 1 ? 's' : ''} from the available options below.
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Select
              value={selectedCoach}
              onValueChange={setSelectedCoach}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Coach" />
              </SelectTrigger>
              <SelectContent>
                {coaches.map((coach) => (
                  <SelectItem key={coach} value={coach}>Coach {coach}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="py-1 px-3">
              {selectedSeats.length} of {passengerCount} selected
            </Badge>
          </div>
          
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-neutral-200 rounded-sm mr-2"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-neutral-300 rounded-sm mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seat Map */}
      <div className="mb-6">
        <div className="bg-neutral-100 p-4 rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="bg-neutral-300 rounded-md px-8 py-2 text-center text-sm font-medium">
              Front of Train
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-5 gap-4 md:grid-cols-10 mb-8">
              {Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 md:grid-cols-10 mb-8">
              {seatsByCoach.map((seat: Seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isAvailable = seat.isAvailable;
                
                return (
                  <Button
                    key={seat.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-12 w-12 p-0 ${!isAvailable ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" : ""}`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={!isAvailable && !isSelected}
                  >
                    {isSelected ? (
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">{seat.seatNumber}</span>
                      </div>
                    ) : (
                      <span>{seat.seatNumber}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
          
          {/* Seat Type Legend */}
          <div className="flex justify-center space-x-4">
            {Object.entries(seatTypeColors).map(([type, classes]) => (
              <div key={type} className={`text-xs px-2 py-1 rounded border ${classes}`}>
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
