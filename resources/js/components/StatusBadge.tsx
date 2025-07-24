export const StatusBadge = ({ status, by }:{
  status: 'approved' | 'pending' | 'rejected' | '—';
  by?: string;
}) => {
  const colours = {
    approved:  'bg-green-100 text-green-800',
    pending:   'bg-yellow-100 text-yellow-800',
    rejected:  'bg-red-100  text-red-800',
    '—':       'bg-gray-100 text-gray-500',
  }[status];

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${colours}`}
      title={by ? `${status} by ${by}` : status}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};