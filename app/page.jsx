'use client'

import { useState } from 'react'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentView, setCurrentView] = useState('catalog')

  return (
    <main style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '24px' }}>
      <header style={{ backgroundColor: '#111827', color: '#fff', padding: '20px 24px', borderRadius: '10px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px' }}>FindAll-in-1 Store</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9ca3af' }}>Welcome to our mobile and accessories store</p>
        </div>
        <a 
          href="/admin" 
          style={{ fontSize: '12px', background: '#2563eb', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none' }}
        >
          Admin Dashboard ⚙️
        </a>
      </header>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111' }}>Storefront is Live!</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
          Manage your inventory, prices, and stock counts directly from your admin panel.
        </p>
        <a 
          href="/admin" 
          style={{ display: 'inline-block', backgroundColor: '#059669', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}
        >
          Go to Admin Panel
        </a>
      </div>
    </main>
  )
}
