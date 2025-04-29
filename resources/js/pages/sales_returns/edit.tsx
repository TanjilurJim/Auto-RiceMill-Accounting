import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function SalesReturnEdit({
  salesReturn,
  sales,
  ledgers,
  products,
  godowns,
  salesmen,
}: {
  salesReturn: any;
  sales: any[];
  ledgers: any[];
  products: any[];
  godowns: any[];
  salesmen: any[];
}) {
  const { data, setData, put, processing, errors } = useForm({
    sale_id: salesReturn.sale_id ?? '',
    voucher_no: salesReturn.voucher_no ?? '',
    account_ledger_id: salesReturn.account_ledger_id ?? '',
    godown_id: salesReturn.godown_id ?? '',
    salesman_id: salesReturn.salesman_id ?? '',
    return_date: salesReturn.return_date ?? '',
    phone: salesReturn.phone ?? '',
    address: salesReturn.address ?? '',
    shipping_details: salesReturn.shipping_details ?? '',
    delivered_to: salesReturn.delivered_to ?? '',
    reason: salesReturn.reason ?? '',
    sales_return_items: salesReturn.items.map((item: any) => ({
      product_id: item.product_id,
      qty: item.qty,
      main_price: item.main_price,
      discount: item.discount ?? 0,
      return_amount: item.return_amount,
    })),
  });

  const calculateTotals = () => {
    let totalQty = 0;
    let totalReturnAmount = 0;

    data.sales_return_items.forEach((item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.main_price) || 0;
      const discount = parseFloat(item.discount) || 0;
      const amount = qty * price - discount;

      totalQty += qty;
      totalReturnAmount += amount;
    });

    return { totalQty, totalReturnAmount };
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...data.sales_return_items];
    updatedItems[index][field] = value;

    const qty = parseFloat(updatedItems[index].qty) || 0;
    const price = parseFloat(updatedItems[index].main_price) || 0;
    const discount = parseFloat(updatedItems[index].discount) || 0;

    updatedItems[index].return_amount = (qty * price - discount).toFixed(2);
    setData('sales_return_items', updatedItems);
  };

  const addProductRow = () =>
    setData('sales_return_items', [
      ...data.sales_return_items,
      { product_id: '', qty: '', main_price: '', discount: '', return_amount: '' },
    ]);

  const removeProductRow = (index: number) => {
    if (data.sales_return_items.length > 1) {
      const updated = [...data.sales_return_items];
      updated.splice(index, 1);
      setData('sales_return_items', updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/sales-returns/${salesReturn.id}`);
  };

  const { totalQty, totalReturnAmount } = calculateTotals();

  return (
    <AppLayout>
      <Head title="Edit Sales Return" />
      <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
        <div className="bg-white h-full rounded-lg p-6">

          <PageHeader title='Edit Sales Return' addLinkHref='/sales-returns' addLinkText='Back' />

          <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow-md">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">Voucher No</label>
                <input type="text" className="w-full border rounded bg-gray-100 p-2" value={data.voucher_no} readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Related Sale</label>
                <select className="w-full border rounded p-2" value={data.sale_id} onChange={(e) => setData('sale_id', e.target.value)}>
                  <option value="">Select Sale</option>
                  {sales.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.voucher_no}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Ledger</label>
                <select className="w-full border rounded p-2" value={data.account_ledger_id} onChange={(e) => setData('account_ledger_id', e.target.value)}>
                  <option value="">Select Ledger</option>
                  {ledgers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.account_ledger_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Godown</label>
                <select className="w-full border rounded p-2" value={data.godown_id} onChange={(e) => setData('godown_id', e.target.value)}>
                  <option value="">Select Godown</option>
                  {godowns.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salesman</label>
                <select className="w-full border rounded p-2" value={data.salesman_id} onChange={(e) => setData('salesman_id', e.target.value)}>
                  <option value="">Select Salesman</option>
                  {salesmen.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Return Date</label>
                <input type="date" className="w-full border rounded p-2" value={data.return_date} onChange={(e) => setData('return_date', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" className="w-full border rounded p-2" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" className="w-full border rounded p-2" value={data.address} onChange={(e) => setData('address', e.target.value)} />
              </div>
            </div>

            {/* Product Rows */}
            <div>
              <h2 className="mb-2 text-lg font-semibold">Returned Products</h2>
              {data.sales_return_items.map((item, index) => (
                <div key={index} className="mb-3 grid grid-cols-12 items-end gap-2">
                  <div className="col-span-3">
                    <select className="w-full border rounded p-2" value={item.product_id} onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}>
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.item_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <input type="number" placeholder="Qty" className="w-full border rounded p-2" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <input type="number" placeholder="Price" className="w-full border rounded p-2" value={item.main_price} onChange={(e) => handleItemChange(index, 'main_price', e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <input type="number" placeholder="Discount" className="w-full border rounded p-2" value={item.discount} onChange={(e) => handleItemChange(index, 'discount', e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <input type="number" className="w-full border rounded bg-gray-100 p-2" value={item.return_amount} readOnly />
                  </div>

                  <div className="col-span-1 flex gap-1">
                    {data.sales_return_items.length > 1 && (
                      <button type="button" onClick={() => removeProductRow(index)} className="rounded bg-danger hover:bg-danger-hover px-3 py-1 text-white">
                        &minus;
                      </button>
                    )}
                    {index === data.sales_return_items.length - 1 && (
                      <button type="button" onClick={addProductRow} className="rounded bg-primary hover:bg-primary-hover px-3 py-1 text-white">
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>Total Qty: <strong>{totalQty.toFixed(2)}</strong></div>
                <div>Total Return Amount: <strong>{totalReturnAmount.toFixed(2)}</strong></div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Shipping Details</label>
                <input type="text" className="w-full border rounded p-2" value={data.shipping_details} onChange={(e) => setData('shipping_details', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Delivered To</label>
                <input type="text" className="w-full border rounded p-2" value={data.delivered_to} onChange={(e) => setData('delivered_to', e.target.value)} />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-1">Return Reason</label>
              <textarea className="w-full border rounded p-2" value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
            </div>

            {/* Submit */}
            {/* <div className="flex justify-end pt-4">
            <button type="submit" disabled={processing} className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700">
              {processing ? 'Saving...' : 'Update Sales Return'}
            </button>
          </div> */}
            <ActionFooter
              className="justify-end"
              onSubmit={handleSubmit} // Function to handle form submission
              cancelHref="/sales-returns" // URL for the cancel action
              processing={processing} // Indicates whether the form is processing
              submitText={processing ? 'Saving...' : 'Update Sales Return'} // Text for the submit button
              cancelText="Cancel" // Text for the cancel button
            />
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
