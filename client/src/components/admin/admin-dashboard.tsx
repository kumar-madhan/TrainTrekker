import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { 
  BarChart3, 
  Users, 
  Train, 
  CalendarRange, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building, 
  Clock, 
  TicketCheck 
} from "lucide-react";

import {
  Chart as ChartComponent,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartComponent.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
  });
  
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });
  
  const { data: bookings } = useQuery({
    queryKey: ['/api/bookings'],
  });
  
  // Generate mock chart data based on time range
  const generateBookingData = () => {
    let labels: string[] = [];
    let values: number[] = [];
    
    if (timeRange === "week") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      values = [12, 19, 15, 22, 33, 38, 30];
    } else if (timeRange === "month") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      values = [85, 110, 95, 120];
    } else {
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      values = [150, 180, 220, 290, 310, 380, 410, 390, 320, 270, 240, 280];
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Bookings',
          data: values,
          fill: false,
          backgroundColor: 'rgba(26, 115, 232, 0.5)',
          borderColor: 'rgba(26, 115, 232, 1)',
          tension: 0.1
        }
      ]
    };
  };
  
  const generateRevenueData = () => {
    let labels: string[] = [];
    let values: number[] = [];
    
    if (timeRange === "week") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      values = [1200, 1900, 1500, 2200, 3300, 3800, 3000];
    } else if (timeRange === "month") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      values = [8500, 11000, 9500, 12000];
    } else {
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      values = [15000, 18000, 22000, 29000, 31000, 38000, 41000, 39000, 32000, 27000, 24000, 28000];
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: values,
          fill: false,
          backgroundColor: 'rgba(52, 168, 83, 0.5)',
          borderColor: 'rgba(52, 168, 83, 1)',
          tension: 0.1
        }
      ]
    };
  };
  
  const routeData = {
    labels: ["NY-BOS", "CHI-WAS", "SEA-PDX", "LA-SF", "BOS-PHL"],
    datasets: [
      {
        label: 'Popular Routes',
        data: [345, 278, 189, 156, 132],
        backgroundColor: [
          'rgba(26, 115, 232, 0.7)',
          'rgba(66, 133, 244, 0.7)',
          'rgba(52, 168, 83, 0.7)',
          'rgba(251, 188, 5, 0.7)',
          'rgba(234, 67, 53, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold">{stats?.userCount || 0}</h3>
                <div className="flex items-center text-green-600 mt-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>15%</span>
                  <span className="text-neutral-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Bookings</p>
                <h3 className="text-2xl font-bold">{stats?.bookingCount || 0}</h3>
                <div className="flex items-center text-green-600 mt-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>8%</span>
                  <span className="text-neutral-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-green-100 text-green-600">
                <TicketCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Trains</p>
                <h3 className="text-2xl font-bold">{stats?.trainCount || 0}</h3>
                <div className="flex items-center text-neutral-600 mt-1 text-sm">
                  <span className="text-neutral-500">Active fleet</span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-yellow-100 text-yellow-600">
                <Train className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Stations</p>
                <h3 className="text-2xl font-bold">{stats?.stationCount || 0}</h3>
                <div className="flex items-center text-neutral-600 mt-1 text-sm">
                  <span className="text-neutral-500">Service network</span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-purple-100 text-purple-600">
                <Building className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Booking Overview</CardTitle>
              <Tabs value={timeRange} onValueChange={setTimeRange}>
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Line data={generateBookingData()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
              <Tabs value={timeRange} onValueChange={setTimeRange}>
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Line data={generateRevenueData()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings & Route Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      booking.status === "Confirmed" ? "bg-green-100 text-green-600" :
                      booking.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Booking #{booking.id}</div>
                        <div className="text-sm text-neutral-500">
                          {format(new Date(booking.bookingDate), "MMM d, HH:mm")}
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        User #{booking.userId} • ${booking.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-neutral-500">
                No recent bookings to display
              </div>
            )}
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin?tab=bookings">View All Bookings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Routes</CardTitle>
            <CardDescription>Most booked routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={routeData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
