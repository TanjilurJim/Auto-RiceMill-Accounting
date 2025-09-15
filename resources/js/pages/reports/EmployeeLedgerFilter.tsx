import React, { useEffect } from 'react';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';
import moment from 'moment';

interface Employee {
  id: number;
  name: string;
}

interface Props {
  employees: Employee[];
}

const EmployeeLedgerFilter: React.FC<Props> = ({ employees }) => {
  const today = moment().format('YYYY-MM-DD');
  const startOfYear = moment().startOf('year').format('YYYY-MM-DD');

  const { data, setData, get, processing, errors } = useForm({
    employee_id: '',
    from_date: today,
    to_date: today,
    filter_type: 'daily', // "daily" or "yearly"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('employee.ledger')); // goes to controller
  };

  // If yearly filter selected → auto set full year
  useEffect(() => {
    if (data.filter_type === 'yearly') {
      setData('from_date', startOfYear);
      setData('to_date', today);
    }
  }, [data.filter_type]);

  return (
    <AppLayout>
      <Head title="Employee Ledger Filter" />
      <div className="p-4 md:p-12 h-full w-screen lg:w-full">
        <div className="bg-white h-full rounded-lg p-6">
          <PageHeader title="Employee Ledger Report" />
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee Dropdown */}
            <div>
              <label className="block font-medium mb-1">Employee</label>
              <select
                value={data.employee_id}
                onChange={(e) => setData('employee_id', e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              {errors.employee_id && <div className="text-red-600">{errors.employee_id}</div>}
            </div>

            {/* Filter Type */}
            <div>
              <label className="block font-medium mb-1">Filter Type</label>
              <select
                value={data.filter_type}
                onChange={(e) => setData('filter_type', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="daily">Daily (Custom Range)</option>
                <option value="yearly">Yearly (This Year)</option>
              </select>
            </div>

            {/* Date Inputs - only show if daily */}
            {data.filter_type === 'daily' && (
              <>
                <div>
                  <InputCalendar
                    value={data.from_date}
                    onChange={(val) => setData('from_date', val)}
                    label="From Date"
                    required
                  />
                  {errors.from_date && <div className="text-red-600">{errors.from_date}</div>}
                </div>

                <div>
                  <InputCalendar
                    value={data.to_date}
                    onChange={(val) => setData('to_date', val)}
                    label="To Date"
                    required
                  />
                  {errors.to_date && <div className="text-red-600">{errors.to_date}</div>}
                </div>
              </>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                disabled={processing}
              >
                Generate Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default EmployeeLedgerFilter;
