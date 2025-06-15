import React from 'react';
import ActionFooter from '@/components/ActionFooter';

interface ItemFormProps {
    data: {
        item_name: string;
        unit_id: string | number;
        category_id: string | number;
        godown_id: string | number;
        purchase_price: string | number;
        sale_price: string | number;
        previous_stock: string | number;
        total_previous_stock_value: string | number;
        description: string;
    };
    setData: (key: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Record<string, string>;
    submitText: string;
    cancelHref: string;
    categories: { id: number; name: string }[];
    units: { id: number; name: string }[];
    godowns: { id: number; name: string }[];
}

const ItemForm: React.FC<ItemFormProps> = ({
    data,
    setData,
    handleSubmit,
    processing,
    errors,
    submitText,
    cancelHref,
    categories,
    units,
    godowns,
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded border">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Item Name */}
                <div>
                    <label className="mb-1 block font-medium">Item Name</label>
                    <input
                        type="text"
                        value={data.item_name}
                        onChange={(e) => setData('item_name', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.item_name && <p className="text-sm text-red-500">{errors.item_name}</p>}
                </div>

                {/* Unit */}
                <div>
                    <label className="mb-1 block font-medium">Unit</label>
                    <select
                        value={data.unit_id}
                        onChange={(e) => setData('unit_id', e.target.value)}
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

                {/* Category */}
                <div>
                    <label className="mb-1 block font-medium">Category</label>
                    <select
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
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

                {/* Purchase Price */}
                <div>
                    <label className="mb-1 block font-medium">Purchase Price/ Price</label>
                    <input
                        type="number"
                        value={data.purchase_price}
                        onChange={(e) => setData('purchase_price', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.purchase_price && <p className="text-sm text-red-500">{errors.purchase_price}</p>}
                </div>

                {/* Sales Price */}
                <div>
                    <label className="mb-1 block font-medium">Sales Price</label>
                    <input
                        type="number"
                        value={data.sale_price}
                        onChange={(e) => setData('sale_price', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.sale_price && <p className="text-sm text-red-500">{errors.sale_price}</p>}
                </div>
            </div>

            {/* Previous Stock Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block font-medium">Godown</label>
                    <select
                        value={data.godown_id}
                        onChange={(e) => setData('godown_id', e.target.value)}
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

                <div>
                    <label className="mb-1 block font-medium">Previous Stock</label>
                    <input
                        type="number"
                        value={data.previous_stock}
                        onChange={(e) => setData('previous_stock', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.previous_stock && <p className="text-sm text-red-500">{errors.previous_stock}</p>}
                </div>

                <div>
                    <label className="mb-1 block font-medium">Total Previous Stock Value</label>
                    <input
                        type="number"
                        value={data.total_previous_stock_value}
                        onChange={(e) => setData('total_previous_stock_value', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.total_previous_stock_value && <p className="text-sm text-red-500">{errors.total_previous_stock_value}</p>}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="mb-1 block font-medium">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full rounded border p-2"
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Action Footer */}
            <ActionFooter
                onSubmit={handleSubmit}
                cancelHref={cancelHref}
                processing={processing}
                submitText={submitText}
                cancelText="Cancel"
            />
        </form>
    );
};

export default ItemForm;