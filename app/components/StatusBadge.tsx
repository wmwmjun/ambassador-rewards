import type { Status } from '@/lib/types';

const cfg: Record<Status, { bg: string; color: string; label: string }> = {
  completed: { bg: '#F0FBF3', color: '#1A8C3C', label: 'Completed' },
  pending:   { bg: '#F3F2FF', color: '#7B72E8', label: 'Pending' },
  rejected:  { bg: '#FFF2F1', color: '#C0281E', label: 'Rejected' },
};

export default function StatusBadge({ status }: { status: Status }) {
  const c = cfg[status];
  return (
    <span
      className="badge"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}
