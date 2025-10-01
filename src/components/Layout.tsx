import React from 'react';
import Navbar from './Navbar';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="text-gray-300 py-12 bg-footer-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Column 1: Logo & Description */}
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-4">Shri krishna steel works</h3>
              <p className="text-sm">
                Crafting excellence in steel fabrication. From structural beams to custom gates, 
                we deliver durable and reliable solutions for your project needs.
              </p>
            </div>
            
            {/* Column 2: Contact Info */}
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Pune-Banglor Highway, 
                Near Hotel Annapurna, 
                Gote ,Tal.Karad , Dist. Satara</li>
                <li>Email: shrikrishnasteel0809@gmail.com</li>
                <li>Phone: +91 9226133650</li>
              </ul>
            </div>
            
            {/* Column 3: Quick Links */}
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-white transition-colors duration-200">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="/products" className="hover:text-white transition-colors duration-200">Products</a></li>
                <li><a href="/projects" className="hover:text-white transition-colors duration-200">Projects</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
              </ul>
            </div>
            
            {/* Column 4: Social Media */}
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="hover:text-white transition-colors duration-200"><Facebook size={24} /></a>
                <a href="#" aria-label="Twitter" className="hover:text-white transition-colors duration-200"><Twitter size={24} /></a>
                <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors duration-200"><Linkedin size={24} /></a>
                <a href="#" aria-label="Instagram" className="hover:text-white transition-colors duration-200"><Instagram size={24} /></a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Shri krishna steel works. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
