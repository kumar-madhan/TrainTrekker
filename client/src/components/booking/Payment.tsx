import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreditCard, 
  CreditCard as CreditCardIcon, 
  Info
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { RouteWithDetails } from '@shared/schema';

const creditCardSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Card number must be at least 16 digits')
    .max(19, 'Card number cannot exceed 19 digits')
    .regex(/^[0-9\s-]+$/, 'Card number can only contain numbers, spaces, or hyphens'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string()
    .length(3, 'CVV must be 3 digits')
    .regex(/^[0-9]+$/, 'CVV can only contain numbers'),
  cardholderName: z.string().min(3, 'Cardholder name is required'),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;

interface PaymentProps {
  route: RouteWithDetails;
  onComplete: (paymentMethod: string) => void;
}

export default function Payment({ route, onComplete }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal'>('credit-card');
  
  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      termsAccepted: false,
    },
  });

  const handleSubmit = (data: CreditCardFormData) => {
    // In a real app, this would handle the payment processing
    onComplete(paymentMethod);
  };

  const handlePaypalPayment = () => {
    // In a real app, this would redirect to PayPal
    onComplete('paypal');
  };

  // Calculate order total
  const basePrice = route.price / 100; // Convert cents to dollars
  const bookingFee = 2.5;
  const taxes = parseFloat((basePrice * 0.08).toFixed(2));
  const total = basePrice + bookingFee + taxes;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-heading font-medium text-xl mb-4">Payment Information</h3>
        
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{route.train.name} (Economy)</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Fee</span>
                <span>${bookingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <div 
                className={`border rounded-md px-4 py-2 flex items-center cursor-pointer ${
                  paymentMethod === 'credit-card' 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-gray-300'
                }`}
                onClick={() => setPaymentMethod('credit-card')}
              >
                <input 
                  type="radio" 
                  id="creditCard" 
                  className="mr-2" 
                  checked={paymentMethod === 'credit-card'}
                  onChange={() => setPaymentMethod('credit-card')}
                />
                <label htmlFor="creditCard" className="cursor-pointer flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                  <span>Credit Card</span>
                </label>
              </div>
              <div 
                className={`border rounded-md px-4 py-2 flex items-center cursor-pointer ${
                  paymentMethod === 'paypal' 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-gray-300'
                }`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <input 
                  type="radio" 
                  id="paypal" 
                  className="mr-2" 
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <label htmlFor="paypal" className="cursor-pointer flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-gray-600" />
                  <span>PayPal</span>
                </label>
              </div>
            </div>
            
            {paymentMethod === 'credit-card' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="1234 5678 9012 3456" 
                                  {...field} 
                                  className="pr-10"
                                />
                                <CreditCard className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-gray-700">
                            I agree to the <a href="#" className="text-primary-600 hover:text-primary-800">Terms and Conditions</a> and <a href="#" className="text-primary-600 hover:text-primary-800">Privacy Policy</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 text-center">
                    <Button 
                      type="submit" 
                      className="w-full bg-secondary-500 hover:bg-secondary-600"
                    >
                      Complete Payment
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCardIcon className="h-10 w-10 mx-auto mb-2" />
                <p>You will be redirected to PayPal to complete your payment securely.</p>
                <Button 
                  onClick={handlePaypalPayment}
                  className="mt-4 bg-blue-500 hover:bg-blue-600"
                >
                  Proceed to PayPal
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 flex items-start mt-4">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              This is a demonstration. No actual payment will be processed. In a real application, 
              this would connect to a payment processor like Stripe, PayPal, or a bank gateway.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
