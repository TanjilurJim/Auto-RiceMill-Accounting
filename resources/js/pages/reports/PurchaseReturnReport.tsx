/*  resources/js/pages/reports/PurchaseReturnReport.tsx  */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Printer, FileText, FileSpreadsheet } from 'lucide-react';

/* ───────────────────────────────────────────────────
   Types that match getReturnData()
   ───────────────────────────────────────────────────*/
interface Row {
  date:        string;
  voucher_no:  string;
  supplier:    string;
  item:        string;    //  Amon – 10 Kg, Shonali – 2 Bag, …
  qty:         number;    //  voucher-total quantity
  unit_name:   string;    //  blank when mixed units
  net_return:  number;    //  grand_total in DB
}

interface Company {
  company_name: string;
  email?:  string;
  mobile?: string;
  address?: string;
  logo_path?: string;
}

export default function PurchaseReturnReport({
  entries,
  filters,
  company,
}: {
  entries:  Row[];
  filters:  { from_date: string; to_date: string };
  company:  Company;
}) {
  /* ── grand totals ───────────────────────────────── */
  const totalQty = entries.reduce((s, r) => s + Number(r.qty),        0);
  const totalAmt = entries.reduce((s, r) => s + Number(r.net_return), 0);

  /*  bucket totals per unit (Kg, Bag …)  */
  const qtyByUnit = entries.reduce((acc: Record<string,number>, r) => {
    if (r.unit_name) {
      acc[r.unit_name] = (acc[r.unit_name] || 0) + Number(r.qty);
    }
    return acc;
  }, {});

  const handlePrint = () => window.print();

  return (
    <AppLayout title="Purchase Return Report">
      <div className="max-w-full space-y-4 p-4">
        <Card className="shadow-lg">
          {/* ───────────── header ───────────── */}
          <CardHeader className="bg-gray-50 py-6 text-center">
            <div className="space-y-1">
              {company?.logo_path && (
                <img
                  src={company?.logo_path}
                  alt="Company Logo"
                  className="mx-auto mb-2 h-16 w-16 object-cover"
                />
              )}
              <h1 className="text-3xl font-bold uppercase">
                {company?.company_name ?? 'Company Name'}
              </h1>
              {company?.address && (
                <p className="text-sm text-gray-700">{company?.address}</p>
              )}
              {company?.mobile && (
                <p className="text-sm text-gray-700">Phone: {company?.mobile}</p>
              )}
              {(company?.email || company?.website) && (
                <p className="text-sm text-gray-700">
                  {company?.email && <span>{company?.email}</span>}
                  {company?.email && company?.website && <span className="mx-1">|</span>}
                  {company?.website && <span>{company?.website}</span>}
                </p>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold underline">
                Purchase Return Report
              </h2>
              <p className="text-sm text-gray-600">
                From&nbsp;<strong>{filters.from_date}</strong>&nbsp;to&nbsp;
                <strong>{filters.to_date}</strong>
              </p>
            </div>

            <div className="absolute top-16 right-4 print:hidden">
              <Link
                href={route('reports.purchase.filter', { tab: 'return' })}
                className="text-sm text-blue-600 hover:underline"
              >
                Change Filters
              </Link>
            </div>
          </CardHeader>

          {/* ───────────── table ───────────── */}
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                <thead className="bg-gray-100 print:bg-white">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Vch&nbsp;No</th>
                    <th className="border px-2 py-1">Supplier</th>
                    <th className="border px-2 py-1">Item</th>
                    <th className="border px-2 py-1 text-right">Qty</th>
                    <th className="border px-2 py-1">Unit</th>
                    <th className="border px-2 py-1 text-right">Return&nbsp;(Tk)</th>
                  </tr>
                </thead>

                <tbody>
                  {entries.length ? (
                    <>
                      {entries.map((r, i) => (
                        <tr key={i} className="print:bg-white">
                          <td className="border px-2 py-1">{i + 1}</td>
                          <td className="border px-2 py-1">
                            {new Date(r.date).toLocaleDateString()}
                          </td>
                          <td className="border px-2 py-1">{r.voucher_no}</td>
                          <td className="border px-2 py-1">{r.supplier}</td>
                          <td className="border px-2 py-1">{r.item}</td>
                          <td className="border px-2 py-1 text-right">
                            {Number(r.qty).toFixed(2)}
                          </td>
                          <td className="border px-2 py-1">{r.unit_name}</td>
                          <td className="border px-2 py-1 text-right">
                            {Number(r.net_return).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* ─── grand total row ─── */}
                      <tr className="bg-gray-100 font-semibold print:bg-white">
                        <td className="border px-2 py-1 text-right" colSpan={5}>
                          Grand&nbsp;Total
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {totalQty.toFixed(2)}
                        </td>
                        {/* blank unit column */}
                        <td className="border px-2 py-1"></td>
                        <td className="border px-2 py-1 text-right">
                          {totalAmt.toFixed(2)}
                        </td>
                      </tr>

                      {/* ─── qty by unit list ─── */}
                      <tr className="bg-gray-50 print:bg-white">
                        <td className="border px-2 py-2 text-sm font-medium" colSpan={8}>
                          <strong>Total Qty by Unit:</strong>
                          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
                            {Object.entries(qtyByUnit).map(([u, q]) => (
                              <li key={u}>
                                {q.toFixed(2)} {u}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                        No purchase-return data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ───────────── buttons ───────────── */}
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>

              <a
                href={route('reports.purchase.export', {
                  tab:  'return',
                  type: 'pdf',
                  ...filters,
                })}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileText className="h-4 w-4" /> Save&nbsp;PDF
              </a>

              <a
                href={route('reports.purchase.export', {
                  tab:  'return',
                  type: 'xlsx',
                  ...filters,
                })}
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileSpreadsheet className="h-4 w-4" /> Export&nbsp;Excel
              </a>
            </div>
          </CardContent>

          {/* ───────────── footer ───────────── */}
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>
              {company?.company_name} • {company?.email}
            </span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
