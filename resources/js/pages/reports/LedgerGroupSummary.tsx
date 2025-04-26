import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import React from 'react';

interface Company {
  company_name: string;
  address?: string;
  mobile?: string;
  logo_path?: string;
  website?: string;
  email?: string;
  financial_year?: string; // <-- string, not varChar
}
interface Filters {
  from_date: string;
  to_date: string;
}

interface Ledger {
  id: number;
  account_ledger_name: string;
  phone_number?: string;
  debit: number;
  credit: number;
}
interface LedgerGroup {
  group_name: string;
  ledgers: Ledger[];
  total_debit: number;
  total_credit: number;
}
interface Props {
  data:        LedgerGroup[];
  grand_total_debit:  number;
  grand_total_credit: number;
  company: Company;
  filters: Filters;
  group_label?: string;
}

const money = new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 });

export default function LedgerGroupSummary({
  data = [],
  grand_total_debit = 0,
  grand_total_credit = 0,
  company,
  filters,
  group_label = '',
  
}: Props & {group_label?: string}) {
  return (
    <AppLayout title="Ledger Group Summary" header="Ledger Group Summary">
      <Head title="Ledger Group Summary" />

       {/* ⬅️ change-filters link (optional) */}
       <div className="absolute top-4 right-4 print:hidden">
        <Link
          href={route('reports.ledger-group-summary.filter')}
          className="text-sm text-blue-600 hover:underline"
        >
          Change Filters
        </Link>
      </div>

      {/* main card */}
      <div className="mx-auto mt-6 max-w-6xl rounded bg-white p-4 shadow print:text-xs">

        {/* ── Company header (print-friendly) ───────────────── */}
        <div className="mb-6 text-center">
          {company.logo_path && (
            <img src={company.logo_path} alt="Logo" className="mx-auto mb-2 h-16" />
          )}

          <h2 className="text-2xl font-bold">{company.company_name}</h2>

          {company.address && <p className="text-sm">{company.address}</p>}
          {company.mobile  && <p className="text-sm">Mobile: {company.mobile}</p>}
          {company.email   && <p className="text-sm">Email: {company.email}</p>}
          {company.website && (
            <p className="text-sm">
              Website:{' '}
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 underline">
                {company.website}
              </a>
            </p>
          )}
          {company.financial_year && (
            <p className="mt-1 text-sm italic">
              Financial Year:&nbsp;<strong>{company.financial_year}</strong>
            </p>
          )}
        </div>

        {/* ── context row: date-range + optional group label ─ */}
        <div className="mb-4 flex items-center justify-between print:hidden">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            From&nbsp;{filters.from_date}&nbsp;to&nbsp;{filters.to_date}
          </span>

          {group_label && (
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {group_label}
            </span>
          )}
          </div>
        </div>

      <div className="mx-auto mt-6 max-w-6xl rounded bg-white p-4 shadow">
        {/* title + print */}
        <div className="flex items-center justify-between print:hidden">
          <h2 className="text-xl font-semibold text-gray-800">
            Group-wise Ledger Balance Summary
          </h2>
          <span className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600">
              {group_label}
            </span>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>

        {/* table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-100 text-gray-700 shadow-sm print:relative">
              <tr>
                <th className="border px-2 py-1 text-left w-16">SL</th>
                <th className="border px-2 py-1 text-left w-56">Ledger Name</th>
                <th className="border px-2 py-1 text-left">Mobile</th>
                <th className="border px-2 py-1 text-right w-28">Debit (Dr)</th>
                <th className="border px-2 py-1 text-right w-28">Credit (Cr)</th>
              </tr>
            </thead>

            <tbody>
              {data.map((grp, gIdx) => (
                <React.Fragment key={grp.group_name}>
                  {/* ───── Group header row ───── */}
                  <tr className="bg-slate-50 font-medium text-slate-800">
                    <td
                      colSpan={5}
                      className="border px-2 py-1 uppercase tracking-wide"
                    >
                      {gIdx + 1}. {grp.group_name}
                    </td>
                  </tr>

                  {/* ───── Ledgers inside the group ───── */}
                  {grp.ledgers.map((l, i) => (
                    <tr
                      key={l.id}
                      className={i % 2 ? 'bg-gray-50/50' : undefined}
                    >
                      <td className="border px-2 py-1">{i + 1}</td>
                      <td className="border px-2 py-1">{l.account_ledger_name}</td>
                      <td className="border px-2 py-1">
                        {l.phone_number || '—'}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {l.debit ? money.format(l.debit) : '—'}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {l.credit ? money.format(l.credit) : '—'}
                      </td>
                    </tr>
                  ))}

                  {/* ───── Group total row ───── */}
                  <tr className="bg-slate-100 font-semibold text-blue-700">
                    <td colSpan={3} className="border px-2 py-1 text-right">
                      Group Total&nbsp;:
                    </td>
                    <td className="border px-2 py-1 text-right">
                      {money.format(grp.total_debit)}
                    </td>
                    <td className="border px-2 py-1 text-right">
                      {money.format(grp.total_credit)}
                    </td>
                  </tr>
                </React.Fragment>
              ))}

              {/* ───── Grand total row ───── */}
              <tr className="bg-blue-50 font-bold text-blue-800 text-base">
                <td colSpan={3} className="border px-2 py-2 text-right">
                  Grand Total&nbsp;:
                </td>
                <td className="border px-2 py-2 text-right">
                  {money.format(grand_total_debit)}
                </td>
                <td className="border px-2 py-2 text-right">
                  {money.format(grand_total_credit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
