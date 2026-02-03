import { useEffect, useRef, useState } from 'react';
import { Plus, Check, ChevronDown } from 'lucide-react';
import { menuCategories } from '@/data/menu';
import { useCart } from '@/context/CartContext';

export default function FullMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(menuCategories.map((c) => c.id))
  );
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (item: typeof menuCategories[0]['items'][0]) => {
    addItem(item);
    setAddedItems((prev) => new Set(prev).add(item.id));

    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 1500);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#111111]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#d32f2f] mb-4">
            Full Menu
          </h2>
          <div className="w-20 h-1 bg-[#f9c200] mx-auto mb-4" />
          <p className="text-white/60 text-lg">Original SFC Uluberia Menu</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCategories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className={`bg-[#1e1e1e] rounded-lg border border-[#f9c200]/30 overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${0.1 + categoryIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-5 py-4 flex items-center justify-between bg-[#1a1a1a] hover:bg-[#222] transition-colors"
              >
                <h3 className="font-display text-lg text-[#f9c200] font-semibold">
                  {category.name}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-[#f9c200] transition-transform duration-300 ${
                    expandedCategories.has(category.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Items List */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedCategories.has(category.id)
                    ? 'max-h-[800px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="divide-y divide-[#333]">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-[#252525] transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        {item.description && (
                          <p className="text-white/50 text-xs mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[#ff4444] font-semibold">
                          ₹{item.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`w-7 h-7 rounded flex items-center justify-center transition-all duration-300 ${
                            addedItems.has(item.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-[#f9c200] text-black hover:bg-[#ffd700]'
                          }`}
                        >
                          {addedItems.has(item.id) ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
