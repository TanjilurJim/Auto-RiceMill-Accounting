import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ paymentModes }: any) {
    const [date, setDate] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [modeFromId, setModeFromId] = useState('');
    const [modeToId, setModeToId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [sendSms, setSendSms] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        const random = Math.floor(Math.random() * 10000);
        setDate(today);
        setVoucherNo(`CONTRA-${today.replace(/-/g, '')}-${random}`);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/contra-add', {
            date,
            voucher_no: voucherNo,
            mode_from_id: modeFromId,
            mode_to_id: modeToId,
            amount,
            description,
            send_sms: sendSms,
        });
    };

    const getBalance = (id: string) => {
        const mode = paymentModes.find((m: any) => m.id == id);
        return Number(mode?.closing_balance ?? mode?.opening_balance ?? 0).toFixed(2);
    };

    return (
        <AppLayout>
            <Head title="Add Contra Entry" />
            <div className="mx-auto max-w-4xl space-y-6 p-6">
                <h1 className="mb-2 text-2xl font-bold">Add Contra Entry</h1>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-lg font-semibold">Voucher Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Voucher No</label>
                                <input type="text" value={voucherNo} readOnly className="w-full rounded border bg-gray-100 px-3 py-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-lg font-semibold">Contra Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">From Mode</label>
                                <select
                                    value={modeFromId}
                                    onChange={(e) => setModeFromId(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                >
                                    <option value="">Select Mode</option>
                                    {paymentModes.map((mode: any) => (
                                        <option key={mode.id} value={mode.id} disabled={mode.id == modeToId}>
                                            {mode.mode_name} ({getBalance(mode.id)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">To Mode</label>
                                <select value={modeToId} onChange={(e) => setModeToId(e.target.value)} className="w-full rounded border px-3 py-2">
                                    <option value="">Select Mode</option>
                                    {paymentModes.map((mode: any) => (
                                        <option key={mode.id} value={mode.id} disabled={mode.id == modeFromId}>
                                            {mode.mode_name} ({getBalance(mode.id)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-lg font-semibold">Notes & Actions</h2>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                            <label className="text-sm">Send SMS</label>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button type="submit" onClick={handleSubmit}>
                                 Save
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
