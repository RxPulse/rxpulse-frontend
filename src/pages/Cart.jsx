import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle, ArrowLeft, Trash2, Package, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // Simulate checkout delay
    setTimeout(() => {
      setLoading(false);
      setOrdered(true);
      clearCart();
      toast.success('Order placed successfully!');
    }, 1500);
  };

  if (ordered) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 rounded-full bg-fresh-500/10 border-2 border-fresh-500 flex items-center justify-center mb-6 animate-slide-up">
          <CheckCircle size={48} className="text-fresh-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>Order Placed!</h2>
        <p className="text-dark-400 mb-8 max-w-sm text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
          Your order has been successfully processed. You will receive a confirmation email shortly.
        </p>
        <Link to="/shop" className="btn-primary animate-slide-up" style={{ animationDelay: '300ms' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-6">
          <ShoppingCart size={32} className="text-dark-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-dark-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn-primary">
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 font-sans text-dark-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Your Cart</h1>
              <p className="text-dark-400 font-medium">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button 
            onClick={clearCart}
            className="btn-secondary !text-red-400 hover:!bg-red-500/10 hover:!border-red-500/30"
          >
            <Trash2 size={16} /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.medicineId} className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-lg transition-all duration-200">
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center flex-shrink-0">
                  <Package size={24} className="text-dark-400" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-lg">{item.medicineName}</h3>
                  <p className="text-sm text-dark-400 truncate mb-1">{item.genericName}</p>
                  <p className="text-sm text-brand-400 font-bold">₹{item.price.toFixed(2)} <span className="text-xs text-dark-500 font-medium">/ {item.unit}</span></p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-dark-800">
                  <div className="flex items-center gap-3 bg-dark-900 border border-dark-700 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                      className="w-8 h-8 rounded-md bg-dark-800 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-6 text-center text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="w-8 h-8 rounded-md bg-dark-800 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <span className="block font-bold text-white text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.medicineId)}
                    className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Order Summary</h2>
              
              {/* Item List */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                {items.map(item => (
                  <div key={item.medicineId} className="flex justify-between text-xs">
                    <span className="text-dark-300 truncate pr-4">{item.quantity}x {item.medicineName}</span>
                    <span className="font-medium text-dark-100 flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-700 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-300">Subtotal</span>
                  <span className="font-medium text-dark-100">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-300">Delivery</span>
                  <span className="font-bold text-fresh-400">Free</span>
                </div>
                <div className="border-t border-dark-700 pt-3 mt-3 flex justify-between items-end">
                  <span className="font-semibold text-dark-200">Total</span>
                  <span className="text-2xl font-black text-white leading-none">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="btn-success w-full justify-center py-4 text-base shadow-lg shadow-fresh-500/20 mb-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <Link to="/shop" className="btn-secondary w-full justify-center">
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
