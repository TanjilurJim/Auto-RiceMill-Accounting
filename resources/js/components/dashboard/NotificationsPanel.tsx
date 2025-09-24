// resources/ts/components/dashboard/NotificationsPanel.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../useTranslation';

/** Shape expected from the server */
export type ExpiringUser = {
  id: number | string;
  name: string;
  email: string;
  /** When this account will turn inactive (ISO string) */
  inactiveAt: string;
  /** Optional: when the warning window starts (ISO). If missing, we assume 7 days before inactiveAt */
  warnFrom?: string;
};

export function NotificationsPanel({ expiring = [] as ExpiringUser[] }) {
  // tick every second for live countdown
  const now = useNow(1000);
  const t = useTranslation();

  const rows = useMemo(() => {
    return (expiring || []).map((u) => {
      const end = new Date(u.inactiveAt).getTime();
      const start = u.warnFrom ? new Date(u.warnFrom).getTime() : end - 7 * 24 * 60 * 60 * 1000; // default 7d window
      const total = Math.max(end - start, 1);
      const left = Math.max(end - now, 0);
      const pct = Math.min(100, Math.max(0, ((total - left) / total) * 100));

      return {
        ...u,
        _leftMs: left,
        _percent: pct,
        _endsOnReadable: new Date(end).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        _severity: left <= 24 * 3600_000 ? 'critical' : left <= 72 * 3600_000 ? 'warning' : 'ok',
      };
    }).sort((a, b) => a._leftMs - b._leftMs);
  }, [expiring, now]);

  return (
    <Card className="shadow-sm p">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <CardTitle className="text-base font-medium">{t('expiringSoon')}</CardTitle>
        </div>
        <Link href={route('users.index', { filter: 'expiring' })}>
          <Button variant="ghost" size="sm">{t('viewAll')}</Button>
        </Link>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t('noAccountsExpiring')}</p>
          ) : (
            <div className="space-y-4">
              {rows.map((u) => (
                <div
                  key={u.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{(u.name ?? 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate">
                          <p className="font-medium leading-none truncate">{u.name}</p>
                          <p className="text-muted-foreground text-xs truncate">{u.email}</p>
                        </div>

                        {u._severity !== 'ok' && (
                          <span
                            className={
                              u._severity === 'critical'
                                ? 'text-red-600 inline-flex items-center text-xs font-medium'
                                : 'text-amber-600 inline-flex items-center text-xs font-medium'
                            }
                          >
                            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                            {u._severity === 'critical' ? t('lessThan24h') : t('lessThan72h')}
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={
                              'h-full transition-[width] ' +
                              (u._severity === 'critical'
                                ? 'bg-red-600'
                                : u._severity === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-primary')
                            }
                            style={{ width: `${u._percent}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{t('ends')} {formatLeft(u._leftMs)} • {u._endsOnReadable}</span>
                          <Link href={route('users.edit', u.id)}>
                            <Button size="sm" variant="outline">{t('manage')}</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/* ───────────── Helpers ───────────── */

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function formatLeft(ms: number) {
  if (ms <= 0) return 'now';
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  if (minutes > 0) return `in ${minutes}m ${seconds}s`;
  return `in ${seconds}s`;
}
