import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, Wallet, DollarSign } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaApplePay, FaGooglePay } from "react-icons/fa";

// Payment form schema
const cardPaymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19, "Card number must be at most 19 digits"),
  cardHolder: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV must be at most 4 digits"),
});

// Digital wallet schema
const walletPaymentSchema = z.object({
  walletType: z.enum(["paypal", "applepay", "googlepay"]),
  email: z.string().email("Please enter a valid email").optional(),
});

type PaymentProps = {
  totalAmount: number;
  onPaymentComplete: (paymentData: any) => void;
  isPending: boolean;
};

export default function Payment({ totalAmount, onPaymentComplete, isPending }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Credit card form
  const cardForm = useForm<z.infer<typeof cardPaymentSchema>>({
    resolver: zodResolver(cardPaymentSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: ""
    }
  });
  
  // Digital wallet form
  const walletForm = useForm<z.infer<typeof walletPaymentSchema>>({
    resolver: zodResolver(walletPaymentSchema),
    defaultValues: {
      walletType: "paypal",
      email: ""
    }
  });
  
  const onCardSubmit = (data: z.infer<typeof cardPaymentSchema>) => {
    onPaymentComplete({
      method: "card",
      ...data
    });
  };
  
  const onWalletSubmit = (data: z.infer<typeof walletPaymentSchema>) => {
    onPaymentComplete({
      method: data.walletType,
      ...data
    });
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="text-sm text-neutral-500 mb-2">Amount to pay</div>
            <div className="text-3xl font-bold">${totalAmount.toFixed(2)}</div>
          </div>
          
          <Tabs value={paymentMethod} onValueChange={handlePaymentMethodChange}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="card" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Credit Card</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span>Digital Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="cash" className="flex items-center space-x-2" disabled>
                <DollarSign className="h-4 w-4" />
                <span>Pay Later</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card">
              <div className="mb-6 flex space-x-2">
                <FaCcVisa className="h-8 w-10 text-blue-700" />
                <FaCcMastercard className="h-8 w-10 text-red-500" />
                <FaCcAmex className="h-8 w-10 text-blue-500" />
              </div>
              
              <Form {...cardForm}>
                <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4">
                  <FormField
                    control={cardForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            maxLength={19}
                            {...field}
                            onChange={(e) => {
                              // Format card number with spaces
                              const value = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
                              const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
                              field.onChange(formattedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={cardForm.control}
                    name="cardHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={cardForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              maxLength={5}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 4) {
                                  const month = value.substring(0, 2);
                                  const year = value.substring(2, 4);
                                  let formattedValue = "";
                                  
                                  if (value.length > 2) {
                                    formattedValue = `${month}/${year}`;
                                  } else {
                                    formattedValue = month;
                                  }
                                  
                                  field.onChange(formattedValue);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cardForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="***" 
                              maxLength={4}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${totalAmount.toFixed(2)}`
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="wallet">
              <Form {...walletForm}>
                <form onSubmit={walletForm.handleSubmit(onWalletSubmit)} className="space-y-4">
                  <FormField
                    control={walletForm.control}
                    name="walletType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Wallet</FormLabel>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer flex items-center justify-center ${field.value === 'paypal' ? 'border-primary bg-primary-50' : 'border-neutral-200'}`}
                            onClick={() => field.onChange('paypal')}
                          >
                            <FaCcPaypal className="h-8 w-10 text-blue-600" />
                          </div>
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer flex items-center justify-center ${field.value === 'applepay' ? 'border-primary bg-primary-50' : 'border-neutral-200'}`}
                            onClick={() => field.onChange('applepay')}
                          >
                            <FaApplePay className="h-8 w-10 text-black" />
                          </div>
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer flex items-center justify-center ${field.value === 'googlepay' ? 'border-primary bg-primary-50' : 'border-neutral-200'}`}
                            onClick={() => field.onChange('googlepay')}
                          >
                            <FaGooglePay className="h-8 w-10 text-black" />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {walletForm.watch("walletType") === "paypal" && (
                    <FormField
                      control={walletForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PayPal Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay with ${
                        walletForm.watch("walletType") === "paypal" ? "PayPal" :
                        walletForm.watch("walletType") === "applepay" ? "Apple Pay" :
                        "Google Pay"
                      }`
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="cash">
              <div className="text-center py-6">
                <p className="text-neutral-500 mb-4">Pay later functionality coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-xs text-neutral-500 text-center">
            <p>Your payment information is encrypted and secure. We never store your full card details.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
