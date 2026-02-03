import { useEffect, useRef, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { bestSellers } from '@/data/menu';
import { useCart } from '@/context/CartContext';

export default function BestSellers() {
  const [isVisible, setIsVisible] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

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

  const handleAddToCart = (item: typeof bestSellers[0]) => {
    addItem(item);
    setAddedItems((prev) => new Set(prev).add(item.id));
    
    // Reset the checkmark after 1.5 seconds
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#111111]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#d32f2f] mb-4">
            Best Sellers
          </h2>
          <div className="w-20 h-1 bg-[#f9c200] mx-auto mb-4" />
          <p className="text-white/60 text-lg">Most ordered items</p>
        </div>

        {/* Best Sellers Card */}
        <div 
          className={`bg-[#1e1e1e] rounded-lg border border-[#f9c200]/30 overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-[#333]">
            <h3 className="font-display text-xl text-[#f9c200] font-semibold">
              Customer Favourites
            </h3>
          </div>

          {/* Items List */}
          <div className="divide-y divide-[#333]">
            {bestSellers.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-6 py-4 hover:bg-[#252525] transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-medium text-lg">{item.name}</h4>
                    {item.description && (
                      <p className="text-white/50 text-sm mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#ff4444] font-semibold text-lg">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${
                      addedItems.has(item.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-[#f9c200] text-black hover:bg-[#ffd700]'
                    }`}
                  >
                    {addedItems.has(item.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
