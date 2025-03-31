import { useQuery } from '@tanstack/react-query';
import { 
  TicketIcon, 
  Users, 
  DollarSign, 
  Train,
  ArrowUp,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BookingWithDetails, Train as TrainType } from '@shared/schema';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeDirection?: 'up' | 'right' | 'down';
}

function StatsCard({ title, value, icon, change, changeDirection }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            {icon}
          </div>
        </div>
        {change && (
          <div className="text-xs text-green-600 mt-2 flex items-center">
            {changeDirection === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
            {changeDirection === 'right' && <ArrowRight className="h-3 w-3 mr-1" />}
            {change} from last week
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<BookingWithDetails[]>({
    queryKey: ['/api/admin/bookings'],
  });

  const { data: trains, isLoading: isLoadingTrains } = useQuery<TrainType[]>({
    queryKey: ['/api/admin/trains'],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Total Bookings" 
          value={isLoadingBookings ? "-" : `${bookings?.length || 0}`}
          icon={<TicketIcon className="h-6 w-6" />}
          change="12%"
          changeDirection="up"
        />
        
        <StatsCard 
          title="Active Users" 
          value="3,642"
          icon={<Users className="h-6 w-6" />}
          change="8%"
          changeDirection="up"
        />
        
        <StatsCard 
          title="Revenue" 
          value="$24,589"
          icon={<DollarSign className="h-6 w-6" />}
          change="15%"
          changeDirection="up"
        />
        
        <StatsCard 
          title="Active Trains" 
          value={isLoadingTrains ? "-" : `${trains?.filter(t => t.status === 'active').length || 0}`}
          icon={<Train className="h-6 w-6" />}
          change="Same as last week"
          changeDirection="right"
        />
      </div>
      
      {/* Recent Bookings */}
      <Card className="overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-medium">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Train</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBookings ? (
                // Loading skeletons
                Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : bookings?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings?.slice(0, 5).map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.bookingReference}</TableCell>
                    <TableCell>{booking.user.firstName} {booking.user.lastName}</TableCell>
                    <TableCell>{booking.route.train.name}</TableCell>
                    <TableCell>{booking.route.fromStation.name} to {booking.route.toStation.name}</TableCell>
                    <TableCell>{formatDate(booking.route.date)}</TableCell>
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
                      <div className="flex space-x-2">
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Button>
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0 text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
          <Button variant="link" className="text-primary-600 hover:text-primary-900">
            View all bookings
          </Button>
        </div>
      </Card>
      
      {/* Manage Trains */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-medium">Manage Trains</h3>
          <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
            Add New Train
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingTrains ? (
                // Loading skeletons
                Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : trains?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No trains found
                  </TableCell>
                </TableRow>
              ) : (
                trains?.map((train) => (
                  <TableRow key={train.id}>
                    <TableCell className="font-medium">#{train.trainNumber}</TableCell>
                    <TableCell>{train.name}</TableCell>
                    <TableCell>{train.type}</TableCell>
                    <TableCell>{train.capacity} seats</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={`
                          ${train.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                          ${train.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                          ${train.status === 'inactive' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : ''}
                        `}
                      >
                        {train.status.charAt(0).toUpperCase() + train.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Button>
                        {train.status === 'active' ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-red-600 hover:text-red-900"
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-green-600 hover:text-green-900"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
          <Button variant="link" className="text-primary-600 hover:text-primary-900">
            View all trains
          </Button>
        </div>
      </Card>
    </div>
  );
}
