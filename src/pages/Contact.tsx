import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, MessageSquare, Star } from 'lucide-react';
import { ContactService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.projectType || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const contactFormData = {
        userId: user?.uid || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType as 'residential' | 'commercial' | 'industrial' | 'custom',
        message: formData.message
      };

      const contactId = await ContactService.submitContactForm(contactFormData);
      
      toast({
        title: 'Message Sent Successfully!',
        description: 'Thank you for contacting us. We will get back to you within 24 hours.',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        projectType: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error sending your message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      info: '+91 9226133650',
      description: 'Call us for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'shrikrishnasteel0809@gmail.com',
      description: 'Send us your queries anytime'
    },
    {
      icon: MapPin,
      title: 'Address',
      info: 'Pune-Banglor Highway, Near Hotel Annapurna, Gote, Tal.Karad, Dist. Satara',
      description: 'Visit our workshop and office'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      info: 'Mon - Sat: 9:00 AM - 6:00 PM',
      description: 'Sunday: Closed'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      company: 'Sharma Construction',
      rating: 5,
      review: 'Excellent quality work and timely delivery. Highly recommended for all steel fabrication needs.'
    },
    {
      name: 'Priya Patel',
      company: 'Patel Industries',
      rating: 5,
      review: 'Professional service and great attention to detail. Our industrial project was completed perfectly.'
    },
    {
      name: 'Amit Kumar',
      company: 'Kumar Developers',
      rating: 5,
      review: 'Best steel fabrication company in Maharashtra. Quality work at competitive prices.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/20">
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Get In Touch With
            <br />
            <span className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Our Expert Team</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Ready to start your steel fabrication project? Contact us today for 
            expert consultation and competitive quotes.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground mb-2">{item.info}</p>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Enter your first name" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Enter your last name" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input 
                      id="phone" 
                      placeholder="Enter your phone number" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="custom">Custom Fabrication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your project requirements..."
                      className="min-h-[120px]"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full hero-gradient" 
                    disabled={isSubmitting}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Info */}
            <div className="space-y-8">
              {/* Location Map */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl">Visit Our Workshop</CardTitle>
                  <CardDescription>
                    Pune-Banglor Highway, Near Hotel Annapurna, Gote, Tal.Karad, Dist. Satara
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.123456789!2d74.1234567!3d17.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1234567890abc%3A0x1234567890abcdef!2sPune-Banglor%20Highway%2C%20Near%20Hotel%20Annapurna%2C%20Gote%2C%20Tal.Karad%2C%20Dist.%20Satara%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1694000000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Shri krishna steel works Location"
                      className="rounded-lg border-0"
                    ></iframe>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2"><strong>Address:</strong></p>
                    <p>Pune-Banglor Highway, Near Hotel Annapurna</p>
                    <p>Gote, Tal.Karad, Dist. Satara, Maharashtra</p>
                    <p className="mt-2"><strong>Phone:</strong> +91 9226133650</p>
                    <p><strong>Email:</strong> shrikrishnasteel0809@gmail.com</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl">Need Immediate Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full hero-gradient" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now: +91 9226133650
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-steel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground">
              Testimonials from our satisfied customers across Maharashtra
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.review}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;