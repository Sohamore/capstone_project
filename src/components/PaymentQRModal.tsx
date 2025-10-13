import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Smartphone, CreditCard, CheckCircle } from 'lucide-react';

interface PaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentComplete?: () => void;
  isLoading?: boolean;
}

const PaymentQRModal: React.FC<PaymentQRModalProps> = ({ isOpen, onClose, totalAmount, onPaymentComplete, isLoading = false }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
            Complete Your Payment
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Scan the QR code below to proceed with your payment
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Amount */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Total Amount</span>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                ₹{totalAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* QR Code Section */}
          <div className="text-center">
            <Card className="bg-white border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6">
                {/* QR Code Container */}
                <div className="relative inline-block">
                  <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-inner">
                    {/* Actual QR Code */}
                    <img 
                      src="/photos/WhatsApp Image 2025-10-13 at 09.54.14_1bbece06.jpg" 
                      alt="Payment QR Code"
                      className="w-56 h-56 object-contain rounded-lg"
                    />
                  </div>
                  
                  {/* Payment Provider Badge */}
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                </div>

                {/* UPI ID */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">UPI ID</p>
                  <p className="font-mono text-sm font-medium text-gray-800">
                    sohammore245@oksbi
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 text-sm">How to Pay</h4>
                <ol className="text-xs text-blue-800 mt-1 space-y-1">
                  <li>1. Open any UPI app (GPay, PhonePe, Paytm)</li>
                  <li>2. Scan the QR code above</li>
                  <li>3. Verify the amount and merchant details</li>
                  <li>4. Complete the payment</li>
                </ol>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Payment will be processed securely through UPI
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (onPaymentComplete) {
                  onPaymentComplete();
                } else {
                  alert('Payment completed! Thank you for your order.');
                  onClose();
                }
              }}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Payment Done'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentQRModal;
