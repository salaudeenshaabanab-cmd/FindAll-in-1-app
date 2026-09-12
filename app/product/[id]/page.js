'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (replace with your actual keys or use your existing client config)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleShare = () => {
    const productUrl = window.location.href;
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) return <div className="p-8 text-center">Loading product...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 font-sans">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <img 
          src={product.image || 'https://via.placeholder.com/400'} 
          alt={product.title} 
          className="w-full h-72 object-cover"
        />
        <div className="p-6">
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
            {product.category}
          </span>
          <h1 className="text-2xl font-bold mt-2 text-gray-900">{product.title}</h1>
          <p className="text-xl font-semibold text-green-600 mt-2">₦{Number(product.price).toLocaleString()}</p>
          
          <div className="my-4 text-sm text-gray-600 space-y-1">
            <p><strong>Condition:</strong> {product.condition}</p>
            <p><strong>Location:</strong> {product.location}</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-gray-800">Description</h3>
            <p className="text-gray-600 mt-1 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-6 flex gap-4">
            <button 
              onClick={handleShare}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {copied ? 'Link Copied to Clipboard!' : 'Share / Copy Link'}
            </button>
            <a 
              href={`https://wa.me/?text=Check%20out%20this%20item:%20${encodeURIComponent(product.title)}%20for%20₦${product.price}%20-%20${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium text-center hover:bg-green-700 transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
