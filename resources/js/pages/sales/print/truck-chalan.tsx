import ActionFooter from '@/components/ActionFooter';
import { Head, Link } from '@inertiajs/react';

export default function TruckChalan({
  sale,
  company,
  amountWords,
}: {
  sale: any;
  company: any;
  amountWords: string;
}) {
  /* one-click print helper */
  const handlePrint = () => window.print?.();

  return (
    <div className="mx-auto max-w-full bg-white p-6 shadow print:shadow-none">
      <Head title={`Truck Chalan #${sale.voucher_no}`} />

      {/* Back link */}
      <Link
        href="/sales"
        className="mb-4 inline-block rounded bg-gray-300 px-4 py-2 text-sm hover:bg-neutral-100 print:hidden"
      >
        Back
      </Link>

      {/* header (logo + company) */}
      <div className="mb-4 text-center print:text-xs">
        {company?.logo_url && (
          <img src={company?.logo_url} className="mx-auto mb-2 h-20 object-contain print:h-12" />
        )}
        <h1 className="text-2xl font-bold uppercase">
          {company?.company_name ?? company?.name}
        </h1>
        {company?.address && <div>{company?.address}</div>}
        {company?.phone && <div>Phone: +88 {company?.phone}</div>}
        <h2 className="mt-2 font-semibold underline">TRUCK CHALAN</h2>
      </div>

      {/* party & meta */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Account:</strong> {sale.account_ledger.account_ledger_name}</p>
          <p><strong>Address:</strong> {sale.address}</p>
          <p><strong>Mobile:</strong> {sale.phone}</p>
        </div>
        <div>
          <p><strong>Date:</strong> {sale.date}</p>
          <p><strong>Voucher No:</strong> {sale.voucher_no}</p>
          <p><strong>Delivery To:</strong> {sale.delivered_to ?? 'N/A'}</p>
        </div>
      </div>

      {/* item table */}
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
            <td colSpan={3} className="border px-2 font-semibold">Total</td>
            <td className="border px-2 text-right font-semibold">{sale.total_qty}</td>
          </tr>
        </tbody>
      </table>

      {/* driver / rent info */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Driver Name:</strong> {sale.truck_driver_name}</p>
          <p><strong>Driver Address:</strong> {sale.driver_address}</p>
          <p><strong>Driver Mobile:</strong> {sale.driver_mobile}</p>
        </div>
        <div className="text-right">
          <p><strong>Truck Rent:</strong> {sale.truck_rent}</p>
          <p><strong>Advance Paid:</strong> {sale.rent_advance}</p>
          <p><strong>Due Rent:</strong> {sale.net_rent}</p>
        </div>
      </div>

      {/* Bangla note */}
      <p className="mb-4 font-semibold">
        জনাব, {sale.account_ledger.account_ledger_name} , (সমস্ত মালামাল) বুঝিয়ে নিয়ে বাকী ({sale.net_rent})
        ভাড়া দিয়ে দিবেন।
      </p>

      {/* signatures */}
      <div className="mt-8 flex justify-between text-center">
        {['Receiver', 'Accountant', 'Authorised Signatory'].map((t) => (
          <div key={t} className="w-1/3">
            <p className="inline-block w-32 border-t-2 pt-2"></p><br />
            <span className="text-xs">{t}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <ActionFooter
        className="justify-center print:hidden"
        cancelHref="/sales"
        cancelText="Back"
        onSubmit={handlePrint}
        submitText="Print Chalan"
      />
    </div>
  );
}
