"use client";

import { useActionState, useEffect } from "react";
import { setupBusiness } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const businessSchema = z.object({
  name: z.string().min(2, "Business name is required (min 2 characters)"),
  state: z.string().min(2, "State is required (min 2 characters)"),
  tin: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export default function BusinessSetupPage() {
  const router = useRouter();
  
  const {
    register,
    formState: { errors },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
  });

  // Since we use react-hook-form, we don't strictly need useActionState,
  // but it's good to bridge it. Let's just use standard fetch/promise for the server action.
  
  // Wait, Next.js 14/15 allows importing server actions directly and calling them.
  // We can just use useActionState from react.
  const [state, formAction, isPending] = useActionState(setupBusiness, { error: null as string | null, success: false });

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 shadow bg-white rounded-xl mt-12 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Configure your Business</h2>
        <p className="mt-1 text-sm text-gray-500">
          We need a few details to set up your PAYE environment.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {state.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
            {state.error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name *</label>
          <input
            {...register("name")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g. Acme Tech Solutions"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Registration State *</label>
          <input
            {...register("state")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g. Lagos"
          />
          {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">TIN (Optional)</label>
          <input
            {...register("tin")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g. 12345678-0001"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Business Profile"}
        </button>
      </form>
    </div>
  );
}
