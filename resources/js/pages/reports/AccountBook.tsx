import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Printer } from 'lucide-react';

import { useMemo } from 'react';

interface Entry {
    date: string;
    voucher_no: string;
    type: string;
    account: string;
    note: string;
    debit: number;
    credit: number;
}

interface Props {
    company: {
        company_name: string;
        address?: string;
        mobile?: string;
        logo_path?: string;
        website?: string;
        email?: string;
        financial_year?: string; // <-- string, not varChar
    };

    ledgers: { id: number; account_ledger_name: string }[];

    // full ledger profile
    ledger: {
        id: number;
        account_ledger_name: string;
        phone_number: string;
        email?: string;
        address?: string;
        opening_balance: number;
        debit_credit: 'debit' | 'credit';
    };

    entries: Entry[];
    opening_balance: number;
    from: string;
    to: string;
    ledger_id: number;
}

export default function AccountBook({ company, entries, opening_balance, from, to, ledgers, ledger_id, ledger }: Props) {
    const ledgerName = ledgers.find((l) => l.id === ledger_id)?.account_ledger_name || 'Ledger';

    const { rows, closingBalance, totalDebit, totalCredit } = useMemo(() => {
        let runningBalance = opening_balance;
        let totalDebit = 0;
        let totalCredit = 0;

        const rows = entries.map((e) => {
            totalDebit += e.debit;
            totalCredit += e.credit;
            runningBalance += e.debit - e.credit;

            return {
                ...e,
                runningBalance,
            };
        });

        return { rows, closingBalance: runningBalance, totalDebit, totalCredit };
    }, [entries, opening_balance]);

    return (
        <AppLayout title="Account Book">
            <div className="absolute top-4 right-4 print:hidden">
                <Link href={route('reports.account-book')} className="text-sm text-blue-600 hover:underline">
                    Change Filters
                </Link>
            </div>
            <Head title="Account Book" />

            <div className="mt-6 max-w-full rounded bg-white p-4 shadow print:text-xs print:font-normal">
                {/* Header */}
                {/* Header Layout */}
                <div className="mb-6 text-center">
                    {company?.logo_path && <img src={company.logo_path} alt="Company Logo" className="mx-auto mb-2 h-16" />}
                    <h2 className="text-2xl font-bold">{company.company_name}</h2>

                    {company.address && <p className="text-sm">{company.address}</p>}
                    {company.mobile && <p className="text-sm">Mobile: {company.mobile}</p>}
                    {company.email && <p className="text-sm">Email: {company.email}</p>}
                    {company.website && (
                        <p className="text-sm">
                            Website:{' '}
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                {company.website}
                            </a>
                        </p>
                    )}
                    {company.financial_year && (
                        <p className="mt-1 text-sm italic">
                            Financial Year: <strong> {company.financial_year}</strong>
                        </p>
                    )}
                </div>
                <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
                    {/* LEFT  ─ Ledger details */}
                    <div className="mb-3 md:mb-0">
                        <p className="text-base font-semibold">Ledger&nbsp;:&nbsp;{ledger.account_ledger_name}</p>

                        {ledger.phone_number && <p className="text-sm">Phone&nbsp;:&nbsp;{ledger.phone_number}</p>}
                        {ledger.email && <p className="text-sm">Email&nbsp;:&nbsp;{ledger.email}</p>}
                        {ledger.address && <p className="text-sm">Address&nbsp;:&nbsp;{ledger.address}</p>}
                    </div>

                    {/* RIGHT ─ Opening / Closing balances */}
                    <div className="text-right">
                        <p className="text-sm">
                            <strong>
                                From&nbsp;:&nbsp;{from}&nbsp;—&nbsp;To&nbsp;:&nbsp;{to}
                            </strong>
                        </p>
                        <p className="text-sm text-blue-600">
                            Opening&nbsp;Balance:&nbsp;
                            {Math.abs(opening_balance).toFixed(2)}
                            &nbsp;({ledger.debit_credit === 'debit' ? 'Dr' : 'Cr'})
                        </p>
                        <p className="text-sm text-blue-600">
                            Closing&nbsp;Balance:&nbsp;
                            {Math.abs(closingBalance).toFixed(2)}
                            &nbsp;({closingBalance >= 0 ? 'Dr' : 'Cr'})
                        </p>
                    </div>
                </div>

                {/* Table */}
                <table className="mt-4 w-full table-auto border-collapse border text-sm print:text-xs">
                    <thead className="bg-gray-100">
                        <tr className="border">
                            <th className="border px-2 py-1">Date</th>
                            <th className="border px-2 py-1">Type</th>
                            <th className="border px-2 py-1">Vch. No</th>
                            <th className="border px-2 py-1">Accounts</th>
                            <th className="border px-2 py-1">Debit (TK)</th>
                            <th className="border px-2 py-1">Credit (TK)</th>
                            <th className="border px-2 py-1">Balance (TK)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((entry, i) => (
                            <tr key={i} className="border hover:bg-gray-50">
                                <td className="border px-2 py-1 whitespace-nowrap">{entry.date}</td>
                                <td className="border px-2 py-1">{entry.type}</td>
                                <td className="border px-2 py-1">{entry.voucher_no}</td>
                                <td className="border px-2 py-1">{entry.note}</td>
                                <td className="border px-2 py-1 text-right">{Number(entry.debit || 0).toFixed(2)}(TK) </td>
                                <td className="border px-2 py-1 text-right">{Number(entry.credit || 0).toFixed(2)}(TK)</td>
                                <td className="border px-2 py-1 text-right">
                                    {Math.abs(Number(entry.runningBalance)).toFixed(2)} ({Number(entry.runningBalance) >= 0 ? 'Dr' : 'Cr'})
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold">
                            <td colSpan={4} className="border px-2 py-1 text-right">
                                Total
                            </td>
                            <td className="border px-2 py-1 text-right text-blue-700">{totalDebit.toFixed(2)}(TK)</td>
                            <td className="border px-2 py-1 text-right text-blue-700">{totalCredit.toFixed(2)}(TK)</td>
                            <td className="border px-2 py-1 text-right text-blue-700">
                                {Math.abs(closingBalance).toFixed(2)} ({closingBalance >= 0 ? 'Dr' : 'Cr'})
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Print button */}
                <div className="mt-6 flex flex-wrap justify-end gap-2 print:hidden">
                    <a
                        href={route('reports.account-book.excel', { ledger_id, from, to })}
                        className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        download
                    >
                        Export Excel
                    </a>
                    <a
                        href={route('reports.account-book.pdf', { ledger_id, from, to })}
                        download
                        className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Export PDF
                    </a>
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
