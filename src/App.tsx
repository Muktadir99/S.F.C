import { CartProvider } from '@/context/CartContext';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import BestSellers from '@/sections/BestSellers';
import FullMenu from '@/sections/FullMenu';
import OnlineOrder from '@/sections/OnlineOrder';
import About from '@/sections/About';
import FindUs from '@/sections/FindUs';
import Footer from '@/sections/Footer';
import CartDrawer from '@/sections/CartDrawer';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#111111]">
        <Navigation />
        <main>
          <Hero />
          <BestSellers />
          <FullMenu />
          <OnlineOrder />
          <About />
          <FindUs />
        </main>
        <Footer />
        <CartDrawer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #333',
            },
          }}
        />
      </div>
    </CartProvider>
  );
}

export default App;
