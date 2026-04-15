import { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getProducts, searchProducts } from '@/services/products.service';
import type { Product } from '@/services/products.service';
import { motion } from 'motion/react';

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
    let cancelled = false;
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
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err: any) {
        console.error('❌ Error fetching products:', err);
        console.error('Error details:', err.message, err.code, err.details);
        if (!cancelled) {
          setError(err.message || 'Failed to load products');
          toast.error('Failed to load products');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log('🏁 Loading complete');
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
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
    window.dispatchEvent(new Event('cart:updated'));
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 text-white/85">
        <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 h-4 w-48 rounded bg-white/12 animate-pulse" />
            <div className="h-12 w-72 rounded bg-white/12 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="cinematic-panel overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-white/10" />
                <div className="p-6 space-y-4">
                  <div className="h-5 w-3/5 bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/10 rounded" />
                  <div className="h-10 w-32 bg-white/10 rounded" />
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="cinematic-panel-strong text-center max-w-md p-8">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white/90 mb-2">
            Failed to Load Products
          </h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 text-white/85 lg:py-14">
      <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(130deg,rgba(12,14,20,0.95),rgba(10,12,16,0.82))] p-8 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(73,201,255,0.2),transparent_38%),radial-gradient(circle_at_88%_72%,rgba(49,209,122,0.16),transparent_42%)]" />
          <div className="relative">
            <p className="cinematic-eyebrow">Curated Shop • Chapter 04</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white/90 sm:text-5xl">
              Premium solar systems, curated for performance and reliability
            </h1>
            <p className="mt-5 max-w-2xl text-white/65">
              Browse production-grade components with transparent specs,
              inventory visibility, and direct add-to-cart flow.
            </p>
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="cinematic-panel p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                Filters
              </p>
              <div className="mt-4 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white/85 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                />
                {searching && (
                  <p className="mt-2 text-sm text-white/60">
                    Showing results for &quot;{searchQuery.trim()}&quot;
                  </p>
                )}
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/45">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-white/10 bg-white/5 text-white/75 hover:bg-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-sm text-white/55">
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? '' : 's'} available
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.14em] text-white/45">
                Catalog
              </p>
              <p className="text-sm text-white/60">Prices in KES</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => {
                const displayImage =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';
                const displaySpecs = product.specifications || [];

                return (
                  <motion.article
                    key={product.id}
                    className="group cinematic-panel overflow-hidden"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: (index % 6) * 0.04 }}
                  >
                    <div className="relative h-60 overflow-hidden border-b border-white/10">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(8,8,12,0.78)_100%)]" />
                      <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-[#0f1219]/80 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                        {categoryMap[product.category] || product.category}
                      </div>
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <span className="rounded-md border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-white/90 mb-2">
                        {product.name}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-white/60">
                        {product.description || 'Premium solar equipment'}
                      </p>

                      {displaySpecs.length > 0 && (
                        <div className="mb-4">
                          <h4 className="mb-2 text-xs uppercase tracking-[0.12em] text-white/45">
                            Key Features
                          </h4>
                          <ul className="space-y-1.5">
                            {displaySpecs.slice(0, 3).map((spec, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-sm text-white/60"
                              >
                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div>
                          <div className="text-2xl font-semibold text-white/90">
                            KES {product.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-white/55">
                            {product.stock_quantity > 0
                              ? `${product.stock_quantity} in stock`
                              : 'Out of stock'}
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock_quantity === 0}
                          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                            product.stock_quantity === 0
                              ? 'cursor-not-allowed border border-white/10 bg-white/10 text-white/45'
                              : 'border border-primary/35 bg-primary/90 text-primary-foreground hover:bg-primary'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="cinematic-panel mt-8 p-8 text-center">
                <p className="text-white/65 text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
