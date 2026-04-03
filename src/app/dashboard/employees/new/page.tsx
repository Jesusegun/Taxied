"use client";

import { useActionState, useState } from "react";
import { addEmployee } from "../actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewEmployeePage() {
  const [state, formAction, isPending] = useActionState(addEmployee, { error: null as string | null, success: false });
  const [hasRent, setHasRent] = useState(false);
  const [hasPension, setHasPension] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
        <Link href="/dashboard/employees" className="text-sm text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 border border-gray-100">
        <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Gross Salary (₦) *</label>
            <input
              type="number"
              name="gross_salary"
              step="0.01"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g. 150000"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="pension_opt_in"
                  name="pension_opt_in"
                  type="checkbox"
                  checked={hasPension}
                  onChange={(e) => setHasPension(e.target.checked)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="pension_opt_in" className="font-medium text-gray-700">
                  Pension Opt-In
                </label>
                <p className="text-gray-500">Is this employee enrolled in the statutory pension scheme?</p>
              </div>
            </div>

            {hasPension && (
              <div className="mt-4 ml-7">
                <label className="block text-sm font-medium text-gray-700">
                  Assumed pension contribution rate (%)
                </label>
                <input
                  type="number"
                  name="pension_percentage"
                  step="0.1"
                  defaultValue={8}
                  className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="rent_benefit"
                  name="rent_benefit"
                  type="checkbox"
                  checked={hasRent}
                  onChange={(e) => setHasRent(e.target.checked)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="rent_benefit" className="font-medium text-gray-700">
                  Rent / Housing Benefit
                </label>
                <p className="text-gray-500">Does this employee receive rent relief / housing allowance?</p>
              </div>
            </div>

            {hasRent && (
              <div className="mt-4 ml-7">
                <label className="block text-sm font-medium text-gray-700">
                  Enter actual annual rent paid (₦) (for relief calculation)
                </label>
                <input
                  type="number"
                  name="annual_rent"
                  step="0.01"
                  required={hasRent}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
