import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 peacock-pattern opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-background/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full text-primary-foreground mb-8">
            <Award className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Maharashtra's Trusted Steel Fabricator</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Premium Steel
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">Fabrication Works</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Crafting excellence in steel structures across Maharashtra with 
            precision engineering and quality craftsmanship since decades.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-primary hover:shadow-medium transition-all duration-300"
              onClick={() => navigate('/projects')}
            >
              View Our Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-primary hover:shadow-medium transition-all duration-300"
              onClick={() => navigate('/contact')}
            >
              Get Custom Quote
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="animate-slide-up bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <Shield className="h-8 w-8 text-primary-foreground mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">72+</h3>
              <p className="text-primary-foreground/80">Projects Completed</p>
            </div>
            <div className="animate-slide-up bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 animation-delay-200">
              <Users className="h-8 w-8 text-primary-foreground mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">50+</h3>
              <p className="text-primary-foreground/80">Happy Clients</p>
            </div>
            <div className="animate-slide-up bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20 animation-delay-400">
              <Award className="h-8 w-8 text-primary-foreground mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">15+</h3>
              <p className="text-primary-foreground/80">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
      <div className="absolute top-20 right-20 w-32 h-32 peacock-gradient rounded-full opacity-20 animate-float hidden lg:block"></div>
      <div className="absolute bottom-32 left-20 w-24 h-24 peacock-gradient rounded-full opacity-15 animate-float hidden lg:block animation-delay-2000"></div>
    </section>
  );
};

export default Hero;