import ActionFooter from '@/components/ActionFooter';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function Print({
    company,
    payments,
    voucher_no,
    date,
    payment_mode,
    description,
    total_amount,
    amount_in_words,
    previous_balance,
    closing_balance
}: any) {
    useEffect(() => {
        // Auto trigger print dialog
        setTimeout(() => window.print(), 500);
    }, []);

    return (
        <AppLayout>
            <Head title={`Voucher - ${voucher_no}`} />

            <div className=" max-w-full p-6 text-sm text-gray-800 bg-background print:shadow-none print:p-0 print:text-black">
                {/* Company Info */}
                <div className="text-center mb-4">
                    <h1 className="text-lg font-bold uppercase">{company?.company_name}</h1>
                    <p>{company?.address}</p>
                    <p className="text-sm">{company?.mobile}</p>
                </div>

                {/* Voucher Header */}
                <div className="mb-4 text-center font-bold text-xl border-y py-2">
                    খরচ ভাউচার {/* Expense Voucher in Bangla */}
                </div>

                {/* Voucher Info */}
                <div className="flex justify-between mb-2">
                    <div>
                        <span className="font-semibold">Voucher No:</span> {voucher_no}
                    </div>
                    <div>
                        <span className="font-semibold">Date:</span> {date}
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Account Mode:</span> {payment_mode}
                </div>

                {/* Table of particulars */}
                <table className="w-full border text-left text-sm mt-4">
                    <thead className="bg-background print:bg-white">
                        <tr>
                            <th className="border px-2 py-1">Particulars</th>
                            <th className="border px-2 py-1 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p: any) => (
                            <tr key={p.id}>
                                <td className="border px-2 py-1">
                                    {p.account_ledger?.account_ledger_name}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {Number(p.amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer Info */}
                <div className="mt-4">
                    <p><strong>Note:</strong> {description || 'N/A'}</p>
                    <p><strong>Grand Total:</strong> {Number(total_amount).toFixed(2)}</p>
                    <p><strong>Amount In Words:</strong> {amount_in_words}</p>
                    <p><strong>Previous Balance:</strong> {Number(previous_balance).toFixed(2)} Dr.</p>
                    <p><strong>Closing Balance:</strong> {Number(closing_balance).toFixed(2)} Dr.</p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-3 text-center mt-10 text-xs print:mt-16">
                    <div className="border-t pt-2">Signature</div>
                    <div className="border-t pt-2">Verified By</div>
                    <div className="border-t pt-2">Authorised Signatory</div>
                </div>

                {/* action footer (hidden on print) */}
                <ActionFooter
                    className="justify-center print:hidden"
                    cancelHref="/payment-add"
                    cancelText="Back"
                    onSubmit={() => window.print()}
                    submitText="Print"
                />

            </div>
        </AppLayout>
    );
}
