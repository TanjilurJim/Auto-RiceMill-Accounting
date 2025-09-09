import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Props {
    withdrawals: {
        id: number;
        date: string;
        ref_no: string;
        party_ledger_name: string;
        godown_name: string;
        total: number;
        items: {
            item_name: string;
            qty: number;
            rate: number;
            total: number;
        }[];
    }[];
}

export default function PartyStockWithdrawIndex({ withdrawals }: Props) {
    return (
        <AppLayout>
            <Head title="মাল উত্তোলন তালিকা" />
            <div className="h-full w-screen bg-background p-6 lg:w-full">
                <div className="h-full rounded-lg bg-background p-6">
                    <h1 className="mb-4 text-xl font-bold">মাল উত্তোলন তালিকা</h1>

                    <table className="w-full table-auto border text-sm">
                        <thead className="bg-background">
                            <tr>
                                <th className="border p-2">তারিখ</th>
                                <th className="border p-2">রেফারেন্স নম্বর</th>
                                <th className="border p-2">পার্টি</th>
                                <th className="border p-2">গুদাম</th>
                                <th className="border p-2">মোট</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id}>
                                    <td className="border p-2">{withdrawal.date}</td>
                                    <td className="border p-2">{withdrawal.ref_no}</td>
                                    <td className="border p-2">{withdrawal.party_ledger_name}</td>
                                    <td className="border p-2">{withdrawal.godown_name}</td>
                                    <td className="border p-2">{Number(withdrawal.total || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
