import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type Withdrawal = {
  id: number;
  date: string;
  ref_no: string;
  party_ledger_name: string;
  godown_name: string;
  total?: number;     // signed overall (optional)
  amount?: number;    // positive overall (preferred)
  total_qty?: number; // positive overall (preferred)
  items: WithdrawalItem[];
};

interface Props {
  withdrawals: Withdrawal[];
}

export default function PartyStockWithdrawIndex({ withdrawals }: Props) {
    // Define table columns for TableComponent
    const tableColumns = [
        { header: 'তারিখ', accessor: 'date' },
        { header: 'রেফারেন্স নম্বর', accessor: 'ref_no' },
        { header: 'পার্টি', accessor: 'party_ledger_name' },
        { header: 'গুদাম', accessor: 'godown_name' },
        { header: 'মোট', accessor: (row: Props['withdrawals'][number]) => Number(row.total || 0).toFixed(2), className: 'text-right' },
    ];

    return (
        <AppLayout>
            <Head title="মাল উত্তোলন তালিকা" />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <h1 className="mb-4 text-xl font-bold">মাল উত্তোলন তালিকা</h1>
                    <TableComponent columns={tableColumns} data={withdrawals} noDataMessage="কোনো তথ্য নেই" />
                </div>
            </div>
        </AppLayout>
    );
}
