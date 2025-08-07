import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, MapPin, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      navigate('/auth');
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-amber-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Kigali, Rwanda</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>+250 788 123 456</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>info@icungoceramics.rw</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IC</span>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">Icungo Ceramics</h1>
                <p className="text-sm text-amber-600">Rwanda's Premium Ceramics</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">About</a>
              <a href="#products" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Products</a>
              <a href="#services" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Contact</a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {profile?.full_name}</span>
                  <button
                    onClick={handleDashboard}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleAuthAction}
                    className="text-gray-700 hover:text-amber-600 font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-amber-600 font-medium">Home</a>
                <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium">About</a>
                <a href="#products" className="text-gray-700 hover:text-amber-600 font-medium">Products</a>
                <a href="#services" className="text-gray-700 hover:text-amber-600 font-medium">Services</a>
                <a href="#contact" className="text-gray-700 hover:text-amber-600 font-medium">Contact</a>
                {user ? (
                  <>
                    <button
                      onClick={handleDashboard}
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors w-full"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleAuthAction}
                      className="text-gray-700 hover:text-amber-600 font-medium w-full text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAuthAction}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors w-full"
                  >
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;