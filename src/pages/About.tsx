import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Users, Target, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'Uncompromising quality in every steel structure we create.'
    },
    {
      icon: Users,
      title: 'Client Satisfaction',
      description: 'Building lasting relationships through exceptional service.'
    },
    {
      icon: Target,
      title: 'Precision Engineering',
      description: 'Meticulous attention to detail in every project.'
    },
    {
      icon: Heart,
      title: 'Passionate Craftsmanship',
      description: 'Driven by passion for creating lasting steel structures.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mr-4">
              <img 
                src="/photos/logo.jpg" 
                alt="Shri krishna steel works Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-primary-foreground/20">
              About Shri krishna steel works
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Crafting Steel Excellence
            <br />
            <span className="text-white">Since Decades</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            From humble beginnings to becoming Maharashtra's trusted steel fabrication partner, 
            our journey is built on quality, integrity, and innovation.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Shri krishna steel works was founded with a vision to provide premium steel fabrication 
                services across Maharashtra. What started as a small workshop has grown into a 
                leading steel fabrication company, trusted by hundreds of clients.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our commitment to quality, timely delivery, and customer satisfaction has earned 
                us a reputation as the go-to partner for all steel fabrication needs, from 
                residential structures to large industrial projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="px-4 py-2">Premium Materials</Badge>
                <Badge variant="outline" className="px-4 py-2">Expert Craftsmanship</Badge>
                <Badge variant="outline" className="px-4 py-2">Timely Delivery</Badge>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-lg shadow-medium overflow-hidden min-h-[500px]">
                <img 
                  src="/photos/logo.jpg" 
                  alt="Shri krishna steel works Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every project and every relationship we build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Specialties</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive steel fabrication services for diverse industry needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Construction Steel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Structural steel for residential, commercial, and industrial construction projects.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Custom Fabrication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Bespoke steel solutions tailored to your specific requirements and designs.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Industrial Components</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Precision-engineered components for manufacturing and industrial applications.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;