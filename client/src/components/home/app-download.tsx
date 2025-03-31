import { FaApple, FaGooglePlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function AppDownload() {
  return (
    <section className="py-12 bg-primary-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Download Our Mobile App</h2>
            <p className="text-neutral-600 mb-6">
              Get the RailConnect app for easy booking on the go. Access your tickets, check train status, and receive real-time updates.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center bg-black text-white border-black hover:bg-black/90">
                <FaApple className="text-2xl mr-3" />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center bg-black text-white border-black hover:bg-black/90">
                <FaGooglePlay className="text-2xl mr-3" />
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div 
              className="w-full max-w-md h-72 md:h-80 rounded-lg shadow-xl bg-cover bg-center"
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=450&q=80')",
                backgroundPosition: "center"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
