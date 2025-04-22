import React from 'react';
import ActionFooter from '@/components/ActionFooter';

interface PurchaseItem {
    product_id: number | string;
    qty: number | string;
    price: number | string;
    discount: number | string;
    discount_type: 'bdt' | 'percent';
    subtotal: number | string;
}

interface PurchaseFormProps {
    data: {
        date: any;
        voucher_no: string;
        godown_id: number | string;
        salesman_id: number | string;
        account_ledger_id: number | string;
        inventory_ledger_id: number | string;
        phone: string;
        address: string;
        shipping_details?: string;
        delivered_to?: string;
        purchase_items: PurchaseItem[];
        received_mode_id: number | string;
        amount_paid: number | string;
    };
    setData: (key: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleItemChange: (index: number, field: string, value: any) => void;
    addProductRow: () => void;
    removeProductRow: (index: number) => void;
    processing: boolean;
    errors: Record<string, string>;
    godowns: { id: number; name: string }[];
    salesmen: { id: number; name: string }[];
    ledgers: { id: number; account_ledger_name: string }[];
    inventoryLedgers: { id: number; account_ledger_name: string }[];
    receivedModes: { id: number; mode_name: string }[];
    godownItems: { item: { id: number; item_name: string }; qty: number }[];
    totalQty: number;
    totalDisc: number;
    grandTotal: number;
    submitText: string;
    cancelHref: string;
    showLedgerModal: boolean;
    setShowLedgerModal: (value: boolean) => void;
    newLedgerName: string;
    setNewLedgerName: (value: string) => void;
    newGroupId: string;
    setNewGroupId: (value: string) => void;
    accountGroups: { id: number; name: string }[];
    createLedger: () => Promise<void>;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({
    data,
    setData,
    handleSubmit,
    handleItemChange,
    addProductRow,
    removeProductRow,
    processing,
    errors,
    godowns,
    salesmen,
    ledgers,
    inventoryLedgers,
    receivedModes,
    godownItems,
    totalQty,
    totalDisc,
    grandTotal,
    submitText,
    cancelHref,
    showLedgerModal,
    setShowLedgerModal,
    newLedgerName,
    setNewLedgerName,
    newGroupId,
    setNewGroupId,
    accountGroups,
    createLedger,
}) => {
    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow-md">
                {/* Section 1 - Purchase Info */}
                <div className="space-y-4">
                    <h2 className="border-b pb-1 text-lg font-semibold">Purchase Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            type="date"
                            className={`border p-2 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                        />
                        <input
                            type="text"
                            className="border p-2"
                            placeholder="Voucher No"
                            value={data.voucher_no}
                            readOnly
                        />
                        <select
                            name="godown_id"
                            className={`border p-2 ${errors.godown_id ? 'border-red-500' : 'border-gray-300'}`}
                            value={data.godown_id}
                            onChange={(e) => setData('godown_id', e.target.value)}
                        >
                            <option value="">Select Godown</option>
                            {godowns.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border p-2"
                            value={data.salesman_id}
                            onChange={(e) => setData('salesman_id', e.target.value)}
                        >
                            <option value="">Select Salesman</option>
                            {salesmen.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border p-2"
                            value={data.account_ledger_id}
                            onChange={(e) => setData('account_ledger_id', e.target.value)}
                        >
                            <option value="">Select Party Ledger</option>
                            {ledgers.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.account_ledger_name}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2">
                            <select
                                className="border p-2"
                                value={data.inventory_ledger_id}
                                onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                            >
                                <option value="">Select Inventory Ledger</option>
                                {inventoryLedgers.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.account_ledger_name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="rounded bg-blue-500 px-2 py-1 text-white"
                                onClick={() => setShowLedgerModal(true)}
                            >
                                + Create New Ledger
                            </button>
                        </div>
                        <input
                            type="text"
                            className="border p-2"
                            placeholder="Phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <input
                            type="text"
                            className="border p-2"
                            placeholder="Address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                    </div>
                </div>

                {/* Section 2 - Product Table */}
                <div>
                    <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Products</h2>
                    <div className="overflow-x-auto rounded border">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50 text-sm">
                                <tr>
                                    <th className="border px-2 py-1">Product</th>
                                    <th className="border px-2 py-1">Qty</th>
                                    <th className="border px-2 py-1">Price</th>
                                    <th className="border px-2 py-1">Discount</th>
                                    <th className="border px-2 py-1">Type</th>
                                    <th className="border px-2 py-1">Subtotal</th>
                                    <th className="border px-2 py-1 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.purchase_items.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-2 py-1">
                                            <select
                                                className="w-full"
                                                value={item.product_id}
                                                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {godownItems.map((stock) => (
                                                    <option key={stock.item.id} value={stock.item.id}>
                                                        {stock.item.item_name} ({stock.qty} in stock)
                                                    </option>
                                                ))}
                                            </select>
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
                                            <input type="number" className="w-full bg-gray-100" value={item.subtotal} readOnly />
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            <div className="flex justify-center space-x-1">
                                                {data.purchase_items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProductRow(index)}
                                                        className="rounded bg-danger px-2 py-1 text-white hover:bg-danger-hover"
                                                    >
                                                        &minus;
                                                    </button>
                                                )}
                                                {index === data.purchase_items.length - 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={addProductRow}
                                                        className="rounded bg-primary px-2 py-1 text-white hover:bg-primary-hover"
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
                    <h2 className="text-lg font-semibold">Payment Info</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <select
                            className="border p-2"
                            value={data.received_mode_id}
                            onChange={(e) => setData('received_mode_id', e.target.value)}
                        >
                            <option value="">Select Payment Mode</option>
                            {receivedModes.map((mode) => (
                                <option key={mode.id} value={mode.id}>
                                    {mode.mode_name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            className="border p-2"
                            placeholder="Amount Paid"
                            value={data.amount_paid}
                            onChange={(e) => setData('amount_paid', e.target.value)}
                        />
                    </div>
                </div>

                {/* Totals Section */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                            <span className="font-semibold text-gray-700">Item Qty Total:</span>
                            <span className="font-semibold">{totalQty}</span>
                        </div>
                        <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                            <span className="font-semibold text-gray-700">Total Discount:</span>
                            <span className="font-semibold">{totalDisc}</span>
                        </div>
                        <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                            <span className="font-semibold text-gray-700">All Total Amount:</span>
                            <span className="font-semibold">{grandTotal}</span>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">Shipping Details</label>
                            <textarea
                                className="w-full rounded border bg-white p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                rows={3}
                                value={data.shipping_details || ''}
                                onChange={(e) => setData('shipping_details', e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">Delivered To</label>
                            <textarea
                                className="w-full rounded border bg-white p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                rows={3}
                                value={data.delivered_to || ''}
                                onChange={(e) => setData('delivered_to', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <ActionFooter
                    className="w-full justify-end"
                    onSubmit={handleSubmit}
                    cancelHref={cancelHref}
                    processing={processing}
                    submitText={submitText}
                    cancelText="Cancel"
                />
            </form>

            {/* Ledger Modal */}
            {showLedgerModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-700">Create New Inventory Ledger</h2>
                        <input
                            type="text"
                            placeholder="Ledger Name"
                            className="mb-3 w-full rounded border p-2"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                        />
                        <select
                            className="mb-4 w-full rounded border p-2"
                            value={newGroupId}
                            onChange={(e) => setNewGroupId(e.target.value)}
                        >
                            <option value="">Select Group</option>
                            {accountGroups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-3">
                            <button
                                className="rounded bg-gray-400 px-4 py-2 text-white"
                                onClick={() => setShowLedgerModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded bg-green-600 px-4 py-2 text-white"
                                onClick={async () => {
                                    await createLedger();
                                }}
                            >
                                Create Ledger
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PurchaseForm;