import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Entry {
    date: string;
    type: string;
    voucher_no: string;
    ledger: string;
    debit: number;
    credit: number;
    note?: string;
    created_by?: string;
}

interface Props {
    entries: Entry[];
    filters: {
        from: string;
        to: string;
        transaction_type?: string;
        created_by?: string;
    };
    company: {
        company_name: string;
        logo_path?: string;
         email?: string;
    financial_year?: string;
    website?: string;

    mobile?: string;
    address?: string;
    logo_url?: string;
    logo_thumb_url?: string;
    };
}

export default function DayBook({ entries, filters, company }: Props) {
    const totalDebit = entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);

    return (
        <AppLayout>
            <Head title="Day Book Report" />
            <div className="absolute top-16 right-4 print:hidden">
                <Link href={route('reports.day-book')} className="text-sm text-blue-600 hover:underline">
                    Change Filters
                </Link>
            </div>
            <div className="space-y-6 p-6">


                <Card>
                    <CardHeader className="relative bg-gray-50 py-6 text-center">
                        <div className="space-y-1">
                            {company?.logo_url && (
                                <img src={company.logo_url} alt="Company Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />
                            )}
                            <h1 className="text-3xl font-bold uppercase">{company?.company_name ?? 'Company Name'}</h1>
                            {company?.address && <p className="text-sm text-gray-700">{company?.address}</p>}
                            {company?.mobile && <p className="text-sm text-gray-700">Phone: {company?.mobile}</p>}
                            {(company?.email || company?.website) && (
                                <p className="text-sm text-gray-700">
                                    {company?.email && <span>{company?.email}</span>}
                                    {company?.email && company?.website && <span className="mx-1">|</span>}
                                    {company?.website && <span>{company?.website}</span>}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold underline">Day Book Report</h2>
                            <p className="text-sm text-gray-600">
                                From: <strong>{dayjs(filters.from).format('MMMM D, YYYY')}</strong>, To:{' '}
                                <strong>{dayjs(filters.to).format('MMMM D, YYYY')}</strong>
                                {filters.transaction_type && ` | Type: ${filters.transaction_type}`}
                                {filters.created_by && ` | Created by: ${filters.created_by}`}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Type</th>
                                        <th className="border p-2">Voucher No</th>
                                        <th className="border p-2">Ledger</th>
                                        <th className="border p-2">Created By</th>
                                        <th className="border p-2 text-right">Debit(TK)</th>
                                        <th className="border p-2 text-right">Credit(TK)</th>
                                        <th className="border p-2">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-4 text-center text-gray-500">
                                                No records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        entries.map((entry, index) => (
                                            <tr key={index}>
                                                <td className="border p-2">{dayjs(entry.date).format('YYYY-MM-DD')}</td>
                                                <td className="border p-2">{entry.type}</td>
                                                <td className="border p-2">{entry.voucher_no}</td>
                                                <td className="border p-2">{entry.ledger}</td>
                                                <td className="border p-2">{entry.created_by ?? '-'}</td>
                                                <td className="border p-2 text-right">{Number(entry.debit || 0).toFixed(2)}</td>
                                                <td className="border p-2 text-right">{Number(entry.credit || 0).toFixed(2)}</td>
                                                <td className="border p-2">{entry.note ?? '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                    {entries.length > 0 && (
                                        <tr className="bg-gray-100 font-semibold">
                                            <td colSpan={5} className="border p-2 text-right">
                                                Total
                                            </td>
                                            <td className="border p-2 text-right">{totalDebit.toFixed(2)}(TK)</td>
                                            <td className="border p-2 text-right">{totalCredit.toFixed(2)}(TK)</td>
                                            <td className="border p-2"></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-4 flex justify-end gap-2 print:hidden">
                    <Button variant="outline" onClick={() => window.print()}> <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <a
                        href={route('reports.day-book.pdf', {
                            from_date: filters.from,
                            to_date: filters.to,
                            transaction_type: filters.transaction_type,
                            created_by: filters.created_by,
                        })}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        <FileText className="h-4 w-4" />
                        Download PDF
                    </a>
                    <a
                        href={route('reports.day-book.excel', {
                            from_date: filters.from,
                            to_date: filters.to,
                            transaction_type: filters.transaction_type,
                            created_by: filters.created_by,
                        })}
                        className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                    ><FileSpreadsheet className="h-4 w-4" />
                        Export Excel
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
