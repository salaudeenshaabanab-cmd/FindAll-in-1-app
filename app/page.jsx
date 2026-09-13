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
  { name: 'Sports & Equipment', icon: '⚽' },
  { name: 'Gadgets & Audio', icon: '🎧' },
  { name: 'Gaming & Consoles', icon: '🎮' },
  { name: 'Home Appliances', icon: '⚡' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('catalog'); // catalog, details, checkout, admin
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Admin state & form inputs
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newCondition, setNewCondition] = useState('Brand New');
  const [newLocation, setNewLocation] = useState('Nationwide Delivery (Nigeria)');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  const WHATSAPP_NUMBER = '2348147684917';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setCurrentView('admin');
    }

    const productId = params.get('product');
    if (productId) {
      loadProductById(productId);
    }
  }, []);

  const loadProductById = async (id) => {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      setSelectedProduct(data);
      setCurrentView('details');
    }
  };

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
    setToastMessage(`Added "${item.title.substring(0, 18)}..." to cart`);
    setIsCartOpen(true);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openSupportWhatsApp = (customMsg) => {
    const message = customMsg || `Hello FindAll In 1 support! I need assistance with an order/inquiry.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state) {
      alert('Please fill in all delivery details (including City and State/Country).');
      return;
    }

    const cartItemsText = cart.map((item) => `%0A- ${item.title} (₦${item.price.toLocaleString()})`).join('');
    const totalPrice = cart.reduce((sum, i) => sum + i.price, 0).toLocaleString();

    const orderMessage = `*NEW ORDER - FindAll In 1*%0A%0A*Customer Details:*%0A- Name: ${encodeURIComponent(formData.fullName)}%0A- Phone: ${encodeURIComponent(formData.phone)}%0A- Address: ${encodeURIComponent(formData.address)}%0A- City: ${encodeURIComponent(formData.city)}%0A- State/Country: ${encodeURIComponent(formData.state)}%0A%0A*Order Summary:*${cartItemsText}%0A%0A*Total Amount: ₦${totalPrice}*%0A%0APlease confirm my order and shipping!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${orderMessage}`, '_blank');
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
      location: newLocation || 'Nationwide Delivery',
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: newDescription || 'Verified quality product listed on FindAll In 1 marketplace.',
    };
    
    const { error } = await supabase.from('products').insert([newItem]);
    
    if (error) {
      alert('Error saving product: ' + error.message);
    } else {
      alert('Product published successfully!');
      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
      setNewImage('');
      fetchProducts();
      setCurrentView('catalog');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Error deleting: ' + error.message);
      } else {
        setToastMessage('Listing deleted');
        setTimeout(() => setToastMessage(''), 3000);
        fetchProducts();
      }
    }
  };

  const copyProductLink = (item) => {
    const productUrl = `${window.location.origin}/?product=${item.id}`;
    navigator.clipboard.writeText(productUrl);
    setCopiedLink(true);
    setToastMessage(`Copied link for "${item.title.substring(0, 15)}..."`);
    setTimeout(() => {
      setCopiedLink(false);
      setToastMessage('');
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: '100px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0284c7', color: '#ffffff', padding: '12px 24px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, zIndex: 300, boxShadow: '0 10px 25px rgba(2,132,199,0.3)', backdropFilter: 'blur(8px)' }}>
          {toastMessage}
        </div>
      )}

      {/* Top Header Banner */}
      <div style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '18px 16px 22px', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 4px 20px rgba(2,132,199,0.2)' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setSelectedProduct(null); setCurrentView('catalog'); window.history.pushState({}, '', window.location.pathname); }}>
              <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', color: '#fff' }}>FindAll <span style={{ fontWeight: 300, color: '#e0f2fe' }}>In 1</span></h1>
            </div>
            <button onClick={() => setIsCartOpen(true)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 14px', borderRadius: '24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
              🛒 <span style={{ backgroundColor: '#ffffff', color: '#0284c7', padding: '1px 6px', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>{cart.length}</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', padding: '6px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <span style={{ display: 'flex', alignItems: 'center', marginRight: '8px', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phones, laptops, electronics..." 
              style={{ width: '100%', padding: '6px 0', fontSize: '14px', border: 'none', outline: 'none', color: '#0f172a', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 200, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '20px', backgroundColor: '#ffffff', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>Shopping Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '80px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#1e293b', lineHeight: '1.3' }}>{item.title}</p>
                      <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: 900, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '20px', backgroundColor: '#ffffff', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '15px', fontWeight: 800 }}>
                  <span style={{ color: '#64748b' }}>Total Amount:</span>
                  <span style={{ color: '#0284c7', fontSize: '18px' }}>₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }} style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(2,132,199,0.35)', fontSize: '14px' }}>Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATALOG VIEW */}
      {currentView === 'catalog' && (
        <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 16px' }}>
          
          {/* Quick Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div onClick={() => openSupportWhatsApp("Hello FindAll In 1, I need assistance finding a product.")} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.2s ease' }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>💬</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Customer Support</div>
            </div>
            <div onClick={() => setIsCartOpen(true)} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.2s ease' }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>🛒</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>View Cart ({cart.length})</div>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px', scrollbarWidth: 'none' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundColor: selectedCategory === cat.name ? '#0284c7' : '#ffffff', color: selectedCategory === cat.name ? '#ffffff' : '#475569', padding: '10px 16px', borderRadius: '12px', border: selectedCategory === cat.name ? '1px solid #0284c7' : '1px solid #e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: selectedCategory === cat.name ? '0 4px 12px rgba(2,132,199,0.3)' : '0 1px 3px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '16px' }}>
            {filteredInventory.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#64748b', marginBottom: '12px' }}>No items found in this category.</p>
                <button onClick={() => setSelectedCategory('All')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>Show All Items</button>
              </div>
            ) : (
              filteredInventory.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { 
                    setSelectedProduct(item); 
                    setCurrentView('details'); 
                    window.history.pushState({}, '', `?product=${item.id}`);
                  }} 
                  style={{ backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '8px', left: '8px', background: item.condition === 'Brand New' ? '#0284c7' : '#d97706', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>
                      {item.condition || 'Used'}
                    </span>
                  </div>
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.category}</div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 6px', color: '#0f172a', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h4>
                      {item.location && <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>📍 {item.location}</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#0284c7', marginBottom: '10px' }}>₦ {item.price.toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} style={{ flex: 1, backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>Buy</button>
                        <button onClick={(e) => { e.stopPropagation(); copyProductLink(item); }} title="Copy Product Link" style={{ backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', padding: '8px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>🔗</button>
                        {isAdminLoggedIn && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(item.id); }} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>🗑️</button>
                        )}
                      </div>
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
        <div style={{ maxWidth: '700px', margin: '24px auto', padding: '0 16px' }}>
          <button 
            onClick={() => { 
              setCurrentView('catalog'); 
              window.history.pushState({}, '', window.location.pathname);
            }} 
            style={{ marginBottom: '16px', background: '#e2e8f0', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', color: '#334155' }}
          >
            ← Back to Store
          </button>
          
          <div style={{ background: '#ffffff', borderRadius: '18px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ background: '#f0f9ff', color: '#0284c7', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: '1px solid #bae6fd' }}>{selectedProduct.category}</span>
                <span style={{ background: selectedProduct.condition === 'Brand New' ? '#f0f9ff' : '#fef3c7', color: selectedProduct.condition === 'Brand New' ? '#0284c7' : '#d97706', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>{selectedProduct.condition}</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '10px 0' }}>{selectedProduct.title}</h2>
              {selectedProduct.location && <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>📍 Shipping / Location: {selectedProduct.location}</p>}
              <h3 style={{ color: '#0284c7', fontSize: '24px', fontWeight: 900, marginBottom: '16px' }}>₦ {selectedProduct.price.toLocaleString()}</h3>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>{selectedProduct.description}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => addToCart(selectedProduct)} style={{ flex: 1, backgroundColor: '#0284c7', color: '#fff', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2,132,199,0.35)' }}>Add to Cart</button>
                  <button onClick={() => openSupportWhatsApp(`Hello FindAll In 1, I am inquiring about "${selectedProduct.title}" priced at ₦${selectedProduct.price.toLocaleString()}`)} style={{ backgroundColor: '#25D366', color: '#fff', padding: '14px 18px', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>💬 WhatsApp</button>
                </div>
                <button onClick={() => copyProductLink(selectedProduct)} style={{ width: '100%', backgroundColor: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  🔗 Copy Shareable Product Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT VIEW */}
      {currentView === 'checkout' && (
        <div style={{ maxWidth: '550px', margin: '40px auto', background: '#fff', padding: '28px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>Complete Your Order 📦</h2>
            <button onClick={() => setCurrentView('catalog')} style={{ background: '#e2e8f0', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', color: '#334155' }}>Back</button>
          </div>
          
          <form onSubmit={handleWhatsAppCheckout}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Full Name</label>
              <input type="text" placeholder="e.g. Salaudeen Adegbola" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Phone Number</label>
              <input type="tel" placeholder="e.g. 08147684917" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Delivery Street Address</label>
              <input type="text" placeholder="e.g. No 12, Allen Avenue" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>City / Town</label>
                <input type="text" placeholder="e.g. Ibadan" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>State / Country</label>
                <input type="text" placeholder="e.g. Oyo State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Cart Summary ({cart.length} items):</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#0284c7' }}>
                Total: ₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
              </div>
            </div>

            <button type="submit" style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,211,102,0.35)' }}>
              💬 Send Order via WhatsApp
            </button>
          </form>
        </div>
      )}

      {/* ADMIN PANEL */}
      {currentView === 'admin' && (
        <div style={{ maxWidth: '600px', margin: '40px auto', background: '#fff', padding: '28px', borderRadius: '18px', border: '1px solid #cbd5e1', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>Admin Dashboard ⚙️</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setCurrentView('catalog')} style={{ background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Store</button>
              {isAdminLoggedIn && (
                <button onClick={() => setIsAdminLoggedIn(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Log Out</button>
              )}
            </div>
          </div>

          {!isAdminLoggedIn ? (
            <form onSubmit={e => { e.preventDefault(); if(passcode === '1234') setIsAdminLoggedIn(true); else alert('Wrong passcode (1234)'); }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>Enter 4-digit passcode to manage store listings.</p>
              <input type="password" placeholder="Passcode (1234)" value={passcode} onChange={e => setPasscode(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>Unlock Dashboard</button>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: '#f0f9ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#0284c7', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ fontSize: '13px', color: '#0369a1', fontWeight: 700 }}>Admin Connected (Supabase Database)</span>
              </div>

              <form onSubmit={handleAddProduct}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Product Title</label>
                  <input type="text" placeholder="e.g. iPhone 14 Pro Max" required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Price (₦)</label>
                    <input type="number" placeholder="e.g. 750000" required value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Condition</label>
                    <select value={newCondition} onChange={e => setNewCondition(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', outline: 'none' }}>
                      <option value="Brand New">Brand New</option>
                      <option value="Used">Used / UK Used</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Category</label>
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', outline: 'none' }}>
                      {categories.filter(c => c.name !== 'All').map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Location / Shipping</label>
                    <input type="text" placeholder="e.g. Nationwide Delivery" value={newLocation} onChange={e => setNewLocation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Image URL</label>
                  <input type="text" placeholder="Paste Unsplash or image link" value={newImage} onChange={e => setNewImage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Description</label>
                  <textarea placeholder="Describe specifications..." rows="3" value={newDescription} onChange={e => setNewDescription(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}></textarea>
                </div>

                <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2,132,199,0.35)' }}>Publish Listing</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 150, boxShadow: '0 -4px 20px rgba(0,0,0,0.04)' }}>
        <button onClick={() => { setSelectedProduct(null); setCurrentView('catalog'); window.history.pushState({}, '', window.location.pathname); }} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: currentView === 'catalog' ? '#0284c7' : '#64748b', fontSize: '11px', fontWeight: 800, gap: '3px' }}>
          <span style={{ fontSize: '18px' }}>🏠</span> Home
        </button>
        <button onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#64748b', fontSize: '11px', fontWeight: '800', gap: '3px' }}>
          <span style={{ fontSize: '18px' }}>🛒</span> Cart ({cart.length})
        </button>
        <button onClick={() => openSupportWhatsApp()} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#25D366', fontSize: '11px', fontWeight: 800, gap: '3px' }}>
          <span style={{ fontSize: '18px' }}>💬</span> Support
        </button>
      </nav>

    </div>
  );
}
