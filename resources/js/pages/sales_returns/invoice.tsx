import { useEffect } from 'react';
import { toWords } from 'number-to-words';

export default function Invoice({ salesReturn }: { salesReturn: any }) {
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  const totalQty = salesReturn.items.reduce((sum: number, item: any) => sum + parseFloat(item.qty), 0);
  const totalAmount = salesReturn.items.reduce((sum: number, item: any) => sum + parseFloat(item.return_amount), 0);

  const amountInWords = (num: number) => {
    return toWords(num); // Converts the number to words
  };

  return (
    <div className="p-10 text-sm font-sans">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Name of The Company</h2>
        <p>Address</p>
        <p>Mobile No:</p>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <p><strong>Vch. No:</strong> {salesReturn.voucher_no}</p>
          <p><strong>Sale Return Invoice</strong></p>
        </div>
        <div>
          <p><strong>Date:</strong> {salesReturn.return_date}</p>
          <p><strong>Account Name:</strong> {salesReturn.account_ledger?.account_ledger_name}</p>
        </div>
      </div>

      <table className="w-full border border-collapse text-left text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">SL</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Unit</th>
            <th className="border px-2 py-1">Rate</th>
            <th className="border px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {salesReturn.items.map((item: any, index: number) => (
            <tr key={index}>
              <td className="border px-2 py-1">{index + 1}</td>
              <td className="border px-2 py-1">{item.product?.item_name}</td>
              <td className="border px-2 py-1 text-right">{parseFloat(item.qty).toFixed(2)}</td>
              <td className="border px-2 py-1">{item.product?.unit?.name}</td>
              <td className="border px-2 py-1 text-right">{parseFloat(item.main_price).toFixed(2)}</td>
              <td className="border px-2 py-1 text-right">{parseFloat(item.return_amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <p>Total Quantity: {totalQty.toFixed(2)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {totalAmount.toFixed(2)}</p>
        <p>Discount: 0.00</p>
        <p className="font-bold">Grand Total: {totalAmount.toFixed(2)}</p>
        <p>Amount in Words: {amountInWords(totalAmount)}</p>
      </div>

      <div className="mt-10 text-right">
        <p>Authorised Signatory</p>
      </div>
    </div>
  );
}
