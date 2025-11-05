import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import SupplierCreatableSelect from '@/components/SupplierCreatableSelect';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/components/useTranslation';

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

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
}
interface AccountGroup {
    id: number;
    name: string;
}
interface Salesman {
    id: number;
    name: string;
}
interface Ledger {
    id: number;
    account_ledger_name: string;
}
interface Item {
    id: number;
    item_name: string;
}

interface StockRow {
    id: number;
    qty: number;
    item: { id: number; item_name: string; unit_name?: string };
}

export default function PurchaseCreate({
    godowns,
    salesmen,
    ledgers,
    items,
    inventoryLedgers, // ✅ add
    supplierLedgers, // ✅ add
    accountGroups,
    receivedModes,
    stockItemsByGodown, // ✅ add
}: {
    godowns: Godown[];
    salesmen: Salesman[];
    ledgers: Ledger[];
    items: Item[];
    inventoryLedgers: Ledger[]; // 👈
    supplierLedgers: Ledger[]; // 👈
    accountGroups: { id: number; name: string }[];
    receivedModes: ReceivedMode[]; // 👈
    stockItemsByGodown: { [k: number]: StockRow[] }; //  👈  NEW
}) {
    const t = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        voucher_no: '',
        godown_id: '',
        salesman_id: '',
        account_ledger_id: '',
        inventory_ledger_id: '',
        // supplier_ledger_id: '',
        phone: '',
        address: '',
        shipping_details: '',
        delivered_to: '',
        purchase_items: [{ product_id: '', qty: '', price: '', lot_no: '', discount: '', discount_type: 'bdt', subtotal: '', unit_weight: '' }],
        received_mode_id: '', // 👈 new
        amount_paid: '',
    });
    useEffect(() => {
        if (Object.keys(errors).length) {
            scrollToFirstError(errors);
        }
    }, [errors]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            scrollToFirstError(errors);
        }
    }, [errors]);

    useEffect(() => {
        if (!data.voucher_no) {
            const iso = dayjs().format('YYYY-MM-DD'); // storage format
            const compact = iso.replace(/-/g, ''); // for voucher only
            const randomId = Math.floor(1000 + Math.random() * 9000);

            setData('voucher_no', `PUR-${compact}-${randomId}`);
            setData('date', iso); // keep dashes!
        }
    }, []);

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.purchase_items];
        updatedItems[index][field] = value;
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;
        const discountType = updatedItems[index].discount_type;
        const discountAmount = discountType === 'percent' ? qty * price * (discount / 100) : discount;
        const subtotal = qty * price - discountAmount;
        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;
        setData('purchase_items', updatedItems);
    };

    const [partyBalance, setPartyBalance] = useState<number | null>(null);
    const [inventoryBalance, setInventoryBalance] = useState<number | null>(null);
    const [paymentLedgerBalance, setPaymentLedgerBalance] = useState<number | null>(null);

    const [productOptionsByGodown, setProductOptionsByGodown] = useState<{ [k: number]: StockRow[] }>(stockItemsByGodown);

    // convenience: items for currently selected godown
    const godownItems: StockRow[] = data.godown_id ? (productOptionsByGodown[Number(data.godown_id)] ?? []) : [];

    const fetchBalance = async (ledgerId: string, type: 'party' | 'inventory' | 'payment') => {
        if (!ledgerId) {
            if (type === 'party') setPartyBalance(null);
            if (type === 'inventory') setInventoryBalance(null);
            if (type === 'payment') setPaymentLedgerBalance(null);
            return;
        }

        try {
            const res = await axios.get(`/account-ledgers/${ledgerId}/balance`);
            const balance = res.data.closing_balance ?? 0;

            if (type === 'party') setPartyBalance(balance);
            if (type === 'inventory') setInventoryBalance(balance);
            if (type === 'payment') setPaymentLedgerBalance(balance);
        } catch (err) {
            console.error(err);
        }
    };

    /* -------------------------------------------------
     * Derived values (re-compute on every render)
     * ------------------------------------------------*/
    const grandTotal = data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);
    const amountPaidNum = parseFloat(data.amount_paid) || 0;
    const remainingDue = grandTotal - amountPaidNum;

    const addProductRow = () =>
        setData('purchase_items', [
            ...data.purchase_items,
            { product_id: '', lot_no: '', qty: '', price: '', discount: '', discount_type: 'bdt', subtotal: '', unit_weight: '' },
        ]);

    const removeProductRow = (index: number) => {
        if (data.purchase_items.length === 1) return;

        confirmDialog({}, () => {
            const updated = [...data.purchase_items];
            updated.splice(index, 1);
            setData('purchase_items', updated);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedItems = data.purchase_items.map((item) => ({
            ...item,
            qty: item.qty === '' ? 0 : parseFloat(item.qty),
            price: item.price === '' ? 0 : parseFloat(item.price),
            discount: item.discount === '' ? 0 : parseFloat(item.discount),
            subtotal: item.subtotal === '' ? 0 : parseFloat(item.subtotal),
        }));
        post('/purchases', { data: { ...data, purchase_items: cleanedItems } });
    };
    function cn(...classes: (string | false | undefined)[]) {
        return classes.filter(Boolean).join(' ');
    }

    // scroll to first error once errors arrive
    function scrollToFirstError(errs: Record<string, any>) {
        const first = Object.keys(errs)[0];
        if (!first) return;

        // field names like "purchase_items.0.qty" have dots – replace them
        const el = document.querySelector(`[name="${first.replace(/\./g, '\\.')}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const [showLedgerModal, setShowLedgerModal] = useState(false);
    const [newLedgerName, setNewLedgerName] = useState('');
    const [newGroupId, setNewGroupId] = useState('');
    const [inventoryLedgerOptions, setInventoryLedgerOptions] = useState<Ledger[]>(inventoryLedgers);
    // const godownItems: StockRow[] = data.godown_id && stockItemsByGodown[data.godown_id] ? stockItemsByGodown[data.godown_id] : [];

    const createItemInline = async (rowIndex: number) => {
        if (!data.godown_id) {
            alert('Please select a Godown first.');
            return;
        }

        const name = prompt('New product name');
        if (!name || !name.trim()) return;

        const wStr = prompt('Per-unit weight in kg (optional, e.g. 50)');
        const weight = wStr && !isNaN(Number(wStr)) ? Number(wStr) : null;

        try {
            const res = await axios.post('/items/modal', {
                item_name: name.trim(),
                godown_id: Number(data.godown_id),
                // unit_id / category_id optional – backend picks sensible defaults
                weight: weight,
            });

            const created = res.data as { id: number; item_name: string; weight?: number | null };

            // append to the current godown’s options (with 0 stock to start)
            setProductOptionsByGodown((prev) => {
                const gid = Number(data.godown_id);
                const next = { ...prev };
                const arr = next[gid] ? [...next[gid]] : [];
                arr.push({
                    id: created.id,
                    qty: 0,
                    item: { id: created.id, item_name: created.item_name, unit_name: '' },
                });
                next[gid] = arr;
                return next;
            });

            // select it in the current row
            handleItemChange(rowIndex, 'product_id', String(created.id));
            if (created.weight) handleItemChange(rowIndex, 'unit_weight', String(created.weight));
        } catch (e: any) {
            console.error(e);
            alert(e?.response?.data?.message ?? 'Failed to create product.');
        }
    };

    console.log(godownItems);
    return (
        <AppLayout>
            <Head title={t('purchase-add-title')} />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">
                    <PageHeader title={t('purchase-info-header')} addLinkHref="/purchases" addLinkText={t('purchase-back-button')} />

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="bg-background space-y-6 rounded-lg border p-6 shadow-md">
                        {/* Section 1 - Purchase Info */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-1 text-lg font-semibold">{t('purchase-info-header')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Date & Voucher No in same row */}
                                <div className="flex flex-col gap-2 md:col-span-2 md:flex-row">
                                    <div className="flex-1">
                                        <InputCalendar
                                            value={data.date}
                                            onChange={(val) => setData('date', val)}
                                            label={t('purchase-date-label')}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-end">
                                        <label className="invisible mb-1 block text-sm font-medium md:visible">{t('purchase-voucher-label')}</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2"
                                            placeholder={t('purchase-voucher-label')}
                                            value={data.voucher_no}
                                            onChange={(e) => setData('voucher_no', e.target.value)}
                                            readOnly
                                        />
                                        {errors.voucher_no && <p className="mt-1 text-sm text-red-500">{errors.voucher_no}</p>}
                                    </div>
                                </div>
                                {/* Godown */}
                                <div>
                                    <label className="invisible mb-1 block text-sm font-medium md:visible">{t('purchase-godown-label')}</label>
                                    <select
                                        name="godown_id" //  👈 name is important for scroll
                                        className={cn(
                                            'w-full border p-2',
                                            errors.godown_id && 'border-red-500', //  red border if error
                                        )}
                                        value={data.godown_id}
                                        onChange={(e) => setData('godown_id', e.target.value)}
                                    >
                                        <option value="">{t('purchase-select-godown')}</option>
                                        {godowns.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.godown_id && <p className="mt-1 text-sm text-red-500">{errors.godown_id}</p>}
                                </div>

                                {/* Salesman */}
                                <div>
                                    <label className="invisible mb-1 block text-sm font-medium md:visible">{t('purchase-salesman-label')}</label>
                                    <select
                                        className="w-full border p-2"
                                        value={data.salesman_id}
                                        onChange={(e) => setData('salesman_id', e.target.value)}
                                    >
                                        <option value="">{t('purchase-select-salesman')}</option>
                                        {salesmen.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div>
                                        <label className="invisible mb-1 block text-sm font-medium md:visible">
                                            {t('purchase-party-ledger-label')}
                                        </label>

                                        <SupplierCreatableSelect
                                            value={data.account_ledger_id}
                                            onSelectedLedgerId={(id) => {
                                                const val = id ? String(id) : '';
                                                setData('account_ledger_id', val);
                                                if (val) fetchBalance(val, 'party');
                                                else setPartyBalance(null);
                                            }}
                                            // pass phone/address so the created ledger keeps them
                                            phone={data.phone}
                                            address={data.address}
                                        />

                                        {partyBalance !== null && (
                                            <div className="text-foreground col-span-2 py-0.5 text-xs">
                                                {t('purchase-party-balance')}: {Number(partyBalance).toFixed(2)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Party balance label – put directly after the select */}
                                    {/* {partyBalance !== null && (
                                        <div className="text-foreground col-span-2 py-0.5 text-xs">
                                            {t('purchase-party-balance')}: {Number(partyBalance).toFixed(2)}
                                        </div>
                                    )} */}
                                </div>

                                {/* Inventory Ledger */}
                                {/* <div> */}
                                    {/* <label className="invisible mb-1 block text-sm font-medium md:visible">
                                        {t('purchase-inventory-ledger-label')}
                                    </label> */}

                                    {/* <div className="flex h-fit w-full flex-col items-center gap-2 md:flex-row"> */}
                                        {/* <select
                                            className={`${errors.godown_id ? 'border-red-500' : 'border-gray-300'} h-full w-full border p-2`}
                                            value={data.inventory_ledger_id}
                                            onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                                        >
                                            <option value="">{t('purchase-select-inventory')}</option>
                                            {inventoryLedgerOptions.map((l) => (
                                                <option key={l.id} value={l.id}>
                                                    {l.account_ledger_name}
                                                </option>
                                            ))}
                                        </select> */}

                                        {/* {inventoryBalance !== null && (
                                            <div className="text-foreground mt-1 text-xs">
                                                {t('purchase-inventory-balance')}: {Number(inventoryBalance).toFixed(2)}
                                            </div>
                                        )} */}

                                        {/* Placeholder for Add Button — next step will handle modal */}
                                        {/* <button
                                            type="button"
                                            className="h-full w-full rounded bg-blue-500 p-2 text-white"
                                            onClick={() => setShowLedgerModal(true)}
                                        >
                                            {t('purchase-create-ledger-button')}
                                        </button> */}
                                    {/* </div> */}
                                {/* </div> */}

                                {/* Phone and Address Inputs */}
                                <div>
                                    <label className="invisible mb-1 block text-sm font-medium md:visible">{t('purchase-phone-label')}</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2"
                                        placeholder={t('purchase-phone-placeholder')}
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="invisible mb-1 block text-sm font-medium md:visible">{t('purchase-address-label')}</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2"
                                        placeholder={t('purchase-address-placeholder')}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2 - Product Table */}
                        <div>
                            <h2 className="bg-background/80 mb-3 border-b pb-1 text-lg font-semibold">{t('purchase-products-header')}</h2>
                            <div className="overflow-x-auto rounded border">
                                <table className="min-w-full text-left">
                                    <thead className="bg-text-foreground text-sm">
                                        <tr>
                                            <th className="border px-2 py-1">{t('purchase-product-column')}</th>
                                            <th className="border px-2 py-1">{t('purchase-lot-column')}</th>
                                            <th className="border px-2 py-1">{t('purchase-qty-column')}</th>
                                            <th className="border px-2 py-1">{t('purchase-weight-column')}</th>
                                            <th className="border px-2 py-1">{t('purchase-rate-column')}</th>
                                            <th className="border px-2 py-1">{t('purchase-discount-column')}</th>
                                            <th className="border px-2 py-1">{t('purchase-type-column')}</th>
                                            <th className="border px-2 py-1">{t('purchase-subtotal-column')}</th>
                                            <th className="border px-2 py-1 text-center">{t('purchase-action-column')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.purchase_items.map((item, index) => (
                                            <tr key={index} className="hover:bg-background/80">
                                                <td className="border px-2 py-1">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            className="w-full"
                                                            value={item.product_id}
                                                            onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            {godownItems.map((stock) => (
                                                                <option key={stock.item.id} value={stock.item.id}>
                                                                    {stock.item.item_name} ({stock.qty} {stock.item.unit_name} in stock)
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <button
                                                            type="button"
                                                            className="shrink-0 rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                                                            onClick={() => createItemInline(index)}
                                                            title="Create a new product"
                                                        >
                                                            + New
                                                        </button>
                                                    </div>

                                                    {/* Projected stock AFTER this purchase */}
                                                    {item.product_id && (
                                                        <div className="text-foreground text-xs">
                                                            Projected stock:&nbsp;
                                                            {(
                                                                (parseFloat(
                                                                    (godownItems.find((s) => s.item.id == item.product_id)?.qty as any) ?? 0,
                                                                ) || 0) + (parseFloat(item.qty) || 0)
                                                            ).toFixed(2)}
                                                        </div>
                                                    )}
                                                </td>
                                                {/* Lot No */}
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="text"
                                                        className="w-full"
                                                        value={item.lot_no}
                                                        onChange={(e) => handleItemChange(index, 'lot_no', e.target.value)}
                                                        placeholder={t('purchase-lot-placeholder')}
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
                                                        value={item.unit_weight}
                                                        onChange={(e) => handleItemChange(index, 'unit_weight', e.target.value)}
                                                        placeholder="e.g. 50"
                                                    />
                                                    {/* Optional preview: line total weight */}
                                                    {!!item.qty && !!item.unit_weight && (
                                                        <div className="text-foreground text-xs">
                                                            Row weight: {(Number(item.qty) * Number(item.unit_weight)).toFixed(2)} kg
                                                        </div>
                                                    )}
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
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        value={item.discount}
                                                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <select
                                                        className="w-full"
                                                        value={item.discount_type}
                                                        onChange={(e) => handleItemChange(index, 'discount_type', e.target.value)}
                                                    >
                                                        <option value="bdt">BDT</option>
                                                        <option value="percent">%</option>
                                                    </select>
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input type="number" className="bg-background w-full" value={item.subtotal} readOnly />
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    <div className="flex justify-center space-x-1">
                                                        {data.purchase_items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProductRow(index)}
                                                                className="bg-danger hover:bg-danger-hover rounded px-2 py-1 text-white"
                                                            >
                                                                &minus;
                                                            </button>
                                                        )}
                                                        {index === data.purchase_items.length - 1 && (
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

                        {/* Payment Info Section */}
                        <div className="mt-8 space-y-4 border-t pt-4">
                            <h2 className="text-lg font-semibold">{t('purchase-payment-info-header')}</h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Payment Mode */}
                                <div className="col-span-1">
                                    <label className="text-foreground block text-sm font-medium">{t('purchase-payment-mode-label')}</label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={data.received_mode_id}
                                        onChange={(e) => {
                                            const modeId = e.target.value;
                                            setData('received_mode_id', modeId);

                                            const selectedMode = receivedModes.find((m) => m.id == Number(modeId));
                                            if (selectedMode?.ledger_id) {
                                                fetchBalance(selectedMode.ledger_id.toString(), 'payment');
                                            } else {
                                                setPaymentLedgerBalance(null);
                                            }
                                        }}
                                    >
                                        <option value="">{t('purchase-select-payment-mode')}</option>
                                        {receivedModes.map((mode) => (
                                            <option key={mode.id} value={mode.id}>
                                                {mode.mode_name}
                                            </option>
                                        ))}
                                    </select>
                                    {paymentLedgerBalance !== null && (
                                        <div className="text-foreground mt-1 w-full text-xs">
                                            {t('purchase-payment-balance')}: {Number(paymentLedgerBalance).toFixed(2)}
                                        </div>
                                    )}
                                </div>

                                {/* Amount Paid */}
                                <div className="col-span-1">
                                    <label className="text-foreground block text-sm font-medium">{t('purchase-amount-paid-label')}</label>
                                    <input
                                        type="number"
                                        className="w-full rounded border p-2"
                                        placeholder={t('purchase-amount-paid-placeholder')}
                                        value={data.amount_paid}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (parseFloat(val) > grandTotal) {
                                                setData('amount_paid', grandTotal.toString());
                                            } else {
                                                setData('amount_paid', val);
                                            }
                                        }}
                                    />
                                </div>

                                {/* Remaining Due */}
                                <div className="col-span-1 text-xs text-red-600 sm:col-span-2 lg:col-span-3">
                                    <label className="text-foreground block text-sm font-medium">{t('purchase-remaining-due-label')}</label>
                                    <div>{remainingDue.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                        <hr />

                        {/* Totals Section */}
                        <div className="mt-6">
                            <div className="grid-cols- grid gap-6 md:grid-cols-3">
                                <div className="bg-text-foreground flex justify-between rounded border p-3 shadow-sm">
                                    <span className="text-foreground font-semibold">{t('purchase-item-qty-total')}:</span>
                                    <span className="font-semibold">
                                        {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)}
                                    </span>
                                </div>
                                <div className="bg-text-foreground flex justify-between rounded border p-3 shadow-sm">
                                    <span className="text-foreground font-semibold">{t('purchase-total-discount')}:</span>
                                    <span className="font-semibold">
                                        {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0)}
                                    </span>
                                </div>
                                <div className="bg-text-foreground flex justify-between rounded border p-3 shadow-sm">
                                    <span className="text-foreground font-semibold">{t('purchase-total-amount')}:</span>
                                    <span className="font-semibold">
                                        {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Delivered To */}
                        <div className="col-span-2 grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2">
                            {/* using this for supplier info and shipping details */}
                            <div>
                                <label className="text-foreground mb-1 block font-semibold">{t('purchase-supplier-info-label')}</label>
                                <textarea
                                    className="bg-background/80 w-full rounded border p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    value={data.delivered_to || ''}
                                    onChange={(e) => setData('delivered_to', e.target.value)}
                                ></textarea>
                            </div>
                            <div className="">
                                <label className="text-foreground mb-1 block font-semibold">{t('purchase-shipping-details-label')}</label>
                                <textarea
                                    className="bg-background w-full rounded border p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    value={data.shipping_details || ''}
                                    onChange={(e) => setData('shipping_details', e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <ActionFooter
                            className="w-full justify-end"
                            onSubmit={handleSubmit}
                            cancelHref="/purchases"
                            processing={processing}
                            submitText={processing ? t('purchase-saving-button') : t('purchase-save-button')}
                            // saveAndPrintText="Save & Print"
                            cancelText={t('purchase-cancel-button')}
                        />
                    </form>
                    {/* Ledger Modal */}
                    {showLedgerModal && (
                        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                            <div className="bg-background w-full max-w-md rounded p-6 shadow-lg">
                                <h2 className="text-foreground mb-4 text-lg font-semibold">{t('purchase-create-ledger-modal-title')}</h2>

                                <input
                                    type="text"
                                    placeholder={t('purchase-ledger-name-placeholder')}
                                    className="mb-3 w-full rounded border p-2"
                                    value={newLedgerName}
                                    onChange={(e) => setNewLedgerName(e.target.value)}
                                />

                                <select className="mb-4 w-full rounded border p-2" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)}>
                                    <option value="">{t('purchase-select-group')}</option>
                                    {accountGroups.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex justify-end gap-3">
                                    <button className="rounded bg-gray-400 px-4 py-2 text-white" onClick={() => setShowLedgerModal(false)}>
                                        {t('purchase-cancel-button')}
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
                                                    debit_credit: 'debit', // usually for inventory
                                                    status: 'active',
                                                    ledger_type: 'inventory',
                                                });

                                                // Add new ledger to dropdown and select it
                                                const newLedger = response.data;
                                                setData('inventory_ledger_id', newLedger.id);

                                                setInventoryLedgerOptions((prev) => [...prev, newLedger]);
                                                setNewLedgerName('');
                                                setNewGroupId('');
                                                setShowLedgerModal(false);
                                            } catch (err) {
                                                console.error(err);
                                                alert(t('purchase-create-ledger-error'));
                                            }
                                        }}
                                    >
                                        {t('purchase-create-ledger-confirm')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
