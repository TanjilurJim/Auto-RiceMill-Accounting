import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function SalarySlipInvoice({ salarySlip }: { salarySlip: any }) {
  // Ensure that salarySlipEmployees is never undefined or null
  const employees = salarySlip.salarySlipEmployees || [];  // Default to empty array if undefined

  return (
    <AppLayout>
      <Head title="Salary Slip Invoice" />
      <div className="bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold">Salary Slip - {salarySlip.voucher_number}</h1>

        {/* Salary Slip Employees */}
        <h2 className="mt-4 text-lg font-semibold">Employees</h2>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="border px-2 py-1">Employee Name</th>
                <th className="border px-2 py-1">Basic Salary</th> 
                <th className="border px-2 py-1">Additional Amount</th>
                <th className="border px-2 py-1">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.employee.name}</td> {/* employee.name এখানে আসবে */}
                  <td className="border px-2 py-1">{item.basic_salary}</td>
                  <td className="border px-2 py-1">{item.additional_amount}</td>
                  <td className="border px-2 py-1">{item.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
