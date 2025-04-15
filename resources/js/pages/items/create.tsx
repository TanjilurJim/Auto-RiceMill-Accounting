// resources/js/pages/items/create.tsx
import Button from '@/components/Btn&Link/Button';
import CancelLink from '@/components/Btn&Link/CancelLink';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

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

export default function ItemCreate({ categories, units, godowns }: { categories: Category[]; units: Unit[]; godowns: Godown[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        item_name: '',
        unit_id: '',
        category_id: '',
        godown_id: '',
        purchase_price: '',
        sale_price: '',
        previous_stock: '',
        total_previous_stock_value: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/items');
    };

    return (
        <AppLayout>
            <Head title="Create Item" />
            <div className="bg-gray-100 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Add New Item</h1>
                    {/* <Link href="/items" className="rounded border bg-gray-300 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        Back
                    </Link> */}
                    <CancelLink href="/items" children="Back"/>
                </div>
                <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded bg-white p-6 shadow-md">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-medium">Item Name</label>
                            <input
                                type="text"
                                value={data.item_name}
                                onChange={(e) => setData('item_name', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
                            />
                            {errors.item_name && <p className="text-sm text-red-500">{errors.item_name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Unit</label>
                            <select
                                value={data.unit_id}
                                onChange={(e) => setData('unit_id', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
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
                            <label className="mb-1 block font-medium">Category</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
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
                            <label className="mb-1 block font-medium">Purchase Price</label>
                            <input
                                type="number"
                                value={data.purchase_price}
                                onChange={(e) => setData('purchase_price', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
                            />
                            {errors.purchase_price && <p className="text-sm text-red-500">{errors.purchase_price}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Sales Price</label>
                            <input
                                type="number"
                                value={data.sale_price}
                                onChange={(e) => setData('sale_price', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
                            />
                            {errors.sale_price && <p className="text-sm text-red-500">{errors.sale_price}</p>}
                        </div>
                    </div>

                    {/* Separator */}
                    <hr className="my-6" />

                    {/* 🔵 Previous Stock Section */}
                    <h3 className="mb-3 text-lg font-semibold">Previous Stock Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-medium">Godown Name</label>
                            <select
                                value={data.godown_id}
                                onChange={(e) => setData('godown_id', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
                            >
                                <option value="">Select Godown</option>
                                {godowns.length > 0 ? (
                                    godowns.map((godown) => (
                                        <option key={godown.id} value={godown.id}>
                                            {godown.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        No Godowns Available
                                    </option>
                                )}
                            </select>
                            {errors.godown_id && <p className="text-sm text-red-500">{errors.godown_id}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Previous Stock</label>
                            <input
                                type="number"
                                value={data.previous_stock}
                                onChange={(e) => setData('previous_stock', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
                            />
                            {errors.previous_stock && <p className="text-sm text-red-500">{errors.previous_stock}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Total Previous Stock Value</label>
                            <input
                                type="number"
                                value={data.total_previous_stock_value}
                                onChange={(e) => setData('total_previous_stock_value', e.target.value)}
                                className="w-full rounded border border-b-2 border-black p-2"
                            />
                            {errors.total_previous_stock_value && <p className="text-sm text-red-500">{errors.total_previous_stock_value}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Description of the item..."
                            className="w-full rounded border border-b-2 border-black p-2"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        {/* <Link href="/items" className="rounded border px-4 py-2 hover:bg-neutral-100">
                            Cancel
                        </Link> */}
                        <CancelLink href="/items" />
                        {/* <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Item'}
                        </button> */}
                        <Button 
                            processing={processing}
                            children={processing ? 'Creating...' : 'Create Item'}
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
