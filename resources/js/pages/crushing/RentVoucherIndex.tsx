import ActionButtons from '@/components/ActionButtons';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Voucher {
    id: number;
    date: string;
    vch_no: string;
    party: { account_ledger_name: string };
    grand_total: string;
    balance: string;
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

export default function RentVoucherIndex({ vouchers, pagination }: Props) {
    return (
        <AppLayout>
            <Head title="Rent Vouchers" />
            
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Rent Vouchers</h1>

                    <a
                        href={route('party-stock.rent-voucher.create')}
                        className="inline-flex items-center bg-indigo-600 px-4 py-2 text-white rounded-sm hover:bg-indigo-700"
                    >
                        + New Voucher
                    </a>
                </div>

                <table className="mb-6 w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">#</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Vch No</th>
                            <th className="border p-2">Party</th>
                            <th className="border p-2 text-right">Grand Total</th>
                            <th className="border p-2 text-right">Balance</th>
                            <th className="border p-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((v, i) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="border p-2 text-center">{(pagination.currentPage - 1) * 15 + i + 1}</td>
                                <td className="border p-2">{v.date}</td>
                                <td className="border p-2">{v.vch_no}</td>
                                <td className="border p-2">{v.party.account_ledger_name}</td>
                                <td className="border p-2 text-right">{v.grand_total}</td>
                                <td className="border p-2 text-right">{v.balance}</td>
                                <td className="border p-2 text-center">
                                    <ActionButtons
                                        viewHref={route('party-stock.rent-voucher.show', v.id)}
                                        editHref={route('party-stock.rent-voucher.edit', v.id)}
                                        viewText="View"
                                        editText="Edit"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    links={pagination.links}
                    currentPage={pagination.currentPage}
                    lastPage={pagination.lastPage}
                    total={pagination.total}
                />
            </div>
            </div>
            
        </AppLayout>
    );
}
