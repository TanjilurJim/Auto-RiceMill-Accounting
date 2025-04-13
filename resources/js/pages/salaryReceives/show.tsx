import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Show({ salaryReceive }) {
  const employee = salaryReceive?.employee ?? {};
  const slip = salaryReceive?.salary_slip_employee ?? {}; // snake_case from backend
  const journal = salaryReceive?.journal ?? {};
  const receivedMode = salaryReceive?.received_mode ?? {};
  const creator = salaryReceive?.creator ?? {};

  return (
    <AppLayout>
      <Head title={`Salary Receive - ${salaryReceive?.vch_no || 'N/A'}`} />

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Salary Receive Details</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-600">Voucher Info</h2>
            <p><strong>Voucher No:</strong> {salaryReceive?.vch_no || '—'}</p>
            <p><strong>Date:</strong> {salaryReceive?.date || '—'}</p>
            <p><strong>Amount:</strong> ৳{salaryReceive?.amount || '—'}</p>
            <p><strong>Description:</strong> {salaryReceive?.description || '—'}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-600">Received Mode</h2>
            <p><strong>Mode:</strong> {receivedMode?.mode_name || '—'}</p>
            <p><strong>Ledger:</strong> {receivedMode?.ledger?.account_ledger_name || '—'}</p>
            <p><strong>Created By:</strong> {creator?.name || '—'} on {salaryReceive?.created_at ? new Date(salaryReceive.created_at).toLocaleString() : '—'}</p>
          </div>
        </div>

        {/* Employee Info */}
        {employee?.name && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-600">Employee Info</h2>
              <p><strong>Name:</strong> {employee?.name || '—'}</p>
              <p><strong>Designation:</strong> {employee?.designation?.name || '—'}</p>
              <p><strong>Department:</strong> {employee?.department?.name || '—'}</p>
            </div>

            {slip?.id && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-600">Salary Slip</h2>
                <p><strong>Voucher:</strong> {slip?.salary_slip?.voucher_number || '—'}</p>
                <p><strong>Month:</strong> {slip?.salary_slip?.month || '—'}</p>
                <p><strong>Total:</strong> ৳{slip?.total_amount || '—'}</p>
                <p><strong>Paid:</strong> ৳{slip?.paid_amount || '—'}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={`ml-2 font-medium ${slip?.status === 'Paid' ? 'text-green-600' : slip?.status === 'Partially Paid' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {slip?.status || '—'}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Journal Entries */}
        {journal?.entries?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Journal Entries</h2>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 border">Account</th>
                  <th className="text-left px-4 py-2 border">Type</th>
                  <th className="text-right px-4 py-2 border">Amount</th>
                  <th className="text-left px-4 py-2 border">Note</th>
                </tr>
              </thead>
              <tbody>
                {journal.entries.map((entry, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border">{entry?.ledger?.account_ledger_name || '—'}</td>
                    <td className="px-4 py-2 border">{entry?.type || '—'}</td>
                    <td className="px-4 py-2 border text-right">৳{entry?.amount || '—'}</td>
                    <td className="px-4 py-2 border">{entry?.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
