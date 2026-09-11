'use client';
import { useState } from 'react';

export default  function StoreAndAdmin() {
  // Shared inventory state for both the store catalog and the admin dashboard
  const [products, setProducts] = useState([
    { id: 1, name: "iPhone 11 Pro", price: "₦350,000", stock: "5", category: "Phones" },
    { id: 2, name: "Samsung Galaxy S21", price: "₦280,000", stock: "8", category: "Phones" },
    { id: 3, name: "AirPods Pro", price: "₦65,000", stock: "12", category: "Accessories" },
  ]);

  // Form states for adding a new product
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCategory, setNewCategory] = useState("Phones");

  // Handle adding a product from the admin panel
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const newItem = {
      id: Date.now(),
      name: newName,
      price: newPrice,
      stock: newStock || "1",
      category: newCategory,
    };

    setProducts([newItem, ...products]);
    setNewName("");
    setNewPrice("");
    setNewStock("");
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px' }}>
      
      {/* TOP HEADER */}
      <header style={{ backgroundColor: '#111', color: '#fff', padding: '16px 24px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🛍️ Store Management Portal</h1>
        <span style={{ fontSize: '12px', background: '#10b981', padding: '4px 8px', borderRadius: '4px' }}>Live Mode</span>
      </header>

      {/* ADMIN PANEL: ADD PRODUCT FORM */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#1f2937' }}>➕ Admin: Add New Product to Store</h2>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Product Name (e.g. iPhone 13)" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="text" 
            placeholder="Price (e.g. ₦450,000)" 
            value={newPrice} 
            onChange={(e) => setNewPrice(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="text" 
            placeholder="Stock Quantity" 
            value={newStock} 
            onChange={(e) => setNewStock(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <button 
            type="submit" 
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Publish to Store
          </button>
        </form>
      </div>

      {/* STOREFRONT PREVIEW: WHAT CUSTOMERS SEE */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#1f2937' }}>🛒 Customer Storefront (Live Catalog Preview)</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {products.map((item) => (
            <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#111' }}>{item.name}</h3>
              <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#10b981', margin: '0 0 8px 0' }}>{item.price}</p>
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>In Stock: {item.stock} units</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
