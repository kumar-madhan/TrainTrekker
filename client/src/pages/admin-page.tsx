import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/components/admin/admin-dashboard";
import TrainManagement from "@/components/admin/train-management";
import UserManagement from "@/components/admin/user-management";
import BookingManagement from "@/components/admin/booking-management";
import { LayoutDashboard, Train, Users, CalendarRange, Settings } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
            <p className="text-neutral-600 mb-4">You do not have permission to access the admin panel.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-primary text-white">
                <div className="font-semibold">Admin Panel</div>
                <div className="text-sm opacity-80">{user?.firstName} {user?.lastName}</div>
              </div>
              
              <div className="p-2">
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
                    <TabsTrigger 
                      value="dashboard" 
                      className="justify-start w-full"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger 
                      value="trains" 
                      className="justify-start w-full"
                    >
                      <Train className="h-4 w-4 mr-2" />
                      Trains
                    </TabsTrigger>
                    <TabsTrigger 
                      value="users" 
                      className="justify-start w-full"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </TabsTrigger>
                    <TabsTrigger 
                      value="bookings" 
                      className="justify-start w-full"
                    >
                      <CalendarRange className="h-4 w-4 mr-2" />
                      Bookings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings"
                      className="justify-start w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-4">
            <TabsContent value="dashboard" className="m-0">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="trains" className="m-0">
              <TrainManagement />
            </TabsContent>
            
            <TabsContent value="users" className="m-0">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="bookings" className="m-0">
              <BookingManagement />
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">System Settings</h2>
                <p className="text-neutral-500">System settings panel will be available in a future update.</p>
              </div>
            </TabsContent>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
