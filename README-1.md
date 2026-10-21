# Shop Profit Calculator PK — upgraded starter

## Files
- `index.html` — page structure
- `style.css` — professional responsive styling
- `app.js` — inventory, sales, expenses, reports and backup logic
- `manifest.json` — basic web app metadata

## Update the existing GitHub Pages site
1. Open your repository: `https://github.com/tashkeelsaee-max/Shop-Profit-Calculator-PK`
2. Open each file in the repository and choose the pencil/Edit option.
3. Replace the entire contents with the matching file from this project, then choose **Commit changes**.
4. Repeat for `index.html`, `style.css`, `app.js`, and `manifest.json`.
5. Wait a minute, then open your Pages website and refresh. If old content remains, refresh again later or clear the browser cache.

## Features
- Dashboard for daily sales, estimated daily profit, monthly sales and stock value
- Inventory: add/edit/delete products, stock quantities and low-stock alerts
- Record sales and automatically reduce inventory
- Expense log with category and date
- Date-filtered report and CSV export
- JSON backup and restore

## Important limitations
- Data is saved in localStorage in the current browser on the current device.
- No login, cloud sync, database, payments, or active ads are included.
- Browser storage may be cleared by the user or browser. Download backups regularly.
- Reports are simple estimates, not formal accounting or tax statements.
- The manifest is included, but a complete installable PWA needs a service worker and suitable icons.
- Test with sample data before relying on this for real business records.
