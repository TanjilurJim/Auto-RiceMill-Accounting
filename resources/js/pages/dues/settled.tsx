import AppLayout   from '@/layouts/app-layout';
import PageHeader  from '@/components/PageHeader';
import { Head }    from '@inertiajs/react';
import React       from 'react';

type Row = {
  id: number;
  date: string;
  voucher_no: string;
  customer: string;
  total_sale: number;
  interest_paid: number;
  total_paid: number;
  cleared_on: string|null;
};
interface Props { sales: Row[]; }

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n);

export default function Settled({ sales }: Props) {
  return (
    <AppLayout>
      <Head title="Settled dues" />
      <div className="h-full w-full bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <PageHeader
            title="Settled dues"
            addLinkHref="/dues"
            addLinkText="Back to outstanding"
          />

          {sales.length === 0 ? (
            <p className="rounded bg-green-50 p-4 text-sm text-green-700">
              Great! No dues have been settled yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded border bg-white">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr className="border-b text-left">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Voucher</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2 text-right">Sale ৳</th>
                    <th className="px-3 py-2 text-right">Interest ৳</th>
                    <th className="px-3 py-2 text-right">Paid ৳</th>
                    <th className="px-3 py-2">Cleared on</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{s.date}</td>
                      <td className="px-3 py-2">{s.voucher_no}</td>
                      <td className="px-3 py-2">{s.customer}</td>
                      <td className="px-3 py-2 text-right">{fmt(s.total_sale)}</td>
                      <td className="px-3 py-2 text-right">{fmt(s.interest_paid)}</td>
                      <td className="px-3 py-2 text-right">{fmt(s.total_paid)}</td>
                      <td className="px-3 py-2">{s.cleared_on ?? '—'}</td>
                      <td className="px-3 py-2">
                        <a
                          href={route('dues.show', s.id)}
                          className="text-blue-600 hover:underline"
                        >
                          View&nbsp;log
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
