'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- YOUR SUPABASE CREDENTIALS ---
const SUPABASE_URL = 'https://jqgsksvtkvhwujtpqras.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ3Nrc3Z0a3Zod3VqdHBxcmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTIzOTcsImV4cCI6MjEwNDc4ODM5N30.pB-ed3LSZneH14ub7j9geG6K4L7xO3cuH0jNWE8Jzgg';

// --- YOUR MASTER ADMIN EMAIL ---
const ADMIN_EMAIL = 'salaudeenshaaban.ab@gmail.com';

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
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000000); 

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('catalog'); // catalog, details, checkout, vendorPortal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Auth States for Vendors & Admin
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [registerStoreName, setRegisterStoreName] = useState('');

  // Admin Panel Data
  const [pendingVendors, setPendingVendors] = useState([]);

  // New Product Form Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newCondition, setNewCondition] = useState('Brand New');
  const [newLocation, setNewLocation] = useState('Nationwide Delivery (Nigeria)');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerWhatsApp, setNewSellerWhatsApp] = useState('');

  const FALLBACK_WHATSAPP = '2348147684917';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    fetchProducts();

    // Check active session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser.id);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser.id);
      } else {
        setUserProfile(null);
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('vendor') === 'true') {
      setCurrentView('vendorPortal');
    }

    const productId = params.get('product');
    if (productId) {
      loadProductById(productId);
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setUserProfile(data);
    } else if (error) {
      console.error('Error fetching profile:', error);
    }
    
    // If current user is Admin, fetch pending vendors
    if (userId) {
      fetchPendingVendors();
    }
  };

  const fetchPendingVendors = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('is_approved', false);
    if (data) setPendingVendors(data);
  };

  const handleApproveVendor = async (vendorId) => {
    const { error } = await supabase.from('profiles').update({ is_approved: true }).eq('id', vendorId);
    if (error) {
      alert('Error approving vendor: ' + error.message);
    } else {
      setToastMessage('Vendor approved successfully!');
      setTimeout(() => setToastMessage(''), 2500);
      fetchPendingVendors();
    }
  };

  const loadProductById = async (id) => {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      setSelectedProduct(data);
      setCurrentView('details');
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) console.error('Error fetching products:', error);
    else if (data) setInventory(data);
  };

  // Vendor Authentication Handlers
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!registerStoreName) {
      alert('Please enter your Store Name.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({ 
      email: authEmail, 
      password: authPassword 
    });

    if (error) {
      alert('Sign Up Error: ' + error.message);
    } else if (data?.user) {
      // Create profile record with is_approved = false
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: data.user.id,
        email: authEmail,
        store_name: registerStoreName,
        is_approved: false
      }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      alert('Account registered! Your account is pending review by the marketplace admin.');
      setAuthEmail('');
      setAuthPassword('');
      setRegisterStoreName('');
      setIsSignUpMode(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) {
      alert('Sign In Error: ' + error.message);
    } else {
      setAuthEmail('');
      setAuthPassword('');
      setToastMessage('Logged in successfully!');
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setToastMessage('Logged out successfully');
    setTimeout(() => setToastMessage(''), 2500);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = item.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
    setToastMessage(`Added to cart`);
    setIsCartOpen(true);
    setTimeout(() => setToastMessage('3000'), 3000);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in as a vendor to post items.');
      return;
    }

    const isAdmin = user.email === ADMIN_EMAIL;
    if (!isAdmin && !userProfile?.is_approved) {
      alert('Your vendor account is still pending admin approval. You cannot post items yet.');
      return;
    }

    if (!newTitle || !newPrice || !newSellerName || !newSellerWhatsApp) {
      alert('Please fill in all required fields including your Store Name and WhatsApp number.');
      return;
    }
    
    const newItem = {
      title: newTitle,
      price: Number(newPrice),
      category: newCategory,
      condition: newCondition,
      location: newLocation || 'Nationwide Delivery',
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: newDescription || 'Verified quality product listed on FindAll In 1 marketplace.',
      seller_name: newSellerName,
      seller_whatsapp: newSellerWhatsApp,
      vendor_id: user.id 
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

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state) {
      alert('Please fill in all delivery details.');
      return;
    }
    const firstVendorPhone = cart[0]?.seller_whatsapp || FALLBACK_WHATSAPP;
    const cartItemsText = cart.map((item) => `%0A- ${item.title} (₦${item.price.toLocaleString()})`).join('');
    const totalPrice = cart.reduce((sum, i) => sum + i.price, 0).toLocaleString();

    const orderMessage = `*NEW ORDER - FindAll In 1*%0A%0A*Customer Details:*%0A- Name: ${encodeURIComponent(formData.fullName)}%0A- Phone: ${encodeURIComponent(formData.phone)}%0A- Address: ${encodeURIComponent(formData.address)}%0A- City: ${encodeURIComponent(formData.city)}%0A- State: ${encodeURIComponent(formData.state)}%0A%0A*Order Summary:*${cartItemsText}%0A%0A*Total Amount: ₦${totalPrice}*%0A%0APlease confirm my order!`;

    window.open(`https://wa.me/${firstVendorPhone}?text=${orderMessage}`, '_blank');
  };

  const isAdminUser = user?.email === ADMIN_EMAIL;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: '100px' }}>
      
      {toastMessage && (
        <div style={{ position: 'fixed', top: '55px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0284c7', color: '#ffffff', padding: '12px 24px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, zIndex: 300, boxShadow: '0 10px 25px rgba(2,132,199,0.3)' }}>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '16px 16px 20px', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 4px 20px rgba(2,132,199,0.2)' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setSelectedProduct(null); setCurrentView('catalog'); window.history.pushState({}, '', window.location.pathname); }}>
              <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#fff' }}>FindAll <span style={{ fontWeight: 300, color: '#e0f2fe' }}>In 1</span></h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setCurrentView('vendorPortal')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                {user ? (isAdminUser ? '👑 Admin Panel' : '🏪 Dashboard') : '🔑 Vendor Login'}
              </button>
              <button onClick={() => setIsCartOpen(true)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 14px', borderRadius: '24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🛒 <span style={{ backgroundColor: '#ffffff', color: '#0284c7', padding: '1px 6px', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>{cart.length}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', padding: '6px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <span style={{ display: 'flex', alignItems: 'center', marginRight: '8px', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, independent vendors..." 
              style={{ width: '100%', padding: '6px 0', fontSize: '14px', border: 'none', outline: 'none', color: '#0f172a', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 200, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900 }}>Shopping Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 2px' }}>Vendor: {item.seller_name}</p>
                    <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: 900, margin: 0 }}>₦ {item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '20px' }}>
                <button onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }} style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATALOG VIEW */}
      {currentView === 'catalog' && (
        <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 16px' }}>
          
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px', scrollbarWidth: 'none' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundColor: selectedCategory === cat.name ? '#0284c7' : '#ffffff', color: selectedCategory === cat.name ? '#ffffff' : '#475569', padding: '10px 16px', borderRadius: '12px', border: selectedCategory === cat.name ? '1px solid #0284c7' : '1px solid #e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '16px' }}>
            {filteredInventory.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setSelectedProduct(item); setCurrentView('details'); window.history.pushState({}, '', `?product=${item.id}`); }} 
                style={{ backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: item.condition === 'Brand New' ? '#0284c7' : '#d97706', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                    {item.condition || 'Used'}
                  </span>
                </div>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#0f172a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h4>
                    <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginBottom: '6px' }}>👤 {item.seller_name || 'Store'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0284c7', marginBottom: '10px' }}>₦ {item.price.toLocaleString()}</div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>Buy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VENDOR PORTAL & ADMIN APPROVAL VIEW */}
      {currentView === 'vendorPortal' && (
        <div style={{ maxWidth: '600px', margin: '40px auto', background: '#fff', padding: '28px', borderRadius: '18px', border: '1px solid #cbd5e1', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 900 }}>
              {isAdminUser ? '👑 Master Admin Panel' : '🏪 Vendor Portal'}
            </h2>
            <button onClick={() => setCurrentView('catalog')} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Back to Store</button>
          </div>

          {!user ? (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setIsSignUpMode(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: !isSignUpMode ? '#0284c7' : '#f1f5f9', color: !isSignUpMode ? '#fff' : '#64748b', fontWeight: 800, cursor: 'pointer' }}>Sign In</button>
                <button onClick={() => setIsSignUpMode(true)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: isSignUpMode ? '#0284c7' : '#f1f5f9', color: isSignUpMode ? '#fff' : '#64748b', fontWeight: 800, cursor: 'pointer' }}>Register Account</button>
              </div>

              <form onSubmit={isSignUpMode ? handleSignUp : handleSignIn}>
                {isSignUpMode && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Store / Business Name</label>
                    <input type="text" placeholder="e.g. Noonetech Gadgets" required value={registerStoreName} onChange={e => setRegisterStoreName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                )}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Email Address</label>
                  <input type="email" placeholder="vendor@example.com" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Password</label>
                  <input type="password" placeholder="••••••••" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                  {isSignUpMode ? 'Register & Request Approval' : 'Log In to Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f9ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bae6fd', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#0369a1', display: 'block', fontWeight: 700 }}>Logged in as: {user.email}</span>
                  <span style={{ fontSize: '11px', color: isAdminUser ? '#d97706' : (userProfile?.is_approved ? '#16a34a' : '#dc2626'), fontWeight: 800 }}>
                    {isAdminUser ? '👑 Role: Marketplace Admin' : (userProfile?.is_approved ? '✅ Status: Approved Vendor' : '⏳ Status: Pending Admin Approval')}
                  </span>
                </div>
                <button onClick={handleSignOut} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>Sign Out</button>
              </div>

              {/* ADMIN APPROVAL SECTION */}
              {isAdminUser && (
                <div style={{ marginBottom: '30px', background: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#b45309', marginBottom: '10px' }}>Pending Vendor Registrations ({pendingVendors.length})</h3>
                  {pendingVendors.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>No pending vendor requests at the moment.</p>
                  ) : (
                    pendingVendors.map((v) => (
                      <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #fde68a' }}>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>{v.store_name || 'Unnamed Store'}</p>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{v.email}</p>
                        </div>
                        <button onClick={() => handleApproveVendor(v.id)} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Approve</button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* POST PRODUCT SECTION (Only if Approved or Admin) */}
              {isAdminUser || userProfile?.is_approved ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '14px' }}>Post New Product</h3>
                  <form onSubmit={handleAddProduct}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Store / Vendor Name</label>
                        <input type="text" placeholder="e.g. Tunde Gadgets" required value={newSellerName} onChange={e => setNewSellerName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>WhatsApp No.</label>
                        <input type="text" placeholder="e.g. 2348147684917" required value={newSellerWhatsApp} onChange={e => setNewSellerWhatsApp(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Product Title</label>
                      <input type="text" placeholder="e.g. iPhone 13 Pro" required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Price (₦)</label>
                        <input type="number" placeholder="450000" required value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                        <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}>
                          {categories.filter(c => c.name !== 'All').map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Image URL</label>
                      <input type="text" placeholder="Paste image link" value={newImage} onChange={e => setNewImage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                      <textarea rows="2" placeholder="Description..." value={newDescription} onChange={e => setNewDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}></textarea>
                    </div>

                    <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Publish Listing to Marketplace</button>
                  </form>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Your account is awaiting admin verification.</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Once Salaudeen reviews and approves your account, you will be able to post your products here instantly.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CHECKOUT VIEW */}
      {currentView === 'checkout' && (
        <div style={{ maxWidth: '550px', margin: '40px auto', background: '#fff', padding: '28px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 900, marginBottom: '20px' }}>Complete Order 📦</h2>
          <form onSubmit={handleWhatsAppCheckout}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Full Name</label>
              <input type="text" placeholder="Your Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Phone Number</label>
              <input type="tel" placeholder="08140000000" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Delivery Address</label>
              <input type="text" placeholder="Street Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>City</label>
                <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>State</label>
                <input type="text" placeholder="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>💬 Send Order to Vendor via WhatsApp</button>
          </form>
        </div>
      )}

    </div>
  );
}
