import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Printer } from 'lucide-react';
import { useTranslation } from '../../components/useTranslation';

interface Row {
    group: string;
    side: 'asset' | 'liability';
    value: number;
}

type Props = {
    from_date: string;
    to_date: string;
    balances: Row[];
    assetTotal: number;
    liabTotal: number;
    difference: number;
    company?: {
        company_name?: string;
        address?: string;
        phone?: string;
        email?: string;
        logo_path?: string | null;
        logo_thumb_path?: string | null;
        logo_url?: string | null;
    };
};

export default function BalanceSheet({ from_date, to_date, balances = [], assetTotal = 0, liabTotal = 0, difference = 0, company }: Props) {
    const t = useTranslation();
    const assets = (balances || []).filter((r) => r.side === 'asset');
    const liabs = (balances || []).filter((r) => r.side === 'liability');

    const logo = company?.logo_url ?? company?.logo_thumb_path ?? company?.logo_path ?? undefined;

    const fmt = (n: unknown) =>
        Number(n ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <AppLayout>
            <Head title="Balance Sheet" />

            {/* Top bar: Change Filters */}
            <div className="mb-2 flex items-center justify-end print:hidden">
                <Link href={route('reports.balance-sheet.filter')} className="text-sm font-medium text-blue-600 hover:underline">
                    {t('repChangeFiltersText')}
                </Link>
            </div>

            {/* ─── Company header ─── */}
            <div className="mb-6 text-center print:text-xs">
                {logo && <img src={logo} alt={t('repCompanyLogoAlt')} className="mx-auto mb-2 h-20 object-contain print:h-12" />}
                <h1 className="text-2xl font-bold">{company?.company_name}</h1>
                {company?.address && <div>{company.address}</div>}
                {company?.phone && (
                    <div>
                        {t('repPhoneLabel')}: {company.phone}
                    </div>
                )}
                {company?.email && (
                    <div>
                        {t('repEmailLabel')}: {company.email}
                    </div>
                )}
                <p className="mt-1 text-sm">
                    {t('repBalanceSheetTitle')}&nbsp;<strong>{from_date}</strong> → <strong>{to_date}</strong>
                </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 print:text-xs">
                {/* ASSETS */}
                <div>
                    <h2 className="bg-background/20 px-3 py-1 font-semibold">{t('repAssetsTitle')}</h2>
                    {assets.map((r) => (
                        <div key={r.group} className="flex justify-between border-b px-3 py-1">
                            <span>{r.group}</span>
                            <span>{fmt(r.value)}</span>
                        </div>
                    ))}
                    <div className="bg-background flex justify-between px-3 py-1 font-bold">
                        <span>{t('repTotalAssetsText')}</span>
                        <span>{fmt(assetTotal)}</span>
                    </div>
                </div>

                {/* LIABILITIES & EQUITY */}
                <div>
                    <h2 className="bg-background px-3 py-1 font-semibold">{t('repLiabilitiesEquityTitle')}</h2>
                    {liabs.map((r) => (
                        <div key={r.group} className="flex justify-between border-b px-3 py-1">
                            <span>{r.group}</span>
                            <span>{fmt(r.value)}</span>
                        </div>
                    ))}
                    <div className="bg-background flex justify-between px-3 py-1 font-bold">
                        <span>{t('repTotalLiabilitiesEquityText')}</span>
                        <span>{fmt(liabTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Imbalance banner */}
            {Number(difference ?? 0) !== 0 && (
                <p className="mt-4 text-center font-semibold text-red-600">
                    {t('repDifferenceText')}: {fmt(difference)}
                </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-center gap-4 print:hidden">
                <Button variant="outline" onClick={() => window.print()} className="rounded border px-4 py-2">
                    <Printer className="mr-2 h-6 w-6" />
                    {t('repPrintText')}
                </Button>

                <a
                    href={route('reports.balance-sheet.pdf', { from_date, to_date })}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                >
                    <FileText className="h-4 w-4" />
                    {t('repSaveAsPdfText')}
                </a>

                <a
                    href={route('reports.balance-sheet.excel', { from_date, to_date })}
                    className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                >
                    <FileText className="h-4 w-4" />
                    {t('repSaveAsExcelText')}
                </a>
            </div>
        </AppLayout>
    );
}
