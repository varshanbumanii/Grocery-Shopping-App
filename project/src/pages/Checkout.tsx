import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import CartItem from '../components/cart/CartItem';
import AddressForm from '../components/checkout/AddressForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { createOrder } from '../services/orderService';
import { Address } from '../types';

function Checkout() {
  const { user } = useUser();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address | null>(null);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().address) {
          setAddress(userDoc.data().address);
        } else {
          setIsAddressFormVisible(true);
        }
      } catch (err) {
        console.error('Error fetching user address:', err);
        setIsAddressFormVisible(true);
      }
    };
    
    fetchUserAddress();
  }, [user]);

  const handleAddressSubmit = async (data: Address) => {
    setAddress(data);
    setIsAddressFormVisible(false);
    
    if (user) {
      try {
        await setDoc(
          doc(db, 'users', user.uid), 
          { address: data }, 
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving address:', err);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !address) return;
    
    setIsProcessingOrder(true);
    setError(null);
    
    try {
      // Calculate order values
      const tax = subtotal * 0.08;
      const deliveryFee = subtotal > 50 ? 0 : 5.99;
      const total = subtotal + tax + deliveryFee;
      
      // Create the order
      await createOrder({
        userId: user.uid,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        deliveryAddress: address,
        paymentMethod: 'cash_on_delivery'
      });
      
      // Clear the cart and navigate to a success page
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Error creating order:', err);
      setError('There was a problem placing your order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Details */}
        <div className="lg:col-span-2">
          {/* Delivery Address */}
          <motion.section
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
              {address && !isAddressFormVisible && (
                <button 
                  onClick={() => setIsAddressFormVisible(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            
            {isAddressFormVisible ? (
              <AddressForm 
                defaultAddress={address || undefined} 
                onSubmit={handleAddressSubmit} 
              />
            ) : address ? (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800">
                  {address.street}<br />
                  {address.city}, {address.state} {address.zipCode}<br />
                  {address.country}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Please add a delivery address.</p>
            )}
          </motion.section>
          
          {/* Payment Method */}
          <motion.section
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="bg-gray-50 p-4 rounded-md flex items-center">
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                checked={true}
                readOnly
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="cash" className="ml-3 text-gray-800">Cash on Delivery</label>
            </div>
          </motion.section>
          
          {/* Order Items */}
          <motion.section
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </div>
          </motion.section>
        </div>
        
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:sticky lg:top-24"
        >
          <OrderSummary 
            onCheckout={handlePlaceOrder} 
            isProcessing={isProcessingOrder} 
          />
          
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;