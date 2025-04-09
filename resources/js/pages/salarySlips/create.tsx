import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

interface Employee {
  id: number;
  name: string;
}

export default function SalarySlipCreate({
  employees,
}: {
  employees: Employee[];
}) {
  const { data, setData, post, processing, errors } = useForm({
    voucher_number: '',
    date: '',
    salary_slip_employees: [{ employee_id: '', basic_salary: '', additional_amount: '', total_amount: '' }],
  });

  useEffect(() => {
    if (!data.voucher_number) {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const voucher = `SAL-${dateStr}-${randomId}`;
      setData('voucher_number', voucher);
    }
  }, []);

  const handleEmployeeChange = (index: number, field: string, value: any) => {
    const updatedEmployees = [...data.salary_slip_employees];
    updatedEmployees[index][field] = value;
    const basicSalary = parseFloat(updatedEmployees[index].basic_salary) || 0;
    const additionalAmount = parseFloat(updatedEmployees[index].additional_amount) || 0;
    updatedEmployees[index].total_amount = (basicSalary + additionalAmount).toFixed(2);
    setData('salary_slip_employees', updatedEmployees);
  };

  const addEmployeeRow = () =>
    setData('salary_slip_employees', [
      ...data.salary_slip_employees,
      { employee_id: '', basic_salary: '', additional_amount: '', total_amount: '' },
    ]);

  const removeEmployeeRow = (index: number) => {
    if (data.salary_slip_employees.length === 1) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this employee row?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = [...data.salary_slip_employees];
        updated.splice(index, 1);
        setData('salary_slip_employees', updated);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/salary-slips', { data });
  };

  return (
    <AppLayout>
      <Head title="Create Salary Slip" />
      <div className="bg-gray-100 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Create New Salary Slip</h1>
          <Link href="/salary-slips" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
            Back
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow-md">
          {/* Section 1 - Salary Slip Info */}
          <div className="space-y-4">
            <h2 className="border-b pb-1 text-lg font-semibold">Salary Slip Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="date"
                className="border p-2"
                placeholder="Date"
                value={data.date}
                onChange={(e) => setData('date', e.target.value)}
                required
              />
              <input
                type="text"
                className="border p-2"
                placeholder="Voucher No"
                value={data.voucher_number}
                readOnly
              />
            </div>
          </div>

          {/* Section 2 - Employee Table */}
          <div>
            <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Employees</h2>
            <div className="overflow-x-auto rounded border">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-sm">
                  <tr>
                    <th className="border px-2 py-1">Employee</th>
                    <th className="border px-2 py-1">Basic Salary</th>
                    <th className="border px-2 py-1">Additional Amount</th>
                    <th className="border px-2 py-1">Total Amount</th>
                    <th className="border px-2 py-1 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salary_slip_employees.map((employee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">
                        <select
                          className="w-full"
                          value={employee.employee_id}
                          onChange={(e) => handleEmployeeChange(index, 'employee_id', e.target.value)}
                          required
                        >
                          <option value="">Select Employee</option>
                          {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="w-full"
                          value={employee.basic_salary}
                          onChange={(e) => handleEmployeeChange(index, 'basic_salary', e.target.value)}
                          required
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="w-full"
                          value={employee.additional_amount}
                          onChange={(e) => handleEmployeeChange(index, 'additional_amount', e.target.value)}
                        />
                      </td>
                      <td className="border px-2 py-1">{employee.total_amount}</td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeEmployeeRow(index)}
                          className="rounded bg-red-500 px-2 py-1 text-white"
                        >
                          &minus;
                        </button>
                        {index === data.salary_slip_employees.length - 1 && (
                          <button
                            type="button"
                            onClick={addEmployeeRow}
                            className="rounded bg-blue-500 px-2 py-1 text-white"
                          >
                            +
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="submit"
              disabled={processing}
              className="rounded bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
            >
              {processing ? 'Saving...' : 'Save'}
            </button>
            <Link
              href="/salary-slips"
              className="rounded border border-gray-400 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
