import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill, AlertTriangle, CheckCircle, ShoppingCart, Info, Minus, Plus } from 'lucide-react';
import { getMedicineById } from '../api/catalogApi';
import { getStockByMedicineId } from '../api/inventoryApi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LoginPromptModal from '../components/common/LoginPromptModal';
import toast from 'react-hot-toast';

export default function MedicineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const medRes = await getMedicineById(id);
        const med = medRes.data?.data || medRes.data;
        setMedicine(med);

        try {
          const stockRes = await getStockByMedicineId(med._id);
          setStockInfo(stockRes.data?.data || stockRes.data);
        } catch (e) {
          setStockInfo(null); // No stock info found
        }
      } catch (err) {
        toast.error('Failed to load medicine details');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading || !medicine) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col pt-16">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  const isOutOfStock = stockInfo && stockInfo.currentQuantity === 0;
  const isLowStock = stockInfo && stockInfo.isLowStock;
  const maxAvailable = stockInfo ? stockInfo.currentQuantity : 999;

  const expiryDate = new Date(medicine.expiryDate);
  const now = new Date();
  const daysToExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysToExpiry > 0 && daysToExpiry <= 30;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (isOutOfStock) return;
    addToCart(medicine, qty, maxAvailable);
    toast.success(`${qty}x ${medicine.name} added to cart`);
  };

  const incrementQty = () => setQty(prev => Math.min(prev + 1, maxAvailable));
  const decrementQty = () => setQty(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-dark-950 font-sans text-dark-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors font-medium w-fit"
        >
          <ArrowLeft size={18} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {/* Main Header Card */}
            <div>
              <div className="flex gap-3 mb-4">
                {medicine.requiresPrescription && (
                  <span className="badge-yellow">Prescription Required</span>
                )}
                <span className="badge-gray">{medicine.category}</span>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
                  <Pill size={36} className="text-dark-400 group-hover:text-brand-400 group-hover:scale-110 transition-all duration-300 relative z-10" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{medicine.name}</h1>
                  <p className="text-lg text-dark-400 font-medium">{medicine.genericName}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {medicine.description && (
              <div className="border-t border-dark-800 pt-8">
                <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-dark-200 leading-relaxed text-lg">{medicine.description}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">Product Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="Manufacturer" value={medicine.manufacturer} />
                <InfoRow label="Batch Number" value={medicine.batchNumber} />
                <InfoRow label="Unit Type" value={medicine.unit} />
                <InfoRow 
                  label="Expiry Date" 
                  value={new Date(medicine.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
                  highlight={isExpiringSoon}
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Pricing & Cart */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Price Card */}
            <div className="card p-6 border-dark-700 shadow-2xl">
              <div className="mb-6">
                <span className="text-sm font-semibold text-dark-400 uppercase tracking-wider block mb-2">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">₹{medicine.unitPrice.toFixed(2)}</span>
                  <span className="text-dark-500 font-medium">per {medicine.unit}</span>
                </div>
              </div>

              {/* Stock Status Box */}
              <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 border ${
                isOutOfStock ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                isLowStock ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                'bg-fresh-500/10 border-fresh-500/20 text-fresh-400'
              }`}>
                {isOutOfStock ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                <span className="font-semibold text-base">
                  {isOutOfStock ? 'Out of Stock' : 
                   isLowStock ? `Low Stock (${stockInfo.currentQuantity} remaining)` : 
                   stockInfo ? `In Stock (${stockInfo.currentQuantity} available)` : 'In Stock'}
                </span>
              </div>

              {/* Quantity & Actions (Hidden if out of stock) */}
              {!isOutOfStock && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-medium text-dark-200">Quantity</span>
                    <div className="flex items-center gap-4 bg-dark-900 border border-dark-700 rounded-xl p-1">
                      <button 
                        onClick={decrementQty}
                        disabled={qty <= 1}
                        className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-lg w-8 text-center text-white">{qty}</span>
                      <button 
                        onClick={incrementQty}
                        disabled={qty >= maxAvailable}
                        className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-dark-700/50 mb-6">
                    <span className="font-medium text-dark-200">Total</span>
                    <span className="text-2xl font-bold text-white">₹{(medicine.unitPrice * qty).toFixed(2)}</span>
                  </div>
                </>
              )}

              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-200 ${
                  isOutOfStock 
                    ? 'bg-dark-800 text-dark-500 cursor-not-allowed border border-dark-700' 
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 active:scale-95'
                }`}
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Expiry Warning Card */}
            {isExpiringSoon && (
              <div className="card border-yellow-500/30 bg-yellow-500/5 p-4 flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 text-sm mb-1">Expiring Soon</h4>
                  <p className="text-xs text-yellow-500/80">This product expires in {daysToExpiry} days. Please verify before purchase.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

// Helper component for details grid
function InfoRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-xl border border-dark-800">
      <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0 border border-dark-700">
        <Info size={16} className="text-dark-400" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-dark-500 font-semibold">{label}</span>
        <span className={`text-sm font-medium truncate ${highlight ? 'text-yellow-400' : 'text-dark-100'}`}>
          {value || 'N/A'}
        </span>
      </div>
    </div>
  );
}
