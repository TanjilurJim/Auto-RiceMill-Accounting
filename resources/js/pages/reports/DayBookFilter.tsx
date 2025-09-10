import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function DayBookFilter({ users, isAdmin }: { users: any[]; isAdmin: boolean }) {
  const today = dayjs().format('YYYY-MM-DD');
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');

  // ⬇️ Auto-fill dates on first render
  const [filters, setFilters] = useState(() => ({
    from_date: startOfMonth,
    to_date: today,
    transaction_type: '',
    created_by: '',
  }));

  const transactionTypes = ['Purchase', 'Purchase Return', 'Sale', 'Sale Return', 'Receive', 'Payment', 'Contra', 'Journal'];

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

  console.log('isAdmin', isAdmin);

  return (
    <AppLayout>
      <Head title="Day Book Filter" />
      <div className="h-full w-screen bg-background p-6 lg:w-full">
        <div className="h-full rounded-lg bg-background p-6">
          <PageHeader title="Day Book Report Filter" />

          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <InputCalendar
                  value={filters.from_date}
                  onChange={(val) => setFilters((f) => ({ ...f, from_date: val }))}
                  label="From Date"
                  required
                />
              </div>
              <div>
                <InputCalendar
                  value={filters.to_date}
                  onChange={(val) => setFilters((f) => ({ ...f, to_date: val }))}
                  label="To Date"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">Transaction Type</label>
                <select
                  name="transaction_type"
                  value={filters.transaction_type}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2"
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
                  <label className="mb-1 block font-medium text-gray-700">Created By</label>
                  <select
                    name="created_by"
                    value={filters.created_by}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2"
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
      </div>
    </AppLayout>
  );
}
