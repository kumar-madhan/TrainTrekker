import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '@/components/admin/Sidebar';
import Dashboard from '@/components/admin/Dashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAdmin } = useAuth();

  useEffect(() => {
    // If not an admin after loading, redirect to home
    if (!isLoading && user && !isAdmin) {
      setLocation('/');
    }
  }, [isLoading, user, isAdmin, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // This check is also handled by the ProtectedRoute with adminOnly=true,
  // but we add it here as an extra safety measure
  if (!user || !isAdmin) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm">{user.firstName} {user.lastName}</span>
              <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                <span className="font-medium">
                  {user.firstName && user.lastName 
                    ? `${user.firstName[0]}${user.lastName[0]}`
                    : user.username[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
