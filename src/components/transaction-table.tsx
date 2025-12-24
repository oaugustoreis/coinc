'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown, CreditCard, Banknote, MoreVertical, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useFormState } from 'react-dom';
import { deleteTransactionAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

function DeleteButton({ transactionId }: { transactionId: string }) {
    const [state, formAction] = useFormState(deleteTransactionAction, { message: '' });
    const { toast } = useToast();
  
    useEffect(() => {
      if (state.message === 'Transaction deleted successfully.') {
        toast({
          title: 'Success',
          description: state.message,
        });
      } else if (state.message) {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }, [state, toast]);
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <div className="w-full text-left p-2 rounded-sm text-sm hover:bg-destructive/10 text-destructive">
                <Trash2 className="mr-2 h-4 w-4 inline-block" />
                <span>Delete</span>
            </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <form action={formAction} className="w-full flex justify-end gap-2">
              <input type="hidden" name="transactionId" value={transactionId} />
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit" variant="destructive">Delete</Button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p className="font-bold text-lg">No transactions yet.</p>
            <p>Add your first transaction to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{transaction.description}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-mono',
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={transaction.isPaid ? 'default' : 'secondary'} className={cn(transaction.isPaid && 'bg-accent text-accent-foreground')}>
                    {transaction.isPaid ? <ShieldCheck className="h-3 w-3 mr-1" /> : <ShieldAlert className="h-3 w-3 mr-1" />}
                    {transaction.isPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                    <div className='flex items-center gap-2'>
                        {transaction.card && <Badge variant="outline"><CreditCard className="h-3 w-3 mr-1"/>{transaction.card}</Badge>}
                        {transaction.account && <Badge variant="outline"><Banknote className="h-3 w-3 mr-1"/>{transaction.account}</Badge>}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <DeleteButton transactionId={transaction.id} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
