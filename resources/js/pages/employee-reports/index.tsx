import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import React from 'react';

/* ── types that match payload ───────────────────────────── */
interface Row {
    year: number;
    month: number;
    gross: number;
    paid: number;
    outstanding: number;
}
interface Emp {
    id: number;
    name: string;
}
interface Props {
    rows: Row[];
    employees: Emp[];
    selectedId: number | null;
    totals: { gross: number; paid: number; outstanding: number };
}

/* helpers */
const money = (n: number) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(n);
const monthName = (m: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];

/* component */
export default function EmployeeReport() {
    const { rows, employees, selectedId, totals } = usePage<PageProps<Props>>().props;

    /* — filter change — */
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value || undefined;
        router.get(route('employee-reports.index', { employee_id: id }), {}, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Employee Salary Report" />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="rounded-lg bg-white p-6">
                    <PageHeader title="Employee Salary Report" />

                    {/* Filter */}
                    <div className="mb-6">
                        <label className="mr-2 text-sm font-medium">Employee:</label>
                        <select value={selectedId ?? ''} onChange={onChange} className="rounded border px-3 py-2">
                            <option value="">— All Employees —</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Totals cards */}
                    <div className="mb-6 grid gap-4 text-center sm:grid-cols-3">
                        <StatCard title="Total Gross" colour="blue" value={money(totals.gross)} />
                        <StatCard title="Total Paid" colour="green" value={money(totals.paid)} />
                        <StatCard title="Total Outstanding" colour="red" value={money(totals.outstanding)} />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Month</th>
                                    <th className="px-3 py-2 text-right">Gross</th>
                                    <th className="px-3 py-2 text-right">Paid</th>
                                    <th className="px-3 py-2 text-right">Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={`${r.year}-${r.month}`} className="border-t">
                                        <td className="px-3 py-1">
                                            {monthName(r.month)} {r.year}
                                        </td>
                                        <td className="px-3 py-1 text-right">{money(r.gross)}</td>
                                        <td className="px-3 py-1 text-right">{money(r.paid)}</td>
                                        <td className="{Number(r.outstanding) ? 'text-red-600':'text-green-700'} px-3 py-1 text-right font-semibold">
                                            {money(r.outstanding)}
                                        </td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                                            No data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* tiny stat-card */
function StatCard({ title, value, colour }: { title: string; value: string; colour: 'green' | 'red' | 'blue' }) {
    const bg = { green: 'bg-green-100 text-green-900', red: 'bg-red-100 text-red-900', blue: 'bg-blue-100 text-blue-900' }[colour];
    return (
        <div className={`rounded-lg p-4 ${bg}`}>
            <div className="text-xs font-semibold opacity-70">{title}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
}
