export function generateInvoiceNumber(): string {
  const date = new Date();

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const todayKey = `${yyyy}${mm}${dd}`;

  const counterKey = `invoice-counter-${todayKey}`;
  const currentCount = Number(localStorage.getItem(counterKey) || "0") + 1;

  localStorage.setItem(counterKey, String(currentCount));

  const serial = String(currentCount).padStart(3, "0");

  return `INV-${todayKey}-${serial}`;
}
