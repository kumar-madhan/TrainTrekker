import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrainResults from '@/components/train/TrainResults';
import SearchForm from '@/components/train/SearchForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function SearchResultsPage() {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1'
  });
  const [missingParams, setMissingParams] = useState<string[]>([]);

  useEffect(() => {
    // Parse the query parameters from the URL
    const params = new URLSearchParams(location.split('?')[1]);
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    const date = params.get('date') || '';
    const passengers = params.get('passengers') || '1';
    
    // Check if any required parameters are missing
    const missing: string[] = [];
    if (!from) missing.push('origin station');
    if (!to) missing.push('destination station');
    if (!date) missing.push('travel date');
    
    setMissingParams(missing);
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
        
        {/* Missing Parameters Warning */}
        {missingParams.length > 0 ? (
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Missing Search Information</h3>
                    <p className="text-gray-600 mb-4">
                      Please provide {missingParams.join(', ')} to search for available trains.
                    </p>
                    <Button 
                      onClick={() => setLocation('/')}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Go to Search Page
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* Train Results Section */
          <TrainResults 
            fromStation={searchParams.from}
            toStation={searchParams.to}
            date={searchParams.date}
            passengers={searchParams.passengers}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
