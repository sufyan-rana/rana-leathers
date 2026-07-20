'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, X, Check, Upload, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  original_price: number;
  category: string;
  in_stock: boolean;
  image_url: string;
  images: string[];
  slug: string;
  description: string;
  features: string[];
  sizes: string[];
  colors: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    description: '',
    features: '',
    sizes: '',
    colors: '',
    in_stock: true,
    image_url: '',
    images: [] as string[],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts();
        alert('✅ Product deleted successfully');
      } else {
        alert('❌ Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('❌ Something went wrong');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.original_price?.toString() || '',
      category: product.category || '',
      description: product.description || '',
      features: product.features?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      in_stock: product.in_stock !== false,
      image_url: '',
      images: product.images || [product.image_url || ''],
    });
    setImagePreview(product.images || [product.image_url || '']);
    setShowAddModal(true);
  };

  const handleImageUrlAdd = () => {
    if (formData.image_url && !formData.images.includes(formData.image_url)) {
      setFormData({
        ...formData,
        images: [...formData.images, formData.image_url],
      });
      setImagePreview([...imagePreview, formData.image_url]);
      setFormData({ ...formData, image_url: '' });
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreview(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        features: formData.features.split(',').map(s => s.trim()).filter(Boolean),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
        in_stock: formData.in_stock,
        images: formData.images.length > 0 ? formData.images : [formData.image_url || '/images/products/jacket.jpg'],
        image_url: formData.images.length > 0 ? formData.images[0] : (formData.image_url || '/images/products/jacket.jpg'),
      };

      let response;
      if (editingProduct) {
        response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingProduct.id }),
        });
      } else {
        response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        fetchProducts();
        setShowAddModal(false);
        resetForm();
        alert(editingProduct ? '✅ Product updated successfully' : '✅ Product added successfully');
      } else {
        alert('❌ Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      description: '',
      features: '',
      sizes: '',
      colors: '',
      in_stock: true,
      image_url: '',
      images: [],
    });
    setImagePreview([]);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#1A0F0A]">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-[#8B3A1A] text-white px-4 py-2 rounded-lg hover:bg-[#1A0F0A] transition flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Image</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={product.image_url || '/images/products/jacket.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 capitalize">{product.category}</td>
                    <td className="py-3 px-4 font-semibold">Rs. {product.price.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 hover:bg-blue-100 rounded transition"
                        >
                          <Edit size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif text-[#1A0F0A]">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-500 hover:text-[#1A0F0A]">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="jackets">Jackets</option>
                    <option value="bags">Bags</option>
                    <option value="belts">Belts</option>
                    <option value="wallets">Wallets</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    placeholder="e.g. Feature 1, Feature 2"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                    placeholder="e.g. S, M, L"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({...formData, colors: e.target.value})}
                    placeholder="e.g. Brown, Black"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="Enter image URL"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleImageUrlAdd}
                    className="bg-[#8B3A1A] text-white px-4 py-2 rounded-lg hover:bg-[#1A0F0A] transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {imagePreview.map((img, index) => (
                      <div key={index} className="relative w-20 h-20 border rounded-lg overflow-hidden group">
                        <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Add image URLs for product photos. First image will be the main image.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#8B3A1A] text-white px-6 py-2 rounded-lg hover:bg-[#1A0F0A] transition disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}