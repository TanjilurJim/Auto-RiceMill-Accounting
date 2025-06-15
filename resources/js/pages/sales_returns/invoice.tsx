import ActionFooter from '@/components/ActionFooter';
import AppLayout    from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

/* —— types —— */
interface Unit   { name : string }
interface Prod   { item_name : string; unit?: Unit }
interface Row    { id:number; qty:number; main_price:number;
                   return_amount:number; product?:Prod }
interface Ledger { account_ledger_name:string }
interface Company{ company_name?:string; name?:string; address?:string;
                   phone?:string; logo_url?:string }
interface Return { id:number; voucher_no:string; return_date:string;
                   ledger_id?:number; account_ledger:Ledger;
                   items:Row[] }

export default function SalesReturnInvoice(
  { return:ret, company, amountWords }:
  { return:Return; company:Company; amountWords:string }) {

  /* auto-print when the view opens (optional) */
  useEffect(() => window.print(), []);

  const totalQty   = ret.items.reduce((s,r)=>s + (+r.qty||0),0);
  const totalAmt   = ret.items.reduce((s,r)=>s + (+r.return_amount||0),0);

  const handlePrint = () => window.print();

  return (
    <AppLayout>
      <Head title={`Sales-Return #${ret.voucher_no}`} />

      <div className="container mx-auto bg-white shadow p-8 print:p-4">

        {/* back link – hidden on print */}
        <Link href="/sales-returns"
              className="mb-4 inline-block rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100 print:hidden">
          Back
        </Link>

        {/* company header */}
        <div className="mb-6 text-center print:text-xs">
          {company.logo_url &&
            <img src={company.logo_url} className="mx-auto h-20 object-contain mb-2 print:h-12" />}
          <h1 className="text-2xl font-bold uppercase">
            {company.company_name ?? company.name}
          </h1>
          {company.address && <div>{company.address}</div>}
          {company.phone   && <div>Phone: +88 {company.phone}</div>}
          <h2 className="mt-3 font-semibold">SALES RETURN INVOICE</h2>
        </div>

        {/* meta */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Voucher&nbsp;No :</strong> {ret.voucher_no}</p>
            <p><strong>Account&nbsp;:</strong> {ret.account_ledger.account_ledger_name}</p>
          </div>
          <div>
            <p><strong>Date :</strong> {ret.return_date}</p>
          </div>
        </div>

        {/* item table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">SL</th>
                <th className="border px-2 py-1 text-left">Description</th>
                <th className="border px-2 py-1">Unit</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Rate</th>
                <th className="border px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {ret.items.map((r,i)=>(
                <tr key={r.id ?? i}>
                  <td className="border px-2 py-1 text-center">{i+1}</td>
                  <td className="border px-2 py-1">{r.product?.item_name}</td>
                  <td className="border px-2 py-1 text-center">{r.product?.unit?.name}</td>
                  <td className="border px-2 py-1 text-right">{(+r.qty).toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">{(+r.main_price).toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">{(+r.return_amount).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50">
                <td colSpan={3} className="border px-2 py-1 text-right">Total</td>
                <td className="border px-2 py-1 text-right">{totalQty.toFixed(2)}</td>
                <td className="border"></td>
                <td className="border px-2 py-1 text-right">{totalAmt.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* amount in words */}
        <p className="mb-4 text-sm"><strong>In words :</strong> {amountWords}</p>

        {/* signatures */}
        <div className="mt-8 flex justify-between text-center print:mt-16">
          {['Receiver', 'Checked By', 'Authorised Signatory'].map(t=>(
            <div key={t} className="w-1/3">
              <p className="border-t-2 mt-8 pt-2 inline-block w-32"></p><br/>
              <span className="text-xs">{t}</span>
            </div>
          ))}
        </div>

        {/* actions – hidden on print */}
        <ActionFooter
          className="justify-center print:hidden"
          cancelHref="/sales-returns"
          cancelText="Back"
          onSubmit={handlePrint}
          submitText="Print"
        />

      </div>
    </AppLayout>
  );
}
