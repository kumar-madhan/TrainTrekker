import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SeatData } from '@/lib/seatmapData';
import SeatMap from '@/components/train/SeatMap';
import { RouteWithDetails } from '@shared/schema';

interface SeatSelectionProps {
  route: RouteWithDetails;
  onContinue: (selectedSeats: SeatData[]) => void;
}

export default function SeatSelection({ route, onContinue }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
  
  const handleSeatSelect = (seats: SeatData[]) => {
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      return;
    }
    onContinue(selectedSeats);
  };

  return (
    <div>
      <SeatMap 
        trainId={route.train.id} 
        onSeatSelect={handleSeatSelect} 
        maxSeats={1} 
      />
      
      <div className="mt-6 text-center">
        <Button 
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}
          className="bg-primary-600 hover:bg-primary-700"
        >
          Continue to Passenger Details
        </Button>
      </div>
    </div>
  );
}
