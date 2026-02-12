export function formatCurrency(cents: number | bigint): string {
  const amount = typeof cents === 'bigint' ? Number(cents) : cents;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
}

export function formatNumber(value: number | bigint): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
