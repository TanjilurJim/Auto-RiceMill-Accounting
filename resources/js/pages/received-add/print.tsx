import AppLayout       from '@/layouts/app-layout';
import ActionFooter    from '@/components/ActionFooter';
import { Head, Link }  from '@inertiajs/react';
import { useEffect }   from 'react';

interface Mode   { mode_name : string }
interface Ledger { account_ledger_name : string }

interface Received {
  date        : string;
  voucher_no  : string;
  amount      : number;
  description ?: string;
  received_mode : Mode;
  account_ledger : Ledger;
}

interface Company {
  company_name ?: string;
  name         ?: string;
  address      ?: string;
  phone        ?: string;
  logo_url     ?: string;
}

export default function ReceivedPrint(
  { receivedAdd, company, amountWords }:
  { receivedAdd:Received; company?:Company; amountWords:string }
){
  /* auto-print once page is ready (comment line if not desired) */
  useEffect(()=>window.print(), []);

  const fmtDate = (d:string) =>
     new Date(d).toLocaleDateString('en-GB');

  return (
    <AppLayout>
      <Head title={`Received #${receivedAdd.voucher_no}`} />

      <div className=" max-w-full bg-white p-8 print:p-4 text-sm">

        {/* back (hidden on print) */}
        <Link href="/received-add"
              className="mb-4 inline-block rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100 print:hidden">
          Back
        </Link>

        {/* company header */}
        <div className="mb-6 text-center print:text-xs">
          {company?.logo_url &&
            <img src={company.logo_url}
                 className="mx-auto h-20 object-contain mb-2 print:h-12" />}
          <h1 className="text-xl font-bold">
            {company?.company_name ?? company?.name ?? 'Company Name'}
          </h1>
          {company?.address && <div>{company.address}</div>}
          {company?.phone   && <div>Phone: +88 {company.phone}</div>}
        </div>

        <h2 className="mb-4 text-center text-lg font-semibold underline">
          Received Voucher
        </h2>

        {/* meta */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Voucher&nbsp;No :</strong> {receivedAdd.voucher_no}</p>
            <p><strong>Account&nbsp;Mode :</strong> {receivedAdd.received_mode?.mode_name}</p>
          </div>
          <div className="text-right">
            <p><strong>Date :</strong> {fmtDate(receivedAdd.date)}</p>
          </div>
        </div>

        {/* particulars */}
        <table className="mb-6 w-full border border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-1 text-left">Particulars</th>
              <th className="border px-3 py-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-3 py-1">
                {receivedAdd.account_ledger?.account_ledger_name}
              </td>
              <td className="border px-3 py-1 text-right">
                {(+receivedAdd.amount).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* note */}
        <p className="mb-4">
          <strong>Note :</strong> {receivedAdd.description ?? '—'}
        </p>

        {/* totals */}
        <div className="mb-6 text-right">
          <p className="text-base">
            <strong>Grand&nbsp;Total :</strong> {(+receivedAdd.amount).toFixed(2)}
          </p>
          <p>
            <strong>In&nbsp;Words :</strong> {amountWords}
          </p>
        </div>

        {/* signatures */}
        <div className="mt-10 grid grid-cols-3 gap-6 text-center text-sm">
          {['Received By','Verified By','Authorised Signatory'].map(t=>(
            <p key={t} className="border-t pt-2">{t}</p>
          ))}
        </div>

        {/* action footer (hidden on print) */}
        <ActionFooter
          className="justify-center print:hidden"
          cancelHref="/received-add"
          cancelText="Back"
          onSubmit={()=>window.print()}
          submitText="Print"
        />
      </div>
    </AppLayout>
  );
}
