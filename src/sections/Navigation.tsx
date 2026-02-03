import { useState, useEffect } from 'react';
import { Menu, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { name: 'Menu', href: '#menu' },
  { name: 'Order', href: '#order' },
  { name: 'About', href: '#about' },
  { name: 'Map', href: '#map' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      // Add background when scrolled
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-crispy ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'glass' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a 
            href="#" 
            className="flex flex-col items-start"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="font-display text-2xl md:text-3xl font-bold text-white tracking-wider">
              SFC
            </span>
            <span className="text-[10px] md:text-xs text-[#f9c200] tracking-[0.2em] uppercase">
              Spezia Fried Chicken
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-white/90 hover:text-[#f9c200] text-sm font-medium underline-animate transition-colors duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#f9c200]/30 transition-all duration-300 hover:bg-[#f9c200]/10 ${
                totalItems > 0 ? 'animate-pulse-glow' : ''
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-[#f9c200]" />
              <span className="text-sm text-white">{totalItems}</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#d32f2f] rounded-full" />
              )}
            </button>

            {/* My Orders Button - Desktop */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hidden md:block text-sm text-white/90 hover:text-[#f9c200] transition-colors"
            >
              My Orders
            </button>

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-white hover:text-[#f9c200] transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1a1a1a] border-[#333] w-[280px]">
                <SheetHeader>
                  <SheetTitle className="text-white font-display text-xl">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => scrollToSection(link.href)}
                      className="text-left text-white/80 hover:text-[#f9c200] text-lg font-medium py-2 border-b border-[#333] transition-colors"
                    >
                      {link.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="text-left text-white/80 hover:text-[#f9c200] text-lg font-medium py-2 border-b border-[#333] transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    My Orders
                    {totalItems > 0 && (
                      <span className="ml-auto bg-[#f9c200] text-black text-xs px-2 py-0.5 rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
