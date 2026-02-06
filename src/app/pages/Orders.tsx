import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
}

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-secondary text-primary';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background/90 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-9 w-40 bg-secondary/60 rounded-md animate-pulse" />
            <div className="h-4 w-64 bg-secondary/60 rounded-md mt-3 animate-pulse" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-secondary/60 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-secondary/60 rounded" />
                      <div className="h-3 w-32 bg-secondary/60 rounded" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 w-24 bg-secondary/60 rounded ml-auto" />
                    <div className="h-6 w-20 bg-secondary/60 rounded-full ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your solar equipment orders
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Orders Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t placed any orders yet. Start shopping for solar
              solutions!
            </p>
            <a
              href="/products"
              className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on{' '}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      KES {order.total_amount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
