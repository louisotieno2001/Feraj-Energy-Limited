import { useState, useEffect } from 'react';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from '@/services/products.service';
import {
  ProductForm,
  type ProductFormData,
} from '@/app/components/admin/ProductForm';
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createAuditLog } from '@/services/audit.service';

export function AdminProducts() {
  const { user, profile, permissions } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description?.toLowerCase() || '').includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((product) =>
        statusFilter === 'active' ? product.is_active : !product.is_active
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      // Transform specifications from Record to array of strings
      const specifications = Object.entries(data.specifications).map(
        ([key, value]) => `${key}: ${value}`
      );

      const newProduct = await createProduct({
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock_quantity: data.stock_quantity,
        specifications,
        images: data.images,
      });
      setProducts((prev) => [newProduct, ...prev]);
      setShowForm(false);
      toast.success('Product created successfully');

      if (user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          action: 'product.create',
          metadata: { product_id: newProduct.id, name: newProduct.name },
        });
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      throw error;
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    try {
      // Transform specifications from Record to array of strings
      const specifications = Object.entries(data.specifications).map(
        ([key, value]) => `${key}: ${value}`
      );

      const updated = await updateProduct(editingProduct.id, {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock_quantity: data.stock_quantity,
        specifications,
        images: data.images,
        is_active: data.is_active,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updated : p))
      );
      setShowForm(false);
      setEditingProduct(null);
      toast.success('Product updated successfully');

      if (user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          action: 'product.update',
          metadata: { product_id: updated.id, name: updated.name },
        });
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingId) return;

    try {
      await deleteProduct(deletingId);
      setProducts((prev) => prev.filter((p) => p.id !== deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
      toast.success('Product deleted successfully');

      if (user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          action: 'product.delete',
          metadata: { product_id: deletingId },
        });
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openDeleteModal = (productId: string) => {
    setDeletingId(productId);
    setShowDeleteModal(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'panels':
        return 'bg-blue-100 text-blue-800';
      case 'inverters':
        return 'bg-purple-100 text-purple-800';
      case 'batteries':
        return 'bg-orange-100 text-orange-800';
      case 'accessories':
        return 'bg-secondary text-primary';
      default:
        return 'bg-gray-100 text-foreground';
    }
  };

  const canManageProducts =
    profile?.role === 'admin' ||
    profile?.role === 'co_admin' ||
    (profile?.role === 'employee' && permissions?.can_manage_products);

  if (!canManageProducts) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Product Management
        </h1>
        <p className="text-muted-foreground">
          You do not have permission to manage products. Contact an admin to
          request access.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Product Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, and manage your products
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-bold text-foreground">
            {products.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-primary">
            {products.filter((p) => p.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {products.filter((p) => p.stock_quantity === 0).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Low Stock (&lt;10)</div>
          <div className="text-2xl font-bold text-orange-600">
            {
              products.filter(
                (p) => p.stock_quantity > 0 && p.stock_quantity < 10
              ).length
            }
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="panels">Solar Panels</option>
            <option value="inverters">Inverters</option>
            <option value="batteries">Batteries</option>
            <option value="accessories">Accessories</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background/90">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/70">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <img
                          src={
                            product.images?.[0] ||
                            'https://via.placeholder.com/100'
                          }
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {product.name}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description?.substring(0, 50) ||
                            'No description'}
                          ...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(
                        product.category
                      )}`}
                    >
                      {product.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    KES {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        product.stock_quantity === 0
                          ? 'text-red-600'
                          : product.stock_quantity < 10
                            ? 'text-orange-600'
                            : 'text-primary'
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        product.is_active
                          ? 'bg-secondary text-primary'
                          : 'bg-gray-100 text-foreground'
                      }`}
                    >
                      {product.is_active ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditForm(product)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={closeForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Delete Product
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="flex-1 px-4 py-2 rounded-md btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
