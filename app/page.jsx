  'use client';

import { useState, useEffect } from 'react';

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

const initialInventory = [
  {
    id: '1',
    title: 'Google Pixel 10 128 GB Black',
    price: 800000,
    category: 'Phones & Tablets',
    condition: 'Used',
    physicalCondition: 'No cracks',
    storage: '128 GB',
    ram: '12 GB',
    cardSlot: 'No',
    camera: 'Triple 48 MP / 10.8 MP / 13 MP',
    location: 'Oyo State, Ibadan',
    datePosted: 'Aug 9, 2026 at 7:39 AM',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600',
    description: 'Pristine condition Google Pixel 10 with complete box, amazing battery health and ultra-clear cameras.',
  },
  {
    id: '2',
    title: 'PlayStation 5 Disc Console + 2 Controllers',
    price: 650000,
    category: 'Gaming & Consoles',
    condition: 'Brand New',
    physicalCondition: 'Flawless',
    storage: '825 GB SSD',
    ram: '16 GB GDDR6',
    cardSlot: 'No',
    camera: 'N/A',
    location: 'Oyo State, Ibadan',
    datePosted: 'Aug 10, 2026 at 10:15 AM',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600',
    description: 'Brand new European region model with dual wireless controllers and ultra-high speed SSD.',
  },
  {
    id: '3',
    title: 'Nike Mercurial Vapor Pro FG Football Boots',
    price: 45000,
    category: 'Sports Wears & Equipment',
    condition: 'Brand New',
    physicalCondition: 'Boxed',
    storage: 'Size 43',
    ram: 'Firm Ground',
    cardSlot: 'N/A',
    camera: 'N/A',
    location: 'Oyo State, Ibadan',
    datePosted: 'Aug 11, 2026, 2:00 PM',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    description: 'Professional grade molded studs for firm ground acceleration and precise ball touch.',
  },
  {
    id: '4',
    title: 'Organic Glow Vitamin C Face Serum Kit',
    price: 18500,
    category: 'Beauty & Care',
    condition: 'Brand New',
    physicalCondition: 'Sealed',
    storage: '50ml',
    ram: 'Organic Formula',
    cardSlot: 'N/A',
    camera: 'N/A',
    location: 'Oyo State, Ibadan',
    datePosted: 'Aug 11, 2026, 4:30 PM',
    image: 'https://images.unsplash.com/photo-1608248597359-f55c5a08906a?w=600',
    description: 'Advanced brightening formula infused with botanical extracts for radiant, blemish-free skin.',
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inventory, setInventory] = useState(initialInventory);
  const [cart, setCart] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog', 'details', 'checkout', 'admin'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newImage, setNewImage] = useState('');

  const WHATSAPP_NUMBER = '2348147684917';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Ibadan',
  });

  // Check URL query to see if user is trying to access admin (?admin=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setCurrentView('admin');
    }
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
    setToastMessage(`Added "${item.title.substring(0, 20)}..." to cart`);
    setIsCartOpen(true);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openSupportWhatsApp = (customMsg) => {
    const message = customMsg || `Hello FindAll In 1 support! I need assistance with an order/inquiry.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handlePaystackPayment = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill in all delivery details.');
      return;
    }
    alert(`Redirecting to Paystack Secure Checkout for ₦${cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}... (No customer account needed!)`);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    const newItem = {
      id: Date.now().toString(),
      title: newTitle,
      price: Number(newPrice),
      category: newCategory,
      condition: 'Brand New',
      physicalCondition: 'Pristine',
      storage: 'Standard',
      ram: 'N/A',
      cardSlot: 'N/A',
      camera: 'N/A',
      location: 'Oyo State, Ibadan',
      datePosted: 'Just now',
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: 'Newly listed product on FindAll In 1 store ecosystem.',
    };
    setInventory([newItem, ...inventory]);
    setNewTitle('');
    setNewPrice('');
    setNewImage('');
    alert('Product successfully published to the live store catalog!');
    setCurrentView('catalog');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', paddingBottom: '90px', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 20px', borderRadius: '30px', fontSize: '12px', fontWeight: 700, zIndex: 200, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', border: '1px solid #334155' }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* Floating WhatsApp Support Button */}
      <button 
        onClick={() => openSupportWhatsApp()}
        title="Customer Support"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          width: '56px',
          height: '56px',
          fontSize: '26px',
          cursor: 'pointer',
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)'
        }}
      >
        💬
      </button>

      {/* Top Announcement Bar */}
      <div style={{ backgroundColor: '#020617', color: '#93c5fd', fontSize: '11px', padding: '8px 16px', textAlign: 'center', fontWeight: 600 }}>
        🇳🇬 FindAll In 1 Official Store — Pay instantly with Card or Bank Transfer (No account needed for buyers).
      </div>

      {/* Professional Header */}
      <header style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => setCurrentView('catalog')}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                FindAll <span style={{ color: '#93c5fd', fontWeight: 300 }}>In 1</span>
              </h1>
              <p style={{ fontSize: '9px', color: '#bfdbfe', textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>Single-Vendor Ecosystem</p>
            </div>
          </div>

          {currentView === 'catalog' && (
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
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentView !== 'catalog' ? (
              <button 
                onClick={() => setCurrentView('catalog')}
                style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                ← Back to Store
              </button>
            ) : (
              <button 
                onClick={() => setIsCartOpen(true)}
                style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🛒 Cart ({cart.length})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 25px rgba(0,0,0,0.15)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Your Store Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '80px', color: '#64748b' }}>
                  <p style={{ fontSize: '36px', margin: '0 0 10px' }}>🛒</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, border: '1px solid #e2e8f0' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 2px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                      <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: 800, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px 20px 24px', backgroundColor: '#f8fafc', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                  <span>Total:</span>
                  <span>₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }}
                  style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)' }}
                >
                  Proceed to Secure Checkout 🔒
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* VIEW 1: PROFESSIONAL CATALOG */}
      {currentView === 'catalog' && (
        <>
          <section style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', borderRadius: '14px', padding: '24px 20px', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              <span style={{ backgroundColor: '#2563eb', fontSize: '9px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '20px', fontWeight: 800, letterSpacing: '1px' }}>
                Verified Curated Inventory
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '10px 0 6px', lineHeight: 1.2 }}>
                One Store. Infinite Categories. Absolute Trust.
              </h2>
              <p style={{ fontSize: '13px', color: '#bfdbfe', maxWidth: '550px', margin: '0 0 16px', lineHeight: 1.4 }}>
                Explore verified inventory spanning electronics, vehicles, real estate, and lifestyle essentials under one unified brand.
              </p>
            </div>
          </section>

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

          <section style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Catalog Filter: <span style={{ color: '#2563eb' }}>{selectedCategory}</span>
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{filteredInventory.length} items found</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {filteredInventory.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { setSelectedProduct(item); setCurrentView('details'); }}
                  style={{ backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                >
                  <div style={{ height: '180px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#1e3a8a', color: '#ffffff', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: 700 }}>
                      {item.condition}
                    </span>
                  </div>
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>{item.category}</span>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h4>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#172554', marginBottom: '10px', marginTop: 'auto' }}>₦ {item.price.toLocaleString()}</div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                      style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* VIEW 2: DETAILED PRODUCT VIEW */}
      {currentView === 'details' && selectedProduct && (
        <section style={{ maxWidth: '800px', margin: '20px auto 0', padding: '0 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            <div style={{ width: '100%', height: '350px', backgroundColor: '#0f172a', position: 'relative' }}>
              <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                📍 {selectedProduct.location}
              </div>
            </div>

            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>{selectedProduct.title}</h2>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a', marginBottom: '16px' }}>₦ {selectedProduct.price.toLocaleString()}</div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => openSupportWhatsApp(`Hello, I want to make an offer / inquire about "${selectedProduct.title}" priced at ₦${selectedProduct.price.toLocaleString()}`)}
                  style={{ flex: 1, backgroundColor: '#ffffff', color: '#16a34a', border: '2px solid #16a34a', padding: '12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}
                >
                  💬 Make an Offer
                </button>
                <button 
                  onClick={() => openSupportWhatsApp(`Hello, I want to call regarding "${selectedProduct.title}"`)}
                  style={{ flex: 1, backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  📞 WhatsApp Support
                </button>
              </div>

              <div style={{ marginTop: '14px' }}>
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '14px' }}
                >
                  Add to Cart & Checkout 🛒
                </button>
              </div>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#f8fafc', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 2px' }}>Condition</p>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{selectedProduct.condition}</p>
              </div>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 2px' }}>Physical Condition</p>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{selectedProduct.physicalCondition}</p>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Description</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>{selectedProduct.description}</p>
            </div>

          </div>
        </section>
      )}

      {/* VIEW 3: CHECKOUT PAGE */}
      {currentView === 'checkout' && (
        <section style={{ maxWidth: '800px', margin: '30px auto 0', padding: '0 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Secure Order Checkout</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 24px' }}>Pay securely via Paystack. No customer sign-up or prior account required.</p>

            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1e3a8a', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px' }}>1. Order Summary</h3>
            <div style={{ marginBottom: '24px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{item.title}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{item.category}</p>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#172554' }}>₦ {item.price.toLocaleString()}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 10px', background: '#eff6ff', borderRadius: '10px', fontWeight: 900, fontSize: '16px', color: '#1e3a8a' }}>
                <span>Total Amount:</span>
                <span>₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handlePaystackPayment}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1e3a8a', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px' }}>2. Delivery Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your full name" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="080XXXXXXXX" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Delivery Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="Street address, area in Ibadan..." 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 10px rgba(22, 163, 74, 0.3)' }}
              >
                Pay Now with Paystack 💳
              </button>
            </form>
          </div>
        </section>
      )}

      {/* VIEW 4: HIDDEN ADMIN PANEL */}
      {currentView === 'admin' && (
        <section style={{ maxWidth: '600px', margin: '30px auto', padding: '0 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Admin Dashboard ⚙️</h2>
              <button onClick={() => setCurrentView('catalog')} style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Close Admin</button>
            </div>
            
            {!isAdminLoggedIn ? (
              <form onSubmit={(e) => { e.preventDefault(); if(passcode === '1234') setIsAdminLoggedIn(true); else alert('Incorrect passcode! Use 1234'); }}>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>Enter your secret admin passcode (1234):</p>
                <input 
                  type="password" 
                  placeholder="Enter passcode" 
                  value={passcode} 
                  onChange={(e) => setPasscode(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
                <button type="submit" style={{ width: '100%', backgroundColor: '#1e3a8a', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>
                  Login to Admin
                </button>
              </form>
            ) : (
              <div>
                <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '13px', marginBottom: '20px' }}>🟢 Authenticated as Store Administrator</p>
                
                <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Publish New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Product Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Samsung Galaxy S24 Ultra" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Price (₦)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 750000" 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Category</label>
                    <select 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                    >
                      {categories.filter(c => c.name !== 'All').map((c, i) => (
                        <option key={i} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Image URL (Unsplash or direct link)</label>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/..." 
                      value={newImage} 
                      onChange={(e) => setNewImage(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>
                    Publish to Store 🚀
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
