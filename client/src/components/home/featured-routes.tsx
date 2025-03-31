import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Route } from "@shared/schema";
import { Train, Wifi, Power, Utensils, Luggage, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

type FeaturedRouteProps = {
  route: Route & {
    departureStation: {
      name: string;
      city: string;
      code: string;
    };
    arrivalStation: {
      name: string;
      city: string;
      code: string;
    };
  };
};

const RouteCard = ({ route }: FeaturedRouteProps) => {
  const getRandomDuration = () => {
    // Generate a random duration between 2h and 6h
    const hours = Math.floor(Math.random() * 4) + 2;
    const minutes = Math.floor(Math.random() * 60);
    return `${hours}h ${minutes}m`;
  };

  const getRandomPrice = () => {
    // Generate a random price between $29 and $89
    return Math.floor(Math.random() * 60) + 29;
  };

  // This would be replaced with actual data in a real implementation
  const routeDetails = {
    duration: getRandomDuration(),
    price: getRandomPrice(),
    serviceType: ["Express Service", "Regional Service", "Scenic Service"][Math.floor(Math.random() * 3)],
    amenities: [
      Math.random() > 0.2, // WiFi
      Math.random() > 0.3, // Power
      Math.random() > 0.5, // Food
      Math.random() > 0.7, // Bicycle
    ],
    departures: Math.floor(Math.random() * 10) + 1
  };

  const backgroundImageUrl = `https://source.unsplash.com/600x300/?train,${route.departureStation.city.toLowerCase()},${route.arrivalStation.city.toLowerCase()}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <div className="h-40 bg-neutral-200 relative">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="text-xl font-bold">{route.departureStation.city} to {route.arrivalStation.city}</h3>
            <p className="text-sm">{routeDetails.duration} • From ${routeDetails.price}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <Train className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm text-neutral-600">{routeDetails.serviceType}</span>
          </div>
          <div className="flex items-center gap-1">
            {routeDetails.amenities[0] && <Wifi className="h-4 w-4 text-neutral-400" />}
            {routeDetails.amenities[1] && <Power className="h-4 w-4 text-neutral-400" />}
            {routeDetails.amenities[2] && <Utensils className="h-4 w-4 text-neutral-400" />}
            {routeDetails.amenities[3] && <Luggage className="h-4 w-4 text-neutral-400" />}
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {routeDetails.departures === 1 
                ? "Daily service" 
                : `${routeDetails.departures} departures daily`}
            </p>
          </div>
          <Link 
            href={`/search?from=${route.departureStation.code}&to=${route.arrivalStation.code}`}
            className="text-primary hover:text-primary-600 text-sm font-medium"
          >
            View Times
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default function FeaturedRoutes() {
  const { data: routes, isLoading, error } = useQuery({
    queryKey: ["/api/routes/featured"],
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Popular Routes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {error && (
            <div className="col-span-full text-center text-destructive">
              Failed to load featured routes
            </div>
          )}

          {routes && routes.map((route: any) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/routes"
            className="inline-flex items-center px-5 py-2 border border-primary text-primary rounded-md hover:bg-primary-50 transition"
          >
            <span>Explore All Routes</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
