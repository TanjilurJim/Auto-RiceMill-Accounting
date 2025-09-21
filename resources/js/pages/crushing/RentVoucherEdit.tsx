/*  resources/js/pages/crushing/RentVoucherEdit.tsx  */
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
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
interface Mode {
    id: number;
    mode_name: string;
    phone_number: string | null;
}
interface Unit {
    id: number;
    name: string;
}

interface LineSrv {
    party_item_id: number;
    qty: number;
    unit_name: string;
    rate: number;
}
interface LineUI {
    [key: string]: string | number;
    party_item_id: string;
    qty: string;
    unit_name: string;
    rate: string;
    amount: number;
}

interface Voucher {
    id: number;
    date: string;
    vch_no: string;
    party_ledger_id: number;
    received_mode_id: number;
    received_amount: number;
    remarks: string | null;
    previous_balance: number;
}

interface Props {
    voucher: Voucher;
    lines: LineSrv[];
    parties: Party[];
    items: Item[];
    modes: Mode[];
    units: Unit[];
}

/* ---------- helper for summary rows ---------- */
const SummaryRow = ({
  label,
  value,
  bold = false,
}: { label: string; value: number | string; bold?: boolean }) => {
  const n = Number(value ?? 0);
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-semibold' : ''}>{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{n.toFixed(2)}</span>
    </div>
  );
};

export default function RentVoucherEdit({ voucher, lines, parties, items, modes, units }: Props) {
    /* ---------- form ---------- */
    const { data, setData, put, processing, errors } = useForm<{
        date: string;
        vch_no: string;
        party_ledger_id: string;
        lines: LineUI[];
        received_mode_id: string;
        received_amount: string;
        remarks: string;
    }>({
        date: voucher.date,
        vch_no: voucher.vch_no,
        party_ledger_id: String(voucher.party_ledger_id),
        lines: lines.map((l) => ({
            party_item_id: String(l.party_item_id),
            qty: String(l.qty),
            unit_name: l.unit_name,
            rate: String(l.rate),
            amount: l.qty * l.rate,
        })),
        received_mode_id: String(voucher.received_mode_id),
        received_amount: String(voucher.received_amount ?? ''),
        remarks: voucher.remarks ?? '',
    });

    const unitOpts = units.map((u) => ({ value: u.name, label: u.name }));
    const partyOpts = parties.map((p) => ({ value: String(p.id), label: p.account_ledger_name }));
    const itemOpts = items.map((i) => ({ value: String(i.id), label: i.item_name, unit_name: i.unit_name }));
    const modeOpts = modes.map((m) => ({ value: String(m.id), label: m.mode_name + (m.phone_number ? ` (${m.phone_number})` : '') }));

    /* ---------- previous balance ---------- */
    const [prevBal, setPrevBal] = React.useState<number>(voucher.previous_balance ?? 0);

    React.useEffect(() => {
        if (!data.party_ledger_id) {
            setPrevBal(0);
            return;
        }

        axios
            .get(route('account-ledgers.balance', data.party_ledger_id))
            .then((res) => setPrevBal(Number(res.data.closing_balance ?? 0)))
            .catch(() => setPrevBal(0));
    }, [data.party_ledger_id]);

    /* ---------- line helpers ---------- */
    const recalc = (lns: LineUI[]) => lns.map((l) => ({ ...l, amount: (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) }));
    const update = (i: number, k: keyof LineUI, v: any) => setData('lines', recalc(data.lines.map((l, idx) => (idx === i ? { ...l, [k]: v } : l))));
    const add = () => setData('lines', [...data.lines, { party_item_id: '', qty: '', unit_name: '', rate: '', amount: 0 }]);
    const remove = (i: number) =>
        data.lines.length > 1 &&
        setData(
            'lines',
            data.lines.filter((_, idx) => idx !== i),
        );

    /* ---------- totals ---------- */
    const billTotal = data.lines.reduce((s, l) => s + l.amount, 0);
    const received = Number(data.received_amount || 0);
    const subTotal = prevBal - billTotal;
    const newBalance = subTotal + received;

    /* ---------- submit ---------- */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('party-stock.rent-voucher.update', voucher.id));
    };

    /* ---------- JSX ---------- */
    return (
        <AppLayout>
            <Head title="Rent Voucher Edit" />

            {/* back */}
            <div className="text-end">
            <Link
                href={route('party-stock.rent-voucher.index')}
                className="inline-flex items-center  rounded-lg border border-gray-300 bg-background px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-background focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none mx-auto"
            >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
            </Link>
            </div>

            {/* form */}
            <form onSubmit={submit} className="mx-auto max-w-6xl space-y-6 p-6">
                <div className="rounded-t bg-purple-600 px-4 py-2 text-white">
                    <h1 className="text-lg font-semibold">Rent Voucher Edit</h1>
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
                        <label className="font-medium">Vch&nbsp;No</label>
                        <input className="w-full rounded border p-2" value={data.vch_no} onChange={(e) => setData('vch_no', e.target.value)} />
                        {errors.vch_no && <p className="text-sm text-red-500">{errors.vch_no}</p>}
                    </div>
                    <div>
                        <label className="font-medium">Account&nbsp;Ledger*</label>
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
                                        onChange={(o) => update(idx, 'party_item_id', o?.value || '')}
                                    />
                                    {(errors as any)[`lines.${idx}.party_item_id`] && (
                                        <small className="text-red-500">{(errors as any)[`lines.${idx}.party_item_id`]}</small>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="w-full border p-1"
                                        value={l.qty}
                                        onChange={(e) => update(idx, 'qty', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Select
                                        options={unitOpts}
                                        classNamePrefix="rs"
                                        value={unitOpts.find((o) => o.value === l.unit_name) || null}
                                        onChange={(o) => update(idx, 'unit_name', o?.value || '')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="w-full border p-1"
                                        value={l.rate}
                                        onChange={(e) => update(idx, 'rate', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 text-right">{l.amount.toFixed(2)}</td>
                                <td className="text-center">
                                    <button type="button" className="font-bold text-red-600" onClick={() => remove(idx)}>
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
                        onClick={add}
                    >
                        + New Product
                    </button>
                </div>

                {/* summary */}
                <div className="rounded border bg-background p-4">
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
                    {processing ? 'Updating…' : 'Update Voucher'}
                </button>
            </form>
        </AppLayout>
    );
}
