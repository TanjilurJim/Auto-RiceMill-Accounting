import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

export default function DayBookFilter({ users, isAdmin }: { users: any[]; isAdmin: boolean }) {
    const [filters, setFilters] = useState({
        from_date: '',
        to_date: '',
        transaction_type: '',
        created_by: '',
    });

    const transactionTypes = [
        'Purchase',
        'Purchase Return',
        'Sale',
        'Sale Return',
        'Receive',
        'Payment',
        'Contra',
        'Journal',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!filters.from_date || !filters.to_date) {
            alert('Please select From and To date');
            return;
        }
        router.get('/reports/day-book', filters);
    };

    return (
        <AppLayout>
            <Head title="Day Book Filter" />
            <div className="p-6 max-w-4xl mx-auto">
                <PageHeader title="Day Book Report Filter" addLinkHref="/reports" addLinkText="Back to Reports" />

                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">From Date<span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="from_date"
                                value={filters.from_date}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">To Date<span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="to_date"
                                value={filters.to_date}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Transaction Type</label>
                            <select
                                name="transaction_type"
                                value={filters.transaction_type}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">All</option>
                                {transactionTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {isAdmin && (
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Created By</label>
                                <select
                                    name="created_by"
                                    value={filters.created_by}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">All</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">View Day Book</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
