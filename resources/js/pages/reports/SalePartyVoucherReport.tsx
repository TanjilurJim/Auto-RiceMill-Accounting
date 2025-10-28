import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Row {
  party_name: string;
  date: string;
  voucher_no: string;
  total_qty: number;
  total_sales: number;
  total_cost: number;
  total_profit: number;
}

interface Company { company_name: string; email?: string; mobile?: string; address?: string; logo_url?: string; }

export default function SalePartyVoucherReport({
  entries,
  filters,
  company,
}: {
  entries: Row[];
  filters: { from_date: string; to_date: string; year?: string; party_id?: number | string };
  company: Company;
}) {
  const handlePrint = () => window.print();

  const totals = entries.reduce((a, r) => {
    a.qty += Number(r.total_qty || 0);
    a.sales += Number(r.total_sales || 0);
    a.cost += Number(r.total_cost || 0);
    a.profit += Number(r.total_profit || 0);
    return a;
  }, { qty: 0, sales: 0, cost: 0, profit: 0 });

  const profitPct = totals.sales ? (totals.profit / totals.sales) * 100 : 0;
  const tone = (n: number) => n > 0 ? 'text-green-600 font-semibold' : n < 0 ? 'text-red-600 font-semibold' : '';

  return (
    <AppLayout title="Party-wise Voucher Profit/Loss">
      <div className="max-w-full space-y-4 p-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-background relative py-6 text-center">
            {company?.logo_url && <img src={company.logo_url} className="mx-auto mb-2 h-20 object-contain print:h-12" alt="Logo" />}
            <h1 className="text-3xl font-bold uppercase">{company?.company_name}</h1>
            {company?.address && <p className="text-sm">{company.address}</p>}
            {company?.mobile && <p className="text-sm">Phone: {company.mobile}</p>}
            {company?.email && <p className="text-sm">{company.email}</p>}

            <div className="mt-4">
              <h2 className="text-xl font-semibold underline">Party-wise Voucher Profit/Loss</h2>
              {filters.year
                ? <p className="text-sm">For Year <strong>{filters.year}</strong></p>
                : <p className="text-sm">From <strong>{filters.from_date}</strong> to <strong>{filters.to_date}</strong></p>}
            </div>

            <div className="absolute right-4 top-16 print:hidden">
              <Link href={route('reports.sale.filter', { tab: 'party_detail' })} className="text-sm text-blue-600 hover:underline">
                Change Filters
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* summary strip */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Total Sales</div>
                <div className="text-lg font-semibold">{totals.sales.toFixed(2)}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Total Cost</div>
                <div className="text-lg font-semibold">{totals.cost.toFixed(2)}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Total Profit</div>
                <div className={`text-lg font-semibold ${tone(totals.profit)}`}>{totals.profit.toFixed(2)}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Profit %</div>
                <div className="text-lg font-semibold">{profitPct.toFixed(2)}%</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                <thead className="bg-background">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Party</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Voucher</th>
                    <th className="border px-2 py-1 text-right">Qty</th>
                    <th className="border px-2 py-1 text-right">Sales</th>
                    <th className="border px-2 py-1 text-right">Cost</th>
                    <th className="border px-2 py-1 text-right">Profit</th>
                    <th className="border px-2 py-1 text-right">Profit %</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length ? entries.map((r, i) => {
                    const sales = Number(r.total_sales || 0);
                    const profit = Number(r.total_profit || 0);
                    const pct = sales ? (profit / sales) * 100 : 0;
                    return (
                      <tr key={i}>
                        <td className="border px-2 py-1">{i + 1}</td>
                        <td className="border px-2 py-1">{r.party_name}</td>
                        <td className="border px-2 py-1">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="border px-2 py-1">{r.voucher_no}</td>
                        <td className="border px-2 py-1 text-right">{Number(r.total_qty || 0).toFixed(2)}</td>
                        <td className="border px-2 py-1 text-right">{sales.toFixed(2)}</td>
                        <td className="border px-2 py-1 text-right">{Number(r.total_cost || 0).toFixed(2)}</td>
                        <td className={`border px-2 py-1 text-right ${tone(profit)}`}>{profit.toFixed(2)}</td>
                        <td className="border px-2 py-1 text-right">{pct.toFixed(2)}%</td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={9} className="border px-4 py-4 text-center text-gray-500">No data found.</td></tr>
                  )}
                  {/* grand total */}
                  {entries.length ? (
                    <tr className="bg-background font-semibold">
                      <td colSpan={4} className="border px-2 py-1 text-right">Grand Total</td>
                      <td className="border px-2 py-1 text-right">{totals.qty.toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">{totals.sales.toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">{totals.cost.toFixed(2)}</td>
                      <td className={`border px-2 py-1 text-right ${tone(totals.profit)}`}>{totals.profit.toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">{profitPct.toFixed(2)}%</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {/* actions */}
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
              <a href={route('reports.sale.export', { tab: 'party_detail', type: 'pdf', ...filters })} target="_blank"
                 className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-background">
                <FileText className="h-4 w-4" /> Save PDF
              </a>
              <a href={route('reports.sale.export', { tab: 'party_detail', type: 'xlsx', ...filters })}
                 className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-background">
                <FileSpreadsheet className="h-4 w-4" /> Export Excel
              </a>
            </div>
          </CardContent>

          <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>{company?.company_name}{company?.email ? ` • ${company.email}` : ''}</span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
