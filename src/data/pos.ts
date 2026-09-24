/** The POS walkthrough, one entry per state of the recreated POS screen. */
export const POS_STEPS = [
  {
    key: 'search',
    title: 'Scan or search',
    body: 'One box does both. A barcode scanner types the code and presses Enter; a cashier types a name or code. Ctrl + K brings the cursor back from anywhere.',
  },
  {
    key: 'packaging',
    title: 'Pick the packaging',
    body: 'Tablet, strip or box — each with its own price and live availability at this branch, converted from base-unit stock.',
  },
  {
    key: 'cart',
    title: 'Build the cart',
    body: 'Adjust quantities inline. Invalid quantities are flagged before they can reach the sale.',
  },
  {
    key: 'customer',
    title: 'Walk-in or customer',
    body: 'Walk-in needs no selection. Choose a customer to sell on account, with their available credit shown before you commit.',
  },
  {
    key: 'discount',
    title: 'Apply a discount',
    body: 'Percent or amount off. Anything above the branch’s limit needs a user who holds discount-approval permission.',
  },
  {
    key: 'payment',
    title: 'Take payment',
    body: 'Cash, card, bank transfer or digital wallet. Cash received calculates change; anything left unpaid goes on the customer’s account.',
  },
  {
    key: 'receipt',
    title: 'Complete and print',
    body: 'Ctrl + Enter completes the sale. Stock is allocated FEFO inside the same transaction, and the receipt is ready to print.',
  },
] as const;

export type PosStepKey = (typeof POS_STEPS)[number]['key'];
