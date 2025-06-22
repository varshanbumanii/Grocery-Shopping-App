import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  ChevronLeft, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Minus, 
  Plus 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { getProductById } from '../services/productService';

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'Product not found'}</p>
        <button 
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Calculate discounted price if applicable
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={handleGoBack}
        className="flex items-center text-gray-600 hover:text-primary-500 transition-colors mb-8"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-sm" 
          />
          
          {product.discount && (
            <div className="absolute top-4 left-4 bg-accent-500 text-white text-sm px-3 py-1 rounded-full">
              {product.discount}% OFF
            </div>
          )}
          
          {product.organic && (
            <div className="absolute top-4 right-4 bg-primary-500 text-white text-sm px-3 py-1 rounded-full">
              Organic
            </div>
          )}
          
          <button 
            className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Add to favorites"
          >
            <Heart className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </motion.div>
        
        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <p className="text-gray-500 mb-4">{product.unit}</p>
          
          <div className="flex items-baseline mb-6">
            {discountedPrice ? (
              <>
                <span className="text-2xl font-bold text-gray-800">${discountedPrice.toFixed(2)}</span>
                <span className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button 
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
                
                <span className="px-4 text-gray-800">{quantity}</span>
                
                <button 
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <p className="ml-4 text-sm text-gray-500">
                {product.stock > 10 ? (
                  <span className="text-primary-600">In Stock</span>
                ) : product.stock > 0 ? (
                  <span className="text-orange-500">Only {product.stock} left</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </p>
            </div>
            
            <Button
              onClick={handleAddToCart}
              fullWidth
              icon={<ShoppingCart className="h-5 w-5" />}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-700">Free Delivery</h3>
                <p className="text-sm text-gray-500">Free shipping on orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-700">Quality Guarantee</h3>
                <p className="text-sm text-gray-500">Fresh products guaranteed</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <RefreshCw className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-700">Easy Returns</h3>
                <p className="text-sm text-gray-500">30-day hassle-free returns</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetail;