import { describe, it, expect } from 'vitest';
import { calculatePAYE, EmployeeTaxData } from './tax';

describe('calculatePAYE', () => {
  it('handles minimum wage / low earner (Band 1 only)', () => {
    const lowEarner: EmployeeTaxData = {
      gross_salary: 50_000, // 600,000 annual
      pension_opt_in: false,
      pension_percentage: 8,
      rent_benefit: false,
      annual_rent: null,
    };
    const res = calculatePAYE(lowEarner);
    expect(res.annual_paye).toBe(0);
  });

  it('handles standard middle-earner crossing into Band 2', () => {
    const midEarner: EmployeeTaxData = {
      gross_salary: 200_000, // 2,400,000 annual
      pension_opt_in: true,
      pension_percentage: 8,
      rent_benefit: false,
      annual_rent: null,
    };
    // Pension = 8% of 2.4M = 192,000
    // Taxable = 2.4M - 192,000 = 2,208,000
    // Band 1 (0-800k) = 0
    // Band 2 (800k-2.2M) = 1.4M * 0.15 = 210,000
    // Band 3 (2.2M-5M) = 8,000 * 0.18 = 1,440
    // Total Annual PAYE = 211,440
    const res = calculatePAYE(midEarner);
    expect(res.annual_paye).toBeCloseTo(211_440, 0);
  });

  it('handles high earner with max rent relief cap', () => {
    const highEarner: EmployeeTaxData = {
      gross_salary: 1_000_000, // 12,000,000 annual
      pension_opt_in: false,
      pension_percentage: 0,
      rent_benefit: true,
      annual_rent: 3_000_000, // 20% of 3M = 600,000. Cap pushes it to 500,000 max.
    };
    // Taxable = 12,000,000 - 500,000 = 11,500,000
    // Band 1 = 0
    // Band 2 = 1.4M * 0.15 = 210k
    // Band 3 = 2.8M * 0.18 = 504k
    // Band 4 = 5.0M * 0.21 = 1.05M
    // Band 5 = 1.5M * 0.25 = 375k
    // Total Annual PAYE = 210,000 + 504,000 + 1,050,000 + 375,000 = 2,139,000
    const res = calculatePAYE(highEarner);
    expect(res.annual_paye).toBeCloseTo(2_139_000, 0);
  });
});
