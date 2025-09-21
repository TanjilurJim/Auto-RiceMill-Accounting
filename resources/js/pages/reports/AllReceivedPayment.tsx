import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { PageProps } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
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
  logo_url?: string
  logo_thumb_url?: string
}

interface Props extends PageProps {
  from_date: string
  to_date: string
  entries: Entry[]
  company: CompanyInfo | null
  type?: '' | 'Received' | 'Payment'
}

export default function AllReceivedPayment ({
  from_date,
  to_date,
  entries,
  company,
  type = ''
}: Props) {
  const totalAmount = entries.reduce((sum, e) => sum + Number(e.amount), 0)

  const changeType = (next: '' | 'Received' | 'Payment') => {
    router.get(
      route('reports.all-received-payment'),
      { from_date, to_date, type: next },
      { preserveState: true, preserveScroll: true }
    )
  }

  const logoSrc = company?.logo_url ?? company?.logo_thumb_url ?? null

  return (
    <AppLayout>
      <Head title="All Received & Payment Report" />

      {/* 1) Responsive container */}
      <div className="mx-auto w-full max-w-screen-xl px-3 py-6 print:bg-white print:px-0 print:py-0">

        {/* 2) Actions row: becomes row on mobile, right-aligned on desktop */}
        <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          {/* Quick type filter as a segmented control */}
          <div className="inline-flex w-full overflow-hidden rounded-md border sm:w-auto">
            <button
              className={`flex-1 px-3 py-1.5 text-sm ${type === '' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
              onClick={() => changeType('')}
              type="button"
            >
              All
            </button>
            <button
              className={`flex-1 px-3 py-1.5 text-sm ${type === 'Received' ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-50'}`}
              onClick={() => changeType('Received')}
              type="button"
            >
              Received
            </button>
            <button
              className={`flex-1 px-3 py-1.5 text-sm ${type === 'Payment' ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-50'}`}
              onClick={() => changeType('Payment')}
              type="button"
            >
              Payment
            </button>
          </div>

          <Link
            href={route('reports.all-received-payment.filter')}
            className="text-sm text-blue-600 hover:underline"
          >
            Change Filters
          </Link>
        </div>

        {/* ───────── Company header (centered, scales down) ───────── */}
        {company && (
          <div className="mb-4 flex flex-col items-center justify-center text-center print:text-xs">
            {logoSrc && (
              <img
                src={logoSrc}
                alt="Company Logo"
                className="h-20 w-auto object-contain sm:h-28 print:mb-2 print:h-16"
              />
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold sm:text-2xl">{company?.company_name}</h1>
              {company?.address && <div className="text-sm sm:text-base">{company?.address}</div>}
              {company?.phone && <div className="text-sm sm:text-base">Phone: {company?.phone}</div>}
              {company?.email && <div className="text-sm sm:text-base">Email: {company?.email}</div>}
            </div>
          </div>
        )}

        {/* ───────── Report title ───────── */}
        <div className="mb-4 text-center print:text-sm">
          <h2 className="text-base font-bold sm:text-lg">
            {type ? `${type} ` : ''}All Received &amp; Payment Report
          </h2>
          <p className="mt-1 text-sm text-foreground">
            Report Period:&nbsp;
            <strong>{from_date}</strong>&nbsp;to&nbsp;<strong>{to_date}</strong>
          </p>
        </div>

        {/* 3A) Mobile cards (<md): easier to read on phones */}
        <div className="space-y-3 md:hidden">
          {entries.map((e, i) => (
            <div key={i} className="rounded border bg-background p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{dayjs(e.date).format('YYYY-MM-DD')}</span>
                <span
                  className={
                    e.type === 'Received'
                      ? 'rounded bg-green-500 px-2 py-0.5 text-[11px] font-medium text-white'
                      : e.type === 'Payment'
                      ? 'rounded bg-red-500 px-2 py-0.5 text-[11px] font-medium text-white'
                      : 'rounded bg-gray-500 px-2 py-0.5 text-[11px] font-medium text-white'
                  }
                >
                  {e.type}
                </span>
              </div>
              <div className="text-sm font-semibold">{e.ledger}</div>
              <div className="mt-1 text-xs text-muted-foreground">Voucher: {e.voucher_no}</div>
              <div className="mt-1 text-xs text-muted-foreground">Mode: {e.mode_ledger}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">By: {e.created_by}</div>
                <div className="text-right text-base font-bold">{Number(e.amount).toFixed(2)}</div>
              </div>
            </div>
          ))}

          {/* Mobile total */}
          <div className="rounded border bg-background p-3 text-right font-semibold">
            Total: {totalAmount.toFixed(2)}
          </div>
        </div>

        {/* 3B) Desktop table (md+): show more columns */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded border border-gray-200 bg-background text-sm">
            <table className="min-w-full table-auto">
              <thead className="bg-background print:bg-white">
                <tr>
                  <th className="border px-3 py-2 text-left">Date</th>
                  <th className="border px-3 py-2 text-left">Voucher No</th>
                  <th className="border px-3 py-2 text-left">Type</th>
                  <th className="border px-3 py-2 text-left">Ledger</th>
                  {/* Low-priority columns can be hidden on smaller desktops if wanted:
                      add lg:table-cell and default to hidden to progressively disclose */}
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
                    <td className="border px-3 py-2 text-right">{Number(entry.amount).toFixed(2)}</td>
                    <td className="border px-3 py-2">{entry.created_by}</td>
                  </tr>
                ))}
                <tr className="bg-background font-bold">
                  <td colSpan={5} className="px-3 py-2 text-right">
                    Total
                  </td>
                  <td className="px-3 py-2 text-right">{totalAmount.toFixed(2)}</td>
                  <td className="px-3 py-2" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4) Actions: stack on mobile, inline on desktop */}
        <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center print:hidden">
          <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>

          <a
            href={route('reports.all-received-payment.pdf', { from_date, to_date, type })}
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100 sm:w-auto"
          >
            <FileText className="h-4 w-4" /> Save PDF
          </a>

          <a
            href={route('reports.all-received-payment.excel', { from_date, to_date, type })}
            className="inline-flex w-full items-center justify-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100 sm:w-auto"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </a>
        </div>

        <div className="text-muted-foreground mt-2 flex flex-col items-center justify-between gap-2 px-1 text-xs sm:flex-row sm:px-6 sm:text-sm print:hidden">
          <span>Generated on {new Date().toLocaleString()}</span>
        </div>
      </div>
    </AppLayout>
  )
}
