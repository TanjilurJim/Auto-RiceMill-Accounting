import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Row {
  party_name: string;
  total_qty: number;
  total_amount: number;
}

interface Company {
  company_name: string;
  email?: string;
  mobile?: string;
  address?: string;
  logo_path?: string;
}

export default function SalePartyReport({
  entries,
  filters,
  company,
}: {
  entries: Row[];
  filters: { from_date: string; to_date: string; year?: string };
  company: Company;
}) {
  const handlePrint = () => window.print();

  const totalQty = entries.reduce((sum, r) => sum + Number(r.total_qty ?? 0), 0);
  const totalAmount = entries.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0);

  return (
    <AppLayout title="Party-wise Sale Report">
      <div className="max-w-full space-y-4 p-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-background py-6 text-center relative">
            {company?.logo_path && (
              <img
                src={company?.logo_path}
                alt="Company Logo"
                className="mx-auto mb-2 h-16 w-16 object-cover"
              />
            )}
            <h1 className="text-3xl font-bold uppercase">{company?.company_name}</h1>
            {company?.address && <p className="text-sm">{company?.address}</p>}
            {company?.mobile && <p className="text-sm">Phone: {company?.mobile}</p>}
            {company?.email && <p className="text-sm">{company?.email}</p>}

            <div className="mt-4">
              <h2 className="text-xl font-semibold underline">Party-wise Sales Report</h2>
              {filters.year ? (
                <p className="text-sm">
                  Showing for Year <strong>{filters.year}</strong>
                </p>
              ) : (
                <p className="text-sm">
                  From <strong>{filters.from_date}</strong> to <strong>{filters.to_date}</strong>
                </p>
              )}
            </div>

            <div className="absolute top-16 right-4 print:hidden">
              <Link href={route('reports.sale.filter', { tab: 'party' })} className="text-sm text-blue-600 hover:underline">
                Change Filters
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                <thead className="bg-gray-100 print:bg-white">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Party</th>
                    <th className="border px-2 py-1 text-right">Qty</th>
                    <th className="border px-2 py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length ? (
                    <>
                      {entries.map((r, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1">{i + 1}</td>
                          <td className="border px-2 py-1">{r.party_name}</td>
                          <td className="border px-2 py-1 text-right">{Number(r.total_qty ?? 0).toFixed(2)}</td>
                          <td className="border px-2 py-1 text-right">{Number(r.total_amount ?? 0).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-semibold print:bg-white">
                        <td colSpan={2} className="border px-2 py-1 text-right">Grand Total</td>
                        <td className="border px-2 py-1 text-right">{totalQty.toFixed(2)}</td>
                        <td className="border px-2 py-1 text-right">{totalAmount.toFixed(2)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={4} className="border px-4 py-4 text-center text-gray-500">No data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <a
                href={route('reports.sale.export', { tab: 'party', type: 'pdf', ...filters })}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileText className="h-4 w-4" /> Save PDF
              </a>
              <a
                href={route('reports.sale.export', { tab: 'party', type: 'xlsx', ...filters })}
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileSpreadsheet className="h-4 w-4" /> Export Excel
              </a>
            </div>
          </CardContent>

          <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>{company?.company_name} • {company?.email}</span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
