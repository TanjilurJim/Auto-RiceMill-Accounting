import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import moment from 'moment';
import React, { useRef } from 'react';
import ActionFooter from '@/components/ActionFooter';

interface Company {
    name: string;
    company_name: string;
    address: string;
    phone: string;
    logo_path: string;
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
    note: string;
    journal: {
        date: string;
        voucher_no: string;
    };
}

interface PageProps {
    company: Company;
    employee: Employee;
    entries: JournalEntry[];
    from: string;
    to: string;
    opening_balance: number;
}

const EmployeeLedger: React.FC = () => {
    const { props } = usePage<{ company: Company; employee: Employee; entries: JournalEntry[]; from: string; to: string; opening_balance: number; user: { name: string }; }>();
    const { company, employee, entries, from, to, opening_balance } = props;

    let runningBalance = opening_balance;
    let totalDebit = 0;
    let totalCredit = 0;

    const formatTk = (value: number) => Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2 });

    const reportRef = useRef<HTMLDivElement>(null);



    const handleExportPDF = () => {
        const originalTitle = document.title;
        document.title = `EmployeeLedger-${employee.name}-${from}-to-${to}`;

        window.print();

        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    return (
        <AppLayout>
            <Head title="Employee Ledger Report" />
            <div
                className="max-w-full bg-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12"
                ref={reportRef}
            >
                {/* Company Info */}
                <div className="mb-4 text-center">
                    {company?.logo_path && (
                        <img
                            src={company?.logo_path}
                            alt="Company Logo"
                            className="mx-auto mb-2 h-16 w-16 object-cover"
                        />
                    )}
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {company?.company_name}
                    </h2>
                    <p className="text-sm sm:text-base">{company?.address}</p>
                    <p className="text-sm sm:text-base">{company?.mobile}</p>
                    <p className="text-sm sm:text-base">{company?.email}</p>
                    <p className="text-sm sm:text-base">{company?.website}</p>
                    <p className="text-sm sm:text-base">
                        Financial Year: {company?.financial_year}
                    </p>
                </div>

                {/* Employee Info */}
                <div className="mb-4 rounded border p-4 sm:p-6">
                    <h3 className="mb-2 text-lg sm:text-xl font-semibold">
                        Employee Ledger
                    </h3>
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
                        <strong>Opening Balance:</strong> Tk. {formatTk(opening_balance)}{' '}
                        {opening_balance >= 0 ? '(DR)' : '(CR)'}
                    </p>
                </div>

                {/* <div className="mb-4 flex justify-end gap-3 no-print">
                    <button onClick={() => window.print()} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                        🖨 Print
                    </button>
                    <button onClick={handleExportPDF} className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
                        📄 Export as PDF
                    </button>
                </div> */}



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
                            {entries.map((entry) => {
                                if (entry.type === 'debit') {
                                    totalDebit += entry.amount;
                                    runningBalance -= entry.amount;
                                } else {
                                    totalCredit += entry.amount;
                                    runningBalance += entry.amount;
                                }

                                return (
                                    <tr key={entry.id}>
                                        <td className="border p-2">
                                            {moment(entry.journal.date).format('DD-MM-YY')}
                                        </td>
                                        <td className="border p-2">{entry.type}</td>
                                        <td className="border p-2">{entry.journal.voucher_no}</td>
                                        <td className="border p-2 text-right">
                                            {entry.type === 'debit' ? formatTk(entry.amount) : ''}
                                        </td>
                                        <td className="border p-2 text-right">
                                            {entry.type === 'credit' ? formatTk(entry.amount) : ''}
                                        </td>
                                        <td className="border p-2 text-right">
                                            {formatTk(Math.abs(runningBalance))}{' '}
                                            {runningBalance >= 0 ? 'DR' : 'CR'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gray-100 font-semibold">
                            <tr>
                                <td className="border p-2 text-center" colSpan={3}>
                                    Total
                                </td>
                                <td className="border p-2 text-right">{formatTk(totalDebit)}</td>
                                <td className="border p-2 text-right">{formatTk(totalCredit)}</td>
                                <td className="border p-2 text-right"></td>
                            </tr>
                            <tr>
                                <td className="border p-2 text-center" colSpan={5}>
                                    Closing Balance
                                </td>
                                <td className="border p-2 text-right">
                                    {formatTk(Math.abs(runningBalance))}{' '}
                                    {runningBalance >= 0 ? 'DR' : 'CR'}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-6 text-right text-xs sm:text-sm text-gray-500">
                    Printed on {moment().format('DD-MM-YYYY, h:mm a')} | User: {props.user.name}
                </div>

                {/* Action Footer */}
                <ActionFooter
                    onSubmit={() => window.print()}
                    onSaveAndPrint={handleExportPDF}
                    submitText="🖨 Print"
                    saveAndPrintText="📄 Export as PDF"
                    cancelHref="/employee-ledger"
                    className="justify-end py-4"
                />


            </div>
        </AppLayout>
    );
};

export default EmployeeLedger;
