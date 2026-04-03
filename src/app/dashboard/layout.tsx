import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Calculator, Users, FileText } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if business exists
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Calculator className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Taxied</span>
              </div>
              {business && (
                <nav className="ml-6 flex items-center space-x-4">
                  <Link href="/dashboard" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                    Overview
                  </Link>
                  <Link href="/dashboard/employees" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Employees
                  </Link>
                  <Link href="/dashboard/payroll" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Payroll Runs
                  </Link>
                </nav>
              )}
            </div>
            <div className="flex items-center">
              {business && (
                <span className="text-sm text-gray-500 mr-4 border-r pr-4">{business.name}</span>
              )}
              <form action="/auth/logout" method="post">
                <button type="submit" className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
