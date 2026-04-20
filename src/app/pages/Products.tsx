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
        <section className="relative overflow-hidden p-8 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(73,201,255,0.12),transparent_38%),radial-gradient(circle_at_88%_72%,rgba(49,209,122,0.1),transparent_42%)]" />
          <div className="relative">
            <p className="cinematic-eyebrow">Curated Shop • Chapter 04</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white/92 sm:text-5xl lg:text-6xl">
              Premium solar systems
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-white/60 leading-relaxed">
              Browse production-grade components with transparent specs,
              inventory visibility, and direct add-to-cart flow.
            </p>
          </div>
        </section>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="space-y-10 border-l border-white/10 pl-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-4">
                  Search
                </p>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find products..."
                  className="w-full border-b border-white/10 bg-transparent py-2 text-white/90 placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
                />
                {searching && (
                  <p className="mt-2 text-xs text-primary/60 italic">
                    Filtering for &quot;{searchQuery.trim()}&quot;
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-6">
                  Category
                </p>
                <div className="flex flex-col gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`text-left text-sm transition-all hover:pl-2 ${
                        selectedCategory === category
                          ? 'text-primary font-bold'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 text-[10px] uppercase tracking-[0.15em] text-white/30 font-bold">
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? '' : 's'} matches
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
                Catalog
              </p>
              <p className="text-xs text-white/30 font-medium">Prices in KES</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product, index) => {
                const displayImage =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';
                const displaySpecs = product.specifications || [];

                return (
                  <motion.article
                    key={product.id}
                    className="group animate-reveal"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/5 bg-white/5">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-md border border-white/10">
                          {categoryMap[product.category] || product.category}
                        </span>
                      </div>
                      
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                          <span className="rounded border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-300">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock_quantity === 0}
                          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-xl transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 px-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-bold text-white/90 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="text-lg font-bold text-white/92">
                          {product.price.toLocaleString()}
                        </div>
                      </div>
                      
                      <p className="mb-4 line-clamp-2 text-sm text-white/50 leading-relaxed">
                        {product.description || 'Premium solar equipment engineered for long-term reliability.'}
                      </p>

                      {displaySpecs.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {displaySpecs.slice(0, 2).map((spec, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] uppercase tracking-wider text-white/30 border border-white/10 px-2 py-0.5 rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/40 text-lg italic">
                  No products match your current selection.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
