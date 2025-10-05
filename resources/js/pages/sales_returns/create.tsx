import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface Sale {
    id: number;
    voucher_no: string;
}

interface AccountLedger {
    id: number;
    account_ledger_name: string;
}

interface Product {
    id: number;
    item_name: string;
}

interface ReceivedMode {
    id: number;
    mode_name: string;
}

interface Godown {
    id: number;
    name: string;
}

interface Salesman {
    id: number;
    name: string;
}

interface AccountGroup {
    id: number;
    name: string;
}

interface SalesReturnItem {
    product_id: string;
    qty: string;
    main_price: string;
    discount: string;
    return_amount: string;
    max_qty: number;
}

interface SaleItem {
    product_id: string;
    qty: string;
    max_qty: number;
    main_price: string;
    discount?: string;
}

export default function SalesReturnCreate({
    sales,
    ledgers,
    products,
    godowns,
    salesmen,
    voucher,
    receivedModes,
    accountGroups = [],
}: {
    sales: Sale[];
    ledgers: AccountLedger[];
    products: Product[];
    godowns: Godown[];
    salesmen: Salesman[];
    voucher: string;
    receivedModes: ReceivedMode[];
    accountGroups?: AccountGroup[];
}) {
    const { data, setData, post, processing } = useForm({
        sale_id: '',
        voucher_no: voucher,
        account_ledger_id: '',
        godown_id: '',
        salesman_id: '',
        return_date: '',
        reason: '',
        phone: '',
        address: '',
        shipping_details: '',
        inventory_ledger_id: '',
        cogs_ledger_id: '',
        received_mode_id: '',
        amount_received: '',
        delivered_to: '',
        sales_return_items: [{ product_id: '', qty: '', main_price: '', discount: '', return_amount: '', max_qty: 0 }],
    });

    const t = useTranslation();

    useEffect(() => {
        if (data.sale_id) {
            axios.get(`/sales/${data.sale_id}/load`).then((res) => {
                const sale = res.data;
                setData((prev) => ({
                    ...prev,
                    account_ledger_id: sale.account_ledger_id,
                    godown_id: sale.godown_id,
                    salesman_id: sale.salesman_id,
                    phone: sale.phone || '',
                    address: sale.address || '',
                    inventory_ledger_id: sale.inventory_ledger_id ?? '',
                    cogs_ledger_id: sale.cogs_ledger_id ?? '',
                    received_mode_id: sale.received_mode_id ?? '',
                    amount_received: sale.amount_received ?? '', // or 0
                    sales_return_items: sale.sale_items.map((item: SaleItem) => ({
                        product_id: item.product_id,
                        qty: item.qty,
                        max_qty: item.max_qty, // 💡 include this
                        main_price: item.main_price,
                        discount: item.discount ?? '0',
                        return_amount: (parseFloat(item.qty) * parseFloat(item.main_price) - parseFloat(item.discount ?? '0')).toFixed(2),
                    })),
                }));
            });
        }
    }, [data.sale_id, setData]);

    const calculateTotals = useCallback(() => {
        let totalQty = 0;
        let totalReturnAmount = 0;

        data.sales_return_items.forEach((item) => {
            const qty = parseFloat(item.qty) || 0;
            const price = parseFloat(item.main_price) || 0;
            const discount = parseFloat(item.discount) || 0;
            const amount = qty * price - discount;

            totalQty += qty;
            totalReturnAmount += amount;
        });

        return { totalQty, totalReturnAmount };
    }, [data.sales_return_items]);

    useEffect(() => {
        const refundAmount = calculateTotals().totalReturnAmount;
        setData('amount_received', refundAmount.toFixed(2));
    }, [data.sales_return_items, calculateTotals, setData]);

    const handleItemChange = (index: number, field: keyof SalesReturnItem, value: string | number) => {
        const updatedItems = [...data.sales_return_items];

        // Type-safe assignment
        if (field === 'max_qty') {
            updatedItems[index][field] = Number(value);
        } else {
            updatedItems[index][field] = String(value);
        }

        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].main_price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;

        updatedItems[index].return_amount = (qty * price - discount).toFixed(2);
        setData('sales_return_items', updatedItems);
    };

    const addProductRow = () =>
        setData('sales_return_items', [
            ...data.sales_return_items,
            { product_id: '', qty: '', main_price: '', discount: '', return_amount: '', max_qty: 0 },
        ]);

    const removeProductRow = (index: number) => {
        if (data.sales_return_items.length > 1) {
            const updated = [...data.sales_return_items];
            updated.splice(index, 1);
            setData('sales_return_items', updated);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales-returns');
    };
    const [newLedgerName, setNewLedgerName] = useState('');
    const [newGroupId, setNewGroupId] = useState('');
    const [showInventoryLedgerModal, setShowInventoryLedgerModal] = useState(false);
    const [modalTargetField, setModalTargetField] = useState<'inventory' | 'cogs'>('inventory');

    return (
        <AppLayout>
            <Head title={t('createSalesReturnTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg">
                    {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Create Sales Return</h1>
                    <Link href="/sales-returns" className="rounded bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400">
                        Back
                    </Link>
                </div> */}

                    <PageHeader title={t('createSalesReturnTitle')} addLinkHref="/sales-returns" addLinkText={t('backText')} />

                    <form onSubmit={handleSubmit} className="bg-background space-y-6 rounded p-6 shadow-md">
                        {/* Top Info */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('voucherNoLabel')}</label>
                                <input type="text" className="bg-background w-full rounded border p-2" value={data.voucher_no} readOnly />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('relatedSaleLabel')}</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.sale_id}
                                    onChange={(e) => setData('sale_id', e.target.value)}
                                >
                                    <option value="">{t('selectSaleOption')}</option>
                                    {sales.map((sale) => (
                                        <option key={sale.id} value={sale.id}>
                                            {sale.voucher_no}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Account Ledger  */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('accountLedgerLabel')}</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.account_ledger_id}
                                    onChange={(e) => setData('account_ledger_id', e.target.value)}
                                >
                                    <option value="">{t('selectLedgerOption')}</option>
                                    {ledgers.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.account_ledger_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Inventory Ledger */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('inventoryLedgerLabel')}</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.inventory_ledger_id}
                                    onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                                >
                                    <option value="">{t('selectInventoryLedgerOption')}</option>
                                    {ledgers.map((ledger) => (
                                        <option key={ledger.id} value={ledger.id}>
                                            {ledger.account_ledger_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-sm text-gray-500">
                                    {t('dontSeeOne')} {' '}
                                    <button
                                        type="button"
                                        className="text-blue-600 underline"
                                        onClick={() => {
                                            setModalTargetField('inventory');
                                            setShowInventoryLedgerModal(true);
                                        }}
                                    >
                                        {t('create')}
                                    </button>
                                </div>
                            </div>

                            {/* COGS Ledger */}

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('cogsLedgerLabel')}</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.cogs_ledger_id || ''}
                                    onChange={(e) => setData('cogs_ledger_id', e.target.value)}
                                >
                                    <option value="">{t('selectCogsLedgerOption')}</option>
                                    {ledgers.map((ledger) => (
                                        <option key={ledger.id} value={ledger.id}>
                                            {ledger.account_ledger_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-sm text-gray-500">
                                    {t('dontSeeOne')} {' '}
                                    <button
                                        type="button"
                                        className="text-blue-600 underline"
                                        onClick={() => {
                                            setModalTargetField('cogs');
                                            setShowInventoryLedgerModal(true);
                                        }}
                                    >
                                        {t('create')}
                                    </button>
                                </div>
                            </div>

                            {/* Refund Mode  */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('refundModeLabel')}</label>
                                <select
                                    className="w-full border p-2"
                                    value={data.received_mode_id}
                                    onChange={(e) => setData('received_mode_id', e.target.value)}
                                >
                                    <option value="">{t('selectModeOption')}</option>
                                    {receivedModes.map((mode) => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.mode_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('refundAmountLabel')}</label>
                                <input
                                    type="number"
                                    className="w-full border p-2"
                                    value={data.amount_received}
                                    onChange={(e) => setData('amount_received', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('godownLabel')}</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.godown_id}
                                    onChange={(e) => setData('godown_id', e.target.value)}
                                >
                                    <option value="">{t('selectGodownOption')}</option>
                                    {godowns.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('salesmanLabel')}</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.salesman_id}
                                    onChange={(e) => setData('salesman_id', e.target.value)}
                                >
                                    <option value="">{t('selectSalesmanOption')}</option>
                                    {salesmen.map((sm) => (
                                        <option key={sm.id} value={sm.id}>
                                            {sm.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputCalendar
                                    value={data.return_date}
                                    onChange={(val) => setData('return_date', val)}
                                    label={t('returnDateLabel')}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('phoneLabel')}</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium">{t('addressLabel')}</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Product Section */}
                        <div>
                            <h2 className="mb-2 text-lg font-semibold">{t('returnedProductsLabel')}</h2>

                            {data.sales_return_items.map((item, index) => (
                                <div key={index} className="mb-3 grid grid-cols-12 items-end gap-2">
                                    {/* Product Selector */}
                                    <div className="col-span-3">
                                        <label className="mb-1 block text-sm font-medium">{t('productLabel')}</label>
                                        <select
                                            className="w-full rounded border p-2"
                                            value={item.product_id}
                                            onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                        >
                                            <option value="">{t('selectProductOption')}</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.item_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-1">
                                        <label className="mb-1 block text-sm font-medium">{t('qtyLabel')}</label>
                                        <input
                                            type="number"
                                            max={item.max_qty}
                                            className="w-full rounded border p-2"
                                            value={item.qty}
                                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2">
                                        <label className="mb-1 block text-sm font-medium">{t('priceLabel')}</label>
                                        <input
                                            type="number"
                                            placeholder={t('pricePlaceholder')}
                                            className="w-full rounded border p-2"
                                            value={item.main_price}
                                            onChange={(e) => handleItemChange(index, 'main_price', e.target.value)}
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div className="col-span-2">
                                        <label className="mb-1 block text-sm font-medium">{t('discountLabel')}</label>
                                        <input
                                            type="number"
                                            placeholder={t('discountPlaceholder')}
                                            className="w-full rounded border p-2"
                                            value={item.discount}
                                            onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                        />
                                    </div>

                                    {/* Subtotal */}
                                    <div className="col-span-2">
                                        <label className="mb-1 block text-sm font-medium">{t('subtotalLabel')}</label>
                                        <input
                                            type="number"
                                            placeholder={t('subtotalPlaceholder')}
                                            className="w-full rounded border bg-background p-2"
                                            value={item.return_amount}
                                            readOnly
                                        />
                                    </div>

                                    {/* Buttons for Adding and Removing Rows */}
                                    <div className="col-span-1 flex gap-1">
                                        {data.sales_return_items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeProductRow(index)}
                                                className="bg-danger hover:bg-danger-hover rounded px-3 py-1 text-white"
                                            >
                                                &minus;
                                            </button>
                                        )}
                                        {index === data.sales_return_items.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addProductRow}
                                                className="bg-primary hover:bg-primary-hover rounded px-3 py-1 text-white"
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Info */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('shippingDetailsLabel')}</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.shipping_details}
                                    onChange={(e) => setData('shipping_details', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('deliveredToLabel')}</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.delivered_to}
                                    onChange={(e) => setData('delivered_to', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">{t('returnReasonLabel')}</label>
                            <textarea className="w-full rounded border p-2" value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                        </div>

                        {/* Submit */}
                        {/* <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
                        >
                            {processing ? 'Saving...' : 'Save Sales Return'}
                        </button>
                    </div> */}

                        <ActionFooter
                            className="w-full justify-end"
                            onSubmit={handleSubmit} // Function to handle form submission
                            cancelHref="/sales-returns" // URL for the cancel action
                            processing={processing} // Indicates whether the form is processing
                            submitText={processing ? t('savingText') : t('fySaveButton')} // Text for the submit button
                            cancelText={t('cancelText')} // Text for the cancel button
                        />
                    </form>
                </div>
            </div>
            {showInventoryLedgerModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded bg-background p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-700">{t('createNewLedgerHeader')}</h2>

                        <input
                            type="text"
                            placeholder={t('ledgerNamePlaceholder')}
                            className="mb-3 w-full rounded border p-2"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                        />

                        <select className="mb-4 w-full rounded border p-2" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)}>
                            <option value="">{t('selectGroupOption')}</option>
                            {/* Assuming you pass `accountGroups` from backend */}
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

                                        if (modalTargetField === 'inventory') {
                                            setData('inventory_ledger_id', newLedger.id);
                                        } else {
                                            setData('cogs_ledger_id', newLedger.id);
                                        }

                                        setNewLedgerName('');
                                        setNewGroupId('');
                                        setShowInventoryLedgerModal(false);
                                    } catch (error) {
                                        console.error('Failed to create ledger:', error);
                                        alert('Failed to create ledger');
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
