/**
 * UK Salary Calculator - Shared Logic
 * Handles calculations for both Salary -> Hourly and Hourly -> Salary pages.
 */

// ============================================
// UK INCOME TAX CALCULATION MODULE
// ============================================

// Personal Allowance for 2025/26
const PERSONAL_ALLOWANCE_FULL = 12570;
const PA_TAPER_THRESHOLD = 100000;
const TOP_RATE_THRESHOLD = 125140; // Top rate always starts here regardless of PA

// Taxable band sizes (not gross endpoints)
const TAXABLE_BANDS = {
    ENG_2025_26: [
        { name: "Basic rate", rate: 0.20, taxableSize: 37700 },
        { name: "Higher rate", rate: 0.40, taxableSize: null }, // Goes to top rate threshold
        { name: "Additional rate", rate: 0.45, taxableSize: null } // Infinity
    ],
    SCO_2025_26: [
        { name: "Starter rate", rate: 0.19, taxableSize: 2827 },
        { name: "Basic rate", rate: 0.20, taxableSize: 12094 }, // 14921 - 2827
        { name: "Intermediate rate", rate: 0.21, taxableSize: 16171 }, // 31092 - 14921
        { name: "Higher rate", rate: 0.42, taxableSize: 31338 }, // 62430 - 31092
        { name: "Advanced rate", rate: 0.45, taxableSize: null }, // Goes to top rate threshold
        { name: "Top rate", rate: 0.48, taxableSize: null } // Infinity
    ]
};

/**
 * Calculate Personal Allowance with tapering for high earners
 * PA reduces by £1 for every £2 over £100,000
 */
function calculatePersonalAllowance(grossIncome) {
    if (grossIncome <= PA_TAPER_THRESHOLD) {
        return PERSONAL_ALLOWANCE_FULL;
    }

    const reduction = (grossIncome - PA_TAPER_THRESHOLD) / 2;
    const personalAllowance = Math.max(0, PERSONAL_ALLOWANCE_FULL - reduction);
    return personalAllowance;
}

/**
 * Calculate taxable income (gross - personal allowance)
 */
function calculateTaxableIncome(grossIncome, personalAllowance) {
    return Math.max(0, grossIncome - personalAllowance);
}

/**
 * Build tax bands dynamically based on actual Personal Allowance
 * This ensures bands shift correctly when PA tapers
 */
function buildTaxBands(personalAllowance, region) {
    const bandTemplates = TAXABLE_BANDS[region] || TAXABLE_BANDS.ENG_2025_26;
    const bands = [];
    let cumulativeTaxable = 0;

    for (let i = 0; i < bandTemplates.length; i++) {
        const template = bandTemplates[i];
        let grossUpTo;

        if (template.taxableSize === null) {
            // Special handling for bands that extend to top rate threshold or infinity
            if (i === bandTemplates.length - 1) {
                // Last band goes to infinity
                grossUpTo = Infinity;
            } else {
                // Penultimate band goes to top rate threshold
                grossUpTo = TOP_RATE_THRESHOLD;
            }
        } else {
            // Normal band: PA + cumulative taxable
            cumulativeTaxable += template.taxableSize;
            grossUpTo = personalAllowance + cumulativeTaxable;
        }

        bands.push({
            name: template.name,
            rate: template.rate,
            grossUpTo: grossUpTo
        });
    }

    return bands;
}

/**
 * Calculate Income Tax with band-by-band breakdown
 * Builds bands dynamically from actual PA, then calculates tax
 * Returns: { totalTax: number, breakdown: array }
 */
function calculateIncomeTax(grossIncome, personalAllowance, region) {
    const bands = buildTaxBands(personalAllowance, region);
    const breakdown = [];
    let totalTax = 0;
    let prevGrossThreshold = personalAllowance;

    for (const band of bands) {
        const currentGrossThreshold = band.grossUpTo;

        // Calculate how much gross income falls in this band
        const grossInBand = Math.max(0, Math.min(grossIncome, currentGrossThreshold) - prevGrossThreshold);

        // This gross amount is all taxable (since it's above PA)
        const taxableInBand = grossInBand;
        const tax = taxableInBand * band.rate;

        breakdown.push({
            name: band.name,
            rate: band.rate,
            amountInBand: taxableInBand,
            taxInBand: tax
        });

        totalTax += tax;
        prevGrossThreshold = currentGrossThreshold;

        // Stop if we've processed all income
        if (grossIncome <= currentGrossThreshold) break;
    }

    return { totalTax, breakdown };
}

