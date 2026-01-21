import { useState, useEffect } from 'react';
import { products } from '@/app/data/products';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  quantity: number;
}

export function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
    const handleStorage = () => loadCart();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const updateQuantity = (productId: string, change: number) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Item removed from cart');
    window.dispatchEvent(new Event('storage'));
  };

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + (item!.price * item!.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 1000 ? 0 : 49;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    toast.success('Proceeding to payment gateway... (Demo)');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link to="/products" className="inline-block px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item!.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-6">
                  <img
                    src={item!.imageUrl}
                    alt={item!.name}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item!.name}</h3>
                        <p className="text-sm text-gray-600">{item!.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item!.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item!.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item!.id, -1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{item!.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item!.id, 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${(item!.price * item!.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item!.price} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {subtotal > 1000 && (
                  <div className="text-sm text-green-600">
                    Free shipping on orders over $1,000!
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-semibold"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment processing • SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
