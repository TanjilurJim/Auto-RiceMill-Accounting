import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Row {
  date: string;
  voucher_no: string;
  item_name: string;
  qty: number;
  unit_name: string;
  sale_price: number;        // unit sale rate
  purchase_price: number;    // unit cost rate
  profit: number;            // total profit (= (sale - cost) * qty) from backend
  month?: number;
}

interface Company {
  company_name: string;
  email?: string;
  mobile?: string;
  address?: string;
  logo_path?: string;
  logo_url?: string;
  logo_thumb_url?: string;
  website?: string;
  financial_year?: string; // <-- string, not varChar
}

export default function SaleAllProfitLossReport({
  entries,
  filters,
  company,
}: {
  entries: Row[];
  filters: { from_date: string; to_date: string; year?: string };
  company: Company;
}) {
  const isYear = !!filters.year;
  const handlePrint = () => window.print();

  // Totals (detail view only)
  const totals = entries.reduce(
    (acc, r) => {
      const qty = Number(r.qty || 0);
      const saleRate = Number(r.sale_price || 0);
      const costRate = Number(r.purchase_price || 0);
      const saleAmt = saleRate * qty;
      const costAmt = costRate * qty;
      const profitAmt = Number(
        r.profit !== undefined ? r.profit : (saleRate - costRate) * qty
      );
      acc.qty += qty;
      acc.sales += saleAmt;
      acc.cost += costAmt;
      acc.profit += profitAmt;
      return acc;
    },
    { qty: 0, sales: 0, cost: 0, profit: 0 }
  );

  const totalProfitPct = totals.sales ? (totals.profit / totals.sales) * 100 : 0;

  const profitTone = (v: number) =>
    v > 0 ? 'text-green-600 font-semibold' : v < 0 ? 'text-red-600 font-semibold' : '';

  return (
    <AppLayout title="All Sales Profit & Loss">
      <div className="max-w-full space-y-4 p-4">
        <Card className="shadow-lg">
          {/* Header */}
          <CardHeader className="bg-background relative py-6 text-center">
            {company?.logo_url && (
                                <img src={company.logo_url} alt="Company Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />
                            )}
            <h1 className="text-3xl font-bold uppercase">{company?.company_name}</h1>
            {company?.address && <p className="text-sm">{company.address}</p>}
            {company?.mobile && <p className="text-sm">Phone: {company.mobile}</p>}
            {company?.email && <p className="text-sm">{company.email}</p>}

            <div className="mt-4">
              <h2 className="text-xl font-semibold underline">Sales Profit &amp; Loss Summary</h2>
              {isYear ? (
                <p className="text-sm">For Year <strong>{filters.year}</strong></p>
              ) : (
                <p className="text-sm">From <strong>{filters.from_date}</strong> to <strong>{filters.to_date}</strong></p>
              )}
            </div>

            <div className="absolute right-4 top-16 print:hidden">
              <Link href={route('reports.sale.filter', { tab: 'all' })} className="text-sm text-blue-600 hover:underline">
                Change Filters
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Summary strip */}
            {!isYear && (
              <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">Total Sales Amount</div>
                  <div className="text-lg font-semibold">{totals.sales.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">Total Cost Valuation</div>
                  <div className="text-lg font-semibold">{totals.cost.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">Total Profit</div>
                  <div className={`text-lg font-semibold ${profitTone(totals.profit)}`}>{totals.profit.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">Profit %</div>
                  <div className="text-lg font-semibold">{totalProfitPct.toFixed(2)}%</div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                <thead className="bg-background print:bg-white">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    {isYear ? (
                      <>
                        <th className="border px-2 py-1">Month</th>
                        <th className="border px-2 py-1 text-right">Profit (Tk)</th>
                      </>
                    ) : (
                      <>
                        <th className="border px-2 py-1">Date</th>
                        <th className="border px-2 py-1">Vch No</th>
                        <th className="border px-2 py-1">Item</th>
                        <th className="border px-2 py-1 text-right">Qty</th>
                        <th className="border px-2 py-1">Unit</th>
                        <th className="border px-2 py-1 text-right">Sale Rate</th>
                        <th className="border px-2 py-1 text-right">Sale Amount</th>
                        <th className="border px-2 py-1 text-right">Cost Rate</th>
                        <th className="border px-2 py-1 text-right">Cost Amount</th>
                        <th className="border px-2 py-1 text-right">Profit/Unit</th>
                        <th className="border px-2 py-1 text-right">Profit Amount</th>
                        <th className="border px-2 py-1 text-right">Profit %</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {entries.length ? (
                    <>
                      {entries.map((r, i) => {
                        const qty = Number(r.qty || 0);
                        const saleRate = Number(r.sale_price || 0);
                        const costRate = Number(r.purchase_price || 0);
                        const saleAmt = saleRate * qty;
                        const costAmt = costRate * qty;
                        const profitPerUnit = saleRate - costRate;
                        const profitAmt = Number(
                          r.profit !== undefined ? r.profit : profitPerUnit * qty
                        );
                        const profitPct = saleAmt > 0 ? (profitAmt / saleAmt) * 100 : 0;

                        return (
                          <tr key={i}>
                            <td className="border px-2 py-1">{i + 1}</td>
                            {isYear ? (
                              <>
                                <td className="border px-2 py-1">
                                  {new Date(Number(filters.year), (r.month ?? 1) - 1).toLocaleString('default', { month: 'long' })}
                                </td>
                                <td className="border px-2 py-1 text-right">{Number(r.profit ?? 0).toFixed(2)}</td>
                              </>
                            ) : (
                              <>
                                <td className="border px-2 py-1">{new Date(r.date).toLocaleDateString()}</td>
                                <td className="border px-2 py-1">{r.voucher_no}</td>
                                <td className="border px-2 py-1">{r.item_name}</td>
                                <td className="border px-2 py-1 text-right">{qty.toFixed(2)}</td>
                                <td className="border px-2 py-1">{r.unit_name}</td>
                                <td className="border px-2 py-1 text-right">{saleRate.toFixed(2)}</td>
                                <td className="border px-2 py-1 text-right">{saleAmt.toFixed(2)}</td>
                                <td className="border px-2 py-1 text-right">{costRate.toFixed(2)}</td>
                                <td className="border px-2 py-1 text-right">{costAmt.toFixed(2)}</td>
                                <td className="border px-2 py-1 text-right">{profitPerUnit.toFixed(2)}</td>
                                <td className={`border px-2 py-1 text-right ${profitTone(profitAmt)}`}>{profitAmt.toFixed(2)}</td>
                                <td className="border px-2 py-1 text-right">{profitPct.toFixed(2)}%</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                      {/* Grand totals row */}
                      <tr className="bg-background font-semibold print:bg-white">
                        <td
                          colSpan={isYear ? 3 : 13}
                          className="border px-2 py-2 text-right"
                        >
                          {isYear ? (
                            <>Total Profit: {entries.reduce((s, r) => s + Number(r.profit || 0), 0).toFixed(2)}</>
                          ) : (
                            <div className="flex flex-col gap-1 text-right sm:flex-row sm:items-center sm:justify-end sm:gap-6">
                              <span>Total Sales: {totals.sales.toFixed(2)}</span>
                              <span>Total Cost: {totals.cost.toFixed(2)}</span>
                              <span>
                                Total Profit:{' '}
                                <span className={profitTone(totals.profit)}>{totals.profit.toFixed(2)}</span>
                              </span>
                              <span>Profit %: {totalProfitPct.toFixed(2)}%</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={isYear ? 3 : 13} className="border px-4 py-4 text-center text-gray-500">
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <a
                href={route('reports.sale.export', { tab: 'all', type: 'pdf', ...filters })}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileText className="h-4 w-4" /> Save PDF
              </a>
              <a
                href={route('reports.sale.export', { tab: 'all', type: 'xlsx', ...filters })}
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileSpreadsheet className="h-4 w-4" /> Export Excel
              </a>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>
              {company?.company_name}
              {company?.email ? ` • ${company.email}` : ''}
            </span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
