import type { ReactNode } from 'react';

type PillTone = 'green' | 'amber' | 'red' | 'crust';

const TONES: Record<PillTone, string> = {
  green: 'green',
  amber: 'amber',
  red: 'red',
  crust: 'crust',
};

export function Pill({ tone = 'green', children }: { tone?: PillTone; children: ReactNode }) {
  return <span className={`pill ${TONES[tone]}`}>{children}</span>;
}