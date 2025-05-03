import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { PageProps } from '@/types'
import { Head, Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import { FileSpreadsheet, FileText, Printer } from 'lucide-react'

interface Entry {
  date: string
  voucher_no: string
  type: 'Received' | 'Payment' | 'Contra'
  ledger: string
  mode_ledger: string
  amount: number
  created_by: string
}

interface CompanyInfo {
  company_name: string
  phone?: string
  email?: string
  address?: string
  logo_path?: string
  logo_url?: string         // full‑size
  logo_thumb_url?: string   // thumbnail
}

interface Props extends PageProps {
  from_date: string
  to_date: string
  entries: Entry[]
  company: CompanyInfo | null
}

export default function AllReceivedPayment ({ from_date, to_date, entries, company }: Props) {
  const totalAmount = entries.reduce((sum, e) => sum + Number(e.amount), 0)

  // prefer small thumb, fall back to full‑size, else null
  // prefer full‑quality PNG, fall back to thumb, else nothing
const logoSrc = company?.logo_url ?? company?.logo_thumb_url ?? null;

  return (
    <AppLayout>
      <Head title="All Received & Payment Report" />

      <div className="p-6 print:bg-white print:p-0">
        {/* top‑right link */}
        <div className="absolute top-4 right-4 print:hidden">
          <Link
            href={route('reports.all-received-payment.filter')}
            className="text-sm text-blue-600 hover:underline"
          >
            Change Filters
          </Link>
        </div>

        {/* ─────────────────── Company header ─────────────────── */}
        {company && (
          <div className="mb-2 flex items-center justify-between text-center print:text-xs">
            {logoSrc && (
              <img
                src={logoSrc}
                alt="Company Logo"
                className="mr-4 h-28 w-auto object-contain print:mr-2 print:h-16"
              />
            )}

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{company.company_name}</h1>
              {company.address && <div>{company.address}</div>}
              {company.phone && <div>Phone: {company.phone}</div>}
              {company.email && <div>Email: {company.email}</div>}
            </div>
          </div>
        )}

        {/* ─────────────────── Report title ─────────────────── */}
        <div className="mb-4 text-center print:text-sm">
          <h1 className="text-lg font-bold">All Received &amp; Payment Report</h1>
          <p className="mt-1 text-sm text-gray-600">
            Report Period:&nbsp;
            <strong>{from_date}</strong>&nbsp;to&nbsp;<strong>{to_date}</strong>
          </p>
        </div>

        {/* ─────────────────── Table ─────────────────── */}
        <div className="overflow-x-auto rounded border border-gray-200 bg-white text-sm">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Date</th>
                <th className="border px-3 py-2 text-left">Voucher No</th>
                <th className="border px-3 py-2 text-left">Type</th>
                <th className="border px-3 py-2 text-left">Ledger</th>
                <th className="border px-3 py-2 text-left">Mode Ledger</th>
                <th className="border px-3 py-2 text-right">Amount</th>
                <th className="border px-3 py-2 text-left">Created By</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{dayjs(entry.date).format('YYYY-MM-DD')}</td>
                  <td className="border px-3 py-2">{entry.voucher_no}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={
                        entry.type === 'Received'
                          ? 'rounded bg-green-500 px-2 py-0.5 text-xs font-medium text-white'
                          : entry.type === 'Payment'
                          ? 'rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white'
                          : 'rounded bg-gray-500 px-2 py-0.5 text-xs font-medium text-white'
                      }
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="border px-3 py-2">{entry.ledger}</td>
                  <td className="border px-3 py-2">{entry.mode_ledger}</td>
                  <td className="border px-3 py-2 text-right">
                    {Number(entry.amount).toFixed(2)}
                  </td>
                  <td className="border px-3 py-2">{entry.created_by}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={5} className="px-3 py-2 text-right">
                  Total
                </td>
                <td className="px-3 py-2 text-right">{totalAmount.toFixed(2)}</td>
                <td className="px-3 py-2" />
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─────────────────── Actions ─────────────────── */}
        <div className="mt-4 flex justify-center gap-2 print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>

          <a
            href={route('reports.all-received-payment.pdf', { from_date, to_date })}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            <FileText className="h-4 w-4" /> Save PDF
          </a>

          <a
            href={route('reports.all-received-payment.excel', { from_date, to_date })}
            className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </a>
        </div>

        <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm print:hidden">
          <span>Generated on {new Date().toLocaleString()}</span>
        </div>
      </div>
    </AppLayout>
  )
}
