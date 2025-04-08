import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Create({ godowns, items, errors }: any) {
  const { data, setData, post, processing } = useForm({
    date: new Date().toISOString().split('T')[0],
    voucher_no: '',
    reference_no: '',
    from_godown_id: '',
    to_godown_id: '',
    products: [],
    note: '',
  });

  const [products, setProducts] = useState<any[]>([{ item_id: '', quantity: '', rate: '', amount: 0 }]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    const timestamp = new Date().getTime();
    setData({
      ...data,
      voucher_no: `ST-${timestamp}`,
      reference_no: `REF-${timestamp.toString().slice(-6)}`
    });
  }, []);

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
      [field]: value
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
    post('/stock-transfers');
  };

  return (
    <AppLayout>
      <Head title="Add Stock Transfer" />
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Create Stock Transfer</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Transfer Date *</label>
              <input
                type="date"
                name="date"
                value={data.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Voucher Number</label>
              <input
                type="text"
                readOnly
                value={data.voucher_no}
                className="w-full bg-gray-50 rounded-lg border border-gray-200 px-4 py-2 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reference Number</label>
              <input
                type="text"
                name="reference_no"
                value={data.reference_no}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional reference"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">From Godown *</label>
              <select
                name="from_godown_id"
                value={data.from_godown_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Source Godown</option>
                {godowns.map((godown: any) => (
                  <option key={godown.id} value={godown.id}>
                    {godown.name}
                  </option>
                ))}
              </select>
              {errors.from_godown_id && <p className="text-red-500 text-sm mt-1">{errors.from_godown_id}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">To Godown *</label>
              <select
                name="to_godown_id"
                value={data.to_godown_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Destination Godown</option>
                {godowns.map((godown: any) => (
                  <option key={godown.id} value={godown.id}>
                    {godown.name}
                  </option>
                ))}
              </select>
              {errors.to_godown_id && <p className="text-red-500 text-sm mt-1">{errors.to_godown_id}</p>}
            </div>
          </div>

          {/* Products Table */}
          <div className="border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product, index) => {
                  const selectedItem = filteredItems.find(i => i.id == product.item_id);
                  const remainingStock = selectedItem ? selectedItem.previous_stock - (parseFloat(product.quantity) || 0) : null;

                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <select
                          value={product.item_id}
                          onChange={(e) => handleProductChange(index, 'item_id', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Product</option>
                          {filteredItems.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.item_name} ({item.previous_stock} in stock)
                            </option>
                          ))}
                        </select>
                        {errors[`products.${index}.item_id`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`products.${index}.item_id`]}</p>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                          className="w-full text-right rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                        {selectedItem && (
                          <div className="text-sm text-gray-500 text-right mt-1">
                            Remaining: <span className={remainingStock! < 0 ? 'text-red-500 font-semibold' : ''}>{remainingStock}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.rate}
                          onChange={(e) => handleProductChange(index, 'rate', e.target.value)}
                          className="w-full text-right rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-700">
                        {product.amount.toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          disabled={products.length === 1}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="p-4 border-t">
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product Line
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-8 text-lg font-semibold">
            <div className="text-gray-600">
              Total Quantity: <span className="text-gray-800 ml-2">{getTotalQuantity().toFixed(2)}</span>
            </div>
            <div className="text-gray-600">
              Grand Total: <span className="text-blue-600 ml-2">{getGrandTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t pt-6">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-75"
            >
              {processing ? 'Processing...' : 'Create Transfer'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
