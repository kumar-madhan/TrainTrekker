import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Search,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Station, RouteWithDetails } from '@shared/schema';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Timetable() {
  const [, setLocation] = useLocation();
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchPerformed, setSearchPerformed] = useState(false);

  const { data: stations } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });

  const { data: routes, isLoading } = useQuery<RouteWithDetails[]>({
    queryKey: ['/api/routes/search', { from: fromStation, to: toStation, date }],
    enabled: searchPerformed && !!fromStation && !!toStation && !!date,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleBookTrain = (route: RouteWithDetails) => {
    setLocation(`/booking/${route.id}`);
  };

  return (
    <section id="timetable" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Train Timetable</h2>
          <p className="mt-2 text-gray-600">Check the latest schedules for your journey</p>
        </div>
        
        <Card className="shadow-sm border border-gray-200 overflow-hidden mb-8">
          <CardHeader className="bg-gray-50 border-b border-gray-200 p-4">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <div className="flex-grow relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <Select value={fromStation} onValueChange={setFromStation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select departure station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations?.map(station => (
                      <SelectItem key={station.id} value={station.name}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="mb-1"
                  onClick={handleSwapStations}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <Select value={toStation} onValueChange={setToStation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select arrival station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations?.map(station => (
                      <SelectItem key={station.id} value={station.name}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex items-end">
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </form>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Train</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {isLoading ? (
                    // Loading skeletons
                    Array(3).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      </TableRow>
                    ))
                  ) : searchPerformed && routes?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                        No trains found for this route on the selected date.
                      </TableCell>
                    </TableRow>
                  ) : searchPerformed ? (
                    routes?.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{route.train.name}</div>
                            <Badge variant={route.train.type === 'Express' ? 'default' : 'secondary'} className="ml-2">
                              {route.train.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">#{route.train.trainNumber}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-gray-900">
                          {route.fromStation.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-gray-900">
                          {route.toStation.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-gray-900">
                          {route.departureTime}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-gray-900">
                          {route.arrivalTime}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-gray-900">
                          {route.duration}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            On Time
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm font-medium">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-primary-600 hover:text-primary-900"
                            onClick={() => handleBookTrain(route)}
                          >
                            Book
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                        Please search for a route to see the timetable.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
