// resources/js/Pages/employee-reports/index.tsx
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

interface Row {
    year: number;
    month: number;
    gross: number;
    paid: number;
    outstanding: number;
    paid_advance: number;
    paid_regular: number;
    has_advance: boolean;
}
interface Emp {
    id: number;
    name: string;
}
interface EmpAdvance {
    employee_id: number;
    name: string;
    advance_paid: number;
}
interface Props {
    rows: Row[];
    employees: Emp[];
    selectedId: number | null;
    totals: { gross: number; paid: number; advance: number; regular: number; outstanding: number };
    type: 'all' | 'advance' | 'regular';
    empAdvances: EmpAdvance[]; // optional
}

const money = (n: number) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(n);
const monthName = (m: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];

export default function EmployeeReport() {
    const { rows, employees, selectedId, totals, type, empAdvances } = usePage<PageProps<Props>>().props;

    const onChangeEmp = (e: React.ChangeEvent<HTMLSelectElement>) =>
        router.get(route('employee-reports.index', { employee_id: e.target.value || undefined, type }), {}, { preserveState: true });

    const onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) =>
        router.get(route('employee-reports.index', { employee_id: selectedId || undefined, type: e.target.value }), {}, { preserveState: true });

    return (
        <AppLayout>
            <Head title="Employee Salary Report" />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="rounded-lg bg-white p-6">
                    <PageHeader title="Employee Salary Report" />

                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap gap-3">
                        <label className="text-sm font-medium">Employee:</label>
                        <select value={selectedId ?? ''} onChange={onChangeEmp} className="rounded border px-3 py-2">
                            <option value="">— All Employees —</option>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </select>

                        <label className="ml-4 text-sm font-medium">Payment Type:</label>
                        <select value={type} onChange={onChangeType} className="rounded border px-3 py-2">
                            <option value="all">All</option>
                            <option value="advance">Advance only</option>
                            <option value="regular">Regular only</option>
                        </select>
                    </div>

                    {/* Totals */}
                    <div className="mb-6 grid gap-4 text-center sm:grid-cols-5">
                        <StatCard title="Total Gross" colour="blue" value={money(totals.gross)} />
                        <StatCard title="Total Paid" colour="green" value={money(totals.paid)} />
                        <StatCard title="Advance Paid" colour="yellow" value={money(totals.advance)} />
                        <StatCard title="Regular Paid" colour="teal" value={money(totals.regular)} />
                        <StatCard title="Outstanding" colour="red" value={money(totals.outstanding)} />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Month</th>
                                    <th className="px-3 py-2 text-right">Gross</th>
                                    <th className="px-3 py-2 text-right">Advance Paid</th>
                                    <th className="px-3 py-2 text-right">Regular Paid</th>
                                    <th className="px-3 py-2 text-right">Paid (Total)</th>
                                    <th className="px-3 py-2 text-right">Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={`${r.year}-${r.month}`} className="border-t">
                                        <td className="px-3 py-1">
                                            {monthName(r.month)} {r.year}
                                            {r.has_advance && (
                                                <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">Advance</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-1 text-right">{money(r.gross)}</td>
                                        <td className="px-3 py-1 text-right">{money(r.paid_advance)}</td>
                                        <td className="px-3 py-1 text-right">{money(r.paid_regular)}</td>
                                        <td className="px-3 py-1 text-right">{money(r.paid)}</td>
                                        <td className={`px-3 py-1 text-right font-semibold ${r.outstanding ? 'text-red-600' : 'text-green-700'}`}>
                                            {money(r.outstanding)}
                                        </td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                                            No data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Optional: “Who got advances” mini list */}
                    {empAdvances?.length > 0 && (
                        <div className="mt-8">
                            <div className="mb-2 text-sm font-semibold">Employees who received advances (in this view):</div>
                            <ul className="list-disc pl-6 text-sm">
                                {empAdvances.map((a) => (
                                    <li key={a.employee_id}>
                                        {a.name}: <span className="font-semibold">{money(Number(a.advance_paid || 0))}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, colour }: { title: string; value: string; colour: 'green' | 'red' | 'blue' | 'teal' | 'yellow' }) {
    const tone: Record<string, string> = {
        green: 'bg-green-100 text-green-900',
        red: 'bg-red-100 text-red-900',
        blue: 'bg-blue-100 text-blue-900',
        teal: 'bg-teal-100 text-teal-900',
        yellow: 'bg-yellow-100 text-yellow-900',
    };
    return (
        <div className={`rounded-lg p-4 ${tone[colour]}`}>
            <div className="text-xs font-semibold opacity-70">{title}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
}
