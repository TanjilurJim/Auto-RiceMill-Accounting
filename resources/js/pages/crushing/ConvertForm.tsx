/*  resources/js/pages/crushing/ConvertForm.tsx  */
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';
import Select from 'react-select';

interface Party {
    id: number;
    account_ledger_name: string;
}
interface Godown {
    id: number;
    name: string;
}
interface Unit {
    id: number;
    name: string;
}
interface Dryer {
    id: number;
    dryer_name: string;
    capacity: number | string;
}

interface Stock {
    [partyId: string]: {
        [godownId: string]: {
            godown_name: string;
            items: { party_item_id: number; item_name: string; qty: number; unit_name: string }[];
        };
    };
}

interface ConsumedRow {
    party_item_id?: string; // party mode
    item_id?: string; // company mode
    lot_id?: string; // company mode
    qty: string;
    unit_name: string;
}
interface GeneratedRow {
    item_name: string;
    qty: string;
    unit_name: string;
}

interface Props {
    parties: Party[];
    godowns: Godown[];
    units: Unit[];
    dryers: Dryer[]; // ✅ keep!
    today: string;
    generated_ref_no: string;
    available_stock: Stock;
    running_job_id?: number | null; // ✅ keep!
}

type Owner = 'company' | 'party';
interface FormState {
    date: string;
    ref_no: string;
    owner: Owner;
    party_ledger_id: string | number;
    godown_id: string | number;
    dryer_id: string | number; // ✅ keep!
    consumed: ConsumedRow[];
    generated: GeneratedRow[];
    remarks: string;
}

