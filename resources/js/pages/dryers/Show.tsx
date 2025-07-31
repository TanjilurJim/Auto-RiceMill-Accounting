/* resources/js/Pages/dryers/Show.tsx
   -------------------------------------------------------------------------- */
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';

import { Head, Link, router } from '@inertiajs/react';

interface Dryer {
    id: number;
    dryer_name: string;
    dryer_type: string | null;
    capacity: number | string;
    batch_time: number | string | null;
    manufacturer: string | null;
    model_number: string | null;
    power_kw: number | string | null;
    fuel_type: string | null;
    length_mm: number | string | null;
    width_mm: number | string | null;
    height_mm: number | string | null;
}

export default function Show({ dryer }: { dryer: Dryer }) {
    /* ---------- helpers ---------- */
    const fmt = (n: number | string | null | undefined, digits = 2) =>
        n === null || n === undefined || n === '' ? '—' : new Intl.NumberFormat('en-US', { minimumFractionDigits: digits }).format(Number(n));

    const destroy = () => {
        confirmDialog({}, () => {
            router.delete(route('dryers.destroy', dryer.id));
        });
    };

    /* ---------- render ---------- */
    return (
        <AppLayout>
            <Head title={`Dryer – ${dryer.dryer_name}`} />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader
                        title={dryer.dryer_name}
                        actions={<ActionButtons size="md" editHref={route('dryers.edit', dryer.id)} onDelete={destroy} />}
                    />

                    {/* Info grid ---------------------------------------------------- */}
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <InfoCard label="Dryer Type" value={dryer.dryer_type ?? '—'} />
                        <InfoCard label="Capacity (t)" value={fmt(dryer.capacity)} />
                        <InfoCard label="Batch Time (min)" value={fmt(dryer.batch_time, 0)} />

                        <InfoCard label="Manufacturer" value={dryer.manufacturer ?? '—'} />
                        <InfoCard label="Model Number" value={dryer.model_number ?? '—'} />
                        <InfoCard label="Power (kW)" value={fmt(dryer.power_kw)} />

                        <InfoCard label="Fuel Type" value={dryer.fuel_type ?? '—'} />
                        <InfoCard label="Length (mm)" value={fmt(dryer.length_mm, 0)} />
                        <InfoCard label="Width (mm)" value={fmt(dryer.width_mm, 0)} />
                        <InfoCard label="Height (mm)" value={fmt(dryer.height_mm, 0)} />
                    </div>

                    {/* Back link ---------------------------------------------------- */}
                    <div className="mt-10">
                        <Link href={route('dryers.index')} className="text-primary hover:underline">
                            ← Back to list
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* Helper sub-component ------------------------------------------------------ */
function InfoCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded border p-4 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-lg font-semibold break-all text-gray-800">{value}</p>
        </div>
    );
}
