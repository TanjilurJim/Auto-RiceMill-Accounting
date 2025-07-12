/*  resources/js/pages/crushing/ConvertForm.tsx  */
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

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
 interface Stock {
     [partyId: string]: {
         [godownId: string]: {
             godown_name: string;
             items: {
                 party_item_id: number;
                 item_name:    string;
                 qty:          number;
                 unit_name:    string;
             }[];
         };
     };
 }

interface ConsumedRow {
    party_item_id: string; // existing item
    qty: string;
    unit_name: string;
}
interface GeneratedRow {
    item_name: string; // new OR existing
    qty: string;
    unit_name: string;
}

interface Props {
    parties: Party[];
    godowns: Godown[];
    units: Unit[];
    today: string;
    generated_ref_no: string;
    available_stock: Stock; // same shape you used for Withdraw
}

export default function ConvertForm({ parties, godowns, units, today, generated_ref_no, available_stock }: Props) {
    /* ----------------  inertia form  ---------------- */
    /* ---------- type definitions ---------- */
    interface FormState {
        date: string;
        ref_no: string;
        party_ledger_id: string | number;
        godown_id: string | number;
        consumed: ConsumedRow[];
        generated: GeneratedRow[];
        remarks: string;
    }

    const { data, setData, post, processing, errors, reset } = useForm<FormState>({
        date: today,
        ref_no: generated_ref_no,
        party_ledger_id: '',
        godown_id: '',
        consumed: [{ party_item_id: '', qty: '', unit_name: '' }], // ✅ no cast needed
        generated: [{ item_name: '', qty: '', unit_name: '' }],
        remarks: '',
    });

    /* ----------  helpers for dynamic rows  ---------- */
    const addLine = (sec: 'consumed' | 'generated') =>
        setData(sec, [...data[sec], { party_item_id: '', item_name: '', qty: '', unit_name: '' } as any]);

    const removeLine = (sec: 'consumed' | 'generated', idx: number) =>
        setData(
            sec,
            data[sec].filter((_: any, i) => i !== idx),
        );

    /* ----------  party-item dropdown ---------------- */
    /* helper returns [] until party selected */
    const partyItemOptions = (partyId: string | number) => {
     const pId = String(partyId || '');
     const gId = String(data.godown_id || '');

     if (!pId || !gId) return [];                       // guard clauses
     if (!available_stock[pId] || !available_stock[pId][gId]) return [];

    

     const { items } = available_stock[pId][gId];   

        return items.map((itm: any) => ({
            value: String(itm.party_item_id ?? itm.item_id), // always string
            label: `${itm.item_name}  (in stock: ${itm.qty} ${itm.unit_name})`,
        }));
    };

    const consumedOpts = partyItemOptions(data.party_ledger_id);

    /* ----------  submit ----------------------------- */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.transfer.store'), {
            onSuccess: () => reset(),
        });
    };

    /* ----------  layout ----------------------------- */
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

                    {/* ─── Header fields ─────────────────────────── */}
                    <form onSubmit={submit} className="space-y-6">
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
                            {/* party */}
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
                        </div>

                        {/* ─── Consumed Section ──────────────────────── */}
                        <h2 className="mt-6 mb-2 text-lg font-semibold">Consumed </h2>
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-1">Item</th>
                                    <th className="border p-1">Qty</th>
                                    <th className="border p-1">Unit</th>
                                    <th className="w-6 border p-1">✕</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.consumed.map((row, idx) => (
                                    <tr key={idx}>
                                        {/* item dropdown – only after party chosen */}
                                        <td className="border p-1">
                                            <Select
                                                classNamePrefix="rs"
                                                placeholder="Item"
                                                options={consumedOpts}
                                                value={consumedOpts.find(o => o.value === String(row.party_item_id))}
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
                                        {/* qty */}
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
                                        {/* unit */}
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
                                        {/* delete */}
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

                        {/* ─── Generated Section ─────────────────────── */}
                        <h2 className="mt-6 mb-2 text-lg font-semibold">Generated </h2>
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-1">Item</th>
                                    <th className="border p-1">Qty</th>
                                    <th className="border p-1">Unit</th>
                                    <th className="w-6 border p-1">✕</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.generated.map((row, idx) => (
                                    <tr key={idx}>
                                        {/* creatable item */}
                                        <td className="border p-1">
                                            <CreatableSelect
                                                classNamePrefix="rs"
                                                placeholder="Item / type to add"
                                                onChange={(sel) =>
                                                    setData(
                                                        'generated',
                                                        data.generated.map((r, i) => (i === idx ? { ...r, item_name: sel?.value || '' } : r)),
                                                    )
                                                }
                                                value={row.item_name ? { label: row.item_name, value: row.item_name } : null}
                                            />
                                            {errors[`generated.${idx}.item_name`] && (
                                                <p className="text-xs text-red-500">{errors[`generated.${idx}.item_name`]}</p>
                                            )}
                                        </td>
                                        {/* qty */}
                                        <td className="border p-1">
                                            <input
                                                type="number"
                                                className="w-full rounded border px-1 text-right"
                                                value={row.qty}
                                                onChange={(e) =>
                                                    setData(
                                                        'generated',
                                                        data.generated.map((r, i) => (i === idx ? { ...r, qty: e.target.value } : r)),
                                                    )
                                                }
                                            />
                                        </td>
                                        {/* unit */}
                                        <td className="border p-1">
                                            <select
                                                className="w-full rounded border"
                                                value={row.unit_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'generated',
                                                        data.generated.map((r, i) => (i === idx ? { ...r, unit_name: e.target.value } : r)),
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
                                        {/* delete */}
                                        <td className="border text-center">
                                            <button type="button" onClick={() => removeLine('generated', idx)} className="font-bold text-red-600">
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={() => addLine('generated')} className="mt-1 text-sm text-blue-600">
                            + line
                        </button>

                        {/* remarks + submit */}
                        <div>
                            <label className="mt-6 block font-medium">মন্তব্য</label>
                            <textarea
                                className="w-full rounded border p-2"
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                            />
                        </div>

                        <div className="mt-4 text-right">
                            <button className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50" disabled={processing}>
                                {processing ? 'সেভ হচ্ছে…' : 'রূপান্তর সেভ করুন'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
