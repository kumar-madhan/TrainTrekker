import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Timetable from '@/components/train/Timetable';

export default function TimetablePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-primary-700 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-3xl font-heading font-bold mb-2">Train Timetable</h1>
            <p className="text-lg opacity-90">
              Plan your journey with our comprehensive train schedule
            </p>
          </div>
        </div>
        
        <Timetable />
      </main>
      
      <Footer />
    </div>
  );
}
