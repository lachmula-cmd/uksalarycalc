/**
 * PayCalcUK — UI Controller
 * Handles all DOM interactions and result rendering
 */

'use strict';

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */
const state = {
  salaryAmount:      35000,
  salaryPeriod:      'annual',
  country:           'england',
  pensionValue:      0,
  pensionUnit:       'percent',
  studentLoan:       'none',
  blindPerson:       false,
  marriageAllowance: false,
  resultsPeriod:     'annual',
  results:           null,
};

/* ─────────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const els = {
  salaryInput:          $('salaryInput'),
  pensionInput:         $('pensionInput'),
  studentLoanSelect:    $('studentLoanSelect'),
  blindAllowance:       $('blindAllowance'),
  marriageAllowance:    $('marriageAllowance'),
  optionsToggle:        $('optionsToggle'),
  optionsContent:       $('optionsContent'),
  optionsAccordion:     $('optionsAccordion'),
  mobileMenuToggle:     $('mobileMenuToggle'),
  mobileMenu:           $('mobileMenu'),

  // Results
  takeHomeAmount:       $('takeHomeAmount'),
  takeHomePeriod:       $('takeHomePeriod'),
  grossDisplay:         $('grossDisplay'),
  taxDisplay:           $('taxDisplay'),
  niDisplay:            $('niDisplay'),
  pensionDisplay:       $('pensionDisplay'),
  loanDisplay:          $('loanDisplay'),
  takeHomeDisplay:      $('takeHomeDisplay'),
  pensionRow:           $('pensionRow'),
  loanRow:              $('loanRow'),
  effectiveRate:        $('effectiveRate'),
  marginalRate:         $('marginalRate'),
  personalAllowanceDisplay: $('personalAllowanceDisplay'),

  // Bar segments
  barTakeHome:          $('barTakeHome'),
  barTax:               $('barTax'),
  barNI:                $('barNI'),
  barPension:           $('barPension'),
  barLoan:              $('barLoan'),
};

/* ─────────────────────────────────────────────
   CALCULATION & RENDER
───────────────────────────────────────────── */

function runCalculation() {
  const results = window.UKCalc.calculate({
    salaryAmount:      state.salaryAmount,
    salaryPeriod:      state.salaryPeriod,
    country:           state.country,
    pensionValue:      state.pensionValue,
    pensionUnit:       state.pensionUnit,
    studentLoan:       state.studentLoan,
    blindPerson:       state.blindPerson,
    marriageAllowance: state.marriageAllowance,
  });

  state.results = results;
  renderResults(results);
}

function renderResults(r) {
  const fmt = window.UKCalc.formatCurrency;
  const fmtPct = window.UKCalc.formatPercent;
  const period = state.resultsPeriod;

  // Pick the right period multiplier
  let gross, tax, ni, pension, loan, takeHome, periodLabel;

  switch (period) {
    case 'monthly':
      gross    = r.grossMonthly;
      tax      = r.taxMonthly;
      ni       = r.niMonthly;
      pension  = r.pensionMonthly;
      loan     = r.loanMonthly;
      takeHome = r.takeHomeMonthly;
      periodLabel = 'per month';
      break;
    case 'weekly':
      gross    = r.grossWeekly;
      tax      = r.taxWeekly;
      ni       = r.niWeekly;
      pension  = r.pensionWeekly;
      loan     = r.loanWeekly;
      takeHome = r.takeHomeWeekly;
      periodLabel = 'per week';
      break;
    default: // annual
      gross    = r.grossAnnual;
      tax      = r.incomeTax;
      ni       = r.ni;
      pension  = r.pensionAnnual;
      loan     = r.studentLoanRepayment;
      takeHome = r.takeHome;
      periodLabel = 'per year';
  }

  // Hero take-home
  els.takeHomeAmount.textContent = fmt(takeHome);
  els.takeHomePeriod.textContent = periodLabel;

  // Breakdown list
  els.grossDisplay.textContent    = fmt(gross);
  els.taxDisplay.textContent      = `−${fmt(tax)}`;
  els.niDisplay.textContent       = `−${fmt(ni)}`;
  els.pensionDisplay.textContent  = `−${fmt(pension)}`;
  els.loanDisplay.textContent     = `−${fmt(loan)}`;
  els.takeHomeDisplay.textContent = fmt(takeHome);

  // Show/hide optional rows
  els.pensionRow.style.display = r.pensionAnnual > 0 ? 'flex' : 'none';
  els.loanRow.style.display    = r.studentLoanRepayment > 0 ? 'flex' : 'none';

  // Rate cards (always annual)
  els.effectiveRate.textContent            = fmtPct(r.effectiveTaxRate);
  els.marginalRate.textContent             = `${Math.round(r.marginalRate)}%`;
  els.personalAllowanceDisplay.textContent = fmt(r.personalAllowance);

  // Breakdown bar
  updateBreakdownBar(r);
}

