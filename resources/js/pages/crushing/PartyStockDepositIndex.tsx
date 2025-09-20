import DeleteBtn from '@/components/Btn&Link/DeleteBtn'; // Assuming the path for DeleteBtn
import EditBtn from '@/components/Btn&Link/EditBtn'; // Assuming the path for EditBtn
import Pagination from '@/components/Pagination'; // Assuming the path for Pagination
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

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

const onEdit = (id: number) => {
    router.visit(route('party-stock.deposit.edit', { id }));
};

const onDelete = (id: number) => {
    if (!confirm('এই ডিপোজিট ডকুমেন্টটি মুছে ফেলতে চান?')) return;
    router.delete(route('party-stock.deposit.destroy', { id }), { preserveScroll: true });
};

export default function PartyStockDepositIndex({ deposits, pagination }: Props) {
    return (
        <AppLayout>
            <Head title="পার্টির পণ্য জমা তালিকা" />
            <div className="bg-background h-full w-screen p-6 lg:w-full">
                <div className="bg-background h-full space-y-6 rounded-sm p-6">
                    <h1 className="text-xl font-bold">পার্টির পন্য জমা তালিকা</h1>

                    {deposits.length === 0 && (
                        <div className="rounded bg-yellow-50 p-4 text-center text-sm text-yellow-700 shadow">কোন ডেটা পাওয়া যায়নি।</div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border text-sm">
                            <thead className="bg-background">
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
                                            <tr key={idx} className="hover:bg-background">
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
                                                <td className="flex justify-center gap-2 border p-2 text-center">
                                                    <Link
                                                        href={route('party-stock.deposit.show', deposit.id)}
                                                        className="text-foreground rounded bg-blue-600 px-3 py-1 hover:bg-blue-700"
                                                    >
                                                        View
                                                    </Link>
                                                    <EditBtn className="px-3 py-1" editbtnclick={() => onEdit(deposit.id)}>
                                                        Edit
                                                    </EditBtn>

                                                    {/* DeleteBtn expects handleDelete(id:number) and reads delId.id */}
                                                    <DeleteBtn
                                                        className="px-3 py-1"
                                                        handleDelete={onDelete}
                                                        delId={deposit} // deposit has an { id } field; this matches your component
                                                    />
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
