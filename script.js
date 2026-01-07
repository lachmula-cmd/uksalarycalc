/**
 * UK Salary Calculator - Shared Logic
 * Handles calculations for both Salary -> Hourly and Hourly -> Salary pages.
 */

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
        const resetBtn = document.getElementById('reset-btn');

        const resultHourly = document.getElementById('result-hourly');
        const resultWeekly = document.getElementById('result-weekly');
        const resultDaily = document.getElementById('result-daily');

        const calculateFromSalary = () => {
            let salary = parseFloat(salaryInput.value) || 0;
            let hours = parseFloat(hoursInput.value) || 0;
            let weeks = parseFloat(weeksInput.value) || 0;
            let days = parseFloat(daysInput.value) || 0;

            if (salary < 0 || hours <= 0 || weeks <= 0 || days <= 0) {
                return; // Invalid input, do nothing or show error
            }

            // Calculation Logic
            // Annual Salary / Weeks = Weekly Pay
            const weeklyPay = salary / weeks;

            // Weekly Pay / Days = Daily Pay
            const dailyPay = weeklyPay / days;

            // Weekly Pay / Hours = Hourly Rate
            const hourlyRate = weeklyPay / hours;

            // Update DOM
            resultHourly.textContent = formatCurrency(hourlyRate);
            resultWeekly.textContent = formatCurrency(weeklyPay);
            resultDaily.textContent = formatCurrency(dailyPay);
        };

        // Event Listeners
        [salaryInput, hoursInput, weeksInput, daysInput].forEach(input => {
            input.addEventListener('input', calculateFromSalary);
        });

        resetBtn.addEventListener('click', () => {
            salaryInput.value = 30000;
            hoursInput.value = 37.5;
            weeksInput.value = 52;
            daysInput.value = 5;
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
        const resetBtn = document.getElementById('reset-btn');

        const resultSalary = document.getElementById('result-salary');
        const resultWeekly = document.getElementById('result-weekly');
        const resultDaily = document.getElementById('result-daily');

        const calculateFromHourly = () => {
            let hourly = parseFloat(hourlyInput.value) || 0;
            let hours = parseFloat(hoursInput.value) || 0;
            let weeks = parseFloat(weeksInput.value) || 0;
            let days = parseFloat(daysInput.value) || 0;

            if (hourly < 0 || hours <= 0 || weeks <= 0 || days <= 0) {
                return;
            }

            // Calculation Logic
            // Hourly * Hours = Weekly Pay
            const weeklyPay = hourly * hours;

            // Weekly Pay * Weeks = Annual Salary
            const annualSalary = weeklyPay * weeks;

            // Weekly Pay / Days = Daily Pay
            const dailyPay = weeklyPay / days;

            // Update DOM
            resultSalary.textContent = formatCurrency(annualSalary);
            resultWeekly.textContent = formatCurrency(weeklyPay);
            resultDaily.textContent = formatCurrency(dailyPay);
        };

        // Event Listeners
        [hourlyInput, hoursInput, weeksInput, daysInput].forEach(input => {
            input.addEventListener('input', calculateFromHourly);
        });

        resetBtn.addEventListener('click', () => {
            hourlyInput.value = 15;
            hoursInput.value = 37.5;
            weeksInput.value = 52;
            daysInput.value = 5;
            calculateFromHourly();
        });

        // Initial Calc
        calculateFromHourly();
    }
});
