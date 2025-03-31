import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type FilterPanelProps = {
  onApplyFilters: (filters: {
    departureTime: string[];
    trainType: string[];
    amenities: string[];
    maxPrice: number;
  }) => void;
  onResetFilters: () => void;
  initialValues: {
    departureTime: string[];
    trainType: string[];
    amenities: string[];
    maxPrice: number;
  };
};

export default function FilterPanel({ onApplyFilters, onResetFilters, initialValues }: FilterPanelProps) {
  const [departureTime, setDepartureTime] = useState<string[]>(initialValues.departureTime);
  const [trainType, setTrainType] = useState<string[]>(initialValues.trainType);
  const [amenities, setAmenities] = useState<string[]>(initialValues.amenities);
  const [maxPrice, setMaxPrice] = useState<number>(initialValues.maxPrice);
  
  const handleDepartureTimeChange = (time: string) => {
    setDepartureTime(
      departureTime.includes(time)
        ? departureTime.filter((t) => t !== time)
        : [...departureTime, time]
    );
  };
  
  const handleTrainTypeChange = (type: string) => {
    setTrainType(
      trainType.includes(type)
        ? trainType.filter((t) => t !== type)
        : [...trainType, type]
    );
  };
  
  const handleAmenitiesChange = (amenity: string) => {
    setAmenities(
      amenities.includes(amenity)
        ? amenities.filter((a) => a !== amenity)
        : [...amenities, amenity]
    );
  };
  
  const handleApplyFilters = () => {
    onApplyFilters({
      departureTime,
      trainType,
      amenities,
      maxPrice,
    });
  };
  
  const handleResetFilters = () => {
    setDepartureTime([]);
    setTrainType([]);
    setAmenities([]);
    setMaxPrice(200);
    onResetFilters();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="font-medium mb-3">Departure Time</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="morning" 
                checked={departureTime.includes("morning")}
                onCheckedChange={() => handleDepartureTimeChange("morning")}
              />
              <Label htmlFor="morning" className="text-sm">Morning (6AM - 12PM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="afternoon" 
                checked={departureTime.includes("afternoon")}
                onCheckedChange={() => handleDepartureTimeChange("afternoon")}
              />
              <Label htmlFor="afternoon" className="text-sm">Afternoon (12PM - 6PM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="evening" 
                checked={departureTime.includes("evening")}
                onCheckedChange={() => handleDepartureTimeChange("evening")}
              />
              <Label htmlFor="evening" className="text-sm">Evening (6PM - 12AM)</Label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Train Type</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="express" 
                checked={trainType.includes("express")}
                onCheckedChange={() => handleTrainTypeChange("express")}
              />
              <Label htmlFor="express" className="text-sm">Express</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="regional" 
                checked={trainType.includes("regional")}
                onCheckedChange={() => handleTrainTypeChange("regional")}
              />
              <Label htmlFor="regional" className="text-sm">Regional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="local" 
                checked={trainType.includes("local")}
                onCheckedChange={() => handleTrainTypeChange("local")}
              />
              <Label htmlFor="local" className="text-sm">Local</Label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Amenities</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="wifi" 
                checked={amenities.includes("wifi")}
                onCheckedChange={() => handleAmenitiesChange("wifi")}
              />
              <Label htmlFor="wifi" className="text-sm">WiFi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="power" 
                checked={amenities.includes("power")}
                onCheckedChange={() => handleAmenitiesChange("power")}
              />
              <Label htmlFor="power" className="text-sm">Power Outlets</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="food" 
                checked={amenities.includes("food")}
                onCheckedChange={() => handleAmenitiesChange("food")}
              />
              <Label htmlFor="food" className="text-sm">Food Service</Label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              value={[maxPrice]}
              min={0}
              max={200}
              step={5}
              onValueChange={(value) => setMaxPrice(value[0])}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-neutral-500 mt-1">
              <span>$0</span>
              <span>${maxPrice}</span>
              <span>$200+</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-3">
        <Button variant="outline" onClick={handleResetFilters}>Reset</Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}
