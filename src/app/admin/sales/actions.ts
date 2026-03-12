'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSaleRecord(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const perfume_id = formData.get('perfume_id') as string;
  const perfume_name = formData.get('perfume_name') as string;
  const size = formData.get('size') as string;
  const qty = parseInt(formData.get('qty') as string, 10);
  const price = parseFloat(formData.get('price') as string);
  const sale_date = formData.get('sale_date') as string;
  // Use cash as default unless specified
  const payment_type = (formData.get('payment_type') as string) || 'cash';

  if (!perfume_id || !perfume_name || !size || isNaN(qty) || isNaN(price) || !sale_date) {
    return { success: false, error: 'Missing required fields' };
  }

  // Calculate revenue. If 'price' is unit price, revenue is price * qty.
  // We'll treat the provided 'price' as the total price if they manually entered it, 
  // or unit price * qty. Let's ask the form to submit total_price, or calculate it here.
  // Actually, 'price' in the form might be the unit price since it auto-fills based on size.
  const revenue = price * qty;
  
  // Set profit = revenue for now assuming no cost tracking yet
  const profit = revenue;

  // Parse date and set it to 12:00 UTC to avoid timezone boundary issues shifting the day/month
  const safeDateString = sale_date.includes('T') ? sale_date : `${sale_date}T12:00:00Z`;
  const saleDateObj = new Date(safeDateString);

  // Insert into DB
  const { error } = await supabase.from('sales').insert([
    {
      perfume_id,
      perfume_name,
      size,
      qty,
      revenue,
      profit,
      payment_type,
      sale_date: saleDateObj.toISOString(), // Map standard date string to ISO
      created_at: saleDateObj.toISOString(), // Critical: override created_at with sale_date to group history properly
    }
  ]);

  if (error) {
    console.error('Error inserting sale:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/sales');
  revalidatePath('/admin/dashboard'); // Typical locations to revalidate
  return { success: true };
}