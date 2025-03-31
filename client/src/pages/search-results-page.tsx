import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrainResults from '@/components/train/TrainResults';
import SearchForm from '@/components/train/SearchForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SearchResultsPage() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1'
  });

  useEffect(() => {
    // Parse the query parameters from the URL
    const params = new URLSearchParams(location.split('?')[1]);
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    const date = params.get('date') || '';
    const passengers = params.get('passengers') || '1';
    
    setSearchParams({ from, to, date, passengers });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Compact Search Form at the top */}
        <div className="bg-primary-700 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-3 text-white hover:bg-primary-600"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <SearchForm />
          </div>
        </div>
        
        {/* Train Results Section */}
        <TrainResults 
          fromStation={searchParams.from}
          toStation={searchParams.to}
          date={searchParams.date}
          passengers={searchParams.passengers}
        />
      </main>
      
      <Footer />
    </div>
  );
}
