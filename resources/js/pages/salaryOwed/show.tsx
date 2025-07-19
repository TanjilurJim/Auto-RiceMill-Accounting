import { Accordion, AccordionItem } from '@/components/Accordion';
import ActionButtons from '@/components/ActionButtons';
import PageHeader from '@/components/PageHeader';
import ProgressBar from '@/components/ProgressBar';
import SlipTable from '@/components/SlipTable';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

/* — helpers — */
const money = (n: number | string) =>
    new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 2 }).format(Number(n) || 0);

const monthName = (n: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][n - 1] ?? '';

/* — local types copied from Controller payload — */
interface Receive {
    id: number;
    date: string;
    amount: number;
    received_mode?: { mode_name: string };
}
interface SlipRow {
    id: number;
    total_amount: number;
    paid_amount: number;
    salary_slip: { voucher_number: string; month: number; year: number };
    receives: Receive[];
}
interface Payload {
    id: number;
    name: string;
    gross_salary: number;
    salary_paid: number;
    salary_outstanding: number;
    salary_slip_employees: SlipRow[];
}

export default function Show() {
    const { employee } = usePage<PageProps<{ employee: Payload }>>().props;

    return (
        <AppLayout>
            <Head title={`Salary Statement – ${employee.name}`} />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="rounded-lg bg-white p-6">
                    <PageHeader title={`Salary Statement – ${employee.name}`} addLinkHref={route('salary-owed.index')} addLinkText="← Back to List" />

                    {/* ── KPI Cards ─────────────────────────────────────── */}
                    <div className="my-6 grid gap-4 text-center sm:grid-cols-3">
                        <Card title="Total Paid" value={money(employee.salary_paid)} colour="green" />
                        <Card title="Total Outstanding" value={money(employee.salary_outstanding)} colour="red" />
                        <Card title="Total Gross Salary" value={money(employee.gross_salary)} colour="blue" />
                    </div>

                    {/* progress */}
                    <ProgressBar total={employee.gross_salary} paid={employee.salary_paid} />
                    <p className="mt-1 text-center text-sm text-gray-600">
                        Paid {money(employee.salary_paid)} of {money(employee.gross_salary)}
                    </p>

                    {/* ── Salary slips ─────────────────────────────────── */}
                    <h3 className="mt-8 mb-4 text-lg font-semibold text-gray-700">Salary Slips</h3>
                    <Accordion>
                        {employee.salary_slip_employees.map((slip) => {
                            const outstanding = Math.max(0, slip.total_amount - slip.paid_amount);
                            const status =
                                outstanding === 0
                                    ? { t: 'Paid', cls: 'bg-green-100 text-green-800' }
                                    : outstanding === slip.total_amount
                                      ? { t: 'Unpaid', cls: 'bg-red-100 text-red-800' }
                                      : { t: 'Partially Paid', cls: 'bg-yellow-100 text-yellow-800' };

                            return (
                                <AccordionItem
                                    key={slip.id}
                                    header={
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-800">
                                                    {slip.salary_slip.voucher_number}{' '}
                                                    <span className="text-xs font-normal text-gray-500">
                                                        ({monthName(slip.salary_slip.month)} {slip.salary_slip.year})
                                                    </span>
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.cls}`}>{status.t}</span>
                                            </div>
                                            <span className="font-medium">{money(outstanding)} owed</span>
                                        </div>
                                    }
                                >
                                    <SlipTable
                                        slip={{
                                            ...slip,
                                            outstanding,
                                            status: status.t,
                                        }}
                                    />
                                </AccordionItem>
                            );
                        })}
                    </Accordion>

                    {/* actions */}
                    <div className="mt-6 flex gap-4 border-t pt-6">
                        <ActionButtons
                            onPrint={() => window.print()}
                            printText="Print Statement"
                            printClassName="btn-primary"
                            viewHref={route('salary-owed.show', [employee.id, { pdf: 1 }])}
                            viewText="Download PDF"
                            viewClassName="btn-outline"
                            size="md"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* lightweight colour-aware Card component */
function Card({ title, value, colour }: { title: string; value: string; colour: 'green' | 'red' | 'blue' }) {
    const palette: Record<typeof colour, string> = {
        green: 'bg-green-100 text-green-900',
        red: 'bg-red-100 text-red-900',
        blue: 'bg-blue-100 text-blue-900',
    };
    return (
        <div className={`rounded-lg p-4 ${palette[colour]}`}>
            <div className="text-sm font-semibold opacity-70">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}
