// resources/js/pages/items/edit.tsx
import Button from '@/components/Btn&Link/Button';
import CancelLink from '@/components/Btn&Link/CancelLink';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

interface Item {
    id: number;
    item_name: string;
    item_part: string;
    unit_id: number;
    category_id: number;
    godown_id: number;
    purchase_price: number;
    sales_price: number;
    previous_stock: number;
    total_previous_stock_value: number;
    description?: string;
}

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface Godown {
    id: number;
    name: string;
}

export default function EditItem({
    item,
    categories,
    units,
    godowns,
}: {
    item: Item;
    categories: Category[];
    units: Unit[];
    godowns: Godown[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        item_name: item.item_name,
        item_part: item.item_part,
        category_id: item.category_id,
        unit_id: item.unit_id,
        godown_id: item.godown_id,
        purchase_price: item.purchase_price,
        sales_price: item.sales_price,
        previous_stock: item.previous_stock,
        total_previous_stock_value: item.total_previous_stock_value,
        description: item.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/items/${item.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Item" />
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="mb-4 text-2xl font-bold">Edit Item</h1>
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow dark:bg-neutral-900">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label>Item Name</label>
                            <input
                                type="text"
                                value={data.item_name}
                                onChange={(e) => setData('item_name', e.target.value)}
                                className="w-full rounded border p-2"
                            />
                            {errors.item_name && <p className="text-sm text-red-500">{errors.item_name}</p>}
                        </div>

                        <div>
                            <label>Item Part</label>
                            <input
                                type="text"
                                value={data.item_part}
                                onChange={(e) => setData('item_part', e.target.value)}
                                className="w-full rounded border p-2"
                            />
                            {errors.item_part && <p className="text-sm text-red-500">{errors.item_part}</p>}
                        </div>

                        <div>
                            <label>Category</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', parseInt(e.target.value))}
                                className="w-full rounded border p-2"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                        </div>

                        <div>
                            <label>Unit</label>
                            <select
                                value={data.unit_id}
                                onChange={(e) => setData('unit_id', parseInt(e.target.value))}
                                className="w-full rounded border p-2"
                            >
                                <option value="">Select Unit</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            {errors.unit_id && <p className="text-sm text-red-500">{errors.unit_id}</p>}
                        </div>

                        <div>
                            <label>Godown</label>
                            <select
                                value={data.godown_id}
                                onChange={(e) => setData('godown_id', parseInt(e.target.value))}
                                className="w-full rounded border p-2"
                            >
                                <option value="">Select Godown</option>
                                {godowns.map((godown) => (
                                    <option key={godown.id} value={godown.id}>
                                        {godown.name}
                                    </option>
                                ))}
                            </select>
                            {errors.godown_id && <p className="text-sm text-red-500">{errors.godown_id}</p>}
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label>Purchase Price</label>
                                <input
                                    type="number"
                                    value={data.purchase_price}
                                    onChange={(e) => setData('purchase_price', parseFloat(e.target.value))}
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label>Sales Price</label>
                                <input
                                    type="number"
                                    value={data.sales_price}
                                    onChange={(e) => setData('sales_price', parseFloat(e.target.value))}
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label>Previous Stock</label>
                                <input
                                    type="number"
                                    value={data.previous_stock}
                                    onChange={(e) => setData('previous_stock', parseFloat(e.target.value))}
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label>Previous Stock Value</label>
                                <input
                                    type="number"
                                    value={data.total_previous_stock_value}
                                    onChange={(e) => setData('total_previous_stock_value', parseFloat(e.target.value))}
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label>Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded border p-2"
                            />
                        </div>

                        <div className="flex justify-between">
                            {/* <Link href="/items" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link> */}
                            <CancelLink href="/items" />

                            {/* <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                            >
                                Update
                            </button> */}
                            <Button processing={processing} children={processing ? 'Updating...' : 'Update'}/>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
