import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const scrollToFirstError = (errors: Record<string, any>) => {
    const firstField = Object.keys(errors)[0];
    if (firstField) {
        const el = document.querySelector(`[name="${firstField}"]`);
        if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus?.();
        }
    }
};
interface Godown {
    id: number;
    name: string;
}

interface ItemLot {
    lot_id: number;
    lot_no: string;
    stock_qty: number;
    received_at: string | null;
    unit_weight?: number;
    saved_rate?: number | null; // normalized to product unit
    saved_rate_unit?: string | null;
    per_kg_rate?: number | null; // always per kg
}

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
}

interface Salesman {
    id: number;
    name: string;
}
interface Ledger {
    id: number;
    account_ledger_name: string;
    mark_for_user?: boolean; // Added property
}
interface Item {
    id: number;
    item_name: string;
    stock_qty: number;
    unit: string;
    lots: ItemLot[];
}

export default function SaleCreate({
    godowns,
    salesmen,
    ledgers,
    items,
    receivedModes,
    inventoryLedgers,
    accountGroups,
}: {
    godowns: Godown[];
    salesmen: Salesman[];
    ledgers: Ledger[];
    items: Item[];
    receivedModes: ReceivedMode[];
    inventoryLedgers: Ledger[];
    accountGroups: { id: number; name: string }[];
}) {
    const t = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        voucher_no: '',
        godown_id: '',
        salesman_id: '',
        account_ledger_id: '',
        phone: '',
        address: '',
        sale_items: [
            {
                product_id: '',
                lot_id: '',
                qty: '',
                main_price: '',
                discount: '',
                discount_type: 'bdt',
                subtotal: '',
                note: '',
            },
        ],
        shipping_details: '',
        delivered_to: '',
        truck_rent: '',
        rent_advance: '',
        net_rent: '',
        truck_driver_name: '',
        driver_address: '',
        driver_mobile: '',
        received_mode_id: '',
        amount_received: '',
        inventory_ledger_id: '',
        // total_due: '',
        // closing_balance: '',
        sub_responsible_id: '',
        responsible_id: '',

        cogs_ledger_id: '',
    });

    /* ③ fetch items + lots from the new endpoint */
    useEffect(() => {
        if (!data.godown_id) {
            setFilteredItems([]);
            return;
        }

        axios
            .get(`/godowns/${data.godown_id}/stocks-with-lots`)
            .then((res) => setFilteredItems(res.data))
            .catch(() => setFilteredItems([]));
    }, [data.godown_id]);

    // Trigger this effect whenever the godown_id changes
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [modalTargetField, setModalTargetField] = useState<'inventory' | 'cogs'>('inventory');

    const [showInventoryLedgerModal, setShowInventoryLedgerModal] = useState(false);
    const [showCogsLedgerModal, setShowCogsLedgerModal] = useState(false);
    const [showLedgerModal, setShowLedgerModal] = useState(false);
    const [newLedgerName, setNewLedgerName] = useState('');
    const [newGroupId, setNewGroupId] = useState('');

    const customerLedgers = ledgers.filter((l) => l.mark_for_user);

    // const [currentLedgerBalance, setCurrentLedgerBalance] = useState(0);

    const [uiTotalDue, setUiTotalDue] = useState('0.00');
    const [uiClosingBal, setUiClosingBal] = useState('0.00');

    // When received_mode_id changes ➜ fetch balance and recompute
    useEffect(() => {
        const mode = receivedModes.find((m) => m.id == data.received_mode_id);
        const ledgerBal = parseFloat((mode as any)?.ledger?.closing_balance ?? 0) + parseFloat((mode as any)?.ledger?.opening_balance ?? 0);
        const rec = parseFloat(data.amount_received || '0');
        setUiClosingBal((ledgerBal + rec).toFixed(2));
    }, [data.received_mode_id, data.amount_received]);

    // When amount_received changes ➜ recompute

    // Auto-generate voucher no on mount
    useEffect(() => {
        if (!data.voucher_no) {
            const today = new Date();
            const isoDate = today.toISOString().slice(0, 10); // 2025-08-07 ✅
            const flatDate = isoDate.replace(/-/g, ''); // 20250807  (just for voucher)
            const randomId = Math.floor(1000 + Math.random() * 9000);

            setData('voucher_no', `SAL-${flatDate}-${randomId}`);
            setData('date', isoDate); // store a real date
        }
    }, []);

    // 🛠️ Add this to SaleCreate component to auto-calculate due
    useEffect(() => {
        const total = data.sale_items.reduce((s, i) => s + parseFloat(i.subtotal || '0'), 0);
        const rec = parseFloat(data.amount_received || '0');
        setUiTotalDue((total - rec).toFixed(2));
    }, [data.sale_items, data.amount_received]);

    /* ④ generic row-mutator so we can reuse for lot_id too */
    // Handle changes in each row's product fields
    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.sale_items];
        updatedItems[index][field] = value;

        if (field === 'product_id') {
            updatedItems[index].lot_id = '';
        }
        // Recalculate subtotal
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].main_price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;
        const discountType = updatedItems[index].discount_type;
        const discountAmount = discountType === 'percent' ? qty * price * (discount / 100) : discount;

        const subtotal = qty * price - discountAmount;
        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;

        setData('sale_items', updatedItems);
    };

    /* separate change handler for lot so we can show stock notice / skip recalculation */
    const handleLotChange = (index: number, lotId: string) => {
        const updated = [...data.sale_items];
        updated[index].lot_id = lotId ? parseInt(lotId, 10) : '';
        setData('sale_items', updated);
    };

    // Add a new row
    const addProductRow = () => {
        setData('sale_items', [
            ...data.sale_items,
            {
                product_id: '',
                qty: '',
                lot_id: '',
                main_price: '',
                discount: '',
                discount_type: 'bdt',
                subtotal: '',
                note: '',
            },
        ]);
    };

    // Remove a row
    const removeProductRow = (index: number) => {
        if (data.sale_items.length > 1) {
            const updated = [...data.sale_items];
            updated.splice(index, 1);
            setData('sale_items', updated);
        }
    };

    // Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales');
    };

    function PricePreview({
        prodUnit,
        unitWeightKg,
        onApplyUnitPrice,
    }: {
        prodUnit: string; // e.g. 'Bosta' or 'kg'
        unitWeightKg: number; // kg per product unit (e.g. kg per bosta)
        onApplyUnitPrice: (val: number) => void; // sets main_price (per product unit)
    }) {
        const [perKg, setPerKg] = useState<string>('');
        const [perUnit, setPerUnit] = useState<string>('');

        const isKgUnit = String(prodUnit).toLowerCase() === 'kg';
        const safeUW = Number(unitWeightKg || 0);

        // conversions
        const kgToUnit = (kg: number) => (isKgUnit ? kg : safeUW > 0 ? kg * safeUW : NaN);
        const unitToKg = (u: number) => (isKgUnit ? u : safeUW > 0 ? u / safeUW : NaN);

        const perUnitFromKg = perKg ? kgToUnit(parseFloat(perKg)) : NaN;
        const perKgFromUnit = perUnit ? unitToKg(parseFloat(perUnit)) : NaN;

        return (
            <div className="mt-2 space-y-2 rounded border p-2 text-xs">
                {/* Try per-kg price */}
                <div className="flex flex-wrap items-center gap-2">
                    <span>Try per-kg:</span>
                    <input
                        type="number"
                        placeholder="৳/kg"
                        value={perKg}
                        onChange={(e) => setPerKg(e.target.value)}
                        className="w-28 rounded border p-1"
                    />
                    <span className="opacity-70">
                        {Number.isFinite(perUnitFromKg) ? `→ ৳${perUnitFromKg.toFixed(2)}/${prodUnit}` : isKgUnit ? '' : '(set unit weight)'}
                    </span>
                    {Number.isFinite(perUnitFromKg) && (
                        <button
                            type="button"
                            className="rounded bg-emerald-600 px-2 py-[2px] text-white hover:bg-emerald-500"
                            onClick={() => onApplyUnitPrice(Number(perUnitFromKg))}
                            title="Use this converted per-unit price"
                        >
                            Use
                        </button>
                    )}
                </div>

                {/* Try per-unit (product unit) price */}
                <div className="flex flex-wrap items-center gap-2">
                    <span>Try per-{prodUnit}:</span>
                    <input
                        type="number"
                        placeholder={`৳/${prodUnit}`}
                        value={perUnit}
                        onChange={(e) => setPerUnit(e.target.value)}
                        className="w-32 rounded border p-1"
                    />
                    <span className="opacity-70">
                        {Number.isFinite(perKgFromUnit) ? `→ ৳${perKgFromUnit.toFixed(2)}/kg` : isKgUnit ? '' : '(set unit weight)'}
                    </span>
                    {perUnit && Number.isFinite(parseFloat(perUnit)) && (
                        <button
                            type="button"
                            className="rounded bg-emerald-600 px-2 py-[2px] text-white hover:bg-emerald-500"
                            onClick={() => onApplyUnitPrice(Number(perUnit))}
                            title="Use this converted per-unit price"
                        >
                            Use
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Add types for the event handler
    const handleCogsLedgerChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setData('cogs_ledger_id', e.target.value);
    };

    return (
        <AppLayout>
            <Head title={t('addSaleTitle')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    {/* Header */}
                    <PageHeader title={t('createSaleHeader')} addLinkHref="/sales" addLinkText={t('backText')} />

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-background space-y-8 rounded-lg border p-6">
                        {/* Section 1: Basic Sale Info */}
                        <div>
                            <h2 className="text-foreground mb-3 border-b pb-1 text-lg font-semibold">{t('saleInfoHeader')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <InputCalendar value={data.date} onChange={(val) => setData('date', val)} label={t('dateLabel')} required />
                                </div>
                                <div>
                                    <label htmlFor="voucher_no">{t('voucherNoLabel')}</label>
                                    <Input type="text" className="bg-background w-full rounded border p-1 mt-1" value={data.voucher_no} readOnly />
                                </div>
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-semibold">{t('cogsLedgerLabel')}</label>
                                    <select className="w-full border p-2" value={data.cogs_ledger_id || ''} onChange={handleCogsLedgerChange}>
                                        <option value="">{t('selectCostTrackingLedger')}</option>
                                        {ledgers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.account_ledger_name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="text-foreground mt-1 text-sm">
                                        Used to track cost of goods sold. Don’t see one?{' '}
                                        <button type="button" onClick={() => setShowCogsLedgerModal(true)} className="text-blue-600 underline">
                                            Create one
                                        </button>
                                    </div>
                                    {errors.cogs_ledger_id && <div className="text-sm text-red-500">{errors.cogs_ledger_id}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Receive Mode, Amount, Due, Closing Balance */}
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-semibold">{t('receiveModeLabel')}</label>
                            <select
                                className="w-full border p-2"
                                value={data.received_mode_id || ''}
                                onChange={(e) => setData('received_mode_id', e.target.value)}
                            >
                                <option value="">{t('selectModeOption')}</option>
                                {receivedModes.map((mode) => (
                                    <option key={mode.id} value={mode.id}>
                                        {mode.mode_name}
                                    </option>
                                ))}
                            </select>
                            <div className="text-foreground mt-1 text-sm">
                                {t('projectedClosingBalance')} {uiClosingBal}
                            </div>
                        </div>
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-semibold">{t('receiveAmountLabel')}</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full border p-2"
                                value={data.amount_received || ''}
                                onChange={(e) => setData('amount_received', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-semibold">{t('totalDueLabel')}</label>
                            <input type="number" readOnly className="bg-background w-full border p-2" value={uiTotalDue} />
                        </div>
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-semibold">{t('closingBalanceLabel')}</label>
                            <input type="number" readOnly className="bg-background w-full border p-2" value={uiClosingBal} />
                        </div>

                        {/* Section 3: Shipping, Delivery, Truck Info */}
                        <div>
                            <h2 className="text-foreground mb-3 border-b pb-1 text-lg font-semibold">{t('shippingDetailsHeader')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('shippingDetailsLabel')}</label>
                                    <textarea
                                        className="w-full rounded border p-2"
                                        rows={3}
                                        value={data.shipping_details}
                                        onChange={(e) => setData('shipping_details', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('deliveredToLabel')}</label>
                                    <textarea
                                        className="w-full rounded border p-2"
                                        rows={3}
                                        value={data.delivered_to}
                                        onChange={(e) => setData('delivered_to', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('truckRentLabel')}</label>
                                    <input
                                        type="text"
                                        className="w-full rounded border p-2"
                                        value={data.truck_rent}
                                        onChange={(e) => setData('truck_rent', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('rentAdvanceLabel')}</label>
                                    <input
                                        type="text"
                                        className="w-full rounded border p-2"
                                        value={data.rent_advance}
                                        onChange={(e) => setData('rent_advance', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('netRentLabel')}</label>
                                    <input
                                        type="text"
                                        className="w-full rounded border p-2"
                                        value={data.net_rent}
                                        onChange={(e) => setData('net_rent', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('truckDriverNameLabel')}</label>
                                    <input
                                        type="text"
                                        className="w-full rounded border p-2"
                                        value={data.truck_driver_name}
                                        onChange={(e) => setData('truck_driver_name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('driverAddressLabel')}</label>
                                    <input
                                        type="text"
                                        className="w-full rounded border p-2"
                                        value={data.driver_address}
                                        onChange={(e) => setData('driver_address', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('driverMobileLabel')}</label>
                                    <input
                                        type="text"
                                        className="w-full rounded border p-2"
                                        value={data.driver_mobile}
                                        onChange={(e) => setData('driver_mobile', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Submit */}
                        <ActionFooter
                            className="w-full justify-end"
                            onSubmit={handleSubmit}
                            cancelHref="/sales"
                            processing={processing}
                            submitText={processing ? t('savingText') : t('saveText')}
                            cancelText={t('cancelText')}
                        />
                    </form>
                </div>
            </div>

            {/* Inventory Ledger Modal */}
            {showInventoryLedgerModal && (
                <div
                    className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center"
                    style={{
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div className="w-full max-w-md rounded bg-background p-6 shadow-lg">
                        <h2 className="text-foreground mb-4 text-lg font-semibold">{t('createLedgerHeader')}</h2>

                        <input
                            type="text"
                            placeholder={t('ledgerNamePlaceholder')}
                            className="mb-3 w-full rounded border p-2"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                        />

                        <select className="mb-4 w-full rounded border p-2" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)}>
                            <option value="">{t('selectGroupOption')}</option>
                            {accountGroups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button className="rounded bg-gray-400 px-4 py-2 text-white" onClick={() => setShowInventoryLedgerModal(false)}>
                                {t('cancelText')}
                            </button>

                            <button
                                className="rounded bg-green-600 px-4 py-2 text-white"
                                onClick={async () => {
                                    try {
                                        const response = await axios.post('/account-ledgers/modal', {
                                            account_ledger_name: newLedgerName,
                                            account_group_id: newGroupId,
                                            for_transition_mode: 0,
                                            mark_for_user: 0,
                                            phone_number: '0',
                                            opening_balance: 0,
                                            debit_credit: 'debit',
                                            status: 'active',
                                        });

                                        const newLedger = response.data;

                                        setData('inventory_ledger_id', newLedger.id);
                                        // setInventoryLedgers((prev) => [...prev, newLedger]);

                                        setNewLedgerName('');
                                        setNewGroupId('');
                                        setShowInventoryLedgerModal(false);
                                    } catch (err) {
                                        console.error(err);
                                        alert(t('failedToCreateLedger'));
                                    }
                                }}
                            >
                                {t('createLedgerButton')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* COGS Ledger Modal */}
            {showCogsLedgerModal && (
                <div
                    className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center"
                    style={{
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div className="w-full max-w-md rounded bg-background p-6 shadow-lg">
                        <h2 className="text-foreground mb-4 text-lg font-semibold">{t('createCogsLedgerHeader')}</h2>

                        <input
                            type="text"
                            placeholder={t('ledgerNamePlaceholder')}
                            className="mb-3 w-full rounded border p-2"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                        />

                        <select className="mb-4 w-full rounded border p-2" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)}>
                            <option value="">{t('selectGroupOption')}</option>
                            {accountGroups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button className="rounded bg-gray-400 px-4 py-2 text-white" onClick={() => setShowCogsLedgerModal(false)}>
                                {t('cancelText')}
                            </button>

                            <button
                                className="rounded bg-green-600 px-4 py-2 text-white"
                                onClick={async () => {
                                    try {
                                        const response = await axios.post('/account-ledgers/modal', {
                                            account_ledger_name: newLedgerName,
                                            account_group_id: newGroupId,
                                            for_transition_mode: 0,
                                            mark_for_user: 0,
                                            phone_number: '0',
                                            opening_balance: 0,
                                            debit_credit: 'debit',
                                            status: 'active',
                                        });

                                        const newLedger = response.data;

                                        setData('cogs_ledger_id', newLedger.id);
                                        // optional: update dropdown if COGS ledgers are filtered separately

                                        setNewLedgerName('');
                                        setNewGroupId('');
                                        setShowCogsLedgerModal(false);
                                    } catch (err) {
                                        console.error(err);
                                        alert(t('failedToCreateLedger'));
                                    }
                                }}
                            >
                                {t('createLedgerButton')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
