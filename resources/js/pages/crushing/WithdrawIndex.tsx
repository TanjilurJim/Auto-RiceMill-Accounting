import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type WithdrawalItem = {
  item_name: string;
  qty: number;
  rate: number;
  total: number; // positive per item (from controller map)
};

type Withdrawal = {
  id: number;
  date: string;
  ref_no: string;
  party_ledger_name: string;
  godown_name: string;
  total?: number;     // signed overall (optional)
  amount?: number;    // positive overall (preferred)
  total_qty?: number; // positive overall (preferred)
  items: WithdrawalItem[];
};

interface Props {
  withdrawals: Withdrawal[];
}

export default function PartyStockWithdrawIndex({ withdrawals }: Props) {
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

  // Fallbacks if controller didn’t add amount/total_qty
  const withComputed = withdrawals.map((w) => {
    const computedAmount = w.items?.reduce((s, it) => s + Number(it.total || 0), 0);
    const computedQty = w.items?.reduce((s, it) => s + Number(it.qty || 0), 0);
    return {
      ...w,
      amount: w.amount ?? computedAmount ?? 0,
      total_qty: w.total_qty ?? computedQty ?? 0,
    };
  });

  // Page totals
  const pageTotalAmount = withComputed.reduce((s, w) => s + Number(w.amount || 0), 0);
  const pageTotalQty = withComputed.reduce((s, w) => s + Number(w.total_qty || 0), 0);

  return (
    <AppLayout>
      <Head title="মাল উত্তোলন তালিকা" />

      {/* Responsive container */}
      <div className="mx-auto w-full max-w-screen-xl bg-background px-3 py-6">
        <div className="rounded-lg bg-background p-4 sm:p-6">
          <h1 className="mb-4 text-lg font-bold sm:text-xl">মাল উত্তোলন তালিকা</h1>

          {/* ===== Mobile: cards (<md) ===== */}
          <div className="space-y-3 md:hidden">
            {withComputed.length ? (
              <>
                {withComputed.map((w) => (
                  <div key={w.id} className="rounded border bg-white p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{w.date}</span>
                      <span className="font-medium">#{w.ref_no}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold">{w.party_ledger_name}</div>
                    <div className="text-xs text-muted-foreground">গুদাম: {w.godown_name}</div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">উত্তোলন (পরিমাণ)</div>
                        <div className="font-semibold">{Number(w.total_qty || 0).toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">উত্তোলন (টাকা)</div>
                        <div className="font-semibold">{fmtMoney(Number(w.amount || 0))}</div>
                      </div>
                    </div>

                    {/* (Optional) show first few items */}
                    {w.items?.length ? (
                      <div className="mt-2 border-t pt-2">
                        <div className="mb-1 text-xs font-medium text-muted-foreground">আইটেমসমূহ</div>
                        <ul className="space-y-1">
                          {w.items.slice(0, 3).map((it, i) => (
                            <li key={i} className="flex items-center justify-between text-xs">
                              <span className="truncate">{it.item_name}</span>
                              <span className="whitespace-nowrap">
                                {Number(it.qty).toFixed(2)} × {fmtMoney(Number(it.rate || 0))} ={' '}
                                <strong>{fmtMoney(Number(it.total || 0))}</strong>
                              </span>
                            </li>
                          ))}
                          {w.items.length > 3 && (
                            <li className="text-right text-[11px] text-muted-foreground">+ {w.items.length - 3} more…</li>
                          )}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ))}

                {/* Mobile totals */}
                <div className="rounded border bg-gray-50 p-3 text-right text-sm">
                  <div>
                    <span className="font-medium">মোট পরিমাণ:</span> {pageTotalQty.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">মোট টাকা:</span> {fmtMoney(pageTotalAmount)}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded border bg-background p-6 text-center text-gray-500">কোনো তথ্য পাওয়া যায়নি।</div>
            )}
          </div>

          {/* ===== Desktop: table (md+) ===== */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded border bg-background">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-background-50">
                  <tr>
                    <th className="border px-2 py-2 text-left">তারিখ</th>
                    <th className="border px-2 py-2 text-left">রেফারেন্স নম্বর</th>
                    <th className="border px-2 py-2 text-left">পার্টি</th>
                    <th className="border px-2 py-2 text-left">গুদাম</th>
                    <th className="border px-2 py-2 text-right">উত্তোলন (পরিমাণ)</th>
                    <th className="border px-2 py-2 text-right">উত্তোলন (টাকা)</th>
                  </tr>
                </thead>
                <tbody>
                  {withComputed.length ? (
                    <>
                      {withComputed.map((w) => (
                        <tr key={w.id} className="hover:bg-background">
                          <td className="border px-2 py-2">{w.date}</td>
                          <td className="border px-2 py-2">{w.ref_no}</td>
                          <td className="border px-2 py-2">{w.party_ledger_name}</td>
                          <td className="border px-2 py-2">{w.godown_name}</td>
                          <td className="border px-2 py-2 text-right">{Number(w.total_qty || 0).toFixed(2)}</td>
                          <td className="border px-2 py-2 text-right">{fmtMoney(Number(w.amount || 0))}</td>
                        </tr>
                      ))}
                      <tr className="bg-background font-semibold">
                        <td className="border px-2 py-2 text-right" colSpan={4}>
                          মোট (এই পৃষ্ঠা)
                        </td>
                        <td className="border px-2 py-2 text-right">{pageTotalQty.toFixed(2)}</td>
                        <td className="border px-2 py-2 text-right">{fmtMoney(pageTotalAmount)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                        কোনো তথ্য পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
