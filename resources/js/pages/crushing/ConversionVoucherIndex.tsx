import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Voucher {
    id: number;
    date: string;
    ref_no: string;
    party: { account_ledger_name: string };
    godown: { name: string };
    total_consumed_qty: string;
    total_generated_qty: string;
}

interface Props {
    vouchers: Voucher[];
    pagination: {
        links: any[];
        currentPage: number;
        lastPage: number;
        total: number;
    };
}

export default function ConversionVoucherIndex({ vouchers, pagination }: Props) {
    return (
        <AppLayout>
            <Head title="Conversion Vouchers" />

            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Conversion Vouchers</h1>

                    {/* Optional “New voucher” link if you keep the create page */}
                    {/* <Link
                        href={route('party-stock.conversion.voucher.create')}
                        className="inline-flex items-center rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                    >
                        + New Voucher
                    </Link> */}
                </div>

                <table className="mb-6 w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">#</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Ref No</th>
                            <th className="border p-2">Party</th>
                            <th className="border p-2">Godown</th>
                            <th className="border p-2 text-right">Consumed Qty</th>
                            <th className="border p-2 text-right">Generated Qty</th>
                            <th className="border p-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((v, i) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="border p-2 text-center">{(pagination.currentPage - 1) * 15 + i + 1}</td>
                                <td className="border p-2">{v.date}</td>
                                <td className="border p-2">{v.ref_no}</td>
                                <td className="border p-2">{v.party.account_ledger_name}</td>
                                <td className="border p-2">{v.godown.name}</td>
                                <td className="border p-2 text-right">{v.total_consumed_qty}</td>
                                <td className="border p-2 text-right">{v.total_generated_qty}</td>
                                <td className="border p-2 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            href={route('party-stock.conversion.voucher.show', v.id)}
                                            className="inline-flex items-center rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={route('party-stock.conversion.voucher.pdf', v.id)}
                                            className="inline-flex items-center rounded bg-indigo-600 px-2 py-1 text-white hover:bg-indigo-700"
                                        >
                                            PDF
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination links={pagination.links} currentPage={pagination.currentPage} lastPage={pagination.lastPage} total={pagination.total} />
            </div>
        </AppLayout>
    );
}
