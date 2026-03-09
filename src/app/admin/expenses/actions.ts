"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function recordExpense(formData: FormData) {
  const supabase = await createClient();
  const dateStr = formData.get("date") as string;
  const category = formData.get("category") as string;
  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;

  if (!dateStr || !category || !amountStr || !description) {
    return { error: "All fields are required" };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Amount must be a positive number" };
  }

  // Format date safely with T12:00:00Z to avoid timezone boundary shifting
  const created_at = `${dateStr}T12:00:00Z`;
  // Extract YYYY-MM
  const month = dateStr.substring(0, 7);

  const { error } = await supabase.from("expenses").insert({
    category,
    description,
    amount,
    month,
    created_at,
  });

  if (error) {
    console.error("Error recording expense:", error);
    return { error: "Failed to record expense. Please try again." };
  }

  revalidatePath("/admin/expenses");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
