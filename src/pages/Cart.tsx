import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import PaymentQRModal from '@/components/PaymentQRModal';
import { OrderService, calculateOrderTotal } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price?: string;
  quantity: number;
  specifications?: string[];
  features?: string[];
  dimensions?: string;
  material?: string;
  weight?: string;
  warranty?: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    return getCartTotal();
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    const shipping = 500;
    const tax = subtotal * 0.18;
    return subtotal + shipping + tax;
  };

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to complete your order',
        variant: 'destructive'
      });
      return;
    }

    setIsCreatingOrder(true);
    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.email || 'Customer',
        items: cartItems,
        subtotal: calculateTotal(),
        shipping: 500,
        tax: calculateTotal() * 0.18,
        total: calculateFinalTotal(),
        status: 'pending' as const,
        paymentStatus: 'paid' as const,
        paymentMethod: 'upi' as const,
        notes: 'Payment completed via UPI QR code'
      };

      const orderId = await OrderService.createOrder(orderData);
      
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${orderId} has been placed and payment confirmed.`,
      });

      // Clear the cart after successful order
      clearCart();
      
      // Close payment modal
      setIsPaymentModalOpen(false);
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel-50 to-steel-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Login Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please login to view your cart and manage your items.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/auth')} 
                className="flex-1 hero-gradient"
              >
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-50 to-steel-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
            <p className="text-muted-foreground">Review your items before checkout</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add some products to get started with your order.
              </p>
              <Button onClick={() => navigate('/products')} className="hero-gradient">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {item.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{item.price}</p>
                          <p className="text-sm text-muted-foreground">
                            Total: ₹{parseFloat(item.price?.replace(/[₹,]/g, '') || '0') * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{(calculateTotal() * 0.18).toFixed(0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        ₹{(calculateTotal() + 500 + (calculateTotal() * 0.18)).toFixed(0)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full hero-gradient" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/products')}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Payment QR Modal */}
      <PaymentQRModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={calculateFinalTotal()}
        onPaymentComplete={handlePaymentComplete}
        isLoading={isCreatingOrder}
      />
    </div>
  );
};

export default Cart;
