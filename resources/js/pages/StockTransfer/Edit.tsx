import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/PageHeader';
import ActionFooter from '@/components/ActionFooter';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Edit({ stockTransfer, godowns, items, stocks, errors }) {
    const { data, setData, put, processing } = useForm({
        date: stockTransfer.date,
        voucher_no: stockTransfer.voucher_no,
        reference_no: stockTransfer.reference_no || '',
        from_godown_id: stockTransfer.from_godown_id,
        to_godown_id: stockTransfer.to_godown_id,
        products: stockTransfer.items.map((i) => ({
            item_id: i.item_id,
            quantity: i.quantity,
            rate: i.rate,
            amount: parseFloat(i.quantity) * parseFloat(i.rate),
        })),
        note: stockTransfer.note || '',
    });

    const [products, setProducts] = useState(data.products);
    const [filteredStocks, setFilteredStocks] = useState([]);

    useEffect(() => {
        if (data.from_godown_id) {
            const godownStocks = stocks.filter((s) => s.godown_id == data.from_godown_id);
            setFilteredStocks(godownStocks);
        } else {
            setFilteredStocks([]);
        }
    }, [data.from_godown_id, stocks]);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleProductChange = (index, field, value) => {
        const updated = [...products];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'quantity' || field === 'rate') {
            const qty = parseFloat(updated[index].quantity) || 0;
            const rate = parseFloat(updated[index].rate) || 0;
            updated[index].amount = qty * rate;
        }

        setProducts(updated);
        setData('products', updated);
    };

    const addProduct = () => {
        const updated = [...products, { item_id: '', quantity: '', rate: '', amount: 0 }];
        setProducts(updated);
        setData('products', updated);
    };

    const removeProduct = (index) => {
        if (products.length === 1) return;
        const updated = products.filter((_, i) => i !== index);
        setProducts(updated);
        setData('products', updated);
    };

    const getTotalQuantity = () => products.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0);
    const getGrandTotal = () => products.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/stock-transfers/${stockTransfer.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Stock Transfer" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    {/* <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Edit Stock Transfer</h1> */}

                    <PageHeader title='Edit Stock Transfer' addLinkHref='/stock-transfers' addLinkText='Back' />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label>Date</label>
                                <input type="date" name="date" value={data.date} onChange={handleChange} className="w-full rounded border px-3 py-2" />
                                {errors.date && <div className="text-sm text-red-500">{errors.date}</div>}
                            </div>

                            <div>
                                <label>Voucher No</label>
                                <input
                                    type="text"
                                    name="voucher_no"
                                    value={data.voucher_no}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {errors.voucher_no && <div className="text-sm text-red-500">{errors.voucher_no}</div>}
                            </div>

                            <div>
                                <label>From Godown</label>
                                <select
                                    name="from_godown_id"
                                    value={data.from_godown_id}
                                    onChange={handleChange}
                                    className="w-full rounded border px-3 py-2"
                                >
                                    <option value="">Select</option>
                                    {godowns.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.from_godown_id && <div className="text-sm text-red-500">{errors.from_godown_id}</div>}
                            </div>

                            <div>
                                <label>To Godown</label>
                                <select name="to_godown_id" value={data.to_godown_id} onChange={handleChange} className="w-full rounded border px-3 py-2">
                                    <option value="">Select</option>
                                    {godowns.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.to_godown_id && <div className="text-sm text-red-500">{errors.to_godown_id}</div>}
                            </div>
                        </div>

                        <div>
                            <label>Products</label>
                            {products.map((product, index) => {
                                const stockRow = filteredStocks.find((s) => s.item_id == product.item_id);
                                const item = items.find((i) => i.id == product.item_id);

                                return (
                                    <div key={index} className="mb-3 grid grid-cols-6 gap-2">
                                        <select
                                            className="col-span-2 rounded border px-3 py-2"
                                            value={product.item_id}
                                            onChange={(e) => handleProductChange(index, 'item_id', e.target.value)}
                                        >
                                            <option value="">Select Item</option>
                                            {filteredStocks.map((s) => (
                                                <option key={s.id} value={s.item_id}>
                                                    {s.item?.item_name} ({s.qty} in stock)
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="number"
                                            className="rounded border px-3 py-2"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            placeholder="Qty"
                                        />

                                        <input
                                            type="number"
                                            className="rounded border px-3 py-2"
                                            value={product.rate}
                                            onChange={(e) => handleProductChange(index, 'rate', e.target.value)}
                                            placeholder="Rate"
                                        />

                                        <input type="number" readOnly className="rounded border px-3 py-2" value={product.amount} placeholder="Amount" />

                                        <button type="button" onClick={() => removeProduct(index)} className="text-red-500">
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}

                            <button type="button" onClick={addProduct} className="mt-2 text-sm text-blue-600">
                                + Add Product
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <textarea
                                name="note"
                                value={data.note}
                                onChange={handleChange}
                                className="w-full rounded border px-3 py-2"
                                placeholder="Note (optional)"
                            />

                            <div className="space-y-1 text-sm text-gray-700">
                                <div>Total Quantity: {getTotalQuantity()}</div>
                                <div>Grand Total: ৳ {getGrandTotal().toFixed(2)}</div>
                            </div>
                        </div>

                        {/* <div className="pt-4">
            <button type="submit" disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {processing ? 'Updating...' : 'Update Transfer'}
            </button>
          </div> */}

                        <ActionFooter
                            className='justify-end'
                            onSubmit={handleSubmit} // Function to handle form submission
                            cancelHref="/stock-transfers" // URL for the cancel action
                            processing={processing} // Indicates whether the form is processing
                            submitText={processing ? 'Updating...' : 'Update Transfer'} // Text for the submit button
                            cancelText="Cancel" // Text for the cancel button
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
