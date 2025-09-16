import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
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
        weight: string | number;
        total_weight: string | number;
        description: string;
        lot_no: string; // ← NEW
        received_at: string;
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

    useEffect(() => {
        const qty = Number(data.previous_stock) || 0;
        const w = Number(data.weight) || 0;
        const total = qty * w;
        setData('total_weight', Number.isFinite(total) ? total : 0);
    }, [data.previous_stock, data.weight]);

    return (
        <form onSubmit={handleSubmit} className="bg-background space-y-4 rounded border p-6">
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
                    <label className="mb-1 block font-medium">Unittttt</label>
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

                {/* Godown */}
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
                {/* Lot No */}
                <div>
                    <label className="mb-1 block font-medium">
                        Lot / Batch&nbsp;No
                        <span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.lot_no}
                        onChange={(e) => setData('lot_no', e.target.value)}
                        className="w-full rounded border p-2"
                        placeholder="e.g. OPEN-STK-01"
                    />
                    {errors.lot_no && <p className="text-sm text-red-500">{errors.lot_no}</p>}
                </div>

                {/* Received-at */}
                <div className='mt-3'>
                    <InputCalendar value={data.received_at} onChange={(val) => setData('received_at', val)} label="Received Date" required />
                    {errors.received_at && <p className="text-sm text-red-500">{errors.received_at}</p>}
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

                {/* 🆕 Weight per Unit */}
                <div>
                    <label className="mb-1 block flex items-center gap-1 font-medium">
                        Weight per Unit (Bag)
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 cursor-pointer text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm">
                                    If unit is a bag/sack, enter weight per bag in kg. If the unit itself is kg, you can set this to 1.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </label>
                    <input
                        type="number"
                        value={data.weight}
                        onChange={(e) => setData('weight', e.target.value)}
                        className="w-full rounded border p-2"
                        placeholder="e.g. 50"
                        min="0"
                        step="any"
                    />
                    {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                </div>

                {/* Sales Price */}
                {/* <div>
                    <label className="mb-1 block font-medium">Sales Price</label>
                    <input
                        type="number"
                        value={data.sale_price}
                        onChange={(e) => setData('sale_price', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    {errors.sale_price && <p className="text-sm text-red-500">{errors.sale_price}</p>}
                </div> */}
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
            <div>
                <label className="mb-1 block font-medium">Total Weight (kg)</label>
                <input
                    type="number"
                    value={data.total_weight}
                    onChange={(e) => setData('total_weight', e.target.value)}
                    className="w-full cursor-not-allowed rounded border p-2"
                    readOnly
                />
                {errors.total_weight && <p className="text-sm text-red-500">{errors.total_weight}</p>}
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
