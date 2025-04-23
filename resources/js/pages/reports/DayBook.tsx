import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
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
    };
}

export default function DayBook({ entries, filters, company }: Props) {
    const totalDebit = entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);

    return (
        <AppLayout>
            <Head title="Day Book Report" />
            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Day Book Report</h2>
                            <p className="text-sm text-gray-500">
                                From {filters.from} to {filters.to}
                                {filters.transaction_type && ` | Type: ${filters.transaction_type}`}
                                {filters.created_by && ` | Created by: ${filters.created_by}`}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline">
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <Button variant="outline">
                                <FileText className="mr-2 h-4 w-4" /> PDF
                            </Button>
                            <Button variant="outline">
                                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
                            </Button>
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
                                        <th className="border p-2 text-right">Debit</th>
                                        <th className="border p-2 text-right">Credit</th>
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
                                            <td className="border p-2 text-right">{totalDebit.toFixed(2)}</td>
                                            <td className="border p-2 text-right">{totalCredit.toFixed(2)}</td>
                                            <td className="border p-2"></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
