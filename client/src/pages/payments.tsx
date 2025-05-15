import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CreditCard,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign
} from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const userId = 1; // This would come from authentication context

  // Fetch payment records
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: [`/api/payments/${userId}`],
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount / 100);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <DashboardLayout title="Billing & Payments">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Billing & Payments</h1>
        <p className="text-neutral-600">
          Manage your subscription plan, payment methods, and billing history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your current subscription plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg bg-blue-50">
                <div>
                  <h3 className="font-medium text-lg text-neutral-800">Premium Rehabilitation Plan</h3>
                  <p className="text-neutral-600 mt-1">
                    Includes unlimited sessions, therapist consultations, and premium features
                  </p>
                  <Badge variant="default" className="mt-2">Active</Badge>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <span className="text-2xl font-bold">$49.99</span>
                  <span className="text-neutral-600">/month</span>
                  <p className="text-sm text-neutral-500 mt-1">Next billing: June 1, 2023</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Current Plan</span>
                  <span className="font-medium">Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Billing Cycle</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Next Payment</span>
                  <span className="font-medium">$49.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Payment Method</span>
                  <span className="font-medium">Visa •••• 4242</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and default payment option
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-800">Visa ending in 4242</p>
                <p className="text-sm text-neutral-500">Expires 05/2024</p>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-none mr-4">
                  Default
                </Badge>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setShowAddPaymentMethod(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your past invoices and payment history
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading payment history...
                    </TableCell>
                  </TableRow>
                ) : payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-sm text-neutral-600">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {payment.description}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-neutral-800">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        {payment.status === "processed" ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-none flex items-center w-fit">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        ) : payment.status === "pending" ? (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-none flex items-center w-fit">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-none flex items-center w-fit">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-primary">
                        {payment.receiptUrl ? (
                          <a 
                            href={payment.receiptUrl} 
                            className="flex items-center hover:underline"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        ) : (
                          <span className="text-neutral-400">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No payment records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card information to add a new payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input id="nameOnCard" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>
                <input
                  type="checkbox"
                  className="mr-2"
                />
                Set as default payment method
              </Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddPaymentMethod(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddPaymentMethod(false)}>
              Add Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentsPage;
