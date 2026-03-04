# SalaryUKCalc.com — Platform Upgrade TODO (Phase 1–3)

## ✅ ALL PHASES COMPLETE

## Phase 1: Nav/Footer/CSS Improvements
- [x] style.css — Add CSS-only dropdown nav styles (footer-grid 5-col, .has-dropdown, .nav-dropdown)
- [x] Update nav on ALL existing pages (Countries dropdown + Contact link)
- [x] Update footer on ALL existing pages (brand / regions / countries / guides / legal)

## Phase 2: New Country Pages
- [x] eu/ireland.html — PAYE + USC + PRSI estimator (custom calcPAYE/calcUSC/PRSI 4.1%)
- [x] eu/italy.html — IRPEF estimator (calcIRPEF with employment deduction)
- [x] eu/poland.html — PIT estimator (calcPolishPIT with ZUS/NFZ)
- [x] global/switzerland.html — Federal tax estimator (calcSwissFederalTax, cantonal warning)
- [x] global/norway.html — Flat tax + trinnskatt estimator (calcNorwayTax with minstefradrag)
- [x] global/uae.html — Informational only (no income tax, GPSSA/EOSB explained)

## Phase 3: Internal Linking & Index Updates
- [x] eu/index.html — All 7 country cards (Ireland, Germany, France, Netherlands, Spain, Italy, Poland)
- [x] global/index.html — All 6 country cards (USA, Canada, Australia, Switzerland, Norway, UAE)
- [x] sitemap.xml — All 6 new URLs present
- [x] data/countries.js — 6 new country objects (ie, it, pl, ch, no, ae) + regions arrays

---

## File Checklist — ALL COMPLETE ✅

### Root pages (nav + footer updated)
- [x] index.html
- [x] regions.html
- [x] about.html
- [x] contact.html
- [x] disclaimer.html
- [x] terms.html
- [x] methodology.html
- [x] privacy.html
- [x] hourly-to-salary.html

### UK pages (nav + footer updated)
- [x] uk/index.html
- [x] uk/salary-calculator.html

### EU pages (nav + footer updated + new country cards)
- [x] eu/index.html (7 country cards)
- [x] eu/ireland.html (new page)
- [x] eu/italy.html (new page)
- [x] eu/poland.html (new page)
- [x] eu/germany.html
- [x] eu/france.html
- [x] eu/netherlands.html
- [x] eu/spain.html

### Global pages (nav + footer updated + new country cards)
- [x] global/index.html (6 country cards)
- [x] global/switzerland.html (new page)
- [x] global/norway.html (new page)
- [x] global/uae.html (new page)
- [x] global/usa.html
- [x] global/canada.html
- [x] global/australia.html

### Guides pages (nav + footer updated)
- [x] guides/index.html
- [x] guides/gross-vs-net-salary.html
- [x] guides/income-tax-vs-social-contributions.html
- [x] guides/how-payroll-deductions-work.html
- [x] guides/tax-residency-basics.html
- [x] guides/why-net-salary-differs-by-country.html

---

## Nav Pattern Used (subdirectory pages, prefix=../)
- CSS-only hover dropdown via .has-dropdown / .nav-dropdown / .nav-dropdown-header
- Countries: UK → 7 EU → 6 Global (16 countries total)
- Mobile: dropdown accessible via hover/focus

## Footer Pattern Used (5 columns)
1. Brand + tagline
2. Regions (UK / EU / Global / All Regions)
3. Countries (6 featured: Ireland, Germany, France, USA, Australia, UAE)
4. Guides (5 guide links)
5. Legal (Privacy / Terms / Disclaimer / Methodology / About / Contact)
