import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/PageHeader';

export default function Show({ stockTransfer }: any) {
  return (
    <AppLayout>
      <Head title={`View Stock Transfer #${stockTransfer.voucher_no || stockTransfer.id}`} />

      <div className="flex min-h-screen bg-white ">
        <div className="w-screen lg:w-full p-6">

          <PageHeader title='Stock Transfer Details' addLinkHref='/stock-transfers' addLinkText='Back' />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <div className="grid grid-cols-1 gap-4 space-y-4 rounded bg-gray-100 p-4   shadow md:grid-cols-2 dark:bg-neutral-900 border-b-2 border-black">{stockTransfer.date}</div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Voucher No</label>
              <div className="grid grid-cols-1 gap-4 space-y-4 rounded bg-gray-100 p-4   shadow md:grid-cols-2 dark:bg-neutral-900 border-b-2 border-black">{stockTransfer.voucher_no || '-'}</div>
            </div>

            <div>
              <label className="text-sm text-gray-600">From Godown</label>
              <div className="grid grid-cols-1 gap-4 space-y-4 rounded bg-gray-100 p-4   shadow md:grid-cols-2 dark:bg-neutral-900 border-b-2 border-black">{stockTransfer.from_godown?.name}</div>
            </div>

            <div>
              <label className="text-sm text-gray-600">To Godown</label>
              <div className="grid grid-cols-1 gap-4 space-y-4 rounded bg-gray-100 p-4   shadow md:grid-cols-2 dark:bg-neutral-900 border-b-2 border-black">{stockTransfer.to_godown?.name}</div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Note</label>
              <div className="text-lg whitespace-pre-wrap grid grid-cols-1 gap-4 space-y-4 rounded bg-gray-100 p-4   shadow md:grid-cols-2 dark:bg-neutral-900 border-b-2 border-black">{stockTransfer.note || '-'}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-4">Transferred Items</h2>
            <div className="overflow-auto">
              <table className="w-full text-left border border-gray-200 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Item Name</th>
                    <th className="p-2 border">Item Code</th>
                    <th className="p-2 border text-right">Quantity</th>
                    <th className="p-2 border text-right">Rate</th>
                    <th className="p-2 border text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stockTransfer.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 border">{idx + 1}</td>
                      <td className="p-2 border">{item.item.item_name}</td>
                      <td className="p-2 border">{item.item.item_code}</td>
                      <td className="p-2 border text-right">{item.quantity}</td>
                      <td className="p-2 border text-right"> {item.rate}</td>
                      <td className="p-2 border text-right"> {(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td className="p-2 border text-right" colSpan={3}>Total</td>
                    <td className="p-2 border text-right">{stockTransfer.total_quantity}</td>
                    <td className="p-2 border"></td>
                    <td className="p-2 border text-right"> {Number(stockTransfer.total_amount).toFixed(2)}</td>

                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
