import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Row { group:string; side:'asset'|'liability'; value:number }

export default function BalanceSheet({ from_date,to_date,balances,
   stock,working,assetTotal,liabTotal,difference,company }) {

  const assets = balances.filter((r:Row)=>r.side==='asset');
  const liabs  = balances.filter((r:Row)=>r.side==='liability');

  return (
    <AppLayout>
      <Head title="Balance Sheet" />

      {/* Header & company info (reuse your P&L header component if you have one) */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{company.company_name}</h1>
        <p className="text-sm">Balance Sheet &nbsp;
          <strong>{from_date}</strong> to&nbsp;<strong>{to_date}</strong>
        </p>
      </div>

      {/* Two‑column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:text-xs">

        {/* ASSETS */}
        <div>
          <h2 className="bg-gray-100 font-semibold px-3 py-1">Assets</h2>
          {assets.map(r=>(
            <div key={r.group} className="flex justify-between border-b px-3 py-1">
              <span>{r.group}</span><span>{r.value.toFixed(2)}</span>
            </div>
          ))}

          {/* inventory extras */}
          <div className="flex justify-between border-t px-3 py-1">
            <span>Stock Value</span><span>{stock.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b px-3 py-1">
            <span>Work‑in‑Process</span><span>{working.toFixed(2)}</span>
          </div>

          <div className="flex justify-between bg-green-50 font-bold px-3 py-1">
            <span>Total Assets</span><span>{assetTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* LIABILITIES & EQUITY */}
        <div>
          <h2 className="bg-gray-100 font-semibold px-3 py-1">
            Liabilities &amp; Equity
          </h2>
          {liabs.map(r=>(
            <div key={r.group} className="flex justify-between border-b px-3 py-1">
              <span>{r.group}</span><span>{r.value.toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between bg-red-50 font-bold px-3 py-1">
            <span>Total Liabilities&nbsp;</span>
            <span>{liabTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Imbalance banner */}
      {difference !== 0 && (
        <p className="mt-4 text-center text-red-600 font-semibold">
          Difference: {difference.toFixed(2)}
        </p>
      )}

      {/* Filters / print buttons could go here */}
      <div className="mt-6 flex justify-center gap-4 print:hidden">
        <Link href={route('reports.balance-sheet', { from_date, to_date })}
              className="border px-4 py-2 rounded">Refresh</Link>
        <button onClick={()=>window.print()}
                className="border px-4 py-2 rounded">Print</button>
      </div>
    </AppLayout>
  );
}
