import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Employee {
  id: number;
  name: string;
}

interface Props {
  employees: Employee[];
}

const EmployeeLedgerFilter: React.FC<Props> = ({ employees }) => {
  const { data, setData, get, processing, errors } = useForm({
    employee_id: '',
    from_date: '',
    to_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('employee.ledger')); // this will go to controller
  };

  return (
    <AppLayout>
      <Head title="Employee Ledger Filter" />
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Employee Ledger Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Employee</label>
            <select
              value={data.employee_id}
              onChange={e => setData('employee_id', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employee_id && <div className="text-red-600">{errors.employee_id}</div>}
          </div>

          <div>
            <label className="block font-medium mb-1">From Date</label>
            <input
              type="date"
              value={data.from_date}
              onChange={e => setData('from_date', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            {errors.from_date && <div className="text-red-600">{errors.from_date}</div>}
          </div>

          <div>
            <label className="block font-medium mb-1">To Date</label>
            <input
              type="date"
              value={data.to_date}
              onChange={e => setData('to_date', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            {errors.to_date && <div className="text-red-600">{errors.to_date}</div>}
          </div>

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
    </AppLayout>
  );
};

export default EmployeeLedgerFilter;
