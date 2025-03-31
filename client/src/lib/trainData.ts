export interface TrainRoute {
  id: number;
  trainNumber: string;
  name: string;
  type: 'Express' | 'Regular';
  departureTime: string;
  arrivalTime: string;
  duration: string;
  from: string;
  to: string;
  date: string;
  price: number;
  stops: number;
  amenities: string[];
}

export interface PopularRoute {
  id: number;
  from: string;
  to: string;
  duration: string;
  price: number;
  image: string;
  amenities: string[];
}

export const MOCK_POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 1,
    from: 'New York',
    to: 'Boston',
    duration: '3h 45m',
    price: 45,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    amenities: ['Wi-Fi', 'Dining']
  },
  {
    id: 2,
    from: 'Chicago',
    to: 'Detroit',
    duration: '4h 20m',
    price: 38,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    amenities: ['Wi-Fi', 'Power']
  },
  {
    id: 3,
    from: 'Los Angeles',
    to: 'San Francisco',
    duration: '5h 30m',
    price: 59,
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    amenities: ['Wi-Fi', 'Movies']
  }
];

export const MOCK_TRAIN_ROUTES: TrainRoute[] = [
  {
    id: 1,
    trainNumber: 'NE-238',
    name: 'Northeast Regional',
    type: 'Express',
    departureTime: '06:30',
    arrivalTime: '10:15',
    duration: '3h 45m',
    from: 'New York',
    to: 'Boston',
    date: '2023-10-10',
    price: 49,
    stops: 2,
    amenities: ['Wi-Fi', 'Dining', 'Accessible']
  },
  {
    id: 2,
    trainNumber: 'CL-445',
    name: 'Coastal Line',
    type: 'Regular',
    departureTime: '08:15',
    arrivalTime: '12:30',
    duration: '4h 15m',
    from: 'New York',
    to: 'Boston',
    date: '2023-10-10',
    price: 38,
    stops: 4,
    amenities: ['Wi-Fi', 'Power', 'Accessible']
  }
];

export const formatPrice = (price: number): string => {
  return `$${price}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};
