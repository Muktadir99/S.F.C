import { Minus, Plus, Trash2, ShoppingBag, X, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { businessInfo } from '@/data/menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const orderText = items
      .map((item) => `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
      .join('\n');

    const message = `Hello SFC! I'd like to place an order:\n\n${orderText}\n\nTotal: ₹${totalPrice}\n\nPlease confirm my order.`;

    window.open(
      `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="bg-[#1a1a1a] border-[#333] w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-[#333] pb-4">
          <SheetTitle className="text-white font-display text-xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#f9c200]" />
            Your Order
            {totalItems > 0 && (
              <span className="ml-auto text-sm text-white/60">
                {totalItems} item{totalItems > 1 ? 's' : ''}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-[#333] mb-4" />
              <p className="text-white/60 text-lg mb-2">Your cart is empty</p>
              <p className="text-white/40 text-sm">
                Add some delicious items to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[#1e1e1e] rounded-lg p-3 border border-[#333]"
                >
                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{item.name}</h4>
                    <p className="text-[#ff4444] font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded bg-[#333] text-white hover:bg-[#444] flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded bg-[#f9c200] text-black hover:bg-[#ffd700] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded text-white/40 hover:text-[#d32f2f] hover:bg-[#d32f2f]/10 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#333] pt-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-white/60">Subtotal</span>
              <span className="text-white font-display text-2xl font-bold">
                ₹{totalPrice}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white font-semibold py-6 transition-all duration-300"
              >
                <Send className="w-5 h-5 mr-2" />
                Order on WhatsApp
              </Button>
              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full border-[#333] text-white/60 hover:text-white hover:bg-[#333] transition-all duration-300"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {/* Note */}
            <p className="text-white/40 text-xs text-center">
              Your order will be sent via WhatsApp for confirmation
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
