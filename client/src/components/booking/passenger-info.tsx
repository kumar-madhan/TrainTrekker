import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const passengerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0 && num < 120;
  }, "Age must be a valid number"),
  seatId: z.number(),
});

const passengersFormSchema = z.object({
  passengers: z.array(passengerSchema),
});

type PassengerInfoProps = {
  passengerCount: number;
  selectedSeats: number[];
  onPassengerInfoComplete: (data: any) => void;
};

export default function PassengerInfo({ 
  passengerCount, 
  selectedSeats,
  onPassengerInfoComplete,
}: PassengerInfoProps) {
  const form = useForm<z.infer<typeof passengersFormSchema>>({
    resolver: zodResolver(passengersFormSchema),
    defaultValues: {
      passengers: Array(passengerCount).fill(0).map((_, i) => ({
        firstName: "",
        lastName: "",
        age: "",
        seatId: selectedSeats[i] || 0,
      })),
    },
  });
  
  const { fields } = useFieldArray({
    control: form.control,
    name: "passengers",
  });
  
  const onSubmit = (data: z.infer<typeof passengersFormSchema>) => {
    onPassengerInfoComplete(data);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Passenger Information</h3>
      <p className="text-neutral-500 mb-6">
        Please enter details for all passengers. This information will be used for your ticket.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-visible">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-500 mb-4">
                  Passenger {index + 1} - Seat {selectedSeats[index] ? `#${selectedSeats[index]}` : "Not selected"}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`passengers.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`passengers.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`passengers.${index}.age`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input placeholder="Age" type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Hidden field for seatId */}
                  <input 
                    type="hidden" 
                    {...form.register(`passengers.${index}.seatId`)} 
                    value={selectedSeats[index] || 0}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end">
            <Button type="submit">Continue to Payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
