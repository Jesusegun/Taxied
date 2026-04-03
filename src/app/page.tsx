"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Sparkles, Building2, BriefcaseBusiness, AlertCircle } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

export default function EligibilityCheckPage() {
  const [step, setStep] = useState<Step>(1);
  const [turnover, setTurnover] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [sector, setSector] = useState("");

  const handleNext = () => setStep((prev) => (prev + 1) as Step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-slate-100 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background blur blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-xl w-full space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20 transform hover:-translate-y-1 transition-transform">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tight">
            Taxied
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            SME Tax Compliance — Redefined for the 2025 Reforms.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-2xl p-8 sm:p-10">
          
          {/* Progress Indicators */}
          <div className="flex space-x-2 mb-8 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= i ? 'w-8 bg-indigo-600' : 'w-4 bg-slate-200'
                }`} 
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Annual Turnover</h3>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  What is your estimated gross annual turnover?
                </label>
                <div className="relative">
                  <select
                    value={turnover}
                    onChange={(e) => setTurnover(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3.5 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-white/50 backdrop-blur-sm transition-shadow shadow-sm text-slate-800 font-medium"
                  >
                    <option value="" disabled className="text-slate-400">Select a range...</option>
                    <option value="under25m" className="text-slate-900">Under ₦25,000,000 (Small)</option>
                    <option value="under100m" className="text-slate-900">₦25,000,000 - ₦100,000,000 (Medium)</option>
                    <option value="over100m" className="text-slate-900">Over ₦100,000,000 (Large)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!turnover}
                className="hover-lift w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Continue <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <BriefcaseBusiness className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Business Structure</h3>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  How is your entity registered?
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3.5 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-white/50 backdrop-blur-sm transition-shadow shadow-sm text-slate-800 font-medium"
                >
                  <option value="" disabled className="text-slate-400">Select structure...</option>
                  <option value="sole_proprietor" className="text-slate-900">Business Name (Sole Proprietor)</option>
                  <option value="limited" className="text-slate-900">Limited Liability Company (LTD)</option>
                  <option value="partnership" className="text-slate-900">Partnership</option>
                </select>
              </div>
              <button
                onClick={handleNext}
                disabled={!businessType}
                className="hover-lift w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Continue <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Industry Sector</h3>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  In which primary sector do you operate?
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3.5 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-white/50 backdrop-blur-sm transition-shadow shadow-sm text-slate-800 font-medium"
                >
                  <option value="" disabled className="text-slate-400">Select industry...</option>
                  <option value="professional" className="text-slate-900">Professional Services (Law, Tech, Consulting)</option>
                  <option value="retail" className="text-slate-900">Retail & Commerce</option>
                  <option value="manufacturing" className="text-slate-900">Manufacturing</option>
                  <option value="other" className="text-slate-900">Other / Uncategorized</option>
                </select>
              </div>
              <button
                onClick={handleNext}
                disabled={!sector}
                className="hover-lift w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Generate Assessment <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-indigo-950">Your Tax Profile</h3>
                </div>
                <ul className="space-y-3 text-indigo-900/80 text-sm font-medium">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2 flex-shrink-0" />
                    Based on your inputs, you likely qualify as a small business.
                  </li>
                  {turnover === "under25m" && (
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2 flex-shrink-0" />
                      You may be exempt from Companies Income Tax under the act.
                    </li>
                  )}
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 mr-2 flex-shrink-0" />
                    <strong className="text-indigo-950">You strictly need to handle PAYE for your employees.</strong>
                  </li>
                </ul>
              </div>

              <div className="flex bg-amber-50/80 backdrop-blur-sm rounded-xl p-4 text-xs text-amber-800 border border-amber-200 shadow-sm transition-colors">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  These results are based on your inputs and assumed MVP logic. You must confirm this interpretation with a licensed tax professional.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/signup"
                  className="hover-lift w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 transition-all"
                >
                  Configure your Payroll →
                </Link>
                <div className="mt-6 text-center">
                  <Link href="/login" className="font-semibold text-slate-500 hover:text-indigo-600 text-sm transition-colors">
                    Already have an account? Log in securely
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
