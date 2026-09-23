import { useCountUp } from '../../hooks/useCountUp';

export function StatCounter({
  value,
  format,
  className,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
}) {
  const count = useCountUp(value);
  return <span className={className}>{format(count)}</span>;
}