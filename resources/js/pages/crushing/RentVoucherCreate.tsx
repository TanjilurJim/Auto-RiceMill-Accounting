/*  resources/js/pages/crushing/RentVoucherCreate.tsx  */
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';
import Select from 'react-select';
import { route } from 'ziggy-js';
/* ---------- types ---------- */
interface Party {
    id: number;
    account_ledger_name: string;
}
interface Item {
    id: number;
    item_name: string;
    unit_name: string;
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
    units: { id: number; name: string }[];
}

interface Line {
    party_item_id: string;
    qty: string;
    unit_name: string;
    // unit: string;
    rate: string;
    amount: number;
}

/* ---------- helper for summary rows ---------- */
const SummaryRow = ({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) => (
    <div className="flex justify-between">
        <span className={bold ? 'font-semibold' : ''}>{label}</span>
        <span className={bold ? 'font-semibold' : ''}>{value.toFixed(2)}</span>
    </div>
);

export default function RentVoucherCreate({ today, generated_vch_no, parties, items, modes, units }: Props) {
    /* ---------- form ---------- */
    const { data, setData, post, processing, errors } = useForm<{
        date: string;
        vch_no: string;
        party_ledger_id: string;
        lines: Line[];
        received_mode_id: string;
        received_amount: string;
        remarks: string;
    }>({
        date: today,
        vch_no: generated_vch_no,
        party_ledger_id: '',
        lines: [{ party_item_id: '', qty: '', unit_name: '', rate: '', amount: 0 }],
        received_mode_id: '',
        received_amount: '',
        remarks: '',
    });

    const unitOpts = units.map((u) => ({ value: u.name, label: u.name }));

    /* ---------- previous balance fetch ---------- */
    const [prevBal, setPrevBal] = React.useState<number>(0);

    React.useEffect(() => {
        if (!data.party_ledger_id) {
            setPrevBal(0);
            return;
        }

        axios
            .get(route('account-ledgers.balance', data.party_ledger_id))
            .then((res) => {
                let bal = Number(res.data.closing_balance ?? 0);
                // if (res.data.debit_credit === 'credit') bal = -bal; // sign flip on credit
                setPrevBal(bal);
            })
            .catch(() => setPrevBal(0));
    }, [data.party_ledger_id]);

    /* ---------- line helpers ---------- */
    const recalcAmounts = (lines: Line[]) => lines.map((l) => ({ ...l, amount: (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) }));

    const updateLine = (idx: number, field: keyof Line, value: any) => {
        const upd = data.lines.map((l, i) => (i === idx ? { ...l, [field]: value } : l));
        setData('lines', recalcAmounts(upd));
    };

    const addLine = () => setData('lines', [...data.lines, { party_item_id: '', qty: '', unit_name: '', rate: '', amount: 0 }]);
    const removeLine = (idx: number) => {
        if (data.lines.length === 1) return;
        setData(
            'lines',
            data.lines.filter((_, i) => i !== idx),
        );
    };

    /* ---------- computed totals ---------- */
    const billTotal = data.lines.reduce((s, l) => s + l.amount, 0); // today’s invoice
    const received = Number(data.received_amount || 0); // cash today

    const subTotal = prevBal - billTotal; // balance *before* today’s payment
    const newBalance = subTotal + received; // balance *after* payment

    /* ---------- dropdown options ---------- */
    const partyOpts = parties.map((p) => ({ value: String(p.id), label: p.account_ledger_name }));
    const itemOpts = items.map((i) => ({ value: String(i.id), label: i.item_name, unit_name: i.unit_name }));
    const modeOpts = modes.map((m) => ({
        value: String(m.id),
        label: m.mode_name + (m.phone_number ? ` (${m.phone_number})` : ''),
    }));

    /* ---------- submit ---------- */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.rent-voucher.store'));
    };

    /* ---------- JSX ---------- */
    return (
        <AppLayout>
            <Head title="Rent Voucher Create" />

            <form onSubmit={submit} className="mx-auto max-w-6xl space-y-6 p-6">
                <div className="rounded-t bg-purple-600 px-4 py-2 text-white">
                    <h1 className="text-lg font-semibold">Rent Voucher Create</h1>
                </div>

                {/* header */}
                <div className="grid gap-4 md:grid-cols-3">
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
                    <div>
                        <label className="font-medium">Vch No</label>
                        <input className="w-full rounded border p-2" value={data.vch_no} onChange={(e) => setData('vch_no', e.target.value)} />
                        {errors.vch_no && <p className="text-sm text-red-500">{errors.vch_no}</p>}
                    </div>
                    <div>
                        <label className="font-medium">Account Ledger*</label>
                        <Select
                            options={partyOpts}
                            classNamePrefix="rs"
                            value={partyOpts.find((o) => o.value === data.party_ledger_id) || null}
                            onChange={(o) => setData('party_ledger_id', o?.value || '')}
                            placeholder="Select Account Ledger"
                        />
                        {errors.party_ledger_id && <p className="text-sm text-red-500">{errors.party_ledger_id}</p>}
                    </div>
                </div>

                {/* quick-entry strip */}
                {/*  */}

                {/* detail table */}
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Qty</th>
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
                                        onChange={(o) => {
                                            updateLine(idx, 'party_item_id', o?.value || '');
                                        }}
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
                                    <Select
                                        options={unitOpts}
                                        classNamePrefix="rs"
                                        value={unitOpts.find((o) => o.value === l.unit_name) || null}
                                        onChange={(o) => updateLine(idx, 'unit_name', o?.value || '')}
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
                                    <button type="button" className="font-bold text-red-600" onClick={() => removeLine(idx)}>
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-2">
                    <button
                        type="button"
                        className="rounded bg-purple-600 px-4 py-1 text-sm font-semibold text-white hover:bg-purple-700"
                        onClick={addLine}
                    >
                        + New Product
                    </button>
                </div>

                {/* voucher summary */}
                <div className="rounded border bg-gray-50 p-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* left */}
                        <div className="space-y-2">
                            <SummaryRow label="Previous Balance" value={prevBal} />
                            <SummaryRow label="Bill Amount" value={billTotal} />
                            <hr />
                            <SummaryRow label="Sub-total" value={subTotal} bold />
                        </div>

                        {/* right */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Select
                                    options={modeOpts}
                                    classNamePrefix="rs"
                                    className="mr-2 flex-1"
                                    placeholder="Received Mode*"
                                    value={modeOpts.find((o) => o.value === data.received_mode_id) || null}
                                    onChange={(o) => setData('received_mode_id', o?.value || '')}
                                />
                                <input
                                    type="number"
                                    className="w-32 border p-1 text-right"
                                    value={data.received_amount}
                                    onChange={(e) => setData('received_amount', e.target.value)}
                                />
                            </div>
                            {errors.received_mode_id && <p className="mt-1 text-sm text-red-500">{errors.received_mode_id}</p>}
                            <SummaryRow label="New Balance" value={newBalance} bold />
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
