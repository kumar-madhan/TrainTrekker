import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search,
  Calendar,
  MoreHorizontal,
  Eye,
  Clock,
  User,
  Train,
  Check,
  X,
  Clock8,
  Ticket,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookingManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  
  // Fetch bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/bookings'],
  });
  
  // Update booking status mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/bookings/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      setIsUpdateStatusOpen(false);
      toast({
        title: "Status Updated",
        description: "The booking status has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Get detailed booking when selected
  const { data: bookingDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: [`/api/bookings/${selectedBooking?.id}`],
    enabled: selectedBooking !== null && isViewBookingOpen
  });
  
  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsViewBookingOpen(true);
  };
  
  const handleUpdateStatus = (booking: any) => {
    setSelectedBooking(booking);
    setIsUpdateStatusOpen(true);
  };
  
  const confirmStatusUpdate = (status: string) => {
    if (selectedBooking) {
      updateBookingStatusMutation.mutate({
        id: selectedBooking.id,
        status
      });
    }
  };
  
  // Filter bookings based on search query and status filter
  const filteredBookings = bookings 
    ? bookings.filter((booking: any) => {
        // Status filter
        if (statusFilter !== "all" && booking.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
        
        // Search query filter
        if (searchQuery) {
          const bookingId = booking.id.toString();
          const userId = booking.userId.toString();
          return bookingId.includes(searchQuery) || userId.includes(searchQuery);
        }
        
        return true;
      })
    : [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>Manage bookings in the system</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Search booking ID..."
                  className="pl-8 w-full sm:w-48 md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
          ) : filteredBookings.length === 0 ? (
            <div className="text-center p-6 bg-neutral-50 rounded-lg">
              <Ticket className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium">No Bookings Found</h3>
              <p className="text-neutral-500">
                {searchQuery || statusFilter !== "all" 
                  ? "No bookings match your search criteria" 
                  : "There are no bookings in the system yet"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>User #{booking.userId}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-neutral-400" />
                        <span>{format(new Date(booking.bookingDate), "MMM dd, yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>${booking.totalPrice}</TableCell>
                    <TableCell>
                      <Badge variant={
                        booking.status === "Confirmed" ? "success" : 
                        booking.status === "Pending" ? "warning" : 
                        "destructive"
                      }>
                        {booking.status === "Confirmed" && <Check className="h-3 w-3 mr-1" />}
                        {booking.status === "Pending" && <Clock8 className="h-3 w-3 mr-1" />}
                        {booking.status === "Cancelled" && <X className="h-3 w-3 mr-1" />}
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {booking.paymentStatus}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleViewBooking(booking)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(booking)}>
                            <Clock className="h-4 w-4 mr-2" />
                            Update Status
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
      
      {/* View Booking Dialog */}
      <Dialog open={isViewBookingOpen} onOpenChange={setIsViewBookingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View detailed information about this booking
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDetails ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : bookingDetails ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-lg">Booking #{bookingDetails.id}</h3>
                </div>
                <Badge variant={
                  bookingDetails.status === "Confirmed" ? "success" : 
                  bookingDetails.status === "Pending" ? "warning" : 
                  "destructive"
                }>
                  {bookingDetails.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Booking Date</div>
                  <div className="font-medium">
                    {format(new Date(bookingDetails.bookingDate), "MMMM dd, yyyy HH:mm")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Amount</div>
                  <div className="font-medium">${bookingDetails.totalPrice}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Payment Method</div>
                  <div className="font-medium capitalize">
                    {bookingDetails.paymentMethod || "Credit Card"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Payment Status</div>
                  <div className="font-medium">{bookingDetails.paymentStatus}</div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="text-sm text-neutral-500 mb-2">Journey Details</div>
                <div className="flex items-center space-x-3 mb-2">
                  <Train className="h-5 w-5 text-primary" />
                  <div className="font-medium">
                    {bookingDetails.schedule?.train?.name} (#{bookingDetails.schedule?.train?.trainNumber})
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-neutral-500">Departure</div>
                    <div className="font-medium">
                      {bookingDetails.schedule ? format(new Date(bookingDetails.schedule.departureTime), "MMM dd, yyyy HH:mm") : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Arrival</div>
                    <div className="font-medium">
                      {bookingDetails.schedule ? format(new Date(bookingDetails.schedule.arrivalTime), "MMM dd, yyyy HH:mm") : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              
              {bookingDetails.passengers && bookingDetails.passengers.length > 0 && (
                <div className="pt-2">
                  <div className="text-sm text-neutral-500 mb-2">Passengers ({bookingDetails.passengers.length})</div>
                  <div className="space-y-2">
                    {bookingDetails.passengers.map((passenger: any) => (
                      <div key={passenger.id} className="flex items-center space-x-3 border-b pb-2 last:border-0">
                        <User className="h-5 w-5 text-neutral-400" />
                        <div>
                          <div className="font-medium">{passenger.firstName} {passenger.lastName}</div>
                          <div className="text-sm text-neutral-500">
                            Age: {passenger.age} | Seat: {passenger.seatId}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-neutral-500">
              Unable to load booking details
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewBookingOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-sm text-neutral-500 mb-1">Current Status</div>
            <Badge variant={
              selectedBooking?.status === "Confirmed" ? "success" : 
              selectedBooking?.status === "Pending" ? "warning" : 
              "destructive"
            } className="mb-4">
              {selectedBooking?.status}
            </Badge>
            
            <div className="text-sm text-neutral-500 mb-2">Select New Status</div>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant={selectedBooking?.status === "Confirmed" ? "outline" : "default"}
                className={selectedBooking?.status === "Confirmed" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" : "bg-green-600 hover:bg-green-700"}
                onClick={() => confirmStatusUpdate("Confirmed")}
                disabled={selectedBooking?.status === "Confirmed" || updateBookingStatusMutation.isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
              
              <Button 
                variant={selectedBooking?.status === "Pending" ? "outline" : "default"}
                className={selectedBooking?.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800" : "bg-yellow-600 hover:bg-yellow-700"}
                onClick={() => confirmStatusUpdate("Pending")}
                disabled={selectedBooking?.status === "Pending" || updateBookingStatusMutation.isPending}
              >
                <Clock8 className="h-4 w-4 mr-2" />
                Mark as Pending
              </Button>
              
              <Button 
                variant={selectedBooking?.status === "Cancelled" ? "outline" : "destructive"}
                onClick={() => confirmStatusUpdate("Cancelled")}
                disabled={selectedBooking?.status === "Cancelled" || updateBookingStatusMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
