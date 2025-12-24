"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/types";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Banknote,
    MoreVertical,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { deleteTransactionAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useActionState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(amount);
};

function DeleteButton({ transactionId }: { transactionId: string }) {
    const [state, formAction] = useActionState(deleteTransactionAction, {
        message: "",
    });
    const { toast } = useToast();

    useEffect(() => {
        if (state.message === "Transação excluída com sucesso.") {
            toast({
                title: "Sucesso",
                description: state.message,
            });
        } else if (state.message) {
            toast({
                title: "Error",
                description: state.message,
                variant: "destructive",
            });
        }
    }, [state, toast]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="w-full text-left p-2 rounded-sm text-sm hover:bg-destructive/10 text-destructive">
                    <Trash2 className="mr-2 h-4 w-4 inline-block" />
                    <span>Excluir</span>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente esta transação dos nossos servidores.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <form
                        action={formAction}
                        className="w-full flex justify-end gap-2"
                    >
                        <input
                            type="hidden"
                            name="transactionId"
                            value={transactionId}
                        />
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button type="submit" variant="destructive">
                                Excluir
                            </Button>
                        </AlertDialogAction>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function TransactionTable({
    transactions,
}: {
    transactions: Transaction[];
}) {
    if (transactions.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                        <p className="font-bold text-lg">
                            Nenhuma transação ainda.
                        </p>
                        <p>Adicione sua primeira transação para começar!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">
                    Transações Recentes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Detalhes</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {transaction.type === "receita" ? (
                                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="font-medium">
                                            {transaction.description}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        "text-right font-semibold",
                                        transaction.type === "receita"
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                    )}
                                >
                                    {transaction.type === "receita" ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            transaction.isPaid
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={cn(
                                            transaction.isPaid &&
                                                "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        {transaction.isPaid ? (
                                            <ShieldCheck className="h-4 w-4 mr-1" />
                                        ) : (
                                            <ShieldAlert className="h-4 w-4 mr-1" />
                                        )}
                                        {transaction.isPaid
                                            ? "Pago"
                                            : "Pendente"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {transaction.card && (
                                            <Badge variant="outline">
                                                <CreditCard className="h-4 w-4 mr-1" />
                                                {transaction.card}
                                            </Badge>
                                        )}
                                        {transaction.account && (
                                            <Badge variant="outline">
                                                <Banknote className="h-4 w-4 mr-1" />
                                                {transaction.account}
                                            </Badge>
                                        )}
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
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <DeleteButton
                                                    transactionId={
                                                        transaction.id
                                                    }
                                                />
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
