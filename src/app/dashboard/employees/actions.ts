"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  gross_salary: z.coerce.number().min(1, "Gross salary must be > 0"),
  rent_benefit: z.boolean(),
  annual_rent: z.coerce.number().optional().nullable(),
  pension_opt_in: z.boolean(),
  pension_percentage: z.coerce.number().min(0).max(100).default(8),
});

export async function addEmployee(
  prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in", success: false };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    return { error: "No business found", success: false };
  }

  const rentBenefit = formData.get("rent_benefit") === "on";
  const pensionOptIn = formData.get("pension_opt_in") === "on";

  const rawData = {
    name: formData.get("name"),
    gross_salary: formData.get("gross_salary"),
    rent_benefit: rentBenefit,
    annual_rent: rentBenefit ? formData.get("annual_rent") : null,
    pension_opt_in: pensionOptIn,
    pension_percentage: pensionOptIn ? formData.get("pension_percentage") || 8 : 8,
  };

  const parsed = employeeSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message, success: false };
  }

  const { error } = await supabase.from("employees").insert({
    business_id: business.id,
    name: parsed.data.name,
    gross_salary: parsed.data.gross_salary,
    rent_benefit: parsed.data.rent_benefit,
    annual_rent: parsed.data.annual_rent,
    pension_opt_in: parsed.data.pension_opt_in,
    pension_percentage: parsed.data.pension_percentage,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard/employees");
  redirect("/dashboard/employees");
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (!error) {
    revalidatePath("/dashboard/employees");
  }
}
