import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import ActionFooter from '@/components/ActionFooter';

export default function ContraPrint(props: any) {
  const {
    company,
    voucher_no,
    date,
    from_mode,
    to_mode,
    amount,
    amount_in_words,
    description,
  } = props;

  /* auto-print on open */
  useEffect(() => {
    window.print();
  }, []);

  const logo = company?.logo_url ?? company?.logo_thumb_url;

  return (
    <div className="max-w-full bg-white p-6 print:p-0">
      <Head title={`Contra Voucher ${voucher_no}`} />

      {/* Back button (screen-only) */}
      <div className="mb-4 print:hidden">
        <button
          onClick={() => history.back()}
          className="rounded bg-gray-300 px-4 py-2 text-sm hover:bg-gray-400"
        >
          ← Back
        </button>
      </div>

      {/* Company header */}
      <div className="mb-6 text-center print:text-xs">
        {logo && <img src={logo} alt="logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />}
        <h1 className="text-2xl font-bold uppercase">{company?.company_name}</h1>
        {company?.address && <p>{company.address}</p>}
        {company?.phone   && <p>Phone: {company.phone}</p>}
      </div>

      {/* Voucher meta */}
      <div className="mb-4 flex justify-between text-sm">
        <div>
          <p><strong>Voucher No:</strong> {voucher_no}</p>
          <p><strong>Date:</strong> {date}</p>
        </div>
        <div className="text-right font-semibold">CONTRA VOUCHER</div>
      </div>

      {/* Movement table */}
      <table className="mb-4 w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-1 text-left">From Mode</th>
            <th className="border px-3 py-1 text-left">To Mode</th>
            <th className="border px-3 py-1 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-3 py-1">{from_mode}</td>
            <td className="border px-3 py-1">{to_mode}</td>
            <td className="border px-3 py-1 text-right">{(+amount).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* In-words + note */}
      <p className="mb-2 text-sm"><strong>In Words:</strong> {amount_in_words}</p>
      {description && (
        <p className="mb-2 text-sm"><strong>Description:</strong> {description}</p>
      )}

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-3 gap-6 text-center text-sm">
        {['Prepared By', 'Verified By', 'Authorised Signatory'].map((t) => (
          <p key={t} className="border-t pt-2">{t}</p>
        ))}
      </div>

      {/* Action buttons (screen-only) */}
      <ActionFooter
        className="justify-center print:hidden"
        cancelHref="/contra-add"
        cancelText="Back"
        onSubmit={() => window.print()}
        submitText="Print"
      />
    </div>
  );
}
