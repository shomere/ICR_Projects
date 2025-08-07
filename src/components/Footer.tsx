import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Icungo Ceramics</h3>
                <p className="text-sm text-gray-400">Rwanda's Premium Ceramics</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Transforming Rwanda's rich clay heritage into world-class ceramic products while 
              creating jobs and boosting our national economy.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <nav className="space-y-3">
              <a href="#home" className="block text-gray-300 hover:text-amber-400 transition-colors">Home</a>
              <a href="#about" className="block text-gray-300 hover:text-amber-400 transition-colors">About Us</a>
              <a href="#products" className="block text-gray-300 hover:text-amber-400 transition-colors">Products</a>
              <a href="#services" className="block text-gray-300 hover:text-amber-400 transition-colors">Services</a>
              <a href="#contact" className="block text-gray-300 hover:text-amber-400 transition-colors">Contact</a>
            </nav>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Products</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-gray-300 hover:text-amber-400 transition-colors">Floor Tiles</a>
              <a href="#" className="block text-gray-300 hover:text-amber-400 transition-colors">Ceramic Mugs</a>
              <a href="#" className="block text-gray-300 hover:text-amber-400 transition-colors">Dinnerware</a>
              <a href="#" className="block text-gray-300 hover:text-amber-400 transition-colors">Sanitary Wares</a>
              <a href="#" className="block text-gray-300 hover:text-amber-400 transition-colors">Decorative Items</a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Kigali Industrial Park</p>
                  <p>Gasabo District, Kigali</p>
                  <p>Rwanda</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">+250 788 123 456</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">info@icungoceramics.rw</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Icungo Ceramics Rwanda. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;