import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import Select from 'react-select';

interface Party {
    id: number;
    account_ledger_name: string;
}
interface Item {
    id: number;
    item_name: string;
}
interface ReceivedMode {
    id: number;
    mode_name: string;
    phone_number: string | null;
}
interface Props {
    today: string;
    generated_vch_no: string;
    parties: Party[];
    items: Item[];
    modes: ReceivedMode[];
}

interface Line {
    party_item_id: string;
    qty: string;
    unit: string;
    rate: string;
    amount: number;
}

export default function RentVoucherCreate({ today, generated_vch_no, parties, items, modes }: Props) {
    /* ---------- form state ---------- */
    const { data, setData, post, processing, errors } = useForm<{
        date: string;
        vch_no: string;
        party_ledger_id: string;
        lines: Line[];
        received_mode: string;
        received_amount: string;
        remarks: string;
    }>({
        date: today,
        vch_no: generated_vch_no,
        party_ledger_id: '',
        lines: [{ party_item_id: '', qty: '', unit: '', rate: '', amount: 0 }],
        received_mode_id: '',
        received_amount: '',
        remarks: '',
    });

    /* ---------- helpers ---------- */
    const addLine = () => setData('lines', [...data.lines, { party_item_id: '', qty: '', mon: '', rate: '', amount: 0 }]);
    const removeLine = (idx: number) => {
        if (data.lines.length === 1) return;
        setData(
            'lines',
            data.lines.filter((_, i) => i !== idx),
        );
    };

    const updateLine = (idx: number, field: keyof Line, value: any) => {
        const updated = data.lines.map((l, i) => (i === idx ? { ...l, [field]: value } : l));
        setData('lines', recalcAmounts(updated));
    };

    /* recalc each line's amount */
    const recalcAmounts = (lines: Line[]) => lines.map((l) => ({ ...l, amount: (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) }));

    const grandTotal = data.lines.reduce((s, l) => s + l.amount, 0);
    const prevBal = 0; // ↙ pull actual balance here if needed
    const balance = prevBal + grandTotal - (parseFloat(data.received_amount) || 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.rent-voucher.store'));
    };

    /* ---------- dropdown options ---------- */
    const partyOpts = parties.map((p) => ({ value: String(p.id), label: p.account_ledger_name }));
    const itemOpts = items.map((i) => ({ value: String(i.id), label: i.item_name }));

    const modeOpts = modes.map((m) => ({
        value: String(m.id),
        label: m.mode_name + (m.phone_number ? ` (${m.phone_number})` : ''),
    }));

    /* ---------- JSX ---------- */
    return (
        <AppLayout>
            <Head title="Rent Voucher Create" />

            <form onSubmit={submit} className="mx-auto max-w-6xl space-y-6 p-6">
                <div className="rounded-t bg-purple-600 px-4 py-2 text-white">
                    <h1 className="text-lg font-semibold">Rent Voucher Create</h1>
                </div>

                {/* header grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* date */}
                    <div>
                        <label className="font-medium">Date*</label>
                        <input
                            type="date"
                            className="w-full rounded border p-2"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                        />
                        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                    </div>
                    {/* vch no */}
                    <div>
                        <label className="font-medium">Vch No</label>
                        <input className="w-full rounded border p-2" value={data.vch_no} onChange={(e) => setData('vch_no', e.target.value)} />
                        {errors.vch_no && <p className="text-sm text-red-500">{errors.vch_no}</p>}
                    </div>
                    {/* party */}
                    <div>
                        <label className="font-medium">Account Ledger*</label>
                        <Select
                            options={partyOpts}
                            classNamePrefix="rs"
                            value={partyOpts.find((o) => o.value === data.party_ledger_id) || null}
                            onChange={(opt) => setData('party_ledger_id', opt?.value || '')}
                            placeholder="Select Account Ledger"
                        />
                        {errors.party_ledger_id && <p className="text-sm text-red-500">{errors.party_ledger_id}</p>}
                    </div>
                </div>

                {/* line entry strip */}
                <div className="grid gap-2 rounded border bg-gray-50 p-3 md:grid-cols-5">
                    <Select
                        options={itemOpts}
                        classNamePrefix="rs"
                        placeholder="Select a Product"
                        onChange={(opt) => updateLine(0, 'party_item_id', opt?.value || '')}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        className="rounded border p-2"
                        onChange={(e) => updateLine(0, 'qty', e.target.value)}
                    />
                    <input type="number" placeholder="Unit" className="rounded border p-2" onChange={(e) => updateLine(0, 'unit', e.target.value)} />
                    <input type="number" placeholder="Rate" className="rounded border p-2" onChange={(e) => updateLine(0, 'rate', e.target.value)} />
                    <button type="button" onClick={addLine} className="rounded bg-purple-600 px-4 text-white">
                        Add
                    </button>
                </div>

                {/* lines table */}
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Unit</th>
                            <th className="border p-2">Rate</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">✕</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lines.map((l, idx) => (
                            <tr key={idx} className="divide-x">
                                <td className="p-1">
                                    <Select
                                        options={itemOpts}
                                        classNamePrefix="rs"
                                        value={itemOpts.find((o) => o.value === l.party_item_id) || null}
                                        onChange={(opt) => updateLine(idx, 'party_item_id', opt?.value || '')}
                                    />
                                    {errors[`lines.${idx}.party_item_id`] && (
                                        <small className="text-red-500">{errors[`lines.${idx}.party_item_id`]}</small>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="w-full border p-1"
                                        value={l.qty}
                                        onChange={(e) => updateLine(idx, 'qty', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="w-full border p-1"
                                        value={l.unit}
                                        onChange={(e) => updateLine(idx, 'unit', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="w-full border p-1"
                                        value={l.rate}
                                        onChange={(e) => updateLine(idx, 'rate', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 text-right">{l.amount.toFixed(2)}</td>
                                <td className="text-center">
                                    <button type="button" onClick={() => removeLine(idx)} className="font-bold text-red-600">
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* totals & payment */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Total*</span>
                            <input readOnly className="w-40 border bg-gray-50 px-2 py-1 text-right" value={grandTotal.toFixed(2)} />
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Previous Balance</span>
                            <input readOnly className="w-40 border bg-gray-50 px-2 py-1 text-right" value={prevBal.toFixed(2)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Select
                                options={modeOpts}
                                classNamePrefix="rs"
                                placeholder="Select Received Mode*"
                                value={modeOpts.find((o) => o.value === data.received_mode_id) || null}
                                onChange={(opt) => setData('received_mode_id', opt?.value || '')}
                            />
                            <input
                                type="number"
                                className="w-40 border px-2 py-1 text-right"
                                value={data.received_amount}
                                onChange={(e) => setData('received_amount', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Balance*</span>
                            <input readOnly className="w-40 border bg-gray-50 px-2 py-1 text-right" value={balance.toFixed(2)} />
                        </div>
                    </div>
                </div>

                {/* remarks */}
                <div>
                    <label className="font-medium">Remarks</label>
                    <textarea
                        className="w-full rounded border p-2"
                        rows={3}
                        value={data.remarks}
                        onChange={(e) => setData('remarks', e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                    {processing ? 'Saving…' : 'Save Voucher'}
                </button>
            </form>
        </AppLayout>
    );
}
