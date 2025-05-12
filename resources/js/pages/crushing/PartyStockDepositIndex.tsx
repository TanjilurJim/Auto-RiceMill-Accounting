import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import EditBtn from '@/components/Btn&Link/EditBtn';  // Assuming the path for EditBtn
import DeleteBtn from '@/components/Btn&Link/DeleteBtn';  // Assuming the path for DeleteBtn
import Pagination from '@/components/Pagination';  // Assuming the path for Pagination

interface Props {
    deposits: {
        id: number;
        date: string;
        ref_no: string;
        party_ledger_name: string;
        godown_name: string;
        remarks: string | null;
        items: {
            item_name: string;
            unit_name: string;
            qty: number;
            rate: number;
            total: number;
        }[];
    }[];
    pagination: {
        links: { url: string | null; label: string; active: boolean }[];
        currentPage: number;
        lastPage: number;
        total: number;
    };
}

export default function PartyStockDepositIndex({ deposits, pagination }: Props) {
    return (
        <AppLayout>
            <Head title="পার্টির পণ্য জমা তালিকা" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="space-y-6">
                    <h1 className="text-xl font-bold">পার্টির পন্য জমা তালিকা</h1>

                    {deposits.length === 0 && (
                        <div className="rounded bg-yellow-50 p-4 text-center text-sm text-yellow-700 shadow">
                            কোন ডেটা পাওয়া যায়নি।
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">পার্টি</th>
                                    <th className="border p-2">রেফারেন্স নম্বর</th>
                                    <th className="border p-2">পণ্য</th>
                                    <th className="border p-2">একক</th>
                                    <th className="border p-2">পরিমাণ</th>
                                    <th className="border p-2">রেট</th>
                                    <th className="border p-2">মোট</th>
                                    <th className="border p-2">তারিখ</th>
                                    <th className="border p-2">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposits.map((deposit) => (
                                    <React.Fragment key={deposit.id}>
                                        {deposit.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                {/* Party Ledger */}
                                                <td className="border p-2">{deposit.party_ledger_name}</td>
                                                {/* Deposit Reference Number */}
                                                <td className="border p-2">{deposit.ref_no}</td>
                                                {/* Item Details */}
                                                <td className="border p-2">{item.item_name}</td>
                                                <td className="border p-2">{item.unit_name}</td>
                                                <td className="border p-2 text-right">{item.qty}</td>
                                                <td className="border p-2 text-right">{Number(item.rate).toFixed(2)}</td>
                                                <td className="border p-2 text-right">{Number(item.total).toFixed(2)}</td>
                                                {/* Date */}
                                                <td className="border p-2 text-center">{deposit.date}</td>
                                                {/* Action Buttons (Edit and Delete) */}
                                                <td className="border p-2 text-center">
                                                    <EditBtn editbtnclick={() => console.log('Edit clicked for', deposit.id)} className="mr-2" />
                                                    <DeleteBtn handleDelete={() => console.log('Delete clicked for', deposit.id)} delId={deposit} />
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
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
