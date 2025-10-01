import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, ShoppingCart, Star, Shield, Clock, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    image: string;
    category: string;
    price?: string;
    specifications?: string[];
    features?: string[];
    dimensions?: string;
    material?: string;
    weight?: string;
    warranty?: string;
  };
}

const ProductDetailsModal = ({ isOpen, onClose, product }: ProductDetailsModalProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const productData = {
      id: product.name.toLowerCase().replace(/\s+/g, '-'),
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price,
      specifications: product.specifications,
      features: product.features,
      dimensions: product.dimensions,
      material: product.material,
      weight: product.weight,
      warranty: product.warranty
    };
    addToCart(productData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-2 border-primary/20">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-primary">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-steel">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Price and Category */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {product.category}
              </Badge>
              {product.price && (
                <span className="text-2xl font-bold text-primary">{product.price}</span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Specifications
                  </h3>
                  <ul className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              {product.dimensions && (
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="font-semibold">{product.dimensions}</p>
                </div>
              )}
              {product.material && (
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="font-semibold">{product.material}</p>
                </div>
              )}
              {product.weight && (
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-semibold">{product.weight}</p>
                </div>
              )}
              {product.warranty && (
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Warranty</p>
                  <p className="font-semibold">{product.warranty}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 hero-gradient" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                <Truck className="h-4 w-4 mr-2" />
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;

