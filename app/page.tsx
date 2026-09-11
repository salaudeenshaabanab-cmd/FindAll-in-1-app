const categories = [
  { name: 'Phones & Tablets', icon: '📱' },
  { name: 'Vehicles', icon: '🚗' },
  { name: 'Laptops & Computers', icon: '💻' },
  { name: 'Real Estate', icon: '🏠' },
  { name: 'Fashion & Apparel', icon: '👕' },
  { name: 'Sports Wears & Equipment', icon: '⚽' },
  { name: 'Gadgets & Accessories', icon: '🎧' },
  { name: 'Gaming & Consoles', icon: '🎮' },
  { name: 'Jobs & Professional Offers', icon: '💼' },
  { name: 'Beauty & Body Care', icon: '✨' },
  { name: 'Home Appliances', icon: '⚡' },
  { name: 'General Logistics & Services', icon: '🚚' },
]

const storeInventory = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - 256GB (Deep Purple, Mint Condition)',
    price: 980000,
    category: 'Phones & Tablets',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400',
  },
  {
    id: '2',
    title: 'PlayStation 5 Disc Console + Extra DualSense Controller',
    price: 650000,
    category: 'Gaming & Consoles',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
  },
  {
    id: '3',
    title: 'Nike Mercurial Vapor Pro FG Football Boots (Size 43)',
    price: 45000,
    category: 'Sports Wears & Equipment',
    condition: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  },
  {
    id: '4',
    title: 'Organic Glow Vitamin C Face Serum & Skincare Kit',
    price: 18500,
    category: 'Beauty & Body Care',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1608248597359-f55c5a08906a?w=400',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Store Header */}
      <header className="bg-blue-900 sticky top-0 z-50 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-2xl font-black tracking-wider text-white">
              FindAll <span className="text-blue-400 font-light text-xl">In 1</span>
            </h1>
            <span className="text-xs bg-blue-800 border border-blue-700 px-2.5 py-1 rounded-full md:hidden">
              Official Store 🇳🇬
            </span>
          </div>

          {/* Search Inventory */}
          <div className="flex w-full md:w-2/3 bg-white rounded-xl overflow-hidden shadow-inner border border-blue-800 text-slate-900">
            <select className="bg-slate-100 text-xs md:text-sm px-3 border-r border-slate-200 outline-none font-medium">
              <option>All Categories</option>
              <option>Phones & Tablets</option>
              <option>Gaming & Consoles</option>
              <option>Beauty & Body Care</option>
            </select>
            <input 
              type="search" 
              placeholder="Search store inventory..." 
              className="w-full px-4 py-2.5 text-sm outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 font-bold text-white transition">
              Search
            </button>
          </div>

          <button className="hidden md:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl font-bold text-sm shadow transition">
            🛒 Cart (0)
          </button>
        </div>
      </header>

      {/* Store Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="bg-blue-600 text-xs uppercase tracking-widest px-3 py-1 rounded-full font-bold">Verified Single Vendor</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2">Welcome to FindAll In 1 Store</h2>
            <p className="text-blue-200 text-xs md:text-sm mt-1 max-w-xl">
              Your comprehensive inventory source for premium electronics, fashion, professional gear, body care, and specialty services.
            </p>
          </div>
          <button className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl text-sm shadow hover:bg-blue-50 transition w-full md:w-auto">
            Contact Store Rep
          </button>
        </div>
      </div>

      {/* Category Shortcuts */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Browse Store Catalog</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md hover:border-blue-300 cursor-pointer transition flex flex-col items-center justify-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition">{cat.icon}</span>
              <span className="text-xs font-semibold text-slate-700 leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product & Service Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Featured Store Products</h3>
          <span className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline">View full catalog</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {storeInventory.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border border-slate-100 flex flex-col group">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow">
                  {item.condition}
                </span>
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">{item.category}</span>
                <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2">{item.title}</h4>
                
                <div className="text-lg font-black text-blue-900 mb-3">
                  ₦ {item.price.toLocaleString()}
                </div>
                
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Official Stock</span>
                  <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition shadow-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
