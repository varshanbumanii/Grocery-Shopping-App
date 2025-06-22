import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/product/ProductGrid';
import { Category } from '../types';

const categories: { id: Category; name: string; image: string }[] = [
  { id: 'fruits', name: 'Fruits', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'vegetables', name: 'Vegetables', image: 'https://images.pexels.com/photos/2820144/pexels-photo-2820144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'dairy', name: 'Dairy', image: 'https://images.pexels.com/photos/4890687/pexels-photo-4890687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'bakery', name: 'Bakery', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'meat', name: 'Meat & Seafood', image: 'https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

function Home() {
  const [searchParams] = useSearchParams();
  const [pageTitle, setPageTitle] = useState('All Products');
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    if (search) {
      setPageTitle(`Search Results: "${search}"`);
      return;
    }
    
    if (category) {
      const categoryData = categories.find(c => c.id === category);
      if (categoryData) {
        setPageTitle(categoryData.name);
        return;
      }
    }
    
    setPageTitle('All Products');
  }, [category, search]);

  return (
    <div>
      {/* Hero Banner - only show on homepage */}
      {!category && !search && (
        <motion.div 
          className="relative bg-gradient-to-r from-primary-600 to-primary-400 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Fresh Groceries, Delivered to You
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl opacity-90 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Shop from a wide variety of fresh, high-quality products with fast delivery.
              </motion.p>
              <motion.a 
                href="#products"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now <ChevronRight className="ml-2 h-5 w-5" />
              </motion.a>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 hidden md:block">
            <ShoppingBag className="h-64 w-64" />
          </div>
        </motion.div>
      )}

      {/* Categories Grid - only show on homepage */}
      {!category && !search && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <motion.a 
                key={category.id}
                href={`?category=${category.id}`}
                className="relative rounded-lg overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all z-10"></div>
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-32 object-cover transition-transform group-hover:scale-110 duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-white font-medium text-lg">{category.name}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}
      
      {/* Products Section */}
      <div className="container mx-auto px-4 pt-8 pb-16" id="products">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">{pageTitle}</h2>
        <ProductGrid />
      </div>
    </div>
  );
}

export default Home;