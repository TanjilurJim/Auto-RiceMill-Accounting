import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Swal from 'sweetalert2';

interface Employee {
    id: number;
    name: string;
    designation?: { name: string };
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
    month?: number;
    year?: number;
    is_posted_to_accounts?: boolean;
    creator: { name: string };
    salarySlipEmployees: SalarySlipEmployee[];
}

interface PaginatedSalarySlips {
    data: SalarySlip[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    salarySlips: PaginatedSalarySlips;
    employees: Employee[];
}

export default function SalarySlipIndex({ salarySlips, employees }: Props) {
    const [filters, setFilters] = useState({
        month: '',
        year: '',
        employee_id: '',
    });

    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This salary slip will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/salary-slips/${id}`);
                Swal.fire('Deleted!', 'The salary slip has been deleted.', 'success');
            }
        });
    };

    const totalSlips = salarySlips.data.length;
    const totalAmount = salarySlips.data.reduce((acc, slip) => {
        return acc + (slip.salarySlipEmployees?.reduce((sum, emp) => sum + parseFloat(emp.total_amount), 0) || 0);
    }, 0);

    const employeeOptions = employees.map((emp) => ({
        value: emp.id,
        label: `${emp.name} (${emp.designation?.name || 'N/A'})`,
    }));

    // Year options for CreatableSelect
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const y = currentYear - 2 + i;
        return { value: y.toString(), label: y.toString() };
    });

    return (
        <AppLayout>
            <Head title="Salary Slips" />
            <div className="bg-gray-100 p-4">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">All Salary Slips</h1>
                    <Link href="/salary-slips/create" className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div>

                {/* Summary */}
                <div className="mb-4 flex flex-wrap gap-4 rounded bg-white p-4 shadow">
                    <div className="text-sm">
                        💰 <strong>Total Slips:</strong> {totalSlips}
                    </div>
                    <div className="text-sm">
                        🧾 <strong>Total Amount:</strong> ৳ {totalAmount.toFixed(2)}
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-4 flex flex-wrap items-center gap-3 rounded bg-white p-4 shadow">
                    <select
                        className="rounded border p-2 text-sm"
                        value={filters.month}
                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    {/* Year as Creatable Select */}
                    <div className="min-w-[150px]">
                        <CreatableSelect
                            placeholder="Year"
                            options={yearOptions}
                            isClearable
                            isSearchable
                            value={filters.year ? { value: filters.year, label: filters.year } : null}
                            onChange={(option) => setFilters({ ...filters, year: option?.value || '' })}
                            onCreateOption={(inputValue) => setFilters({ ...filters, year: inputValue })}
                        />
                    </div>

                    <div className="min-w-[250px]">
                        <Select
                            placeholder="Employee"
                            options={employeeOptions}
                            isClearable
                            onChange={(option) => setFilters({ ...filters, employee_id: option?.value || '' })}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="border px-3 py-2">SL</th>
                                <th className="border px-3 py-2">Voucher</th>
                                <th className="border px-3 py-2">Date</th>
                                <th className="border px-3 py-2">Salary For</th>
                                <th className="border px-3 py-2">Total</th>
                                <th className="border px-3 py-2">Status</th>
                                <th className="border px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salarySlips.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-sm text-gray-500">
                                        No salary slips found.
                                    </td>
                                </tr>
                            ) : (
                                salarySlips.data.map((salarySlip, index) => {
                                    const total = (salarySlip.salary_slip_employees ?? []).reduce(
                                        (sum, item) => sum + parseFloat(item.total_amount),
                                        0,
                                    );
                                    const salaryFor =
                                        salarySlip.month && salarySlip.year
                                            ? `${new Date(salarySlip.year, salarySlip.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`
                                            : 'N/A';
                                    const status = salarySlip.is_posted_to_accounts ? 'Posted' : 'Draft';

                                    return (
                                        <>
                                            <tr
                                                key={salarySlip.id}
                                                className="cursor-pointer hover:bg-gray-50"
                                                onClick={() => setExpandedRowId(expandedRowId === salarySlip.id ? null : salarySlip.id)}
                                            >
                                                <td className="border px-3 py-2 text-center">{index + 1}</td>
                                                <td className="border px-3 py-2">{salarySlip.voucher_number}</td>
                                                <td className="border px-3 py-2">{salarySlip.date}</td>
                                                <td className="border px-3 py-2">{salaryFor}</td>
                                                <td className="border px-3 py-2">৳ {total.toFixed(2)}</td>
                                                <td className="border px-3 py-2">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status === 'Posted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                                    >
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="border px-3 py-2 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={`/salary-slips/${salarySlip.id}/invoice`}
                                                            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={`/salary-slips/${salarySlip.id}/edit`}
                                                            className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(salarySlip.id)}
                                                            className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRowId === salarySlip.id && (
                                                <tr>
                                                    <td colSpan={7} className="bg-gray-50 px-4 py-3">
                                                        <div className="mb-2 text-sm font-semibold">Employee Breakdown</div>
                                                        <table className="w-full border text-xs">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <th className="border px-2 py-1">Employee</th>
                                                                    <th className="border px-2 py-1">Basic</th>
                                                                    <th className="border px-2 py-1">Additional</th>
                                                                    <th className="border px-2 py-1">Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(salarySlip.salary_slip_employees || []).map((emp, i) => (
                                                                    <tr key={i}>
                                                                        <td className="border px-2 py-1">
                                                                            {emp.employee.name} ({emp.employee.designation?.name || 'N/A'})
                                                                        </td>
                                                                        <td className="border px-2 py-1">
                                                                            ৳ {parseFloat(emp.basic_salary).toFixed(2)}
                                                                        </td>
                                                                        <td className="border px-2 py-1">
                                                                            ৳ {parseFloat(emp.additional_amount).toFixed(2)}
                                                                        </td>
                                                                        <td className="border px-2 py-1">
                                                                            ৳ {parseFloat(emp.total_amount).toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-end gap-1">
                    {salarySlips.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || ''}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200'} ${!link.url && 'pointer-events-none opacity-50'}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
