import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

interface Employee {
    id: number;
    name: string;
    salary: number;
    designation?: { name: string };
}

type Row = {
    employee_id: string | number;
    basic_salary: string | number;
    additional_amount: string | number;
    total_amount: string | number; // gross = basic + additional
};

export default function SalarySlipCreate({ employees }: { employees: Employee[] }) {
    const { data, setData, post, processing, errors } = useForm({
        voucher_number: '',
        date: '',
        month: null as number | null, // salary period (main)
        year: null as number | null,

        // advance slip flags (optional metadata for clarity)
        is_advance: false,
        advance_month: null as number | null,
        advance_year: null as number | null,

        salary_slip_employees: [{ employee_id: '', basic_salary: '', additional_amount: '', total_amount: '' } as Row],
    });

    const [formError, setFormError] = useState<string | null>(null);

    // voucher on mount
    useEffect(() => {
        if (!data.voucher_number) {
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const randomId = Math.floor(1000 + Math.random() * 9000);
            setData('voucher_number', `SAL-${dateStr}-${randomId}`);
        }
    }, []);

    // when toggling "advance", default the advance month/year to the
    // next month of the currently selected period (or next month from today)
    const ensureAdvanceMonth = () => {
        let base = new Date();
        if (data.year && data.month) base = new Date(data.year, data.month - 1, 1);
        const m = base.getMonth() + 1; // 1..12
        const y = base.getFullYear();
        const nextM = m === 12 ? 1 : m + 1;
        const nextY = m === 12 ? y + 1 : y;
        if (!data.advance_month || !data.advance_year) {
            setData('advance_month', nextM);
            setData('advance_year', nextY);
        }
    };

    const monthYearLabel = useMemo(() => {
        if (!data.month || !data.year) return '';
        const dt = new Date(data.year, data.month - 1);
        return `Salary for: ${dt.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
    }, [data.month, data.year]);

    const findEmp = (id: number | string | null | undefined) => employees.find((e) => e.id === Number(id || 0));

    const recomputeRow = (row: Row) => {
        const basic = Number(row.basic_salary || 0);
        const add = Number(row.additional_amount || 0);
        const gross = basic + add;
        return { ...row, total_amount: gross.toFixed(2) };
    };

    const handleRowChange = (index: number, field: keyof Row, value: any) => {
        const rows = [...data.salary_slip_employees];

        if (field === 'employee_id') {
            rows[index].employee_id = value;
            const emp = findEmp(value);
            // prefill but editable
            rows[index].basic_salary = emp ? String(emp.salary ?? 0) : '';
            rows[index] = recomputeRow(rows[index]);
        } else {
            (rows[index] as any)[field] = value;
            rows[index] = recomputeRow(rows[index]);
        }

        setData('salary_slip_employees', rows);
    };

    const addEmployeeRow = () =>
        setData('salary_slip_employees', [
            ...data.salary_slip_employees,
            { employee_id: '', basic_salary: '', additional_amount: '', total_amount: '' },
        ]);

    const removeEmployeeRow = (index: number) => {
        if (data.salary_slip_employees.length === 1) return;

        confirmDialog({}, () => {
            const updated = [...data.salary_slip_employees];
            updated.splice(index, 1);
            setData('salary_slip_employees', updated);
        });
    };

    const totals = useMemo(() => {
        const gross = data.salary_slip_employees.reduce((s, r) => s + Number(r.total_amount || 0), 0);
        return { gross: gross.toFixed(2) };
    }, [data.salary_slip_employees]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const effectiveMonth = data.is_advance ? data.advance_month : data.month;
        const effectiveYear = data.is_advance ? data.advance_year : data.year;

        // sanitize
        const sanitizedRows = data.salary_slip_employees.map((r) => ({
            employee_id: Number(r.employee_id || 0),
            basic_salary: Number(r.basic_salary || 0),
            additional_amount: Number(r.additional_amount || 0),
            total_amount: Number(r.total_amount || 0),
        }));

        post('/salary-slips', {
            data: {
                voucher_number: data.voucher_number,
                date: data.date,
                month: data.month,
                year: data.year,

                // sent for record; backend can store or ignore (safe)
                is_advance: !!data.is_advance,
                advance_month: data.advance_month,
                advance_year: data.advance_year,

                salary_slip_employees: sanitizedRows,
            },
            onError: (err) => {
                if (err?.salary_slip_employees) {
                    setFormError(Array.isArray(err.salary_slip_employees) ? err.salary_slip_employees.join(', ') : String(err.salary_slip_employees));
                }
            },
            onSuccess: () => Swal.fire('Saved!', 'Salary slip created successfully', 'success'),
        });
    };

    return (
        <AppLayout>
            <Head title="Create Salary Slip" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Create New Salary Slip" addLinkHref="/salary-slips" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
                        {/* Header */}
                        <div className="space-y-4">
                            <h2 className="pb-1 text-lg font-semibold">Salary Slip Information</h2>

                            {data.month && data.year && <div className="text-sm font-medium text-gray-700 italic">{monthYearLabel}</div>}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Date */}
                                <input
                                    type="date"
                                    className="border p-2 focus:*:outline-none"
                                    placeholder="Date"
                                    value={data.date}
                                    onChange={(e) => {
                                        const d = new Date(e.target.value);
                                        setData('date', e.target.value);
                                        // if user hasn't chosen month/year yet, infer them
                                        if (!data.month || !data.year) {
                                            setData('month', d.getMonth() + 1);
                                            setData('year', d.getFullYear());
                                        }
                                    }}
                                    required
                                />

                                {/* Period Month */}
                                <select
                                    className="border p-2"
                                    value={data.month || ''}
                                    onChange={(e) => setData('month', parseInt(e.target.value))}
                                    required
                                >
                                    <option value="">Select Month</option>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>

                                {/* Period Year */}
                                <select
                                    className="border p-2"
                                    value={data.year || ''}
                                    onChange={(e) => setData('year', parseInt(e.target.value))}
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const y = new Date().getFullYear() - 2 + i;
                                        return (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        );
                                    })}
                                </select>

                                {/* Voucher */}
                                <input type="text" className="w-full rounded border p-2" value={data.voucher_number} readOnly />
                            </div>

                            {/* Advance slip toggle */}
                            <div className="rounded-md border bg-gray-50 p-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={!!data.is_advance}
                                        onChange={(e) => {
                                            setData('is_advance', e.target.checked);
                                            if (e.target.checked) ensureAdvanceMonth();
                                        }}
                                    />
                                    <span className="font-medium">This is an advance slip (paying before the period)</span>
                                </label>

                                {data.is_advance && (
                                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <select
                                            className="border p-2"
                                            value={data.advance_month || ''}
                                            onChange={(e) => setData('advance_month', parseInt(e.target.value))}
                                        >
                                            <option value="">Advance for — Month</option>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            className="border p-2"
                                            value={data.advance_year || ''}
                                            onChange={(e) => setData('advance_year', parseInt(e.target.value))}
                                        >
                                            <option value="">Advance for — Year</option>
                                            {Array.from({ length: 6 }, (_, i) => {
                                                const y = new Date().getFullYear() - 1 + i;
                                                return (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Employees */}
                        <div>
                            <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Employees</h2>

                            {formError && <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}

                            <div className="overflow-x-auto rounded border">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border px-2 py-2">Employee</th>
                                            <th className="border px-2 py-2">Basic Salary (editable)</th>
                                            <th className="border px-2 py-2">Additional</th>
                                            <th className="border px-2 py-2">Total Amount</th>
                                            <th className="border px-2 py-2 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.salary_slip_employees.map((row, index) => {
                                            const emp = findEmp(row.employee_id);
                                            const gross = Number(row.total_amount || 0);

                                            const selectedOption = row.employee_id
                                                ? { value: Number(row.employee_id), label: `${emp?.name ?? ''} (${emp?.designation?.name ?? 'N/A'})` }
                                                : null;

                                            return (
                                                <tr key={index} className="align-top hover:bg-gray-50">
                                                    {/* Employee */}
                                                    <td className="min-w-[280px] border px-2 py-2">
                                                        <Select
                                                            className="w-full"
                                                            menuPortalTarget={document.body}
                                                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                            options={employees.map((e) => ({
                                                                value: e.id,
                                                                label: `${e.name} (${e.designation?.name ?? 'N/A'})`,
                                                            }))}
                                                            value={selectedOption}
                                                            onChange={(option) => handleRowChange(index, 'employee_id', option?.value)}
                                                        />
                                                    </td>

                                                    {/* Basic (editable) */}
                                                    <td className="border px-2 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className="w-full rounded border px-2 py-1"
                                                                value={row.basic_salary}
                                                                onChange={(e) => handleRowChange(index, 'basic_salary', e.target.value)}
                                                                placeholder={emp ? String(emp.salary ?? 0) : '0.00'}
                                                            />
                                                            {emp && (
                                                                <button
                                                                    type="button"
                                                                    className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                                                                    onClick={() => handleRowChange(index, 'basic_salary', String(emp.salary ?? 0))}
                                                                    title="Fill full salary"
                                                                >
                                                                    Fill full
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Additional */}
                                                    <td className="border px-2 py-2">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="w-full rounded border px-2 py-1"
                                                            value={row.additional_amount}
                                                            onChange={(e) => handleRowChange(index, 'additional_amount', e.target.value)}
                                                            placeholder="0.00"
                                                        />
                                                    </td>

                                                    {/* Total (gross) */}
                                                    <td className="border px-2 py-2 tabular-nums">{gross.toFixed(2)}</td>

                                                    {/* Row actions */}
                                                    <td className="border px-2 py-2 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeEmployeeRow(index)}
                                                                className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                                                                title="Remove"
                                                            >
                                                                &minus;
                                                            </button>
                                                            {index === data.salary_slip_employees.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={addEmployeeRow}
                                                                    className="rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                                                                    title="Add Row"
                                                                >
                                                                    +
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                    {/* Totals */}
                                    <tfoot>
                                        <tr className="bg-gray-50 font-medium">
                                            <td className="border px-2 py-2 text-right">Totals</td>
                                            <td className="border px-2 py-2"></td>
                                            <td className="border px-2 py-2"></td>
                                            <td className="border px-2 py-2 tabular-nums">৳{totals.gross}</td>
                                            <td className="border px-2 py-2"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/salary-slips"
                            processing={processing}
                            submitText={processing ? 'Saving...' : 'Save'}
                            cancelText="Cancel"
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
