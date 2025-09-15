import ActionFooter from '@/components/ActionFooter';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import moment from 'moment';
import React, { useMemo, useRef } from 'react';

interface Company {
    name?: string;
    company_name?: string;
    address?: string;
    phone?: string;
    logo_path?: string;
    mobile?: string;
    email?: string;
    website?: string;
    financial_year?: string;
}

interface Employee {
    name: string;
    address?: string;
    mobile?: string;
}

interface JournalEntry {
    id: number;
    type: 'debit' | 'credit';
    amount: number;
    note?: string;
    journal: {
        date: string;
        voucher_no?: string | null;
    };
}

interface PageProps {
    company: Company;
    employee: Employee;
    entries: JournalEntry[];
    from: string;
    to: string;
    opening_balance: number; // credit - debit (from PHP)
    user: { name: string };
}

const fmtTk = (value: number | string) => {
  const n = toNum(value);
  return n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const toNum = (v: unknown) => {
    if (typeof v === 'number') return v;
    if (v == null) return 0;
    const s = String(v).replace(/,/g, ''); // "20,000.00" -> "20000.00"
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
};

const EmployeeLedger: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { company, employee, entries, from, to, opening_balance, user } = props;

    const reportRef = useRef<HTMLDivElement>(null);

    // Build rows with running balance (credit - debit convention)
    const { rows, totals, closingBalance } = useMemo(() => {
        let running = toNum(opening_balance); // credit - debit

        const acc = {
            rows: [] as Array<JournalEntry & { running: number; debitAmt: number; creditAmt: number }>,
            debit: 0,
            credit: 0,
        };

        for (const e of entries) {
            const amt = toNum(e.amount);
            const debitAmt = e.type === 'debit' ? amt : 0;
            const creditAmt = e.type === 'credit' ? amt : 0;

            // running = opening + credits - debits (all numbers)
            running += creditAmt - debitAmt;

            acc.debit += debitAmt;
            acc.credit += creditAmt;

            acc.rows.push({ ...e, running, debitAmt, creditAmt });
        }

        return {
            rows: acc.rows,
            totals: { debit: acc.debit, credit: acc.credit },
            closingBalance: running,
        };
    }, [entries, opening_balance]);

    const handleExportPDF = () => {
        const originalTitle = document.title;
        const safeName = employee.name.replace(/[^\w\-]+/g, '_');
        document.title = `EmployeeLedger-${safeName}-${from}-to-${to}`;
        window.print();
        setTimeout(() => (document.title = originalTitle), 300);
    };

    const balanceLabel = (val: number) => (val >= 0 ? 'CR' : 'DR'); // >=0 ==> credit balance (credit - debit)
    const abs = (n: number) => Math.abs(n);

    return (
        <AppLayout>
            <Head title="Employee Ledger Report" />
            <div className="max-w-full p-4 md:p-12" ref={reportRef}>
                {/* Company Info */}
                <div className="mb-4 text-center">
                    {company?.logo_path && <img src={company.logo_path} alt="Company Logo" className="mx-auto mb-2 h-16 w-16 object-cover" />}
                    <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">{company?.company_name || company?.name || '—'}</h2>
                    {company?.address && <p className="text-sm sm:text-base">{company.address}</p>}
                    {company?.mobile && <p className="text-sm sm:text-base">{company.mobile}</p>}
                    {company?.email && <p className="text-sm sm:text-base">{company.email}</p>}
                    {company?.website && <p className="text-sm sm:text-base">{company.website}</p>}
                    {company?.financial_year && <p className="text-sm sm:text-base">Financial Year: {company.financial_year}</p>}
                </div>

                {/* Employee Info */}
                <div className="mb-4 rounded border p-4 sm:p-6">
                    <h3 className="mb-2 text-lg font-semibold sm:text-xl">Employee Ledger</h3>
                    <p>
                        <strong>Employee Name:</strong> {employee.name}
                    </p>
                    <p>
                        <strong>Address:</strong> {employee.address ?? '-'}
                    </p>
                    <p>
                        <strong>Mobile No:</strong> {employee.mobile ?? '-'}
                    </p>
                    <p>
                        <strong>From:</strong> {from} <strong>To:</strong> {to}
                    </p>
                    <p>
                        <strong>Opening Balance:</strong> Tk. {fmtTk(abs(opening_balance))} {balanceLabel(opening_balance)}
                    </p>
                </div>

                {/* Ledger Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border text-xs sm:text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Vch No.</th>
                                <th className="border p-2 text-right">Debit (Tk)</th>
                                <th className="border p-2 text-right">Credit (Tk)</th>
                                <th className="border p-2 text-right">Balance (Tk)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id}>
                                    <td className="border p-2">{moment(r.journal.date).format('DD-MM-YY')}</td>
                                    <td className="border p-2 uppercase">{r.type}</td>
                                    <td className="border p-2">{r.journal.voucher_no || '-'}</td>
                                    <td className="border p-2 text-right">{r.debitAmt ? fmtTk(r.debitAmt) : ''}</td>
                                    <td className="border p-2 text-right">{r.creditAmt ? fmtTk(r.creditAmt) : ''}</td>
                                    <td className="border p-2 text-right">
                                        {fmtTk(abs(r.running))} {balanceLabel(r.running)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-semibold">
                            <tr>
                                <td className="border p-2 text-center" colSpan={3}>
                                    Total
                                </td>
                                <td className="border p-2 text-right">{fmtTk(totals.debit)}</td>
                                <td className="border p-2 text-right">{fmtTk(totals.credit)}</td>
                                <td className="border p-2 text-right"></td>
                            </tr>
                            <tr>
                                <td className="border p-2 text-center" colSpan={5}>
                                    Closing Balance
                                </td>
                                <td className="border p-2 text-right">
                                    {fmtTk(abs(closingBalance))} {balanceLabel(closingBalance)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-6 text-right text-xs text-gray-500 sm:text-sm">
                    Printed on {moment().format('DD-MM-YYYY, h:mm a')} | User: {user?.name}
                </div>

                {/* Action Footer */}
                <ActionFooter
                    onSubmit={() => window.print()}
                    onSaveAndPrint={handleExportPDF}
                    submitText=" Print"
                    saveAndPrintText="📄 Export as PDF"
                    cancelHref="/employee-ledger"
                    className="justify-end py-4"
                />
            </div>
        </AppLayout>
    );
};

export default EmployeeLedger;
