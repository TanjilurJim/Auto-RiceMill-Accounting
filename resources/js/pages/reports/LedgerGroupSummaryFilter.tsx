import React from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';

interface GroupUnder {
    id: number;
    name: string;
}

export default function LedgerGroupSummaryFilter() {
    const { group_unders = [] } = usePage().props as { group_unders: GroupUnder[] };

    const [form, setForm] = React.useState({
        from_date: '',
        to_date: '',
        group_under_id: '',
    });

    const [submitting, setSubmitting] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.get(route('reports.ledger-group-summary'), form, {
            replace: true, // optional: to avoid back stack clutter
            preserveState: true,
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout title="Ledger Group Summary Filter">
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    {/* <h1 className="text-xl font-semibold mb-4 text-gray-700">Ledger Group Summary</h1> */}
                    <PageHeader title="Ledger Group Summary" />


                    <form onSubmit={handleSubmit} className=' rounded-lg border p-6'>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">From Date</label>
                                <input
                                    type="date"
                                    name="from_date"
                                    value={form.from_date}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm shadow-sm"
                                    required

                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">To Date</label>
                                <input
                                    type="date"
                                    name="to_date"
                                    value={form.to_date}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">Group Under </label>
                            <select
                                name="group_under_id"
                                value={form.group_under_id}
                                onChange={handleChange}

                                className="mt-1 w-full rounded border px-3 py-2 text-sm shadow-sm"
                            >
                                <option value="">All Groups</option>
                                {group_unders.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-right">
                                {submitting ? 'Loading...' : 'Generate Report'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
