import React from 'react';

/* —- Types (can be moved to a global types file) --- */
interface Receive {
  id: number;
  date: string;
  amount: number;
  received_mode?: { mode_name: string };
}

interface SlipTableProps {
  slip: {
    total_amount: number;
    paid_amount: number;
    outstanding: number;
    receives: Receive[];
  };
}

/* --- Helpers --- */
const money = (n: number | string) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 2 }).format(Number(n) || 0);

// New helper for formatting dates like '2025-07-15' into '15 Jul 2025'
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};


export default function SlipTable({ slip }: SlipTableProps) {
  // Handle case where there are no payments yet
  if (slip.receives.length === 0) {
    return (
      <div className="rounded-b-lg border-x border-b border-gray-200 bg-gray-50 p-6 text-center">
        <h4 className="text-md font-semibold text-gray-700">No Payments Recorded</h4>
        <p className="text-sm text-gray-500">
          The outstanding amount for this slip is {money(slip.outstanding)}.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-b-lg border-x border-b border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Payment Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Payment Method
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Amount Paid
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {slip.receives.map((payment) => (
            <tr key={payment.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{formatDate(payment.date)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{payment.received_mode?.mode_name || 'N/A'}</td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-800">{money(payment.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          {/* Slip Gross Amount */}
          <tr>
            <td colSpan={2} className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
              Slip Total:
            </td>
            <td className="px-6 py-3 text-right text-sm font-bold text-gray-800">{money(slip.total_amount)}</td>
          </tr>
          {/* Total Paid */}
          <tr>
            <td colSpan={2} className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
              Total Paid (on this slip):
            </td>
            <td className="px-6 py-3 text-right text-sm font-bold text-green-700">{money(slip.paid_amount)}</td>
          </tr>
          {/* Outstanding */}
          <tr>
            <td colSpan={2} className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
              Outstanding (on this slip):
            </td>
            <td className="px-6 py-3 text-right text-sm font-bold text-red-700">{money(slip.outstanding)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}