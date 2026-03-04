/**
 * SalaryUKCalc.com — Country & Region Data
 * Central data store for all regions, countries, tax summaries, and metadata.
 * 
 * Tax rates are based on publicly available 2025/26 figures.
 * All estimates are clearly labelled as estimates on the front end.
 * This data is for informational purposes only — not professional tax advice.
 */

const SITE_DATA = {

  regions: [
    {
      id: 'uk',
      name: 'United Kingdom',
      shortName: 'UK',
      flag: '🇬🇧',
      description: 'Detailed salary and income tax calculators for England, Wales, Scotland, and Northern Ireland.',
      color: '#1d4ed8',
      url: 'uk/index.html',
      countries: ['gb']
    },
    {
      id: 'eu',
      name: 'European Union',
      shortName: 'EU',
      flag: '🇪🇺',
      description: 'Salary and tax estimates for major EU economies including Germany, France, Netherlands, and Spain.',
      color: '#0369a1',
      url: 'eu/index.html',
      countries: ['de', 'fr', 'nl', 'es', 'ie', 'it', 'pl']
    },
    {
      id: 'global',
      name: 'Global',
      shortName: 'Global',
      flag: '🌍',
      description: 'Salary and tax estimates for the USA, Canada, Australia, Switzerland, Norway, and UAE.',
      color: '#0f766e',
      url: 'global/index.html',
      countries: ['us', 'ca', 'au', 'ch', 'no', 'ae']
    }
  ],

  countries: {

    // ─── UNITED KINGDOM ───────────────────────────────────────────────────────
    gb: {
      id: 'gb',
      name: 'United Kingdom',
      flag: '🇬🇧',
      currency: 'GBP',
      currencySymbol: '£',
      region: 'uk',
      url: 'uk/index.html',
      calculatorUrl: 'uk/salary-calculator.html',
      taxYear: '2025/26',
      taxSystem: 'PAYE (Pay As You Earn)',
      officialSource: 'HM Revenue & Customs (HMRC)',
      officialSourceUrl: 'https://www.gov.uk/income-tax-rates',
      isEstimate: false,
      summary: {
        personalAllowance: '£12,570',
        topRate: '45%',
        socialContributions: 'National Insurance (NI)',
        niEmployeeRate: '8% (£12,570–£50,270), 2% above',
        currency: 'GBP (£)',
        taxResidency: 'UK tax resident'
      },
      taxBands: [
        { name: 'Personal Allowance', rate: '0%', upTo: '£12,570' },
        { name: 'Basic Rate', rate: '20%', range: '£12,571–£50,270' },
        { name: 'Higher Rate', rate: '40%', range: '£50,271–£125,140' },
        { name: 'Additional Rate', rate: '45%', range: 'Above £125,140' }
      ],
      scotlandBands: [
        { name: 'Personal Allowance', rate: '0%', upTo: '£12,570' },
        { name: 'Starter Rate', rate: '19%', range: '£12,571–£15,397' },
        { name: 'Basic Rate', rate: '20%', range: '£15,398–£27,491' },
        { name: 'Intermediate Rate', rate: '21%', range: '£27,492–£43,662' },
        { name: 'Higher Rate', rate: '42%', range: '£43,663–£75,000' },
        { name: 'Advanced Rate', rate: '45%', range: '£75,001–£125,140' },
        { name: 'Top Rate', rate: '48%', range: 'Above £125,140' }
      ]
    },

    // ─── GERMANY ──────────────────────────────────────────────────────────────
    de: {
      id: 'de',
      name: 'Germany',
      flag: '🇩🇪',
      currency: 'EUR',
      currencySymbol: '€',
      region: 'eu',
      url: 'eu/germany.html',
      taxYear: '2024',
      taxSystem: 'Lohnsteuer (Wage Tax)',
      officialSource: 'Bundeszentralamt für Steuern (BZSt)',
      officialSourceUrl: 'https://www.bzst.de',
      isEstimate: true,
      summary: {
        personalAllowance: '€11,604 (Grundfreibetrag)',
        topRate: '45% (Reichensteuer)',
        socialContributions: '~20% employee share',
        currency: 'EUR (€)',
        taxResidency: 'German tax resident, Tax Class I assumed'
      },
      // Simplified progressive bands for estimator
      estimatorBands: [
        { name: 'Tax-free allowance', rate: 0.00, upTo: 11604 },
        { name: 'Progressive zone 1', rate: 0.14, upTo: 17005 },
        { name: 'Progressive zone 2', rate: 0.24, upTo: 66760 },
        { name: 'High income zone', rate: 0.42, upTo: 277825 },
        { name: 'Top rate (Reichensteuer)', rate: 0.45, upTo: Infinity }
      ],
      // Approximate employee social contribution rates (2024)
      socialRate: 0.2005, // ~20.05% total employee share
      taxBands: [
        { name: 'Grundfreibetrag (tax-free)', rate: '0%', upTo: '€11,604' },
        { name: 'Progressive zone 1', rate: '14–24%', range: '€11,605–€66,760' },
        { name: 'Progressive zone 2', rate: '24–42%', range: '€66,761–€277,825' },
        { name: 'Top rate (Reichensteuer)', rate: '45%', range: 'Above €277,826' }
      ],
      deductions: [
        { name: 'Lohnsteuer', description: 'Income tax (wage tax), withheld by employer', rate: '14–45%' },
        { name: 'Rentenversicherung', description: 'Pension insurance — employee share', rate: '9.3%' },
        { name: 'Krankenversicherung', description: 'Health insurance — employee share', rate: '~7.3% + supplement' },
        { name: 'Arbeitslosenversicherung', description: 'Unemployment insurance', rate: '1.3%' },
        { name: 'Pflegeversicherung', description: 'Long-term care insurance', rate: '1.7–2.0%' },
        { name: 'Solidaritätszuschlag', description: 'Solidarity surcharge (most earners exempt since 2021)', rate: '5.5% on tax (if applicable)' }
      ]
    },

    // ─── FRANCE ───────────────────────────────────────────────────────────────
    fr: {
      id: 'fr',
      name: 'France',
      flag: '🇫🇷',
      currency: 'EUR',
      currencySymbol: '€',
      region: 'eu',
      url: 'eu/france.html',
      taxYear: '2024',
      taxSystem: 'Impôt sur le revenu (IR)',
      officialSource: 'Direction Générale des Finances Publiques (DGFiP)',
      officialSourceUrl: 'https://www.impots.gouv.fr',
      isEstimate: true,
      summary: {
        personalAllowance: '10% employment deduction (min €495, max €14,171)',
        topRate: '45%',
        socialContributions: '~22% employee share (CSG, CRDS, health, pension)',
        currency: 'EUR (€)',
        taxResidency: 'French tax resident, single person assumed'
      },
      estimatorBands: [
        { name: 'Tax-free band', rate: 0.00, upTo: 11294 },
        { name: 'Band 1', rate: 0.11, upTo: 28797 },
        { name: 'Band 2', rate: 0.30, upTo: 82341 },
        { name: 'Band 3', rate: 0.41, upTo: 177106 },
        { name: 'Top rate', rate: 0.45, upTo: Infinity }
      ],
      socialRate: 0.22,
      taxBands: [
        { name: 'Tax-free', rate: '0%', upTo: '€11,294' },
        { name: 'Band 1', rate: '11%', range: '€11,295–€28,797' },
        { name: 'Band 2', rate: '30%', range: '€28,798–€82,341' },
        { name: 'Band 3', rate: '41%', range: '€82,342–€177,106' },
        { name: 'Top rate', rate: '45%', range: 'Above €177,106' }
      ],
      deductions: [
        { name: 'Impôt sur le revenu', description: 'Income tax, assessed annually', rate: '0–45%' },
        { name: 'CSG / CRDS', description: 'Social solidarity contributions', rate: '9.7%' },
        { name: 'Assurance maladie', description: 'Health insurance contribution', rate: '~0.75%' },
        { name: 'Retraite complémentaire', description: 'Supplementary pension (AGIRC-ARRCO)', rate: '~3.93–4.72%' },
        { name: 'Assurance chômage', description: 'Unemployment insurance', rate: '~2.4% (employer-only since 2019)' }
      ]
    },

    // ─── NETHERLANDS ──────────────────────────────────────────────────────────
    nl: {
      id: 'nl',
      name: 'Netherlands',
      flag: '🇳🇱',
      currency: 'EUR',
      currencySymbol: '€',
      region: 'eu',
      url: 'eu/netherlands.html',
      taxYear: '2024',
      taxSystem: 'Inkomstenbelasting (Box 1)',
      officialSource: 'Belastingdienst (Dutch Tax Authority)',
      officialSourceUrl: 'https://www.belastingdienst.nl',
      isEstimate: true,
      summary: {
        personalAllowance: 'General tax credit ~€3,362 + employment credit up to ~€5,052',
        topRate: '49.5%',
        socialContributions: 'Included in Box 1 rates (AOW, ANW, WLZ)',
        currency: 'EUR (€)',
        taxResidency: 'Dutch tax resident, Box 1 income assumed'
      },
      // Box 1 rates include social contributions
      estimatorBands: [
        { name: 'Band 1 (incl. social contributions)', rate: 0.3697, upTo: 75518 },
        { name: 'Band 2', rate: 0.495, upTo: Infinity }
      ],
      // General tax credit and employment credit reduce tax — simplified
      generalTaxCredit: 3362,
      socialRate: 0, // Already included in Box 1 rates
      taxBands: [
        { name: 'Band 1 (incl. social contributions)', rate: '36.97%', upTo: '€75,518' },
        { name: 'Band 2', rate: '49.5%', range: 'Above €75,518' }
      ],
      deductions: [
        { name: 'Inkomstenbelasting', description: 'Income tax (Box 1, includes social contributions)', rate: '36.97% / 49.5%' },
        { name: 'Algemene heffingskorting', description: 'General tax credit (reduces tax owed)', rate: 'Up to €3,362' },
        { name: 'Arbeidskorting', description: 'Employment tax credit (reduces tax owed)', rate: 'Up to €5,052' },
        { name: 'AOW / ANW / WLZ', description: 'State pension, survivor, long-term care (included in Band 1 rate)', rate: 'Included above' }
      ]
    },

    // ─── SPAIN ────────────────────────────────────────────────────────────────
    es: {
      id: 'es',
      name: 'Spain',
      flag: '🇪🇸',
      currency: 'EUR',
      currencySymbol: '€',
      region: 'eu',
      url: 'eu/spain.html',
      taxYear: '2024',
      taxSystem: 'IRPF (Impuesto sobre la Renta de las Personas Físicas)',
      officialSource: 'Agencia Tributaria (AEAT)',
      officialSourceUrl: 'https://www.agenciatributaria.es',
      isEstimate: true,
      summary: {
        personalAllowance: '€5,550 personal minimum (mínimo personal)',
        topRate: '47% (state + regional combined)',
        socialContributions: '~6.35% employee (Social Security)',
        currency: 'EUR (€)',
        taxResidency: 'Spanish tax resident, general regime assumed'
      },
      estimatorBands: [
        { name: 'Band 1', rate: 0.19, upTo: 12450 },
        { name: 'Band 2', rate: 0.24, upTo: 20200 },
        { name: 'Band 3', rate: 0.30, upTo: 35200 },
        { name: 'Band 4', rate: 0.37, upTo: 60000 },
        { name: 'Band 5', rate: 0.45, upTo: 300000 },
        { name: 'Top rate', rate: 0.47, upTo: Infinity }
      ],
      socialRate: 0.0635,
      taxBands: [
        { name: 'Band 1', rate: '19%', upTo: '€12,450' },
        { name: 'Band 2', rate: '24%', range: '€12,451–€20,200' },
        { name: 'Band 3', rate: '30%', range: '€20,201–€35,200' },
        { name: 'Band 4', rate: '37%', range: '€35,201–€60,000' },
        { name: 'Band 5', rate: '45%', range: '€60,001–€300,000' },
        { name: 'Top rate', rate: '47%', range: 'Above €300,000' }
      ],
      deductions: [
        { name: 'IRPF', description: 'Personal income tax, withheld monthly by employer', rate: '19–47%' },
        { name: 'Seguridad Social', description: 'Social Security — employee contribution', rate: '4.7% (pension) + 1.55% (unemployment) + 0.1% (training)' },
        { name: 'Mínimo personal', description: 'Personal minimum deduction reduces taxable base', rate: '€5,550 allowance' }
      ]
    },

    // ─── IRELAND ──────────────────────────────────────────────────────────────
    ie: {
      id: 'ie',
      name: 'Ireland',
      flag: '🇮🇪',
      currency: 'EUR',
      currencySymbol: '€',
      region: 'eu',
      url: 'eu/ireland.html',
      taxYear: '2024',
      taxSystem: 'PAYE + USC + PRSI',
      officialSource: 'Revenue Commissioners (Revenue.ie)',
      officialSourceUrl: 'https://www.revenue.ie',
      isEstimate: true,
      summary: {
        personalAllowance: '€1,875 personal tax credit + €1,875 employee tax credit',
        topRate: '40% income tax + USC + PRSI',
        socialContributions: 'PRSI 4.1% employee',
        currency: 'EUR (€)',
        taxResidency: 'Irish tax resident, single person, PAYE worker assumed'
      },
      // Income tax bands (single person 2024)
      estimatorBands: [
        { name: 'Standard rate', rate: 0.20, upTo: 42000 },
        { name: 'Higher rate', rate: 0.40, upTo: Infinity }
      ],
      // Personal + employee tax credits (reduce tax owed)
      taxCredits: 3750, // €1,875 personal + €1,875 employee
      // USC bands
      uscBands: [
        { rate: 0.005, upTo: 12012 },
        { rate: 0.02,  upTo: 25760 },
        { rate: 0.04,  upTo: 70044 },
        { rate: 0.08,  upTo: Infinity }
      ],
      prsiRate: 0.041,
      socialRate: 0.041, // PRSI only (USC calculated separately)
      taxBands: [
        { name: 'Standard Rate', rate: '20%', upTo: '€42,000 (single)' },
        { name: 'Higher Rate', rate: '40%', range: 'Above €42,000' }
      ],
      deductions: [
        { name: 'Income Tax', description: 'PAYE — 20% standard rate, 40% higher rate', rate: '20% / 40%' },
        { name: 'USC (Universal Social Charge)', description: 'Charged on gross income above €13,000', rate: '0.5–8%' },
        { name: 'PRSI', description: 'Pay Related Social Insurance — employee share', rate: '4.1%' },
        { name: 'Tax Credits', description: 'Personal + employee credits reduce tax owed', rate: '€3,750 total' }
      ]
    },

    // ─── ITALY ────────────────────────────────────────────────────────────────
    it: {
      id: 'it',
      name: 'Italy',
      flag: '🇮🇹',
      currency: 'EUR',
      currencySymbol: '€',
      region: 'eu',
      url: 'eu/italy.html',
      taxYear: '2024',
      taxSystem: 'IRPEF (Imposta sul Reddito delle Persone Fisiche)',
      officialSource: 'Agenzia delle Entrate',
      officialSourceUrl: 'https://www.agenziaentrate.gov.it',
      isEstimate: true,
      summary: {
        personalAllowance: 'No fixed allowance; deductions and tax credits apply',
        topRate: '43%',
        socialContributions: '~9.19% employee (INPS)',
        currency: 'EUR (€)',
        taxResidency: 'Italian tax resident, employee (lavoro dipendente) assumed'
      },
      estimatorBands: [
        { name: 'Band 1', rate: 0.23, upTo: 28000 },
        { name: 'Band 2', rate: 0.35, upTo: 50000 },
        { name: 'Band 3', rate: 0.43, upTo: Infinity }
      ],
      socialRate: 0.0919, // INPS employee contribution ~9.19%
      taxBands: [
        { name: 'Band 1', rate: '23%', upTo: '€28,000' },
        { name: 'Band 2', rate: '35%', range: '€28,001–€50,000' },
        { name: 'Band 3', rate: '43%', range: 'Above €50,000' }
      ],
      deductions: [
        { name: 'IRPEF', description: 'Personal income tax, withheld monthly by employer', rate: '23–43%' },
        { name: 'INPS (Pensione)', description: 'Pension contribution — employee share', rate: '9.19%' },
        { name: 'Detrazioni lavoro dipendente', description: 'Employment income deductions reduce tax owed', rate: 'Up to ~€1,880' },
        { name: 'Addizionale regionale/comunale', description: 'Regional and municipal surtax (varies)', rate: '~1.23–3.33%' }
      ]
    },

    // ─── POLAND ───────────────────────────────────────────────────────────────
    pl: {
      id: 'pl',
      name: 'Poland',
      flag: '🇵🇱',
      currency: 'PLN',
      currencySymbol: 'zł',
      region: 'eu',
      url: 'eu/poland.html',
      taxYear: '2024',
      taxSystem: 'PIT (Podatek dochodowy od osób fizycznych)',
      officialSource: 'Ministerstwo Finansów / Krajowa Administracja Skarbowa',
      officialSourceUrl: 'https://www.podatki.gov.pl',
      isEstimate: true,
      summary: {
        personalAllowance: '30,000 PLN tax-free amount (kwota wolna od podatku)',
        topRate: '32%',
        socialContributions: '~13.71% employee (ZUS: pension + disability + sickness)',
        currency: 'PLN (zł)',
        taxResidency: 'Polish tax resident, employment contract assumed'
      },
      estimatorBands: [
        { name: 'Tax-free amount', rate: 0.00, upTo: 30000 },
        { name: 'Standard rate', rate: 0.12, upTo: 120000 },
        { name: 'Higher rate', rate: 0.32, upTo: Infinity }
      ],
      // ZUS employee contributions: pension 9.76% + disability 1.5% + sickness 2.45% = 13.71%
      socialRate: 0.1371,
      // Health insurance: 9% of assessment base (not deductible since 2022)
      healthRate: 0.09,
      taxBands: [
        { name: 'Tax-free amount', rate: '0%', upTo: '30,000 zł' },
        { name: 'Standard rate', rate: '12%', range: '30,001–120,000 zł' },
        { name: 'Higher rate', rate: '32%', range: 'Above 120,000 zł' }
      ],
      deductions: [
        { name: 'PIT (Income Tax)', description: 'Progressive income tax, withheld by employer', rate: '12% / 32%' },
        { name: 'ZUS — Emerytalne', description: 'Pension insurance — employee share', rate: '9.76%' },
        { name: 'ZUS — Rentowe', description: 'Disability insurance — employee share', rate: '1.5%' },
        { name: 'ZUS — Chorobowe', description: 'Sickness insurance — employee share', rate: '2.45%' },
        { name: 'Ubezpieczenie zdrowotne', description: 'Health insurance (not deductible from 2022)', rate: '9%' }
      ]
    },

    // ─── UNITED STATES ────────────────────────────────────────────────────────
    us: {
      id: 'us',
      name: 'United States',
      flag: '🇺🇸',
      currency: 'USD',
      currencySymbol: '$',
      region: 'global',
      url: 'global/usa.html',
      taxYear: '2024',
      taxSystem: 'Federal Income Tax + FICA',
      officialSource: 'Internal Revenue Service (IRS)',
      officialSourceUrl: 'https://www.irs.gov',
      isEstimate: true,
      summary: {
        personalAllowance: '$14,600 standard deduction (single filer, 2024)',
        topRate: '37% federal (state taxes additional)',
        socialContributions: '7.65% FICA (Social Security 6.2% + Medicare 1.45%)',
        currency: 'USD ($)',
        taxResidency: 'US tax resident, single filer, federal only'
      },
      estimatorBands: [
        { name: 'Band 1', rate: 0.10, upTo: 11600 },
        { name: 'Band 2', rate: 0.12, upTo: 47150 },
        { name: 'Band 3', rate: 0.22, upTo: 100525 },
        { name: 'Band 4', rate: 0.24, upTo: 191950 },
        { name: 'Band 5', rate: 0.32, upTo: 243725 },
        { name: 'Band 6', rate: 0.35, upTo: 609350 },
        { name: 'Top rate', rate: 0.37, upTo: Infinity }
      ],
      standardDeduction: 14600,
      ficaRate: 0.0765, // 6.2% SS + 1.45% Medicare
      socialRate: 0.0765,
      taxBands: [
        { name: '10%', rate: '10%', upTo: '$11,600' },
        { name: '12%', rate: '12%', range: '$11,601–$47,150' },
        { name: '22%', rate: '22%', range: '$47,151–$100,525' },
        { name: '24%', rate: '24%', range: '$100,526–$191,950' },
        { name: '32%', rate: '32%', range: '$191,951–$243,725' },
        { name: '35%', rate: '35%', range: '$243,726–$609,350' },
        { name: '37%', rate: '37%', range: 'Above $609,350' }
      ],
      deductions: [
        { name: 'Federal Income Tax', description: 'Progressive federal tax, withheld by employer', rate: '10–37%' },
        { name: 'Social Security', description: 'OASDI — employee share (up to wage base $168,600)', rate: '6.2%' },
        { name: 'Medicare', description: 'Hospital Insurance — employee share', rate: '1.45% (+ 0.9% above $200k)' },
        { name: 'State Income Tax', description: 'Varies by state — not included in this estimate', rate: '0–13.3%' }
      ]
    },

    // ─── CANADA ───────────────────────────────────────────────────────────────
    ca: {
      id: 'ca',
      name: 'Canada',
      flag: '🇨🇦',
      currency: 'CAD',
      currencySymbol: 'CA$',
      region: 'global',
      url: 'global/canada.html',
      taxYear: '2024',
      taxSystem: 'Federal Income Tax + CPP + EI',
      officialSource: 'Canada Revenue Agency (CRA)',
      officialSourceUrl: 'https://www.canada.ca/en/revenue-agency.html',
      isEstimate: true,
      summary: {
        personalAllowance: 'CA$15,705 basic personal amount (2024)',
        topRate: '33% federal (provincial taxes additional)',
        socialContributions: 'CPP ~5.95% + EI ~1.66%',
        currency: 'CAD (CA$)',
        taxResidency: 'Canadian tax resident, federal only, Ontario provincial rates used as example'
      },
      estimatorBands: [
        { name: 'Band 1', rate: 0.15, upTo: 55867 },
        { name: 'Band 2', rate: 0.205, upTo: 111733 },
        { name: 'Band 3', rate: 0.26, upTo: 154906 },
        { name: 'Band 4', rate: 0.29, upTo: 220000 },
        { name: 'Top rate', rate: 0.33, upTo: Infinity }
      ],
      basicPersonalAmount: 15705,
      cppRate: 0.0595,
      eiRate: 0.0166,
      socialRate: 0.0761, // CPP + EI combined
      taxBands: [
        { name: 'Band 1', rate: '15%', upTo: 'CA$55,867' },
        { name: 'Band 2', rate: '20.5%', range: 'CA$55,868–$111,733' },
        { name: 'Band 3', rate: '26%', range: 'CA$111,734–$154,906' },
        { name: 'Band 4', rate: '29%', range: 'CA$154,907–$220,000' },
        { name: 'Top rate', rate: '33%', range: 'Above CA$220,000' }
      ],
      deductions: [
        { name: 'Federal Income Tax', description: 'Progressive federal tax', rate: '15–33%' },
        { name: 'CPP (Canada Pension Plan)', description: 'Employee contribution (up to annual maximum)', rate: '5.95%' },
        { name: 'EI (Employment Insurance)', description: 'Employee premium', rate: '1.66%' },
        { name: 'Provincial Income Tax', description: 'Varies by province — not included in this estimate', rate: '5.05–21%' }
      ]
    },

    // ─── SWITZERLAND ──────────────────────────────────────────────────────────
    ch: {
      id: 'ch',
      name: 'Switzerland',
      flag: '🇨🇭',
      currency: 'CHF',
      currencySymbol: 'CHF',
      region: 'global',
      url: 'global/switzerland.html',
      taxYear: '2024',
      taxSystem: 'Federal + Cantonal + Municipal Income Tax',
      officialSource: 'Swiss Federal Tax Administration (ESTV/AFC)',
      officialSourceUrl: 'https://www.estv.admin.ch',
      isEstimate: true,
      summary: {
        personalAllowance: 'Varies by canton; federal allowance ~CHF 17,800 (single)',
        topRate: '11.5% federal (cantonal taxes additional — total can reach ~40%)',
        socialContributions: '~7.45% employee (AHV 5.3% + ALV 1.1% + IV 0.35% + EO 0.25%)',
        currency: 'CHF',
        taxResidency: 'Swiss tax resident, Zurich canton used as example, federal tax only in estimator'
      },
      // Federal tax bands only (simplified — cantonal taxes not included)
      estimatorBands: [
        { name: 'Tax-free', rate: 0.00, upTo: 17800 },
        { name: 'Band 1', rate: 0.0077, upTo: 31600 },
        { name: 'Band 2', rate: 0.0088, upTo: 41400 },
        { name: 'Band 3', rate: 0.026, upTo: 55200 },
        { name: 'Band 4', rate: 0.033, upTo: 72500 },
        { name: 'Band 5', rate: 0.044, upTo: 78100 },
        { name: 'Band 6', rate: 0.065, upTo: 103600 },
        { name: 'Band 7', rate: 0.088, upTo: 134600 },
        { name: 'Band 8', rate: 0.115, upTo: Infinity }
      ],
      // AHV 5.3% + ALV 1.1% + IV 0.35% + EO 0.25% = 7.0% (approx 7.45% with rounding)
      socialRate: 0.0745,
      taxBands: [
        { name: 'Tax-free', rate: '0%', upTo: 'CHF 17,800' },
        { name: 'Progressive bands', rate: '0.77–11.5%', range: 'CHF 17,801 and above' }
      ],
      deductions: [
        { name: 'Federal Income Tax', description: 'Progressive federal tax (Direkte Bundessteuer)', rate: '0–11.5%' },
        { name: 'Cantonal & Municipal Tax', description: 'Varies significantly by canton — not included in estimator', rate: '~10–30% additional' },
        { name: 'AHV (Old Age Insurance)', description: 'Employee share of state pension', rate: '5.3%' },
        { name: 'ALV (Unemployment Insurance)', description: 'Employee share, capped at CHF 148,200', rate: '1.1%' },
        { name: 'IV / EO', description: 'Disability and income compensation insurance', rate: '0.35% + 0.25%' },
        { name: 'BVG (Occupational Pension)', description: 'Second pillar pension — varies by employer/age', rate: '~7–18%' }
      ]
    },

    // ─── NORWAY ───────────────────────────────────────────────────────────────
    no: {
      id: 'no',
      name: 'Norway',
      flag: '🇳🇴',
      currency: 'NOK',
      currencySymbol: 'kr',
      region: 'global',
      url: 'global/norway.html',
      taxYear: '2024',
      taxSystem: 'Flat Tax + Trinnskatt (Step Tax) + Trygdeavgift',
      officialSource: 'Skatteetaten (Norwegian Tax Administration)',
      officialSourceUrl: 'https://www.skatteetaten.no',
      isEstimate: true,
      summary: {
        personalAllowance: 'NOK 73,100 minstefradrag (standard deduction)',
        topRate: '~47.4% combined (22% flat + trinnskatt + trygdeavgift)',
        socialContributions: 'Trygdeavgift 7.9% on income',
        currency: 'NOK (kr)',
        taxResidency: 'Norwegian tax resident, standard deduction applied'
      },
      // Norway: flat 22% on income above personal allowance + trinnskatt surtax
      // We model this as combined effective bands
      estimatorBands: [
        { name: 'Standard deduction (minstefradrag)', rate: 0.00, upTo: 73100 },
        { name: 'Flat tax 22%', rate: 0.22, upTo: 208050 },
        { name: 'Flat + trinnskatt 1.7%', rate: 0.237, upTo: 292850 },
        { name: 'Flat + trinnskatt 4.0%', rate: 0.26, upTo: 670000 },
        { name: 'Flat + trinnskatt 13.6%', rate: 0.356, upTo: 937900 },
        { name: 'Flat + trinnskatt 16.6%', rate: 0.386, upTo: Infinity }
      ],
      // Trygdeavgift (social security contribution) 7.9%
      socialRate: 0.079,
      taxBands: [
        { name: 'Minstefradrag (standard deduction)', rate: '0%', upTo: 'NOK 73,100' },
        { name: 'Flat income tax', rate: '22%', range: 'All income above deduction' },
        { name: 'Trinnskatt step 1', rate: '+1.7%', range: 'NOK 208,051–292,850' },
        { name: 'Trinnskatt step 2', rate: '+4.0%', range: 'NOK 292,851–670,000' },
        { name: 'Trinnskatt step 3', rate: '+13.6%', range: 'NOK 670,001–937,900' },
        { name: 'Trinnskatt step 4', rate: '+16.6%', range: 'Above NOK 937,900' }
      ],
      deductions: [
        { name: 'Inntektsskatt (Income Tax)', description: 'Flat 22% on income above standard deduction', rate: '22%' },
        { name: 'Trinnskatt (Step Tax)', description: 'Progressive surtax on top of flat tax', rate: '1.7–16.6%' },
        { name: 'Trygdeavgift', description: 'National Insurance contribution (employee)', rate: '7.9%' },
        { name: 'Minstefradrag', description: 'Standard deduction reduces taxable income', rate: 'NOK 73,100 (or 46% of income, max NOK 104,450)' }
      ]
    },

    // ─── UAE ──────────────────────────────────────────────────────────────────
    ae: {
      id: 'ae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      currency: 'AED',
      currencySymbol: 'AED',
      region: 'global',
      url: 'global/uae.html',
      taxYear: '2024',
      taxSystem: 'No Personal Income Tax',
      officialSource: 'Federal Tax Authority (FTA)',
      officialSourceUrl: 'https://www.tax.gov.ae',
      isEstimate: false,
      noIncomeTax: true,
      summary: {
        personalAllowance: 'N/A — no personal income tax',
        topRate: '0% personal income tax',
        socialContributions: 'UAE nationals: GPSSA pension 5% employee. Expats: none.',
        currency: 'AED',
        taxResidency: 'UAE resident (expat employee assumed)'
      },
      taxBands: [],
      deductions: [
        { name: 'Personal Income Tax', description: 'No personal income tax in the UAE', rate: '0%' },
        { name: 'Social Security (UAE nationals)', description: 'GPSSA pension contribution for UAE nationals only', rate: '5% employee' },
        { name: 'Corporate Tax', description: '9% corporate tax applies to businesses (not individuals)', rate: 'N/A for employees' },
        { name: 'VAT', description: '5% VAT on goods and services (not a payroll deduction)', rate: '5% on consumption' }
      ]
    },

    // ─── AUSTRALIA ────────────────────────────────────────────────────────────
    au: {
      id: 'au',
      name: 'Australia',
      flag: '🇦🇺',
      currency: 'AUD',
      currencySymbol: 'A$',
      region: 'global',
      url: 'global/australia.html',
      taxYear: '2024–25',
      taxSystem: 'PAYG Withholding + Medicare Levy',
      officialSource: 'Australian Taxation Office (ATO)',
      officialSourceUrl: 'https://www.ato.gov.au',
      isEstimate: true,
      summary: {
        personalAllowance: 'A$18,200 tax-free threshold',
        topRate: '45% + 2% Medicare Levy',
        socialContributions: 'Medicare Levy 2% (Superannuation is employer-paid at 11.5%)',
        currency: 'AUD (A$)',
        taxResidency: 'Australian tax resident, Medicare Levy included'
      },
      estimatorBands: [
        { name: 'Tax-free threshold', rate: 0.00, upTo: 18200 },
        { name: 'Band 1', rate: 0.19, upTo: 45000 },
        { name: 'Band 2', rate: 0.325, upTo: 120000 },
        { name: 'Band 3', rate: 0.37, upTo: 180000 },
        { name: 'Top rate', rate: 0.45, upTo: Infinity }
      ],
      medicareLevy: 0.02,
      socialRate: 0.02, // Medicare levy only (super is employer-paid)
      taxBands: [
        { name: 'Tax-free threshold', rate: '0%', upTo: 'A$18,200' },
        { name: 'Band 1', rate: '19%', range: 'A$18,201–$45,000' },
        { name: 'Band 2', rate: '32.5%', range: 'A$45,001–$120,000' },
        { name: 'Band 3', rate: '37%', range: 'A$120,001–$180,000' },
        { name: 'Top rate', rate: '45%', range: 'Above A$180,000' }
      ],
      deductions: [
        { name: 'Income Tax', description: 'PAYG withholding, withheld by employer', rate: '0–45%' },
        { name: 'Medicare Levy', description: 'Funds the public health system', rate: '2%' },
        { name: 'Superannuation', description: 'Employer-paid retirement contribution (not a deduction from gross)', rate: '11.5% (employer pays)' }
      ]
    }

  }, // end countries

  guides: [
    {
      id: 'gross-vs-net',
      title: 'Gross vs Net Salary Explained',
      icon: '💰',
      description: 'Understand the difference between your gross salary (before deductions) and your net take-home pay.',
      url: 'guides/gross-vs-net-salary.html'
    },
    {
      id: 'income-tax-vs-social',
      title: 'Income Tax vs Social Contributions',
      icon: '📊',
      description: 'Learn how income tax and social security contributions differ, and why both reduce your take-home pay.',
      url: 'guides/income-tax-vs-social-contributions.html'
    },
    {
      id: 'payroll-deductions',
      title: 'How Payroll Deductions Work',
      icon: '🧾',
      description: 'A plain-English guide to what gets deducted from your salary before it reaches your bank account.',
      url: 'guides/how-payroll-deductions-work.html'
    },
    {
      id: 'tax-residency',
      title: 'Tax Residency Basics',
      icon: '🌐',
      description: 'What tax residency means, why it matters for your salary, and how it differs between countries.',
      url: 'guides/tax-residency-basics.html'
    },
    {
      id: 'why-net-differs',
      title: 'Why Net Salary Differs by Country',
      icon: '🗺️',
      description: 'The same gross salary can result in very different take-home pay depending on where you live and work.',
      url: 'guides/why-net-salary-differs-by-country.html'
    }
  ]

}; // end SITE_DATA


