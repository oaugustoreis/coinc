"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema, type TransactionFormData } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { addTransactionAction } from "@/lib/actions";
import {
    startTransition,
    useActionState,
    useEffect,
    type ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "firebase/auth";

interface AddTransactionDialogProps {
    children: ReactNode;
    user: User;
    month: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const initialState = {
    message: "",
    errors: {},
};

export default function AddTransactionDialog({
    children,
    user,
    month,
    open,
    onOpenChange,
}: AddTransactionDialogProps) {
    const [state, formAction] = useActionState(
        addTransactionAction,
        initialState
    );
    const { toast } = useToast();

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            description: "",
            amount: 0,
            type: "expense",
            isPaid: false,
            account: "",
            card: "",
            installments: "",
            month: month,
            userId: user.uid,
        },
    });
    const handleFormSubmit = form.handleSubmit((data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        // ENVOLVA A CHAMADA AQUI:
        startTransition(() => {
            formAction(formData);
        });
    });
    useEffect(() => {
        form.reset({
            ...form.getValues(),
            month: month,
            userId: user.uid,
        });
    }, [month, user.uid, form]);

    useEffect(() => {
        if (state.message === "Transaction added successfully.") {
            toast({
                title: "Success!",
                description: state.message,
                className: "bg-accent text-accent-foreground",
            });
            onOpenChange(false);
            form.reset();
        } else if (state.message && state.message !== "Invalid form data.") {
            toast({
                title: "Error",
                description: state.message,
                variant: "destructive",
            });
        }
    }, [state, toast, onOpenChange, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-headline">
                        Add New Transaction
                    </DialogTitle>
                    <DialogDescription>
                        Enter the details of your transaction here. Click save
                        when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input
                            type="hidden"
                            {...form.register("userId")}
                            value={user.uid}
                        />
                        <input
                            type="hidden"
                            {...form.register("month")}
                            value={month}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Groceries"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="expense">
                                                    Expense
                                                </SelectItem>
                                                <SelectItem value="income">
                                                    Income
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="account"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Checking"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="card"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Card</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Visa"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <FormField
                                control={form.control}
                                name="installments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Installments</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., 1/12"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isPaid"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 mt-7">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Paid</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Transaction</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