document.addEventListener('DOMContentLoaded', () => {
    const isSalaryPage = document.getElementById('salary-input');
    const isHourlyPage = document.getElementById('hourly-input');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    /**
     * CALCULATOR 1: Salary -> Hourly
     */
    if (isSalaryPage) {
        const salaryInput = document.getElementById('salary-input');
        const hoursInput = document.getElementById('hours-input');
        const weeksInput = document.getElementById('weeks-input');
        const daysInput = document.getElementById('days-input');
        const regionSelect = document.getElementById('region-select');
        const taxYearSelect = document.getElementById('taxyear-select');
        const resetBtn = document.getElementById('reset-btn');

        const resultHourly = document.getElementById('result-hourly');
        const resultWeekly = document.getElementById('result-weekly');
        const resultDaily = document.getElementById('result-daily');

        // Net result elements
        const resultNetAnnual = document.getElementById('result-net-annual');
        const resultNetWeekly = document.getElementById('result-net-weekly');
        const resultNetDaily = document.getElementById('result-net-daily');
        const resultNetHourly = document.getElementById('result-net-hourly');

        // Tax summary elements
        const resultPersonalAllowance = document.getElementById('result-personal-allowance');
        const resultTaxableIncome = document.getElementById('result-taxable-income');
        const resultTaxTotal = document.getElementById('result-tax-total');
        const resultEffectiveRate = document.getElementById('result-effective-rate');

        // Tax breakdown table
        const taxBreakdownBody = document.getElementById('tax-breakdown-body');

        const calculateFromSalary = () => {
            let salary = parseFloat(salaryInput.value) || 0;
            let hours = parseFloat(hoursInput.value) || 0;
            let weeks = parseFloat(weeksInput.value) || 0;
            let days = parseFloat(daysInput.value) || 0;
            const region = regionSelect ? regionSelect.value : 'ENG_2025_26';

            if (salary < 0 || hours <= 0 || weeks <= 0 || days <= 0) {
                return; // Invalid input, do nothing or show error
            }

            // GROSS Calculation Logic (existing)
            const weeklyPay = salary / weeks;
            const dailyPay = weeklyPay / days;
            const hourlyRate = weeklyPay / hours;

            // Update GROSS DOM (existing)
            resultHourly.textContent = formatCurrency(hourlyRate);
            resultWeekly.textContent = formatCurrency(weeklyPay);
            resultDaily.textContent = formatCurrency(dailyPay);

            // TAX Calculation
            const personalAllowance = calculatePersonalAllowance(salary);
            const taxableIncome = calculateTaxableIncome(salary, personalAllowance);
            const { totalTax, breakdown } = calculateIncomeTax(salary, personalAllowance, region);
            const netAnnual = salary - totalTax;
            const effectiveRate = salary > 0 ? (totalTax / salary) * 100 : 0;

            // Calculate NET outputs
            const netWeekly = netAnnual / weeks;
            const netDaily = netWeekly / days;
            const netHourly = netWeekly / hours;

            // Update NET results
            if (resultNetAnnual) resultNetAnnual.textContent = formatCurrency(netAnnual);
            if (resultNetWeekly) resultNetWeekly.textContent = formatCurrency(netWeekly);
            if (resultNetDaily) resultNetDaily.textContent = formatCurrency(netDaily);
            if (resultNetHourly) resultNetHourly.textContent = formatCurrency(netHourly);

            // Update TAX SUMMARY
            if (resultPersonalAllowance) resultPersonalAllowance.textContent = formatCurrency(personalAllowance);
            if (resultTaxableIncome) resultTaxableIncome.textContent = formatCurrency(taxableIncome);
            if (resultTaxTotal) resultTaxTotal.textContent = formatCurrency(totalTax);
            if (resultEffectiveRate) resultEffectiveRate.textContent = effectiveRate.toFixed(1) + '%';

            // Update TAX BREAKDOWN TABLE
            if (taxBreakdownBody) {
                taxBreakdownBody.innerHTML = '';
                breakdown.forEach(band => {
                    if (band.amountInBand > 0) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${band.name}</td>
                            <td>${(band.rate * 100).toFixed(0)}%</td>
                            <td>${formatCurrency(band.amountInBand)}</td>
                            <td>${formatCurrency(band.taxInBand)}</td>
                        `;
                        taxBreakdownBody.appendChild(row);
                    }
                });
            }
        };

        // Event Listeners
        const inputs = [salaryInput, hoursInput, weeksInput, daysInput];
        if (regionSelect) inputs.push(regionSelect);
        if (taxYearSelect) inputs.push(taxYearSelect);

        inputs.forEach(input => {
            input.addEventListener('input', calculateFromSalary);
            input.addEventListener('change', calculateFromSalary);
        });

        resetBtn.addEventListener('click', () => {
            salaryInput.value = 30000;
            hoursInput.value = 37.5;
            weeksInput.value = 52;
            daysInput.value = 5;
            if (regionSelect) regionSelect.value = 'ENG_2025_26';
            if (taxYearSelect) taxYearSelect.value = '2025_26';
            calculateFromSalary();
        });

        // Initial Calc
        calculateFromSalary();
    }

    /**
     * CALCULATOR 2: Hourly -> Salary
     */
    if (isHourlyPage) {
        const hourlyInput = document.getElementById('hourly-input');
        const hoursInput = document.getElementById('hours-input');
        const weeksInput = document.getElementById('weeks-input');
        const daysInput = document.getElementById('days-input');
        const regionSelect = document.getElementById('region-select');
        const taxYearSelect = document.getElementById('taxyear-select');
        const resetBtn = document.getElementById('reset-btn');

        const resultSalary = document.getElementById('result-salary');
        const resultWeekly = document.getElementById('result-weekly');
        const resultDaily = document.getElementById('result-daily');

        // Net result elements
        const resultNetAnnual = document.getElementById('result-net-annual');
        const resultNetWeekly = document.getElementById('result-net-weekly');
        const resultNetDaily = document.getElementById('result-net-daily');
        const resultNetHourly = document.getElementById('result-net-hourly');

        // Tax summary elements
        const resultPersonalAllowance = document.getElementById('result-personal-allowance');
        const resultTaxableIncome = document.getElementById('result-taxable-income');
        const resultTaxTotal = document.getElementById('result-tax-total');
        const resultEffectiveRate = document.getElementById('result-effective-rate');

        // Tax breakdown table
        const taxBreakdownBody = document.getElementById('tax-breakdown-body');

        const calculateFromHourly = () => {
            let hourly = parseFloat(hourlyInput.value) || 0;
            let hours = parseFloat(hoursInput.value) || 0;
            let weeks = parseFloat(weeksInput.value) || 0;
            let days = parseFloat(daysInput.value) || 0;
            const region = regionSelect ? regionSelect.value : 'ENG_2025_26';

            if (hourly < 0 || hours <= 0 || weeks <= 0 || days <= 0) {
                return;
            }

            // GROSS Calculation Logic (existing)
            const weeklyPay = hourly * hours;
            const annualSalary = weeklyPay * weeks;
            const dailyPay = weeklyPay / days;

            // Update GROSS DOM (existing)
            resultSalary.textContent = formatCurrency(annualSalary);
            resultWeekly.textContent = formatCurrency(weeklyPay);
            resultDaily.textContent = formatCurrency(dailyPay);

            // TAX Calculation
            const personalAllowance = calculatePersonalAllowance(annualSalary);
            const taxableIncome = calculateTaxableIncome(annualSalary, personalAllowance);
            const { totalTax, breakdown } = calculateIncomeTax(annualSalary, personalAllowance, region);
            const netAnnual = annualSalary - totalTax;
            const effectiveRate = annualSalary > 0 ? (totalTax / annualSalary) * 100 : 0;

            // Calculate NET outputs
            const netWeekly = netAnnual / weeks;
            const netDaily = netWeekly / days;
            const netHourly = netWeekly / hours;

            // Update NET results
            if (resultNetAnnual) resultNetAnnual.textContent = formatCurrency(netAnnual);
            if (resultNetWeekly) resultNetWeekly.textContent = formatCurrency(netWeekly);
            if (resultNetDaily) resultNetDaily.textContent = formatCurrency(netDaily);
            if (resultNetHourly) resultNetHourly.textContent = formatCurrency(netHourly);

            // Update TAX SUMMARY
            if (resultPersonalAllowance) resultPersonalAllowance.textContent = formatCurrency(personalAllowance);
            if (resultTaxableIncome) resultTaxableIncome.textContent = formatCurrency(taxableIncome);
            if (resultTaxTotal) resultTaxTotal.textContent = formatCurrency(totalTax);
            if (resultEffectiveRate) resultEffectiveRate.textContent = effectiveRate.toFixed(1) + '%';

            // Update TAX BREAKDOWN TABLE
            if (taxBreakdownBody) {
                taxBreakdownBody.innerHTML = '';
                breakdown.forEach(band => {
                    if (band.amountInBand > 0) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${band.name}</td>
                            <td>${(band.rate * 100).toFixed(0)}%</td>
                            <td>${formatCurrency(band.amountInBand)}</td>
                            <td>${formatCurrency(band.taxInBand)}</td>
                        `;
                        taxBreakdownBody.appendChild(row);
                    }
                });
            }
        };

        // Event Listeners
        const inputs = [hourlyInput, hoursInput, weeksInput, daysInput];
        if (regionSelect) inputs.push(regionSelect);
        if (taxYearSelect) inputs.push(taxYearSelect);

        inputs.forEach(input => {
            input.addEventListener('input', calculateFromHourly);
            input.addEventListener('change', calculateFromHourly);
        });

        resetBtn.addEventListener('click', () => {
            hourlyInput.value = 15;
            hoursInput.value = 37.5;
            weeksInput.value = 52;
            daysInput.value = 5;
            if (regionSelect) regionSelect.value = 'ENG_2025_26';
            if (taxYearSelect) taxYearSelect.value = '2025_26';
            calculateFromHourly();
        });

        // Initial Calc
        calculateFromHourly();
    }
});
