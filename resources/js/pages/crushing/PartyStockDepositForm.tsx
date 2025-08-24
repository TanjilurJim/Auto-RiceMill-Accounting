import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';
import Select from 'react-select';
import InputCalendar from '@/components/Btn&Link/InputCalendar';

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
    item_name: string; // 🔄
    unit_name: string; // 🔄
    qty: string;
    rate: string;
    total: number;
}

export default function PartyStockDepositForm({ parties, godowns, units, today, generated_ref_no }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: today,
        party_ledger_id: '',
        godown_id_to: '',
        ref_no: generated_ref_no,
        remarks: '',
        deposits: [{ item_name: '', unit_name: '', qty: '', rate: '', total: 0 }],
    });

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
        updated[index].total = qty * rate;

        setData('deposits', updated);
    };

    const addRow = () => {
        setData('deposits', [...data.deposits, { item_name: '', unit_name: '', qty: '', rate: '', total: 0 }]);
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

    return (
        <AppLayout>
            <Head title="পার্টি মাল জমা ফর্ম" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <h1 className="mb-4 text-xl font-bold">পার্টির পণ্য জমা ফর্ম</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div>
                                <InputCalendar
                                label ='তারিখ'
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full rounded border p-2"/>
                                {errors.date && <p className="text-sm text-red-500 ">{errors.date}</p>}
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
                            <table className="w-full table-auto border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">পণ্য</th>
                                        <th className="border p-2">একক</th>
                                        <th className="border p-2">পরিমাণ</th>
                                        <th className="border p-2">রেট</th>
                                        <th className="border p-2">মোট</th>
                                        <th className="border p-2">✕</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.deposits.map((row, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">
                                                <CreatableSelect
                                                    isDisabled={!data.party_ledger_id} // block until party chosen
                                                    options={itemOptions}
                                                    value={row.item_name ? { value: row.item_name, label: row.item_name } : null}
                                                    onChange={(sel) => handleFieldChange(index, 'item_name', sel?.value ?? '')}
                                                    placeholder="পণ্য"
                                                    isClearable
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <select
                                                    className="w-full rounded border p-1"
                                                    value={row.unit_name}
                                                    onChange={(e) => handleFieldChange(index, 'unit_name', e.target.value)}
                                                >
                                                    <option value="">-- একক নির্বাচন করুন --</option>
                                                    {units.map((u) => (
                                                        <option key={u.id} value={u.name}>
                                                            {u.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    type="number"
                                                    value={row.qty}
                                                    onChange={(e) => handleFieldChange(index, 'qty', e.target.value)}
                                                    className="w-full rounded border p-1"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    type="number"
                                                    value={row.rate}
                                                    onChange={(e) => handleFieldChange(index, 'rate', e.target.value)}
                                                    className="w-full rounded border p-1"
                                                />
                                            </td>
                                            <td className="border p-2">{row.total.toFixed(2)}</td>
                                            <td className="border p-2 text-center">
                                                <button type="button" onClick={() => removeRow(index)} className="font-bold text-red-600">
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
