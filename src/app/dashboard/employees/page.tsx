import { createClient } from "@/utils/supabase/server";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, Plus, Trash2 } from "lucide-react";
import { deleteEmployee } from "./actions";

export default async function EmployeesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) return null;

  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (!employees || employees.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <EmptyState 
          icon={Users}
          title="No employees found"
          description="You haven't added any employees to your payroll yet. Add your first employee to continue."
          action={
            <Link href="/dashboard/employees/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Employee
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <Link href="/dashboard/employees/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
        <ul className="divide-y divide-gray-200">
          {employees.map((emp) => (
            <li key={emp.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 truncate">{emp.name}</p>
                    <p className="mt-1 flex text-sm text-gray-500">
                      Gross: {formatCurrency(emp.gross_salary)} /month
                    </p>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5 space-y-1 text-xs text-gray-500">
                    <p>Pension: {emp.pension_opt_in ? `Yes (${emp.pension_percentage}%)` : "No"}</p>
                    <p>Rent Relief: {emp.rent_benefit ? `Yes (${formatCurrency(emp.annual_rent)}/yr)` : "No"}</p>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <form action={async () => {
                    "use server";
                    await deleteEmployee(emp.id);
                  }}>
                    <button type="submit" className="text-red-500 hover:text-red-700 p-2 border border-transparent rounded-md hover:bg-red-50 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
