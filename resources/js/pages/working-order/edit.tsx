import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ActionFooter from '@/components/ActionFooter';

interface Godown {
  id: number;
  name: string;
}
interface Item {
  id: number;
  item_name: string;
  purchase_price: number;
}
interface WorkingOrderItem {
  id: number;
  product_id: number;
  godown_id: number;
  quantity: number | string;
  purchase_price: number | string;
  subtotal: number | string;
}
interface WorkingOrderExtra {
  id: number;
  title: string;
  quantity: number | string | null;
  price: number | string | null;
  total: number | string;
}
interface WorkingOrder {
  id: number;
  date: string;
  voucher_no: string;
  reference_no: string | null;
  items: WorkingOrderItem[];
  extras: WorkingOrderExtra[];
}

interface Props {
  workingOrder: WorkingOrder;
  products: Item[];
  godowns: Godown[];
}

const WorkingOrderEdit: React.FC<Props> = ({ workingOrder, products, godowns }) => {
  const [date, setDate] = useState(workingOrder.date);
  const [referenceNo, setReferenceNo] = useState(workingOrder.reference_no || '');

  const [rows, setRows] = useState<WorkingOrderItem[]>(
    workingOrder.items.map((item) => ({
      ...item,
      quantity: item.quantity ?? '',
      purchase_price: item.purchase_price ?? '',
      subtotal: item.subtotal ?? 0,
    }))
  );

  const [extras, setExtras] = useState<WorkingOrderExtra[]>(
    workingOrder.extras?.length
      ? workingOrder.extras.map((e) => ({
        ...e,
        quantity: e.quantity ?? '',
        price: e.price ?? '',
        total: e.total ?? 0,
      }))
      : [{ title: '', quantity: '', price: '', total: 0 }]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx: number) => {
    const { name, value } = e.target;
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [name]: value };

    if (name === 'quantity' || name === 'purchase_price') {
      const qty = parseFloat(String(updated[idx].quantity)) || 0;
      const price = parseFloat(String(updated[idx].purchase_price)) || 0;
      updated[idx].subtotal = qty * price;
    }
    setRows(updated);
  };

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const updated = [...extras];
    updated[idx] = { ...updated[idx], [name]: value };

    if (name === 'quantity' || name === 'price') {
      const qty = parseFloat(String(updated[idx].quantity)) || 0;
      const price = parseFloat(String(updated[idx].price)) || 0;
      updated[idx].total = qty * price;
    }
    setExtras(updated);
  };

  const addRow = () =>
    setRows([...rows, { product_id: 0, godown_id: 0, quantity: '', purchase_price: '', subtotal: 0 }]);
  const removeRow = (i: number) => rows.length > 1 && setRows(rows.filter((_, idx) => idx !== i));

  const addExtra = () => setExtras([...extras, { title: '', quantity: '', price: '', total: 0 }]);
  const removeExtra = (i: number) => extras.length > 1 && setExtras(extras.filter((_, idx) => idx !== i));

  const materialTotal = rows.reduce((t, r) => t + (Number(r.subtotal) || 0), 0);
  const expenseTotal = extras.reduce((t, r) => t + (Number(r.total) || 0), 0);
  const grandTotal = materialTotal + expenseTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(`/working-orders/${workingOrder.id}`, {
      date,
      voucher_no: workingOrder.voucher_no,
      reference_no: referenceNo,
      orderData: rows,
      extrasData: extras,
    });
  };

  return (
    <AppLayout>
      <Head title="Edit Working Order" />

      <div className="mx-auto w-full h-full ">
        <div className="h-full border border-gray-200 bg-gray-100 p-6">
          <div className="w-full h-full bg-white rounded-md p-6 ">
            <PageHeader title="Edit Working Order" addLinkText="Back to Orders" addLinkHref="/working-orders" />

            <form onSubmit={handleSubmit} className="space-y-8 px-6 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded border border-gray-400 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Voucher No</label>
                  <input
                    type="text"
                    value={workingOrder.voucher_no}
                    readOnly
                    className="w-full cursor-not-allowed rounded border border-gray-400 bg-gray-100 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Reference No</label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full rounded border border-gray-400 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Stock Items */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Materials / Stock</h3>
                  <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                    Add Item
                  </button>
                </div>

                {rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12  gap-4 rounded border border-gray-100 bg-gray-50 p-4 shadow-md"
                  >
                    {/* Product */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Product</label>
                      <select
                        name="product_id"
                        value={row.product_id}
                        onChange={(e) => handleInputChange(e, idx)}
                        className="w-full rounded border border-black px-2 py-1 text-xs"
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
                      <label className="mb-2 block text-sm font-medium text-gray-700">Godown</label>
                      <select
                        name="godown_id"
                        value={row.godown_id}
                        onChange={(e) => handleInputChange(e, idx)}
                        className="w-full rounded border border-black px-2 py-1 text-xs"
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
                      <label className="mb-2 block text-sm font-medium text-gray-700">Qty</label>
                      <input
                        type="number"
                        name="quantity"
                        value={row.quantity}
                        onChange={(e) => handleInputChange(e, idx)}
                        className="w-full rounded border border-black px-2 py-1 text-xs text-right"
                        min="1"
                        required
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Unit Price</label>
                      <input
                        type="number"
                        name="purchase_price"
                        value={row.purchase_price}
                        onChange={(e) => handleInputChange(e, idx)}
                        className="w-full rounded border border-black px-2 py-1 text-xs text-right"
                        step="0.01"
                        required
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Subtotal</label>
                      <span className="text-sm font-medium text-indigo-600">{Number(row.subtotal).toFixed(2)}</span>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Action</label>
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        disabled={rows.length === 1}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extras */}
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
                        className="w-full rounded border border-black px-2 py-1 text-xs"
                        placeholder="Expense title"
                        required
                      />
                    </div>
                    
                    <div className="col-span-1 lg:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Qty</label>
                      <input
                        type="number"
                        name="quantity"
                        value={row.quantity ?? ''}
                        onChange={(e) => handleExtraChange(e, idx)}
                        className="w-full rounded border border-black px-2 py-1 text-xs text-right"
                      />
                    </div>
                    
                    <div className="col-span-1 lg:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={row.price ?? ''}
                        onChange={(e) => handleExtraChange(e, idx)}
                        className="w-full rounded border border-black px-2 py-1 text-xs text-right"
                      />
                    </div>
                    
                    <div className="col-span-1 lg:col-span-2 flex items-center justify-end">
                      <span className="text-sm font-medium text-indigo-600">{Number(row.total).toFixed(2)}</span>
                    </div>
                    
                    <div className="col-span-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => removeExtra(idx)}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        disabled={extras.length === 1}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* Totals */}
              <div className="rounded border border-indigo-100 bg-indigo-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Total Amount</span>
                  <span className="text-lg font-bold text-indigo-700">{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <ActionFooter
                className="justify-end"
                onSubmit={handleSubmit}
                cancelHref="/working-orders"
                processing={false}
                submitText="Update Working Order"
                cancelText="Cancel"
              />
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkingOrderEdit;
