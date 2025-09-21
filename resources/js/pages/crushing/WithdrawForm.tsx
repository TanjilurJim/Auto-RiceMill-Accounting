import InputCalendar from '@/components/Btn&Link/InputCalendar';
import TableComponent from '@/components/TableComponent';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';
import Select from 'react-select';

interface Props {
    parties: { id: number; account_ledger_name: string }[];
    items: { id: number; item_name: string; party_ledger_id?: number }[]; // not used directly for unit
    godowns: { id: number; name: string }[];
    units: { id: number; name: string }[];
    today: string;
    generated_ref_no: string;
    /**
     * available_stock shape (from your controller):
     * {
     *   [partyId: string]: {
     *     [godownId: string]: {
     *       godown_id: number;
     *       godown_name: string;
     *       items: Array<{ party_item_id:number; item_name:string; qty:number; unit_name:string }>
     *     }
     *   }
     * }
     */
    available_stock: any;
}

type WithdrawRow = {
    party_item_id: string;
    unit_name: string;
    qty: string;
    rate: string;
    total: number;
    bosta_weight?: string; // per-bosta kg (string for Select compatibility)
    weight?: number | null; // computed total kg (negative will be saved server-side)
};

export default function WithdrawForm({ parties, godowns, units, today, generated_ref_no, available_stock }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        date: string;
        party_ledger_id: string;
        godown_id_from: string;
        ref_no: string;
        remarks: string;
        withdraws: WithdrawRow[];
    }>({
        date: today,
        party_ledger_id: '',
        godown_id_from: '',
        ref_no: generated_ref_no,
        remarks: '',
        withdraws: [{ party_item_id: '', unit_name: '', qty: '', rate: '', total: 0, bosta_weight: '', weight: 0 }],
    });

    const isBosta = (u?: string) => (u || '').trim().toLowerCase() === 'bosta';
    const isKg = (u?: string) => (u || '').trim().toLowerCase() === 'kg';
    const bostaKgOptions = [10, 20, 25, 30, 50, 75].map((n) => ({ value: String(n), label: String(n) }));

    // Godowns for selected party (from available_stock)
    const partyGodowns = useMemo(() => {
        const pid = data.party_ledger_id;
        if (!pid || !available_stock[pid]) return [];
        return Object.entries(available_stock[pid]).map(([gid, g]: any) => ({
            value: Number(gid),
            label: g.godown_name,
        }));
    }, [data.party_ledger_id, available_stock]);
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

    // Items available for the selected party+godown (so we can auto-fill unit_name properly)
    const itemOptions = useMemo(() => {
        const pid = data.party_ledger_id;
        const gid = data.godown_id_from;
        if (!pid || !gid || !available_stock[pid] || !available_stock[pid][gid]) return [];
        return available_stock[pid][gid].items.map((itm: any) => ({
            value: String(itm.party_item_id),
            label: itm.item_name,
            unit_name: itm.unit_name as string,
            last_rate: itm.last_rate as number | null, // 👈 include last_rate
        }));
    }, [data.party_ledger_id, data.godown_id_from, available_stock]);

    // Recompute amount & weight for one row and update state
    const recalcRow = (rows: WithdrawRow[], idx: number) => {
        const r = rows[idx];
        const qty = parseFloat(r.qty) || 0;
        const rate = parseFloat(r.rate) || 0;
        r.total = qty * rate;

        // compute weight (positive here; backend will save negative for out)
        const per = parseFloat(r.bosta_weight || '') || 0;
        let w: number | null = null;
        if (isKg(r.unit_name)) w = qty;
        else if (isBosta(r.unit_name) && per > 0) w = qty * per;

        r.weight = w;
    };

    // Update a single field, then recalc line
    const updateLine = (idx: number, field: keyof WithdrawRow, value: any) => {
        const rows = [...data.withdraws];
        rows[idx] = { ...rows[idx], [field]: value };

        if (field === 'party_item_id') {
            const found = itemOptions.find((o: any) => o.value === value);
            if (found?.unit_name) {
                rows[idx].unit_name = found.unit_name;
                if (found.unit_name.toLowerCase() !== 'bosta') rows[idx].bosta_weight = '';
            }
            // 👇 Prefill rate if user hasn't typed one yet
            if ((rows[idx].rate ?? '') === '' && found?.last_rate != null) {
                rows[idx].rate = String(found.last_rate);
            }
        }

        recalcRow(rows, idx);
        setData('withdraws', rows);
    };

    const onUnitChange = (idx: number, unitName: string) => {
        const rows = [...data.withdraws];
        rows[idx].unit_name = unitName;
        if (!isBosta(unitName)) rows[idx].bosta_weight = '';
        recalcRow(rows, idx);
        setData('withdraws', rows);
    };

    const addRow = () =>
        setData('withdraws', [...data.withdraws, { party_item_id: '', unit_name: '', qty: '', rate: '', total: 0, bosta_weight: '', weight: 0 }]);

    const removeRow = (index: number) => {
        if (data.withdraws.length === 1) return;
        const updated = data.withdraws.filter((_, i) => i !== index);
        setData('withdraws', updated);
    };

    const grandTotal = data.withdraws.reduce((s, r) => s + r.total, 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.withdraw.store'), {
            preserveScroll: true,
            onSuccess: () => reset('party_ledger_id', 'godown_id_from', 'ref_no', 'remarks', 'withdraws'),
        });
    };

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: 'পণ্য',
            accessor: (row: WithdrawRow, idx: number) => {
                const itemDisabled = !data.party_ledger_id || !data.godown_id_from || itemOptions.length === 0;
                return (
                    <Select
                        classNamePrefix="rs"
                        placeholder="পণ্য"
                        options={itemOptions}
                        value={itemOptions.find((o: any) => o.value === row.party_item_id) || null}
                        onChange={(o: any) => updateLine(idx, 'party_item_id', o?.value || '')}
                        isDisabled={itemDisabled}
                        isClearable
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    />
                );
            },
        },
        {
            header: 'একক',
            accessor: (row: WithdrawRow, idx: number) => (
                <>
                    <select className="w-full rounded border p-1" value={row.unit_name} onChange={(e) => onUnitChange(idx, e.target.value)}>
                        <option value="">-- একক নির্বাচন করুন --</option>
                        {units.map((u) => (
                            <option key={u.id} value={u.name}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {isBosta(row.unit_name) && (
                        <div className="mt-1">
                            <Select
                                classNamePrefix="rs"
                                placeholder="বস্তা প্রতি (কেজি)"
                                options={bostaKgOptions}
                                value={bostaKgOptions.find((o) => o.value === (row.bosta_weight || '')) || null}
                                onChange={(o) => updateLine(idx, 'bosta_weight', o?.value || '')}
                                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                menuPosition="fixed"
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                    )}
                </>
            ),
        },
        {
            header: 'পরিমাণ',
            accessor: (row: WithdrawRow, idx: number) => (
                <input
                    type="number"
                    className="w-full rounded border p-1 text-right"
                    value={row.qty}
                    onChange={(e) => updateLine(idx, 'qty', e.target.value)}
                />
            ),
        },
        {
            header: 'রেট',
            accessor: (row: WithdrawRow, idx: number) => (
                <input
                    type="number"
                    className="w-full rounded border p-1 text-right"
                    value={row.rate}
                    onChange={(e) => updateLine(idx, 'rate', e.target.value)}
                />
            ),
        },
        {
            header: 'ওজন (কেজি)',
            accessor: (row: WithdrawRow) => (row.weight != null ? Number(row.weight).toFixed(3) : '—'),
            className: 'text-right tabular-nums',
        },
        {
            header: 'মোট',
            accessor: (row: WithdrawRow) => Number(row.total || 0).toFixed(2),
            className: 'text-right tabular-nums',
        },
    ];

    return (
        <AppLayout>
            <Head title="মাল উত্তোলন ফর্ম" />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <h1 className="mb-4 text-xl font-bold">পণ্য উত্তোলন ফর্ম</h1>

                    {/* Available stock panel */}
                    <div className="bg-background mb-4 rounded-md">
                        {data.party_ledger_id && available_stock[data.party_ledger_id] ? (
                            <>
                                <h2 className="text-lg font-semibold">Selected Party Stock</h2>
                                <div className="mt-2 space-y-2">
                                    {Object.entries(available_stock[data.party_ledger_id]).map(([gid, g]: any) => (
                                        <div key={gid}>
                                            <h3 className="font-bold">{g.godown_name}</h3>
                                            <ul className="ml-4 list-disc">
                                                {g.items.map((itm: any, idx: number) => (
                                                    <li key={idx}>
                                                        {Number(itm.qty).toFixed(3)} {itm.unit_name} — {itm.item_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p>দয়া করে পার্টি সিলেক্ট করুন স্টক এর আইটেম দেখার জন্য</p>
                        )}
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Header */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <InputCalendar value={data.date} label="তারিখ" onChange={(val) => setData('date', val)} />
                                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">পার্টি</label>
                                <Select
                                    options={parties.map((p) => ({ value: String(p.id), label: p.account_ledger_name }))}
                                    value={
                                        parties
                                            .map((p) => ({ value: String(p.id), label: p.account_ledger_name }))
                                            .find((o) => o.value === data.party_ledger_id) || null
                                    }
                                    onChange={(o) => {
                                        setData('party_ledger_id', o?.value || '');
                                        // reset dependent fields
                                        setData('godown_id_from', '');
                                        setData('withdraws', [
                                            { party_item_id: '', unit_name: '', qty: '', rate: '', total: 0, bosta_weight: '', weight: 0 },
                                        ]);
                                    }}
                                    classNamePrefix="rs"
                                    placeholder="পার্টি খুঁজুন…"
                                    isClearable
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                    menuPosition="fixed"
                                    styles={selectStyles}
                                />
                                {errors.party_ledger_id && <p className="text-sm text-red-500">{errors.party_ledger_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">গুদাম</label>
                                <Select
                                    options={partyGodowns}
                                    value={partyGodowns.find((o) => String(o.value) === data.godown_id_from) || null}
                                    onChange={(o) => {
                                        setData('godown_id_from', o?.value ? String(o.value) : '');
                                        // reset items when godown changes
                                        setData('withdraws', [
                                            { party_item_id: '', unit_name: '', qty: '', rate: '', total: 0, bosta_weight: '', weight: 0 },
                                        ]);
                                    }}
                                    classNamePrefix="rs"
                                    placeholder="গুদাম খুঁজুন…"
                                    isClearable
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                                    menuPosition="fixed"
                                    styles={selectStyles}
                                />
                                {errors.godown_id_from && <p className="text-sm text-red-500">{errors.godown_id_from}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">রেফারেন্স নম্বর</label>
                                <input type="text" value={data.ref_no} readOnly className="w-full rounded border p-2" />
                            </div>
                        </div>

                        {/* Lines */}
                        <div>
                            <h2 className="mb-2 text-lg font-semibold">উত্তোলন তালিকা</h2>
                            <TableComponent
                                columns={tableColumns}
                                data={data.withdraws}
                                actions={(row, idx) => (
                                    <button type="button" className="font-bold text-red-600" onClick={() => removeRow(idx)}>
                                        ✕
                                    </button>
                                )}
                                noDataMessage="কোনো পণ্য নেই"
                            />
                            <div className="mt-2 text-right">
                                <button type="button" onClick={addRow} className="font-semibold text-blue-600">
                                    + নতুন পণ্য
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-right text-lg font-semibold">মোট: {grandTotal.toFixed(2)} টাকা</div>

                        <div>
                            <label className="mb-1 block font-medium">মন্তব্য</label>
                            <Textarea
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                                className="w-full rounded border p-2"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                                {processing ? 'সেভ হচ্ছে…' : 'উত্তোলন করুন'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
