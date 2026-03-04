/**
 * PayCalcUK — UK Tax Calculator Engine
 * Tax Year 2025/26 (6 April 2025 – 5 April 2026)
 */

'use strict';

const TAX_YEAR = '2025/26';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const PERSONAL_ALLOWANCE = 12570;
const BLIND_PERSONS_ALLOWANCE = 3070;
const MARRIAGE_ALLOWANCE_TRANSFER = 1260;
const MARRIAGE_ALLOWANCE_RELIEF = 252; // 20% of £1,260

// Income at which PA starts tapering
const PA_TAPER_THRESHOLD = 100000;
// Income at which PA reaches zero
const PA_ZERO_THRESHOLD = 125140;

// England / Wales / Northern Ireland bands (above personal allowance)
// Frozen at 2024/25 levels until at least 2027/28
const EWNI_BANDS = [
  { limit: 37700,  rate: 0.20 }, // Basic:      £12,571 – £50,270
  { limit: 74870,  rate: 0.40 }, // Higher:     £50,271 – £125,140
  { limit: Infinity, rate: 0.45 }, // Additional: over £125,140
];

// Scotland bands (above personal allowance) — 2025/26
const SCOTLAND_BANDS = [
  { limit: 2827,   rate: 0.19 }, // Starter:      £12,571 – £15,397
  { limit: 14921,  rate: 0.20 }, // Basic:        £15,398 – £27,491
  { limit: 31092,  rate: 0.21 }, // Intermediate: £27,492 – £43,662
  { limit: 62430,  rate: 0.42 }, // Higher:       £43,663 – £75,000
  { limit: 112570, rate: 0.45 }, // Advanced:     £75,001 – £125,140
  { limit: Infinity, rate: 0.48 }, // Top:        over £125,140
];

// National Insurance (Employee Class 1) — unchanged from 2024/25
const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_RATE_STANDARD = 0.08;
const NI_RATE_UPPER = 0.02;

// Student Loan thresholds & rates — 2025/26 (RPI-linked increases)
const STUDENT_LOAN_PLANS = {
  plan1:    { threshold: 26065, rate: 0.09 },
  plan2:    { threshold: 28470, rate: 0.09 },
  plan4:    { threshold: 32745, rate: 0.09 },
  postgrad: { threshold: 21000, rate: 0.06 },
};

// Working days/hours per year
const WORKING_DAYS_PER_YEAR = 260;
const WORKING_HOURS_PER_DAY = 8;
const WORKING_HOURS_PER_YEAR = WORKING_DAYS_PER_YEAR * WORKING_HOURS_PER_DAY;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

/* ─────────────────────────────────────────────
   PERIOD CONVERSION
───────────────────────────────────────────── */

/**
 * Convert any pay period amount to annual gross salary.
 * @param {number} amount
 * @param {string} period  'annual'|'monthly'|'weekly'|'daily'|'hourly'
 * @returns {number} annual gross salary
 */
function toAnnual(amount, period) {
  switch (period) {
    case 'annual':  return amount;
    case 'monthly': return amount * MONTHS_PER_YEAR;
    case 'weekly':  return amount * WEEKS_PER_YEAR;
    case 'daily':   return amount * WORKING_DAYS_PER_YEAR;
    case 'hourly':  return amount * WORKING_HOURS_PER_YEAR;
    default:        return amount;
  }
}

/* ─────────────────────────────────────────────
   PERSONAL ALLOWANCE
───────────────────────────────────────────── */

/**
 * Calculate the effective personal allowance after tapering.
 * @param {number} income  Adjusted net income (after pension sacrifice)
 * @param {boolean} blindPerson
 * @returns {number}
 */
function calcPersonalAllowance(income, blindPerson) {
  let pa = PERSONAL_ALLOWANCE;

  // Taper: reduce by £1 for every £2 over £100,000
  if (income > PA_TAPER_THRESHOLD) {
    const reduction = Math.floor((income - PA_TAPER_THRESHOLD) / 2);
    pa = Math.max(0, pa - reduction);
  }

  // Blind person's allowance
  if (blindPerson) {
    pa += BLIND_PERSONS_ALLOWANCE;
  }

  return pa;
}

/* ─────────────────────────────────────────────
   INCOME TAX
───────────────────────────────────────────── */

/**
 * Apply tax bands progressively.
 * @param {number} taxableIncome  Income above personal allowance
 * @param {Array}  bands
 * @returns {number} tax due
 */
