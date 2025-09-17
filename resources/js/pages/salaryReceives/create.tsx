import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Employee {
    id: number;
    name: string;
}

interface ReceivedMode {
    id: number;
    mode_name: string;
}

/** Expecting this shape from controller; falls back if older fields exist */
interface RawSlipLine {
    id: number;
    employee: { id: number; name: string };
    salary_slip: { voucher_number: string; month?: number; year?: number };
    status?: string;

    // new fields (preferred)
    total?: number;
    paid?: number;
    remaining?: number;

    // legacy fields (fallback)
    total_amount?: number;
    paid_amount?: number;
    advance_adjusted?: number;
}

interface NormalizedSlipLine {
    id: number;
    employee: { id: number; name: string };
    salary_slip: { voucher_number: string; month?: number; year?: number };
    status: string;
    total: number;
    paid: number;
    remaining: number;
}

interface Props {
    employees: Employee[];
    receivedModes: ReceivedMode[];
    salarySlipEmployees: RawSlipLine[];
}

export default function Create({ employees, receivedModes, salarySlipEmployees }: Props) {
    const todayIso = dayjs().format('YYYY-MM-DD');
    const vchNo = `SR-${dayjs().format('DDMMYYYY')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, setData, post, processing, errors } = useForm({
        date: todayIso,
        vch_no: vchNo,
        employee_id: '',
        received_by: '',
        salary_slip_employee_id: '',
        amount: '',
        description: '',
    });

    const [selectedDate, setSelectedDate] = useState<Date | null>(dayjs(data.date).toDate());

    /** Normalize slip lines so UI can rely on total/paid/remaining */
    const slips = useMemo<NormalizedSlipLine[]>(() => {
        return (salarySlipEmployees || []).map((s) => {
            const total = Number(s.total ?? s.total_amount ?? 0);
            const paid = Number(s.paid ?? s.paid_amount ?? 0);
            const advAdj = Number(s.advance_adjusted ?? 0);
            const remaining = Number.isFinite(s.remaining as number) ? Number(s.remaining) : Math.max(0, total - (paid + advAdj)); // legacy fallback

            return {
                id: s.id,
                employee: s.employee,
                salary_slip: s.salary_slip,
                status: s.status ?? 'Unpaid',
                total,
                paid: Number.isFinite(paid) ? paid : 0,
                remaining,
            };
        });
    }, [salarySlipEmployees]);

    /** Filter slips by chosen employee (if any) */
    const slipsForEmployee = useMemo(() => {
        if (!data.employee_id) return slips;
        return slips.filter((x) => String(x.employee.id) === String(data.employee_id));
    }, [slips, data.employee_id]);

    /** If employee changes and current slip does not belong to them, clear it */
    useEffect(() => {
        if (!data.salary_slip_employee_id) return;
        const stillValid = slipsForEmployee.some((x) => String(x.id) === String(data.salary_slip_employee_id));
        if (!stillValid) {
            setData('salary_slip_employee_id', '');
            setData('amount', '');
        }
    }, [data.employee_id]); // eslint-disable-line react-hooks/exhaustive-deps

    /** When a slip line is chosen, auto-set employee and default amount = remaining */
    useEffect(() => {
        const s = slips.find((x) => String(x.id) === String(data.salary_slip_employee_id));
        if (!s) return;
        setData('employee_id', String(s.employee.id)); // keep in sync even if user picked slip first
        setData('amount', s.remaining.toString());
    }, [data.salary_slip_employee_id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/salary-receives'); // resource route POST
    };

    const selectedSlip = slips.find((x) => String(x.id) === String(data.salary_slip_employee_id));

    return (
        <AppLayout>
            <Head title="Create Salary Receive" />

            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg ">
                    <PageHeader title="Create Salary Receive" addLinkHref="/salary-receives" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Voucher No */}
                            <div>
                                <label className="block font-medium mb-1">Voucher No</label>
                                <Input
                                    type="text"
                                    value={data.vch_no}
                                    onChange={(e) => setData('vch_no', e.target.value)}
                                    required
                                />
                                {errors.vch_no && <div className="text-red-600">{errors.vch_no}</div>}
                            </div>

                            {/* Date */}
                            <div>
                                <InputCalendar value={data.date} label="Date" onChange={(val) => setData('date', val)} />
                                {errors.date && <div className="text-red-600">{errors.date}</div>}
                            </div>

                            {/* Employee */}
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

                            {/* Received Mode */}
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

                            {/* Slip line (filtered by employee) */}
                            <div className="">
                                <label className="block font-medium">Salary Slip (required)</label>
                                <select
                                    value={data.salary_slip_employee_id}
                                    onChange={(e) => setData('salary_slip_employee_id', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                >
                                    <option value="">Select Salary Slip</option>
                                    {slipsForEmployee.map((s) => {
                                        const label = [
                                            s.salary_slip.voucher_number,
                                            s.salary_slip.month && s.salary_slip.year ? `— ${s.salary_slip.month}/${s.salary_slip.year}` : '',
                                            `— Total ৳${s.total.toLocaleString()}`,
                                            `Paid ৳${s.paid.toLocaleString()}`,
                                            `Remaining ৳${s.remaining.toLocaleString()}`,
                                        ]
                                            .filter(Boolean)
                                            .join(' ');
                                        return (
                                            <option key={s.id} value={s.id.toString()}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.salary_slip_employee_id && <div className="text-red-600">{errors.salary_slip_employee_id}</div>}

                                {/* Inline slip summary */}
                                {selectedSlip && (
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                                        <span className="rounded bg-gray-100 px-2 py-1">Slip: {selectedSlip.salary_slip.voucher_number}</span>
                                        {selectedSlip.salary_slip.month && selectedSlip.salary_slip.year && (
                                            <span className="rounded bg-gray-100 px-2 py-1">
                                                Period: {selectedSlip.salary_slip.month}/{selectedSlip.salary_slip.year}
                                            </span>
                                        )}
                                        <span className="rounded bg-gray-100 px-2 py-1">Status: {selectedSlip.status}</span>
                                        <span className="rounded bg-blue-50 px-2 py-1">Total: ৳{selectedSlip.total.toLocaleString()}</span>
                                        <span className="rounded bg-yellow-50 px-2 py-1">Paid: ৳{selectedSlip.paid.toLocaleString()}</span>
                                        <span className="rounded bg-green-50 px-2 py-1">Remaining: ৳{selectedSlip.remaining.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block font-medium">Amount</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                />
                                {errors.amount && <div className="text-red-600">{errors.amount}</div>}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
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
