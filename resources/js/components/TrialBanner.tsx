// components/TrialBanner.tsx
import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, Info } from 'lucide-react';
import React from 'react';

type TrialInfo = {
  inactive?: boolean;
  expiring_soon?: boolean;
  days_left?: number;       // fallback if ends_at isn't available
  ends_at?: string | Date;  // ISO string or Date
};

function parseEndsAt(trial: TrialInfo | null | undefined): Date | null {
  if (!trial) return null;
  if (trial.ends_at) {
    const d = new Date(trial.ends_at);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof trial.days_left === 'number') {
    // Fallback approximation; better to supply precise ends_at from backend
    const now = new Date();
    return new Date(now.getTime() + trial.days_left * 24 * 60 * 60 * 1000);
  }
  return null;
}

function formatParts(msRemaining: number) {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

function compactClock(p: ReturnType<typeof formatParts>) {
  // e.g. "2d 4h 7m 12s" but drop leading zero units
  const segs: string[] = [];
  if (p.days) segs.push(`${p.days}d`);
  if (p.hours || p.days) segs.push(`${p.hours}h`);
  if (p.minutes || p.hours || p.days) segs.push(`${p.minutes}m`);
  segs.push(`${p.seconds}s`);
  return segs.join(' ');
}

function humanLabel(p: ReturnType<typeof formatParts>) {
  if (p.days > 0) return `${p.days} day${p.days === 1 ? '' : 's'} left`;
  if (p.hours > 0) return `${p.hours} hour${p.hours === 1 ? '' : 's'} left`;
  if (p.minutes > 0) return `${p.minutes} minute${p.minutes === 1 ? '' : 's'} left`;
  return `${p.seconds} second${p.seconds === 1 ? '' : 's'} left`;
}

export default function TrialBanner() {
  const { auth } = usePage().props as any;
  const trial = (auth?.trial || null) as TrialInfo | null;

  if (!trial) return null;

  const endsAt = parseEndsAt(trial);

  // Live countdown
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    // Update every second; align ticks to the second boundary for a steady countdown
    const tick = () => setNow(Date.now());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // If no precise end time and not expiring soon, fall back to existing behavior
  const msRemaining = endsAt ? Math.max(0, endsAt.getTime() - now) : (trial.days_left ?? 0) * 86400000;
  const parts = formatParts(msRemaining);

  // Inactive state stays as-is
  if (trial.inactive || msRemaining <= 0) {
    return (
      <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div className="text-sm font-medium text-red-700">Your trial has ended and your account is inactive.</div>
          <Link
            href="/contacts"
            className="ml-auto inline-flex items-center rounded bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  // Expiring soon (or generally has an end time): show live, humanized countdown
  if (trial.expiring_soon || endsAt) {
    return (
      <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
          </span>
          <Info className="h-5 w-5 text-amber-600" />
          <div className="text-sm text-amber-800">
            Trial ends in <span className="font-semibold">{compactClock(parts)}</span> — <span>{humanLabel(parts)}</span>.
          </div>
          <Link
            href="/contacts"
            className="ml-auto inline-flex items-center rounded bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Talk to us
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