function applyBands(taxableIncome, bands) {
  let tax = 0;
  let remaining = taxableIncome;
  let prevLimit = 0;

  for (const band of bands) {
    if (remaining <= 0) break;
    const bandWidth = band.limit === Infinity ? remaining : Math.min(remaining, band.limit - prevLimit);
    const taxable = Math.max(0, Math.min(remaining, bandWidth));
    tax += taxable * band.rate;
    remaining -= taxable;
    prevLimit = band.limit;
  }

  return tax;
}

/**
 * Calculate income tax for England, Wales, Northern Ireland.
 * @param {number} income  Adjusted net income
 * @param {number} pa      Personal allowance
 * @returns {number}
 */
function calcEWNITax(income, pa) {
  const taxableIncome = Math.max(0, income - pa);
  return applyBands(taxableIncome, EWNI_BANDS);
}

/**
 * Calculate income tax for Scotland.
 * @param {number} income  Adjusted net income
 * @param {number} pa      Personal allowance
 * @returns {number}
 */
function calcScotlandTax(income, pa) {
  const taxableIncome = Math.max(0, income - pa);
  return applyBands(taxableIncome, SCOTLAND_BANDS);
}

/* ─────────────────────────────────────────────
   NATIONAL INSURANCE
───────────────────────────────────────────── */

/**
 * Calculate employee National Insurance contributions.
 * NI is always calculated on gross salary (not after pension sacrifice).
 * @param {number} grossSalary
 * @returns {number}
 */
function calcNI(grossSalary) {
  if (grossSalary <= NI_PRIMARY_THRESHOLD) return 0;

  let ni = 0;

  if (grossSalary <= NI_UPPER_EARNINGS_LIMIT) {
    ni = (grossSalary - NI_PRIMARY_THRESHOLD) * NI_RATE_STANDARD;
  } else {
    ni = (NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD) * NI_RATE_STANDARD
       + (grossSalary - NI_UPPER_EARNINGS_LIMIT) * NI_RATE_UPPER;
  }

  return ni;
}

/* ─────────────────────────────────────────────
   STUDENT LOAN
───────────────────────────────────────────── */

/**
 * Calculate student loan repayment.
 * @param {number} grossSalary
 * @param {string} plan  'none'|'plan1'|'plan2'|'plan4'|'postgrad'
 * @returns {number}
 */
function calcStudentLoan(grossSalary, plan) {
  if (!plan || plan === 'none') return 0;
  const config = STUDENT_LOAN_PLANS[plan];
  if (!config) return 0;
  const repayable = Math.max(0, grossSalary - config.threshold);
  return repayable * config.rate;
}

/* ─────────────────────────────────────────────
   PENSION
───────────────────────────────────────────── */

/**
 * Calculate pension contribution (salary sacrifice — pre-tax).
 * @param {number} grossSalary
 * @param {number} value
 * @param {string} unit  'percent'|'fixed'
 * @returns {number}
 */
function calcPension(grossSalary, value, unit) {
  if (!value || value <= 0) return 0;
  if (unit === 'percent') {
    return grossSalary * (Math.min(value, 100) / 100);
  }
  return Math.min(value, grossSalary);
}

/* ─────────────────────────────────────────────
   MARGINAL RATE
───────────────────────────────────────────── */

/**
 * Determine the marginal income tax rate at a given income level.
 * @param {number} income  Adjusted net income
 * @param {string} country
 * @param {number} pa      Personal allowance
 * @returns {number} marginal rate (0–1)
 */
function getMarginalIncomeTaxRate(income, country, pa) {
  const taxable = income - pa;
  if (taxable <= 0) return 0;

  // band.limit values are cumulative from start of taxable income
  const bands = country === 'scotland' ? SCOTLAND_BANDS : EWNI_BANDS;
  for (const band of bands) {
    if (band.limit === Infinity || taxable <= band.limit) return band.rate;
  }
  return bands[bands.length - 1].rate;
}

/**
 * Determine the marginal NI rate at a given gross salary.
 * @param {number} grossSalary
 * @returns {number}
 */
function getMarginalNIRate(grossSalary) {
  if (grossSalary <= NI_PRIMARY_THRESHOLD) return 0;
  if (grossSalary <= NI_UPPER_EARNINGS_LIMIT) return NI_RATE_STANDARD;
  return NI_RATE_UPPER;
}

/* ─────────────────────────────────────────────
   MAIN CALCULATION
───────────────────────────────────────────── */

