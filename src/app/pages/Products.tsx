import { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getProducts, searchProducts } from '@/services/products.service';
import type { Product } from '@/services/products.service';

// Category mapping from database values to display names
const categoryMap: Record<string, string> = {
  panels: 'Solar Panels',
  inverters: 'Inverters',
  batteries: 'Battery Storage',
  accessories: 'Accessories',
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const query = searchQuery.trim();
    setSearching(!!query);

    const timeout = setTimeout(async () => {
      try {
        console.log('🔄 Fetching products from Supabase...');
        setLoading(true);
        setError(null);
        const data = query ? await searchProducts(query) : await getProducts();
        console.log('✅ Products fetched:', data.length, 'products');
        console.log('Products data:', data);
        setProducts(data);
      } catch (err: any) {
        console.error('❌ Error fetching products:', err);
        console.error('Error details:', err.message, err.code, err.details);
        setError(err.message || 'Failed to load products');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
        console.log('🏁 Loading complete');
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const categories = [
    'All',
    ...Array.from(
      new Set(products.map((p) => categoryMap[p.category] || p.category))
    ),
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (p) => (categoryMap[p.category] || p.category) === selectedCategory
        );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background/90 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="h-10 w-56 bg-secondary/60 rounded-md mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-96 bg-secondary/60 rounded-md mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-secondary/60" />
                <div className="p-6 space-y-4">
                  <div className="h-5 w-3/5 bg-secondary/60 rounded" />
                  <div className="h-4 w-full bg-secondary/60 rounded" />
                  <div className="h-4 w-5/6 bg-secondary/60 rounded" />
                  <div className="h-10 w-32 bg-secondary/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background/90 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Failed to Load Products
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium solar energy solutions backed by cutting-edge technology and
            industry-leading warranties
          </p>
        </div>

        {/* Search + Category Filter */}
        <div className="mb-8 flex flex-col gap-4 items-center">
          <div className="w-full max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or description..."
              className="w-full px-4 py-3 border border-border rounded-md bg-white text-foreground/80 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searching && (
              <p className="mt-2 text-sm text-muted-foreground">
                Showing results for &quot;{searchQuery.trim()}&quot;
              </p>
            )}
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-foreground/80 hover:bg-secondary/70'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const displayImage =
              product.images && product.images.length > 0
                ? product.images[0]
                : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';
            const displaySpecs = product.specifications || [];

            return (
              <div
                key={product.id}
                className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {categoryMap[product.category] || product.category}
                  </div>
                  {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {product.description || 'Premium solar equipment'}
                  </p>

                  {displaySpecs.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-foreground/80 mb-2">
                        Key Features:
                      </h4>
                      <ul className="space-y-1">
                        {displaySpecs.slice(0, 3).map((spec, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        KES {product.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.stock_quantity > 0
                          ? `${product.stock_quantity} in stock`
                          : 'Out of stock'}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock_quantity === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                        product.stock_quantity === 0
                          ? 'bg-gray-300 text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
