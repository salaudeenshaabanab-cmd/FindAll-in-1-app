  'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- YOUR SUPABASE CREDENTIALS ---
const SUPABASE_URL = 'https://jqgsksvtkvhwujtpqras.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ3Nrc3Z0a3Zod3VqdHBxcmFzI':'anon','iat':1789212397,'exp':2104788397}.pB-ed3LSZneH14ub7j9geG6K4L7xO3cuH0jNWE8Jzgg';

const supabase = createClient('https://jqgsksvtkvhwujtpqras.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ3Nrc3Z0a3Zod3VqdHBxcmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTIzOTcsImV4cCI6MjEwNDc4ODM5N30.pB-ed3LSZneH14ub7j9geG6K4L7xO3cuH0jNWE8Jzgg');

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

  // Admin state & form inputs
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newCondition, setNewCondition] = useState('Brand New');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  const WHATSAPP_NUMBER = '2348147684917';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Ibadan',
  });

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
    } else if (data) {
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
    alert(`Redirecting to Secure Checkout for ₦${cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}...`);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    
    const newItem = {
      id: Date.now(),
      title: newTitle,
      price: Number(newPrice),
      category: newCategory,
      condition: newCondition,
      physicalCondition: newCondition === 'Brand New' ? 'Flawless' : 'Good working condition',
      location: 'Oyo State, Ibadan',
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: newDescription || 'Quality verified item available at Noonetech Store / FindAll In 1 ecosystem.',
    };
    
    const { error } = await supabase.from('products').insert([newItem]);
    
    if (error) {
      alert('Error saving product: ' + error.message);
    } else {
      alert('Product successfully published to Supabase database!');
      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
      setNewImage('');
      fetchProducts();
      setCurrentView('catalog');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product from the database?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Error deleting product: ' + error.message);
      } else {
        setToastMessage('Product deleted successfully');
        setTimeout(() => setToastMessage(''), 3000);
        fetchProducts();
      }
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
      <header style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setCurrentView('catalog')}>
            <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>FindAll <span style={{ color: '#93c5fd', fontWeight: 300 }}>In 1</span></h1>
            <span style={{ fontSize: '11px', background: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>Noonetech</span>
          </div>

          {currentView === 'catalog' && (
            <div style={{ display: 'flex', background: '#ffffff', borderRadius: '10px', overflow: 'hidden', width: '100%', maxWidth: '420px', border: '2px solid #3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, laptops, gadgets..." 
                style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: 'none', outline: 'none', color: '#0f172a' }}
              />
              <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Search</button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentView !== 'catalog' ? (
              <button onClick={() => setCurrentView('catalog')} style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>← Store Catalog</button>
            ) : (
              <button onClick={() => setIsCartOpen(true)} style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>🛒 Cart ({cart.length})</button>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '18px 20px', backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Your Shopping Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#e2e8f0', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Your cart is empty.</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>{item.title}</p>
                      <p style={{ fontSize: '13px', color: '#2563eb', fontWeight: 800, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '20px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px', fontWeight: 800 }}>
                  <span>Total:</span>
                  <span style={{ color: '#1e3a8a' }}>₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }} style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATALOG VIEW */}
      {currentView === 'catalog' && (
        <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
          
          {/* Hero Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: '16px', padding: '28px 24px', color: '#ffffff', marginBottom: '28px', boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.3)' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Verified Storefront</span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '10px 0 6px' }}>Noonetech & FindAll In 1 Hub</h2>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, maxWidth: '600px' }}>Buy, sell, and swap certified smartphones, laptops, vehicles, and lifestyle gadgets with reliable delivery across Ibadan.</p>
          </div>

          {/* Categories Horizontal Scroll */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px', scrollbarWidth: 'none' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundColor: selectedCategory === cat.name ? '#1e3a8a' : '#ffffff', color: selectedCategory === cat.name ? '#ffffff' : '#1e293b', padding: '10px 16px', borderRadius: '10px', border: selectedCategory === cat.name ? '1px solid #1e3a8a' : '1px solid #cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredInventory.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#64748b' }}>No products found in this category.</p>
                <button onClick={() => setSelectedCategory('All')} style={{ marginTop: '10px', background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>View All Products</button>
              </div>
            ) : (
              filteredInventory.map((item) => (
                <div key={item.id} onClick={() => { setSelectedProduct(item); setCurrentView('details'); }} style={{ backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: item.condition === 'Brand New' ? '#16a34a' : '#d97706', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      {item.condition || 'Used'}
                    </span>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>{item.category}</div>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a', lineHeight: '1.3' }}>{item.title}</h4>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e3a8a', marginBottom: '12px' }}>₦ {item.price.toLocaleString()}</div>
                    
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} style={{ flex: 1, backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Add to Cart</button>
                      {isAdminLoggedIn && (
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(item.id); }} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '9px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>🗑️</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS VIEW */}
      {currentView === 'details' && selectedProduct && (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>{selectedProduct.category}</span>
                <span style={{ background: selectedProduct.condition === 'Brand New' ? '#dcfce7' : '#fef3c7', color: selectedProduct.condition === 'Brand New' ? '#16a34a' : '#d97706', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>{selectedProduct.condition}</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '10px 0' }}>{selectedProduct.title}</h2>
              <h3 style={{ color: '#1e3a8a', fontSize: '24px', fontWeight: 900, marginBottom: '16px' }}>₦ {selectedProduct.price.toLocaleString()}</h3>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>{selectedProduct.description}</p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => addToCart(selectedProduct)} style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', padding: '14px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>Add to Cart</button>
                <button onClick={() => openSupportWhatsApp(`Hello Noonetech, I am inquiring about "${selectedProduct.title}" priced at ₦${selectedProduct.price.toLocaleString()}`)} style={{ backgroundColor: '#25D366', color: '#fff', padding: '14px 20px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>💬 Chat on WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT VIEW */}
      {currentView === 'checkout' && (
        <div style={{ maxWidth: '600px', margin: '40px auto', background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>Complete Your Order 📦</h2>
          <form onSubmit={handlePaystackPayment}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Full Name</label>
              <input type="text" placeholder="e.g. Salaudeen Adegbola" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Phone Number</label>
              <input type="tel" placeholder="e.g. 08147684917" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Delivery Address (Ibadan / Nationwide)</label>
              <input type="text" placeholder="e.g. Bodija Market or UI Area, Ibadan" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#fff', padding: '14px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(22, 163, 74, 0.2)' }}>Pay Securely via Paystack</button>
          </form>
        </div>
      )}

      {/* ADMIN PANEL */}
      {currentView === 'admin' && (
        <div style={{ maxWidth: '650px', margin: '40px auto', background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>Admin Dashboard ⚙️</h2>
            {isAdminLoggedIn && (
              <button onClick={() => setIsAdminLoggedIn(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Log Out</button>
            )}
          </div>

          {!isAdminLoggedIn ? (
            <form onSubmit={e => { e.preventDefault(); if(passcode === '1234') setIsAdminLoggedIn(true); else alert('Wrong passcode (1234)'); }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>Enter your 4-digit admin passcode to manage inventory.</p>
              <input type="password" placeholder="Passcode (1234)" value={passcode} onChange={e => setPasscode(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#1e3a8a', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>Access Dashboard</button>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#16a34a', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ fontSize: '13px', color: '#166534', fontWeight: 700 }}>Logged in as Store Admin (Supabase Connected)</span>
              </div>

              <form onSubmit={handleAddProduct}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Product Title</label>
                  <input type="text" placeholder="e.g. iPhone 14 Pro Max 256GB" required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Price (₦)</label>
                    <input type="number" placeholder="e.g. 750000" required value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Condition</label>
                    <select value={newCondition} onChange={e => setNewCondition(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}>
                      <option value="Brand New">Brand New</option>
                      <option value="Used">Used / UK Used</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}>
                    {categories.filter(c => c.name !== 'All').map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Product Image URL</label>
                  <input type="text" placeholder="Paste image link (Unsplash or image address)" value={newImage} onChange={e => setNewImage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Product Description</label>
                  <textarea placeholder="Describe specifications, battery health, accessories included..." rows="3" value={newDescription} onChange={e => setNewDescription(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit' }}></textarea>
                </div>

                <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#fff', padding: '14px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(22, 163, 74, 0.2)' }}>Publish Product to Database</button>
              </form>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
