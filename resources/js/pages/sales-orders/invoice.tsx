import ActionFooter from '@/components/ActionFooter';
import AppLayout    from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

/* ─── props ─── */
interface Unit      { name : string }
interface Product   { item_name: string; unit?: Unit }
interface ItemRow   { id:number; quantity:number; rate:number;
                      discount_value:number; discount_type:'flat'|'percentage';
                      subtotal:number; product?:Product }
interface Ledger    { account_ledger_name:string }
interface Company   { company_name?:string; name?:string;
                      address?:string; phone?:string; logo_url?:string }
interface Order     { id:number; voucher_no:string; date:string;
                      ledger:Ledger; salesman?:{name:string};
                      items:ItemRow[]; total_qty:number; total_amount:number }

export default function SalesOrderInvoice(
  { order, company, amountWords }:
  { order:Order; company:Company; amountWords:string }) {

  const handlePrint = () => window.print();

  return (
    <AppLayout>
      <Head title={`Sales-Order #${order.voucher_no}`} />

      <div className="container mx-auto bg-background shadow p-8 print:p-4">

        {/* Back link (ignored on print) */}
        <Link href="/sales-orders"
              className="mb-4 inline-block rounded bg-background px-4 py-2 hover:bg-neutral-100 print:hidden">
          Back
        </Link>

        {/* Company header */}
        <div className="mb-6 text-center print:text-xs">
          {company?.logo_url &&
            <img src={company?.logo_url} className="mx-auto h-20 object-contain mb-2 print:h-12" />}
          <h1 className="text-2xl font-bold uppercase">
            {company?.company_name ?? company?.name}
          </h1>
          {company?.address && <div>{company?.address}</div>}
          {company?.phone   && <div>Phone: +88 {company?.phone}</div>}
          <h2 className="mt-3 font-semibold">SALES ORDER</h2>
        </div>

        {/* Meta */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Customer&nbsp;:</strong> {order.ledger.account_ledger_name}</p>
            {order.salesman &&
              <p><strong>Salesman :</strong> {order.salesman.name}</p>}
          </div>
          <div>
            <p><strong>Date :</strong> {order.date}</p>
            <p><strong>Voucher No :</strong> {order.voucher_no}</p>
          </div>
        </div>

        {/* Item table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">SL</th>
                <th className="border px-2 py-1 text-left">Description</th>
                <th className="border px-2 py-1">Unit</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Rate</th>
                <th className="border px-2 py-1">Disc.</th>
                <th className="border px-2 py-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((row, i) => (
                <tr key={row.id ?? i}>
                  <td className="border px-2 py-1 text-center">{i+1}</td>
                  <td className="border px-2 py-1">{row.product?.item_name}</td>
                  <td className="border px-2 py-1 text-center">{row.product?.unit?.name}</td>
                  <td className="border px-2 py-1 text-right">{row.quantity}</td>
                  <td className="border px-2 py-1 text-right">{row.rate}</td>
                  <td className="border px-2 py-1 text-right">
                    {row.discount_value}
                    {row.discount_type === 'percentage' && '%'}
                  </td>
                  <td className="border px-2 py-1 text-right">{row.subtotal}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50">
                <td colSpan={3} className="border px-2 py-1 text-right">Total</td>
                <td className="border px-2 py-1 text-right">{order.total_qty}</td>
                <td colSpan={2} className="border"></td>
                <td className="border px-2 py-1 text-right">{order.total_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount in words */}
        <p className="mb-4 text-sm"><strong>In words :</strong> {amountWords}</p>

        {/* Signatures */}
        <div className="mt-8 flex justify-between text-center print:mt-16">
          {['Receiver', 'Checked By', 'Authorised Signatory'].map(t => (
            <div key={t} className="w-1/3">
              <p className="border-t-2 mt-8 pt-2 inline-block w-32"></p><br />
              <span className="text-xs">{t}</span>
            </div>
          ))}
        </div>

        {/* Action buttons (hidden on print) */}
        <ActionFooter
          className="justify-center print:hidden"
          cancelHref="/sales-orders"
          cancelText="Back"
          onSubmit={handlePrint}
          submitText="Print"
        />

      </div>
    </AppLayout>
  );
}
