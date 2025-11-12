import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
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

type FY = { id: number; start_date: string; end_date: string } | null;

export default function SalarySlipCreate({ employees, current_financial_year }: { employees: Employee[]; current_financial_year: FY }) {
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
    const [periodError, setPeriodError] = useState<string | null>(null);

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
        // If user already chose a base period, use that as the advance target.
        if (data.month && data.year) {
            setData('advance_month', data.month);
            setData('advance_year', data.year);
            return;
        }

        // Otherwise default to NEXT month from today.
        const today = new Date();
        const m = today.getMonth() + 1; // 1..12
        const y = today.getFullYear();
        const nextM = m === 12 ? 1 : m + 1;
        const nextY = m === 12 ? y + 1 : y;

        setData('advance_month', nextM);
        setData('advance_year', nextY);
    };

    const effective = useMemo(() => {
        const month = data.is_advance ? data.advance_month : data.month;
        const year = data.is_advance ? data.advance_year : data.year;

        const text = month && year ? new Date(year, (month as number) - 1).toLocaleString('default', { month: 'long', year: 'numeric' }) : '';

        return { month, year, text };
    }, [data.is_advance, data.month, data.year, data.advance_month, data.advance_year]);

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
            const chosenId = Number(value || 0);
            const exists = rows.some((r, i) => i !== index && Number(r.employee_id || 0) === chosenId);
            if (exists) {
                Swal.fire('Duplicate employee', 'This employee is already added to this slip.', 'warning');
                return;
            }

            rows[index].employee_id = chosenId;
            const emp = findEmp(chosenId);
            rows[index].basic_salary = emp ? String(emp.salary ?? 0) : '';
            rows[index] = recomputeRow(rows[index]);
        } else {
            (rows[index] as any)[field] = value; // 👈 you were missing this branch
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

    const parseDate = (iso: string) => {
        const d = new Date(iso);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const periodDate = (month?: number | null, year?: number | null) => {
        if (!month || !year) return null;
        return new Date(year, (month as number) - 1, 1);
    };

    const isPeriodInsideFY = (month?: number | null, year?: number | null) => {
        if (!current_financial_year) return false;
        const p = periodDate(month, year);
        if (!p) return false;
        const s = new Date(current_financial_year.start_date);
        s.setHours(0, 0, 0, 0);
        const e = new Date(current_financial_year.end_date);
        e.setHours(23, 59, 59, 999);
        return p >= s && p <= e;
    };

    const isDateInsideFY = (dateStr?: string) => {
        if (!current_financial_year || !dateStr) return false;
        const d = parseDate(dateStr);
        const s = new Date(current_financial_year.start_date);
        s.setHours(0, 0, 0, 0);
        const e = new Date(current_financial_year.end_date);
        e.setHours(23, 59, 59, 999);
        return d >= s && d <= e;
    };

    const validate = () => {
        const ids = data.salary_slip_employees.map((r) => Number(r.employee_id || 0)).filter(Boolean);
        const dup = ids.find((id, i) => ids.indexOf(id) !== i);
        if (!ids.length) return 'Please add at least one employee.';
        if (dup) return 'The same employee is selected more than once.';
        if (!data.date) return 'Please choose a date.';

        if (!current_financial_year) return 'No open financial year. Contact admin.';

        // FY checks:
        if (!current_financial_year) return 'No open financial year. Contact admin.';

        // If using advance -> check advance period; otherwise check base period
        const checkMonth = data.is_advance ? data.advance_month : data.month;
        const checkYear = data.is_advance ? data.advance_year : data.year;

        if (!checkMonth || !checkYear) return data.is_advance ? 'Select the advance period.' : 'Please choose the salary period.';

        // check the period is inside current FY
        if (!isPeriodInsideFY(checkMonth, checkYear)) {
            return `Selected period (${checkYear}-${String(checkMonth).padStart(2, '0')}) is outside the open financial year (${current_financial_year.start_date} — ${current_financial_year.end_date}).`;
        }

        // also check payment date is inside FY (optional but recommended)
        if (!isDateInsideFY(data.date)) {
            return `Payment date (${data.date}) is outside the open financial year (${current_financial_year.start_date} — ${current_financial_year.end_date}).`;
        }

        if (data.is_advance) {
            if (!data.advance_month || !data.advance_year) return 'Select the advance period.';
        } else {
            if (!data.month || !data.year) return 'Please choose the salary period.';
        }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // ✅ Step 1: run validation before proceeding
        const v = validate();
        if (v) {
            setFormError(v);
            return; // stop submission if invalid
        }

        // ✅ Step 2: compute effective month/year
        const effectiveMonth = data.is_advance ? data.advance_month : data.month;
        const effectiveYear = data.is_advance ? data.advance_year : data.year;

        // ✅ Step 3: sanitize rows
        const sanitizedRows = data.salary_slip_employees
            .filter((r) => r.employee_id) // drop blank rows
            .map((r) => ({
                employee_id: Number(r.employee_id),
                basic_salary: Number(r.basic_salary || 0),
                additional_amount: Number(r.additional_amount || 0),
                total_amount: Number(r.total_amount || 0),
            }));

        // ✅ Step 4: post the data
        post('/salary-slips', {
            data: {
                voucher_number: data.voucher_number,
                date: data.date,
                month: effective.month, // <- will be November once advance is checked
                year: effective.year,
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
    const t = useTranslation();

    return (
        <AppLayout>
            <Head title="Create Salary Slip" />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title="Create New Salary Slip" addLinkHref="/salary-slips" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="bg-background space-y-6 rounded-lg border p-6">
                        {/* Header */}
                        <div className="space-y-4">
                            <h2 className="pb-1 text-lg font-semibold">Salary Slip Information</h2>

                            {effective.text && (
                                <div className="text-sm font-medium text-gray-700 italic">
                                    {data.is_advance ? 'Advance for: ' : 'Salary for: '}
                                    {effective.text}
                                    {data.date && <span className="ml-2 text-gray-500">(Payment date: {data.date})</span>}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Date */}
                                <input
                                    type="date"
                                    className="border p-2 focus:*:outline-none"
                                    placeholder="Date"
                                    value={data.date}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const d = new Date(val);
                                        setData('date', val);

                                        // infer base period only when NOT in advance mode
                                        if (!data.is_advance && (!data.month || !data.year)) {
                                            setData('month', d.getMonth() + 1);
                                            setData('year', d.getFullYear());

                                            // validate period immediately after inferring
                                            if (!isPeriodInsideFY(d.getMonth() + 1, d.getFullYear())) {
                                                setPeriodError(
                                                    `Selected period (${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}) is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                                );
                                            } else {
                                                setPeriodError(null);
                                            }
                                        }

                                        // always validate payment date against FY
                                        if (!isDateInsideFY(val)) {
                                            setPeriodError(
                                                `Payment date (${val}) is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                            );
                                        } else {
                                            // if period was okay keep it, otherwise clear
                                            if (data.is_advance) {
                                                if (isPeriodInsideFY(data.advance_month, data.advance_year)) setPeriodError(null);
                                            } else {
                                                if (isPeriodInsideFY(data.month, data.year)) setPeriodError(null);
                                            }
                                        }
                                    }}
                                    required
                                    disabled={data.is_advance}
                                />

                                {/* Period Month */}
                                <select
                                    className="border p-2"
                                    value={data.month || ''}
                                    onChange={(e) => {
                                        const m = parseInt(e.target.value) || null;
                                        setData('month', m);
                                        const y = data.year;
                                        if (!isPeriodInsideFY(m, y)) {
                                            setPeriodError(
                                                `Selected period (${y || '—'}-${String(m || 0).padStart(2, '0')}) is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                            );
                                        } else {
                                            setPeriodError(null);
                                        }
                                    }}
                                    required
                                    disabled={data.is_advance}
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
                                    onChange={(e) => {
                                        const y = parseInt(e.target.value) || null;
                                        setData('year', y);
                                        const m = data.month;
                                        if (!isPeriodInsideFY(m, y)) {
                                            setPeriodError(
                                                `Selected period (${y || '—'}-${String(m || 0).padStart(2, '0')}) is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                            );
                                        } else {
                                            setPeriodError(null);
                                        }
                                    }}
                                    required
                                    disabled={data.is_advance}
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

                                {/* Inline period error (spans full width) */}
                                {periodError && <div className="col-span-1 mt-2 text-sm text-red-600 md:col-span-2">{periodError}</div>}

                                {/* Advance slip toggle */}
                                <div className="bg-background col-span-1 rounded-md border p-3 md:col-span-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={!!data.is_advance}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setData('is_advance', checked);
                                                if (checked) {
                                                    ensureAdvanceMonth();
                                                    // validate the advance period after setting defaults
                                                    const am = data.advance_month || data.month;
                                                    const ay = data.advance_year || data.year;
                                                    if (!isPeriodInsideFY(am, ay)) {
                                                        setPeriodError(
                                                            `Selected advance period (${ay || '—'}-${String(am || 0).padStart(2, '0')}) is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                                        );
                                                    } else {
                                                        setPeriodError(null);
                                                    }
                                                } else {
                                                    // switching off advance — revalidate base period/date
                                                    if (!isPeriodInsideFY(data.month, data.year) || !isDateInsideFY(data.date)) {
                                                        setPeriodError(
                                                            `Selected period/date is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                                        );
                                                    } else {
                                                        setPeriodError(null);
                                                    }
                                                }
                                            }}
                                        />
                                        <span className="font-medium">This is an advance slip (paying before the period)</span>
                                    </label>

                                    {data.is_advance && (
                                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <select
                                                className="border p-2"
                                                value={data.advance_month || ''}
                                                onChange={(e) => {
                                                    const m = parseInt(e.target.value) || null;
                                                    setData('advance_month', m);
                                                    const y = data.advance_year;
                                                    if (!isPeriodInsideFY(m, y)) {
                                                        setPeriodError(
                                                            `Selected advance period (${y || '—'}-${String(m || 0).padStart(2, '0')}) is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                                        );
                                                    } else {
                                                        setPeriodError(null);
                                                    }
                                                }}
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
                                                onChange={(e) => {
                                                    const y = parseInt(e.target.value) || null;
                                                    setData('advance_year', y);
                                                    const m = data.advance_month;
                                                    if (!isPeriodInsideFY(m, y)) {
                                                        setPeriodError(
                                                            `Selected advance period (${y || '—'}-${String(m || 0).padStart(2, '0')}) is outside the open financial year (${current_financial_year?.start_date} — ${current_financial_year?.end_date}).`,
                                                        );
                                                    } else {
                                                        setPeriodError(null);
                                                    }
                                                }}
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
                        </div>

                        {/* Employees */}
                        <div>
                            <h2 className="bg-background mb-3 border-b pb-1 text-lg font-semibold">Employees</h2>

                            {formError && <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}

                            <div className="overflow-x-auto rounded border">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-background">
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
                                                <tr key={index} className="hover:bg-background align-top">
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
                                        <tr className="bg-background font-medium">
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
