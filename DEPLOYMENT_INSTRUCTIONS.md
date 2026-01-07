# How to Deploy Your UK Salary Calculator

Here are the step-by-step instructions to put your website online using GitHub Pages.

## 1. Create a GitHub Account & Repository
1. Go to [github.com](https://github.com) and sign up if you haven't already.
2. Click the **+** icon in the top right corner and select **New repository**.
3. **Repository name**: Enter `uk-salary-calculator` (or any name you like).
4. **Public/Private**: Select **Public** (required for free GitHub Pages).
5. **Initialize this repository**: Check the box **"Add a README file"**.
6. Click **Create repository**.

## 2. Upload Your Files
1. In your new repository, click the **Add file** button > **Upload files**.
2. Drag and drop **ALL** the files I created for you into the upload area:
   - `index.html`
   - `hourly-to-salary.html`
   - `style.css`
   - `script.js`
   - `privacy.html`
   - `about.html`
   - `contact.html`
   - `sitemap.xml`
   - `robots.txt`
3. Wait for them to finish uploading.
4. In the "Commit changes" box at the bottom, type "Initial website upload".
5. Click **Commit changes**.

## 3. Enable GitHub Pages
1. In your repository, click the **Settings** tab (gear icon).
2. On the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment** > **Source**, ensure "Deploy from a branch" is selected.
4. Under **Branch**, select **main** (or `master`) and folder **/(root)**.
5. Click **Save**.

## 4. Test Your Live Site
1. Wait about 1-2 minutes. Refresh the Page settings page.
2. You will see a box that says "Your site is live at...".
3. Click that link to see your new website!
4. Test the calculators to make sure they work just like they did in our preview.

## 5. Next Steps (AdSense)
1. Once your site is live and has some traffic, sign up for [Google AdSense](https://adsense.google.com/).
2. When asked to "Add site", enter your GitHub Pages URL (e.g., `username.github.io/uk-salary-calculator`).
3. AdSense will give you a code snippet. You will need to edit `index.html` and other pages to paste that code in the `<head>` section (I left comments in the files showing where).
