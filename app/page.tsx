'use client';

export default function Home() {
  const categories = [
    { name: 'Phones & Tablets', icon: '📱' },
    { name: 'Vehicles', icon: '🚗' },
    { name: 'Laptops & Computers', icon: '💻' },
    { name: 'Real Estate', icon: '🏠' },
    { name: 'Fashion & Apparel', icon: '👕' },
    { name: 'Sports Wears & Equipment', icon: '⚽' },
    { name: 'Gadgets & Accessories', icon: '🎧' },
    { name: 'Gaming & Consoles', icon: '🎮' },
    { name: 'Jobs & Offers', icon: '💼' },
    { name: 'Beauty & Care', icon: '✨' },
    { name: 'Home Appliances', icon: '⚡' },
    { name: 'Logistics & Services', icon: '🚚' },
  ];

  const inventory = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max - 256GB (Deep Purple)',
      price: '₦ 980,000',
      category: 'Phones & Tablets',
      condition: 'In Stock',
      image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600',
    },
    {
      id: '2',
      title: 'PlayStation 5 Disc Console + 2 Controllers',
      price: '₦ 650,000',
      category: 'Gaming & Consoles',
      condition: 'In Stock',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', paddingBottom: '60px' }}>
      
      {/* Top Banner */}
      <div style={{ backgroundColor: '#020617', color: '#93c5fd', fontSize: '12px', padding: '10px 16px', textAlign: 'center', fontWeight: 600 }}>
        🇳🇬 FindAll In 1 Official Store — Direct Verified Inventory & Professional Services.
      </div>

      {/* Header */}
      <header style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              FindAll <span style={{ color: '#93c5fd', fontWeight: 300 }}>In 1</span>
            </h1>
            <p style={{ fontSize: '10px', color: '#bfdbfe', textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>Single-Vendor Ecosystem</p>
          </div>

          <div style={{ display: 'flex', background: '#ffffff', borderRadius: '10px', overflow: 'hidden', width: '100%', maxWidth: '450px', border: '2px solid #2563eb' }}>
            <input 
              type="text" 
              placeholder="Search store inventory..." 
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: 'none', outline: 'none', color: '#0f172a' }}
            />
            <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0 20px', fontWeight: 700, cursor: 'pointer' }}>
              Search
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#1d4ed8', color: '#eff6ff', fontSize: '11px', padding: '6px 12px', borderRadius: '20px', fontWeight: 700 }}>Verified 🇳🇬</span>
            <button style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              🛒 Cart (0)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section style={{ maxWidth: '1200px', margin: '24px auto 0', padding: '0 16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', borderRadius: '16px', padding: '32px 24px', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <span style={{ backgroundColor: '#2563eb', fontSize: '10px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, letterSpacing: '1px' }}>
            Official Single-Vendor Hub
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '12px 0 8px', lineHeight: 1.2 }}>
            One Store. Infinite Categories. Absolute Trust.
          </h2>
          <p style={{ fontSize: '14px', color: '#bfdbfe', maxWidth: '600px', margin: '0 0 20px', lineHeight: 1.5 }}>
            Explore verified inventory spanning electronics, vehicles, real estate, professional services, and lifestyle essentials under one unified brand.
          </p>
          <button style={{ backgroundColor: '#ffffff', color: '#1e3a8a', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>
            Browse Full Catalog
          </button>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Browse Store Departments</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {categories.map((cat, idx) => (
            <div key={idx} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Featured Store Inventory</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {inventory.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#1e3a8a', color: '#ffffff', fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                  {item.condition}
                </span>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>{item.category}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h4>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#172554', marginBottom: '16px', marginTop: 'auto' }}>{item.price}</div>
                <button style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                  Add to Cart / Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
