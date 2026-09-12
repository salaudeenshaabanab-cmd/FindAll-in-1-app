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
    physicalCondition: 'No cracks / Clean body',
    storage: '128 GB',
    ram: '12 GB',
    location: 'Oyo State, Ibadan',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600',
    description: 'Pristine condition Google Pixel 10 with complete box, amazing battery health and ultra-clear cameras.',
  },
  {
    id: '2',
    title: 'PlayStation 5 Disc Console + 2 Controllers',
    price: 650000,
    category: 'Gaming & Consoles',
    condition: 'Brand New',
    physicalCondition: 'Sealed Box',
    storage: '825 GB SSD',
    ram: '16 GB',
    location: 'Oyo State, Ibadan',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600',
    description: 'Brand new European region model with dual wireless controllers and ultra-high speed SSD.',
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

  // New Product Form State (with descriptions & condition)
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newCondition, setNewCondition] = useState('Brand New'); // 'Brand New' or 'Used'
  const [newStorage, setNewStorage] = useState('128 GB');
  const [newRam, setNewRam] = useState('8 GB');
  const [newPhysicalCondition, setNewPhysicalCondition] = useState('Flawless / Clean');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  const WHATSAPP_NUMBER = '2348147684917';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Ibadan',
  });

  // Check URL query to see if user is accessing admin (?admin=true)
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
    alert(`Redirecting to Paystack Secure Checkout for ₦${cart.reduce((sum, i) => sum + i.price, 0).toLocaleString()}...`);
  };

  // Add Product Function
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    const newItem = {
      id: Date.now().toString(),
      title: newTitle,
      price: Number(newPrice),
      category: newCategory,
      condition: newCondition, // 'Brand New' or 'Used'
      physicalCondition: newPhysicalCondition,
      storage: newStorage,
      ram: newRam,
      location: 'Oyo State, Ibadan',
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: newDescription || 'No description provided.',
    };
    setInventory([newItem, ...inventory]);
    
    // Reset form fields
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewImage('');
    alert('Product successfully published to the live store catalog!');
    setCurrentView('catalog');
  };

  // Delete Product Function
  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product from the store?')) {
      setInventory(inventory.filter(item => item.id !== id));
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
      <header style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => setCurrentView('catalog')}>
            <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              FindAll <span style={{ color: '#93c5fd', fontWeight: 300 }}>In 1</span>
            </h1>
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
              <button style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Search</button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentView !== 'catalog' ? (
              <button onClick={() => setCurrentView('catalog')} style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                ← Back to Store
              </button>
            ) : (
              <button onClick={() => setIsCartOpen(true)} style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                🛒 Cart ({cart.length})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Your Store Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px 20px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 2px' }}>{item.title}</p>
                    <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: 800, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px 20px 24px', backgroundColor: '#f8fafc' }}>
                <button onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }} style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>
                  Proceed to Secure Checkout 🔒
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 1: CATALOG */}
      {currentView === 'catalog' && (
        <>
          <section style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', borderRadius: '14px', padding: '24px 20px', color: '#ffffff' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 6px' }}>One Store. Infinite Categories. Absolute Trust.</h2>
              <p style={{ fontSize: '13px', color: '#bfdbfe', margin: 0 }}>Explore verified inventory spanning electronics, vehicles, and gadgets under one roof.</p>
            </div>
          </section>

          <section style={{ maxWidth: '1200px', margin: '24px auto 0', padding: '0 16px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {categories.map((cat, idx) => (
                <button key={idx} onClick={() => setSelectedCategory(cat.name)} style={{ backgroundColor: selectedCategory === cat.name ? '#1e3a8a' : '#ffffff', color: selectedCategory === cat.name ? '#ffffff' : '#1e293b', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 700, fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </section>

          <section style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {filteredInventory.map((item) => (
                <div key={item.id} onClick={() => { setSelectedProduct(item); setCurrentView('details'); }} style={{ backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '180px', position: 'relative' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: item.condition === 'Brand New' ? '#16a34a' : '#d97706', color: '#ffffff', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: 700 }}>
                      {item.condition}
                    </span>
                  </div>
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>{item.category}</span>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0 6px' }}>{item.title}</h4>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#172554', marginTop: 'auto', marginBottom: '10px' }}>₦ {item.price.toLocaleString()}</div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* VIEW 2: PRODUCT DETAILS */}
      {currentView === 'details' && selectedProduct && (
        <section style={{ maxWidth: '800px', margin: '20px auto 0', padding: '0 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '100%', height: '350px' }}>
              <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '20px' }}>
              <span style={{ background: selectedProduct.condition === 'Brand New' ? '#16a34a' : '#d97706', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>{selectedProduct.condition}</span>
              <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '10px 0 6px' }}>{selectedProduct.title}</h2>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a', marginBottom: '14px' }}>₦ {selectedProduct.price.toLocaleString()}</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '14px' }}>
                <div><b>Storage:</b> {selectedProduct.storage}</div>
                <div><b>RAM:</b> {selectedProduct.ram}</div>
                <div><b>Physical Look:</b> {selectedProduct.physicalCondition}</div>
                <div><b>Location:</b> {selectedProduct.location}</div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 6px' }}>Description</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{selectedProduct.description}</p>
              
              <button onClick={() => addToCart(selectedProduct)} style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '20px' }}>
                Add to Cart & Checkout 🛒
              </button>
            </div>
          </div>
        </section>
      )}

      {/* VIEW 3: CHECKOUT */}
      {currentView === 'checkout' && (
        <section style={{ maxWidth: '800px', margin: '30px auto 0', padding: '0 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>Secure Order Checkout</h2>
            <form onSubmit={handlePaystackPayment}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input type="text" required placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone Number</label>
                <input type="tel" required placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Delivery Address in Ibadan</label>
                <input type="text" required placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>
                Pay Now with Paystack 💳
              </button>
            </form>
          </div>
        </section>
      )}

      {/* VIEW 4: ADMIN PANEL (WITH FULL DESCRIPTIONS, CONDITION, & DELETE) */}
      {currentView === 'admin' && (
        <section style={{ maxWidth: '650px', margin: '30px auto', padding: '0 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Admin Dashboard ⚙️</h2>
              <button onClick={() => setCurrentView('catalog')} style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Close Admin</button>
            </div>
            
            {!isAdminLoggedIn ? (
              <form onSubmit={(e) => { e.preventDefault(); if(passcode === '1234') setIsAdminLoggedIn(true); else alert('Incorrect passcode! Use 1234'); }}>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>Enter your admin passcode (1234):</p>
                <input type="password" placeholder="Passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <button type="submit" style={{ width: '100%', backgroundColor: '#1e3a8a', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Login</button>
              </form>
            ) : (
              <div>
                <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '13px', marginBottom: '20px' }}>🟢 Logged in as Administrator</p>
                
                <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Upload New Product / Phone Specs</h3>
                <form onSubmit={handleAddProduct}>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Product Title</label>
                    <input type="text" required placeholder="e.g. iPhone 14 Pro Max" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Price (₦)</label>
                      <input type="number" required placeholder="750000" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Condition (New / Old)</label>
                      <select value={newCondition} onChange={(e) => setNewCondition(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>
                        <option value="Brand New">Brand New</option>
                        <option value="Used">Used (Old)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category</label>
                      <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>
                        {categories.filter(c => c.name !== 'All').map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Storage</label>
                      <input type="text" placeholder="128 GB" value={newStorage} onChange={(e) => setNewStorage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>RAM</label>
                      <input type="text" placeholder="8 GB" value={newRam} onChange={(e) => setNewRam(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Physical Condition Details</label>
                    <input type="text" placeholder="e.g. Clean body, 95% battery health, no scratches" value={newPhysicalCondition} onChange={(e) => setNewPhysicalCondition(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Description</label>
                    <textarea rows="3" placeholder="Detailed description of the product..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Image URL</label>
                    <input type="text" placeholder="https://images.unsplash.com/..." value={newImage} onChange={(e) => setNewImage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', marginBottom: '30px' }}>
                    Publish Product to Store 🚀
                  </button>
                </form>

                {/* Manage / Delete Existing Products */}
                <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>Manage Live Inventory (Delete Products)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {inventory.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <img src={item.image} alt="" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                        <span style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>{item.title}</span>
                      </div>
                      <button onClick={() => handleDeleteProduct(item.id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                        Delete 🗑️
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
