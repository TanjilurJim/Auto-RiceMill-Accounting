import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Employee {
  id: number;
  name: string;
}

interface SalarySlipEmployee {
  employee: Employee;
  basic_salary: string;
  additional_amount: string;
  total_amount: string;
}

interface SalarySlip {
  id: number;
  voucher_number: string;
  date: string;
  creator: { name: string };
  salarySlipEmployees: SalarySlipEmployee[];
}

export default function SalarySlipEdit({
  salarySlip,
  employees,
}: {
  salarySlip: SalarySlip;
  employees: Employee[];
}) {
  const { data, setData, put, processing, errors } = useForm({
    voucher_number: salarySlip.voucher_number,
    date: salarySlip.date,
    salary_slip_employees: salarySlip.salarySlipEmployees?.map(employee => ({
      employee_id: employee.employee.id,
      basic_salary: employee.basic_salary,
      additional_amount: employee.additional_amount,
      total_amount: employee.total_amount,
    })) || [],  // Default to empty array if `salarySlipEmployees` is undefined
  });

  useEffect(() => {
    setData({
      ...data,
      salary_slip_employees: salarySlip.salarySlipEmployees?.map(employee => ({
        employee_id: employee.employee.id,
        basic_salary: employee.basic_salary,
        additional_amount: employee.additional_amount,
        total_amount: employee.total_amount,
      })) || [],  // Default to empty array if `salarySlipEmployees` is undefined
    });
  }, [salarySlip]);

  const handleEmployeeChange = (index: number, field: string, value: any) => {
    const updatedEmployees = [...data.salary_slip_employees];
    updatedEmployees[index][field] = value;
    const basicSalary = parseFloat(updatedEmployees[index].basic_salary) || 0;
    const additionalAmount = parseFloat(updatedEmployees[index].additional_amount) || 0;
    updatedEmployees[index].total_amount = (basicSalary + additionalAmount).toFixed(2);
    setData('salary_slip_employees', updatedEmployees);
  };

  const addEmployeeRow = () => {
    setData('salary_slip_employees', [
      ...data.salary_slip_employees,
      { employee_id: '', basic_salary: '', additional_amount: '', total_amount: '' },
    ]);
  };

  const removeEmployeeRow = (index: number) => {
    if (data.salary_slip_employees.length === 1) return;
    confirmDialog(
      {}, () => {
        const updated = [...data.salary_slip_employees];
        updated.splice(index, 1);
        setData('salary_slip_employees', updated);
      }
    )

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/salary-slips/${salarySlip.id}`);
  };

  return (
    <AppLayout>
      <Head title="Edit Salary Slip" />
      <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
        <div className="bg-white h-full rounded-lg p-6">
          {/* Header */}
          <PageHeader title='Edit Salary Slip' addLinkHref='/salary-slips' addLinkText='Back' />

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 border">
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
                            className="rounded bg-danger hover:bg-danger-hover px-2 py-1 text-white"
                          >
                            &minus;
                          </button>
                          {index === data.salary_slip_employees.length - 1 && (
                            <button
                              type="button"
                              onClick={addEmployeeRow}
                              className="rounded bg-primary hover:bg-primary-hover px-2 py-1 text-white"
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

            <ActionFooter
              processing={processing}
              submitText={processing ? 'Saving...' : 'Save'}
              onSubmit={handleSubmit}
              cancelHref='/salary-slips'
              cancelText='Cancel'
              className='justify-end'
            />

          </form>
        </div>
      </div>
    </AppLayout>
  );
}
