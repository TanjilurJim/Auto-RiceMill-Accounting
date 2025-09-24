/* DayBookIndex – “Day-Book / মিল-ডাইরি” */
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

/* helpers ---------------------------------------------------- */
const formatQty = (n: number | string) => Number(n || 0).toFixed(3);
const formatCurrency = (n: number | string) =>
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------------------------------------------ */
/* FILTER BAR (responsive)                                            */
/* ------------------------------------------------------------------ */
const FilterBar: React.FC<{
  from: string;
  setFrom: (s: string) => void;
  to: string;
  setTo: (s: string) => void;
  types: string[];
  setTypes: (t: string[]) => void;
  apply: () => void;
  reset: () => void;
}> = ({ from, setFrom, to, setTo, types, setTypes, apply, reset }) => {
  const toggle = (t: string) => {
    setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);
  };

  const Chip: React.FC<{ label: string; activeColor: string }> = ({ label, activeColor }) => (
    <button
      type="button"
      onClick={() => toggle(label)}
      className={[
        'whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition',
        types.includes(label)
          ? `${activeColor} text-white border-transparent`
          : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200',
      ].join(' ')}
    >
      {label}
    </button>
  );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4 print:hidden">
            {/* dates */}
            <div className="">
                <InputCalendar
                    label="From"
                    required
                    value={from}
                    onChange={setFrom}
                    max={to || undefined} // prevent selecting after "to"
                />
            </div>

            <div className="">
                <InputCalendar
                    label="To"
                    required
                    value={to}
                    onChange={setTo}
                    min={from || undefined} // prevent selecting before "from"
                    max={dayjs().format('YYYY-MM-DD')} // don't allow future dates
                />
            </div>

            <div className='mt-6'>
                {/* type chips */}
                <div className="flex flex-wrap gap-2">
                    {chip('Deposit', 'bg-green-600')}
                    {chip('Withdraw', 'bg-red-600')}
                    {chip('Convert', 'bg-yellow-500')}
                    {chip('Rent', 'bg-blue-600')}
                </div>
            </div>

            {/* buttons */}
            <div className="mt-6 flex flex-col md:flex-row gap-2">
                <button
                    onClick={apply}
                    className=" items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
                >
                    Apply
                </button>
                <button
                    onClick={reset}
                    className="items-center rounded-md border bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* SUMMARY widgets                                                    */
/* ------------------------------------------------------------------ */
const SummarySection: React.FC<{ totals: any; byType: any }> = ({ totals, byType }) => (
  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
    {/* grand totals */}
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 text-base font-semibold sm:text-lg">সারসংক্ষেপ</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>মোট জমা</span>
          <span className="font-mono">{formatQty(totals.in_qty)}</span>
        </div>
        <div className="flex justify-between">
          <span>মোট উত্তোলন</span>
          <span className="font-mono">{formatQty(totals.out_qty)}</span>
        </div>
        <div className="flex justify-between">
          <span>পণ্যের মোট মূল্য</span>
          <span className="font-mono">৳ {formatCurrency(totals.stock_value)}</span>
        </div>
        <div className="flex justify-between">
          <span>মোট ভাড়া বিল</span>
          <span className="font-mono">৳ {formatCurrency(totals.rent_bill)}</span>
        </div>
      </div>
    </div>

    {/* by-type */}
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 text-base font-semibold sm:text-lg">ভাউচার অনুযায়ী</h3>
      <div className="overflow-x-auto">
        <table className="min-w-[480px] text-sm">
          <thead>
            <tr className="bg-background">
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">জমা / উত্তোলন</th>
              <th className="px-3 py-2 text-right">৳ Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Object.entries(byType).map(([type, t]: any) => (
              <tr key={type}>
                <td className="px-3 py-2">{type}</td>
                <td className="px-3 py-2 text-right">
                  {formatQty(t.in_qty)} / {formatQty(t.out_qty)}
                </td>
                <td className="px-3 py-2 text-right">
                  ৳ {formatCurrency(type === 'Rent' ? t.rent_bill : t.stock_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */
export default function DayBookIndex({ rows, totals, byType, filters }) {
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);
  const [types, setTypes] = useState<string[]>([]); // voucher-type filter

  const sendRequest = () => {
    router.get(
      route('reports.daybook'),
      { date_from: from, date_to: to, types },
      { preserveState: true, replace: true }
    );
  };
  const reset = () => router.get(route('reports.daybook'));

  /* table columns (for md+) */
  const columns = useMemo(
    () => [
      { header: 'Date', accessor: (r: any) => dayjs(r.date).format('DD-MMM-YY') },
      { header: 'Voucher', accessor: 'vch', className: 'font-medium text-blue-600' },
      { header: 'Type', accessor: 'vch_type' },
      { header: 'Party', accessor: 'party' },
      { header: 'Godown', accessor: 'godown' },
      { header: 'জমা Qty', accessor: (r: any) => formatQty(r.in_qty), className: 'text-right text-green-600 font-mono' },
      { header: 'উত্তোলন Qty', accessor: (r: any) => formatQty(r.out_qty), className: 'text-right text-red-600 font-mono' },
      { header: 'Stock Value', accessor: (r: any) => formatCurrency(r.stock_value), className: 'text-right font-mono' },
      { header: 'Rent Bill', accessor: (r: any) => formatCurrency(r.rent_bill), className: 'text-right font-mono' },
      { header: 'Remarks', accessor: 'remarks', className: 'max-w-xs truncate' },
    ],
    []
  );

    return (
        <AppLayout>
            <Head title="Day-Book" />
            <div className="h-full w-screen space-y-6 p-4 md:p-12 lg:w-full">
                <PageHeader title="Day-Book">
                    <button onClick={() => window.print()} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white print:hidden">
                        Print
                    </button>
                </PageHeader>

                <div className="bg-background rounded-lg p-4 shadow-sm sm:p-6">
                    <FilterBar
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        types={types}
                        setTypes={setTypes}
                        apply={sendRequest}
                        reset={reset}
                    />

          {/* Mobile list (<md) */}
          <div className="mt-6 space-y-3 md:hidden">
            {rows?.length ? (
              rows.map((r: any, idx: number) => <MobileRowCard key={idx} r={r} />)
            ) : (
              <div className="rounded border bg-white p-6 text-center text-gray-500">কোন ভাউচার পাওয়া যায়নি</div>
            )}
          </div>

          {/* Desktop table (md+) */}
          <div className="mt-6 hidden md:block">
            <TableComponent
              columns={columns}
              data={rows}
              noDataMessage="কোন ভাউচার পাওয়া যায়নি"
              className="max-h-[65vh] overflow-auto rounded-lg border"
            />
          </div>

          <SummarySection totals={totals} byType={byType} />
        </div>
      </div>
    </AppLayout>
  );
}
