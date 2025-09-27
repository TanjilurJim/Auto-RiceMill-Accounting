import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

type Basis = 'per_bosta' | 'per_kg_main' | 'fixed';
type Row = { id?: string; label: string; rate: number | string; basis: Basis };

interface Props {
    presets: Row[];
    basisOptions: { value: Basis; label: string }[];
}

const uid = () => Math.random().toString(36).slice(2, 10);

export default function ProductionCostSetting({ presets, basisOptions }: Props) {
    const { data, setData, put, processing, errors } = useForm<{ items: Row[] }>({
        items: presets?.length ? presets : [],
    });

    const addRow = () => setData('items', [...data.items, { id: uid(), label: '', rate: '', basis: 'per_bosta' }]);

    const removeRow = (i: number) =>
        setData(
            'items',
            data.items.filter((_, idx) => idx !== i),
        );

    const patchRow = (i: number, patch: Partial<Row>) =>
        setData(
            'items',
            data.items.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
        );

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('company-settings.costings.update'));
    };
    const t = useTranslation();

    return (
        <AppLayout>
            <Head title={t('pcsPageTitle')} />
            <div className="mx-auto w-full p-4 md:p-12">
                <h1 className="mb-4 text-2xl font-bold">{t('pcsMainTitle')}</h1>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="bg-background rounded-lg border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{t('pcsPresetsTitle')}</h2>
                            <button type="button" onClick={addRow} className="rounded bg-slate-800 px-3 py-1 text-sm text-white">
                                {t('pcsAddRowButton')}
                            </button>
                        </div>

                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="w-[40%] border p-2">{t('pcsLabelHeader')}</th>
                                    <th className="w-[20%] border p-2">{t('pcsBasisHeader')}</th>
                                    <th className="w-[20%] border p-2">{t('pcsRateHeader')}</th>
                                    {/* <th className="w-[8%] border p-2">ID</th> */}
                                    <th className="w-[8%] border p-2">✕</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((row, i) => (
                                    <tr key={row.id ?? i}>
                                        <td className="border p-1">
                                            <input
                                                className="w-full rounded border px-2 py-1"
                                                value={row.label}
                                                onChange={(e) => patchRow(i, { label: e.target.value })}
                                                placeholder={t('pcsLabelPlaceholder')}
                                            />
                                            {errors[`items.${i}.label` as any] && (
                                                <p className="text-xs text-red-500">{errors[`items.${i}.label` as any]}</p>
                                            )}
                                        </td>

                                        <td className="border p-1">
                                            <select
                                                className="w-full rounded border px-2 py-1"
                                                value={row.basis}
                                                onChange={(e) => patchRow(i, { basis: e.target.value as Basis })}
                                            >
                                                {basisOptions.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`items.${i}.basis` as any] && (
                                                <p className="text-xs text-red-500">{errors[`items.${i}.basis` as any]}</p>
                                            )}
                                        </td>

                                        <td className="border p-1">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full rounded border px-2 py-1 text-right"
                                                value={row.rate}
                                                onChange={(e) => patchRow(i, { rate: e.target.value })}
                                                placeholder={t('pcsRatePlaceholder')}
                                            />
                                            {errors[`items.${i}.rate` as any] && (
                                                <p className="text-xs text-red-500">{errors[`items.${i}.rate` as any]}</p>
                                            )}
                                        </td>

                                        {/* <td className="border p-1">
                                            <input
                                                className="w-full rounded border px-2 py-1"
                                                value={row.id ?? ''}
                                                onChange={(e) => patchRow(i, { id: e.target.value })}
                                                placeholder="auto from label"
                                            />
                                            {errors[`items.${i}.id` as any] && (
                                                <p className="text-xs text-red-500">{errors[`items.${i}.id` as any]}</p>
                                            )}
                                        </td> */}

                                        <td className="border p-1 text-center">
                                            <button
                                                type="button"
                                                className="font-bold text-red-600"
                                                onClick={() => removeRow(i)}
                                                title={t('pcsRemoveRowTitle')}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {data.items.length === 0 && (
                                    <tr>
                                        <td className="border p-3 text-center text-gray-500" colSpan={5}>
                                            {t('pcsNoPresetsMessage')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>

                {/* <div className="mt-6 text-xs text-gray-500">
                    <p>
                        <b>Basis help:</b> <code>per_bosta</code> = ধানের বস্তা সংখ্যার গুণ, <code>per_kg_main</code> = মেইন চালের কেজির গুণ,{' '}
                        <code>fixed</code> = স্থির টাকা।
                    </p>
                </div> */}
            </div>
        </AppLayout>
    );
}
