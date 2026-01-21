import { useState } from 'react';
import { products } from '@/app/data/products';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from 'sonner';

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Product added to cart!');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium solar energy solutions backed by cutting-edge technology and industry-leading warranties
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-4 flex-wrap justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {product.specs.slice(0, 3).map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">${product.price}</div>
                    <div className="text-sm text-gray-500">per unit</div>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
