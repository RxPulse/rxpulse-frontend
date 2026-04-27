import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, RefreshCw, Package } from 'lucide-react';
import { getMedicines, getCategories } from '../api/catalogApi';
import { getStocks } from '../api/inventoryApi';
import MedicineCard from '../components/common/MedicineCard';
import LoginPromptModal from '../components/common/LoginPromptModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PAGE_SIZE = 12;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [medRes, catRes, stockRes] = await Promise.all([
        getMedicines(), 
        getCategories(), 
        getStocks()
      ]);
      const meds = medRes.data?.data?.medicines || medRes.data?.data || [];
      const cats = catRes.data?.data?.categories || catRes.data?.data || [];
      const stocks = stockRes.data?.data?.stocks || stockRes.data?.data || [];
      
      const map = {};
      stocks.forEach((s) => { map[s.medicineName] = s; });
      
      setMedicines(meds);
      setCategories(cats);
      setStockMap(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let list = [...medicines];
    if (search) list = list.filter((m) => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.genericName?.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedCat) list = list.filter((m) => m.category === selectedCat);
    list.sort((a, b) => a.name.localeCompare(b.name)); // Default sort A-Z
    return list;
  }, [medicines, search, selectedCat]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCat('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col">
      {/* Hero Header */}
      <div className="bg-dark-900 border-b border-dark-800 pb-8 pt-10">
        <div className="page-container flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Medicine Catalog</h1>
            <p className="text-dark-400 font-medium">Showing {filtered.length} available products</p>
          </div>
          <button 
            onClick={() => fetchData(true)}
            disabled={refreshing || loading}
            className="btn-secondary"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="page-container py-8 flex-1 flex flex-col">
        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search medicines by name or generic..."
              className="input pl-11 pr-10 bg-dark-900 border-dark-700 h-12"
            />
            {search && (
              <button 
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Select */}
          <div className="relative w-full md:w-64">
            <SlidersHorizontal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
            <select
              value={selectedCat}
              onChange={(e) => { setSelectedCat(e.target.value); setPage(1); }}
              className="input pl-11 bg-dark-900 border-dark-700 h-12 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* Active Filters Row */}
        {(search || selectedCat) && (
          <div className="flex items-center flex-wrap gap-3 mb-8">
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider mr-2">Active Filters:</span>
            
            {search && (
              <div className="badge-blue flex items-center gap-1.5 px-3 py-1.5">
                Search: {search}
                <button onClick={() => { setSearch(''); setPage(1); }} className="hover:text-white"><X size={12} /></button>
              </div>
            )}
            
            {selectedCat && (
              <div className="badge-blue flex items-center gap-1.5 px-3 py-1.5">
                Category: {selectedCat}
                <button onClick={() => { setSelectedCat(''); setPage(1); }} className="hover:text-white"><X size={12} /></button>
              </div>
            )}

            <button onClick={clearAllFilters} className="text-sm text-dark-400 hover:text-white underline ml-2 transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading catalog..." />
        ) : paginated.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-4">
              <Package size={32} className="text-dark-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No medicines found</h3>
            <p className="text-dark-400 mb-6">Try adjusting your filters or search terms.</p>
            {(search || selectedCat) && (
              <button onClick={clearAllFilters} className="btn-primary">Clear all filters</button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
              {paginated.map((med) => (
                <MedicineCard 
                  key={med._id} 
                  medicine={med} 
                  stockInfo={stockMap[med.name]} 
                  onLoginRequired={() => setShowLoginModal(true)} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-auto pt-8 border-t border-dark-800">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="btn-secondary px-4 py-2"
                >
                  Previous
                </button>
                <div className="hidden sm:flex items-center gap-1.5 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center
                        ${p === page 
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 border border-brand-500' 
                          : 'bg-dark-800 text-dark-300 border border-dark-700 hover:border-dark-500 hover:text-white'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  className="btn-secondary px-4 py-2"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

// Quick helper for select dropdown arrow
function ChevronDownIcon() {
  return (
    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
