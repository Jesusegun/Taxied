import { createClient } from "@/utils/supabase/server";
import { formatCurrency, formatMonthYear } from "@/lib/formatters";
import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";

export default async function PayrollDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: run } = await supabase
    .from("payroll_runs")
    .select("*, businesses(name, tin, state)")
    .eq("id", id)
    .single();

  if (!run) return <div>Run not found</div>;

  const { data: items } = await supabase
    .from("payroll_line_items")
    .select("*")
    .eq("run_id", id)
    .order("employee_name", { ascending: true });

  const totalGross = items?.reduce((sum, it) => sum + Number(it.gross), 0) || 0;
  const totalTaxable = items?.reduce((sum, it) => sum + Number(it.taxable_income), 0) || 0;
  const totalPaye = Number(run.total_paye);
  const totalNet = items?.reduce((sum, it) => sum + Number(it.net_pay), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link href="/dashboard/payroll" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 bg-white">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Payroll Schedule — {formatMonthYear(run.month, run.year)}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Employee Remittance Table</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Frozen data generated organically based on the 2025 Act logic.
            </p>
          </div>
          <div>
            <a 
              href={`/api/pdf?runId=${id}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taxable Income</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider">PAYE (Tax)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.employee_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                    {formatCurrency(Number(item.gross))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                    {formatCurrency(Number(item.taxable_income))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 font-semibold text-right font-mono">
                    {formatCurrency(Number(item.paye))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                    {formatCurrency(Number(item.net_pay))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th scope="row" className="px-6 py-4 text-base font-bold text-gray-900 text-left">
                  TOTALS
                </th>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right font-mono">
                  {formatCurrency(totalGross)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right font-mono">
                  {formatCurrency(totalTaxable)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-green-700 bg-green-50 text-right font-mono border-x border-green-200">
                  {formatCurrency(totalPaye)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right font-mono">
                  {formatCurrency(totalNet)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
