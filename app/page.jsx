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
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
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

  // Instant WhatsApp Order Submission Handler (Nationwide/Worldwide)
  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state) {
      alert('Please fill in all delivery details (including City and State/Country).');
      return;
    }

    const cartItemsText = cart.map((item, idx) => `%0A- ${item.title} (₦${item.price.toLocaleString()})`).join('');
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: '90px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0284c7', color: '#ffffff', padding: '10px 20px', borderRadius: '24px', fontSize: '13px', fontWeight: 600, zIndex: 300, boxShadow: '0 10px 25px rgba(2,132,199,0.3)' }}>
          {toastMessage}
        </div>
      )}

      {/* Top Blue Header Banner */}
      <div style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '16px 16px 20px', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 8px rgba(2,132,199,0.15)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setSelectedProduct(null); setCurrentView('catalog'); window.history.pushState({}, '', window.location.pathname); }}>
              <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', color: '#fff' }}>FindAll <span style={{ fontWeight: 300, color: '#e0f2fe' }}>In 1</span></h1>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsCartOpen(true)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🛒 {cart.length}
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', padding: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
            <span style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I am looking for..." 
              style={{ width: '100%', padding: '8px 4px', fontSize: '14px', border: 'none', outline: 'none', color: '#0f172a', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Shopping Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#e2e8f0', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', marginTop: '50px' }}>Your cart is empty.</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>{item.title}</p>
                      <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: 800, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '20px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px', fontWeight: 800 }}>
                  <span>Total:</span>
                  <span style={{ color: '#0284c7' }}>₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }} style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }}>Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATALOG VIEW */}
      {currentView === 'catalog' && (
        <div style={{ maxWidth: '900px', margin: '16px auto', padding: '0 12px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <div onClick={() => openSupportWhatsApp("Hello FindAll In 1, I need assistance finding a product.")} style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 4px rgba(2,132,199,0.03)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>💬</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>Customer Support</div>
            </div>
            <div onClick={() => setIsCartOpen(true)} style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 4px rgba(2,132,199,0.03)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🛒</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>View Cart ({cart.length})</div>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px', scrollbarWidth: 'none' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundColor: selectedCategory === cat.name ? '#0284c7' : '#ffffff', color: selectedCategory === cat.name ? '#ffffff' : '#334155', padding: '8px 14px', borderRadius: '10px', border: selectedCategory === cat.name ? '1px solid #0284c7' : '1px solid #e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: '12px' }}>
            {filteredInventory.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#64748b' }}>No items found in this category.</p>
                <button onClick={() => setSelectedCategory('All')} style={{ marginTop: '10px', background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Show All Items</button>
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
                  style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '8px', left: '8px', background: item.condition === 'Brand New' ? '#0284c7' : '#f59e0b', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {item.condition || 'Used'}
                    </span>
                  </div>
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, marginBottom: '2px', textTransform: 'uppercase' }}>{item.category}</div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 6px', color: '#0f172a', lineHeight: '1.25', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h4>
                      {item.location && <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>📍 {item.location}</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#0284c7', marginBottom: '8px' }}>₦ {item.price.toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} style={{ flex: 1, backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '6px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>Buy</button>
                        <button onClick={(e) => { e.stopPropagation(); copyProductLink(item); }} title="Copy Product Link" style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', padding: '6px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>🔗</button>
                        {isAdminLoggedIn && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(item.id); }} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>🗑️</button>
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
        <div style={{ maxWidth: '700px', margin: '20px auto', padding: '0 12px' }}>
          <button 
            onClick={() => { 
              setCurrentView('catalog'); 
              window.history.pushState({}, '', window.location.pathname);
            }} 
            style={{ marginBottom: '12px', background: '#e2e8f0', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            ← Back to Store
          </button>
          
          <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(2,132,199,0.05)' }}>
            <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>{selectedProduct.category}</span>
                <span style={{ background: selectedProduct.condition === 'Brand New' ? '#e0f2fe' : '#fef3c7', color: selectedProduct.condition === 'Brand New' ? '#0284c7' : '#d97706', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>{selectedProduct.condition}</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '8px 0' }}>{selectedProduct.title}</h2>
              {selectedProduct.location && <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>📍 Shipping / Location: {selectedProduct.location}</p>}
              <h3 style={{ color: '#0284c7', fontSize: '22px', fontWeight: 900, marginBottom: '14px' }}>₦ {selectedProduct.price.toLocaleString()}</h3>
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>{selectedProduct.description}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => addToCart(selectedProduct)} style={{ flex: 1, backgroundColor: '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>Add to Cart</button>
                  <button onClick={() => openSupportWhatsApp(`Hello FindAll In 1, I am inquiring about "${selectedProduct.title}" priced at ₦${selectedProduct.price.toLocaleString()}`)} style={{ backgroundColor: '#25D366', color: '#fff', padding: '12px 16px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>💬 WhatsApp</button>
                </div>
                <button onClick={() => copyProductLink(selectedProduct)} style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  🔗 Copy Shareable Product Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT VIEW */}
      {currentView === 'checkout' && (
        <div style={{ maxWidth: '550px', margin: '30px auto', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(2,132,199,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>Complete Your Order 📦</h2>
            <button onClick={() => setCurrentView('catalog')} style={{ background: '#e2e8f0', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>Back</button>
          </div>
          
          <form onSubmit={handleWhatsAppCheckout}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Full Name</label>
              <input type="text" placeholder="e.g. Salaudeen Adegbola" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Phone Number</label>
              <input type="tel" placeholder="e.g. 08147684917" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Delivery Street Address</label>
              <input type="text" placeholder="e.g. No 12, Allen Avenue" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>City / Town</label>
                <input type="text" placeholder="e.g. Ikeja / Ibadan" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>State / Country</label>
                <input type="text" placeholder="e.g. Lagos State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
              </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Cart Summary ({cart.length} items):</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0284c7' }}>
                Total: ₦ {cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
              </div>
            </div>

            <button type="submit" style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '14px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(37,211,102,0.3)' }}>
              💬 Send Order via WhatsApp
            </button>
          </form>
        </div>
      )}

      {/* ADMIN PANEL */}
      {currentView === 'admin' && (
        <div style={{ maxWidth: '600px', margin: '30px auto', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px rgba(2,132,199,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>Admin Dashboard ⚙️</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setCurrentView('catalog')} style={{ background: '#e2e8f0', color: '#0f172a', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>Back to Store</button>
              {isAdminLoggedIn && (
                <button onClick={() => setIsAdminLoggedIn(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>Log Out</button>
              )}
            </div>
          </div>

          {!isAdminLoggedIn ? (
            <form onSubmit={e => { e.preventDefault(); if(passcode === '1234') setIsAdminLoggedIn(true); else alert('Wrong passcode (1234)'); }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Enter 4-digit passcode to manage store listings.</p>
              <input type="password" placeholder="Passcode (1234)" value={passcode} onChange={e => setPasscode(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '10px', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>Unlock Dashboard</button>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', background: '#e0f2fe', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#0284c7', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 700 }}>Admin Connected (Supabase Database)</span>
              </div>

              <form onSubmit={handleAddProduct}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Product Title</label>
                  <input type="text" placeholder="e.g. iPhone 14 Pro Max" required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Price (₦)</label>
                    <input type="number" placeholder="e.g. 750000" required value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Condition</label>
                    <select value={newCondition} onChange={e => setNewCondition(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}>
                      <option value="Brand New">Brand New</option>
                      <option value="Used">Used / UK Used</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Category</label>
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}>
                      {categories.filter(c => c.name !== 'All').map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Location / Shipping</label>
                    <input type="text" placeholder="e.g. Nationwide Delivery" value={newLocation} onChange={e => setNewLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Image URL</label>
                  <input type="text" placeholder="Paste Unsplash or image link" value={newImage} onChange={e => setNewImage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Description</label>
                  <textarea placeholder="Describe specifications..." rows="3" value={newDescription} onChange={e => setNewDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd50e1', fontSize: '13px', fontFamily: 'inherit' }}></textarea>
                </div>

                <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>Publish Listing</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Customer-Friendly Sticky Bottom Navigation Bar */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 150, boxShadow: '0 -2px 10px rgba(0,0,0,0.04)' }}>
        <button onClick={() => { setSelectedProduct(null); setCurrentView('catalog'); window.history.pushState({}, '', window.location.pathname); }} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: currentView === 'catalog' ? '#0284c7' : '#64748b', fontSize: '11px', fontWeight: 700, gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>🏠</span> Home
        </button>
        <button onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#64748b', fontSize: '11px', fontWeight: '700', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>🛒</span> Cart ({cart.length})
        </button>
        <button onClick={() => openSupportWhatsApp()} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#25D366', fontSize: '11px', fontWeight: 700, gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>💬</span> Support
        </button>
      </nav>

    </div>
  );
}
