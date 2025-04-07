import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ContraPrint({ company, voucher_no, date, from_mode, to_mode, amount, amount_in_words, description }: any) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="p-6 print:p-0">
            <Head title={`Contra Voucher ${voucher_no}`} />

            <div className="mb-4 text-left print:hidden">
                <button onClick={() => window.history.back()} className="rounded bg-gray-300 px-4 py-2 text-sm hover:bg-gray-400">
                    ← Back
                </button>
            </div>

            <div className="mx-auto max-w-3xl rounded border border-gray-300 p-6 shadow print:max-w-full print:border-none print:shadow-none">
                {/* Company Info */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">{company?.company_name}</h1>
                    <p className="text-sm">{company?.company_address}</p>
                    <p className="text-sm">Phone: {company?.phone}</p>
                </div>

                {/* Voucher Header */}
                <div className="mb-4 flex justify-between">
                    <div>
                        <p>
                            <strong>Voucher No:</strong> {voucher_no}
                        </p>
                        <p>
                            <strong>Date:</strong> {date}
                        </p>
                    </div>
                    <div className="text-right">
                        <p>
                            <strong>Contra Entry</strong>
                        </p>
                    </div>
                </div>

                {/* Entry Details */}
                <div className="mb-4 rounded border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">From Mode</th>
                                <th className="border px-4 py-2 text-left">To Mode</th>
                                <th className="border px-4 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">{from_mode}</td>
                                <td className="border px-4 py-2">{to_mode}</td>
                                <td className="border px-4 py-2 text-right">{Number(amount).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Amount in Words */}
                <p className="mb-2 text-sm">
                    <strong>In Words:</strong> {amount_in_words}
                </p>

                {/* Optional Description */}
                {description && (
                    <p className="mb-2 text-sm">
                        <strong>Description:</strong> {description}
                    </p>
                )}

                {/* Signature Placeholder */}
                <div className="mt-12 flex justify-between text-sm">
                    <div>
                        <p>-------------------------</p>
                        <p>Authorized By</p>
                    </div>
                    <div>
                        <p>-------------------------</p>
                        <p>Received By</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
