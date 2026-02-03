import { useEffect, useRef, useState } from 'react';
import { Star, Calendar, Utensils, Shield, Award } from 'lucide-react';
import { businessInfo } from '@/data/menu';

const trustBadges = [
  {
    icon: Star,
    label: `${businessInfo.rating} Google Rating`,
    description: 'Based on real customer reviews',
  },
  {
    icon: Calendar,
    label: `Since ${businessInfo.since}`,
    description: 'Serving Uluberia',
  },
  {
    icon: Utensils,
    label: 'Freshly prepared',
    description: 'Made to order',
  },
  {
    icon: Shield,
    label: 'Hygienic kitchen',
    description: 'Clean & safe',
  },
  {
    icon: Award,
    label: 'Honest pricing',
    description: 'Value for money',
  },
];

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#111111] relative overflow-hidden"
    >
      {/* Background Smoke Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d32f2f] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f9c200] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#d32f2f] mb-4">
            About SFC
          </h2>
          <div className="w-20 h-1 bg-[#f9c200] mx-auto mb-4" />
          <p className="text-white/60 text-lg">
            Uluberia's trusted destination for crispy fried chicken
          </p>
        </div>

        {/* Description */}
        <div
          className={`space-y-6 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <p className="text-white/80 text-base md:text-lg leading-relaxed text-center">
            SFC – Spezia Fried Chicken is a locally loved fried chicken outlet in Uluberia, 
            known for <span className="text-[#f9c200]">bold flavours</span>,{' '}
            <span className="text-[#f9c200]">generous portions</span>, and{' '}
            <span className="text-[#f9c200]">consistent quality</span>. Our menu blends 
            street-style spice with carefully crafted recipes, delivering crispy texture 
            on the outside and juicy taste inside.
          </p>
          <p className="text-white/80 text-base md:text-lg leading-relaxed text-center">
            From quick snacks to full combo meals, every order is prepared fresh with 
            attention to taste, hygiene, and value. Whether you dine in, take away, or 
            order online, SFC stands for honest food, fast service, and flavours that 
            keep customers coming back.
          </p>
        </div>

        {/* Trust Badges */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          <h3 className="text-center text-white/60 text-sm uppercase tracking-wider mb-6">
            Why People Trust SFC
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center p-4 bg-[#1e1e1e] rounded-lg border border-[#333] hover:border-[#f9c200]/30 transition-all duration-300 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-full bg-[#f9c200]/10 flex items-center justify-center mb-2">
                  <badge.icon className="w-5 h-5 text-[#f9c200]" />
                </div>
                <span className="text-white font-medium text-sm">{badge.label}</span>
                <span className="text-white/50 text-xs mt-0.5">{badge.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
