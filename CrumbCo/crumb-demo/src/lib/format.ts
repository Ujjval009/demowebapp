export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export function formatINRCompact(n: number): string {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'k';
  return '₹' + n;
}

export function percentOf(revenue: number, target: number): number {
  if (target === 0) return 0;
  return Math.round((revenue / target) * 100);
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}