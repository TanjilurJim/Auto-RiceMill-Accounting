export default function ProgressBar({ total, paid }: { total: number; paid: number }) {
  const pct = total === 0 ? 0 : Math.min(100, (paid / total) * 100);
  return (
    <div className="w-full h-4 bg-gray-200 rounded mb-4 overflow-hidden">
      <div
        className="h-4 bg-green-500"
        style={{ width: `${pct}%`, transition: 'width .4s' }}
      />
    </div>
  );
}
