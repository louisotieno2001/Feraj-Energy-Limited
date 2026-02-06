import { useState, useEffect } from 'react';
import { getUserStats } from '@/services/users.service';
import { getProducts, type Product } from '@/services/products.service';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  recentUsers: number;
  totalRevenue: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    recentUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [userStats, products] = await Promise.all([
        getUserStats(),
        getProducts(),
      ]);

      // Calculate product stats
      const activeProducts = products.filter(
        (p: Product) => p.is_active
      ).length;
      const outOfStockProducts = products.filter(
        (p: Product) => p.stock_quantity === 0
      ).length;
      const lowStockProducts = products.filter(
        (p: Product) => p.stock_quantity > 0 && p.stock_quantity < 10
      ).length;

      // Calculate revenue (placeholder - will be implemented when order creation is added)
      const totalRevenue = 0;

      setStats({
        totalUsers: userStats.totalUsers,
        totalProducts: products.length,
        totalOrders: 0, // Will be implemented when order creation is added
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        recentUsers: userStats.recentUsers.length,
        totalRevenue,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your platform&apos;s key metrics
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalUsers}
              </p>
              {stats.recentUsers > 0 && (
                <p className="text-sm text-primary mt-2">
                  +{stats.recentUsers} this month
                </p>
              )}
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Link>

        {/* Total Products */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Products</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalProducts}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.activeProducts} active
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Link>

        {/* Total Orders */}
        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalOrders}
              </p>
              <p className="text-sm text-muted-foreground mt-2">All time</p>
            </div>
            <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Link>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground">
                KES {stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">All time</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Out of Stock */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outOfStockProducts}
              </p>
              <p className="text-xs text-muted-foreground mt-1">products</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Link>

        {/* Low Stock */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-orange-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.lowStockProducts}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                products (&lt;10 units)
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Link>

        {/* Active Products */}
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Products</p>
              <p className="text-2xl font-bold text-primary">
                {stats.activeProducts}
              </p>
              <p className="text-xs text-muted-foreground mt-1">visible to customers</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="flex items-center gap-3 p-4 border-2 border-border rounded-lg hover:border-primary transition"
          >
            <Package className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-foreground">Add New Product</p>
              <p className="text-sm text-muted-foreground">
                Create a new product listing
              </p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 p-4 border-2 border-border rounded-lg hover:border-primary transition"
          >
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-foreground">Manage Users</p>
              <p className="text-sm text-muted-foreground">
                View and update user roles
              </p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-4 border-2 border-border rounded-lg hover:border-primary transition"
          >
            <ShoppingCart className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-foreground">View Orders</p>
              <p className="text-sm text-muted-foreground">Monitor customer orders</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Alerts Section */}
      {(stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">
                Inventory Alerts
              </h3>
              <ul className="space-y-1 text-sm text-orange-800">
                {stats.outOfStockProducts > 0 && (
                  <li>
                    • {stats.outOfStockProducts} product(s) are out of stock
                  </li>
                )}
                {stats.lowStockProducts > 0 && (
                  <li>
                    • {stats.lowStockProducts} product(s) have low stock (&lt;10
                    units)
                  </li>
                )}
              </ul>
              <Link
                to="/admin/products"
                className="inline-block mt-3 text-sm font-medium text-orange-900 underline hover:text-orange-700"
              >
                Manage Inventory →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
