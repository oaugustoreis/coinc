import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

export const TransactionSchema = z.object({
  description: z.string().min(2, { message: 'Description must be at least 2 characters.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  type: z.enum(['income', 'expense']),
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
  type: 'income' | 'expense';
  isPaid: boolean;
  account?: string;
  card?: string;
  installments?: string;
  month: string;
  userId: string;
  createdAt: Timestamp;
};

export type TransactionFormData = z.infer<typeof TransactionSchema>;
