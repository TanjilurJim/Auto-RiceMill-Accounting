import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ contra, modes }: any) {
    const [date, setDate] = useState(contra.date || '');
    const [voucherNo] = useState(contra.voucher_no || '');
    const [modeFromId, setModeFromId] = useState(contra.mode_from_id || '');
    const [modeToId, setModeToId] = useState(contra.mode_to_id || '');
    const [amount, setAmount] = useState(contra.amount || '');
    const [description, setDescription] = useState(contra.description || '');
    const [sendSms, setSendSms] = useState(contra.send_sms || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/contra-add/${contra.id}`, {
            date,
            voucher_no: voucherNo,
            mode_from_id: modeFromId,
            mode_to_id: modeToId,
            amount,
            description,
            send_sms: sendSms,
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Contra Entry" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

                    <PageHeader title='Edit Contra Entry' addLinkHref='/contra-add' addLinkText='Back' />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4 border p-6 rounded-2xl">
                            <div>
                                <label className="mb-1 block font-medium">Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border px-3 py-2" />
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Voucher No</label>
                                <input type="text" value={voucherNo} readOnly className="w-full rounded border bg-gray-100 px-3 py-2" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 border p-6 rounded-2xl">
                            <div>
                                <label className="mb-1 block font-medium">From Mode</label>
                                <select value={modeFromId} onChange={(e) => setModeFromId(e.target.value)} className="w-full rounded border px-3 py-2">
                                    <option value="">Select Mode</option>
                                    {modes.map((mode: any) => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.mode_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">To Mode</label>
                                <select value={modeToId} onChange={(e) => setModeToId(e.target.value)} className="w-full rounded border px-3 py-2">
                                    <option value="">Select Mode</option>
                                    {modes.map((mode: any) => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.mode_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='border p-6 rounded-2xl'>
                            <label className="mb-1 block font-medium">Amount</label>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded border px-3 py-2" />
                        </div>

                        <div className='border p-6 rounded-2xl'>
                            <label className="mb-1 block font-medium">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2" />
                        </div>

                        {/* <div className="flex items-center gap-2">
                            <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                            <label className="text-sm">Send SMS</label>
                        </div> */}

                        <ActionFooter
                            className='justify-end'
                            onSubmit={handleSubmit}
                            cancelHref="/contra-add"
                            processing={false}
                            submitText="Update Contra Entry"
                            cancelText="Cancel"
                        />

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
