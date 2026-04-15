import { createClient } from "@/utils/supabase/server";
import { formatCurrency, formatMonthYear } from "@/lib/formatters";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, Plus, ChevronRight } from "lucide-react";

export default async function PayrollRunsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) return null;

  const { data: runs } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("business_id", business.id)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (!runs || runs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <EmptyState 
          icon={FileText}
          title="No payroll runs yet"
          description="Generate your first payroll run to calculate PAYE for your employees."
          action={
            <Link href="/dashboard/payroll/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Run Payroll
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Runs</h1>
        <Link href="/dashboard/payroll/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Run Payroll
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
        <ul className="divide-y divide-gray-200">
          {runs.map((run) => (
            <li key={run.id}>
              <Link href={`/dashboard/payroll/${run.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {formatMonthYear(run.month, run.year)}
                      </p>
                      <p className="mt-1 flex text-sm text-gray-500">
                        Total Remittance: {formatCurrency(run.total_paye)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
