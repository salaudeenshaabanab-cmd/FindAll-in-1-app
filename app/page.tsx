'use client';

import { useState } from 'react';

const categories = [
  { name: 'Phones & Tablets', icon: '📱', count: '14 items' },
  { name: 'Vehicles', icon: '🚗', count: '3 listings' },
  { name: 'Laptops & Computers', icon: '💻', count: '8 items' },
  { name: 'Real Estate', icon: '🏠', count: '5 properties' },
  { name: 'Fashion & Apparel', icon: '👕', count: '20+ items' },
  { name: 'Sports Wears & Equipment', icon: '⚽', count: '12 items' },
  { name: 'Gadgets & Accessories', icon: '🎧', count: '15 items' },
  { name: 'Gaming & Consoles', icon: '🎮', count: '6 items' },
  { name: 'Jobs & Professional Offers', icon: '💼', count: 'Services' },
  { name: 'Beauty & Body Care', icon: '✨', count: '9 items' },
  { name: 'Home Appliances', icon: '⚡', count: '7 items' },
  { name: 'General Logistics & Services', icon: '🚚', count: 'Available' },
];

const inventory = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - 256GB (Deep Purple, Mint Condition)',
    price: '₦ 980,000',
    category: 'Phones & Tablets',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600',
  },
  {
    id: '2',
    title: 'PlayStation 5 Disc Console + 2 DualSense Controllers',
    price: '₦ 650,000',
    category: 'Gaming & Consoles',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600',
  },
  {
    id: '3',
    title: 'Nike Mercurial Vapor Pro FG Football Boots (Size 43)',
    price: '₦ 45,000',
    category: 'Sports Wears & Equipment',
    condition: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    id: '4',
    title: 'Organic Glow Vitamin C Face Serum & Complete Skincare Kit',
    price: '₦ 18,500',
    category: 'Beauty & Body Care',
    condition: 'In Stock',
    image: 'https://images.unsplash.com/photo-1608248597359-f55c5a08906a?w=600',
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white pb-20">
      {/* Top Professional Announcement Bar */}
      <div className="bg-blue-950 text-blue-100 text-xs py-2 px-4 text-center font-medium tracking-wide">
        🇳🇬 FindAll In 1 Official Store — Direct Verified Inventory & Professional Services. Nationwide Delivery Available.
      </div>

      {/* Main Sticky Navigation */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white font-black p-2 rounded-xl text-lg shadow-inner">FA</span>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white leading-none">
                  FindAll <span className="text-blue-300 font-light">In 1</span>
                </h1>
                <p className="text-[10px] text-blue-300 uppercase tracking-widest font-semibold mt-0.5">Single-Vendor Ecosystem</p>
              </div>
            </div>
            <span className="bg-blue-800 text-blue-200 border border-blue-700 text-xs px-3 py-1 rounded-full font-bold md:hidden">
              Verified 🇳🇬
            </span>
          </div>

          {/* Search Bar Component */}
          <div className="flex w-full md:w-1/2 bg-white rounded-xl overflow-hidden shadow-md border-2 border-blue-700">
            <select className="bg-slate-100 text-xs md:text-sm px-3 text-slate-800 border-r border-slate-200 outline-none font-medium py-2.5">
              <option>All Categories</option>
              <option>Phones & Tablets</option>
              <option>Vehicles</option>
              <option>Real Estate</option>
              <option>Gadgets</option>
            </select>
            <input 
              type="search" 
              placeholder="Search across all store categories..." 
              className="w-full px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-bold text-sm transition flex items-center justify-center">
              Search
            </button>
          </div>

          {/* Action Hub */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-blue-200 font-medium">Direct Support</p>
              <p className="text-xs font-bold text-white">Instant Response</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 border border-blue-400">
              🛒 Cart <span className="bg-blue-700 px-2 py-0.5 rounded-full text-xs">0</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden border border-blue-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-600 rounded-full opacity-25 blur-3xl pointer-events-none"></div>
          
          <div className="space-y-3 z-10 text-center md:text-left max-w-2xl">
            <span className="inline-block bg-blue-600 text-white text-[11px] uppercase tracking-widest px-3.5 py-1 rounded-full font-extrabold shadow">
              Official Single-Vendor Hub
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              One Store. Infinite Categories. Absolute Trust.
            </h2>
            <p className="text-blue-200 text-sm md:text-base leading-relaxed">
              Skip the noise of multi-user marketplaces. Explore curated, high-grade inventory spanning electronics, vehicles, real estate, professional services, and lifestyle essentials under one unified brand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
            <button className="bg-white text-blue-950 hover:bg-blue-50 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-lg transition text-center">
              Browse Full Catalog
            </button>
            <button className="bg-blue-700 text-white hover:bg-blue-600 font-bold px-6 py-3.5 rounded-xl text-sm shadow transition border border-blue-500 text-center">
              Contact Store Rep
            </button>
          </div>
        </div>
      </section>

      {/* Category Grid Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Explore Store Departments</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select a category to filter official store inventory</p>
          </div>
          <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">View All (12) →</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedCategory(cat.name)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md hover:border-blue-500 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-inner">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-800 leading-snug mb-1">{cat.name}</span>
              <span className="text-[10px] font-semibold text-blue-600">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Product & Service Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Featured Store Inventory</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing verified stock items ready for direct acquisition</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
            Filter: <span className="text-blue-600">{selectedCategory}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {inventory.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col group">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 left-3 bg-blue-900 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md border border-blue-700">
                  {item.condition}
                </span>
              </div>
              
              <div className="p-4.5 flex flex-col flex-grow">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">{item.category}</span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-3 leading-snug">{item.title}</h4>
                
                <div className="mt-auto">
                  <div className="text-lg font-black text-blue-950 mb-3.5 tracking-tight">
                    {item.price}
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-2">
                    <span>Add to Cart / Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding Section */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-700 text-sm mb-1">FindAll In 1 — Powered for Single-Vendor Excellence</p>
        <p>All rights reserved. Built with Next.js, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
