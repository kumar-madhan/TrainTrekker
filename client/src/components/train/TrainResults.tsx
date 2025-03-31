import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, 
  SidebarClose, 
  Wifi, 
  UtensilsCrossed, 
  Accessibility, 
  Battery, 
  Info,
  Filter,
  ArrowUpDown,
  Calendar,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteWithDetails } from '@shared/schema';
import { useState } from 'react';

interface TrainResultsProps {
  fromStation: string;
  toStation: string;
  date: string;
  passengers: string;
}

export default function TrainResults({ 
  fromStation, 
  toStation, 
  date, 
  passengers 
}: TrainResultsProps) {
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: routes, isLoading, error } = useQuery<RouteWithDetails[]>({
    queryKey: ['/api/routes/search', { from: fromStation, to: toStation, date }],
  });

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const handleTrainSelect = (route: RouteWithDetails) => {
    setLocation(`/booking/${route.id}`);
  };

  const handleSort = (criteria: 'price' | 'duration' | 'departure') => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const sortedRoutes = routes ? [...routes].sort((a, b) => {
    if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy === 'duration') {
      // Compare durations (assuming format "Xh Ym")
      const durationA = a.duration.replace('h ', '').replace('m', '').split(' ');
      const durationB = b.duration.replace('h ', '').replace('m', '').split(' ');
      const minutesA = parseInt(durationA[0]) * 60 + parseInt(durationA[1] || '0');
      const minutesB = parseInt(durationB[0]) * 60 + parseInt(durationB[1] || '0');
      return sortOrder === 'asc' ? minutesA - minutesB : minutesB - minutesA;
    } else {
      // Compare departure times (assuming format "HH:MM")
      const timeA = a.departureTime.split(':').map(Number);
      const timeB = b.departureTime.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return sortOrder === 'asc' ? minutesA - minutesB : minutesB - minutesA;
    }
  }) : [];

  if (error) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            Error loading search results: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Available Trains</h2>
            <p className="text-gray-600 mt-1">
              {fromStation} to {toStation}, <span>{formattedDate}</span>
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="inline-flex items-center"
            >
              <Filter className="mr-1 h-4 w-4" /> Filter
            </Button>
            <Button 
              variant={sortBy === 'price' ? 'secondary' : 'outline'} 
              size="sm"
              className="inline-flex items-center"
              onClick={() => handleSort('price')}
            >
              <ArrowUpDown className="mr-1 h-4 w-4" /> Price
              {sortBy === 'price' && (
                sortOrder === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <Button 
              variant={sortBy === 'duration' ? 'secondary' : 'outline'} 
              size="sm"
              className="inline-flex items-center"
              onClick={() => handleSort('duration')}
            >
              <Clock className="mr-1 h-4 w-4" /> Duration
              {sortBy === 'duration' && (
                sortOrder === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <Button 
              variant={sortBy === 'departure' ? 'secondary' : 'outline'} 
              size="sm"
              className="inline-flex items-center"
              onClick={() => handleSort('departure')}
            >
              <Calendar className="mr-1 h-4 w-4" /> Departure
              {sortBy === 'departure' && (
                sortOrder === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Train cards */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3">
                    <div className="flex flex-wrap items-start">
                      <div className="mr-6 mb-4">
                        <Skeleton className="h-6 w-16 mb-1" />
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex-1 mb-4">
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="lg:border-l lg:pl-4 flex flex-col justify-center">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </Card>
            ))
          ) : sortedRoutes.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No trains found for this route on the selected date.</p>
              <p className="text-gray-500 mt-2">Try a different date or route.</p>
            </Card>
          ) : (
            sortedRoutes.map((route) => (
              <Card key={route.id} className="p-4 train-card hover:border-primary-300">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3">
                    <div className="flex flex-wrap items-start">
                      <div className="mr-6 mb-4">
                        <div className={`text-xs text-white px-2 py-1 rounded ${route.train.type === 'Express' ? 'bg-primary-600' : 'bg-gray-600'} mb-1`}>
                          {route.train.type}
                        </div>
                        <h3 className="font-heading font-semibold text-lg">{route.train.name}</h3>
                        <div className="text-sm text-gray-500">#{route.train.trainNumber}</div>
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center mb-4">
                        <div className="flex items-center mr-8">
                          <div className="text-right mr-3">
                            <div className="text-lg font-semibold">{route.departureTime}</div>
                            <div className="text-sm text-gray-500">{route.fromStation.name}</div>
                          </div>
                          <div className="h-0.5 w-16 bg-gray-300 mx-2 relative">
                            <div className="absolute top-1/2 left-0 w-full flex items-center justify-between -translate-y-1/2">
                              <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                              <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">{route.arrivalTime}</div>
                            <div className="text-sm text-gray-500">{route.toStation.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                          <div className="flex items-center mr-3">
                            <Clock className="mr-1 h-4 w-4 text-gray-400" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <SidebarClose className="mr-1 h-4 w-4 text-gray-400" />
                            <span>2 stops</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm">
                      <div className="flex mr-4 mb-2">
                        {route.train.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center mr-3 text-gray-600">
                            {amenity === 'Wi-Fi' && <Wifi className="mr-1 h-4 w-4" />}
                            {amenity === 'Dining' && <UtensilsCrossed className="mr-1 h-4 w-4" />}
                            {amenity === 'Accessible' && <Accessibility className="mr-1 h-4 w-4" />}
                            {amenity === 'Power' && <Battery className="mr-1 h-4 w-4" />}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-primary-600 mb-2">
                        <Button 
                          variant="link" 
                          className="text-primary-600 hover:text-primary-800 font-medium p-0 h-auto"
                        >
                          <Info className="mr-1 h-4 w-4" />
                          <span>View Details</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:border-l lg:pl-4 flex flex-col justify-center">
                    <div className="mb-3">
                      <div className="text-xl font-bold text-gray-900">${(route.price / 100).toFixed(0)}</div>
                      <div className="text-sm text-gray-500">Economy Class</div>
                    </div>
                    <Button 
                      className="w-full bg-secondary-500 hover:bg-secondary-600"
                      onClick={() => handleTrainSelect(route)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
