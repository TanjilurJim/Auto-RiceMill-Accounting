import InputCalendar from '@/components/Btn&Link/InputCalendar';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';
import Select from 'react-select';

import TableComponent from '@/components/TableComponent';
import CreatableSelect from 'react-select/creatable';

interface Props {
    parties: { id: number; account_ledger_name: string }[];
    items: { id: number; item_name: string }[];
    godowns: { id: number; name: string }[];
    units: { id: number; name: string }[];
    today: string;
    generated_ref_no: string;
}

interface DepositRow {
    item_name: string;
    unit_name: string;
    qty: string;
    rate: string;
    total: number;
    bosta_weight?: string; // NEW: per-bosta kg
    weight?: number; // NEW: computed total kg (sent to backend)
}

// default state:
// Remove this stray line, as it is not valid TypeScript/JS code and is not used.

export default function PartyStockDepositForm({ parties, godowns, units, today, generated_ref_no }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: today,
        party_ledger_id: '',
        godown_id_to: '',
        ref_no: generated_ref_no,
        remarks: '',
        deposits: [{ item_name: '', unit_name: '', qty: '', rate: '', total: 0, bosta_weight: '', weight: 0 }],
    });

    // --- small helper: normalize unit ---
    const isBosta = (u?: string) => (u || '').toLowerCase().trim() === 'bosta';
    const isKg = (u?: string) => (u || '').toLowerCase().trim() === 'kg';

    // --- options for per-bosta kg ---
    const bostaKgOptions = [10, 20, 25, 30, 50, 75].map((n) => ({ value: String(n), label: String(n) }));

    const [itemOptions, setItemOptions] = React.useState<{ value: string; label: string }[]>([]);

    React.useEffect(() => {
        if (!data.party_ledger_id) {
            setItemOptions([]);
            return;
        }
        axios.get(route('party.items', { party: data.party_ledger_id })).then((res) => {
            const opts = res.data.map((x: any) => ({ value: x.item_name, label: x.item_name }));
            setItemOptions(opts);
        });
    }, [data.party_ledger_id]);

    const unitOptions = units.map((unit) => ({ value: unit.id, label: unit.name }));

    const handleFieldChange = (index: number, field: keyof DepositRow, value: any) => {
        const updated = [...data.deposits];
        updated[index][field] = value;

        const qty = parseFloat(updated[index].qty) || 0;
        const rate = parseFloat(updated[index].rate) || 0;
        const unit = updated[index].unit_name;
        const per = parseFloat(updated[index].bosta_weight || '') || 0;

        // compute total amount
        updated[index].total = qty * rate;

        // compute weight (kg)
        let w = 0;
        if (isKg(unit)) w = qty;
        else if (isBosta(unit) && per > 0) w = qty * per;
        // else leave 0 (unknown)

        updated[index].weight = w;

        setData('deposits', updated);
    };

    const addRow = () => {
        setData('deposits', [...data.deposits, { item_name: '', unit_name: '', qty: '', rate: '', total: 0, bosta_weight: '', weight: 0 }]);
    };

    const removeRow = (index: number) => {
        if (data.deposits.length === 1) return;
        const updated = [...data.deposits];
        updated.splice(index, 1);
        setData('deposits', updated);
    };

    const grandTotal = data.deposits.reduce((sum, row) => sum + (parseFloat(row.total.toString()) || 0), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.deposit.store'), {
            preserveScroll: true,
            onSuccess: () => reset('party_ledger_id', 'godown_id_to', 'ref_no', 'remarks', 'deposits'),
        });
    };

    const onUnitChange = (index: number, newUnit: string) => {
        const updated = [...data.deposits];
        updated[index].unit_name = newUnit;
        // reset bosta_weight if leaving/entering bosta
        if (!isBosta(newUnit)) updated[index].bosta_weight = '';
        handleFieldChange(index, 'unit_name', newUnit);
    };

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

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: 'পণ্য',
            accessor: (row: DepositRow, index: number) => (
                <CreatableSelect
                    isDisabled={!data.party_ledger_id}
                    options={itemOptions}
                    value={row.item_name ? { value: row.item_name, label: row.item_name } : null}
                    onChange={(sel) => handleFieldChange(index, 'item_name', sel?.value ?? '')}
                    placeholder="পণ্য"
                    isClearable
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                    styles={selectStyles}
                />
            ),
        },
        {
            header: 'একক',
            accessor: (row: DepositRow, index: number) => (
                <>
                    <select className="w-full rounded border p-1" value={row.unit_name} onChange={(e) => onUnitChange(index, e.target.value)}>
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
                                onChange={(o) => handleFieldChange(index, 'bosta_weight', o?.value || '')}
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
            accessor: (row: DepositRow, index: number) => (
                <input
                    type="number"
                    value={row.qty}
                    onChange={(e) => handleFieldChange(index, 'qty', e.target.value)}
                    className="w-full rounded border p-1 text-right"
                />
            ),
        },
        {
            header: 'রেট',
            accessor: (row: DepositRow, index: number) => (
                <input
                    type="number"
                    value={row.rate}
                    onChange={(e) => handleFieldChange(index, 'rate', e.target.value)}
                    className="w-full rounded border p-1 text-right"
                />
            ),
        },
        {
            header: 'মোট',
            accessor: (row: DepositRow) => Number(row.total || 0).toFixed(2),
            className: 'text-right',
        },
        {
            header: 'ওজন (কেজি)',
            accessor: (row: DepositRow) => (row.weight != null ? Number(row.weight).toFixed(3) : '—'),
            className: 'text-right',
        },
    ];

    return (
        <AppLayout>
            <Head title="পার্টি মাল জমা ফর্ম" />
            <div className="bg-background h-full w-screen lg:w-full">
                <div className="bg-background h-full rounded-lg p-4 md:p-12">
                    <h1 className="mb-4 text-xl font-bold">পার্টির পণ্য জমা ফর্ম</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
                            <div>
                                <InputCalendar
                                    label="তারিখ"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full rounded border p-2"
                                />
                                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">পার্টি</label>
                                <Select
                                    options={parties.map((p) => ({ value: p.id, label: p.account_ledger_name }))}
                                    value={parties
                                        .map((p) => ({ value: p.id, label: p.account_ledger_name }))
                                        .find((opt) => opt.value === Number(data.party_ledger_id))}
                                    onChange={(selected) => setData('party_ledger_id', selected?.value || '')}
                                    classNamePrefix="react-select"
                                    placeholder="পার্টি খুঁজুন..."
                                    isClearable
                                    styles={selectStyles}
                                />
                                {errors.party_ledger_id && <p className="text-sm text-red-500">{errors.party_ledger_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">গুদাম</label>
                                <Select
                                    options={godowns.map((g) => ({ value: g.id, label: g.name }))}
                                    value={godowns
                                        .map((g) => ({ value: g.id, label: g.name }))
                                        .find((opt) => opt.value === Number(data.godown_id_to))}
                                    onChange={(selected) => setData('godown_id_to', selected?.value || '')}
                                    classNamePrefix="react-select"
                                    placeholder="গুদাম খুঁজুন..."
                                    isClearable
                                    styles={selectStyles}
                                />
                                {errors.godown_id_to && <p className="text-sm text-red-500">{errors.godown_id_to}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">রেফারেন্স নম্বর</label>
                                <input
                                    type="text"
                                    value={data.ref_no}
                                    readOnly
                                    onChange={(e) => setData('ref_no', e.target.value)}
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2 text-lg font-semibold">পণ্যের জমা তালিকা</h2>
                            <TableComponent
                                columns={tableColumns}
                                data={data.deposits}
                                actions={(row, index) => (
                                    <button type="button" onClick={() => removeRow(index)} className="font-bold text-red-600">
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

                        <div className="text-right text-lg font-semibold">মোট: {grandTotal.toFixed(2)} টাকা</div>

                        <div>
                            <label className="mb-1 block font-medium">মন্তব্য</label>
                            <textarea
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                                className="w-full rounded border p-2"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                                {processing ? 'সেভ হচ্ছে...' : 'জমা দিন'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
