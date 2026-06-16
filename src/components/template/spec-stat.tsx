import { FC } from 'react';

interface SpecStatProps {
  label: string;
  value: string | number;
}

export const SpecStat: FC<SpecStatProps> = ({ label, value }) => {
  return (
    <div className="spec-stat">
      <p className="spec-stat-label">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
};
