import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import moment from 'moment';
import React, { useEffect } from 'react';

interface Employee {
    id: number;
    name: string;
}

interface Props {
    employees: Employee[];
}

const EmployeeLedgerFilter: React.FC<Props> = ({ employees }) => {
    const t = useTranslation();
    const today = moment().format('YYYY-MM-DD');
    const startOfYear = moment().startOf('year').format('YYYY-MM-DD');

    const { data, setData, get, processing, errors } = useForm({
        employee_id: '',
        from_date: today,
        to_date: today,
        filter_type: 'daily', // "daily" or "yearly"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('employee.ledger')); // goes to controller
    };

    // If yearly filter selected → auto set full year
    useEffect(() => {
        if (data.filter_type === 'yearly') {
            setData('from_date', startOfYear);
            setData('to_date', today);
        }
    }, [data.filter_type, setData, startOfYear, today]);

    return (
        <AppLayout>
            <Head title={t('employeeLedgerFilterTitle')} />
            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-white">
                    <PageHeader title={t('employeeLedgerReportTitle')} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Employee Dropdown */}
                        <div>
                            <label className="mb-1 block font-medium">{t('empEmployeeLedgerLabel')}</label>
                            <select
                                value={data.employee_id}
                                onChange={(e) => setData('employee_id', e.target.value)}
                                className="w-full rounded border px-3 py-2"
                                required
                            >
                                <option value="">{t('selectEmployeeOption')}</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && <div className="text-red-600">{errors.employee_id}</div>}
                        </div>

                        {/* Filter Type */}
                        <div>
                            <label className="mb-1 block font-medium">{t('filterTypeLabel')}</label>
                            <select
                                value={data.filter_type}
                                onChange={(e) => setData('filter_type', e.target.value)}
                                className="w-full rounded border px-3 py-2"
                            >
                                <option value="daily">{t('dailyFilterOption')}</option>
                                <option value="yearly">{t('yearlyFilterOption')}</option>
                            </select>
                        </div>

                        {/* Date Inputs - only show if daily */}
                        {data.filter_type === 'daily' && (
                            <>
                                <div>
                                    <InputCalendar
                                        value={data.from_date}
                                        onChange={(val) => setData('from_date', val)}
                                        label={t('fromDateLabel')}
                                        required
                                    />
                                    {errors.from_date && <div className="text-red-600">{errors.from_date}</div>}
                                </div>

                                <div>
                                    <InputCalendar
                                        value={data.to_date}
                                        onChange={(val) => setData('to_date', val)}
                                        label={t('toDateLabel')}
                                        required
                                    />
                                    {errors.to_date && <div className="text-red-600">{errors.to_date}</div>}
                                </div>
                            </>
                        )}

                        <div className="flex justify-end">
                            <button type="submit" className="bg-primary hover:bg-primary-hover rounded px-4 py-2 text-white" disabled={processing}>
                                {t('generateReportText')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default EmployeeLedgerFilter;
