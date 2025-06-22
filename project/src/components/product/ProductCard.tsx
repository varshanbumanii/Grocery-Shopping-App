import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Calculate discounted price if applicable
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : null;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover" 
          />
          
          {product.discount && (
            <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
              {product.discount}% OFF
            </div>
          )}
          
          {product.organic && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              Organic
            </div>
          )}
          
          <button 
            className="absolute right-2 bottom-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Add to favorites"
          >
            <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-1">{product.name}</h3>
          
          <p className="text-sm text-gray-500 mb-2">
            {product.unit}
          </p>
          
          <div className="flex items-baseline mb-4">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-gray-800">${discountedPrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            fullWidth
            icon={<ShoppingCart className="h-4 w-4" />}
          >
            Add to Cart
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;