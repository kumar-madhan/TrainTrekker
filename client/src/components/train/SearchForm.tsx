import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Train,
  MapPin,
  Calendar,
  User,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Station } from '@shared/schema';

export default function SearchForm() {
  const [, setLocation] = useLocation();
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState('1');

  const { data: stations, isLoading } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create query string with search parameters
    const params = new URLSearchParams({
      from: fromStation,
      to: toStation,
      date,
      passengers
    });
    
    setLocation(`/search-results?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-12 sm:py-16 relative">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center">
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
            Find and Book Your Perfect Journey
          </h1>
          <p className="text-lg text-white text-opacity-90 max-w-3xl mx-auto">
            Fast, secure, and convenient train bookings across the country.
          </p>
        </div>
        
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSearch}>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <div className="relative">
                    <Train className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Departure Station"
                      className="pl-10"
                      value={fromStation}
                      onChange={(e) => setFromStation(e.target.value)}
                      list="fromStations"
                      required
                    />
                    <datalist id="fromStations">
                      {stations?.map((station) => (
                        <option key={station.id} value={station.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Arrival Station"
                      className="pl-10"
                      value={toStation}
                      onChange={(e) => setToStation(e.target.value)}
                      list="toStations"
                      required
                    />
                    <datalist id="toStations">
                      {stations?.map((station) => (
                        <option key={station.id} value={station.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Passenger</SelectItem>
                        <SelectItem value="2">2 Passengers</SelectItem>
                        <SelectItem value="3">3 Passengers</SelectItem>
                        <SelectItem value="4">4+ Passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full sm:w-auto bg-secondary-500 hover:bg-secondary-600"
                >
                  <Search className="mr-2 h-4 w-4" /> Search Trains
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
