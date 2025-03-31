import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Wifi, 
  UtensilsCrossed, 
  Clock, 
  Battery, 
  Film 
} from 'lucide-react';
import { RouteWithDetails } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function PopularRoutes() {
  const [, setLocation] = useLocation();

  const { data: routes, isLoading, error } = useQuery<RouteWithDetails[]>({
    queryKey: ['/api/routes/popular'],
  });

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Wi-Fi':
        return <Wifi className="mr-1 h-3 w-3" />;
      case 'Dining':
        return <UtensilsCrossed className="mr-1 h-3 w-3" />;
      case 'Power':
        return <Battery className="mr-1 h-3 w-3" />;
      case 'Movies':
        return <Film className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleRouteClick = (route: RouteWithDetails) => {
    // Create query string with search parameters
    const params = new URLSearchParams({
      from: route.fromStation.name,
      to: route.toStation.name,
      date: route.date,
      passengers: '1'
    });
    
    setLocation(`/search-results?${params.toString()}`);
  };

  // Images for popular routes (in a real app these would come from the API)
  const routeImages = [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">Failed to load popular routes</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Popular Routes</h2>
          <p className="mt-2 text-gray-600">Explore our most traveled destinations with special offers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 bg-white">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-16 rounded-full mr-2" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            routes?.map((route, index) => (
              <div 
                key={route.id} 
                className="rounded-lg overflow-hidden shadow-md group train-card hover:cursor-pointer"
                onClick={() => handleRouteClick(route)}
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${routeImages[index % routeImages.length]})` }}
                  />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-heading font-semibold text-xl">
                      {route.fromStation.name} to {route.toStation.name}
                    </h3>
                    <p className="flex items-center mt-1">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{route.duration}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-secondary-300">
                        From ${(route.price / 100).toFixed(0)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {route.train.amenities.slice(0, 2).map((amenity, i) => (
                        <div 
                          key={i} 
                          className="text-xs inline-flex items-center font-medium bg-blue-100 text-blue-600 rounded-full px-2 py-1"
                        >
                          {getAmenityIcon(amenity)} {amenity}
                        </div>
                      ))}
                    </div>
                    <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
