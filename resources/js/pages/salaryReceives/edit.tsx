import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react'; // <-- Import Link here
import { useEffect } from 'react';

export default function SalaryReceiveEdit({ salaryReceive, employees, receivedModes }) {
  // Use useForm hook to initialize form data with existing salaryReceive data
  const { data, setData, put, processing, errors } = useForm({
    vch_no: salaryReceive.vch_no || '',
    date: salaryReceive.date || '',
    employee_id: salaryReceive.employee_id|| '',
    received_by: salaryReceive.receivedMode || '',
    amount: salaryReceive.amount || '',
    description: salaryReceive.description || '',
  });

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/salary-receives/${salaryReceive.id}`, { data });
  };

  return (
    <AppLayout>
      <Head title="Edit Salary Receive" />
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-700">Edit Salary Receive</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Voucher Number */}
            <div className="flex flex-col">
              <label htmlFor="vch_no" className="text-sm font-medium text-gray-700">Voucher Number</label>
              <input
                type="text"
                id="vch_no"
                name="vch_no"
                value={data.vch_no}
                readOnly
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.vch_no && <p className="text-sm text-red-500">{errors.vch_no}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={data.date}
                onChange={(e) => setData('date', e.target.value)}
                required
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            {/* Employee Selection */}
            <div className="flex flex-col">
              <label htmlFor="employee_id" className="text-sm font-medium text-gray-700">Employee</label>
              <select
                id="employee_id"
                name="employee_id"
                value={data.employee_id}
                onChange={(e) => setData('employee_id', e.target.value)}
                required
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              {errors.employee_id && <p className="text-sm text-red-500">{errors.employee_id}</p>}
            </div>

            {/* Received Mode Selection */}
            <div className="flex flex-col">
              <label htmlFor="received_by" className="text-sm font-medium text-gray-700">Received Mode</label>
              <select
                id="received_by"
                name="received_by"
                value={data.received_by}
                onChange={(e) => setData('received_by', e.target.value)}
                required
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {receivedModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>{mode.mode_name}</option>
                ))}
              </select>
              {errors.received_by && <p className="text-sm text-red-500">{errors.received_by}</p>}
            </div>

            {/* Amount */}
            <div className="flex flex-col">
              <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
                required
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Enter description"
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={processing}
                className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {processing ? 'Saving...' : 'Save'}
              </button>
            </div>

            {/* Back Link */}
            <div className="flex justify-center mt-4">
              <Link
                href="/salary-receives"
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Back to Salary Receives
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
