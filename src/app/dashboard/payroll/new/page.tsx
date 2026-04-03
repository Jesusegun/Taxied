"use client";

import { useState } from "react";
import { checkPayrollExists, executePayrollRun } from "../actions";
import { formatMonthYear } from "@/lib/formatters";
import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPayrollPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [needsOverwrite, setNeedsOverwrite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const month = formData.get("month") as string;
    const year = parseInt(formData.get("year") as string, 10);

    // If not already prompted for overwrite, check existence first
    if (!needsOverwrite) {
      const { exists } = await checkPayrollExists(month, year);
      if (exists) {
        setNeedsOverwrite(true);
        setLoading(false);
        return;
      }
    }

    // Execute run
    const result = await executePayrollRun(month, year, needsOverwrite);
    if (result.error) {
      setError(result.error);
      setNeedsOverwrite(false); // reset if error
    } else {
      router.push(`/dashboard/payroll/${result.newRunId}`);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Run Payroll</h1>
        <Link href="/dashboard/payroll" className="text-sm text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <select
                name="month"
                required
                disabled={needsOverwrite}
                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border disabled:bg-gray-100"
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                required
                disabled={needsOverwrite}
                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border disabled:bg-gray-100"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </div>

          {needsOverwrite && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 animate-in fade-in">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800 font-medium">
                  A payroll run for this period already exists. 
                </p>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                Running payroll again will <strong>overwrite</strong> the previous run and re-freeze all current employee numbers. Do you want to overwrite it?
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3">
            {needsOverwrite && (
              <button
                type="button"
                onClick={() => setNeedsOverwrite(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel Overwrite
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center flex-1 sm:flex-none py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none disabled:opacity-50 ${needsOverwrite ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : needsOverwrite ? "Confirm Overwrite" : "Generate Payroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