export default function ConvertForm({ parties, godowns, units, dryers, today, generated_ref_no, available_stock, running_job_id }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormState>({
        date: today,
        ref_no: generated_ref_no,
        owner: 'party',
        party_ledger_id: '',
        godown_id: '',
        dryer_id: '', // ✅
        consumed: [{ party_item_id: '', item_id: '', lot_id: '', qty: '', unit_name: '' } as any],
        generated: [{ item_name: '', qty: '', unit_name: '' }],
        remarks: '',
    });

    const [lotStock, setLotStock] = React.useState<any[]>([]);
    const [stockBusy, setStockBusy] = React.useState(false);

    React.useEffect(() => {
        if (data.owner !== 'company' || !data.godown_id) {
            setLotStock([]);
            return;
        }
        setStockBusy(true);
        axios
            .get(route('godown.stocks-with-lots', data.godown_id))
            .then((res) => setLotStock(res.data))
            .finally(() => setStockBusy(false));
    }, [data.owner, data.godown_id]);

    const addLine = (sec: 'consumed' | 'generated') =>
        setData(sec, [...data[sec], { party_item_id: '', item_id: '', lot_id: '', qty: '', unit_name: '' } as any]);

    const removeLine = (sec: 'consumed' | 'generated', idx: number) =>
        setData(
            sec,
            data[sec].filter((_, i) => i !== idx),
        );

    const companyItemOpts = lotStock.map((itm: any) => ({
        value: itm.id,
        label: itm.item_name,
        unit: itm.unit,
        lots: itm.lots,
    }));

    const lotOptionsForItem = (itemId: string | number) => {
        const itm = companyItemOpts.find((o) => o.value === Number(itemId));
        if (!itm) return [];
        return itm.lots.map((l: any) => ({ value: l.lot_id, label: `${l.lot_no} – ${l.stock_qty} ${itm.unit}` }));
    };

    const partyItemOptions = (partyId: string | number) => {
        if (data.owner === 'company') return [];
        const pId = String(partyId || '');
        const gId = String(data.godown_id || '');
        if (!pId || !gId) return [];
        if (!available_stock[pId] || !available_stock[pId][gId]) return [];
        const { items } = available_stock[pId][gId];
        return items.map((itm: any) => ({
            value: String(itm.party_item_id ?? itm.item_id),
            label: `${itm.item_name}  (in stock: ${itm.qty} ${itm.unit_name})`,
        }));
    };

    const consumedOpts = partyItemOptions(data.party_ledger_id);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.transfer.store'), { onSuccess: () => reset() });
    };

    return (
        <AppLayout>
            <Head title="Conversion / Transfer" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="mb-4">
                    <Link href={route('party-stock.transfer.index')} className="text-blue-600 hover:underline">
                        ← Back to list
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6">
                    <h1 className="mb-4 text-xl font-bold">পণ্য রূপান্তর (Crushing → Output)</h1>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Header grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* date */}
                            <div>
                                <label className="mb-1 block font-medium">তারিখ</label>
                                <input
                                    type="date"
                                    className="w-full rounded border p-2"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                            </div>

                            {/* owner */}
                            <div className="col-span-2 flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="company"
                                        checked={data.owner === 'company'}
                                        onChange={() => {
                                            setData('owner', 'company');
                                            setData('party_ledger_id', '');
                                        }}
                                    />
                                    আমার স্টক
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" value="party" checked={data.owner === 'party'} onChange={() => setData('owner', 'party')} />
                                    পার্টি স্টক
                                </label>
                            </div>

                            {/* party (conditional) */}
                            {data.owner === 'party' && (
                                <div>
                                    <label className="mb-1 block font-medium">পার্টি</label>
                                    <Select
                                        classNamePrefix="rs"
                                        options={parties.map((p) => ({ value: p.id, label: p.account_ledger_name }))}
                                        value={parties
                                            .map((p) => ({ value: p.id, label: p.account_ledger_name }))
                                            .find((o) => o.value === Number(data.party_ledger_id))}
                                        onChange={(sel) => setData('party_ledger_id', sel?.value || '')}
                                        placeholder="পার্টি নির্বাচন…"
                                        isClearable
                                    />
                                    {errors.party_ledger_id && <p className="text-xs text-red-500">{errors.party_ledger_id}</p>}
                                </div>
                            )}

                            {/* godown */}
                            <div>
                                <label className="mb-1 block font-medium">গুদাম (মিল)</label>
                                <Select
                                    classNamePrefix="rs"
                                    options={godowns.map((g) => ({ value: g.id, label: g.name }))}
                                    value={godowns.map((g) => ({ value: g.id, label: g.name })).find((o) => o.value === Number(data.godown_id))}
                                    onChange={(sel) => setData('godown_id', sel?.value || '')}
                                    placeholder="গুদাম নির্বাচন…"
                                    isClearable
                                />
                                {errors.godown_id && <p className="text-xs text-red-500">{errors.godown_id}</p>}
                            </div>

                            {/* ref no */}
                            <div>
                                <label className="mb-1 block font-medium">রেফারেন্স</label>
                                <input readOnly className="w-full rounded border bg-gray-50 p-2" value={data.ref_no} />
                            </div>

                            {/* dryer — header-level, not per row */}
                            <div>
                                <label className="mb-1 block font-medium">ড্রায়ার</label>
                                <Select
                                    classNamePrefix="rs"
                                    options={dryers.map((d) => ({ value: d.id, label: `${d.dryer_name} (${d.capacity ?? '—'})` }))}
                                    value={dryers
                                        .map((d) => ({ value: d.id, label: `${d.dryer_name} (${d.capacity ?? '—'}) TON` }))
                                        .find((o) => o.value === Number(data.dryer_id))}
                                    onChange={(sel) => setData('dryer_id', sel?.value || '')}
                                    placeholder="ড্রায়ার নির্বাচন…"
                                    isClearable
                                    isDisabled={!data.godown_id}
                                />
                                {errors.dryer_id && <p className="text-xs text-red-500">{errors.dryer_id}</p>}
                            </div>
                        </div>

                        {/* Consumed */}
                        <h2 className="mt-6 mb-2 text-lg font-semibold">Consumed</h2>
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-1">{data.owner === 'company' ? 'Item / Lot' : 'Item'}</th>
                                    {data.owner === 'company' && <th className="border p-1">Lot</th>}
                                    <th className="border p-1">Qty</th>
                                    <th className="border p-1">Unit</th>
                                    <th className="w-6 border p-1">✕</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.consumed.map((row, idx) => (
                                    <tr key={idx}>
                                        {data.owner === 'party' ? (
                                            <td className="border p-1">
                                                <Select
                                                    classNamePrefix="rs"
                                                    placeholder="Item"
                                                    options={consumedOpts}
                                                    value={consumedOpts.find((o) => o.value === String(row.party_item_id))}
                                                    onChange={(sel) =>
                                                        setData(
                                                            'consumed',
                                                            data.consumed.map((r, i) => (i === idx ? { ...r, party_item_id: sel?.value || '' } : r)),
                                                        )
                                                    }
                                                />
                                                {errors[`consumed.${idx}.party_item_id`] && (
                                                    <p className="text-xs text-red-500">{errors[`consumed.${idx}.party_item_id`]}</p>
                                                )}
                                            </td>
                                        ) : (
                                            <>
                                                <td className="border p-1">
                                                    <Select
                                                        classNamePrefix="rs"
                                                        placeholder="Item"
                                                        options={companyItemOpts}
                                                        value={companyItemOpts.find((o) => o.value === Number((row as any).item_id))}
                                                        onChange={(sel) =>
                                                            setData(
                                                                'consumed',
                                                                data.consumed.map((r, i) =>
                                                                    i === idx ? { ...r, item_id: sel?.value || '', lot_id: '' } : r,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border p-1">
                                                    <Select
                                                        classNamePrefix="rs"
                                                        placeholder="Lot"
                                                        options={lotOptionsForItem((row as any).item_id!)}
                                                        value={lotOptionsForItem((row as any).item_id!).find(
                                                            (o) => o.value === Number((row as any).lot_id),
                                                        )}
                                                        isDisabled={!(row as any).item_id}
                                                        onChange={(sel) =>
                                                            setData(
                                                                'consumed',
                                                                data.consumed.map((r, i) => (i === idx ? { ...r, lot_id: sel?.value || '' } : r)),
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </>
                                        )}

                                        <td className="border p-1">
                                            <input
                                                type="number"
                                                className="w-full rounded border px-1 text-right"
                                                value={row.qty}
                                                onChange={(e) =>
                                                    setData(
                                                        'consumed',
                                                        data.consumed.map((r, i) => (i === idx ? { ...r, qty: e.target.value } : r)),
                                                    )
                                                }
                                            />
                                        </td>

                                        <td className="border p-1">
                                            <select
                                                className="w-full rounded border"
                                                value={row.unit_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'consumed',
                                                        data.consumed.map((r, i) => (i === idx ? { ...r, unit_name: e.target.value } : r)),
                                                    )
                                                }
                                            >
                                                <option value=""></option>
                                                {units.map((u) => (
                                                    <option key={u.id} value={u.name}>
                                                        {u.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="border text-center">
                                            <button type="button" onClick={() => removeLine('consumed', idx)} className="font-bold text-red-600">
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={() => addLine('consumed')} className="mt-1 text-sm text-blue-600">
                            + line
                        </button>

                        {/* Generated (unchanged for now) */}
                        {/* ... your existing Generated table ... */}

                        {/* remarks + footer buttons */}
                        <div>
                            <label className="mt-6 block font-medium">মন্তব্য</label>
                            <textarea
                                className="w-full rounded border p-2"
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                {data.dryer_id &&
                                    (() => {
                                        const d = dryers.find((x) => x.id === Number(data.dryer_id));
                                        return d ? <span>Capacity: {d.capacity}</span> : null;
                                    })()}
                            </div>

                            <div className="space-x-2">
                                {!running_job_id ? (
                                    <button
                                        type="button"
                                        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                                        disabled={processing || !data.dryer_id || !data.godown_id || data.consumed.length === 0}
                                        onClick={() => post(route('crushing.jobs.start'), { preserveScroll: true })}
                                    >
                                        Start
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="rounded bg-orange-600 px-4 py-2 text-white disabled:opacity-50"
                                        disabled={processing}
                                        onClick={() => post(route('crushing.jobs.stop', running_job_id), { preserveScroll: true })}
                                    >
                                        Stop
                                    </button>
                                )}

                                <button className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50" disabled={processing}>
                                    {processing ? 'সেভ হচ্ছে…' : 'রূপান্তর সেভ করুন'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
