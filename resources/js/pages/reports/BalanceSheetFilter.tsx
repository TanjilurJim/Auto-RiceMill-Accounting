import { Card, CardContent } from '@/components/ui/card';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';

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

            <div className="h-full w-screen bg-background p-6 lg:w-full">
                <div className="h-full rounded-lg bg-background p-6">
                    {/* <h1 className="mb-4 text-lg font-semibold">Balance‑Sheet Filter</h1> */}
                    <PageHeader title="Balance‑Sheet Filter" />

                    <Card className="rounded-lg border shadow-sm">
                      <CardContent className='p-6'>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputCalendar
                                    value={data.from_date}
                                    onChange={val => setData('from_date', val)}
                                    label="From Date"
                                    required
                                />
                            </div>

                            <div>
                                <InputCalendar
                                    value={data.to_date}
                                    onChange={val => setData('to_date', val)}
                                    label="To Date"
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
