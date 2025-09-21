import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

type Paginated<T> = {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
};

interface Stock {
  item_name: string;
  godown_name: string;
  qty: number;
  unit: string;
  lot_no?: string | null;
  total_purchase: number;
  total_sale: number;
  total_sale_qty: number;
  last_purchase_at: string | null;
  last_sale_at: string | null;
  grandByGodownItem: Record<string, Record<string, number>>;
}

interface Company {
  company_name: string;
  email?: string;
  financial_year?: string;
  website?: string;
  logo_path?: string;
  mobile?: string;
  address?: string;
  logo_url?: string;
  logo_thumb_url?: string;
}

interface Props {
  stocks: Paginated<Stock>;
  filters: {
    from: string;
    to: string;
    godown_id?: string;
    category_id?: string;
    item_id?: string;
  };
  company: Company;
  grand: { total_qty: number };
  grandByGodownItem: Record<string, Record<string, number>>;
}

export default function StockSummary({ stocks, filters, company, grand, grandByGodownItem }: Props) {
  const rows = stocks.data ?? [];
  const perPage = stocks.per_page ?? 25;

  // Totals for CURRENT PAGE
  const totalQty = rows.reduce((sum, s) => sum + (s.qty || 0), 0);

  const handlePrint = () => window.print();

  return (
    <AppLayout title="Stock Summary Report">
      <Head title="Stock Summary Report" />

      {/* Responsive container */}
      <div className="mx-auto w-full max-w-screen-xl px-3 py-4">
        <Card className="shadow-lg">
          <CardHeader className="relative bg-background/20 py-6 text-center">
            <div className="space-y-1">
              {company?.logo_url && (
                <img
                  src={company.logo_url}
                  alt="Company Logo"
                  className="mx-auto mb-2 h-16 w-auto object-contain sm:h-20 print:h-12"
                />
              )}

              <h1 className="text-xl font-bold uppercase sm:text-3xl">{company?.company_name ?? 'Company Name'}</h1>
              {company?.address && <p className="text-xs text-foreground sm:text-sm">{company.address}</p>}
              {company?.mobile && <p className="text-xs text-foreground sm:text-sm">Phone: {company.mobile}</p>}
              {(company?.email || company?.website) && (
                <p className="text-xs text-foreground sm:text-sm">
                  {company?.email && <span>{company.email}</span>}
                  {company?.email && company?.website && <span className="mx-1">|</span>}
                  {company?.website && <span>{company.website}</span>}
                </p>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold underline sm:text-xl">Stock Summary Report</h2>
              <p className="text-xs text-foreground sm:text-sm">
                From: <strong>{filters.from}</strong>, To: <strong>{filters.to}</strong>
              </p>
            </div>

            {/* Change Filters link */}
            <div className="absolute right-4 top-6 hidden print:hidden sm:block">
              <Link href={route('reports.stock-summary')} className="text-sm text-blue-600 hover:underline">
                Change Filters
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {/* Meta / pagination info */}
            <div className="mb-4 flex flex-col items-start justify-between gap-2 text-xs text-foreground sm:flex-row sm:items-center sm:text-sm">
              <div>
                Stock from <strong>{filters.from}</strong> to <strong>{filters.to}</strong>
              </div>
              <div className="print:hidden">
                Page <strong>{stocks.current_page}</strong> of <strong>{stocks.last_page}</strong> • Total: <strong>{stocks.total}</strong>
              </div>
              {/* Mobile “Change Filters” */}
              <Link
                href={route('reports.stock-summary')}
                className="text-blue-600 hover:underline sm:hidden"
              >
                Change Filters
              </Link>
            </div>

            {/* ===== MOBILE (<md): Card list ===== */}
            <div className="space-y-3 md:hidden">
              {rows.length ? (
                <>
                  {rows.map((s, i) => (
                    <div key={`${s.item_name}-${i}`} className="rounded border bg-background p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          #{(stocks.current_page - 1) * perPage + (i + 1)}
                        </div>
                      </div>

                      <div className="text-sm font-semibold">{s.item_name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Godown: {s.godown_name}</div>
                      <div className="mt-1 text-sm">
                        Qty: <strong>{Number(s.qty).toFixed(2)}</strong>{' '}
                        <span className="text-xs text-gray-500">({s.unit})</span>
                      </div>
                      <div className="mt-1 text-xs">Lot: {s.lot_no || '-'}</div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Last Purchase:</span>{' '}
                          {s.last_purchase_at ? new Date(s.last_purchase_at).toLocaleDateString() : '-'}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Sale:</span>{' '}
                          {s.last_sale_at ? new Date(s.last_sale_at).toLocaleDateString() : '-'}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Totals (page & grand) */}
                  <div className="rounded border bg-gray-50 p-3 text-right font-semibold">
                    Total (this page): {totalQty.toFixed(2)}
                  </div>
                  <div className="rounded border bg-gray-100 p-3 text-right font-bold">
                    Grand Total (all pages): {Number(grand.total_qty).toFixed(2)}
                  </div>

                  {/* Closing stock summaries */}
                  <div className="rounded border bg-background p-3">
                    <strong>Closing Stock by Item (page):</strong>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-foreground">
                      {Object.entries(
                        rows.reduce<Record<string, number>>((acc, s) => {
                          const key = `${s.item_name} (${s.unit})`;
                          acc[key] = (acc[key] || 0) + Number(s.qty || 0);
                          return acc;
                        }, {})
                      ).map(([item, qty]) => (
                        <li key={item}>
                          {item}: {qty.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded border bg-background p-3">
                    <strong>Closing Stock by Godown → Item (all pages):</strong>
                    {Object.keys(grandByGodownItem).length === 0 ? (
                      <div className="mt-1 text-sm text-foreground">No data.</div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {Object.entries(grandByGodownItem).map(([godown, items]) => (
                          <div key={godown}>
                            <div className="font-semibold">{godown}</div>
                            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-foreground">
                              {Object.entries(items).map(([itemLabel, qty]) => (
                                <li key={`${godown}-${itemLabel}`}>
                                  {itemLabel}: {Number(qty).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded border bg-background p-6 text-center text-gray-500">
                  No stock data found.
                </div>
              )}
            </div>

            {/* ===== DESKTOP (md+): Table ===== */}
            <div className="hidden md:block">
              <div className="overflow-x-auto rounded border border-gray-300 bg-background text-sm print:overflow-visible">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100 print:bg-white">
                    <tr>
                      <th className="border px-2 py-1 text-left">#</th>
                      <th className="border px-2 py-1 text-left">Item Name</th>
                      <th className="border px-2 py-1 text-left">Godown</th>
                      <th className="border px-2 py-1 text-left">Qty (Unit)</th>
                      <th className="border px-2 py-1 text-left">Lot No</th>
                      <th className="border px-2 py-1 text-left">Last Purchase</th>
                      <th className="border px-2 py-1 text-left">Last Sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length > 0 ? (
                      <>
                        {rows.map((stock, i) => (
                          <tr key={`${stock.item_name}-${i}`} className="print:bg-white">
                            <td className="border px-2 py-1">
                              {(stocks.current_page - 1) * perPage + (i + 1)}
                            </td>
                            <td className="border px-2 py-1">{stock.item_name}</td>
                            <td className="border px-2 py-1">{stock.godown_name}</td>
                            <td className="border px-2 py-1">
                              {Number(stock.qty).toFixed(2)}{' '}
                              <span className="text-xs text-gray-500">({stock.unit})</span>
                            </td>
                            <td className="border px-2 py-1">{stock.lot_no || '-'}</td>
                            <td className="border px-2 py-1">
                              {stock.last_purchase_at ? new Date(stock.last_purchase_at).toLocaleDateString() : '-'}
                            </td>
                            <td className="border px-2 py-1">
                              {stock.last_sale_at ? new Date(stock.last_sale_at).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        ))}

                        {/* Totals (page) */}
                        <tr className="bg-gray-100 font-semibold print:bg-white">
                          <td className="border px-2 py-1 text-right" colSpan={3}>
                            Total (this page)
                          </td>
                          <td className="border px-2 py-1">{totalQty.toFixed(2)}</td>
                          <td className="border px-2 py-1">—</td>
                          <td className="border px-2 py-1">—</td>
                          <td className="border px-2 py-1">—</td>
                        </tr>

                        {/* Grand total (all pages) */}
                        <tr className="bg-gray-200 font-bold print:bg-white">
                          <td className="border px-2 py-1 text-right" colSpan={3}>
                            Grand Total (all pages)
                          </td>
                          <td className="border px-2 py-1">{Number(grand.total_qty).toFixed(2)}</td>
                          <td className="border px-2 py-1">—</td>
                          <td className="border px-2 py-1">—</td>
                          <td className="border px-2 py-1">—</td>
                        </tr>

                        {/* Closing stock by item (page) */}
                        <tr className="bg-gray-50 print:bg-white">
                          <td className="border px-2 py-2 text-sm font-medium" colSpan={7}>
                            <strong>Closing Stock by Item (page):</strong>
                            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-foreground">
                              {Object.entries(
                                rows.reduce<Record<string, number>>((acc, s) => {
                                  const key = `${s.item_name} (${s.unit})`;
                                  acc[key] = (acc[key] || 0) + Number(s.qty || 0);
                                  return acc;
                                }, {})
                              ).map(([item, qty]) => (
                                <li key={item}>
                                  {item}: {qty.toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>

                        {/* Closing stock by Godown → Item (all pages) */}
                        <tr className="bg-gray-50 print:bg-white">
                          <td className="border px-2 py-2 text-sm font-medium" colSpan={7}>
                            <strong>Closing Stock by Godown → Item (all pages):</strong>
                            {Object.keys(grandByGodownItem).length === 0 ? (
                              <div className="mt-1 text-sm text-foreground">No data.</div>
                            ) : (
                              <div className="mt-2 space-y-2">
                                {Object.entries(grandByGodownItem).map(([godown, items]) => (
                                  <div key={godown}>
                                    <div className="font-semibold">{godown}</div>
                                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-foreground">
                                      {Object.entries(items).map(([itemLabel, qty]) => (
                                        <li key={`${godown}-${itemLabel}`}>
                                          {itemLabel}: {Number(qty).toFixed(2)}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                          No stock data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions: stack on mobile, inline on desktop */}
            <div className="mt-4 flex flex-col items-stretch gap-2 print:hidden sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>

              <a
                href={route('reports.stock-summary.pdf', filters)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100 sm:w-auto"
              >
                <FileText className="h-4 w-4" />
                Save as PDF
              </a>

              <a
                href={route('reports.stock-summary.excel', filters)}
                className="inline-flex w-full items-center justify-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100 sm:w-auto"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </a>
            </div>
          </CardContent>

          <div className="text-muted-foreground flex flex-col gap-2 px-4 pb-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-sm">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>
              {company?.company_name} {company?.email ? `• ${company.email}` : ''}
            </span>
          </div>
        </Card>
      </div>

      {/* Paginator */}
      <Pagination
        links={stocks.links}
        currentPage={stocks.current_page}
        lastPage={stocks.last_page}
        total={stocks.total}
      />
    </AppLayout>
  );
}
