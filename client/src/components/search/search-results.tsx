import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRight, Filter } from "lucide-react";
import FilterPanel from "./filter-panel";
import TrainCard from "./train-card";
import { format } from "date-fns";

export default function SearchResults() {
  const [, navigate] = useNavigate();
  const [location] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [filterParams, setFilterParams] = useState({
    departureTime: [] as string[],
    trainType: [] as string[],
    amenities: [] as string[],
    maxPrice: 200
  });

  // Parse query params
  const queryParams = new URLSearchParams(location.split("?")[1] || "");
  const from = queryParams.get("from") || "";
  const to = queryParams.get("to") || "";
  const date = queryParams.get("date") || format(new Date(), "yyyy-MM-dd");
  const passengers = parseInt(queryParams.get("passengers") || "1");

  // Fetch search results
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['/api/search', { from, to, date, passengers }],
    queryFn: async () => {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, date, passengers }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch train schedules');
      }
      
      return res.json();
    },
    enabled: !!(from && to && date)
  });
  
  // Filter the results based on selected filters
  const filteredResults = searchResults ? searchResults.filter((train: any) => {
    // Filter by departure time
    if (filterParams.departureTime.length > 0) {
      const hour = new Date(train.departureTime).getHours();
      const timeOfDay = 
        hour >= 6 && hour < 12 ? 'morning' :
        hour >= 12 && hour < 18 ? 'afternoon' : 'evening';
      
      if (!filterParams.departureTime.includes(timeOfDay)) {
        return false;
      }
    }
    
    // Filter by train type
    if (filterParams.trainType.length > 0 && !filterParams.trainType.includes(train.train.type.toLowerCase())) {
      return false;
    }
    
    // Filter by amenities
    if (filterParams.amenities.length > 0) {
      const hasAllAmenities = filterParams.amenities.every(amenity => 
        train.train.amenities.some((a: string) => a.toLowerCase().includes(amenity.toLowerCase()))
      );
      if (!hasAllAmenities) return false;
    }
    
    // Filter by price
    if (train.basePrice > filterParams.maxPrice) {
      return false;
    }
    
    return true;
  }) : [];

  const handleSwapStations = () => {
    navigate(`/search?from=${to}&to=${from}&date=${date}&passengers=${passengers}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const applyFilters = (newFilters: typeof filterParams) => {
    setFilterParams(newFilters);
  };

  const resetFilters = () => {
    setFilterParams({
      departureTime: [],
      trainType: [],
      amenities: [],
      maxPrice: 200
    });
  };

  // Format station names for display
  const formatStationName = (stationCode: string) => {
    if (!searchResults || searchResults.length === 0) return stationCode;
    
    const result = searchResults[0];
    const station = stationCode === from ? 
      result.departureStation : 
      result.arrivalStation;
    
    return station?.name || stationCode;
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <h2 className="text-xl font-bold">
                {from ? formatStationName(from) : "Loading..."} to {to ? formatStationName(to) : "Loading..."}
              </h2>
              <p className="text-neutral-500">
                {date ? format(new Date(date), "EEE, d MMM") : "Today"} • {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleSwapStations}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                <span>Swap Stations</span>
              </Button>
              
              <Button variant="outline" onClick={toggleFilters}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel 
            onApplyFilters={applyFilters} 
            onResetFilters={resetFilters}
            initialValues={filterParams}
          />
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-8 w-8 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-12">
                      <div className="mb-3 sm:mb-0">
                        <Skeleton className="h-6 w-20 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <div className="mb-3 sm:mb-0">
                        <Skeleton className="h-3 w-32 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <div>
                        <Skeleton className="h-6 w-20 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                  <div className="md:text-right mt-4 md:mt-0">
                    <Skeleton className="h-4 w-32 mb-2 ml-auto" />
                    <Skeleton className="h-8 w-24 ml-auto" />
                    <Skeleton className="h-10 w-32 mt-3 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
            An error occurred while searching for trains. Please try again.
          </div>
        )}
        
        {/* No results state */}
        {!isLoading && filteredResults && filteredResults.length === 0 && (
          <div className="bg-yellow-50 text-yellow-600 p-6 rounded-md text-center">
            <h3 className="font-semibold text-lg mb-2">No trains found</h3>
            <p>No trains match your search criteria. Try adjusting your filters or search for different dates.</p>
          </div>
        )}
        
        {/* Train Results */}
        <div className="space-y-4">
          {filteredResults && filteredResults.map((train: any) => (
            <TrainCard 
              key={train.id} 
              train={train} 
              departureStation={train.departureStation} 
              arrivalStation={train.arrivalStation}
              passengers={passengers}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
