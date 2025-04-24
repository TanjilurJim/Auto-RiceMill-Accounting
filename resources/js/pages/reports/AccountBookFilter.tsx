import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import Select from 'react-select';

interface Props {
    ledgers: { id: number; account_ledger_name: string }[];
}

export default function AccountBookFilter({ ledgers }: Props) {
    const { data, setData, processing } = useForm({
        ledger_id: '',
        from_date: '',
        to_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('reports.account-book'), data, { preserveState: true });
    };

    return (
        <AppLayout title="Account Book">
            <Head title="Account Book — Filter" />

            <div className="mx-auto mt-6 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                <Card className="rounded-lg border shadow-sm">
                    <CardHeader className="border-b px-6 py-4">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Account Book Filter
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Select ledger and date range to generate the report
                        </p>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Ledger selector */}
                            <div className="space-y-2">
                                <Label htmlFor="ledger" className="text-gray-700">
                                    Account Ledger
                                </Label>
                                <Select
                                    id="ledger"
                                    classNamePrefix="react-select"
                                    placeholder="Select an account ledger..."
                                    options={ledgers.map(l => ({
                                        value: l.id,
                                        label: l.account_ledger_name,
                                    }))}
                                    onChange={opt => setData('ledger_id', opt?.value ?? '')}
                                    className="text-sm"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '42px',
                                            borderRadius: '0.375rem',
                                            borderColor: '#d1d5db',
                                            '&:hover': {
                                                borderColor: '#9ca3af',
                                            },
                                        }),
                                    }}
                                />
                            </div>

                            {/* Date range */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="from-date" className="text-gray-700">
                                        From Date
                                    </Label>
                                    <Input
                                        id="from-date"
                                        type="date"
                                        value={data.from_date}
                                        onChange={e => setData('from_date', e.target.value)}
                                        required
                                        className="h-10 rounded-md border-gray-300
             focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="to-date" className="text-gray-700">
                                        To Date
                                    </Label>
                                    <Input
                                        id="to-date"
                                        type="date"
                                        value={data.to_date}
                                        onChange={e => setData('to_date', e.target.value)}
                                        required
                                        className="h-10 rounded-md border-gray-300
             focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[150px] bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Generate Report'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}