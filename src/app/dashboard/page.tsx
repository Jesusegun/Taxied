import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FileText } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) {
    redirect("/dashboard/setup");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {business.name}</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link href="/dashboard/employees" className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-blue-500 transition block">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Manage Employees</h3>
              <p className="mt-1 text-sm text-gray-500">Add or edit your workforce data</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/payroll" className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-blue-500 transition block">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Run Payroll</h3>
              <p className="mt-1 text-sm text-gray-500">Calculate PAYE and generate schedule</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
