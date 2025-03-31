export interface SeatData {
  id: number;
  seatId: string;
  status: 'available' | 'booked' | 'selected';
}

export const generateSeatMap = (carNumber: string = '5'): SeatData[] => {
  const seatLetters = ['A', 'B', 'C', 'D', 'E'];
  const seatMap: SeatData[] = [];
  
  // Mock some occupied seats
  const bookedSeats = [
    '5D', '6B', '7D', '7E', '9C', '11A', '13B', '15E', '18D'
  ];
  
  let idCounter = 1;
  
  for (let row = 5; row <= 8; row++) {
    for (let letterIndex = 0; letterIndex < seatLetters.length; letterIndex++) {
      const seatId = `${row}${seatLetters[letterIndex]}`;
      const status = bookedSeats.includes(seatId) ? 'booked' : 'available';
      
      seatMap.push({
        id: idCounter++,
        seatId,
        status
      });
    }
  }
  
  return seatMap;
};

export const formatSeatId = (seatId: string): string => {
  return `Car ${seatId.charAt(0)}, Seat ${seatId.substring(1)}`;
};
