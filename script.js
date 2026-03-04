/**
 * SalaryUKCalc.com — Shared Calculator Logic
 * Handles UK Salary → Hourly and Hourly → Salary calculators.
 * EU and Global country estimators use data/countries.js directly via inline scripts.
 *
 * Version: 2.0 — Multi-region platform
 */

// UK Income Tax Configuration — 2025/26
const TAX_CONFIG = {
    personalAllowance: 12570,
    personalAllowanceTaperThreshold: 100000,
    personalAllowanceTaperRate: 0.5, // £1 reduction per £2 over threshold

    bands: {
        'ENG_2025_26': [
            { name: "Basic rate",      rate: 0.20, upTo: 37700  },
            { name: "Higher rate",     rate: 0.40, upTo: 112570 },
            { name: "Additional rate", rate: 0.45, upTo: Infinity }
        ],
        'SCT_2025_26': [
            { name: "Starter rate",      rate: 0.19, upTo: 2306   },
            { name: "Basic rate",        rate: 0.20, upTo: 13991  },
            { name: "Intermediate rate", rate: 0.21, upTo: 31092  },
            { name: "Higher rate",       rate: 0.42, upTo: 62430  },
            { name: "Advanced rate",     rate: 0.45, upTo: 112570 },
            { name: "Top rate",          rate: 0.48, upTo: Infinity }
        ]
    }
};

/**
 * Calculate Personal Allowance with tapering for high earners
 */
function calculatePersonalAllowance(grossIncome) {
    const { personalAllowance, personalAllowanceTaperThreshold, personalAllowanceTaperRate } = TAX_CONFIG;

    if (grossIncome <= personalAllowanceTaperThreshold) {
        return personalAllowance;
    }

    const excessIncome = grossIncome - personalAllowanceTaperThreshold;
    const reduction = Math.floor(excessIncome * personalAllowanceTaperRate);
    const adjustedPA = Math.max(0, personalAllowance - reduction);

    return adjustedPA;
}

/**
 * Calculate tax breakdown by band
 */
function calculateTaxBreakdown(taxableIncome, bands) {
    const breakdown = [];
    let remaining = taxableIncome;
    let prevLimit = 0;

    for (const band of bands) {
        const bandCap = band.upTo;
        const bandSize = (bandCap === Infinity) ? remaining : Math.max(0, Math.min(remaining, bandCap - prevLimit));

        if (bandSize > 0) {
            const tax = bandSize * band.rate;
            breakdown.push({
                bandName: band.name,
                rate: band.rate,
                amountInBand: bandSize,
                taxInBand: tax
            });

            remaining -= bandSize;
            prevLimit = bandCap;

            if (remaining <= 0) break;
        }
    }

    return breakdown;
}

/**
 * Calculate Income Tax (returns detailed breakdown)
 */
function calculateIncomeTax(grossIncome, region, taxYear) {
    // Calculate Personal Allowance with tapering
    const personalAllowance = calculatePersonalAllowance(grossIncome);

    // Calculate taxable income
    const taxableIncome = Math.max(0, grossIncome - personalAllowance);

    // Get appropriate tax bands
    const bandKey = `${region}_${taxYear}`;
    const bands = TAX_CONFIG.bands[bandKey];

    if (!bands) {
        console.error(`Tax bands not found for ${bandKey}`);
        return {
            totalTax: 0,
            breakdown: [],
            personalAllowance,
            taxableIncome: 0,
            effectiveRate: 0
        };
    }

    // Calculate breakdown
    const breakdown = calculateTaxBreakdown(taxableIncome, bands);

    // Sum total tax
    const totalTax = breakdown.reduce((sum, band) => sum + band.taxInBand, 0);

    // Calculate effective rate
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) : 0;

    return {
        totalTax,
        breakdown,
        personalAllowance,
        taxableIncome,
        effectiveRate
    };
}

// ─── Utility: safe DOM setter ────────────────────────────────────────────────
// Sets textContent only if the element exists — prevents crashes when a page
// uses a subset of the result elements.
function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

