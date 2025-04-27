import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, } from '@inertiajs/react';

export default function Show({ salarySlip }: any) {
    return (
        <AppLayout>
            <Head title={`Salary Slip #${salarySlip.voucher_number}`} />

            <div className="mx-auto max-w-4xl rounded bg-white p-6 shadow">
                {/* <h1 className="mb-4 text-2xl font-bold">Salary Slip Details</h1> */}

                <PageHeader
                    title={`Salary Slip #${salarySlip.voucher_number}`}
                    addLinkHref={route('salary-slips.index')}
                    addLinkText="Back"
                />

                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Voucher Number:</strong> {salarySlip.voucher_number}
                    </div>
                    <div>
                        <strong>Date:</strong> {salarySlip.date}
                    </div>
                    <div>
                        <strong>Month:</strong> {salarySlip.month}
                    </div>
                    <div>
                        <strong>Year:</strong> {salarySlip.year}
                    </div>
                    <div>
                        <strong>Created At:</strong> {salarySlip.created_at}
                    </div>
                </div>

                <h2 className="mt-6 mb-2 text-lg font-semibold">Employees</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2">#</th>
                                <th className="border px-3 py-2">Employee</th>
                                <th className="border px-3 py-2">Designation</th>
                                <th className="border px-3 py-2 text-right">Basic Salary</th>
                                <th className="border px-3 py-2 text-right">Additional</th>
                                <th className="border px-3 py-2 text-right">Total</th>
                                <th className="border px-3 py-2 text-right">Paid Amount</th>
                                <th className="border px-3 py-2 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salarySlip.employees.map((emp: any, index: number) => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">{index + 1}</td>
                                    <td className="border px-3 py-2">{emp.employee_name}</td>
                                    <td className="border px-3 py-2">{emp.designation}</td>
                                    <td className="border px-3 py-2 text-right">৳ {Number(emp.basic_salary).toFixed(2)}</td>
                                    <td className="border px-3 py-2 text-right">৳ {Number(emp.additional_amount).toFixed(2)}</td>
                                    <td className="border px-3 py-2 text-right font-semibold">৳ {Number(emp.total_amount).toFixed(2)}</td>
                                    <td className="border px-3 py-2 text-right font-semibold">৳ {Number(emp.paid_amount || 0).toFixed(2)} </td>
                                    
                                    <td className="border px-3 py-2 text-center">
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-semibold ${
                                                emp.status === 'Paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : emp.status === 'Partially Paid'
                                                      ? 'bg-yellow-100 text-yellow-800'
                                                      : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {emp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* <div className="mt-6">
                    <Link href={route('salary-slips.index')} className="text-sm text-gray-700 underline">
                        ← Back to Salary Slips
                    </Link>
                </div> */}
                <ActionFooter 
                    className='justify-end'
                    cancelHref={route('salary-slips.index')}
                    cancelText="Back to Salary Slips"
                />
            </div>
        </AppLayout>
    );
}
