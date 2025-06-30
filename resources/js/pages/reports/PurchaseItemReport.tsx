import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Row {
  item_name:  string;
  unit_name:  string;       // make sure getItemData() joins units
  total_qty:  number;
  net_amount: number;
}

interface Company {
  company_name: string;
  email?:  string;
  mobile?: string;
  address?: string;
  logo_path?: string;
}

export default function PurchaseItemReport({
  entries,
  filters,
  company,
}: {
  entries: Row[];
  filters: { from_date: string; to_date: string; item_id?: string };
  company: Company;
}) {
  /* ── Totals ─────────────────────────────────────────────── */
  const totalQty = entries.reduce((s, r) => s + Number(r.total_qty), 0);
  const totalAmt = entries.reduce((s, r) => s + Number(r.net_amount), 0);

  /* grand-total bucket by unit */
  const qtyByUnit = entries.reduce((acc: Record<string, number>, r) => {
    acc[r.unit_name] = (acc[r.unit_name] || 0) + Number(r.total_qty);
    return acc;
  }, {});

  const handlePrint = () => window.print();

  return (
    <AppLayout title="Item-wise Purchase Report">
      <div className="max-w-full space-y-4 p-4">
        <Card className="shadow-lg">
          {/* ── Header ───────────────────────────────────────── */}
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
                Item-wise Purchase Report
              </h2>
              <p className="text-sm text-gray-600">
                From&nbsp;<strong>{filters.from_date}</strong> to&nbsp;
                <strong>{filters.to_date}</strong>
              </p>
            </div>

            <div className="absolute top-16 right-4 print:hidden">
              <Link
                href={route('reports.purchase.filter', { tab: 'item' })}
                className="text-sm text-blue-600 hover:underline"
              >
                Change Filters
              </Link>
            </div>
          </CardHeader>

          {/* ── Body ─────────────────────────────────────────── */}
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                <thead className="bg-gray-100 print:bg-white">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Item&nbsp;Name</th>
                    <th className="border px-2 py-1 text-right">Total&nbsp;Qty</th>
                    <th className="border px-2 py-1">Unit</th>
                    <th className="border px-2 py-1 text-right">Net&nbsp;Amount&nbsp;(Tk)</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length ? (
                    <>
                      {entries.map((r, i) => (
                        <tr key={i} className="print:bg-white">
                          <td className="border px-2 py-1">{i + 1}</td>
                          <td className="border px-2 py-1">{r.item_name}</td>
                          <td className="border px-2 py-1 text-right">
                            {Number(r.total_qty).toFixed(2)}
                          </td>
                          <td className="border px-2 py-1">{r.unit_name}</td>
                          <td className="border px-2 py-1 text-right">
                            {Number(r.net_amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* grand total */}
                      <tr className="bg-gray-100 font-semibold print:bg-white">
                        <td className="border px-2 py-1 text-right" colSpan={2}>
                          Grand&nbsp;Total
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {totalQty.toFixed(2)}
                        </td>
                        <td className="border px-2 py-1"></td>
                        <td className="border px-2 py-1 text-right">
                          {totalAmt.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No purchase data found.
                      </td>
                    </tr>
                  )}

                  {/* totals by unit */}
                  <tr className="bg-gray-50">
                    <td
                      className="border px-2 py-2 text-sm font-medium"
                      colSpan={5}
                    >
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
                </tbody>
              </table>
            </div>

            {/* ── Action buttons ────────────────────────────── */}
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>

              <a
                href={route('reports.purchase.export', {
                  tab: 'item',
                  type: 'pdf',
                  ...filters,
                })}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileText className="h-4 w-4" /> Save&nbsp;as&nbsp;PDF
              </a>

              <a
                href={route('reports.purchase.export', {
                  tab: 'item',
                  type: 'xlsx',
                  ...filters,
                })}
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileSpreadsheet className="h-4 w-4" /> Export&nbsp;Excel
              </a>
            </div>
          </CardContent>

          {/* ── Footer ─────────────────────────────────────── */}
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