function updateBreakdownBar(r) {
  const gross = r.grossAnnual;
  if (gross <= 0) return;

  const takeHomePct = (r.takeHome / gross) * 100;
  const taxPct      = (r.incomeTax / gross) * 100;
  const niPct       = (r.ni / gross) * 100;
  const pensionPct  = (r.pensionAnnual / gross) * 100;
  const loanPct     = (r.studentLoanRepayment / gross) * 100;

  els.barTakeHome.style.width = `${Math.max(0, takeHomePct)}%`;
  els.barTax.style.width      = `${Math.max(0, taxPct)}%`;
  els.barNI.style.width       = `${Math.max(0, niPct)}%`;
  els.barPension.style.width  = `${Math.max(0, pensionPct)}%`;
  els.barLoan.style.width     = `${Math.max(0, loanPct)}%`;
}

/* ─────────────────────────────────────────────
   INPUT HANDLERS
───────────────────────────────────────────── */

// Salary input
els.salaryInput.addEventListener('input', () => {
  const val = parseFloat(els.salaryInput.value) || 0;
  state.salaryAmount = val;
  runCalculation();
});

// Period toggle buttons
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.salaryPeriod = btn.dataset.period;

    // Update label
    const labelMap = {
      annual: 'Annual Salary',
      monthly: 'Monthly Salary',
      weekly: 'Weekly Salary',
      daily: 'Daily Rate',
      hourly: 'Hourly Rate',
    };
    const label = document.querySelector('.field-label[for="salaryInput"]');
    if (label) label.textContent = labelMap[state.salaryPeriod] || 'Salary Amount';

    runCalculation();
  });
});

// Country selector
document.querySelectorAll('.country-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.country-card').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    card.classList.add('active');
    card.setAttribute('aria-pressed', 'true');
    state.country = card.dataset.country;
    runCalculation();
  });
});

// Results period toggle
document.querySelectorAll('.results-period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.results-period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.resultsPeriod = btn.dataset.resultsPeriod;
    if (state.results) renderResults(state.results);
  });
});

// Pension input
els.pensionInput.addEventListener('input', () => {
  state.pensionValue = parseFloat(els.pensionInput.value) || 0;
  runCalculation();
});

// Pension unit toggle
document.querySelectorAll('.unit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.pensionUnit = btn.dataset.unit;
    runCalculation();
  });
});

// Student loan
els.studentLoanSelect.addEventListener('change', () => {
  state.studentLoan = els.studentLoanSelect.value;
  runCalculation();
});

// Blind person's allowance
els.blindAllowance.addEventListener('change', () => {
  state.blindPerson = els.blindAllowance.checked;
  runCalculation();
});

// Marriage allowance
els.marriageAllowance.addEventListener('change', () => {
  state.marriageAllowance = els.marriageAllowance.checked;
  runCalculation();
});

/* ─────────────────────────────────────────────
   OPTIONS ACCORDION
───────────────────────────────────────────── */

els.optionsToggle.addEventListener('click', () => {
  const isOpen = els.optionsAccordion.classList.toggle('open');
  els.optionsToggle.setAttribute('aria-expanded', isOpen);
});

/* ─────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────── */

els.mobileMenuToggle.addEventListener('click', () => {
  els.mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav__mobile-link, .nav__mobile-menu .btn').forEach(link => {
  link.addEventListener('click', () => {
    els.mobileMenu.classList.remove('open');
  });
});

/* ─────────────────────────────────────────────
   TAX RATES TABS
───────────────────────────────────────────── */

document.querySelectorAll('.rates-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Deactivate all tabs and panels
    document.querySelectorAll('.rates-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.rates-panel').forEach(p => p.classList.remove('active'));

    // Activate clicked tab and its panel
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panelId = tab.dataset.tab;
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  });
});

/* ─────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────── */

document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked item if it was closed
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ─────────────────────────────────────────────
   SMOOTH SCROLL FOR NAV LINKS
───────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = document.querySelector('.nav-wrapper').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─────────────────────────────────────────────
   STICKY NAV SHADOW
───────────────────────────────────────────── */

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav-wrapper');
  if (window.scrollY > 10) {
    nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)';
  } else {
    nav.style.boxShadow = '';
  }
}, { passive: true });

/* ─────────────────────────────────────────────
   INITIALISE
───────────────────────────────────────────── */

// Run initial calculation on page load
document.addEventListener('DOMContentLoaded', () => {
  runCalculation();
});

// Also run immediately in case DOMContentLoaded already fired
if (document.readyState !== 'loading') {
  runCalculation();
}
