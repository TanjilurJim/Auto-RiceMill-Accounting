import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

interface Employee {
    id: number;
    name: string;
    salary: number;
    designation?: {
        name: string;
    };
}

export default function SalarySlipCreate({ employees }: { employees: Employee[] }) {
    const { data, setData, post, processing, errors } = useForm({
        voucher_number: '',
        date: '',
        month: null,
        year: null,
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
    const getMonthYearLabel = () => {
        if (!data.month || !data.year) return '';
        const date = new Date(data.year, data.month - 1); // months are 0-based
        const monthName = date.toLocaleString('default', { month: 'long' });
        return `Salary for: ${monthName} ${data.year}`;
    };

    const handleEmployeeChange = (index: number, field: string, value: any) => {
        const updatedEmployees = [...data.salary_slip_employees];

        if (field === 'employee_id') {
            updatedEmployees[index][field] = value;
            const selectedEmp = employees.find((emp) => emp.id === value);
            if (selectedEmp) {
                updatedEmployees[index].basic_salary = selectedEmp.salary.toString();
                const basic = parseFloat(selectedEmp.salary.toString()) || 0;
                const add = parseFloat(updatedEmployees[index].additional_amount || '0');
                updatedEmployees[index].total_amount = (basic + add).toFixed(2);
            }
        } else {
            updatedEmployees[index][field] = value;
            const basic = parseFloat(updatedEmployees[index].basic_salary || '0');
            const add = parseFloat(updatedEmployees[index].additional_amount || '0');
            updatedEmployees[index].total_amount = (basic + add).toFixed(2);
        }

        setData('salary_slip_employees', updatedEmployees);
    };

    const addEmployeeRow = () =>
        setData('salary_slip_employees', [
            ...data.salary_slip_employees,
            { employee_id: '', basic_salary: '', additional_amount: '', total_amount: '' },
        ]);

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

    // ✅  new version
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1️⃣  build a clean array
        const sanitizedRows = data.salary_slip_employees.map(r => ({
            ...r,
            employee_id: Number(r.employee_id || 0),
            basic_salary: Number(r.basic_salary || 0),
            additional_amount: Number(r.additional_amount || 0),
            total_amount: Number(r.total_amount || 0),
        }));

        // 2️⃣  POST – give inertia the payload explicitly
        post('/salary-slips', {
            data: {
                ...data,                       // voucher_number, date, month, year, …
                salary_slip_employees: sanitizedRows,
            },
            onSuccess: () =>
                Swal.fire('Saved!', 'Salary slip created successfully', 'success'),
        });
    };
    return (
        <AppLayout>
            <Head title="Create Salary Slip" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    <PageHeader title="Create New Salary Slip" addLinkHref='/salary-slips' addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 border">
                        {/* Salary Slip Info */}
                        {/* Salary Slip Info */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-1 text-lg font-semibold">Salary Slip Information</h2>

                            {/* Salary for: March 2025 */}
                            {data.month && data.year && (
                                <div className="text-sm font-medium text-gray-700 italic">
                                    Salary for:{' '}
                                    {new Date(data.year, data.month - 1).toLocaleString('default', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <input
                                    type="date"
                                    className="border p-2"
                                    placeholder="Date"
                                    value={data.date}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        setData('date', e.target.value);
                                        setData('month', selectedDate.getMonth() + 1); // JS months are 0-based
                                        setData('year', selectedDate.getFullYear());
                                    }}
                                    required
                                />

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

                                <select
                                    className="border p-2"
                                    value={data.year || ''}
                                    onChange={(e) => setData('year', parseInt(e.target.value))}
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const y = new Date().getFullYear() - 2 + i;
                                        return (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        );
                                    })}
                                </select>

                                <input type="text" className="w-full rounded border p-2" value={data.voucher_number} readOnly />
                            </div>
                        </div>

                        {/* Employee Table */}
                        <div>
                            <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Employees</h2>
                            <div className="overflow-x-auto rounded border">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-50">
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
                                                <td className="min-w-[250px] border px-2 py-1">
                                                    <Select
                                                        className="w-full"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                        options={employees.map((emp) => ({
                                                            value: emp.id,
                                                            label: `${emp.name} (${emp.designation?.name ?? 'N/A'})`,
                                                        }))}
                                                        value={
                                                            employee.employee_id
                                                                ? {
                                                                    value: employee.employee_id,
                                                                    label: `${employees.find((e) => e.id === employee.employee_id)?.name} (${employees.find((e) => e.id === employee.employee_id)?.designation?.name ?? 'N/A'
                                                                        })`,
                                                                }
                                                                : null
                                                        }
                                                        onChange={(option) => handleEmployeeChange(index, 'employee_id', option?.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        className="w-full rounded border px-2 py-1"
                                                        value={employee.basic_salary}
                                                        onChange={(e) => handleEmployeeChange(index, 'basic_salary', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        className="w-full rounded border px-2 py-1"
                                                        value={employee.additional_amount}
                                                        onChange={(e) => handleEmployeeChange(index, 'additional_amount', e.target.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">{employee.total_amount}</td>
                                                <td className="space-x-2 border px-2 py-1 text-center flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEmployeeRow(index)}
                                                        className="rounded bg-danger px-2 py-1 text-white hover:bg-danger-hover"
                                                    >
                                                        &minus;
                                                    </button>
                                                    {index === data.salary_slip_employees.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={addEmployeeRow}
                                                            className="rounded bg-primary px-2 py-1 text-white hover:bg-primary-hover"
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

                        {/* Buttons */}

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
