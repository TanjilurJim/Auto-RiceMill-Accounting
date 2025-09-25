import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ paymentModes }: any) {
    const t = useTranslation();

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
        return Number(mode?.ledger?.closing_balance ?? mode?.ledger?.opening_balance ?? 0).toFixed(2);
    };

    return (
        <AppLayout>
            <Head title={t('addContraTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-white">
                    <PageHeader title={t('addContraTitle')} addLinkHref="/contra-add" addLinkText={t('backText')} />

                    <div className="grid grid-cols-1 gap-2.5">
                        <Card>
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-lg font-semibold">{t('voucherInfoHeader')}</h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">{t('dateLabel')}</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full rounded border px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">{t('voucherNoLabel')}</label>
                                        <input type="text" value={voucherNo} readOnly className="w-full rounded border bg-gray-100 px-3 py-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-lg font-semibold">{t('contraDetailsHeader')}</h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">{t('fromModeLabel')}</label>
                                        <select
                                            value={modeFromId}
                                            onChange={(e) => setModeFromId(e.target.value)}
                                            className="w-full rounded border px-3 py-2"
                                        >
                                            <option value="">{t('selectModeOption')}</option>
                                            {paymentModes.map((mode: any) => (
                                                <option key={mode.id} value={mode.id} disabled={mode.id == modeToId}>
                                                    {mode.mode_name} ({getBalance(mode.id)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">{t('toModeLabel')}</label>
                                        <select
                                            value={modeToId}
                                            onChange={(e) => setModeToId(e.target.value)}
                                            className="w-full rounded border px-3 py-2"
                                        >
                                            <option value="">{t('selectModeOption')}</option>
                                            {paymentModes.map((mode: any) => (
                                                <option key={mode.id} value={mode.id} disabled={mode.id == modeFromId}>
                                                    {mode.mode_name} ({getBalance(mode.id)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('amountHeader')}</label>
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
                                <h2 className="text-lg font-semibold">{t('notesActionsHeader')}</h2>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('descriptionHeader')}</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                    />
                                </div>

                                {/* <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                                    <label className="text-sm">Send SMS</label>
                                </div> */}

                                <ActionFooter
                                    className="justify-end"
                                    onSubmit={handleSubmit}
                                    cancelHref="/contra-add"
                                    processing={false}
                                    submitText={t('saveContraText')}
                                    cancelText={t('cancelText')}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