document.addEventListener('DOMContentLoaded', () => {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // ─── CALCULATOR 1: Salary → Hourly ───────────────────────────────────────
    // Used on: index.html (homepage), uk/salary-calculator.html
    if (document.getElementById('salary-input')) {

        const salaryInput  = document.getElementById('salary-input');
        const hoursInput   = document.getElementById('hours-input');
        const weeksInput   = document.getElementById('weeks-input');
        const daysInput    = document.getElementById('days-input');
        const regionSelect = document.getElementById('region-select');
        const taxyearSelect = document.getElementById('taxyear-select');
        const resetBtn     = document.getElementById('reset-btn');
        const taxBreakdownBody = document.getElementById('tax-breakdown-body');

        const calculateFromSalary = () => {
            const salary  = parseFloat(salaryInput.value)  || 0;
            const hours   = parseFloat(hoursInput.value)   || 0;
            const weeks   = parseFloat(weeksInput.value)   || 0;
            const days    = parseFloat(daysInput.value)    || 0;
            const region  = regionSelect ? regionSelect.value : 'ENG';
            const taxYear = taxyearSelect ? taxyearSelect.value : '2025_26';

            if (salary < 0 || hours <= 0 || weeks <= 0 || days <= 0) return;

            // ── Gross rates ──
            const weeklyPay  = salary / weeks;
            const dailyPay   = weeklyPay / days;
            const hourlyRate = weeklyPay / hours;
            const monthlyPay = salary / 12;

            setEl('result-hourly',  formatCurrency(hourlyRate));
            setEl('result-daily',   formatCurrency(dailyPay));
            setEl('result-weekly',  formatCurrency(weeklyPay));
            setEl('result-monthly', formatCurrency(monthlyPay));
            setEl('result-annual',  formatCurrency(salary));
            setEl('result-gross',   formatCurrency(salary));

            // ── Tax calculation ──
            const taxData  = calculateIncomeTax(salary, region, taxYear);
            const netAnnual  = salary - taxData.totalTax;
            const netMonthly = netAnnual / 12;
            const netWeekly  = netAnnual / weeks;
            const netDaily   = netWeekly / days;
            const netHourly  = netWeekly / hours;

            setEl('result-net-hourly',  formatCurrency(netHourly));
            setEl('result-net-daily',   formatCurrency(netDaily));
            setEl('result-net-weekly',  formatCurrency(netWeekly));
            setEl('result-net-monthly', formatCurrency(netMonthly));
            setEl('result-net-annual',  formatCurrency(netAnnual));

            // ── Tax summary ──
            setEl('result-personal-allowance', formatCurrency(taxData.personalAllowance));
            setEl('result-taxable-income',     formatCurrency(taxData.taxableIncome));
            setEl('result-tax-total',          formatCurrency(taxData.totalTax));
            setEl('result-effective-rate',     (taxData.effectiveRate * 100).toFixed(1) + '%');

            // ── Tax breakdown table ──
            if (taxBreakdownBody) {
                taxBreakdownBody.innerHTML = '';
                taxData.breakdown.forEach(band => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${band.bandName}</td>
                        <td>${(band.rate * 100).toFixed(0)}%</td>
                        <td>${formatCurrency(band.amountInBand)}</td>
                        <td>${formatCurrency(band.taxInBand)}</td>
                    `;
                    taxBreakdownBody.appendChild(row);
                });
            }
        };

        // Event listeners — recalculate on any input change
        [salaryInput, hoursInput, weeksInput, daysInput, regionSelect, taxyearSelect]
            .filter(Boolean)
            .forEach(el => {
                el.addEventListener('input',  calculateFromSalary);
                el.addEventListener('change', calculateFromSalary);
            });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                salaryInput.value  = 30000;
                hoursInput.value   = 37.5;
                weeksInput.value   = 52;
                daysInput.value    = 5;
                if (regionSelect)  regionSelect.value  = 'ENG';
                if (taxyearSelect) taxyearSelect.value = '2025_26';
                calculateFromSalary();
            });
        }

        // Run on load
        calculateFromSalary();
    }

    // ─── CALCULATOR 2: Hourly → Salary ───────────────────────────────────────
    // Used on: hourly-to-salary.html
    if (document.getElementById('hourly-input')) {

        const hourlyInput  = document.getElementById('hourly-input');
        const hoursInput   = document.getElementById('hours-input');
        const weeksInput   = document.getElementById('weeks-input');
        const daysInput    = document.getElementById('days-input');
        const regionSelect = document.getElementById('region-select');
        const taxyearSelect = document.getElementById('taxyear-select');
        const resetBtn     = document.getElementById('reset-btn');
        const taxBreakdownBody = document.getElementById('tax-breakdown-body');

        const calculateFromHourly = () => {
            const hourly  = parseFloat(hourlyInput.value)  || 0;
            const hours   = parseFloat(hoursInput.value)   || 0;
            const weeks   = parseFloat(weeksInput.value)   || 0;
            const days    = parseFloat(daysInput.value)    || 0;
            const region  = regionSelect ? regionSelect.value : 'ENG';
            const taxYear = taxyearSelect ? taxyearSelect.value : '2025_26';

            if (hourly < 0 || hours <= 0 || weeks <= 0 || days <= 0) return;

            // ── Gross rates ──
            const weeklyPay    = hourly * hours;
            const annualSalary = weeklyPay * weeks;
            const dailyPay     = weeklyPay / days;
            const monthlyPay   = annualSalary / 12;

            setEl('result-salary',  formatCurrency(annualSalary));
            setEl('result-weekly',  formatCurrency(weeklyPay));
            setEl('result-daily',   formatCurrency(dailyPay));
            setEl('result-monthly', formatCurrency(monthlyPay));

            // ── Tax calculation ──
            const taxData    = calculateIncomeTax(annualSalary, region, taxYear);
            const netAnnual  = annualSalary - taxData.totalTax;
            const netMonthly = netAnnual / 12;
            const netWeekly  = netAnnual / weeks;
            const netDaily   = netWeekly / days;
            const netHourly  = netWeekly / hours;

            setEl('result-net-hourly',  formatCurrency(netHourly));
            setEl('result-net-daily',   formatCurrency(netDaily));
            setEl('result-net-weekly',  formatCurrency(netWeekly));
            setEl('result-net-monthly', formatCurrency(netMonthly));
            setEl('result-net-annual',  formatCurrency(netAnnual));

            // ── Tax summary ──
            setEl('result-personal-allowance', formatCurrency(taxData.personalAllowance));
            setEl('result-taxable-income',     formatCurrency(taxData.taxableIncome));
            setEl('result-tax-total',          formatCurrency(taxData.totalTax));
            setEl('result-effective-rate',     (taxData.effectiveRate * 100).toFixed(1) + '%');

            // ── Tax breakdown table ──
            if (taxBreakdownBody) {
                taxBreakdownBody.innerHTML = '';
                taxData.breakdown.forEach(band => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${band.bandName}</td>
                        <td>${(band.rate * 100).toFixed(0)}%</td>
                        <td>${formatCurrency(band.amountInBand)}</td>
                        <td>${formatCurrency(band.taxInBand)}</td>
                    `;
                    taxBreakdownBody.appendChild(row);
                });
            }
        };

        // Event listeners
        [hourlyInput, hoursInput, weeksInput, daysInput, regionSelect, taxyearSelect]
            .filter(Boolean)
            .forEach(el => {
                el.addEventListener('input',  calculateFromHourly);
                el.addEventListener('change', calculateFromHourly);
            });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                hourlyInput.value  = 15;
                hoursInput.value   = 37.5;
                weeksInput.value   = 52;
                daysInput.value    = 5;
                if (regionSelect)  regionSelect.value  = 'ENG';
                if (taxyearSelect) taxyearSelect.value = '2025_26';
                calculateFromHourly();
            });
        }

        // Run on load
        calculateFromHourly();
    }

});
