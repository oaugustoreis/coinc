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

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(amount);


function DeleteButton({ transactionId }: { transactionId: string }) {
    const [state, formAction] = useActionState(deleteTransactionAction, {
        message: "",
    });
    const { toast } = useToast();

    useEffect(() => {
        if (!state.message) return;

        toast({
            title: state.message.includes("sucesso") ? "Sucesso" : "Erro",
            description: state.message,
            variant: state.message.includes("sucesso")
                ? "default"
                : "destructive",
        });
    }, [state, toast]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="flex items-center gap-2 w-full p-2 text-sm text-destructive hover:bg-destructive/10 rounded-sm">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <form action={formAction} className="flex gap-2">
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
                <CardContent className="pt-6 text-center text-muted-foreground">
                    <p className="text-lg font-bold">Nenhuma transação ainda</p>
                    <p>Adicione sua primeira transação para começar</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="text-right">
                                    Valor
                                </TableHead>

                                <TableHead className="hidden md:table-cell">
                                    Status
                                </TableHead>
                                <TableHead className="hidden lg:table-cell">
                                    Detalhes
                                </TableHead>

                                <TableHead className="text-right w-[40px]" />
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
                                            <span className="font-medium truncate max-w-[160px]">
                                                {transaction.description}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell
                                        className={cn(
                                            "text-right font-semibold whitespace-nowrap",
                                            transaction.type === "receita"
                                                ? "text-emerald-600"
                                                : "text-red-600"
                                        )}
                                    >
                                        {transaction.type === "receita"
                                            ? "+"
                                            : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        <Badge
                                            variant={
                                                transaction.isPaid
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="gap-1"
                                        >
                                            {transaction.isPaid ? (
                                                <ShieldCheck className="h-4 w-4" />
                                            ) : (
                                                <ShieldAlert className="h-4 w-4" />
                                            )}
                                            <span className="hidden lg:inline">
                                                {transaction.isPaid
                                                    ? "Pago"
                                                    : "Pendente"}
                                            </span>
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex gap-1 flex-wrap">
                                            {transaction.card && (
                                                <Badge
                                                    variant="outline"
                                                    className="truncate max-w-[120px]"
                                                >
                                                    <CreditCard className="h-4 w-4 mr-1" />
                                                    {transaction.card}
                                                </Badge>
                                            )}
                                            {transaction.account && (
                                                <Badge
                                                    variant="outline"
                                                    className="truncate max-w-[120px]"
                                                >
                                                    <Banknote className="h-4 w-4 mr-1" />
                                                    {transaction.account}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right whitespace-nowrap">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
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
                </div>
            </CardContent>
        </Card>
    );
}
