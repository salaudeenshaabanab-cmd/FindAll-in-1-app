'use client';
import { useState } from 'react';

export default function MasterAdminDashboard() {
  // 1. Initial State for Products
  const [products, setProducts] = useState([
    { id: 1, name: "iPhone 11 Pro", price: "₦350,000", stock: 5, category: "Phones" },
    { id: 2, name: "Samsung Galaxy S21", price: "₦280,000", stock: 8, category: "Phones" },
    { id: 3, name: "AirPods Pro", price: "₦65,000", stock: 12, category: "Accessories" },
  ]);

  // 2. Initial State for Orders (Simulating customer checkout orders)
  const [orders, setOrders] = useState([
    { id: "ORD-9201", customer: "Tunde Bakare", item: "iPhone 11 Pro", status: "Pending" },
    { id: "ORD-9202", customer: "Amina Yusuf", item: "AirPods Pro", status: "Completed" },
  ]);

  // Form Inputs for Adding Products
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  // Handle Adding Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const newItem = {
      id: Date.now(),
      name: newName,
      price: newPrice,
      stock: Number(newStock) || 1,
      category: "General",
    };

    setProducts([newItem, ...products]);
    setNewName("");
    setNewPrice("");
    setNewStock("");
  };

  // Handle Deleting Product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  // Handle Order Status Toggle
  const toggleOrderStatus = (id) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        const nextStatus = order.status === "Pending" ? "Completed" : "Pending";
        return { ...order, status: nextStatus };
      }
      return order;
    }));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '24px' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#111827', color: '#fff', padding: '20px 24px', borderRadius: '10px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px' }}>⚡ Master Store Admin</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9ca3af' }}>Corporate-Grade E-Commerce Command Center</p>
        </div>
        <span style={{ fontSize: '12px', background: '#059669', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Active & Live</span>
      </header>

      {/* ANALYTICS OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0' }}>Total Products</p>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111' }}>{products.length} Items</h3>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0' }}>Active Orders</p>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#2563eb' }}>{orders.length} Orders</h3>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0' }}>System Status</p>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#059669' }}>Operational</h3>
        </div>
      </div>

      {/* MAIN LAYOUT GRID: LEFT (ADD & INVENTORY) / RIGHT (ORDERS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* LEFT COLUMN: INVENTORY & ADD FORM */}
        <div>
          {/* Add Product Form */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '14px', color: '#1f2937' }}>➕ Add New Stock Item</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Product Name (e.g. iPhone 14)" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
              <input 
                type="text" 
                placeholder="Price (e.g. ₦450,000)" 
                value={newPrice} 
                onChange={(e) => setNewPrice(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
              <input 
                type="number" 
                placeholder="Stock Quantity" 
                value={newStock} 
                onChange={(e) => setNewStock(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
              <button 
                type="submit" 
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Save to Inventory
              </button>
            </form>
          </div>

          {/* Product Inventory List */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '14px', color: '#1f2937' }}>📦 Current Store Catalog</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontWeight: '500', fontSize: '14px', color: '#111' }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>{item.price} <span style={{ color: '#6b7280', fontWeight: 'normal' }}>({item.stock} left)</span></p>
                  </div>
                  <button 
                    onClick={() => handleDeleteProduct(item.id)}
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMER ORDERS MANAGEMENT */}
        <div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '14px', color: '#1f2937' }}>🛒 Incoming Customer Orders</h2>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Click status to toggle fulfillment tracking.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((ord) => (
                <div key={ord.id} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>{ord.id}</span>
                    <button 
                      onClick={() => toggleOrderStatus(ord.id)}
                      style={{ 
                        fontSize: '11px', 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        backgroundColor: ord.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                        color: ord.status === 'Completed' ? '#065f46' : '#92400e'
                      }}>
                      {ord.status}
                    </button>
                  </div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600', color: '#111' }}>{ord.customer}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Ordered: <strong>{ord.item}</strong></p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CUSTOMER STOREFRONT PREVIEW SECTION (WITH DUAL CHECKOUT) */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>🛍️ Customer Storefront Preview (Dual Checkout Enabled)</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {products.map((item) => (
            <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', color: '#111' }}>{item.name}</h3>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '0 0 6px 0' }}>{item.price}</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 16px 0' }}>In Stock: {item.stock} units</p>
              </div>

              {/* Dual Checkouts Buttons Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 1. Paystack Button */}
                <button 
                  onClick={() => {
                    alert(`Redirecting to secure Paystack checkout for ${item.name} (${item.price})...`);
                  }}
                  style={{ width: '100%', backgroundColor: '#00c3ff', color: '#111', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  Pay Online (Paystack) 💳
                </button>

                {/* 2. WhatsApp Button */}
                <button 
                  onClick={() => {
                    const message = encodeURIComponent(`Hello, I want to order ${item.name} priced at ${item.price}. Is it available?`);
                    window.open(`https://wa.me/2348147684917?text=${message}`, '_blank');
                  }}
                  style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  Order via WhatsApp 📱
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

