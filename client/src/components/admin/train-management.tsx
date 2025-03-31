import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  Train, 
  MoreHorizontal,
  Wifi,
  Power,
  Utensils,
  Bicycle,
} from "lucide-react";
import { insertTrainSchema } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Extend the schema for form needs
const trainFormSchema = insertTrainSchema.extend({
  hasWifi: z.boolean().default(false).optional(),
  hasPower: z.boolean().default(false).optional(),
  hasFood: z.boolean().default(false).optional(),
  hasBicycle: z.boolean().default(false).optional(),
});

export default function TrainManagement() {
  const { toast } = useToast();
  const [isAddTrainOpen, setIsAddTrainOpen] = useState(false);
  const [isEditTrainOpen, setIsEditTrainOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch trains
  const { data: trains, isLoading } = useQuery({
    queryKey: ['/api/trains'],
  });
  
  // Form for adding a train
  const form = useForm<z.infer<typeof trainFormSchema>>({
    resolver: zodResolver(trainFormSchema),
    defaultValues: {
      name: "",
      trainNumber: "",
      type: "Express",
      totalSeats: 200,
      amenities: [],
      hasWifi: false,
      hasPower: false,
      hasFood: false,
      hasBicycle: false,
    },
  });
  
  // Form for editing a train
  const editForm = useForm<z.infer<typeof trainFormSchema>>({
    resolver: zodResolver(trainFormSchema),
    defaultValues: {
      name: "",
      trainNumber: "",
      type: "Express",
      totalSeats: 200,
      amenities: [],
      hasWifi: false,
      hasPower: false,
      hasFood: false,
      hasBicycle: false,
    },
  });
  
  // Create train mutation
  const createTrainMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/trains", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trains'] });
      setIsAddTrainOpen(false);
      form.reset();
      toast({
        title: "Train Added",
        description: "The train has been successfully added.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Train",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update train mutation
  const updateTrainMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/trains/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trains'] });
      setIsEditTrainOpen(false);
      editForm.reset();
      toast({
        title: "Train Updated",
        description: "The train has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Train",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete train mutation
  const deleteTrainMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/trains/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trains'] });
      setIsDeleteDialogOpen(false);
      setSelectedTrain(null);
      toast({
        title: "Train Deleted",
        description: "The train has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Delete Train",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: z.infer<typeof trainFormSchema>) => {
    // Process amenities from checkboxes
    const amenities: string[] = [];
    if (data.hasWifi) amenities.push("WiFi");
    if (data.hasPower) amenities.push("Power Outlets");
    if (data.hasFood) amenities.push("Food Service");
    if (data.hasBicycle) amenities.push("Bicycle Storage");
    
    // Remove checkbox fields before sending to API
    const { hasWifi, hasPower, hasFood, hasBicycle, ...trainData } = data;
    
    // Send mutation
    createTrainMutation.mutate({
      ...trainData,
      amenities
    });
  };
  
  const onEditSubmit = (data: z.infer<typeof trainFormSchema>) => {
    if (!selectedTrain) return;
    
    // Process amenities from checkboxes
    const amenities: string[] = [];
    if (data.hasWifi) amenities.push("WiFi");
    if (data.hasPower) amenities.push("Power Outlets");
    if (data.hasFood) amenities.push("Food Service");
    if (data.hasBicycle) amenities.push("Bicycle Storage");
    
    // Remove checkbox fields before sending to API
    const { hasWifi, hasPower, hasFood, hasBicycle, ...trainData } = data;
    
    // Send mutation
    updateTrainMutation.mutate({
      id: selectedTrain.id,
      data: {
        ...trainData,
        amenities
      }
    });
  };
  
  const handleEdit = (train: any) => {
    setSelectedTrain(train);
    
    // Check which amenities the train has
    const hasWifi = train.amenities.some((a: string) => a.includes("WiFi"));
    const hasPower = train.amenities.some((a: string) => a.includes("Power"));
    const hasFood = train.amenities.some((a: string) => a.includes("Food"));
    const hasBicycle = train.amenities.some((a: string) => a.includes("Bicycle"));
    
    // Set form values
    editForm.reset({
      name: train.name,
      trainNumber: train.trainNumber,
      type: train.type,
      totalSeats: train.totalSeats,
      amenities: train.amenities,
      hasWifi,
      hasPower,
      hasFood,
      hasBicycle,
    });
    
    setIsEditTrainOpen(true);
  };
  
  const handleDelete = (train: any) => {
    setSelectedTrain(train);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedTrain) {
      deleteTrainMutation.mutate(selectedTrain.id);
    }
  };
  
  // Filter trains based on search query
  const filteredTrains = trains 
    ? trains.filter((train: any) => 
        train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Train Management</CardTitle>
              <CardDescription>Manage the trains in the system</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Search trains..."
                  className="pl-8 w-48 md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddTrainOpen} onOpenChange={setIsAddTrainOpen}>
                <DialogTrigger asChild>
                  <Button className="whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Train
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Train</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new train
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Train Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Northeast Express" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="trainNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Train Number</FormLabel>
                            <FormControl>
                              <Input placeholder="NE-135" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Train Type</FormLabel>
                            <FormControl>
                              <Input placeholder="Express" {...field} />
                            </FormControl>
                            <FormDescription>
                              E.g., Express, Regional, Local
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="totalSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Seats</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Amenities</FormLabel>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <FormField
                            control={form.control}
                            name="hasWifi"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex items-center space-x-1">
                                  <Wifi className="h-4 w-4" />
                                  <span>WiFi</span>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hasPower"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex items-center space-x-1">
                                  <Power className="h-4 w-4" />
                                  <span>Power</span>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hasFood"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex items-center space-x-1">
                                  <Utensils className="h-4 w-4" />
                                  <span>Food</span>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hasBicycle"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="flex items-center space-x-1">
                                  <Bicycle className="h-4 w-4" />
                                  <span>Bicycle</span>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit" disabled={createTrainMutation.isPending}>
                          {createTrainMutation.isPending ? "Adding..." : "Add Train"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-2">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredTrains.length === 0 ? (
            <div className="text-center p-6 bg-neutral-50 rounded-lg">
              <Train className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium">No Trains Found</h3>
              <p className="text-neutral-500">
                {searchQuery ? "No trains match your search criteria" : "There are no trains in the system yet"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrains.map((train: any) => (
                  <TableRow key={train.id}>
                    <TableCell className="font-medium">{train.name}</TableCell>
                    <TableCell>{train.trainNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{train.type}</Badge>
                    </TableCell>
                    <TableCell>{train.totalSeats}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {train.amenities.includes("WiFi") && 
                          <Badge variant="secondary" className="text-xs py-0">
                            <Wifi className="h-3 w-3 mr-1" />
                            WiFi
                          </Badge>
                        }
                        {train.amenities.includes("Power") && 
                          <Badge variant="secondary" className="text-xs py-0">
                            <Power className="h-3 w-3 mr-1" />
                            Power
                          </Badge>
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(train)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(train)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Train Dialog */}
      <Dialog open={isEditTrainOpen} onOpenChange={setIsEditTrainOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Train</DialogTitle>
            <DialogDescription>
              Update the details of the train
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="trainNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      E.g., Express, Regional, Local
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="totalSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Seats</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Amenities</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <FormField
                    control={editForm.control}
                    name="hasWifi"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-1">
                          <Wifi className="h-4 w-4" />
                          <span>WiFi</span>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="hasPower"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-1">
                          <Power className="h-4 w-4" />
                          <span>Power</span>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="hasFood"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-1">
                          <Utensils className="h-4 w-4" />
                          <span>Food</span>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="hasBicycle"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-1">
                          <Bicycle className="h-4 w-4" />
                          <span>Bicycle</span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={updateTrainMutation.isPending}>
                  {updateTrainMutation.isPending ? "Updating..." : "Update Train"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Train</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this train? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-neutral-50 p-4 rounded-lg mb-4">
            <div className="font-medium">{selectedTrain?.name}</div>
            <div className="text-sm text-neutral-500">
              Train #{selectedTrain?.trainNumber} • {selectedTrain?.type}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteTrainMutation.isPending}
            >
              {deleteTrainMutation.isPending ? "Deleting..." : "Delete Train"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
