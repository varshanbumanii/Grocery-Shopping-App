import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, ShoppingBag } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">Fresh Market</span>
            </div>
            <p className="text-gray-600 mb-4">
              Your one-stop shop for fresh groceries, delivered right to your doorstep.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Facebook />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Twitter />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Instagram />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=fruits" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Fruits
                </Link>
              </li>
              <li>
                <Link to="/?category=vegetables" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link to="/?category=dairy" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Dairy
                </Link>
              </li>
              <li>
                <Link to="/?category=bakery" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Bakery
                </Link>
              </li>
              <li>
                <Link to="/?category=meat" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Meat & Seafood
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary-500 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>1234 Market Street</li>
              <li>San Francisco, CA 94103</li>
              <li>contact@freshmarket.com</li>
              <li>(555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Fresh Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;