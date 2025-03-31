import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  User, 
  Ticket, 
  Clock, 
  CalendarDays, 
  UserCircle, 
  Mail, 
  Phone, 
  Download,
  Printer,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { BookingWithDetails } from '@shared/schema';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  
  const { data: bookings, isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ['/api/bookings'],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account and bookings</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                      <UserCircle className="h-16 w-16" />
                    </div>
                    <h2 className="text-xl font-medium">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  
                  <Tabs 
                    defaultValue={activeTab} 
                    onValueChange={setActiveTab} 
                    orientation="vertical" 
                    className="w-full"
                  >
                    <TabsList className="flex flex-col items-start w-full bg-transparent border-r h-auto p-0">
                      <TabsTrigger 
                        value="bookings" 
                        className="justify-start w-full px-3 py-2 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:border-r-2 data-[state=active]:border-primary-600 rounded-none"
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        My Bookings
                      </TabsTrigger>
                      <TabsTrigger 
                        value="profile" 
                        className="justify-start w-full px-3 py-2 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:border-r-2 data-[state=active]:border-primary-600 rounded-none"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile Details
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <TabsContent value="bookings" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>View and manage your train bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <p className="text-center py-8 text-gray-500">Loading your bookings...</p>
                    ) : !bookings || bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings yet</h3>
                        <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
                        <Button>Book Your First Trip</Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Booking ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>From - To</TableHead>
                              <TableHead>Train</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bookings.map((booking) => (
                              <TableRow key={booking.id}>
                                <TableCell className="font-medium">
                                  #{booking.bookingReference}
                                </TableCell>
                                <TableCell>{formatDate(booking.route.date)}</TableCell>
                                <TableCell>
                                  {booking.route.fromStation.name} - {booking.route.toStation.name}
                                </TableCell>
                                <TableCell>{booking.route.train.name}</TableCell>
                                <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline"
                                    className={`
                                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                      ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                                      ${booking.status === 'completed' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : ''}
                                    `}
                                  >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                    >
                                      <Download className="h-4 w-4" />
                                      <span className="sr-only">Download</span>
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                    >
                                      <Printer className="h-4 w-4" />
                                      <span className="sr-only">Print</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>View and edit your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              className="pl-10" 
                              defaultValue={user?.firstName || ''}
                              disabled 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <Input defaultValue={user?.lastName || ''} disabled />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              className="pl-10" 
                              defaultValue={user?.email || ''}
                              disabled 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              className="pl-10" 
                              defaultValue={user?.phone || ''}
                              disabled 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              className="pl-10" 
                              defaultValue={user?.username || ''}
                              disabled 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Created
                          </label>
                          <div className="relative">
                            <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              className="pl-10" 
                              defaultValue={user?.createdAt ? formatDate(user.createdAt.toString()) : ''}
                              disabled 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                        <div className="space-x-4">
                          <Button className="bg-primary-600 hover:bg-primary-700">
                            Edit Profile
                          </Button>
                          <Button variant="outline">
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
