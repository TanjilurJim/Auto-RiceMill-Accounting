// resources/ts/components/dashboard/RunningDryersPanel.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Timer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../useTranslation';

type RunningDryer = {
    id: number | string;
    dryer: string;
    batchMinutes: number; // minutes
    startedAt?: string | null; // ISO
    endsAt?: string | null; // ISO
    capacityKg?: number;
    loadedKg?: number;
    refNo?: string | null;
};

export default function RunningDryersPanel({ items = [] as RunningDryer[] }) {
    const now = useNow(1000);
    const t = useTranslation();

    const rows = useMemo(() => {
        return (items || [])
            .map((d) => {
                const startMs = d.startedAt ? new Date(d.startedAt).getTime() : NaN;
                const endMs = d.endsAt ? new Date(d.endsAt).getTime() : NaN;
                const total = isFinite(startMs) && isFinite(endMs) ? Math.max(endMs - startMs, 1) : 0;
                const left = isFinite(endMs) ? Math.max(endMs - now, 0) : 0;
                const elapsed = total ? total - left : 0;

                const percent = total ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;
                const overdue = isFinite(endMs) ? now > endMs : false;

                // severity: near done or overdue
                const severity = overdue
                    ? 'critical'
                    : left <= 30 * 60 * 1000
                      ? 'warning' // <= 30 min left
                      : 'ok';

                const util = d.capacityKg && d.capacityKg > 0 ? Math.min(1, (d.loadedKg || 0) / d.capacityKg) : null;

                return {
                    ...d,
                    _percent: percent,
                    _leftMs: left,
                    _overdue: overdue,
                    _severity: severity,
                    _endsAtReadable: isFinite(endMs)
                        ? new Date(endMs).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : '—',
                    _utilPct: util !== null ? Math.round(util * 100) : null,
                };
            })
            .sort((a, b) => {
                // sort: overdue first, then soonest to finish
                if (a._overdue !== b._overdue) return a._overdue ? -1 : 1;
                return a._leftMs - b._leftMs;
            });
    }, [items, now]);

    return (
        <Card className="shadow-sm">
            <CardHeader className="">
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5" />
                        <CardTitle className="text-base">{t('runningDryers')}</CardTitle>
                    </div>
                    <Link href={route('crushing.jobs.index')}>
                        <Button size="sm" variant="ghost">
                            {t('viewAll')}
                        </Button>
                    </Link>
                </div>
            </CardHeader>

            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    {rows.length === 0 ? (
                        <p className="text-muted-foreground text-sm">{t('noDryersRunning')}</p>
                    ) : (
                        <div className="space-y-4">
                            {rows.map((d) => (
                                <div key={d.id} className="rounded-lg border p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="leading-none font-medium">{d.dryer}</p>
                                                {d._severity !== 'ok' && (
                                                    <span
                                                        className={
                                                            d._severity === 'critical'
                                                                ? 'inline-flex items-center text-xs text-red-600'
                                                                : 'inline-flex items-center text-xs text-amber-600'
                                                        }
                                                    >
                                                        <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                                                        {d._overdue ? 'Overdue' : 'Finishing soon'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-xs">
                                                Batch: {d.batchMinutes || 0} min • Ends {formatLeft(d._leftMs, d._overdue)} • {d._endsAtReadable}
                                            </p>
                                        </div>

                                        <Link href={route('crushing.jobs.show', d.id)}>
                                            <Button size="sm" variant="outline">
                                                {t('details')}
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* progress bar */}
                                    <div className="mt-3">
                                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                                            <div
                                                className={`h-full transition-[width] ${
                                                    d._overdue ? 'bg-red-600' : d._severity === 'warning' ? 'bg-amber-500' : 'bg-primary'
                                                }`}
                                                style={{ width: `${d._percent}%` }}
                                            />
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

/* ───────────── helpers ───────────── */

function useNow(intervalMs = 1000) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(t);
    }, [intervalMs]);
    return now;
}

function formatLeft(ms: number, overdue: boolean) {
    if (overdue) {
        const s = Math.floor((0 - ms) / 1000);
        const m = Math.floor(s / 60);
        const h = Math.floor(m / 60);
        const mm = m % 60;
        const hh = h % 24;
        const dd = Math.floor(h / 24);
        if (dd > 0) return `${dd}d ${hh}h overdue`;
        if (h > 0) return `${h}h ${mm}m overdue`;
        if (m > 0) return `${m}m overdue`;
        return `seconds overdue`;
    }
    if (ms <= 0) return 'now';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const hh = h % 24;
    const dd = Math.floor(h / 24);
    if (dd > 0) return `in ${dd}d ${hh}h`;
    if (h > 0) return `in ${h}h ${mm}m`;
    if (m > 0) return `in ${m}m`;
    return `in ${s}s`;
}
