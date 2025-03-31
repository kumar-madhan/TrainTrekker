import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchForm from '@/components/train/SearchForm';
import PopularRoutes from '@/components/train/PopularRoutes';
import { Clock, ShieldCheck, HelpCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Search Form */}
        <SearchForm />
        
        {/* Popular Routes Section */}
        <PopularRoutes />
        
        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Why Choose RailConnect</h2>
              <p className="mt-2 text-gray-600">The smartest way to book your train tickets</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Fast Booking</h3>
                <p className="text-gray-600">Book your tickets in less than 2 minutes with our streamlined booking process.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Secure Payments</h3>
                <p className="text-gray-600">Your payment information is protected with bank-level security protocols.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">24/7 Support</h3>
                <p className="text-gray-600">Our customer support team is available 24/7 to assist you with any queries.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
