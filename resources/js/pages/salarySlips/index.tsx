import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { route } from 'ziggy-js';

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
    const t = useTranslation();
    const [filters, setFilters] = useState({
        month: '',
        year: '',
        employee_id: '',
    });

    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/salary-slips/${id}`);
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

    const columns = [
        { header: 'SL', accessor: (_: any, index: number) => index + 1, className: 'text-center' },
        { header: 'Voucher', accessor: 'voucher_number' },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Salary For',
            accessor: (row: any) =>
                row.month && row.year ? `${new Date(row.year, row.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}` : 'N/A',
        },
        {
            header: 'Total',
            accessor: (row: any) =>
                `৳ ${(row.salary_slip_employees ?? []).reduce((sum: number, item: any) => sum + parseFloat(item.total_amount), 0).toFixed(2)}`,
        },
        {
            header: 'Status Journal',
            accessor: (row: any) => (
                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        row.is_posted_to_accounts ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                    {row.is_posted_to_accounts ? 'Posted' : 'Draft'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: (row: any) => (
                <ActionButtons
                    onDelete={() => handleDelete(row.id)}
                    editHref={`/salary-slips/${row.id}/edit`}
                    printHref={route('salary-slips.show', row.id)}
                    printText="View"
                />
            ),
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('salSlipsTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-white">
                    <PageHeader title={t('salSlipsTitle')} addLinkHref="/salary-slips/create" addLinkText={t('addNewText')} />

                    {/* Summary */}
                    <div className="mb-4 flex flex-wrap gap-4 rounded-lg border bg-white p-4">
                        <div className="text-sm">
                            💰 <strong>{t('salTotalSlipsLabel')}:</strong> {totalSlips}
                        </div>
                        <div className="text-sm">
                            🧾 <strong>{t('salTotalAmountLabel')}:</strong> ৳ {totalAmount.toFixed(2)}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border bg-white p-4">
                        <div className="w-full min-w-[150px] sm:w-auto">
                            {/* <select
                            className="rounded border p-2 text-sm w-full sm:w-auto"
                            value={filters.month}
                            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                        >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select> */}
                            <Select
                                placeholder={t('salMonthPlaceholder')}
                                options={Array.from({ length: 12 }, (_, i) => ({
                                    value: i + 1,
                                    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
                                }))}
                                isClearable
                                isSearchable
                                value={
                                    filters.month
                                        ? { value: filters.month, label: new Date(0, filters.month - 1).toLocaleString('default', { month: 'long' }) }
                                        : null
                                }
                                onChange={(option) => setFilters({ ...filters, month: option?.value || '' })}
                            />
                        </div>

                        <div className="w-full min-w-[150px] sm:w-auto">
                            <CreatableSelect
                                placeholder={t('salYearPlaceholder')}
                                options={yearOptions}
                                isClearable
                                isSearchable
                                value={filters.year ? { value: filters.year, label: filters.year } : null}
                                onChange={(option) => setFilters({ ...filters, year: option?.value || '' })}
                                onCreateOption={(inputValue) => setFilters({ ...filters, year: inputValue })}
                            />
                        </div>

                        <div className="w-full min-w-[250px] sm:w-auto">
                            <Select
                                placeholder={t('salEmployeePlaceholder')}
                                options={employeeOptions}
                                isClearable
                                onChange={(option) => setFilters({ ...filters, employee_id: option?.value || '' })}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
                        <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base lg:text-lg">
                            <thead className="bg-gray-100 text-xs text-gray-600 uppercase sm:text-sm">
                                <tr>
                                    <th className="border px-2 py-2 sm:px-3">{t('salSlLabel')}</th>
                                    <th className="border px-2 py-2 sm:px-3">{t('salVoucherLabel')}</th>
                                    <th className="border px-2 py-2 sm:px-3">{t('dateLabel')}</th>
                                    <th className="border px-2 py-2 sm:px-3">{t('salSalaryForLabel')}</th>
                                    <th className="border px-2 py-2 sm:px-3">{t('totalLabel')}</th>
                                    <th className="border px-2 py-2 sm:px-3">{t('salStatusJournalLabel')}</th>
                                    <th className="border px-2 py-2 text-center sm:px-3">{t('salActionsLabel')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salarySlips.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-6 text-center text-sm text-gray-500">
                                            {t('salNoSalarySlipsMessage')}
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
                                        const status = salarySlip.is_posted_to_accounts ? t('salPostedStatus') : t('salDraftStatus');

                                        return (
                                            <>
                                                <tr
                                                    key={salarySlip.id}
                                                    className="cursor-pointer border hover:bg-gray-50"
                                                    onClick={() => setExpandedRowId(expandedRowId === salarySlip.id ? null : salarySlip.id)}
                                                >
                                                    <td className="border px-2 py-2 text-center sm:px-3">{index + 1}</td>
                                                    <td className="border px-2 py-2 sm:px-3">{salarySlip.voucher_number}</td>
                                                    <td className="border px-2 py-2 sm:px-3">{salarySlip.date}</td>
                                                    <td className="border px-2 py-2 sm:px-3">{salaryFor}</td>
                                                    <td className="border px-2 py-2 sm:px-3">৳ {total.toFixed(2)}</td>
                                                    <td className="border px-2 py-2 sm:px-3">
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                                status === 'Posted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                        >
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td className="border px-2 py-2 sm:px-3">
                                                        <ActionButtons
                                                            onDelete={() => handleDelete(salarySlip.id)}
                                                            editHref={`/salary-slips/${salarySlip.id}/edit`}
                                                            printHref={route('salary-slips.show', salarySlip.id)}
                                                            printText={t('salViewText')}
                                                        />
                                                    </td>
                                                </tr>
                                                {expandedRowId === salarySlip.id && (
                                                    <tr>
                                                        <td colSpan={7} className="bg-gray-50 px-4 py-3">
                                                            <div className="mb-2 text-sm font-semibold">{t('salEmployeeBreakdownLabel')}</div>
                                                            <table className="w-full border text-xs sm:text-sm">
                                                                <thead>
                                                                    <tr className="bg-gray-100">
                                                                        <th className="border px-2 py-1">{t('salEmployeeLabel')}</th>
                                                                        <th className="border px-2 py-1">{t('salBasicLabel')}</th>
                                                                        <th className="border px-2 py-1">{t('salAdditionalLabel')}</th>
                                                                        <th className="border px-2 py-1">{t('totalLabel')}</th>
                                                                        <th className="border px-2 py-1">{t('salPaidLabel')}</th>
                                                                        <th className="border px-2 py-1">{t('salStatusLabel')}</th>
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
                                                                            <td className="border px-2 py-1">
                                                                                ৳ {parseFloat(emp.paid_amount || '0').toFixed(2)}
                                                                            </td>
                                                                            <td className="border px-2 py-1">
                                                                                <span
                                                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                                                        emp.status === 'Paid'
                                                                                            ? 'bg-green-100 text-green-800'
                                                                                            : emp.status === 'Partially Paid'
                                                                                              ? 'bg-yellow-100 text-yellow-800'
                                                                                              : 'bg-red-100 text-red-800'
                                                                                    }`}
                                                                                >
                                                                                    {emp.status || 'Unpaid'}
                                                                                </span>
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
                    <Pagination
                        links={salarySlips.links}
                        currentPage={salarySlips.current_page}
                        lastPage={salarySlips.last_page}
                        total={salarySlips.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
