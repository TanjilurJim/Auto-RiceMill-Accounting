import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Select from 'react-select';

interface WorkingOrder {
    id: number;
    voucher_no: string;
    date: string;
    items: {
        item: { item_name: string };
        godown: { name: string };
        quantity: number;
        purchase_price: number;
        subtotal: number;
    }[];
}

interface Item {
    id: number;
    item_name: string;
}

interface Godown {
    id: number;
    name: string;
}

interface Props {
    workingOrders: WorkingOrder[];
    products: Item[];
    godowns: Godown[];
    autoVoucherNo: string;
}

export default function Create({ workingOrders, products, godowns, autoVoucherNo }: Props) {
    const t = useTranslation();

    const [selectedWOId, setSelectedWOId] = useState<number | null>(null);
    const [selectedWO, setSelectedWO] = useState<WorkingOrder | null>(null);
    const [productionDate, setProductionDate] = useState('');
    const [referenceNo, setReferenceNo] = useState('');
    const [note, setNote] = useState('');

    const [rows, setRows] = useState([{ product_id: '', godown_id: '', quantity: '', unit_price: '', total: 0 }]);

    const workingOrderOptions = workingOrders.map((wo) => ({
        value: wo.id,
        label: `${wo.voucher_no} (${wo.date})`,
    }));

    useEffect(() => {
        if (selectedWOId) {
            const selectedWO = workingOrders.find((wo) => wo.id === selectedWOId);
            setSelectedWO(selectedWO || null);

            // Pre-fill the rows with selected items from the working order
            if (selectedWO) {
                const preFilledRows = selectedWO.items.map((item) => ({
                    product_id: item.item.id,
                    godown_id: item.godown.id,
                    quantity: item.quantity,
                    unit_price: item.purchase_price,
                    total: item.subtotal,
                }));
                setRows(preFilledRows);
            }
        } else {
            // Clear the data if no working order is selected
            setRows([{ product_id: '', godown_id: '', quantity: '', unit_price: '', total: 0 }]);
        }
    }, [selectedWOId, workingOrders]);

    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        const updated = [...rows];
        updated[idx] = { ...updated[idx], [name]: value };

        const qty = parseFloat(updated[idx].quantity) || 0;
        const price = parseFloat(updated[idx].unit_price) || 0;
        updated[idx].total = qty * price;

        setRows(updated);
    };

    const addRow = () => setRows([...rows, { product_id: '', godown_id: '', quantity: '', unit_price: '', total: 0 }]);

    const removeRow = (idx: number) => rows.length > 1 && setRows(rows.filter((_, i) => i !== idx));

    const itemTotal = rows.reduce((total, row) => {
        const rowTotal = parseFloat(row.total) || 0; // Ensuring total is always a number
        return total + rowTotal;
    }, 0);

    // Ensure itemTotal is a valid number before rendering
    const validItemTotal = isNaN(itemTotal) ? 0 : itemTotal;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(route('finished-products.store'), {
            working_order_id: selectedWOId,
            production_date: productionDate,
            production_voucher_no: autoVoucherNo,
            reference_no: referenceNo,
            remarks: note,
            productRows: rows,
        });
    };

    return (
        <AppLayout>
            <Head title={t('fp-add-finished-product')} />

            <div className="mx-auto border p-4 md:p-12">
                <div className="h-full rounded-lg bg-background">
                    <PageHeader title={t('fp-add-finished-product')} addLinkHref="/finished-products" addLinkText={t('fp-back')} />

                    {/* Working Order Selection */}
                    <div className="rounded border bg-background p-6 shadow-md">
                        <h2 className="mb-4 text-lg font-bold">{t('fp-select-working-order')}</h2>
                        <Select
                            options={workingOrderOptions}
                            onChange={(option) => setSelectedWOId(option?.value || null)}
                            placeholder={t('fp-search-working-order')}
                            isClearable
                        />

                        {selectedWO && (
                            <div className="mt-6 border-t pt-4">
                                <h3 className="text-md mb-2 font-semibold">{t('fp-materials-used')}</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    {selectedWO?.items?.length ? (
                                        selectedWO.items.map((i, idx) => (
                                            <li key={idx}>
                                                {i.item?.item_name} from {i.godown?.name} — {t('fp-qty')}: {i.quantity} @ {i.purchase_price} ={' '}
                                                {i.subtotal}
                                            </li>
                                        ))
                                    ) : (
                                        <li>{t('fp-no-material-items')}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Production Entry Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 rounded border bg-background p-6 shadow-md">
                        <h2 className="mb-2 text-lg font-bold">{t('fp-add-production')}</h2>

                        {/* Header Fields */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700">{t('fp-date')}</label>
                                <input
                                    type="date"
                                    value={productionDate}
                                    onChange={(e) => setProductionDate(e.target.value)}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">{t('fp-voucher-no')}</label>
                                <input
                                    type="text"
                                    value={autoVoucherNo}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded border bg-gray-100 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">{t('fp-reference-no')}</label>
                                <input
                                    type="text"
                                    value={referenceNo}
                                    onChange={(e) => setReferenceNo(e.target.value)}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Dynamic Product Rows */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800">{t('fp-production-output')}</h3>
                                <button type="button" onClick={addRow} className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                                    <PlusCircleIcon className="h-5 w-5" />
                                    {t('fp-add-row')}
                                </button>
                            </div>

                            {rows.map((row, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-1 items-center gap-4 rounded bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12"
                                >
                                    {/* Item */}
                                    <div className="col-span-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">{t('fp-item')}</label>
                                        <select
                                            name="product_id"
                                            value={row.product_id}
                                            onChange={(e) => handleRowChange(e, idx)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                            required
                                        >
                                            <option value="">{t('fp-select-product')}</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.item_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Godown */}
                                    <div className="col-span-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">{t('fp-godown')}</label>
                                        <select
                                            name="godown_id"
                                            value={row.godown_id}
                                            onChange={(e) => handleRowChange(e, idx)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                            required
                                        >
                                            <option value="">{t('fp-select-godown')}</option>
                                            {godowns.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    {g.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">{t('fp-quantity')}</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={row.quantity}
                                            onChange={(e) => handleRowChange(e, idx)}
                                            className="w-full rounded border px-2 py-1 text-right text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">{t('fp-price')}</label>
                                        <input
                                            type="number"
                                            name="unit_price"
                                            value={row.unit_price}
                                            onChange={(e) => handleRowChange(e, idx)}
                                            className="w-full rounded border px-2 py-1 text-right text-sm"
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">{t('fp-subtotal')}</label>
                                        <span className="text-sm font-medium text-indigo-600">{Number(row.total || 0).toFixed(2)}</span>
                                    </div>

                                    {/* Remove Button */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">{t('fp-action')}</label>
                                        <button
                                            type="button"
                                            onClick={() => removeRow(idx)}
                                            disabled={rows.length === 1}
                                            className="text-danger hover:text-danger-hover"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="flex items-center justify-between border-t pt-2 text-sm font-medium text-gray-800">
                            <span>
                                {t('fp-total-items')}: {rows.length}
                            </span>
                            <span>
                                {t('fp-total-amount')}: {isNaN(itemTotal) ? '0.00' : itemTotal.toFixed(2)}
                            </span>
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('fp-note')}</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm"
                                rows={3}
                                placeholder={t('fp-note-placeholder')}
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <ActionFooter
                            className="justify-end"
                            onSubmit={handleSubmit}
                            cancelHref="/finished-products"
                            processing={false}
                            submitText={t('fp-save-finished-product')}
                            cancelText={t('fp-cancel')}
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
