"use server";
import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TransactionSchema } from "./types";

export async function addTransactionAction(prevState: any, formData: FormData) {
    const isPaidValue = formData.get("isPaid");
    const isPaid = isPaidValue === "true" || isPaidValue === "on";
    const validatedFields = TransactionSchema.safeParse({
        description: formData.get("description"),
        amount: Number(formData.get("amount")),
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
        return { message: "Transação adicionada com sucesso.", errors: {} };
    } catch (error) {
        console.error("Erro ao adicionar a transação:", error);
        return { message: "Falha ao adicionar a transação.", errors: {} };
    }
}
export async function deleteTransactionAction(
    prevState: any,
    formData: FormData
) {
    const transactionId = formData.get("transactionId") as string;

    if (!transactionId) {
        return { message: "ID da transação está ausente." };
    }

    try {
        await adminDb.collection("transactions").doc(transactionId).delete();

        revalidatePath("/");
        return { message: "Transação excluída com sucesso." };
    } catch (error) {
        console.error("Erro ao excluir a transação:", error);
        return { message: "Falha ao excluir a transação." };
    }
}
