import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'structural', label: 'Structural Steel' },
    { value: 'custom', label: 'Custom Fabrication' },
    { value: 'industrial', label: 'Industrial Components' },
    { value: 'residential', label: 'Residential Steel' }
  ];

  const products = [
    {
      name: 'Steel Beams & Columns',
      description: 'High-strength structural steel beams and columns for construction projects.',
      image: '/photos/steel beems.jpg',
      category: 'structural',
      price: '₹450/kg'
    },
    {
      name: 'Custom Gate Designs',
      description: 'Elegant and secure custom-designed gates for residential and commercial use.',
      image: '/photos/WhatsApp Image 2025-09-02 at 23.30.03_083a883e.jpg',
      category: 'custom',
      price: 'Quote on Request'
    },
    {
      name: 'Industrial Platforms',
      description: 'Heavy-duty steel platforms and walkways for industrial applications.',
      image: '/photos/ss-platform-trolly.png',
      category: 'industrial',
      price: '₹380/sq ft'
    },
    {
      name: 'Staircase Railings',
      description: 'Modern and traditional steel railings for staircases and balconies.',
      image: '/photos/stair chase.jpg',
      category: 'residential',
      price: '₹2,500/meter'
    },
    {
      name: 'Steel Trusses',
      description: 'Pre-engineered steel trusses for roofing and structural support.',
      image: '/photos/trussst.jpg',
      category: 'structural',
      price: '₹520/kg'
    },
    {
      name: 'Workshop Equipment',
      description: 'Custom steel equipment and fixtures for workshops and factories.',
      image: '/photos/equiments.jpg',
      category: 'industrial',
      price: 'Quote on Request'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/20">
            Our Products
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Premium Steel Products
            <br />
            <span className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">For Every Need</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Discover our comprehensive range of high-quality steel products, 
            crafted with precision and built to last.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} products found
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
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
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria.</p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="py-20 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Need Something Custom?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Can't find exactly what you're looking for? We specialize in custom steel fabrication 
            tailored to your specific requirements.
          </p>
          <Button 
            size="lg" 
            className="hero-gradient"
            onClick={() => navigate('/contact')}
          >
            Request Custom Quote
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Products;