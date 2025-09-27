import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { useTranslation } from '../../components/useTranslation';

interface Row {
    date: string;
    voucher_no: string;
    party: string;
    category_name: string;
    item_name: string;
    unit_name: string;
    qty: number;
    rate: number;
    amount: number;
    lot_no?: string;
    month?: number; // for year-based summary
}

interface Company {
    company_name: string;
    email?: string;
    mobile?: string;
    address?: string;
    logo_path?: string;
    logo_url?: string;
    logo_thumb_url?: string;
    website?: string;
    financial_year?: string; // <-- string, not varChar
}

export default function SaleCategoryReport({
    entries,
    filters,
    company,
}: {
    entries: Row[];
    filters: { from_date: string; to_date: string; year?: string };
    company: Company;
}) {
    const t = useTranslation();
    const handlePrint = () => window.print();

    const totalQty = entries.reduce((sum, r) => sum + Number(r.qty ?? 0), 0);
    const totalAmount = entries.reduce((sum, r) => sum + Number(r.amount ?? 0), 0);

    const qtyByUnit = Object.entries(
        entries.reduce(
            (acc, r) => {
                const unit = r.unit_name || '-';
                acc[unit] = (acc[unit] || 0) + Number(r.qty ?? 0);
                return acc;
            },
            {} as Record<string, number>,
        ),
    );

    return (
        <AppLayout>
            <div className="max-w-full space-y-4 p-4">
                <Card className="shadow-lg">
                    {/* ── Header ───────────────────── */}
                    <CardHeader className="bg-background relative text-center">
                        {company?.logo_url && (
                            <img src={company.logo_url} alt={t('repCompanyLogoAlt')} className="mx-auto mb-2 h-20 object-contain print:h-12" />
                        )}
                        <h1 className="text-3xl font-bold uppercase">{company?.company_name}</h1>
                        {company?.address && <p className="text-sm">{company?.address}</p>}
                        {company?.mobile && (
                            <p className="text-sm">
                                {t('repPhoneText')}: {company?.mobile}
                            </p>
                        )}
                        {company?.email && <p className="text-sm">{company?.email}</p>}

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold underline">{t('saleCategoryReportTitle')}</h2>
                            {filters.year ? (
                                <p className="text-sm">
                                    {t('repShowingForYearText')} <strong>{filters.year}</strong>
                                </p>
                            ) : (
                                <p className="text-sm">{t('repFromToDateText', { from: filters.from_date, to: filters.to_date })}</p>
                            )}
                        </div>

                        <div className="absolute top-16 right-4 print:hidden">
                            <Link href={route('reports.sale.filter', { tab: 'category' })} className="text-sm text-blue-600 hover:underline">
                                {t('repChangeFiltersText')}
                            </Link>
                        </div>
                    </CardHeader>

                    {/* ── Table ───────────────────── */}
                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                                <thead className="bg-gray-100 print:bg-white">
                                    <tr>
                                        <th className="border px-2 py-1">{t('repSerialNoHeader')}</th>
                                        {filters.year ? (
                                            <>
                                                <th className="border px-2 py-1">{t('repMonthHeader')}</th>
                                                <th className="border px-2 py-1 text-right">{t('repAmountHeader')} (Tk)</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="border px-2 py-1">{t('repDateHeader')}</th>
                                                <th className="border px-2 py-1">{t('repVoucherNoHeader')}</th>
                                                <th className="border px-2 py-1">{t('repPartyHeader')}</th>
                                                <th className="border px-2 py-1">{t('repCategoryHeader')}</th>
                                                <th className="border px-2 py-1">{t('repItemHeader')}</th>
                                                <th className="border px-2 py-1 text-right">{t('repQuantityHeader')}</th>
                                                <th className="border px-2 py-1">Unit</th>
                                                <th className="border px-2 py-1 text-right">Rate</th>
                                                <th className="border px-2 py-1 text-right">{t('repAmountHeader')} (Tk)</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.length ? (
                                        <>
                                            {entries.map((r, i) => (
                                                <tr key={i} className="print:bg-white">
                                                    <td className="border px-2 py-1">{i + 1}</td>

                                                    {filters.year ? (
                                                        <>
                                                            <td className="border px-2 py-1">
                                                                {new Date(Number(filters.year), (r.month ?? 1) - 1).toLocaleString('default', {
                                                                    month: 'long',
                                                                })}
                                                            </td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.amount ?? 0).toFixed(2)}</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="border px-2 py-1">{new Date(r.date).toLocaleDateString()}</td>
                                                            <td className="border px-2 py-1">{r.voucher_no}</td>
                                                            <td className="border px-2 py-1">{r.party}</td>
                                                            <td className="border px-2 py-1">{r.category_name}</td>
                                                            <td className="border px-2 py-1">{r.item_name}</td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.qty ?? 0).toFixed(2)}</td>
                                                            <td className="border px-2 py-1">{r.unit_name}</td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.rate ?? 0).toFixed(2)}</td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.amount ?? 0).toFixed(2)}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}

                                            {/* Grand Total Row */}
                                            <tr className="bg-gray-100 font-semibold print:bg-white">
                                                <td colSpan={filters.year ? 2 : 9} className="border px-2 py-1 text-right">
                                                    Grand Total
                                                </td>
                                                <td className="border px-2 py-1 text-right">{totalAmount.toFixed(2)}</td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={filters.year ? 3 : 10} className="border px-4 py-4 text-center text-gray-500">
                                                No data found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Totals Summary */}
                            {!filters.year && entries.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm font-semibold">
                                        {t('repTotalText')} {t('repQuantityHeader')}: {totalQty.toFixed(2)}
                                    </p>

                                    <div className="text-sm">
                                        {qtyByUnit.map(([unit, qty]) => (
                                            <div key={unit}>
                                                {unit} – {qty.toFixed(2)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex justify-end gap-2 print:hidden">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> {t('repPrintText')}
                            </Button>
                            <a
                                href={route('reports.sale.export', { tab: 'category', type: 'pdf', ...filters })}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4" /> {t('repSaveAsPdfText')}
                            </a>
                            <a
                                href={route('reports.sale.export', { tab: 'category', type: 'xlsx', ...filters })}
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileSpreadsheet className="h-4 w-4" /> {t('repSaveAsExcelText')}
                            </a>
                        </div>
                    </CardContent>

                    {/* Footer */}
                    <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm">
                        <span>Generated on {new Date().toLocaleString()}</span>
                        <span>
                            {company?.company_name} • {company?.email}
                        </span>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
