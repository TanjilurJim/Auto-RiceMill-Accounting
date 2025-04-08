import React, { useState, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Edit({ stockTransfer, godowns, items, errors }: any) {
  const { data, setData, put, processing } = useForm({
    date: stockTransfer.date,
    voucher_no: stockTransfer.voucher_no,
    reference_no: stockTransfer.reference_no || '',
    from_godown_id: stockTransfer.from_godown_id,
    to_godown_id: stockTransfer.to_godown_id,
    products: stockTransfer.items.map((i: any) => ({
      item_id: i.item_id,
      quantity: i.quantity,
      rate: i.rate,
      amount: parseFloat(i.quantity) * parseFloat(i.rate),
    })),
    note: stockTransfer.note || '',
  });

  const [products, setProducts] = useState(data.products);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    if (data.from_godown_id) {
      const godownItems = items.filter((item: any) => item.godown_id == data.from_godown_id);
      setFilteredItems(godownItems);
    } else {
      setFilteredItems([]);
    }
  }, [data.from_godown_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData(e.target.name, e.target.value);
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };

    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(updatedProducts[index].quantity) || 0;
      const rate = parseFloat(updatedProducts[index].rate) || 0;
      updatedProducts[index].amount = quantity * rate;
    }

    setProducts(updatedProducts);
    setData('products', updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { item_id: '', quantity: '', rate: '', amount: 0 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    setData('products', updatedProducts);
  };

  const getTotalQuantity = () => {
    return products.reduce((sum, product) => sum + (parseFloat(product.quantity) || 0), 0);
  };

  const getGrandTotal = () => {
    return products.reduce((sum, product) => sum + (parseFloat(product.amount.toString()) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/stock-transfers/${stockTransfer.id}`);
  };

  return (
    <AppLayout>
      <Head title="Edit Stock Transfer" />
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Edit Stock Transfer</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input type="date" name="date" value={data.date} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              {errors.date && <div className="text-red-500 text-sm">{errors.date}</div>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Voucher No</label>
              <input type="text" name="voucher_no" value={data.voucher_no} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              {errors.voucher_no && <div className="text-red-500 text-sm">{errors.voucher_no}</div>}
            </div>

            <div>
              <label className="block mb-1 font-medium">From Godown</label>
              <select name="from_godown_id" value={data.from_godown_id} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="">Select</option>
                {godowns.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              {errors.from_godown_id && <div className="text-red-500 text-sm">{errors.from_godown_id}</div>}
            </div>

            <div>
              <label className="block mb-1 font-medium">To Godown</label>
              <select name="to_godown_id" value={data.to_godown_id} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="">Select</option>
                {godowns.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              {errors.to_godown_id && <div className="text-red-500 text-sm">{errors.to_godown_id}</div>}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Products</label>
            {products.map((product, index) => (
              <div key={index} className="grid grid-cols-6 gap-2 mb-4">
                <select
                  className="col-span-2 border rounded px-3 py-2"
                  value={product.item_id}
                  onChange={(e) => handleProductChange(index, 'item_id', e.target.value)}
                >
                  <option value="">Select Item</option>
                  {filteredItems.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.item_name} ({item.item_code})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="col-span-1 border rounded px-3 py-2"
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                />

                <input
                  type="number"
                  className="col-span-1 border rounded px-3 py-2"
                  placeholder="Rate"
                  value={product.rate}
                  onChange={(e) => handleProductChange(index, 'rate', e.target.value)}
                />

                <input
                  type="number"
                  className="col-span-1 border rounded px-3 py-2"
                  placeholder="Amount"
                  value={product.amount}
                  readOnly
                />

                <button
                  type="button"
                  className="col-span-1 text-red-600"
                  onClick={() => removeProduct(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded"
              onClick={addProduct}
            >
              + Add Item
            </button>

            {errors.products && <div className="text-red-500 text-sm mt-2">{errors.products}</div>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Note</label>
              <textarea name="note" value={data.note} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              {errors.note && <div className="text-red-500 text-sm">{errors.note}</div>}
            </div>

            <div className="flex flex-col justify-between text-sm text-gray-600">
              <div>Total Quantity: {getTotalQuantity()}</div>
              <div>Grand Total: ₹ {getGrandTotal().toFixed(2)}</div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {processing ? 'Updating...' : 'Update Transfer'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
