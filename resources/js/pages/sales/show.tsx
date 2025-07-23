import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

export default function SaleShow({ sale }: { sale: any }) {
  // convenience helpers – show buttons only when *this* user may act
  const mayApprove  = sale.status === 'pending_sub'  && sale.sub_responsible_id === sale.me
                   || sale.status === 'pending_resp' && sale.responsible_id   === sale.me;
  const mayReject   = mayApprove;

  return (
    <AppLayout title={`Sale ${sale.voucher_no}`}>
      <h1 className="mb-4 text-xl font-semibold">
        Sale {sale.voucher_no}
        <span className="ml-3 rounded bg-gray-100 px-2 py-0.5 text-sm">
          {sale.status}
        </span>
      </h1>

      {/* BASIC INFO */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div><strong>Date:</strong> {sale.date}</div>
        <div><strong>Customer:</strong> {sale.account_ledger.account_ledger_name}</div>
        <div><strong>Salesman:</strong> {sale.salesman?.name ?? '-'}</div>
        <div><strong>Godown:</strong> {sale.godown?.godown_name ?? '-'}</div>
        <div><strong>Grand total:</strong> {Number(sale.grand_total).toFixed(2)}</div>
      </div>

      {/* LINE-ITEMS */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.sale_items.map((it: any) => (
            <tr key={it.id} className="border-t">
              <td className="p-2">{it.item?.item_name}</td>
              <td className="p-2 text-right">{it.qty}</td>
              <td className="p-2 text-right">{it.main_price}</td>
              <td className="p-2 text-right">{it.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* APPROVAL / REJECTION BUTTONS */}
      {mayApprove && (
        <div className="mt-6 space-x-3">
          <button
            onClick={() => router.post(`/sales/${sale.id}/${sale.status === 'pending_sub' ? 'approve-sub' : 'approve-final'}`)}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Approve
          </button>
          <button
            onClick={() => router.post(`/sales/${sale.id}/reject`)}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Reject
          </button>
        </div>
      )}

      {/* APPROVAL LOG */}
      <h2 className="mt-10 mb-2 font-semibold">Approval Log</h2>
      <ul className="list-disc pl-6 text-sm">
        {sale.approvals.map((a: any) => (
          <li key={a.id}>
            [{a.created_at}] {a.user.name} <strong>{a.action}</strong> {a.note && `– ${a.note}`}
          </li>
        ))}
        {sale.approvals.length === 0 && <li>No actions yet</li>}
      </ul>
    </AppLayout>
  );
}
