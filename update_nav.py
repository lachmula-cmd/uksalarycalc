#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Batch update nav + footer on all pages."""
import os, re

BASE = r'C:\Users\maysa\.gemini\antigravity\scratch\uk-salary-calculator'

def new_nav(p=''):
    return (
        '    <nav aria-label="Main navigation">\n'
        '      <ul>\n'
        '        <li><a href="' + p + 'index.html">Home</a></li>\n'
        '        <li><a href="' + p + 'regions.html">Regions</a></li>\n'
        '        <li class="has-dropdown">\n'
        '          <a href="' + p + 'regions.html">Countries &#9662;</a>\n'
        '          <ul class="nav-dropdown">\n'
        '            <li class="nav-dropdown-header">&#127468;&#127463; United Kingdom</li>\n'
        '            <li><a href="' + p + 'uk/index.html">&#127468;&#127463; United Kingdom</a></li>\n'
        '            <li class="nav-dropdown-header">&#127466;&#127482; European Union</li>\n'
        '            <li><a href="' + p + 'eu/ireland.html">&#127470;&#127466; Ireland</a></li>\n'
        '            <li><a href="' + p + 'eu/germany.html">&#127465;&#127466; Germany</a></li>\n'
        '            <li><a href="' + p + 'eu/france.html">&#127467;&#127479; France</a></li>\n'
        '            <li><a href="' + p + 'eu/netherlands.html">&#127475;&#127473; Netherlands</a></li>\n'
        '            <li><a href="' + p + 'eu/spain.html">&#127466;&#127480; Spain</a></li>\n'
        '            <li><a href="' + p + 'eu/italy.html">&#127470;&#127481; Italy</a></li>\n'
        '            <li><a href="' + p + 'eu/poland.html">&#127477;&#127473; Poland</a></li>\n'
        '            <li class="nav-dropdown-header">&#127758; Global</li>\n'
        '            <li><a href="' + p + 'global/usa.html">&#127482;&#127480; USA</a></li>\n'
        '            <li><a href="' + p + 'global/canada.html">&#127464;&#127462; Canada</a></li>\n'
        '            <li><a href="' + p + 'global/australia.html">&#127462;&#127482; Australia</a></li>\n'
        '            <li><a href="' + p + 'global/switzerland.html">&#127464;&#127469; Switzerland</a></li>\n'
        '            <li><a href="' + p + 'global/norway.html">&#127475;&#127476; Norway</a></li>\n'
        '            <li><a href="' + p + 'global/uae.html">&#127462;&#127466; UAE</a></li>\n'
        '          </ul>\n'
        '        </li>\n'
        '        <li><a href="' + p + 'guides/index.html">Guides</a></li>\n'
        '        <li><a href="' + p + 'about.html">About</a></li>\n'
        '        <li><a href="' + p + 'contact.html">Contact</a></li>\n'
        '      </ul>\n'
        '    </nav>'
    )

