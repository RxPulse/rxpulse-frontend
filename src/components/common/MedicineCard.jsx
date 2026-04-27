import { Link } from 'react-router-dom';
import { Pill, AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function MedicineCard({ medicine, stockInfo, onLoginRequired, onAddToCart }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const isOutOfStock = stockInfo && stockInfo.currentQuantity === 0;
  const isLowStock = stockInfo && stockInfo.isLowStock;
  
  // Calculate days to expiry
  const expiryDate = new Date(medicine.expiryDate);
  const now = new Date();
  const daysToExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysToExpiry > 0 && daysToExpiry <= 30;

  const handleAddToCartClick = (e) => {
    e.preventDefault(); // prevent link navigation
    if (isOutOfStock) return;
    
    // Support both prop patterns
    if (onAddToCart) {
      onAddToCart(medicine, stockInfo);
    } else {
      if (!isAuthenticated && onLoginRequired) {
        onLoginRequired();
      } else {
        addToCart(medicine, 1, stockInfo?.currentQuantity || 999);
      }
    }
  };

  return (
    <Link to={`/medicines/${medicine._id}`} className="block group">
      <div className="card h-full flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 overflow-hidden relative">
        
        {/* Top Section */}
        <div className="h-40 bg-gradient-to-br from-dark-700 to-dark-800 relative flex items-center justify-center border-b border-dark-700">
          {/* Dot Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }}
          ></div>

          {/* Center Icon */}
          <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 group-hover:border-brand-500/50 group-hover:shadow-brand-500/20 transition-all duration-500">
            <Pill size={32} className="text-dark-400 group-hover:text-brand-400 transition-colors" />
          </div>

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {medicine.requiresPrescription && (
              <span className="badge-yellow shadow-lg shadow-yellow-500/10 backdrop-blur-md bg-yellow-500/20">Rx Only</span>
            )}
            {isExpiringSoon && (
              <span className="badge-yellow shadow-lg backdrop-blur-md bg-yellow-500/20">Exp: {daysToExpiry}d</span>
            )}
          </div>

          {/* Top Right Category */}
          <div className="absolute top-3 right-3 z-20">
            <span className="badge-gray shadow-lg backdrop-blur-md bg-dark-800/80">{medicine.category}</span>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-[2px] z-30 flex items-center justify-center">
              <span className="badge-red px-3 py-1.5 text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Bottom Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="font-semibold text-dark-100 group-hover:text-brand-300 transition-colors line-clamp-1 mb-1">
              {medicine.name}
            </h3>
            <p className="text-xs text-dark-400 line-clamp-1 mb-0.5">{medicine.genericName}</p>
            <p className="text-xs text-dark-500 line-clamp-1">{medicine.manufacturer}</p>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            {/* Stock Status Row */}
            {stockInfo && (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {isOutOfStock ? (
                  <>
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-red-400">Out of stock</span>
                  </>
                ) : isLowStock ? (
                  <>
                    <AlertTriangle size={14} className="text-yellow-500" />
                    <span className="text-yellow-400">Low stock ({stockInfo.currentQuantity} {stockInfo.unit})</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} className="text-fresh-500" />
                    <span className="text-fresh-400">In stock ({stockInfo.currentQuantity} {stockInfo.unit})</span>
                  </>
                )}
              </div>
            )}

            {/* Price & Action Row */}
            <div className="pt-3 border-t border-dark-700/50 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">₹{medicine.unitPrice.toFixed(2)}</span>
                <span className="text-[10px] text-dark-500 uppercase tracking-wider">/ {medicine.unit}</span>
              </div>
              
              <button 
                onClick={handleAddToCartClick}
                disabled={isOutOfStock}
                className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center
                  ${isOutOfStock 
                    ? 'bg-dark-700 text-dark-500 cursor-not-allowed' 
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 active:scale-95'
                  }`}
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
