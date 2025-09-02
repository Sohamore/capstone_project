import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  category: string;
  price?: string;
}

const ProductCard = ({ name, description, image, category, price }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-steel">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="mb-2">{category}</Badge>
          {price && <span className="text-sm font-semibold text-primary">{price}</span>}
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{name}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 hero-gradient">
            View Details
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Get Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;