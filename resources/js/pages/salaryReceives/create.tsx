import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import moment from 'moment';
import React, { useEffect } from 'react';

interface Employee {
    id: number;
    name: string;
}

interface ReceivedMode {
    id: number;
    mode_name: string;
}

interface SalarySlipEmployee {
    id: number;
    employee: { name: string };
    salary_slip: { voucher_number: string };
    status: string;
    total_amount: number;
}

interface Props {
    employees: Employee[];
    receivedModes: ReceivedMode[];
    salarySlipEmployees: SalarySlipEmployee[];
}

export default function Create({ employees, receivedModes, salarySlipEmployees }: Props) {
    const today = moment().format('YYYY-MM-DD');
    const datePart = moment().format('YYYYMMDD');
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digit number
    const defaultVchNo = `SR-${datePart}-${randomDigits}`;

    const { data, setData, post, processing, errors } = useForm({
        vch_no: defaultVchNo,
        date: today,
        employee_id: '',
        received_by: '',
        amount: '',
        description: '',
        salary_slip_employee_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('salary-receives.store'));
    };

    // Auto-fill amount when selecting a salary slip employee
    useEffect(() => {
        const selected = salarySlipEmployees.find((sse) => sse.id === parseInt(data.salary_slip_employee_id));
        if (selected) {
            setData('amount', selected.total_amount.toString());
            setData('employee_id', selected.employee.id.toString()); // auto-select employee too
        }
    }, [data.salary_slip_employee_id]);

    return (
        <AppLayout>
            <Head title="Create Salary Receive" />

            <div className="mx-auto max-w-4xl rounded bg-white p-6 shadow">
                <h1 className="mb-6 text-2xl font-bold">Create Salary Receive</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Voucher No */}
                    <div>
                        <label className="block font-medium">Voucher No</label>
                        <input
                            type="text"
                            value={data.vch_no}
                            onChange={(e) => setData('vch_no', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                        {errors.vch_no && <div className="text-red-600">{errors.vch_no}</div>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block font-medium">Date</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                        {errors.date && <div className="text-red-600">{errors.date}</div>}
                    </div>

                    {/* Employee Dropdown */}
                    <div>
                        <label className="block font-medium">Employee</label>
                        <select
                            value={data.employee_id}
                            onChange={(e) => setData('employee_id', e.target.value)}
                            className="w-full rounded border px-3 py-2"
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

                    {/* Received Mode Dropdown */}
                    <div>
                        <label className="block font-medium">Received By</label>
                        <select
                            value={data.received_by}
                            onChange={(e) => setData('received_by', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            required
                        >
                            <option value="">Select Mode</option>
                            {receivedModes.map((mode) => (
                                <option key={mode.id} value={mode.id}>
                                    {mode.mode_name}
                                </option>
                            ))}
                        </select>
                        {errors.received_by && <div className="text-red-600">{errors.received_by}</div>}
                    </div>
                    {/* Salary Slip Employee Dropdown */}
                    <div>
                        <label className="block font-medium">Link to Salary Slip (optional)</label>
                        <select
                            value={data.salary_slip_employee_id}
                            onChange={(e) => setData('salary_slip_employee_id', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="">Select Salary Slip</option>
                            {salarySlipEmployees.map((sse) => (
                                <option key={sse.id} value={sse.id.toString()}>
                                    {`${sse.employee.name} - ${sse.salary_slip.voucher_number} [${sse.status}] - ৳${sse.total_amount}`}
                                </option>
                            ))}
                        </select>
                        {errors.salary_slip_employee_id && <div className="text-red-600">{errors.salary_slip_employee_id}</div>}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block font-medium">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            required
                        />
                        {errors.amount && <div className="text-red-600">{errors.amount}</div>}
                    </div>

                    

                    {/* Description */}
                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            rows={3}
                        />
                        {errors.description && <div className="text-red-600">{errors.description}</div>}
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                        <button type="submit" className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700" disabled={processing}>
                            Save Salary Receive
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
