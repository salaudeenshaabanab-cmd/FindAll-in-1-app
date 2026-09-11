'use client';

import { useState } from 'react';

const categories = [
  { name: 'All', icon: '🔥' },
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
];

const allInventory = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - 256GB (Deep Purple)',
    price: 980000,
    category: 'Phones & Tablets',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600',
  },
  {
    id: '2',
    title: 'PlayStation 5 Disc Console + 2 Controllers',
    price: 650000,
    category: 'Gaming & Consoles',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600',
  },
  {
    id: '3',
    title: 'Nike Mercurial Vapor Pro FG Football Boots (Size 43)',
    price: 45000,
    category: 'Sports Wears & Equipment',
    condition: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    id: '4',
    title: 'Organic Glow Vitamin C Face Serum Kit',
    price: 18500,
    category: 'Beauty & Care',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1608248597359-f55c5a08906a?w=600',
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Replace with your actual business WhatsApp phone number (format: country code + number, e.g., 2348000000000)
  const WHATSAPP_NUMBER = '+2348147694917';

  const filteredInventory = allInventory.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    setToastMessage(`Added "${item.title.substring(0, 22)}..." to cart`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const checkoutOnWhatsApp = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemNames = cart.map(i => `- ${i.title} (₦${i.price.toLocaleString()})`).join('%0A');
    const message = `Hello FindAll In 1! I want to order:%0A${itemNames}%0A*Total: ₦${total.toLocaleString()}*`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const openDirectWhatsApp = () => {
    const message = `Hello FindAll In 1! I'm visiting your store and need assistance with an inquiry.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', paddingBottom: '80px', position: 'relative' }}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 20px', borderRadius: '30px', fontSize: '12px', fontWeight: 700, zIndex: 200, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', border: '1px solid #334155' }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* Floating WhatsApp Quick-Chat Button */}
      <button 
        onClick={openDirectWhatsApp}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: 800,
          cursor: 'pointer',
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)'
        }}
      >
        <span style={{ fontSize: '18px' }}>💬</span> Chat with Us
      </button>

      {/* Top Banner */}
      <div style={{ backgroundColor: '#020617', color: '#93c5fd', fontSize: '11px', padding: '8px 16px', textAlign: 'center', fontWeight: 600 }}>
        🇳🇬 FindAll In 1 Official Store — Direct Verified Inventory & Professional Services.
      </div>

      {/* Header */}
      <header style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              FindAll <span style={{ color: '#93c5fd', fontWeight: 300 }}>In 1</span>
            </h1>
            <p style={{ fontSize: '9px', color: '#bfdbfe', textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>Single-Vendor Ecosystem</p>
          </div>

          <div style={{ display: 'flex', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', width: '100%', maxWidth: '400px', border: '2px solid #2563eb' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store inventory..." 
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: 'none', outline: 'none', color: '#0f172a' }}
            />
            <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
              Search
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              🛒 Cart ({cart.length})
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 25px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Your Store Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 0' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px', color: '#64748b' }}>
                  <p style={{ fontSize: '32px', margin: '0 0 10px' }}>🛒</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Your cart is empty.</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Add products from the catalog to checkout.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{item.title}</p>
                      <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: 800, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                  <span>Total:</span>
                  <span>₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}</span>
                </div>
                <button 
                  onClick={checkoutOnWhatsApp}
                  style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)' }}
                >
                  Checkout via WhatsApp 💬
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <section style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', borderRadius: '14px', padding: '24px 20px', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <span style={{ backgroundColor: '#2563eb', fontSize: '9px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '20px', fontWeight: 800, letterSpacing: '1px' }}>
            Verified Curated Inventory
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '10px 0 6px', lineHeight: 1.2 }}>
            One Store. Infinite Categories. Absolute Trust.
          </h2>
          <p style={{ fontSize: '13px', color: '#bfdbfe', maxWidth: '550px', margin: '0 0 16px', lineHeight: 1.4 }}>
            Explore verified inventory spanning electronics, vehicles, real estate, professional services, and lifestyle essentials under one unified brand.
          </p>
          <button 
            onClick={() => setSelectedCategory('All')}
            style={{ backgroundColor: '#ffffff', color: '#1e3a8a', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}
          >
            Browse Full Catalog
          </button>
        </div>
      </section>

      {/* Categories Bar */}
      <section style={{ maxWidth: '1200px', margin: '24px auto 0', padding: '0 16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Browse Store Departments</h3>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button 
                key={idx} 
                onClick={() => setSelectedCategory(cat.name)}
                style={{ 
                  backgroundColor: isActive ? '#1e3a8a' : '#ffffff', 
                  color: isActive ? '#ffffff' : '#1e293b',
                  padding: '10px 14px', 
                  borderRadius: '10px', 
                  textAlign: 'center', 
                  border: isActive ? '1px solid #1e3a8a' : '1px solid #cbd5e1', 
                  cursor: 'pointer', 
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {cat.icon} {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Catalog Filter: <span style={{ color: '#2563eb' }}>{selectedCategory}</span>
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{filteredInventory.length} items found</span>
        </div>

        {filteredInventory.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <p style={{ fontSize: '14px', fontWeight: 600 }}>No items currently listed under "{selectedCategory}".</p>
            <button onClick={() => setSelectedCategory('All')} style={{ marginTop: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
              View All Categories
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {filteredInventory.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#1e3a8a', color: '#ffffff', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: 700 }}>
                    {item.condition}
                  </span>
                </div>
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>{item.category}</span>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h4>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#172554', marginBottom: '12px', marginTop: 'auto' }}>₦ {item.price.toLocaleString()}</div>
                  <button 
                    onClick={() => addToCart(item)}
                    style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', transition: 'background 0.2s' }}
                  >
                    Add to Cart / Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
