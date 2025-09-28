import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Award, Shield, Clock, Users, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'ISI certified materials and international quality standards'
    },
    {
      icon: Shield,
      title: 'Durable Construction',
      description: 'Built to withstand harsh conditions and last for decades'
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'On-time project completion with efficient project management'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Skilled craftsmen with years of steel fabrication experience'
    }
  ];

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
    },
    {
      name: 'Industrial Platforms',
      description: 'Heavy-duty platforms for industrial and commercial use.',
      image: '/photos/WhatsApp Image 2025-09-02 at 23.38.52_4a38bb6a.jpg',
      category: 'Industrial',
      price: '₹380/sq ft'
    }
  ];

  const stats = [
    { number: '72+', label: 'Projects Completed' },
    { number: '50+', label: 'Happy Clients' },
    { number: '15+', label: 'Years Experience' },
    { number: '8+', label: 'Cities Served' }
  ];

  return (
    <Layout>
      <Hero />
      
      {/* Why Choose Us */}
      <section className="py-20 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Excellence in Every Steel Structure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining traditional craftsmanship with modern technology to deliver 
              superior steel fabrication services across Maharashtra.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Products</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Steel Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular steel fabrication products, crafted with 
              precision and built to last.
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

      {/* Statistics */}
      <section className="py-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Numbers that speak for our commitment to excellence and client satisfaction.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.number}
                </h3>
                <p className="text-primary-foreground/80 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Steel Project?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get in touch with our expert team for a free consultation and competitive quote 
            for your steel fabrication needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="hero-gradient">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline">
              Call +91 9226133650
            </Button>
          </div>
        </div>
      </section>
      <ChatBot />
    </Layout>
  );
};

export default Index;