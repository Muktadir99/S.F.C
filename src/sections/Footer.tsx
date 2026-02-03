import { businessInfo } from '@/data/menu';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-t border-[#222]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-4">
          <h3 className="font-display text-2xl font-bold text-white">
            SFC – Spezia Fried Chicken
          </h3>
        </div>

        {/* Location & Hours */}
        <p className="text-white/60 mb-2">
          {businessInfo.location} • Open {businessInfo.hours}
        </p>

        {/* Copyright */}
        <p className="text-white/40 text-sm">
          © {currentYear} All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
