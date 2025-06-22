import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';

function Cart() {
  const { items, subtotal, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Calculate delivery fee and total
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
          >
            Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Your Shopping Cart</h1>
        <button 
          onClick={handleClearCart}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          disabled={isClearing}
        >
          Clear Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6 sticky top-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="text-gray-800">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-primary-500">Free</span>
                ) : (
                  <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              
              {deliveryFee > 0 && (
                <p className="text-sm text-primary-600 mt-2">
                  Add ${(50 - subtotal).toFixed(2)} more to get free delivery!
                </p>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-gray-800">${total.toFixed(2)}</span>
            </div>
            
            <Button
              onClick={handleCheckout}
              fullWidth
              icon={<ArrowRight className="h-5 w-5" />}
            >
              Proceed to Checkout
            </Button>
            
            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Cart;