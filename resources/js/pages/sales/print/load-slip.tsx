/* resources/js/pages/sales/print/load-slip.tsx */
import ActionFooter from '@/components/ActionFooter';
import { Head, Link } from '@inertiajs/react';

interface Company {
  company_name?: string;
  name?: string;
  address?: string;
  phone?: string;
  logo_url?: string;
  logo_thumb_url?: string;
}

export default function LoadSlip({
  sale,
  company,
  amountWords,
}: {
  sale: any;
  company: Company;
  amountWords: string;
}) {
  const handlePrint = () => window.print?.();

  return (
    <div className="mx-auto max-w-full bg-white p-6 shadow print:shadow-none">
      <Head title={`Load Slip #${sale.voucher_no}`} />

      {/* Back link (hidden on print) */}
      <Link
        href="/sales"
        className="mb-4 inline-block rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 print:hidden"
      >
        Back
      </Link>

      {/* ─── Company header ─── */}
      <div className="mb-4 text-center print:text-xs">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt="Logo"
            className="mx-auto mb-2 h-20 object-contain print:h-12"
          />
        )}
        <h1 className="text-2xl font-bold uppercase">
          {company.company_name ?? company.name}
        </h1>
        {company.address && <div>{company.address}</div>}
        {company.phone && <div>+88 {company.phone}</div>}
        <h2 className="mt-2 font-semibold underline">LOAD SLIP</h2>
      </div>

      {/* ─── Party + meta ─── */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p>
            <strong>Account:</strong> {sale.account_ledger.account_ledger_name}
          </p>
          <p>
            <strong>Address:</strong> {sale.address}
          </p>
          {sale.phone && (
            <p>
              <strong>Mobile:</strong> {sale.phone}
            </p>
          )}
        </div>
        <div>
          <p>
            <strong>Date:</strong> {sale.date}
          </p>
          <p>
            <strong>Voucher No:</strong> {sale.voucher_no}
          </p>
          <p>
            <strong>Delivery To:</strong> {sale.delivered_to ?? 'N/A'}
          </p>
        </div>
      </div>

      {/* ─── Items table ─── */}
      <table className="mb-4 w-full border text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2">SL</th>
            <th className="border px-2">Description</th>
            <th className="border px-2">Unit</th>
            <th className="border px-2">Qty</th>
          </tr>
        </thead>
        <tbody>
          {sale.sale_items.map((row: any, i: number) => (
            <tr key={i}>
              <td className="border px-2 text-center">{i + 1}</td>
              <td className="border px-2">{row.item?.item_name}</td>
              <td className="border px-2 text-center">{row.item?.unit?.name}</td>
              <td className="border px-2 text-right">{row.qty}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="border px-2 font-semibold">
              Total
            </td>
            <td className="border px-2 text-right font-semibold">
              {sale.total_qty}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ─── Amount in words ─── */}
      <p className="mb-6 text-sm">
        <strong>Amount In Word:</strong> {amountWords}
      </p>

      {/* ─── Signatures ─── */}
      <div className="mt-12 flex justify-between text-center">
        {['Receiver', 'Accountant', 'Authorised Signatory'].map((t) => (
          <div key={t} className="w-1/3">
            <p className="inline-block w-32 border-t-2 pt-2"></p>
            <span className="text-xs">{t}</span>
          </div>
        ))}
      </div>

      {/* ─── Action buttons ─── */}
      <ActionFooter
        className="justify-center print:hidden"
        cancelHref="/sales"
        cancelText="Back"
        onSubmit={handlePrint}
        submitText="Print Slip"
      />
    </div>
  );
}
