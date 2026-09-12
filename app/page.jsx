  'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- YOUR SUPABASE CREDENTIALS ---
const SUPABASE_URL = 'https://jqgsksvtkvhwujtpqras.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ3Nrc3Z0a3Zod3VqdHBxcmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTIzOTcsImV4cCI6MjEwNDc4ODM5N30.pB-ed3LSZneH14ub7j9geG6K4L7xO3cuH0jNWE8Jzgg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('catalog'); 
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

  // Fetch products from Supabase on load
  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setCurrentView('admin');
    }
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
    } else if (data && data.length > 0) {
      setInventory(data);
    }
  };

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
    alert(`Redirecting to Paystack Secure Checkout for ₦${cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}...`);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    
    const newItem = {
      id: Date.now(),
      title: newTitle,
      price: Number(newPrice),
      category: newCategory,
      condition: 'Brand New',
      physicalCondition: 'Pristine',
      location: 'Oyo State, Ibadan',
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: 'Newly listed product on FindAll In 1 store ecosystem.',
    };
    
    const { error } = await supabase.from('products').insert([newItem]);
    
    if (error) {
      alert('Error saving product: ' + error.message);
    } else {
      alert('Product successfully published to Supabase database!');
      setNewTitle('');
      setNewPrice('');
      setNewImage('');
      fetchProducts();
      setCurrentView('catalog');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', paddingBottom: '90px', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 20px', borderRadius: '30px', fontSize: '12px', fontWeight: 700, zIndex: 200, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* Floating WhatsApp Support Button */}
      <button 
        onClick={() => openSupportWhatsApp()}
        style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#25D366', color: '#ffffff', border: 'none', borderRadius: '50px', width: '56px', height: '56px', fontSize: '26px', cursor: 'pointer', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)' }}
      >
        💬
      </button>

      {/* Header */}
      <header style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => setCurrentView('catalog')}>
            <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>FindAll <span style={{ color: '#93c5fd', fontWeight: 300 }}>In 1</span></h1>
          </div>

          {currentView === 'catalog' && (
            <div style={{ display: 'flex', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', width: '100%', maxWidth: '400px', border: '2px solid #2563eb' }}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store inventory..." 
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: 'none', outline: 'none' }}
              />
              <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Search</button>
            </div>
          )}

          <div>
            {currentView !== 'catalog' ? (
              <button onClick={() => setCurrentView('catalog')} style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>← Store</button>
            ) : (
              <button onClick={() => setIsCartOpen(true)} style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>🛒 Cart ({cart.length})</button>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px 20px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 2px' }}>{item.title}</p>
                    <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: 800, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px 20px 24px', backgroundColor: '#f8fafc' }}>
                <button onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }} style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATALOG VIEW */}
      {currentView === 'catalog' && (
        <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundColor: selectedCategory === cat.name ? '#1e3a8a' : '#ffffff', color: selectedCategory === cat.name ? '#ffffff' : '#1e293b', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 700 }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {filteredInventory.map((item) => (
              <div key={item.id} onClick={() => { setSelectedProduct(item); setCurrentView('details'); }} style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 6px' }}>{item.title}</h4>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#172554', marginBottom: '10px' }}>₦ {item.price.toLocaleString()}</div>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS VIEW */}
      {currentView === 'details' && selectedProduct && (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 16px', background: '#fff', paddingBottom: '20px', borderRadius: '12px' }}>
          <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
          <div style={{ padding: '20px' }}>
            <h2>{selectedProduct.title}</h2>
            <h3 style={{ color: '#16a34a' }}>₦ {selectedProduct.price.toLocaleString()}</h3>
            <p>{selectedProduct.description}</p>
            <button onClick={() => addToCart(selectedProduct)} style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Add to Cart</button>
          </div>
        </div>
      )}

      {/* CHECKOUT VIEW */}
      {currentView === 'checkout' && (
        <div style={{ maxWidth: '600px', margin: '30px auto', background: '#fff', padding: '24px', borderRadius: '12px' }}>
          <h2>Checkout</h2>
          <form onSubmit={handlePaystackPayment}>
            <input type="text" placeholder="Full Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Delivery Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '14px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Pay Now</button>
          </form>
        </div>
      )}

      {/* ADMIN PANEL */}
      {currentView === 'admin' && (
        <div style={{ maxWidth: '600px', margin: '30px auto', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <h2>Admin Dashboard (Supabase Connected) ⚙️</h2>
          {!isAdminLoggedIn ? (
            <form onSubmit={e => { e.preventDefault(); if(passcode === '1234') setIsAdminLoggedIn(true); else alert('Wrong passcode (1234)'); }}>
              <input type="password" placeholder="Passcode (1234)" value={passcode} onChange={e => setPasscode(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#1e3a8a', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
            </form>
          ) : (
            <div>
              <p style={{ color: '#16a34a', fontWeight: 'bold' }}>🟢 Logged in as Admin</p>
              <form onSubmit={handleAddProduct} style={{ marginTop: '16px' }}>
                <input type="text" placeholder="Product Title" required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Price (₦)" required value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  {categories.filter(c => c.name !== 'All').map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="Image URL" value={newImage} onChange={e => setNewImage(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '14px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Product to Database</button>
              </form>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
