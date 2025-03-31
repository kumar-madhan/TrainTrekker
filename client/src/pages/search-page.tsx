import { useEffect } from "react";
import { useSearch } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SearchResults from "@/components/search/search-results";
import HeroSection from "@/components/home/hero-section";

export default function SearchPage() {
  const search = useSearch();
  const queryParams = new URLSearchParams(search);
  const hasSearchParams = queryParams.has('from') && queryParams.has('to');

  // Scroll to search results if search params exist
  useEffect(() => {
    if (hasSearchParams) {
      // Small delay to ensure elements are rendered
      setTimeout(() => {
        window.scrollTo({
          top: document.getElementById('searchResults')?.offsetTop || 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [hasSearchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {!hasSearchParams && <HeroSection />}
        <div id="searchResults">
          <SearchResults />
        </div>
      </main>
      <Footer />
    </div>
  );
}
