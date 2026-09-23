import type { ExpiryBatch } from '../types';

export const initialBatches: ExpiryBatch[] = [
  { id: 'b1', product: 'Sourdough — B104', branch: 'T. Nagar', baked: 'Today', expiresInHrs: 18, status: 'Markdown', markedDown: false },
  { id: 'b2', product: 'Croissant — B098', branch: 'Anna Nagar', baked: 'Yesterday', expiresInHrs: 26, status: 'Watch' },
  { id: 'b3', product: 'Red Velvet — B112', branch: 'RS Puram', baked: 'Today', expiresInHrs: 48, status: 'Fresh' },
  { id: 'b4', product: 'Whole Wheat — B091', branch: 'Anna Nagar', baked: '2 days ago', expiresInHrs: 6, status: 'Markdown', markedDown: false },
  { id: 'b5', product: 'Pain au Chocolat — B117', branch: 'Gandhipuram', baked: 'Today', expiresInHrs: 20, status: 'Watch' },
  { id: 'b6', product: 'Cheesecake — B099', branch: 'T. Nagar', baked: '1 day ago', expiresInHrs: 52, status: 'Fresh' },
];

export function hoursLabel(hours: number): string {
  if (hours >= 24) return `${Math.floor(hours / 24)} days`;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours} hrs`;
}