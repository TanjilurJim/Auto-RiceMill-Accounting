import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import Select from 'react-select';
import PageHeader from '@/components/PageHeader';
import dayjs from 'dayjs';
interface Props {
    ledgers: { id: number; account_ledger_name: string }[];
}
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'var(--input)',
    borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
    boxShadow: state.isFocused ? '0 0 0 2px var(--ring)' : 'none',
    color: 'var(--foreground)',
    minHeight: '2.5rem',
    borderRadius: 'var(--radius-md)',
  }),
  singleValue: (base: any) => ({ ...base, color: 'var(--foreground)' }),
  input:       (base: any) => ({ ...base, color: 'var(--foreground)' }),
  placeholder: (base: any) => ({ ...base, color: 'var(--muted-foreground)' }),

  menu: (base: any) => ({
    ...base,
    backgroundColor: 'var(--popover)',
    color: 'var(--popover-foreground)',
    border: '1px solid var(--border)',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'var(--primary)'
      : state.isFocused
      ? 'var(--accent)'
      : 'transparent',
    color: state.isSelected ? 'var(--primary-foreground)' : 'var(--popover-foreground)',
  }),

  indicatorSeparator: (b: any) => ({ ...b, backgroundColor: 'var(--border)' }),
  dropdownIndicator:  (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),
  clearIndicator:     (b: any) => ({ ...b, color: 'var(--muted-foreground)' }),

  // if you render into a portal (recommended to avoid overflow issues)
  menuPortal: (base: any) => ({ ...base, zIndex: 60 }), // adjust to your stack
};
export default function AccountBookFilter({ ledgers }: Props) {
        const today = dayjs().format('YYYY-MM-DD');
    
    const { data, setData, processing } = useForm({
        ledger_id: '',
        from_date: today,
        to_date: today,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('reports.account-book'), data, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Account Book — Filter" />

            <div className="bg-background p-6 h-full w-screen lg:w-full">
                <div className="bg-background h-full rounded-lg p-6">

                    <PageHeader title="Account Book Report Filter" />

                    <Card className="rounded-lg border shadow-sm">
                        
                      

                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Ledger selector */}
                                <div className="space-y-2">
                                    <Label htmlFor="ledger" className="text-foreground">
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
                                                                             styles={selectStyles}

                                    />
                                </div>

                                {/* Date range */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <InputCalendar
                                            value={data.from_date}
                                            onChange={val => setData('from_date', val)}
                                            label="From Date"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <InputCalendar
                                            value={data.to_date}
                                            onChange={val => setData('to_date', val)}
                                            label="To Date"
                                            required
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
            </div>
        </AppLayout>
    );
}