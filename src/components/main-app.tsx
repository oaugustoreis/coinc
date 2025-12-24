'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useSearchParams } from 'next/navigation';
import type { User } from 'firebase/auth';
import UserNav from './user-nav';
import MonthSelector from './month-selector';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import AddTransactionDialog from './add-transaction-dialog';
import { useEffect, useState } from 'react';
import type { Transaction } from '@/lib/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import SummaryCards from './summary-cards';
import TransactionTable from './transaction-table';
import { Skeleton } from './ui/skeleton';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MainApp({ user }: { user: User }) {
  const searchParams = useSearchParams();
  const currentMonthName = months[new Date().getMonth()];
  const selectedMonth = searchParams.get('month') || currentMonthName;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsDataLoading(true);
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('month', '==', selectedMonth)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      transactionsData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      setTransactions(transactionsData);
      setIsDataLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedMonth]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="font-headline text-2xl font-semibold tracking-tight">Monthly Finances</h1>
        </SidebarHeader>
        <SidebarContent>
          <UserNav user={user} />
          <SidebarSeparator />
          <MonthSelector />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tight">{selectedMonth} Overview</h2>
            <div className="flex items-center space-x-2">
              <AddTransactionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={user}
                month={selectedMonth}
              >
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </AddTransactionDialog>
            </div>
          </div>

          <div className="space-y-4">
            <SummaryCards transactions={transactions} isLoading={isDataLoading} />
            {isDataLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <TransactionTable transactions={transactions} />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
