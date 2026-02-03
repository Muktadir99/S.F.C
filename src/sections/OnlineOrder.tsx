import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { orderPlatforms } from '@/data/menu';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export default function OnlineOrder() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { setIsCartOpen } = useCart();

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

  const getPlatformIcon = (icon: string) => {
    switch (icon) {
      case 'swiggy':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'zomato':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        );
      default:
        return <ExternalLink className="w-8 h-8" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="order"
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
            Online Order
          </h2>
          <div className="w-20 h-1 bg-[#f9c200] mx-auto mb-4" />
          <p className="text-white/60 text-lg">
            Choose your preferred delivery platform
          </p>
        </div>

        {/* Platform Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          {orderPlatforms.map((platform, index) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-[#1e1e1e] rounded-lg border border-[#333] p-6 flex items-center gap-4 transition-all duration-500 hover:border-[#f9c200]/50 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
              onMouseEnter={() => setHoveredPlatform(platform.id)}
              onMouseLeave={() => setHoveredPlatform(null)}
            >
              {/* Background Gradient on Hover */}
              <div
                className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                  hoveredPlatform === platform.id ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${platform.color}15 0%, transparent 100%)`,
                }}
              />

              {/* Icon */}
              <div
                className="relative z-10 w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
              >
                {getPlatformIcon(platform.icon)}
              </div>

              {/* Text */}
              <div className="relative z-10 flex-1">
                <h3 className="font-display text-xl font-semibold text-white group-hover:text-[#f9c200] transition-colors">
                  {platform.name}
                </h3>
                <p className="text-white/50 text-sm">{platform.description}</p>
              </div>

              {/* Arrow */}
              <ExternalLink className="relative z-10 w-5 h-5 text-white/30 group-hover:text-[#f9c200] transition-all duration-300 group-hover:translate-x-1" />
            </a>
          ))}
        </div>

        {/* My Orders Button */}
        <div
          className={`flex justify-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.6s' }}
        >
          <Button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#f9c200] hover:bg-[#ffd700] text-black font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#f9c200]/30"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            My Orders
          </Button>
        </div>
      </div>
    </section>
  );
}
