import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, Phone, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="/photos/logo.jpg" 
                alt="Shri krishna steel works Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-primary">Shri krishna steel works</h1>
              <p className="text-xs text-steel-accent">Premium Steel Fabrication</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary relative group ${
                  isActive(item.href) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Search & Contact */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Button>
            <Button variant="default" size="sm" className="hero-gradient">
              <Phone className="h-4 w-4 mr-2" />
              +91 9226133650
            </Button>
            {/* Client Portal Login/Logout button placed beside the phone number */}
            {user ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                className="hero-gradient"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-base font-medium transition-all duration-300 hover:text-primary relative group ${
                  isActive(item.href) ? 'text-primary bg-secondary' : 'text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
                <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]"></span>
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-2">
              <Button variant="default" size="sm" className="hero-gradient w-full">
                <Phone className="h-4 w-4 mr-2" />
                +91 9226133650
              </Button>
              {user ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button size="sm" className="hero-gradient w-full" onClick={() => navigate('/auth')}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;