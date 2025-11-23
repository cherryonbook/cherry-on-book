import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  removeFromCart,
  updateQuantity,
  onCheckout
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <h2 className="font-serif text-2xl text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-cherry-600" />
            Your Bag
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-stone-500 text-lg">Your bag is empty.</p>
              <button 
                onClick={onClose} 
                className="text-cherry-600 font-medium hover:text-cherry-700 underline underline-offset-4"
              >
                Start browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-28 flex-shrink-0 rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                  <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-serif font-medium text-stone-900 leading-tight">{item.title}</h3>
                    <p className="text-sm text-stone-500">{item.author}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-stone-100 rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-serif text-xl font-bold text-stone-900">₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-cherry-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-cherry-200 hover:bg-cherry-700 hover:shadow-xl active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Checkout <span className="opacity-80">|</span> ₹{total.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};