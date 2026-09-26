/**
 * A headline figure. Money reads "PKR 48,320.00" with the currency set smaller,
 * so the amount carries the card and fits half-width cards on phones.
 */
export function MoneyFigure({ value }: { value: string }) {
  if (!value.startsWith('PKR ')) return value;
  return (
    <>
      <span className="mr-1 text-[0.7em] font-medium text-text-muted">PKR</span>
      {value.slice(4)}
    </>
  );
}