def new_footer_grid(p=''):
    return (
        '  <div class="footer-grid">\n'
        '    <div class="footer-col footer-brand">\n'
        '      <a href="' + p + 'index.html" class="nav-brand">Salary<span>UKCalc</span></a>\n'
        '      <p>Free salary and tax calculators for the UK, EU, and global countries. All calculations run in your browser. Results are estimates only &mdash; not professional tax advice.</p>\n'
        '    </div>\n'
        '    <div class="footer-col">\n'
        '      <h4>Regions</h4>\n'
        '      <ul>\n'
        '        <li><a href="' + p + 'uk/index.html">&#127468;&#127463; United Kingdom</a></li>\n'
        '        <li><a href="' + p + 'eu/index.html">&#127466;&#127482; European Union</a></li>\n'
        '        <li><a href="' + p + 'global/index.html">&#127758; Global</a></li>\n'
        '        <li><a href="' + p + 'regions.html">All Regions</a></li>\n'
        '      </ul>\n'
        '    </div>\n'
        '    <div class="footer-col">\n'
        '      <h4>Countries</h4>\n'
        '      <ul>\n'
        '        <li><a href="' + p + 'eu/ireland.html">&#127470;&#127466; Ireland</a></li>\n'
        '        <li><a href="' + p + 'eu/germany.html">&#127465;&#127466; Germany</a></li>\n'
        '        <li><a href="' + p + 'eu/france.html">&#127467;&#127479; France</a></li>\n'
        '        <li><a href="' + p + 'global/usa.html">&#127482;&#127480; USA</a></li>\n'
        '        <li><a href="' + p + 'global/australia.html">&#127462;&#127482; Australia</a></li>\n'
        '        <li><a href="' + p + 'global/uae.html">&#127462;&#127466; UAE</a></li>\n'
        '      </ul>\n'
        '    </div>\n'
        '    <div class="footer-col">\n'
        '      <h4>Guides</h4>\n'
        '      <ul>\n'
        '        <li><a href="' + p + 'guides/gross-vs-net-salary.html">Gross vs Net Salary</a></li>\n'
        '        <li><a href="' + p + 'guides/income-tax-vs-social-contributions.html">Tax vs Social Contributions</a></li>\n'
        '        <li><a href="' + p + 'guides/how-payroll-deductions-work.html">Payroll Deductions</a></li>\n'
        '        <li><a href="' + p + 'guides/tax-residency-basics.html">Tax Residency</a></li>\n'
        '        <li><a href="' + p + 'guides/why-net-salary-differs-by-country.html">Why Net Pay Differs</a></li>\n'
        '      </ul>\n'
        '    </div>\n'
        '    <div class="footer-col">\n'
        '      <h4>Legal</h4>\n'
        '      <ul>\n'
        '        <li><a href="' + p + 'privacy.html">Privacy Policy</a></li>\n'
        '        <li><a href="' + p + 'terms.html">Terms of Use</a></li>\n'
        '        <li><a href="' + p + 'disclaimer.html">Disclaimer</a></li>\n'
        '        <li><a href="' + p + 'methodology.html">Methodology</a></li>\n'
        '        <li><a href="' + p + 'about.html">About Us</a></li>\n'
        '        <li><a href="' + p + 'contact.html">Contact</a></li>\n'
        '      </ul>\n'
        '    </div>\n'
        '  </div>'
    )

# Match <nav aria-label="Main navigation"> ... </nav>
NAV_RE = re.compile(
    r'<nav aria-label="Main navigation">.*?</nav>',
    re.DOTALL
)

def replace_footer_grid(content, p):
    """Replace everything from <div class="footer-grid"> up to (not including) <div class="footer-bottom">"""
    start_tag = '<div class="footer-grid">'
    end_tag = '<div class="footer-bottom">'
    si = content.find(start_tag)
    ei = content.find(end_tag)
    if si == -1 or ei == -1:
        return content, False
    # Find the closing </div> of footer-grid just before footer-bottom
    # Walk backwards from ei to find the last </div>
    chunk_before_bottom = content[si:ei]
    # Remove trailing whitespace/newlines to find last </div>
    rstrip_chunk = chunk_before_bottom.rstrip()
    if not rstrip_chunk.endswith('</div>'):
        return content, False
    # Replace the entire footer-grid block
    new_content = content[:si] + new_footer_grid(p) + '\n' + content[ei:]
    return new_content, True

pages = {
    '': [
        'about.html', 'contact.html', 'disclaimer.html', 'terms.html',
        'methodology.html', 'privacy.html', 'hourly-to-salary.html'
    ],
    '../': [
        'uk/index.html', 'uk/salary-calculator.html',
        'eu/germany.html', 'eu/france.html', 'eu/netherlands.html', 'eu/spain.html',
        'global/usa.html', 'global/canada.html', 'global/australia.html',
        'guides/index.html', 'guides/gross-vs-net-salary.html',
        'guides/income-tax-vs-social-contributions.html',
        'guides/how-payroll-deductions-work.html',
        'guides/tax-residency-basics.html',
        'guides/why-net-salary-differs-by-country.html'
    ]
}

results = []
for prefix, files in pages.items():
    for fname in files:
        fpath = os.path.join(BASE, fname)
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            orig = content

            # Replace nav
            nav_match = NAV_RE.search(content)
            if nav_match:
                content = content[:nav_match.start()] + new_nav(prefix) + content[nav_match.end():]
                nav_ok = True
            else:
                nav_ok = False

            # Replace footer-grid
            content, footer_ok = replace_footer_grid(content, prefix)

            if content != orig:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(content)
                results.append(f'UPDATED  nav={nav_ok} footer={footer_ok}: {fname}')
            else:
                results.append(f'SKIPPED  nav={nav_ok} footer={footer_ok}: {fname}')
        except Exception as e:
            results.append(f'ERROR {fname}: {e}')

for r in results:
    print(r)
