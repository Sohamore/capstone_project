import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';
import ChatBot from '@/components/ChatBot';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const featuredProducts = [
    {
      name: 'Structural Steel Beams',
      description: 'Heavy-duty steel beams for construction and infrastructure projects.',
      image: '/photos/steel beems.jpg',
      category: 'Structural',
      price: '₹450/kg'
    },
    {
      name: 'Custom Steel Gates',
      description: 'Elegant security gates designed to your specifications.',
      image: '/photos/WhatsApp Image 2025-09-02 at 23.30.03_083a883e.jpg',
      category: 'Custom',
      price: 'Quote on Request'
    }
  ];

  return (
    <Layout>
      <Hero />

      {/* Greeting Section */}
      {user && (
        <section className="py-6 text-center bg-blue-50 rounded-lg mx-4 md:mx-0 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            Hello, {user.displayName}!
          </h2>
          <p className="text-muted-foreground mt-2">
            Welcome back to your steel fabrication portal.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => navigate('/address')}
          >
            Proceed
          </button>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Products</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Steel Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular steel products, crafted with precision and built to last.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                description={product.description}
                image={product.image}
                category={product.category}
                price={product.price}
              />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="group">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <ChatBot />
    </Layout>
  );
};

export default Index;
