import ActionButtons from '@/components/ActionButtons';
import ActionFooter from '@/components/ActionFooter';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';

export default function Edit({ salaryReceive, employees, receivedModes, salarySlipEmployees }: any) {
    console.log('SalaryReceive object from server:', salaryReceive);
    
    const { data, setData, put, processing, errors } = useForm({
        vch_no: salaryReceive.vch_no || '',
        date: salaryReceive.date || '',
        employee_id: salaryReceive.employee?.id || '',
        received_by: salaryReceive.received_mode?.id || '',
        amount: salaryReceive.amount || '',
        description: salaryReceive.description || '',
        salary_slip_employee_id: salaryReceive.salary_slip_employee?.id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('salary-receives.update', salaryReceive.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Salary Receive" />

            <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-6">Edit Salary Receive</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Voucher No (read-only) */}
                    <div>
                        <label className="block mb-1 font-medium">Voucher No</label>
                        <input
                            type="text"
                            value={data.vch_no}
                            readOnly
                            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        {errors.vch_no && <div className="text-red-500 text-sm">{errors.vch_no}</div>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block mb-1 font-medium">Date</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.date && <div className="text-red-500 text-sm">{errors.date}</div>}
                    </div>

                    {/* Employee */}
                    <div>
                        <label className="block mb-1 font-medium">Employee</label>
                        <select
                            value={data.employee_id}
                            onChange={(e) => setData('employee_id', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Select employee</option>
                            {employees.map((emp: any) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                        {errors.employee_id && <div className="text-red-500 text-sm">{errors.employee_id}</div>}
                    </div>

                    {/* Received Mode */}
                    <div>
                        <label className="block mb-1 font-medium">Received By</label>
                        <select
                            value={data.received_by}
                            onChange={(e) => setData('received_by', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Select mode</option>
                            {receivedModes.map((mode: any) => (
                                <option key={mode.id} value={mode.id}>
                                    {mode.mode_name}
                                </option>
                            ))}
                        </select>
                        {errors.received_by && <div className="text-red-500 text-sm">{errors.received_by}</div>}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block mb-1 font-medium">Amount</label>
                        <input
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.amount && <div className="text-red-500 text-sm">{errors.amount}</div>}
                    </div>

                    {/* Salary Slip Reference */}
                    <div>
                        <label className="block mb-1 font-medium">Salary Slip Reference (optional)</label>
                        <select
                            value={data.salary_slip_employee_id}
                            onChange={(e) => setData('salary_slip_employee_id', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">None</option>
                            {salarySlipEmployees.map((sse: any) => (
                                <option key={sse.id} value={sse.id}>
                                    {`${sse.salary_slip.voucher_no} - ${sse.employee.name} (${sse.status})`}
                                </option>
                            ))}
                        </select>
                        {errors.salary_slip_employee_id && (
                            <div className="text-red-500 text-sm">{errors.salary_slip_employee_id}</div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex justify-between items-center">
                        <Link href={route('salary-receives.index')} className="text-gray-600 underline">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </div> */}
                    <ActionFooter 
                        processing={processing}
                        cancelHref='/salary-receives'
                        submitText='Update'
                        onSubmit={handleSubmit}
                        className='justify-end'
                    />
                </form>
            </div>
        </AppLayout>
    );
}
