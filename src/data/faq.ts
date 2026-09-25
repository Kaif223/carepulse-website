/** Answers are limited to what the product does today — including what it doesn't. */
export const FAQ = [
  {
    q: 'Is CarePulse only for pharmacies?',
    a: 'No. It is designed around pharmacy operations — batches, expiries, prescription items — but the same catalogue handles general retail: baby care, personal care, cosmetics, medical accessories and other FMCG, including goods with no expiry date.',
  },
  {
    q: 'Can I sell a single tablet from a box?',
    a: 'Yes. Each product defines its own packaging levels — for example tablet, strip of 10 and box of 100 — with a price and barcode for each. Stock is held in the smallest unit, so selling a strip or a single tablet reduces it correctly.',
  },
  {
    q: 'How does CarePulse decide which batch to sell?',
    a: 'First-Expired, First-Out. The batch with the earliest expiry is used first, batches with no expiry go last, and ties go to the batch received first. Expired and quarantined batches are never sold. A pharmacist with override permission can choose a specific batch, and that choice is recorded in the audit log.',
  },
  {
    q: 'Can customers buy on credit (udhaar)?',
    a: 'Yes. Select the customer at the POS and take less than the total; the remainder goes on their ledger, within their credit limit. Walk-in sales must be paid in full. Payments and returns reduce the balance, and every change is a ledger line you can see.',
  },
  {
    q: 'Does it work with barcode scanners?',
    a: 'Yes. The POS search box accepts a scanner that types the code and presses Enter, and each packaging level can carry its own barcode, so scanning a box and scanning a strip add the right item.',
  },
  {
    q: 'Can I run more than one branch?',
    a: 'Yes. Retail branches and warehouses each keep their own stock, cash shifts and documents. Stock moves between them with transfers that are dispatched by one branch and received by the other, and each person can hold a different role at each branch.',
  },
  {
    q: 'Can I print receipts and reports?',
    a: 'Yes. Receipts print from the POS after a sale, and the Cash Summary and Expense Breakdown reports print with a branch and period header, straight from the browser.',
  },
  {
    q: 'Does CarePulse work offline?',
    a: 'Not today. CarePulse is a cloud-first web application and needs a connection to the server. Offline support is not part of the current version.',
  },
  {
    q: 'Is FBR POS e-invoicing supported?',
    a: 'Not in the current version. Invoices record tax correctly — tax is extracted from tax-inclusive shelf prices and frozen onto each line — but there is no FBR integration yet.',
  },
  {
    q: 'Which currency does it use?',
    a: 'Pakistani rupees (PKR). Amounts are stored as exact decimals, never floating-point, so totals and balances carry no floating-point rounding errors.',
  },
] as const;
