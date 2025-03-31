import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeatData, generateSeatMap, formatSeatId } from '@/lib/seatmapData';

interface SeatMapProps {
  trainId: number;
  onSeatSelect: (selectedSeats: SeatData[]) => void;
  maxSeats?: number;
}

export default function SeatMap({ trainId, onSeatSelect, maxSeats = 1 }: SeatMapProps) {
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
  const [carNumber, setCarNumber] = useState('5');

  // Generate seat map data
  useEffect(() => {
    setSeats(generateSeatMap(carNumber));
  }, [carNumber, trainId]);

  const handleSeatClick = (seat: SeatData) => {
    if (seat.status === 'booked') {
      return;
    }

    // If seat is already selected, unselect it
    if (seat.status === 'selected') {
      setSeats(seats.map(s => 
        s.id === seat.id 
          ? { ...s, status: 'available' } 
          : s
      ));
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      return;
    }

    // If max seats already selected, don't allow more selections
    if (selectedSeats.length >= maxSeats) {
      // Optionally, replace the oldest selection
      const updatedSeats = [...seats];
      const oldestSelectedSeat = selectedSeats[0];
      
      // Make the oldest selected seat available again
      const oldestSeatIndex = updatedSeats.findIndex(s => s.id === oldestSelectedSeat.id);
      if (oldestSeatIndex !== -1) {
        updatedSeats[oldestSeatIndex] = { ...updatedSeats[oldestSeatIndex], status: 'available' };
      }
      
      // Make the new seat selected
      const newSeatIndex = updatedSeats.findIndex(s => s.id === seat.id);
      if (newSeatIndex !== -1) {
        updatedSeats[newSeatIndex] = { ...updatedSeats[newSeatIndex], status: 'selected' };
      }
      
      setSeats(updatedSeats);
      setSelectedSeats([...selectedSeats.slice(1), { ...seat, status: 'selected' }]);
    } else {
      // Select new seat
      setSeats(seats.map(s => 
        s.id === seat.id 
          ? { ...s, status: 'selected' } 
          : s
      ));
      setSelectedSeats([...selectedSeats, { ...seat, status: 'selected' }]);
    }
  };

  useEffect(() => {
    onSeatSelect(selectedSeats);
  }, [selectedSeats, onSeatSelect]);

  // Create a grid of seats, 5 columns
  const seatGrid = [];
  const seatLetters = ['A', 'B', 'C', 'D', 'E'];
  const rows = Math.ceil(seats.length / seatLetters.length);
  
  for (let row = 0; row < rows; row++) {
    const rowItems = [];
    for (let col = 0; col < seatLetters.length; col++) {
      const index = row * seatLetters.length + col;
      if (index < seats.length) {
        rowItems.push(seats[index]);
      }
    }
    seatGrid.push(rowItems);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-heading font-medium text-xl mb-4">Select Your Seats</h3>
        
        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-md text-center mb-4">
            <div className="text-sm mb-2">
              Train car: <span className="font-medium">Economy Class - Car {carNumber}</span>
            </div>
            <div className="flex justify-center space-x-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-gray-200 border border-gray-300 mr-1"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-primary-100 border border-primary-500 mr-1"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-gray-400 border border-gray-500 mr-1"></div>
                <span>Occupied</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-5 gap-2 max-w-md">
              {seatGrid.map((row, rowIndex) => 
                row.map((seat, colIndex) => (
                  <div 
                    key={seat.id} 
                    className={`
                      seat w-12 h-12 flex items-center justify-center rounded-md cursor-pointer
                      ${seat.status === 'booked' 
                        ? 'border border-gray-400 bg-gray-400 cursor-not-allowed booked'
                        : seat.status === 'selected'
                          ? 'border border-primary-500 bg-primary-100 selected'
                          : 'border border-gray-300 bg-gray-200 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.seatId}
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium mb-2">Selected Seats:</h4>
              <ul className="space-y-1">
                {selectedSeats.map(seat => (
                  <li key={seat.id} className="flex items-center">
                    <span className="text-blue-600 mr-2">•</span>
                    {formatSeatId(seat.seatId)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
