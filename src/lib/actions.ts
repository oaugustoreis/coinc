'use server';

import { revalidatePath } from 'next/cache';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/server';
import { TransactionSchema } from './types';

export async function addTransactionAction(prevState: any, formData: FormData) {
  const validatedFields = TransactionSchema.safeParse({
    description: formData.get('description'),
    amount: formData.get('amount'),
    type: formData.get('type'),
    isPaid: formData.get('isPaid') === 'on',
    account: formData.get('account'),
    card: formData.get('card'),
    installments: formData.get('installments'),
    month: formData.get('month'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addDoc(collection(db, 'transactions'), {
      ...validatedFields.data,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    return { message: 'Transaction added successfully.', errors: {} };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { message: 'Failed to add transaction.', errors: {} };
  }
}

export async function deleteTransactionAction(prevState: any, formData: FormData) {
  const transactionId = formData.get('transactionId') as string;

  if (!transactionId) {
    return { message: 'Transaction ID is missing.' };
  }

  try {
    await deleteDoc(doc(db, 'transactions', transactionId));
    revalidatePath('/');
    return { message: 'Transaction deleted successfully.' };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { message: 'Failed to delete transaction.' };
  }
}
