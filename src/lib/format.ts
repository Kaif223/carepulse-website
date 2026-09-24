/** Mirrors the product's formatPKR(): thousands separators, two decimals, PKR label. */
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatQty(quantity: number): string {
  return quantity.toLocaleString('en-US');
}
