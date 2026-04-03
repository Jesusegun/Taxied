/**
 * Tax Engine for Nigerian PAYE (2025 Reforms assumed for MVP).
 * 
 * DISCLAIMER:
 * Tax logic is provisional and must be validated against official sources.
 * Generated based on assumed 2025 Nigeria Tax Act rules. Verify with a licensed tax professional.
 */

export interface EmployeeTaxData {
  gross_salary: number; // Monthly gross
  pension_opt_in: boolean;
  pension_percentage: number;
  rent_benefit: boolean;
  annual_rent: number | null;
}

export interface TaxCalculationResult {
  annual_gross: number;
  annual_pension: number;
  annual_rent_relief: number;
  annual_taxable_income: number;
  annual_paye: number;
  monthly_paye: number;
  monthly_net_pay: number;
}

export function calculatePAYE(data: EmployeeTaxData): TaxCalculationResult {
  // 1. Annualize Gross
  const annual_gross = data.gross_salary * 12;

  // 2. Pension Deduction
  let annual_pension = 0;
  if (data.pension_opt_in) {
    // e.g. 8% of annual gross
    annual_pension = annual_gross * (data.pension_percentage / 100);
  }

  // 3. Rent Relief
  let annual_rent_relief = 0;
  if (data.rent_benefit && data.annual_rent) {
    const twentyPercent = data.annual_rent * 0.20;
    annual_rent_relief = Math.min(twentyPercent, 500_000); // Capped at 500,000
  }

  // 4. Taxable Income
  let annual_taxable_income = annual_gross - annual_pension - annual_rent_relief;
  if (annual_taxable_income < 0) {
    annual_taxable_income = 0;
  }

  // 5. Apply Progressive Tax Bands
  /**
   * - Band 1 (0 - 800,000): Tax = 0
   * - Band 2 (800,001 - 2,200,000): 15% on max 1,400,000
   * - Band 3 (2,200,001 - 5,000,000): 18% on max 2,800,000
   * - Band 4 (5,000,001 - 10,000,000): 21% on max 5,000,000
   * - Band 5 (Above 10,000,000): 25% on remaining amount
   */
  let remaining_income = annual_taxable_income;
  let total_annual_tax = 0;

  // Band 1: 0 - 800,000 (0%)
  const band1_max = 800_000;
  if (remaining_income > band1_max) {
    remaining_income -= band1_max;

    // Band 2: 800,001 - 2,200,000 (15%)
    const band2_max = 1_400_000; // 2.2M - 800k
    const band2_taxable = Math.min(remaining_income, band2_max);
    total_annual_tax += band2_taxable * 0.15;
    remaining_income -= band2_taxable;

    if (remaining_income > 0) {
      // Band 3: 2,200,001 - 5,000,000 (18%)
      const band3_max = 2_800_000; // 5M - 2.2M
      const band3_taxable = Math.min(remaining_income, band3_max);
      total_annual_tax += band3_taxable * 0.18;
      remaining_income -= band3_taxable;

      if (remaining_income > 0) {
        // Band 4: 5,000,001 - 10,000,000 (21%)
        const band4_max = 5_000_000; // 10M - 5M
        const band4_taxable = Math.min(remaining_income, band4_max);
        total_annual_tax += band4_taxable * 0.21;
        remaining_income -= band4_taxable;

        if (remaining_income > 0) {
          // Band 5: Above 10,000,000 (25%)
          total_annual_tax += remaining_income * 0.25;
        }
      }
    }
  }

  // 6. Finalize Monthly Numbers & Rounding
  const monthly_paye = Math.round(total_annual_tax / 12);
  const monthly_net_pay = data.gross_salary - monthly_paye - Math.round(annual_pension / 12);

  return {
    annual_gross,
    annual_pension,
    annual_rent_relief,
    annual_taxable_income,
    annual_paye: total_annual_tax,
    monthly_paye,
    monthly_net_pay,
  };
}