/**
 * Simplified gross-to-net estimator for EU and Global countries.
 * Uses progressive band calculation + flat social contribution rate.
 * 
 * @param {number} grossAnnual - Gross annual income in local currency
 * @param {string} countryId - Country ID (e.g. 'de', 'fr', 'us')
 * @returns {object} Estimate result with breakdown
 */
function estimateNetSalary(grossAnnual, countryId) {
  const country = SITE_DATA.countries[countryId];
  if (!country || !country.estimatorBands) {
    return null;
  }

  // Apply standard deduction / personal allowance if applicable
  let taxableIncome = grossAnnual;

  if (countryId === 'us') {
    taxableIncome = Math.max(0, grossAnnual - (country.standardDeduction || 0));
  } else if (countryId === 'ca') {
    // Apply basic personal amount as a tax credit (15% of BPA)
    taxableIncome = Math.max(0, grossAnnual - (country.basicPersonalAmount || 0));
  } else if (countryId === 'fr') {
    // Apply 10% employment deduction (min €495, max €14,171)
    const deduction = Math.min(14171, Math.max(495, grossAnnual * 0.10));
    taxableIncome = Math.max(0, grossAnnual - deduction);
  }

  // Calculate income tax using progressive bands
  let incomeTax = 0;
  let prevLimit = 0;
  const breakdown = [];

  for (const band of country.estimatorBands) {
    if (taxableIncome <= prevLimit) break;

    const bandCap = band.upTo === Infinity ? taxableIncome : Math.min(taxableIncome, band.upTo);
    const amountInBand = Math.max(0, bandCap - prevLimit);

    if (amountInBand > 0 && band.rate > 0) {
      const taxInBand = amountInBand * band.rate;
      incomeTax += taxInBand;
      breakdown.push({
        bandName: band.name,
        rate: band.rate,
        amountInBand,
        taxInBand
      });
    }

    prevLimit = band.upTo === Infinity ? taxableIncome : band.upTo;
    if (prevLimit >= taxableIncome) break;
  }

  // Netherlands: apply tax credits
  if (countryId === 'nl') {
    const credit = Math.min(country.generalTaxCredit || 0, incomeTax);
    incomeTax = Math.max(0, incomeTax - credit);
  }

  // Australia: add Medicare Levy
  let medicareLevy = 0;
  if (countryId === 'au') {
    medicareLevy = grossAnnual > 26000 ? grossAnnual * (country.medicareLevy || 0.02) : 0;
  }

  // Social contributions
  let socialContributions = 0;
  if (countryId === 'us') {
    // FICA capped at Social Security wage base ($168,600 for 2024)
    const ssWageBase = 168600;
    const ssContrib = Math.min(grossAnnual, ssWageBase) * 0.062;
    const medicareContrib = grossAnnual * 0.0145;
    const additionalMedicare = grossAnnual > 200000 ? (grossAnnual - 200000) * 0.009 : 0;
    socialContributions = ssContrib + medicareContrib + additionalMedicare;
  } else if (countryId === 'ca') {
    // CPP capped at pensionable earnings ceiling (~$68,500 for 2024)
    const cppCeiling = 68500;
    const cppBase = 3500; // basic exemption
    const cppContrib = Math.min(Math.max(0, grossAnnual - cppBase), cppCeiling - cppBase) * (country.cppRate || 0.0595);
    // EI capped at insurable earnings (~$63,200 for 2024)
    const eiCeiling = 63200;
    const eiContrib = Math.min(grossAnnual, eiCeiling) * (country.eiRate || 0.0166);
    socialContributions = cppContrib + eiContrib;
  } else if (countryId === 'au') {
    socialContributions = medicareLevy; // Medicare levy already calculated above
  } else {
    socialContributions = grossAnnual * (country.socialRate || 0);
  }

  const totalDeductions = incomeTax + socialContributions + (countryId === 'au' ? 0 : 0);
  const netAnnual = Math.max(0, grossAnnual - incomeTax - socialContributions);
  const effectiveRate = grossAnnual > 0 ? ((incomeTax + socialContributions) / grossAnnual) : 0;

  return {
    grossAnnual,
    incomeTax,
    socialContributions,
    medicareLevy: countryId === 'au' ? medicareLevy : 0,
    totalDeductions: incomeTax + socialContributions,
    netAnnual,
    effectiveRate,
    breakdown,
    currency: country.currencySymbol,
    isEstimate: true
  };
}

