'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch products on load
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault()
    if (!name || !price || !stock) return alert('Please fill in all fields')

    setLoading(true)
    const { error } = await supabase
      .from('products')
      .insert([{ name, price, stock: parseInt(stock) }])

    setLoading(false)

    if (error) {
      alert('Error adding product: ' + error.message)
    } else {
      setName('')
      setPrice('')
      setStock('')
      fetchProducts()
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-900 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Store Admin Dashboard</h1>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="bg-white p-4 rounded-lg shadow mb-8 space-y-4">
        <h2 className="text-lg font-semibold">Add New Product</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. iPhone 13"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (₦)</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 450,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock Quantity</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 5"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? 'Saving...' : 'Add Product'}
        </button>
      </form>

      {/* Product List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Current Inventory</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products found in database yet.</p>
        ) : (
          <ul className="divide-y">
            {products.map((product) => (
              <li key={product.id || product.name} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">Price: ₦{product.price}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Stock: {product.stock}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
