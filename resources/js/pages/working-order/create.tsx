import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

/* ─────────── Types ─────────── */
interface Godown {
    id: number;
    name: string;
}
interface Item {
    id: number;
    item_name: string;
    purchase_price: number;
}
interface Props {
    autoVoucherNo: string;
    products: Item[];
    godowns: Godown[];
}

/* ─────────── Component ─────────── */
const WorkingOrderCreate: React.FC<Props> = ({ autoVoucherNo, products, godowns }) => {
    /* header fields */
    const [date, setDate] = useState('');
    const [referenceNo, setReferenceNo] = useState('');

    /* stock/material rows */
    const [rows, setRows] = useState([{ product_id: '', godown_id: '', quantity: '', purchase_price: '', subtotal: 0 }]);

    /* expense rows */
    const [extras, setExtras] = useState([{ title: '', quantity: '', price: '', total: 0 }]);

    const t = useTranslation();

    /* ───── handlers: stock rows ───── */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        const updated = [...rows];
        updated[idx] = { ...updated[idx], [name]: value };

        if (name === 'quantity' || name === 'purchase_price') {
            const qty = parseFloat(updated[idx].quantity) || 0;
            const price = parseFloat(updated[idx].purchase_price) || 0;
            updated[idx].subtotal = qty * price;
        }
        setRows(updated);
    };

    /* ───── handlers: expense rows ───── */
    const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const { name, value } = e.target;
        const updated = [...extras];
        updated[idx] = { ...updated[idx], [name]: value };

        if (name === 'quantity' || name === 'price') {
            const qty = parseFloat(updated[idx].quantity) || 0;
            const price = parseFloat(updated[idx].price) || 0;
            updated[idx].total = qty * price;
        }
        setExtras(updated);
    };

    /* add / remove rows */
    const addRow = () => setRows([...rows, { product_id: '', godown_id: '', quantity: '', purchase_price: '', subtotal: 0 }]);
    const removeRow = (i: number) => rows.length > 1 && setRows(rows.filter((_, idx) => idx !== i));
    const addExtra = () => setExtras([...extras, { title: '', quantity: '', price: '', total: 0 }]);
    const removeExtra = (i: number) => extras.length > 1 && setExtras(extras.filter((_, idx) => idx !== i));

    /* totals */
    const materialTotal = rows.reduce((t, r) => t + r.subtotal, 0);
    const expenseTotal = extras.reduce((t, r) => t + r.total, 0);
    const grandTotal = materialTotal + expenseTotal;

    /* submit */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const orderData = rows;
        const extrasData = extras;

        console.log({
            date,
            voucher_no: autoVoucherNo,
            reference_no: referenceNo,
            orderData,
            extrasData,
        });

        router.post(route('working-orders.store'), {
            date,
            voucher_no: autoVoucherNo,
            reference_no: referenceNo,
            orderData,
            extrasData,
        });
    };

    /* ─────────── JSX ─────────── */
    return (
        <AppLayout>
            <Head title={t('createWorkingOrderTitle')} />

            <div className="mx-auto h-full w-full">
                <div className="h-full border p-4 md:p-12">
                    <div className="h-full w-full rounded-lg bg-white">
                        {/* Header bar */}

                        <PageHeader
                            title={
                                <>
                                    <h1>{t('createWorkingOrderTitle')}</h1>
                                    <p className="text-xs text-gray-500">{t('addMaterialsExpensesText')}</p>
                                </>
                            }
                            addLinkHref={route('working-orders.index')}
                            addLinkText={
                                <span className="inline-flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {t('backToOrdersText')}
                                </span>
                            }
                        />

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-8 py-5">
                            {/* Header fields */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {/* date */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                        {t('orderDateLabel')} <span className="ml-1 text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full rounded border border-gray-400 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-200"
                                        required
                                    />
                                </div>

                                {/* voucher */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">{t('woVoucherNoHeader')}</label>
                                    <input
                                        type="text"
                                        value={autoVoucherNo}
                                        readOnly
                                        className="w-full cursor-not-allowed rounded border border-gray-400 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-200"
                                    />
                                </div>

                                {/* reference */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">{t('woReferenceNoLabel')}</label>
                                    <input
                                        type="text"
                                        value={referenceNo}
                                        onChange={(e) => setReferenceNo(e.target.value)}
                                        className="w-full rounded border border-gray-400 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-200"
                                        placeholder={t('refPlaceholder')}
                                    />
                                </div>
                            </div>

                            {/* ───── Materials grid ───── */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">{t('materialsStockHeader')}</h3>
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        <PlusCircleIcon className="h-5 w-5" />
                                        {t('addItemText')}
                                    </button>
                                </div>

                                {rows.map((row, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-1 gap-4 rounded border border-gray-100 bg-gray-50 p-4 shadow-md md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12"
                                    >
                                        {/* Product */}
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">{t('woProductLabel')}</label>
                                            <select
                                                name="product_id"
                                                value={row.product_id}
                                                onChange={(e) => handleInputChange(e, idx)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.item_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Godown */}
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">{t('woGodownLabel')}</label>
                                            <select
                                                name="godown_id"
                                                value={row.godown_id}
                                                onChange={(e) => handleInputChange(e, idx)}
                                                className="w-full rounded border px-2 py-1 text-xs"
                                                required
                                            >
                                                <option value="">Select Godown</option>
                                                {godowns.map((g) => (
                                                    <option key={g.id} value={g.id}>
                                                        {g.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">{t('woQtyLabel')}</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={row.quantity}
                                                onChange={(e) => handleInputChange(e, idx)}
                                                className="w-full rounded border px-2 py-1 text-right text-xs"
                                                min="1"
                                                required
                                            />
                                        </div>

                                        {/* Unit Price */}
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">{t('unitPriceLabel')}</label>
                                            <input
                                                type="number"
                                                name="purchase_price"
                                                value={row.purchase_price}
                                                onChange={(e) => handleInputChange(e, idx)}
                                                className="w-full rounded border px-2 py-1 text-right text-xs"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        {/* Subtotal */}
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">{t('woSubtotalHeader')}</label>
                                            <span className="text-sm font-medium text-indigo-600">{row.subtotal.toFixed(2)}</span>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">{t('woActionLabel')}</label>
                                            <button
                                                type="button"
                                                onClick={() => removeRow(idx)}
                                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                                disabled={rows.length === 1}
                                            >
                                                <TrashIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ───── Extra expenses grid ───── */}
                            {/* <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">Additional Expenses</h3>
                                    <button
                                        type="button"
                                        onClick={addExtra}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        <PlusCircleIcon className="h-5 w-5" />
                                        Add Expense
                                    </button>
                                </div>

                                {extras.map((row, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-1 gap-4 rounded border border-gray-100 bg-gray-50 p-4 shadow-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12"
                                    >

                                        <div className="col-span-1 lg:col-span-5">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={row.title}
                                                onChange={(e) => handleExtraChange(e, idx)}
                                                className="w-full rounded border-2 border-black px-2 py-1 text-xs"
                                                placeholder="Expense title"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-1 lg:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Qty</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={row.quantity}
                                                onChange={(e) => handleExtraChange(e, idx)}
                                                className="w-full rounded border-2 border-black px-2 py-1 text-right text-xs"
                                                min="1"
                                            />
                                        </div>

                                        <div className="col-span-1 lg:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={row.price}
                                                onChange={(e) => handleExtraChange(e, idx)}
                                                className="w-full rounded border-2 border-black px-2 py-1 text-right text-xs"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="col-span-1 lg:col-span-2 flex items-center justify-end">
                                            <span className="text-sm font-medium text-indigo-600">{row.total.toFixed(2)}</span>
                                        </div>

                                        <div className="col-span-1 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeExtra(idx)}
                                                className="text-red-500 hover:text-red-700 disabled:opacity-40"
                                                disabled={extras.length === 1}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div> */}

                            {/* ───── Grand total card ───── */}
                            <div className="mt-4 rounded border border-indigo-100 bg-indigo-50 px-4 py-3 shadow">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-800">{t('woTotalAmountHeader')}</span>
                                    <span className="text-lg font-bold text-indigo-700">{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* submit */}
                            <ActionFooter
                                className="justify-end"
                                onSubmit={handleSubmit}
                                cancelHref={route('working-orders.index')}
                                processing={false}
                                submitText={t('saveWorkingOrderText')}
                                cancelText={t('cancelText')}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default WorkingOrderCreate;
