/*  resources/js/pages/crushing/RentVoucherCreate.tsx  */
import InputCalendar from '@/components/Btn&Link/InputCalendar';
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
    rate: string;
    amount: number;
}

/* ---------- helper for summary rows ---------- */
const SummaryRow = ({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) => (
    <div className="flex justify-between text-sm">
        <span className={bold ? 'font-semibold' : ''}>{label}</span>
        <span className={'tabular-nums ' + (bold ? 'font-semibold' : '')}>{value.toFixed(2)}</span>
    </div>
);

const selectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: 'var(--input)',
        borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
        boxShadow: state.isFocused ? '0 0 0 2px var(--ring)' : 'none',
        color: 'var(--foreground)',
        minHeight: '2.5rem',
        borderRadius: 'var(--radius-md)',
    }),
    singleValue: (base: any) => ({ ...base, color: 'var(--foreground)' }),
    input: (base: any) => ({ ...base, color: 'var(--foreground)' }),
    placeholder: (base: any) => ({ ...base, color: 'var(--muted-foreground)' }),

    menu: (base: any) => ({
        ...base,
        backgroundColor: 'var(--popover)',
        color: 'var(--popover-foreground)',
        border: '1px solid var(--border)',
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? 'var(--primary)' : state.isFocused ? 'var(--accent)' : 'transparent',
        color: state.isSelected ? 'var(--primary-foreground)' : 'var(--popover-foreground)',
    }),

    indicatorSeparator: (b: any) => ({ ...b, backgroundColor: 'var(--border)' }),
    dropdownIndicator: (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),
    clearIndicator: (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),

    // if you render into a portal (recommended to avoid overflow issues)
    menuPortal: (base: any) => ({ ...base, zIndex: 60 }), // adjust to your stack
};

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
    const billTotal = data.lines.reduce((s, l) => s + l.amount, 0);
    const received = Number(data.received_amount || 0);
    const subTotal = prevBal - billTotal;
    const newBalance = subTotal + received;

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
            <Head title="Rent Voucher" />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="mb-4">
                    <Link href={route('party-stock.rent-voucher.index')} className="text-blue-600 hover:underline">
                        ← Back to list
                    </Link>
                </div>

                <div className="bg-background rounded-lg p-6">
                    <h1 className="mb-4 text-xl font-bold">Rent Voucher</h1>

                    <form onSubmit={submit} className="space-y-6">
                        {/* header */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <InputCalendar label="Date" value={data.date} onChange={(val) => setData('date', val)} required />
                                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                                {/* {errors.date && <p className="text-xs text-red-500">{errors.date}</p>} */}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">Voucher No</label>
                                <input
                                    className="w-full rounded border p-2"
                                    value={data.vch_no}
                                    onChange={(e) => setData('vch_no', e.target.value)}
                                />
                                {errors.vch_no && <p className="text-xs text-red-500">{errors.vch_no}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">Account Ledger*</label>
                                <Select
                                    classNamePrefix="rs"
                                    options={partyOpts}
                                    value={partyOpts.find((o) => o.value === data.party_ledger_id) || null}
                                    onChange={(o) => setData('party_ledger_id', o?.value || '')}
                                    placeholder="Select Account Ledger"
                                                                         styles={selectStyles}

                                />
                                {errors.party_ledger_id && <p className="text-xs text-red-500">{errors.party_ledger_id}</p>}
                            </div>
                        </div>

                        {/* detail table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border text-sm">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="border p-2 text-left">Product Name</th>
                                        <th className="border p-2 text-right">Qty</th>
                                        <th className="border p-2">Unit</th>
                                        <th className="border p-2 text-right">Rate</th>
                                        <th className="border p-2 text-right">Amount</th>
                                        <th className="border p-2">✕</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.lines.map((l, idx) => (
                                        <tr key={idx} className="divide-x">
                                            {/* Product */}
                                            <td className="p-1">
                                                <Select
                                                    classNamePrefix="rs"
                                                    options={itemOpts}
                                                    value={itemOpts.find((o) => o.value === l.party_item_id) || null}
                                                    onChange={(o) => {
                                                        updateLine(idx, 'party_item_id', o?.value || '');
                                                        // auto-fill unit from item selection if empty
                                                        if (o?.value) {
                                                            const u = itemOpts.find((x) => x.value === o.value)?.unit_name || '';
                                                            if (!l.unit_name) updateLine(idx, 'unit_name', u);
                                                        }
                                                    }}
                                                    /** 🔧 prevent clipping inside table/overflow */
                                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                                    menuPosition="fixed"
                                                    menuPlacement="auto"
                                                    menuShouldScrollIntoView={false}
                                                    maxMenuHeight={280}
                                                    styles={selectStyles}
                                                />
                                                {errors[`lines.${idx}.party_item_id`] && (
                                                    <small className="text-red-500">{errors[`lines.${idx}.party_item_id`]}</small>
                                                )}
                                            </td>

                                            {/* Qty */}
                                            <td className="p-1">
                                                <input
                                                    type="number"
                                                    className="w-full rounded border p-1 text-right tabular-nums"
                                                    value={l.qty}
                                                    onChange={(e) => updateLine(idx, 'qty', e.target.value)}
                                                />
                                            </td>

                                            {/* Unit */}
                                            <td className="p-1">
                                                <Select
                                                    classNamePrefix="rs"
                                                    options={unitOpts}
                                                    value={unitOpts.find((o) => o.value === l.unit_name) || null}
                                                    onChange={(o) => updateLine(idx, 'unit_name', o?.value || '')}
                                                    /** 🔧 same anti-clipping treatment */
                                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                                    menuPosition="fixed"
                                                    menuPlacement="auto"
                                                    menuShouldScrollIntoView={false}
                                                    maxMenuHeight={280}
                                                    styles={selectStyles}
                                                />
                                            </td>

                                            {/* Rate */}
                                            <td className="p-1">
                                                <input
                                                    type="number"
                                                    className="w-full rounded border p-1 text-right tabular-nums"
                                                    value={l.rate}
                                                    onChange={(e) => updateLine(idx, 'rate', e.target.value)}
                                                />
                                            </td>

                                            {/* Amount */}
                                            <td className="p-1 text-right tabular-nums">{l.amount.toFixed(2)}</td>

                                            {/* Remove */}
                                            <td className="p-1 text-center">
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
                                    className="rounded bg-indigo-600 px-4 py-1 text-sm font-semibold text-white hover:bg-indigo-500"
                                    onClick={addLine}
                                >
                                    + Add line
                                </button>
                            </div>
                        </div>

                        {/* voucher summary */}
                        <div className="bg-background mt-4 rounded-xl border p-4 shadow-sm">
                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* left */}
                                <div className="space-y-2">
                                    <SummaryRow label="Previous Balance" value={prevBal} />
                                    <SummaryRow label="Bill Amount" value={billTotal} />
                                    <hr />
                                    <SummaryRow label="Sub-total" value={subTotal} bold />
                                </div>

                                {/* right */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <Select
                                                classNamePrefix="rs"
                                                options={modeOpts}
                                                placeholder="Received Mode*"
                                                value={modeOpts.find((o) => o.value === data.received_mode_id) || null}
                                                onChange={(o) => setData('received_mode_id', o?.value || '')}
                                                                                     styles={selectStyles}

                                            />
                                        </div>
                                        <input
                                            type="number"
                                            className="w-40 rounded border p-2 text-right tabular-nums"
                                            value={data.received_amount}
                                            onChange={(e) => setData('received_amount', e.target.value)}
                                        />
                                    </div>
                                    {errors.received_mode_id && <p className="text-xs text-red-500">{errors.received_mode_id}</p>}
                                    <SummaryRow label="New Balance" value={newBalance} bold />
                                </div>
                            </div>
                        </div>

                        {/* remarks */}
                        <div>
                            <label className="mb-1 block font-medium">Remarks</label>
                            <textarea
                                className="w-full rounded border p-2"
                                rows={3}
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                            />
                        </div>

                        {/* footer actions */}
                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving…' : 'Save Voucher'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
