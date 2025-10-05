import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Godown {
    id: number;
    name: string;
}

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
    ledger: {
        id: number;
        account_ledger_name: string;
    };
}
interface Ledger {
    id: number;
    account_ledger_name: string;
}
interface Item {
    id: number;
    item_name: string;
}

export default function PurchaseReturnCreate({
    godowns,
    ledgers,
    items,
    receivedModes,
}: {
    godowns: Godown[];
    ledgers: Ledger[];
    items: Item[];
    receivedModes: ReceivedMode[];
}) {
    const t = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        return_voucher_no: '',
        godown_id: '',
        account_ledger_id: '',
        inventory_ledger_id: '', // 🆕 for journal credit
        reason: '',
        return_items: [{ product_id: '', qty: '', lot_no: '', price: '', subtotal: '' }],
        refund_modes: [{ mode_name: '', phone_number: '', ledger_id: '', amount_paid: '' }], // 🆕 for optional refund flow
    });

    // Auto voucher generator
    useEffect(() => {
        if (!data.return_voucher_no) {
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const voucher = `RET-${dateStr}-${randomId}`;
            setData('return_voucher_no', voucher);
        }
    }, []);

    // Dynamic item row logic
    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.return_items];
        updatedItems[index][field] = value;
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].price) || 0;
        const subtotal = qty * price;
        updatedItems[index].subtotal = (subtotal > 0 ? subtotal : 0).toString();
        setData('return_items', updatedItems);
    };

    const addProductRow = () => setData('return_items', [...data.return_items, { product_id: '', qty: '', lot_no: '', price: '', subtotal: '' }]);

    const removeProductRow = (index: number) => {
        if (data.return_items.length === 1) return;
        confirmDialog({}, () => {
            const updated = [...data.return_items];
            updated.splice(index, 1);
            setData('return_items', updated);
        });
    };

    const handleSubmit = (e: React.FormEvent, printAfter = false) => {
        e.preventDefault();
        post('/purchase-returns', {
            data: { ...data, print: printAfter }, // 🟢 now print flag is sent to backend
            onSuccess: (page) => {
                const id = page.props.flash?.id;
                if (printAfter && id) {
                    router.visit(`/purchase-returns/${id}/invoice`);
                }
            },
        });
    };

    return (
        <AppLayout>
            <Head title={t('purchaseReturnCreateTitle')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('purchaseReturnCreateHeader')} addLinkText={t('backText')} addLinkHref="/purchase-returns" />

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="bg-background space-y-6 rounded-lg border p-6">
                        {/* Return Info */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-1 text-lg font-semibold">{t('returnInfoHeader')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <InputCalendar value={data.date} onChange={(val) => setData('date', val)} label={t('dateLabel')} />
                                <input
                                    type="text"
                                    className="border p-1"
                                    placeholder={t('returnVoucherNoPlaceholder')}
                                    value={data.return_voucher_no}
                                    onChange={(e) => setData('return_voucher_no', e.target.value)}
                                    readOnly
                                />
                                <select className="border p-2" value={data.godown_id} onChange={(e) => setData('godown_id', e.target.value)}>
                                    <option value="">{t('selectGodownOption')}</option>
                                    {godowns.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="border p-2"
                                    value={data.account_ledger_id}
                                    onChange={(e) => setData('account_ledger_id', e.target.value)}
                                >
                                    <option value="">{t('selectPartyLedgerOption')}</option>
                                    {ledgers.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.account_ledger_name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="border p-2"
                                    value={data.inventory_ledger_id}
                                    onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                                >
                                    <option value="">{t('selectInventoryLedgerOption')}</option>
                                    {ledgers.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.account_ledger_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                rows={3}
                                placeholder={t('reasonForReturnPlaceholder')}
                                className="w-full border p-2"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                            ></textarea>
                        </div>

                        {/* Return Items Table */}
                        <div>
                            <h2 className="bg-background mb-3 border-b pb-1 text-lg font-semibold">Return Items</h2>
                            <h2 className="bg-background mb-3 border-b pb-1 text-lg font-semibold">{t('returnItemsHeader')}</h2>
                            <div className="overflow-x-auto rounded border">
                                <table className="min-w-full text-left">
                                    <thead className="bg-background text-sm">
                                        <tr>
                                            <th className="border px-2 py-1">{t('productHeader')}</th>
                                            <th className="border px-2 py-1">{t('lotNoHeader')}</th>
                                            <th className="border px-2 py-1">{t('qtyHeader')}</th>
                                            <th className="border px-2 py-1">{t('unitPriceHeader')}</th>
                                            <th className="border px-2 py-1">{t('subtotalHeader')}</th>
                                            <th className="border px-2 py-1 text-center">{t('actionHeader')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.return_items.map((item, index) => (
                                            <tr key={index} className="hover:bg-background/50">
                                                <td className="border px-2 py-1">
                                                    <select
                                                        className="w-full"
                                                        value={item.product_id}
                                                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="">{t('selectProductOption')}</option>
                                                        {items.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.item_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                {/* Lot No */}
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="text"
                                                        className="w-full"
                                                        value={item.lot_no}
                                                        onChange={(e) => handleItemChange(index, 'lot_no', e.target.value)}
                                                        required
                                                    />
                                                </td>

                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input type="number" className="bg-background w-full" value={item.subtotal} readOnly />
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    <div className="flex justify-center space-x-1">
                                                        {data.return_items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProductRow(index)}
                                                                className="bg-danger hover:bg-danger-hover rounded px-2 py-1 text-white"
                                                            >
                                                                &minus;
                                                            </button>
                                                        )}
                                                        {index === data.return_items.length - 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={addProductRow}
                                                                className="bg-primary hover:bg-primary-hover rounded px-2 py-1 text-white"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="mt-6 flex justify-between gap-4">
                            <div className="flex w-full flex-col gap-2.5 md:flex-row">
                                <div className="bg-background flex w-full justify-between rounded border p-3 shadow-sm">
                                    <span className="text-foreground0 font-semibold">{t('totalQtyLabel')}</span>
                                    <span className="font-semibold">
                                        {data.return_items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)}
                                    </span>
                                </div>
                                <div className="bg-background flex w-full justify-between rounded border p-3 shadow-sm">
                                    <span className="text-foreground0 font-semibold">{t('totalReturnValueLabel')}</span>
                                    <span className="font-semibold">
                                        {data.return_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0)} {t('currencyTk')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <h2 className="border-b pb-1 text-lg font-semibold">{t('refundModeHeader')}</h2>
                            {data.refund_modes.map((mode, index) => (
                                <div key={index} className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <select
                                        className="border p-2"
                                        value={mode.ledger_id}
                                        onChange={(e) => {
                                            const selected = receivedModes.find((r) => r.ledger_id == e.target.value);
                                            const updated = [...data.refund_modes];
                                            updated[index].ledger_id = e.target.value;
                                            updated[index].mode_name = selected?.mode_name || ''; // auto-fill mode_name
                                            setData('refund_modes', updated);
                                        }}
                                    >
                                        <option value="">{t('selectRefundModeOption')}</option>
                                        {receivedModes.map((rm) => (
                                            <option key={rm.ledger_id} value={rm.ledger_id}>
                                                {rm.mode_name} — {rm.ledger?.account_ledger_name || 'Ledger'}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        placeholder={t('phoneNumberPlaceholder')}
                                        className="border p-2"
                                        value={mode.phone_number}
                                        onChange={(e) => {
                                            const updated = [...data.refund_modes];
                                            updated[index].phone_number = e.target.value;
                                            setData('refund_modes', updated);
                                        }}
                                    />

                                    <input
                                        type="number"
                                        placeholder={t('amountPaidPlaceholder')}
                                        className="border p-2"
                                        value={mode.amount_paid}
                                        onChange={(e) => {
                                            const updated = [...data.refund_modes];
                                            updated[index].amount_paid = e.target.value;
                                            setData('refund_modes', updated);
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        {data.refund_modes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...data.refund_modes];
                                                    updated.splice(index, 1);
                                                    setData('refund_modes', updated);
                                                }}
                                                className="bg-danger hover:bg-danger-hover w-full rounded px-3 py-1 text-white md:w-fit"
                                            >
                                                &minus;
                                            </button>
                                        )}
                                        {index === data.refund_modes.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData('refund_modes', [
                                                        ...data.refund_modes,
                                                        { mode_name: '', phone_number: '', ledger_id: '', amount_paid: '' },
                                                    ])
                                                }
                                                className="bg-primary hover:bg-primary-hover w-full rounded px-3 py-1 text-white md:w-fit"
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-foreground mt-2 text-right text-sm">
                            {t('totalRefundedLabel')}: {data.refund_modes.reduce((sum, r) => sum + (parseFloat(r.amount_paid) || 0), 0)}{' '}
                            {t('currencyTk')}
                        </div>

                        {/* Submit */}
                        <ActionFooter
                            onSubmit={(e) => handleSubmit(e, false)}
                            onSaveAndPrint={(e) => handleSubmit(e, true)}
                            cancelHref="/purchase-returns"
                            processing={processing}
                            submitText={processing ? t('savingText') : t('saveText')}
                            // saveAndPrintText={t('saveAndPrintText')}
                            cancelText={t('cancelText')}
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
