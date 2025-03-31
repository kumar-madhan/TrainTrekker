import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MapPin, Users } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { searchSchema, SearchParams } from "@shared/schema";

export default function HeroSection() {
  const [, navigate] = useLocation();
  const currentDate = new Date();
  
  const form = useForm<SearchParams>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      from: "",
      to: "",
      date: format(currentDate, "yyyy-MM-dd"),
      passengers: 1,
    },
  });
  
  const onSubmit = (data: SearchParams) => {
    navigate(`/search?from=${data.from}&to=${data.to}&date=${data.date}&passengers=${data.passengers}`);
  };

  return (
    <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Book Your Train Journey</h1>
          <p className="text-lg mb-8 max-w-2xl">Fast, convenient and affordable train tickets across the country</p>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="text-neutral-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-neutral-600">From</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
                            <Input
                              placeholder="Departure station"
                              className="w-full pl-10 pr-3 py-2 border border-neutral-200"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-neutral-600">To</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
                            <Input
                              placeholder="Arrival station"
                              className="w-full pl-10 pr-3 py-2 border border-neutral-200"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-neutral-600">Departure Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
                                <Button 
                                  variant="outline" 
                                  className="w-full pl-10 pr-3 py-6 h-10 font-normal border border-neutral-200 justify-start text-left"
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={new Date(field.value)}
                              onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                              initialFocus
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="passengers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-neutral-600">Passengers</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute top-3 left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
                              <SelectTrigger className="w-full pl-10 pr-3 py-6 h-10 border border-neutral-200">
                                <SelectValue placeholder="Select passengers" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 Passenger</SelectItem>
                            <SelectItem value="2">2 Passengers</SelectItem>
                            <SelectItem value="3">3 Passengers</SelectItem>
                            <SelectItem value="4">4 Passengers</SelectItem>
                            <SelectItem value="5">5 Passengers</SelectItem>
                            <SelectItem value="6">6 Passengers</SelectItem>
                            <SelectItem value="7">7 Passengers</SelectItem>
                            <SelectItem value="8">8 Passengers</SelectItem>
                            <SelectItem value="9">9 Passengers</SelectItem>
                            <SelectItem value="10">10 Passengers</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    type="submit" 
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md"
                  >
                    Search Trains
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
