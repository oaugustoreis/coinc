import { z } from "zod";
import { Timestamp } from "firebase/firestore";

export const TransactionSchema = z.object({
    description: z
        .string()
        .min(2, { message: "Descrição deve ter pelo menos 2 caracteres." }),
    amount: z.coerce
        .number()
        .positive({ message: "O valor deve ser um número positivo." }),
    type: z.enum(["receita", "despesa"]),
    isPaid: z.boolean().default(false),
    account: z.string().optional(),
    card: z.string().optional(),
    installments: z.string().optional(),
    month: z.string(),
    userId: z.string(),
});

export type Transaction = {
    id: string;
    description: string;
    amount: number;
    type: "receita" | "despesa";
    isPaid: boolean;
    account?: string;
    card?: string;
    installments?: string;
    month: string;
    userId: string;
    createdAt: Timestamp;
};

export type TransactionFormData = z.infer<typeof TransactionSchema>;
