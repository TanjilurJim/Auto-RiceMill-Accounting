import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';  
import "react-datepicker/dist/react-datepicker.css";
interface Employee {
    id: number;
    name: string;
}
// const [selectedDate, setSelectedDate] = useState(new Date());
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
    paid_amount: number;
}

interface Props {
    employees: Employee[];
    receivedModes: ReceivedMode[];
    salarySlipEmployees: SalarySlipEmployee[];
}

export default function Create({ employees, receivedModes, salarySlipEmployees }: Props) {
    const todayIso = dayjs().format('YYYY-MM-DD'); // ISO for backend
    const datePart = dayjs().format('DDMMYYYY');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const defaultVchNo = `SR-${datePart}-${randomDigits}`;

    const { data, setData, post, processing, errors } = useForm({
        date: todayIso, // store ISO
        vch_no: defaultVchNo,
        employee_id: '',
        received_by: '',
        amount: '',
        description: '',
        salary_slip_employee_id: '',
    });

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        dayjs(data.date).toDate(), // initialise from form state
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('salary-receives.store'));
    };

    // Auto-fill amount when selecting a salary slip employee
    useEffect(() => {
        const selected = salarySlipEmployees.find((sse) => sse.id === parseInt(data.salary_slip_employee_id));
        if (selected) {
            const owed = selected.total_amount - (selected.paid_amount ?? 0);
            setData('amount', owed.toString());
            setData('employee_id', selected.employee.id.toString());
        }
    }, [data.salary_slip_employee_id]);

    return (
        <AppLayout>
            <Head title="Create Salary Receive" />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    
                    <PageHeader title="Create Salary Receive" addLinkHref="/salary-receives" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
                        <div className="grid gap-4 md:grid-cols-2">
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

                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => {
                                        setSelectedDate(date);
                                        setData('date', date ? dayjs(date).format('YYYY-MM-DD') : '');
                                    }}
                                    dateFormat="dd/MM/yyyy" // <── shows 20/07/2025
                                    placeholderText="dd/mm/yyyy"
                                    className="w-full rounded border px-3 py-2"
                                    showPopperArrow={false}
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
                                    {salarySlipEmployees.map((sse) => {
                                        const owed = sse.total_amount - (sse.paid_amount ?? 0);
                                        return (
                                            <option key={sse.id} value={sse.id.toString()}>
                                                {`${sse.employee.name} - ${sse.salary_slip.voucher_number} [${sse.status}] - ৳${owed.toLocaleString()}`}
                                            </option>
                                        );
                                    })}
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
                                    className="w-full rounded border-2 px-3 py-2"
                                    rows={3}
                                />
                                {errors.description && <div className="text-red-600">{errors.description}</div>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/salary-receives"
                            processing={processing}
                            submitText="Save Salary Receive"
                            cancelText="Cancel"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
