import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Star } from 'lucide-react';
import { businessInfo } from '@/data/menu';
import { Button } from '@/components/ui/button';

export default function FindUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Simulate map loading delay for animation
      const timer = setTimeout(() => setIsMapLoaded(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="map"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#111111]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#d32f2f] mb-4">
            Find Us
          </h2>
          <div className="w-20 h-1 bg-[#f9c200] mx-auto mb-4" />
          <p className="text-white/60 text-lg">{businessInfo.location}</p>
        </div>

        {/* Map Container */}
        <div
          className={`relative rounded-xl overflow-hidden border-2 border-[#d32f2f]/50 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          {/* Google Maps Embed */}
          <div className="relative w-full h-[350px] md:h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.5!2d88.1!3d22.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275e5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sSFC%20Spezia%20Fried%20Chicken!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: isMapLoaded ? 'none' : 'grayscale(100%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SFC Location"
              className={`transition-all duration-700 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            
            {/* Loading State */}
            {!isMapLoaded && (
              <div className="absolute inset-0 bg-[#1e1e1e] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#f9c200] mx-auto mb-4 animate-bounce" />
                  <p className="text-white/60">Loading map...</p>
                </div>
              </div>
            )}

            {/* Location Card Overlay */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-[280px] hidden md:block">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#d32f2f] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900">
                    SFC - Spezia Fried Chicken
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {businessInfo.address}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {businessInfo.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({businessInfo.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info & CTA */}
        <div
          className={`mt-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-5 h-5 text-[#f9c200]" />
              <span>Open {businessInfo.hours}</span>
            </div>
            <a
              href={`tel:${businessInfo.phone}`}
              className="flex items-center gap-2 text-white/70 hover:text-[#f9c200] transition-colors"
            >
              <Phone className="w-5 h-5 text-[#f9c200]" />
              <span>{businessInfo.phone}</span>
            </a>
          </div>

          {/* Get Directions Button */}
          <Button
            asChild
            className="bg-[#f9c200] hover:bg-[#ffd700] text-black font-semibold px-8 py-6 text-base rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#f9c200]/30 group"
          >
            <a
              href={businessInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Get Directions
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
