import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';

interface Props {
    default_from: string;
    default_to: string;
}

export default function BalanceSheetFilter({ default_from, default_to }: Props) {
    /* Inertia controlled form */
    const { data, setData, get, processing } = useForm({
        from_date: default_from,
        to_date: default_to,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // navigate to the report with GET params
        get(route('reports.balance-sheet'), {
            preserveScroll: true,
            // replaceState so “back” returns to the previous page nicely
            replace: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Balance‑Sheet Filters" />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <h1 className="mb-4 text-lg font-semibold">Balance‑Sheet Filter</h1>

                    <Card className="rounded-lg border shadow-sm">
                      <CardContent className='p-6'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="from" className="block text-sm font-medium">
                                    From&nbsp;Date
                                </label>
                                <input
                                    id="from"
                                    type="date"
                                    value={data.from_date}
                                    onChange={(e) => setData('from_date', e.target.value)}
                                    className="mt-1 w-full rounded border px-2 py-1"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="to" className="block text-sm font-medium">
                                    To&nbsp;Date
                                </label>
                                <input
                                    id="to"
                                    type="date"
                                    value={data.to_date}
                                    onChange={(e) => setData('to_date', e.target.value)}
                                    className="mt-1 w-full rounded border px-2 py-1"
                                    required
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="rounded border px-4 py-2"
                                    onClick={() => router.visit(route('reports.balance-sheet'))}
                                >
                                    Cancel
                                </button>

                                <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                    View Report
                                </button>
                            </div>

                            
                        </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
