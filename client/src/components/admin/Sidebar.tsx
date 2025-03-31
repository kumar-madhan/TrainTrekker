import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Train, 
  Navigation,
  TicketIcon, 
  Users,
  BarChart, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      className={`
        w-full py-2.5 px-4 rounded flex items-center text-left
        ${active 
          ? 'bg-gray-900 text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
      `}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { logoutMutation } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    // In a real app, we'd navigate to different admin sections
    // For this prototype, we'll stay on the admin page
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation('/');
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <Train className="text-white h-6 w-6 mr-2" />
          <span className="font-heading font-bold text-xl">Admin Panel</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <SidebarItem 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Dashboard" 
          active={activeSection === 'dashboard'}
          onClick={() => handleNavigation('dashboard')}
        />
        <SidebarItem 
          icon={<Train className="h-5 w-5" />} 
          label="Trains" 
          active={activeSection === 'trains'}
          onClick={() => handleNavigation('trains')}
        />
        <SidebarItem 
          icon={<Navigation className="h-5 w-5" />} 
          label="Routes" 
          active={activeSection === 'routes'}
          onClick={() => handleNavigation('routes')}
        />
        <SidebarItem 
          icon={<TicketIcon className="h-5 w-5" />} 
          label="Bookings" 
          active={activeSection === 'bookings'}
          onClick={() => handleNavigation('bookings')}
        />
        <SidebarItem 
          icon={<Users className="h-5 w-5" />} 
          label="Users" 
          active={activeSection === 'users'}
          onClick={() => handleNavigation('users')}
        />
        <SidebarItem 
          icon={<BarChart className="h-5 w-5" />} 
          label="Reports" 
          active={activeSection === 'reports'}
          onClick={() => handleNavigation('reports')}
        />
        <SidebarItem 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          active={activeSection === 'settings'}
          onClick={() => handleNavigation('settings')}
        />
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
