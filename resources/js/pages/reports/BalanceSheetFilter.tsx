import { Card, CardContent } from '@/components/ui/card';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';

interface Props {
  default_from: string; // FY start
  default_to: string;   // today (or FY end)
}

export default function BalanceSheetFilter({ default_from, default_to }: Props) {
  const { data, setData, get, processing } = useForm({
    from_date: default_from,
    to_date: default_to,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('reports.balance-sheet'), {
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <AppLayout>
      <Head title="Balance-Sheet Filters" />

      <div className="h-full w-screen bg-background p-6 lg:w-full">
        <div className="h-full rounded-lg bg-background p-6">
          <PageHeader title="Balance-Sheet Filter" />

          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={submit} className="space-y-4">
                {/* FY start (locked) */}
                <div>
                  <InputCalendar
                    value={data.from_date}
                    onChange={() => {}}
                    label="Financial Year Start (auto)"
                    required
                    disabled
                    // If your InputCalendar doesn’t support `disabled`,
                    // keep this prop and also show it readOnly in the component.
                  />
                </div>

                {/* As-of date (editable) */}
                <div>
                  <InputCalendar
                    value={data.to_date}
                    onChange={(val) => setData('to_date', val)}
                    label="As of Date"
                    required
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Balance Sheet shows <strong>closing balances as of the date</strong>; Profit/Loss is <strong>YTD from the financial year start</strong>.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="rounded border px-4 py-2"
                    onClick={() => router.visit(route('reports.balance-sheet'))}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={processing}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
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
