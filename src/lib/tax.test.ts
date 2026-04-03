import { calculatePAYE, EmployeeTaxData } from './tax';

// We could use an actual test runner like jest or vitest
// For MVP, this serves as a quick assertion script that could be run via ts-node or similar.

function assertApprox(label: string, actual: number, expected: number) {
  if (Math.abs(actual - expected) > 1) {
    console.error(`❌ TEST FAILED: ${label} | Expected ~${expected}, got ${actual}`);
  } else {
    console.log(`✅ TEST PASSED: ${label} | ${actual}`);
  }
}

// Test 1: Minimum wage / low earner (Band 1 only)
const lowEarner: EmployeeTaxData = {
  gross_salary: 50_000, // 600,000 annual
  pension_opt_in: false,
  pension_percentage: 8,
  rent_benefit: false,
  annual_rent: null,
};
const res1 = calculatePAYE(lowEarner);
assertApprox("Low Earner Annual PAYE", res1.annual_paye, 0);

// Test 2: Standard middle-earner crossing into Band 2
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
const res2 = calculatePAYE(midEarner);
assertApprox("Mid Earner Annual PAYE", res2.annual_paye, 211_440);

// Test 3: High earner with max rent relief cap
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
const res3 = calculatePAYE(highEarner);
assertApprox("High Earner Annual PAYE", res3.annual_paye, 2_139_000);
