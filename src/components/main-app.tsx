"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import type { User } from "firebase/auth";
import UserNav from "./user-nav";
import MonthSelector from "./month-selector";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import AddTransactionDialog from "./add-transaction-dialog";
import { useEffect, useState } from "react";
import type { Transaction } from "@/lib/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SummaryCards from "./summary-cards";
import TransactionTable from "./transaction-table";
import { Skeleton } from "./ui/skeleton";
import logo from "@/assets/coinc-loco.png";

const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export default function MainApp({ user }: { user: User }) {
    const searchParams = useSearchParams();
    const currentMonthName = months[new Date().getMonth()];
    const selectedMonth = searchParams.get("month") || currentMonthName;

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setIsDataLoading(true);
        if (!user) return;

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            where("month", "==", selectedMonth)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const transactionsData: Transaction[] = [];
            querySnapshot.forEach((doc) => {
                transactionsData.push({
                    id: doc.id,
                    ...doc.data(),
                } as Transaction);
            });
            transactionsData.sort(
                (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
            );
            setTransactions(transactionsData);
            setIsDataLoading(false);
        });

        return () => unsubscribe();
    }, [user, selectedMonth]);

    return (
        <SidebarProvider>
            <Sidebar className="fixed">
                <SidebarHeader>
                    <div className="h-full w-full  flex justify-center items-center ">
                        <img
                            src={logo.src}
                            alt="Coinc Logo"
                            className="w-24 "
                        />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <UserNav user={user} />
                    <SidebarSeparator />
                    <MonthSelector />
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="w-full max-w-full  md:w-[calc(100%-var(--sidebar-width))]">
                <main className="flex flex-col border max-w-full space-y-4 px-4 py-4 md:px-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex justify-between items-center gap-4">
                            <SidebarTrigger className="md:hidden" />

                            <h2 className="font-headline text-3xl text-center font-bold tracking-tight">
                                {selectedMonth}
                            </h2>
                        </div>
                        <div className="flex items-center flex justify-center space-x-2">
                            <AddTransactionDialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                                user={user}
                                month={selectedMonth}
                            >
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar Transação
                                </Button>
                            </AddTransactionDialog>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SummaryCards
                            transactions={transactions}
                            isLoading={isDataLoading}
                        />
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
