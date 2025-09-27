import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import Select from 'react-select';

interface Props {
    parties: { id: number; account_ledger_name: string }[];
    items: { id: number; item_name: string }[];
    godowns: { id: number; name: string }[];
    today: string;
    generated_ref_no: string;
}

export default function TransferForm({ parties, items, godowns, today, generated_ref_no }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: today,
        party_ledger_id: '',
        godown_id_from: '',
        godown_id_to: '',
        item_id: '',
        qty: '',
        remarks: '',
        ref_no: generated_ref_no,
    });

    const itemOptions = items.map((item) => ({ value: item.id, label: item.item_name }));
    const godownOptions = godowns.map((godown) => ({ value: godown.id, label: godown.name }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('party-stock.transfer.store'), {
            preserveScroll: true,
            onSuccess: () => reset('party_ledger_id', 'godown_id_from', 'godown_id_to', 'item_id', 'qty', 'remarks', 'ref_no'),
        });
    };

    return (
        <AppLayout>
            <Head title="মাল স্থানান্তর ফর্ম" />
            <div className="h-full w-screen bg-background p-6 lg:w-full">
                <div className="h-full rounded-lg bg-background p-6">
                    <h1 className="mb-4 text-xl font-bold">মাল স্থানান্তর ফর্ম</h1>

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
                                <label className="mb-1 block font-medium">গুদাম (উৎস)</label>
                                <Select
                                    options={godownOptions}
                                    value={godownOptions
                                        .find((opt) => opt.value === Number(data.godown_id_from))}
                                    onChange={(selected) => setData('godown_id_from', selected?.value || '')}
                                    classNamePrefix="react-select"
                                    placeholder="গুদাম খুঁজুন..."
                                    isClearable
                                />
                                {errors.godown_id_from && <p className="text-sm text-red-500">{errors.godown_id_from}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">গুদাম (গন্তব্য)</label>
                                <Select
                                    options={godownOptions}
                                    value={godownOptions
                                        .find((opt) => opt.value === Number(data.godown_id_to))}
                                    onChange={(selected) => setData('godown_id_to', selected?.value || '')}
                                    classNamePrefix="react-select"
                                    placeholder="গুদাম খুঁজুন..."
                                    isClearable
                                />
                                {errors.godown_id_to && <p className="text-sm text-red-500">{errors.godown_id_to}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">পণ্য</label>
                                <Select
                                    options={itemOptions}
                                    value={itemOptions.find((opt) => opt.value === Number(data.item_id))}
                                    onChange={(selected) => setData('item_id', selected?.value || '')}
                                    classNamePrefix="react-select"
                                    placeholder="পণ্য খুঁজুন..."
                                    isClearable
                                />
                                {errors.item_id && <p className="text-sm text-red-500">{errors.item_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">পরিমাণ</label>
                                <input
                                    type="number"
                                    value={data.qty}
                                    onChange={(e) => setData('qty', e.target.value)}
                                    className="w-full rounded border p-2"
                                />
                                {errors.qty && <p className="text-sm text-red-500">{errors.qty}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">মন্তব্য</label>
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div className="text-right">
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
