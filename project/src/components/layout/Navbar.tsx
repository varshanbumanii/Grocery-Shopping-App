import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useCart } from '../../contexts/CartContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-primary-500" />
            <span className="ml-2 text-xl font-bold text-gray-800">Fresh Market</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link to="/?category=fruits" className="text-gray-700 hover:text-primary-500 transition-colors">
              Fruits
            </Link>
            <Link to="/?category=vegetables" className="text-gray-700 hover:text-primary-500 transition-colors">
              Vegetables
            </Link>
            <Link to="/?category=dairy" className="text-gray-700 hover:text-primary-500 transition-colors">
              Dairy
            </Link>
          </nav>

          {/* Search, Cart, and User - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white border border-gray-200 focus:border-primary-300 outline-none transition-colors"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-primary-500 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-subtle">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-primary-500" />
                    )}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="p-2">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 pt-2 pb-4 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-200 outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
              
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/?category=fruits" 
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fruits
                </Link>
                <Link 
                  to="/?category=vegetables" 
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vegetables
                </Link>
                <Link 
                  to="/?category=dairy" 
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dairy
                </Link>
              </nav>
              
              {user ? (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <Link 
                    to="/profile" 
                    className="flex items-center text-gray-700 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="h-5 w-5 mr-2" /> Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="flex items-center text-gray-700 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" /> Orders
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-100">
                  <Link 
                    to="/login" 
                    className="inline-block px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;