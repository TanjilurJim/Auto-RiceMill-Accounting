import ActionFooter from '@/components/ActionFooter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import React, { useEffect } from 'react';
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
    useEffect(() => {
        const rate = Number(data.purchase_price) || 0;
        const qty = Number(data.previous_stock) || 0;
        setData('total_previous_stock_value', rate * qty);
    }, [data.purchase_price, data.previous_stock]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded border bg-white p-6">
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
                    <select value={data.unit_id} onChange={(e) => setData('unit_id', e.target.value)} className="w-full rounded border p-2">
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
                    <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="w-full rounded border p-2">
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
                    <label className="mb-1 block font-medium">Godown</label>
                    <select value={data.godown_id} onChange={(e) => setData('godown_id', e.target.value)} className="w-full rounded border p-2">
                        <option value="">Select Godown</option>
                        {godowns.map((godown) => (
                            <option key={godown.id} value={godown.id}>
                                {godown.name}
                            </option>
                        ))}
                    </select>
                    {errors.godown_id && <p className="text-sm text-red-500">{errors.godown_id}</p>}
                </div>

                {/* Purchase Price */}
                <div>
                    <label className="mb-1 block flex items-center gap-1 font-medium">
                        Rate/Price
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 cursor-pointer text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm">
                                    Use production cost if self-manufactured, otherwise use purchase price
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </label>

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
                    <label className="mb-1 block font-medium">Stock</label>
                    <input
                        type="number"
                        value={data.previous_stock}
                        onChange={(e) => setData('previous_stock', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.previous_stock && <p className="text-sm text-red-500">{errors.previous_stock}</p>}
                </div>

                <div>
                    <label className="mb-1 block font-medium">Stock Value</label>
                    <input
                        type="number"
                        value={data.total_previous_stock_value}
                        onChange={(e) => setData('total_previous_stock_value', e.target.value)}
                        className="w-full cursor-not-allowed rounded border p-2"
                        readOnly
                    />
                    {errors.total_previous_stock_value && <p className="text-sm text-red-500">{errors.total_previous_stock_value}</p>}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="mb-1 block font-medium">Description</label>
                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded border p-2" />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Action Footer */}
            <ActionFooter onSubmit={handleSubmit} cancelHref={cancelHref} processing={processing} submitText={submitText} cancelText="Cancel" />
        </form>
    );
};

export default ItemForm;
