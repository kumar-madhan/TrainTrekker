import { Link } from "wouter";
import { Train, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-1 mb-4">
              <Train className="h-6 w-6 text-white" />
              <h3 className="text-xl font-bold">RailConnect</h3>
            </div>
            <p className="text-neutral-300 mb-4">
              Your reliable partner for train travel across the country. Book with ease and travel with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-300 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-neutral-300 hover:text-white transition">
                  Search Trains
                </Link>
              </li>
              <li>
                <Link href="/timetable" className="text-neutral-300 hover:text-white transition">
                  Timetables
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-neutral-300 hover:text-white transition">
                  Manage Booking
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-neutral-300 hover:text-white transition">
                  Track My Train
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Travel Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/routes" className="text-neutral-300 hover:text-white transition">
                  Routes & Destinations
                </Link>
              </li>
              <li>
                <Link href="/classes" className="text-neutral-300 hover:text-white transition">
                  Travel Classes
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-neutral-300 hover:text-white transition">
                  Seasonal Offers
                </Link>
              </li>
              <li>
                <Link href="/group" className="text-neutral-300 hover:text-white transition">
                  Group Travel
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-neutral-300 hover:text-white transition">
                  Travel Guidelines
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mt-1 mr-3 text-neutral-400" />
                <span className="text-neutral-300">123 Railway Avenue, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-neutral-400" />
                <span className="text-neutral-300">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-neutral-400" />
                <span className="text-neutral-300">support@railconnect.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} RailConnect. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-400">
            <Link href="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/cookie" className="hover:text-white transition">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-white transition">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