/**
 * Full UK salary calculation.
 *
 * @param {object} params
 * @param {number}  params.salaryAmount     Raw input amount
 * @param {string}  params.salaryPeriod     'annual'|'monthly'|'weekly'|'daily'|'hourly'
 * @param {string}  params.country          'england'|'scotland'|'wales'|'ni'
 * @param {number}  params.pensionValue     Pension contribution value
 * @param {string}  params.pensionUnit      'percent'|'fixed'
 * @param {string}  params.studentLoan      'none'|'plan1'|'plan2'|'plan4'|'postgrad'
 * @param {boolean} params.blindPerson      Blind person's allowance
 * @param {boolean} params.marriageAllowance Marriage allowance (recipient)
 *
 * @returns {object} Full breakdown
 */
function calculate(params) {
  const {
    salaryAmount,
    salaryPeriod,
    country,
    pensionValue,
    pensionUnit,
    studentLoan,
    blindPerson,
    marriageAllowance,
  } = params;

  // 1. Convert to annual gross
  const grossAnnual = Math.max(0, toAnnual(salaryAmount, salaryPeriod));

  // 2. Pension (salary sacrifice — reduces taxable income)
  const pensionAnnual = calcPension(grossAnnual, pensionValue, pensionUnit);

  // 3. Adjusted net income (for tax purposes)
  const adjustedIncome = grossAnnual - pensionAnnual;

  // 4. Personal allowance (may taper above £100k)
  const pa = calcPersonalAllowance(adjustedIncome, blindPerson);

  // 5. Income tax
  let incomeTax = 0;
  if (country === 'scotland') {
    incomeTax = calcScotlandTax(adjustedIncome, pa);
  } else {
    incomeTax = calcEWNITax(adjustedIncome, pa);
  }

  // Marriage allowance: recipient gets £252 tax reduction
  if (marriageAllowance) {
    incomeTax = Math.max(0, incomeTax - MARRIAGE_ALLOWANCE_RELIEF);
  }

  // 6. National Insurance (on gross, not after pension sacrifice)
  const ni = calcNI(grossAnnual);

  // 7. Student loan
  const studentLoanRepayment = calcStudentLoan(grossAnnual, studentLoan);

  // 8. Take-home
  const takeHome = grossAnnual - incomeTax - ni - pensionAnnual - studentLoanRepayment;

  // 9. Rates
  const totalDeductions = incomeTax + ni;
  const effectiveTaxRate = grossAnnual > 0 ? (totalDeductions / grossAnnual) * 100 : 0;

  const marginalITRate = getMarginalIncomeTaxRate(adjustedIncome, country, pa);
  const marginalNIRate = getMarginalNIRate(grossAnnual);
  const marginalRate = (marginalITRate + marginalNIRate) * 100;

  return {
    // Annual figures
    grossAnnual,
    incomeTax,
    ni,
    pensionAnnual,
    studentLoanRepayment,
    takeHome,

    // Derived
    personalAllowance: pa,
    effectiveTaxRate,
    marginalRate,

    // Monthly
    grossMonthly:   grossAnnual / MONTHS_PER_YEAR,
    taxMonthly:     incomeTax / MONTHS_PER_YEAR,
    niMonthly:      ni / MONTHS_PER_YEAR,
    pensionMonthly: pensionAnnual / MONTHS_PER_YEAR,
    loanMonthly:    studentLoanRepayment / MONTHS_PER_YEAR,
    takeHomeMonthly: takeHome / MONTHS_PER_YEAR,

    // Weekly
    grossWeekly:   grossAnnual / WEEKS_PER_YEAR,
    taxWeekly:     incomeTax / WEEKS_PER_YEAR,
    niWeekly:      ni / WEEKS_PER_YEAR,
    pensionWeekly: pensionAnnual / WEEKS_PER_YEAR,
    loanWeekly:    studentLoanRepayment / WEEKS_PER_YEAR,
    takeHomeWeekly: takeHome / WEEKS_PER_YEAR,
  };
}

/* ─────────────────────────────────────────────
   FORMATTING HELPERS
───────────────────────────────────────────── */

/**
 * Format a number as GBP currency.
 * @param {number} value
 * @param {boolean} showPence  Show decimal places for small amounts
 * @returns {string}
 */
function formatCurrency(value, showPence = false) {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-GB', {
    minimumFractionDigits: showPence ? 2 : 0,
    maximumFractionDigits: showPence ? 2 : 0,
  });
  return `£${formatted}`;
}

/**
 * Format a percentage.
 * @param {number} value  0–100
 * @param {number} decimals
 * @returns {string}
 */
function formatPercent(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

// Export for use in app.js
window.UKCalc = {
  calculate,
  toAnnual,
  formatCurrency,
  formatPercent,
  TAX_YEAR,
};
