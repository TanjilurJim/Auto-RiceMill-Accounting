import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface Props {
    parties: { id: number; account_ledger_name: string }[];
    items: { id: number; item_name: string }[];
    godowns: { id: number; name: string }[];
    units: { id: number; name: string }[];
    today: string;
    generated_ref_no: string; // Reference number passed from backend
    available_stock: any; // Receive the available stock data
}

interface WithdrawRow {
    party_item_id: string;
    unit_name: string;
    qty: string;
    rate: string;
    total: number;
}

export default function WithdrawForm({
    parties,
    items,
    godowns,
    units,
    today,
    generated_ref_no,
    available_stock, // Receive available_stock here
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: today,
        party_ledger_id: '',
        godown_id_from: '',
        ref_no: generated_ref_no,
        remarks: '',
        withdraws: [{ party_item_id: '', unit_name: '', qty: '', rate: '', total: 0 }],
    });

    const [partyGodowns, setPartyGodowns] = useState<{ value: number; label: string }[]>([]); // Store godowns for selected party

    const itemOptions = items.map((item) => ({ value: item.id, label: item.item_name }));

    // const godownOptions = godowns.map((godown) => ({ value: godown.id, label: godown.name }));
    const unitOptions = units.map((unit) => ({ value: unit.id, label: unit.name }));

    useEffect(() => {
        if (!data.party_ledger_id || !available_stock[data.party_ledger_id]) {
            setPartyGodowns([]);
            return;
        }
        // build list from available_stock
        const list = Object.entries(available_stock[data.party_ledger_id]).map(([gid, g]: any) => ({ value: Number(gid), label: g.godown_name }));
        setPartyGodowns(list);
    }, [data.party_ledger_id, available_stock]);

    useEffect(() => {
        console.log('Available stock:', available_stock); // Log available stock passed from backend
    }, [available_stock]);

    // Fetch the godowns associated with the selected party
    const fetchPartyGodowns = async (partyId: number) => {
        // This can be removed as we are not using getAvailableStock route anymore
        try {
            const response = await axios.get(`/party-stock/party-godowns/${partyId}`);
            setPartyGodowns(response.data.godowns); // Set the godowns specific to the selected party
        } catch (error) {
            console.error('Error fetching godowns:', error);
        }
    };

    const handleFieldChange = (index: number, field: keyof WithdrawRow, value: any) => {
        const updated = [...data.withdraws];
        updated[index][field] = value;

        if (field === 'party_item_id') {
            const found = items.find((i) => i.id === Number(value));
            updated[index].unit_name = found?.unit_name || '';
        }

        const qty = parseFloat(updated[index].qty) || 0;
        const rate = parseFloat(updated[index].rate) || 0;
        updated[index].total = qty * rate;

        setData('withdraws', updated);
    };

    const addRow = () => setData('withdraws', [...data.withdraws, { party_item_id: '', unit_name: '', qty: '', rate: '', total: 0 }]);

    const removeRow = (index: number) => {
        if (data.withdraws.length === 1) return;
        const updated = [...data.withdraws];
        updated.splice(index, 1);
        setData('withdraws', updated);
    };

    const grandTotal = data.withdraws.reduce((sum, row) => sum + (parseFloat(row.total.toString()) || 0), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.withdraw.store'), {
            preserveScroll: true,
            onSuccess: () => reset('party_ledger_id', 'godown_id_from', 'ref_no', 'remarks', 'withdraws'),
        });
    };

    return (
        <AppLayout>
            <Head title="মাল উত্তোলন ফর্ম" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <h1 className="mb-4 text-xl font-bold">পণ্য উত্তোলন ফর্ম</h1>

                    {/* Party Stock Information Section */}
                    <div className="mb-4 rounded-md bg-gray-100 p-4">
                        {data.party_ledger_id && available_stock[data.party_ledger_id] ? (
                            <>
                                <h2 className="text-lg font-semibold">Available Stock for Selected Party:</h2>
                                <div className="mt-2 space-y-2">
                                    {Object.entries(available_stock[data.party_ledger_id]).map(([godownId, g]) => (
                                        <div key={godownId}>
                                            <h3 className="font-bold">{g.godown_name}</h3>
                                            <ul className="ml-4 list-disc">
                                                {g.items.map((itm, idx) => (
                                                    <li key={idx}>
                                                        {Number(itm.qty).toFixed(3)} {itm.unit_name} of {itm.item_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p>Please select a party ledger to see available stock.</p>
                        )}
                    </div>

                    {/* Withdraw Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block font-medium">তারিখ</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full rounded border p-2"
                                />
                                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">পার্টি</label>
                                <Select
                                    options={parties.map((p) => ({
                                        value: p.id,
                                        label: p.account_ledger_name,
                                    }))}
                                    value={parties
                                        .map((p) => ({
                                            value: p.id,
                                            label: p.account_ledger_name,
                                        }))
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
                                {partyGodowns.length > 0 && (
                                    <Select
                                        options={partyGodowns}
                                        value={partyGodowns.find((o) => o.value === Number(data.godown_id_from))}
                                        onChange={(selected) => setData('godown_id_from', selected?.value || '')}
                                        classNamePrefix="react-select"
                                        placeholder="গুদাম খুঁজুন..."
                                        isClearable
                                    />
                                )}
                                {errors.godown_id_from && <p className="text-sm text-red-500">{errors.godown_id_from}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">রেফারেন্স নম্বর</label>
                                <input
                                    type="text"
                                    value={data.ref_no} // Display the generated reference number
                                    readOnly
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2 text-lg font-semibold"> উত্তোলন তালিকা</h2>
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
                                    {data.withdraws.map((row, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">
                                                <Select
                                                    options={itemOptions}
                                                    value={itemOptions.find((opt) => opt.value === Number(row.party_item_id))}
                                                    onChange={(selected) =>
                                                        handleFieldChange(index, 'party_item_id', selected?.value.toString() || '')
                                                    }
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
                                {processing ? 'সেভ হচ্ছে...' : 'উত্তোলন করুন'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
