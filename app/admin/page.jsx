'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jqgsksvtkvhwujtpqras.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ3Nrc3Z0a3Zod3VqdHBxcmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTIzOTcsImV4cCI6MjEwNDc4ODM5N30.pB-ed3LSZneH14ub7j9geG6K4L7xO3cuH0jNWE8Jzgg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const categories = [
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

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Phones & Tablets');
  const [newCondition, setNewCondition] = useState('Brand New');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [inventory, setInventory] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchProducts();
    }
  }, [isAdminLoggedIn]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setInventory(data);
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
      location: 'Ibadan, Oyo State',
      image: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: newDescription || 'Verified quality product listed on FindAll In 1 marketplace.',
    };
    
    const { error } = await supabase.from('products').insert([newItem]);
    
    if (error) {
      alert('Error saving product: ' + error.message);
    } else {
      setToastMessage('Product published successfully!');
      setTimeout(() => setToastMessage(''), 3000);
      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
      setNewImage('');
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Delete this listing?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {toastMessage && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0284c7', color: '#ffffff', padding: '10px 20px', borderRadius: '24px', fontSize: '13px', fontWeight: 600, zIndex: 300 }}>
          {toastMessage}
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px rgba(2,132,199,0.06)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>Admin Dashboard ⚙️</h2>
          <a href="/" style={{ background: '#e2e8f0', color: '#0f172a', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', textDecoration: 'none' }}>Visit Store</a>
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

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}>
                  {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Image URL</label>
                <input type="text" placeholder="Paste Unsplash or image link" value={newImage} onChange={e => setNewImage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>Description</label>
                <textarea placeholder="Describe specifications..." rows="3" value={newDescription} onChange={e => setNewDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}></textarea>
              </div>

              <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>Publish Listing</button>
            </form>

            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Manage Existing Listings ({inventory.length})</h3>
              {inventory.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', marginBottom: '6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{item.title}</span>
                  <button onClick={() => handleDeleteProduct(item.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