/**
 * Format a number as currency for a given country
 */
function formatCountryCurrency(amount, countryId) {
  const country = SITE_DATA.countries[countryId];
  if (!country) return amount.toFixed(2);

  const currencyMap = {
    'gb': { code: 'GBP', locale: 'en-GB' },
    'de': { code: 'EUR', locale: 'de-DE' },
    'fr': { code: 'EUR', locale: 'fr-FR' },
    'nl': { code: 'EUR', locale: 'nl-NL' },
    'es': { code: 'EUR', locale: 'es-ES' },
    'ie': { code: 'EUR', locale: 'en-IE' },
    'it': { code: 'EUR', locale: 'it-IT' },
    'pl': { code: 'PLN', locale: 'pl-PL' },
    'us': { code: 'USD', locale: 'en-US' },
    'ca': { code: 'CAD', locale: 'en-CA' },
    'au': { code: 'AUD', locale: 'en-AU' },
    'ch': { code: 'CHF', locale: 'de-CH' },
    'no': { code: 'NOK', locale: 'nb-NO' },
    'ae': { code: 'AED', locale: 'ar-AE' }
  };

  const fmt = currencyMap[countryId] || { code: 'USD', locale: 'en-US' };

  return new Intl.NumberFormat(fmt.locale, {
    style: 'currency',
    currency: fmt.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
