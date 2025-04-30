import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Row {
  return_date: string;
  voucher_no: string;
  party: string;
  item_name: string;
  unit_name: string;
  qty: number;
  rate: number;
  amount: number;
}

interface Company {
  company_name: string;
  email?: string;
  mobile?: string;
  address?: string;
}

export default function SaleReturnReport({
  entries,
  filters,
  company,
}: {
  entries: Row[];
  filters: { from_date: string; to_date: string };
  company: Company;
}) {
  const handlePrint = () => window.print();

  const totalQty = entries.reduce((sum, r) => sum + Number(r.qty ?? 0), 0);
  const totalAmount = entries.reduce((sum, r) => sum + Number(r.amount ?? 0), 0);

  return (
    <AppLayout title="Sales Return Report">
      <div className="mx-auto max-w-7xl space-y-4 p-4">
        <Card className="shadow-lg">

          {/* Header */}
          <CardHeader className="bg-gray-50 py-6 text-center relative">
            <h1 className="text-3xl font-bold uppercase">{company.company_name}</h1>
            {company.address && <p className="text-sm">{company.address}</p>}
            {company.mobile && <p className="text-sm">Phone: {company.mobile}</p>}
            {company.email && <p className="text-sm">{company.email}</p>}

            <div className="mt-4">
              <h2 className="text-xl font-semibold underline">Sales Return Report</h2>
              <p className="text-sm">
                From <strong>{filters.from_date}</strong> to <strong>{filters.to_date}</strong>
              </p>
            </div>

            <div className="absolute top-4 right-4 print:hidden">
              <Link href={route('reports.sale.filter', { tab: 'return' })} className="text-sm text-blue-600 hover:underline">
                Change Filters
              </Link>
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                <thead className="bg-gray-100 print:bg-white">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Return Date</th>
                    <th className="border px-2 py-1">Voucher No</th>
                    <th className="border px-2 py-1">Party</th>
                    <th className="border px-2 py-1">Item</th>
                    <th className="border px-2 py-1 text-right">Qty</th>
                    <th className="border px-2 py-1">Unit</th>
                    <th className="border px-2 py-1 text-right">Rate</th>
                    <th className="border px-2 py-1 text-right">Amount (Tk)</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length ? (
                    <>
                      {entries.map((r, i) => (
                        <tr key={i}>
                          <td className="border px-2 py-1">{i + 1}</td>
                          <td className="border px-2 py-1">{new Date(r.return_date).toLocaleDateString()}</td>
                          <td className="border px-2 py-1">{r.voucher_no}</td>
                          <td className="border px-2 py-1">{r.party}</td>
                          <td className="border px-2 py-1">{r.item_name}</td>
                          <td className="border px-2 py-1 text-right">{Number(r.qty ?? 0).toFixed(2)}</td>
                          <td className="border px-2 py-1">{r.unit_name}</td>
                          <td className="border px-2 py-1 text-right">{Number(r.rate ?? 0).toFixed(2)}</td>
                          <td className="border px-2 py-1 text-right">{Number(r.amount ?? 0).toFixed(2)}</td>
                        </tr>
                      ))}

                      {/* Grand Total */}
                      <tr className="bg-gray-100 font-semibold print:bg-white">
                        <td colSpan={5} className="border px-2 py-1 text-right">Grand Total</td>
                        <td className="border px-2 py-1 text-right">{totalQty.toFixed(2)}</td>
                        <td></td>
                        <td></td>
                        <td className="border px-2 py-1 text-right">{totalAmount.toFixed(2)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={9} className="border px-4 py-4 text-center text-gray-500">No data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <a
                href={route('reports.sale.export', { tab: 'return', type: 'pdf', ...filters })}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileText className="h-4 w-4" /> Save PDF
              </a>
              <a
                href={route('reports.sale.export', { tab: 'return', type: 'xlsx', ...filters })}
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileSpreadsheet className="h-4 w-4" /> Export Excel
              </a>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>{company.company_name} • {company.email}</span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
