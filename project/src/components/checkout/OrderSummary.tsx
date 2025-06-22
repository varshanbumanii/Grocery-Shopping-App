import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';

interface OrderSummaryProps {
  onCheckout: () => void;
  isProcessing?: boolean;
}

function OrderSummary({ onCheckout, isProcessing = false }: OrderSummaryProps) {
  const { items, subtotal } = useCart();
  const [tax, setTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const total = subtotal + tax + deliveryFee;

  useEffect(() => {
    // Calculate tax (for example 8%)
    setTax(subtotal * 0.08);
    
    // Calculate delivery fee
    setDeliveryFee(subtotal > 50 ? 0 : 5.99);
  }, [subtotal]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
      
      <div className="border-b border-gray-200 pb-4">
        <p className="flex justify-between text-gray-600 mb-2">
          <span>Items ({items.length})</span>
          <span>${subtotal.toFixed(2)}</span>
        </p>
        <p className="flex justify-between text-gray-600 mb-2">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </p>
        <p className="flex justify-between text-gray-600 mb-2">
          <span>Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span className="text-primary-500">Free</span>
          ) : (
            <span>${deliveryFee.toFixed(2)}</span>
          )}
        </p>
        
        {deliveryFee > 0 && (
          <p className="text-sm text-primary-600 mt-2">
            Add ${(50 - subtotal).toFixed(2)} more to get free delivery!
          </p>
        )}
      </div>
      
      <div className="pt-4 mb-6">
        <p className="flex justify-between font-bold text-lg text-gray-800">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </p>
      </div>
      
      <Button
        onClick={onCheckout}
        fullWidth
        isLoading={isProcessing}
        icon={<ShoppingBag className="h-5 w-5" />}
      >
        Place Order
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        By placing this order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

export default OrderSummary;