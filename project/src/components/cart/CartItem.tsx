import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { motion } from 'framer-motion';

interface CartItemProps {
  item: CartItemType;
}

function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  // Calculate discounted price if applicable
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;

  const itemTotal = discountedPrice * quantity;

  const incrementQuantity = () => {
    updateQuantity(product._id, quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product._id, quantity - 1);
    } else {
      removeFromCart(product._id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product._id);
  };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-shrink-0 mr-4 mb-3 sm:mb-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-20 w-20 object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.unit}</p>
        
        {product.discount ? (
          <div className="mt-1 flex items-center">
            <span className="text-base font-bold text-gray-800">${discountedPrice.toFixed(2)}</span>
            <span className="ml-2 text-xs text-gray-500 line-through">${product.price.toFixed(2)}</span>
            <span className="ml-2 text-xs bg-accent-500 text-white px-2 py-0.5 rounded-full">
              {product.discount}% OFF
            </span>
          </div>
        ) : (
          <p className="mt-1 text-base font-bold text-gray-800">${product.price.toFixed(2)}</p>
        )}
      </div>
      
      <div className="flex items-center mt-3 sm:mt-0">
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
          <button 
            onClick={decrementQuantity}
            className="p-1 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>
          
          <span className="px-3 text-gray-800">{quantity}</span>
          
          <button 
            onClick={incrementQuantity}
            className="p-1 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 sm:mt-0 sm:ml-6">
        <p className="text-lg font-bold text-gray-800">${itemTotal.toFixed(2)}</p>
        
        <button 
          onClick={handleRemove}
          className="ml-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export default CartItem;