import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Plus } from "lucide-react";

type PaymentSectionProps = {
  userId: number;
};

const PaymentSection: React.FC<PaymentSectionProps> = ({ userId }) => {
  // Fetch payment records
  const { data: payments, isLoading } = useQuery({
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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-neutral-800">Billing & Payments</h2>
        <Link href="/payments">
          <Button variant="ghost" className="text-primary font-medium">
            View All
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-medium text-lg text-neutral-800">Premium Rehabilitation Plan</h3>
              <p className="text-neutral-600 mt-1">
                Includes unlimited sessions, therapist consultations, and premium features
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-2xl font-bold">$49.99</span>
              <span className="text-neutral-600">/month</span>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Payment Methods</h4>
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
              <div className="p-3 border rounded-lg flex items-center flex-1">
                <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Visa ending in 4242</p>
                  <p className="text-xs text-neutral-500">Expires 05/2024</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
                    Default
                  </Badge>
                </div>
              </div>
              
              <Button variant="outline" className="py-3 border-dashed text-neutral-600 hover:bg-gray-50 flex items-center justify-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Billing History</h4>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Loading payment history...
                      </TableCell>
                    </TableRow>
                  ) : payments && payments.length > 0 ? (
                    payments.slice(0, 3).map((payment) => (
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
                          <Badge 
                            variant="outline"
                            className={
                              payment.status === "processed" 
                                ? "bg-green-100 text-green-800 border-none" 
                                : "bg-yellow-100 text-yellow-800 border-none"
                            }
                          >
                            {payment.status === "processed" ? "Paid" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-primary">
                          {payment.receiptUrl ? (
                            <a href={payment.receiptUrl} className="hover:underline">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSection;
