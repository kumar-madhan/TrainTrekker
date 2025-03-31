import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, Clock, CreditCard, MapPin, Ticket, 
  ChevronDown, ChevronUp, Eye, FileText,
  FileSearch, AlertTriangle
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import Confirmation from "@/components/booking/confirmation";

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  
  // Fetch user bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['/api/bookings'],
  });
  
  // Fetch detailed booking when selected
  const { data: selectedBookingDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: [`/api/bookings/${selectedBooking}`],
    enabled: selectedBooking !== null
  });
  
  const handlePrintTicket = useReactToPrint({
    content: () => ticketRef.current,
    documentTitle: `RailConnect_Ticket_${selectedBooking}`,
  });
  
  const toggleBookingDetails = (bookingId: number) => {
    if (selectedBooking === bookingId) {
      setSelectedBooking(null);
    } else {
      setSelectedBooking(bookingId);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>View and manage your train bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingBookings ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex flex-col space-y-3">
                          <div className="flex justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                          <div className="flex justify-between">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-10 w-32" />
                          </div>
                          <Skeleton className="h-px w-full bg-neutral-200" />
                        </div>
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking: any) => (
                        <div key={booking.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-neutral-50"
                            onClick={() => toggleBookingDetails(booking.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <Ticket className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <div className="font-medium">Booking #{booking.id}</div>
                                <div className="text-sm text-neutral-500">
                                  {format(new Date(booking.bookingDate), "d MMM yyyy")}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                              <Badge variant={
                                booking.status === "Confirmed" ? "success" : 
                                booking.status === "Pending" ? "warning" : 
                                "destructive"
                              }>
                                {booking.status}
                              </Badge>
                              
                              <div className="text-lg font-semibold">${booking.totalPrice}</div>
                              
                              {selectedBooking === booking.id ? (
                                <ChevronUp className="h-5 w-5 text-neutral-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-neutral-500" />
                              )}
                            </div>
                          </div>
                          
                          {selectedBooking === booking.id && (
                            <div className="border-t p-4 bg-neutral-50">
                              {isLoadingDetails ? (
                                <div className="space-y-4 p-4">
                                  <Skeleton className="h-8 w-64" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-2/3" />
                                </div>
                              ) : selectedBookingDetails ? (
                                <div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                      <div className="text-sm text-neutral-500">Train</div>
                                      <div className="font-medium">
                                        {selectedBookingDetails.schedule?.train?.name} 
                                        ({selectedBookingDetails.schedule?.train?.trainNumber})
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-neutral-500">Departure</div>
                                      <div className="font-medium">
                                        {format(new Date(selectedBookingDetails.schedule?.departureTime), "EEE, d MMM yyyy, HH:mm")}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-neutral-500">Passengers</div>
                                      <div className="font-medium">
                                        {selectedBookingDetails.passengers?.length} passenger(s)
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div ref={ticketRef}>
                                    <Confirmation booking={selectedBookingDetails} />
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-3 mt-4">
                                    <Button size="sm" onClick={handlePrintTicket}>
                                      <FileText className="mr-2 h-4 w-4" />
                                      Print Ticket
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <FileSearch className="mr-2 h-4 w-4" />
                                      View Details
                                    </Button>
                                    {selectedBookingDetails.status !== "Cancelled" && (
                                      <Button size="sm" variant="destructive">
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Cancel Booking
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-4 text-neutral-500">
                                  Unable to load booking details
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-lg">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                        <Ticket className="h-8 w-8 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                      <p className="text-neutral-500 mb-4">Your booking history will appear here when you make a booking.</p>
                      <Button variant="outline">Book Your First Trip</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm text-neutral-500">Username</div>
                      <div className="font-medium">{user?.username}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col space-y-2">
                        <div className="text-sm text-neutral-500">First Name</div>
                        <div className="font-medium">{user?.firstName}</div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="text-sm text-neutral-500">Last Name</div>
                        <div className="font-medium">{user?.lastName}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm text-neutral-500">Email</div>
                      <div className="font-medium">{user?.email}</div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Update Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                  <CardDescription>Customize your travel experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-neutral-500" />
                        <span>Save preferred stations</span>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-neutral-500" />
                        <span>Saved passenger information</span>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-neutral-500" />
                        <span>Payment methods</span>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-neutral-500" />
                        <span>Notification preferences</span>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
