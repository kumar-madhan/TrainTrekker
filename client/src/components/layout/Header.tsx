import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Train,
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const userInitials = user?.firstName && user?.lastName 
    ? getInitials(`${user.firstName} ${user.lastName}`)
    : user?.username 
      ? getInitials(user.username)
      : 'U';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Train className="text-primary-600 h-8 w-8 mr-2" />
              <span className="font-heading font-bold text-xl text-primary-700">RailConnect</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link href="/" className={`px-3 py-2 text-sm font-medium ${location === '/' ? 'text-gray-900' : 'text-gray-500 hover:text-primary-600'}`}>
                Home
              </Link>
              <Link href="/timetable" className={`px-3 py-2 text-sm font-medium ${location === '/timetable' ? 'text-gray-900' : 'text-gray-500 hover:text-primary-600'}`}>
                Timetable
              </Link>
              <Link href="/offers" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Offers
              </Link>
              <Link href="/support" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Support
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            {!user ? (
              <>
                <Link href="/auth">
                  <Button variant="link" className="text-primary-600 hover:text-primary-800">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="ml-4 bg-primary-600 hover:bg-primary-700">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 bg-primary-600 text-white">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <Train className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-gray-500"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`${location === '/' 
                ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700' 
                : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} 
                block pl-3 pr-4 py-2 text-base font-medium`}
            >
              Home
            </Link>
            <Link 
              href="/timetable" 
              className={`${location === '/timetable' 
                ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700' 
                : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} 
                block pl-3 pr-4 py-2 text-base font-medium`}
            >
              Timetable
            </Link>
            <Link 
              href="/offers" 
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Offers
            </Link>
            <Link 
              href="/support" 
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Support
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {!user ? (
              <div className="mt-3 space-y-1">
                <Link href="/auth" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Log in
                </Link>
                <Link href="/auth" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Register
                </Link>
              </div>
            ) : (
              <div className="mt-3 space-y-1">
                <div className="px-4 py-2 text-base font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </div>
                <Link href="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Profile
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
