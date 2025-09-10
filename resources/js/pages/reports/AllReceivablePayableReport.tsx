import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

// remove router, useForm, Info import (unused)

interface LedgerEntry {
  ledger_id: number;
  ledger_name: string;
  group_name: string | null;
  balance: number;
  type: 'DR' | 'CR';
}
interface Props extends PageProps {
  from_date?: string | null;
  to_date?: string | null;
  receivables: LedgerEntry[];
  payables: LedgerEntry[];
  company: {
    company_name: string;
    phone: string;
    address: string;
    logo_path?: string;
    // email?: string; // add if you want to show email in footer
  };
}

export default function AllReceivablePayableReport({
  from_date,
  to_date,
  receivables,
  payables,
  company,
}: Props) {
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(n || 0);

  const totalDR = receivables.reduce((sum, r) => sum + (r.balance || 0), 0);
  const totalCR = payables.reduce((sum, p) => sum + (p.balance || 0), 0);

  const periodText =
    from_date && to_date ? (
      <>
        Report Period: <strong>{from_date}</strong> to <strong>{to_date}</strong>
      </>
    ) : (
      <>Report Period: <strong>All time</strong></>
    );

  return (
    <AppLayout>
      <Head title="Receivable & Payable Report" />

      <div className="p-6 print:bg-white print:p-0">
        <div className="absolute right-4 top-16 print:hidden">
          <Link
            href={route('reports.receivable-payable.filter')}
            className="text-sm text-blue-600 hover:underline"
          >
            Change Filters
          </Link>
        </div>

        {/* Company header */}
        <div className="mb-4 text-center print:text-sm">
          {company?.logo_path && (
            <img
              src={company.logo_path}
              alt="Company Logo"
              className="mx-auto mb-2 h-16 w-16 object-cover"
            />
          )}
          <h1 className="text-xl font-bold">{company?.company_name}</h1>
          <p className="text-sm bg-foreground-600">{company?.address}</p>
          <p className="text-sm bg-foreground-600">Phone: {company?.phone}</p>

          <h2 className="text-xl font-semibold underline">
            All Receivable &amp; Payable Report
          </h2>
          <p className="mt-2 text-sm bg-foreground-600">{periodText}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Receivables */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-green-700">
              Receivables (DR)
            </h3>
            <div className="overflow-x-auto rounded border border-gray-200">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="border-b px-3 py-2 text-left">#</th>
                    <th className="border-b px-3 py-2 text-left">Ledger Name</th>
                    <th className="border-b px-3 py-2 text-left">Group</th>
                    <th className="border-b px-3 py-2 text-right">Balance (DR)</th>
                  </tr>
                </thead>
                <tbody>
                  {receivables.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-3 text-center bg-foreground-500"
                      >
                        No receivables in this period.
                      </td>
                    </tr>
                  )}
                  {receivables.map((r, i) => (
                    <tr key={r.ledger_id}>
                      <td className="border-b px-3 py-1">{i + 1}</td>
                      <td className="border-b px-3 py-1">
                        {/* Link to a Ledger Statement if you have a route */}
                        {/* <Link href={route('ledgers.show', r.ledger_id)} className="text-blue-600 hover:underline">
                          {r.ledger_name}
                        </Link> */}
                        {r.ledger_name}
                      </td>
                      <td className="border-b px-3 py-1">{r.group_name ?? '-'}</td>
                      <td className="border-b px-3 py-1 text-right">
                        {fmtMoney(r.balance)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-background font-bold">
                    <td colSpan={3} className="px-3 py-2 text-right">
                      Total
                    </td>
                    <td className="px-3 py-2 text-right">{fmtMoney(totalDR)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payables */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-red-700">
              Payables (CR)
            </h3>
            <div className="overflow-x-auto rounded border border-gray-200">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-red-100">
                  <tr>
                    <th className="border-b px-3 py-2 text-left">#</th>
                    <th className="border-b px-3 py-2 text-left">Ledger Name</th>
                    <th className="border-b px-3 py-2 text-left">Group</th>
                    <th className="border-b px-3 py-2 text-right">Balance (CR)</th>
                  </tr>
                </thead>
                <tbody>
                  {payables.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-3 text-center bg-foreground-500"
                      >
                        No payables in this period.
                      </td>
                    </tr>
                  )}
                  {payables.map((p, i) => (
                    <tr key={p.ledger_id}>
                      <td className="border-b px-3 py-1">{i + 1}</td>
                      <td className="border-b px-3 py-1">{p.ledger_name}</td>
                      <td className="border-b px-3 py-1">{p.group_name ?? '-'}</td>
                      <td className="border-b px-3 py-1 text-right">
                        {fmtMoney(p.balance)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-background font-bold">
                    <td colSpan={3} className="px-3 py-2 text-right">
                      Total
                    </td>
                    <td className="px-3 py-2 text-right">{fmtMoney(totalCR)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-center gap-2 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>

        <a
          href={route('reports.receivable-payable.pdf', { from_date, to_date })}
          target="_blank"
          className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
        >
          <FileText className="h-4 w-4" /> Save PDF
        </a>

        <a
          href={route('reports.receivable-payable.excel', { from_date, to_date })}
          className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
        >
          <FileSpreadsheet className="h-4 w-4" /> Export Excel
        </a>
      </div>

      {/* Footer */}
      <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm">
        <span>Generated on {new Date().toLocaleString()}</span>
        <span>{company?.company_name}</span>
        {/* If you add email to props: <span>{company?.company_name} • {company?.email}</span> */}
      </div>
    </AppLayout>
  );
}
