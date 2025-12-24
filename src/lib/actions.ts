"use server";
import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TransactionSchema } from "./types";

export async function addTransactionAction(prevState: any, formData: FormData) {
    const isPaidValue = formData.get("isPaid");
    const isPaid = isPaidValue === "true" || isPaidValue === "on";
    const validatedFields = TransactionSchema.safeParse({
        description: formData.get("description"),
        amount: Number(formData.get("amount")), // Garanta que o Zod receba um número
        isPaid: isPaid,
        type: formData.get("type"),
        account: formData.get("account"),
        card: formData.get("card"),
        installments: formData.get("installments"),
        month: formData.get("month"),
        userId: formData.get("userId"),
    });
    console.log(validatedFields);

    if (!validatedFields.success) {
        return {
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await addDoc(collection(db, "transactions"), {
            ...validatedFields.data,
            createdAt: serverTimestamp(),
        });
        revalidatePath("/");
        return { message: "Transaction added successfully.", errors: {} };
    } catch (error) {
        console.error("Error adding transaction:", error);
        return { message: "Failed to add transaction.", errors: {} };
    }
}
export async function deleteTransactionAction(
    prevState: any,
    formData: FormData
) {
    const transactionId = formData.get("transactionId") as string;

    if (!transactionId) {
        return { message: "Transaction ID is missing." };
    }

    try {
        // O Admin SDK usa uma sintaxe levemente diferente
        await adminDb.collection("transactions").doc(transactionId).delete();

        revalidatePath("/");
        return { message: "Transaction deleted successfully." };
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return { message: "Failed to delete transaction." };
    }
}
