import { useState, useEffect } from 'react';
import { PackageCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Order } from '../types';
import { getUserOrders } from '../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';

function Orders() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getStatusBadgeClasses = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">My Orders</h1>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <PackageCheck className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to place your first order!
          </p>
          <a 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
          >
            Browse Products
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div 
            key={order._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Order Header */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleOrderExpand(order._id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 text-sm">Order #{order._id.slice(-8)}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800 mr-3">${order.total.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  {expandedOrderId === order._id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Details */}
            <AnimatePresence>
              {expandedOrderId === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="flex items-center">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="h-12 w-12 object-cover rounded-md mr-3"
                              />
                              <div>
                                <p className="text-gray-800 font-medium">{item.product.name}</p>
                                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-gray-800 font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Delivery Address */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
                        <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm">
                          <p>{order.deliveryAddress.street}</p>
                          <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                          <p>{order.deliveryAddress.country}</p>
                        </div>
                      </div>
                      
                      {/* Order Details */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Order Details</h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-800">${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-gray-800">${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Delivery Fee</span>
                            {order.deliveryFee === 0 ? (
                              <span className="text-primary-500">Free</span>
                            ) : (
                              <span className="text-gray-800">${order.deliveryFee.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
                            <span className="text-gray-700">Total</span>
                            <span className="text-gray-800">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Orders;