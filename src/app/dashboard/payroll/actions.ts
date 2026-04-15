"use server";

import { createClient } from "@/utils/supabase/server";
import { calculatePAYE, EmployeeTaxData } from "@/lib/tax";
import { revalidatePath } from "next/cache";

export async function checkPayrollExists(month: string, year: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { exists: false };

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) return { exists: false };

  const { data: existingRun } = await supabase
    .from("payroll_runs")
    .select("id")
    .eq("business_id", business.id)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  return { exists: !!existingRun, runId: existingRun?.id };
}

export async function executePayrollRun(month: string, year: number, overwrite: boolean = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) return { error: "No business found" };

  // Check for idempotency
  const { data: existingRun } = await supabase
    .from("payroll_runs")
    .select("id")
    .eq("business_id", business.id)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (existingRun && !overwrite) {
    return { error: "Run already exists. Explicit overwrite required." };
  }

  // Fetch employees
  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .eq("business_id", business.id);

  if (!employees || employees.length === 0) {
    return { error: "No employees found. Add employees to run payroll." };
  }

  // Delete existing if overwriting (Cascades to line items)
  if (existingRun && overwrite) {
    await supabase.from("payroll_runs").delete().eq("id", existingRun.id);
  }

  // Calculate taxes for each
  let totalPAYE = 0;
  const lineItems = employees.map(emp => {
    const taxData: EmployeeTaxData = {
      gross_salary: Number(emp.gross_salary),
      pension_opt_in: emp.pension_opt_in,
      pension_percentage: Number(emp.pension_percentage),
      rent_benefit: emp.rent_benefit,
      annual_rent: emp.annual_rent ? Number(emp.annual_rent) : null,
    };

    const result = calculatePAYE(taxData);
    totalPAYE += result.monthly_paye;

    return {
      employee_id: emp.id,
      employee_name: emp.name,
      gross: result.annual_gross / 12,
      pension: result.annual_pension / 12,
      rent_relief: result.annual_rent_relief / 12,
      taxable_income: result.annual_taxable_income / 12,
      paye: result.monthly_paye,
      net_pay: result.monthly_net_pay,
    };
  });

  // Insert Run
  const { data: newRun, error: runError } = await supabase
    .from("payroll_runs")
    .insert({
      business_id: business.id,
      month,
      year,
      total_paye: totalPAYE,
    })
    .select("id")
    .single();

  if (runError) return { error: runError.message };

  // Insert Line Items
  const itemsToInsert = lineItems.map(item => ({
    run_id: newRun.id,
    ...item
  }));

  const { error: itemsError } = await supabase
    .from("payroll_line_items")
    .insert(itemsToInsert);

  if (itemsError) {
    // manual rollback just in case
    await supabase.from("payroll_runs").delete().eq("id", newRun.id);
    return { error: itemsError.message };
  }

  revalidatePath("/dashboard/payroll");
  return { newRunId: newRun.id };
}
