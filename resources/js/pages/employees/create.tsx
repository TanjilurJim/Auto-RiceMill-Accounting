import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateEmployee({ departments, designations, shifts, references }) {
    const t = useTranslation();
    // useForm hook for handling form state and submission
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        mobile: '',
        email: '',
        nid: '',
        present_address: '',
        permanent_address: '',
        salary: '',
        joining_date: '',
        status: 'Active',
        advance_amount: '',
        department_id: '',
        designation_id: '',
        shift_id: '',
        reference_by: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/employees');
    };

    return (
        <AppLayout>
            <Head title={t('empCreateEmployeeTitle')} />

            <div className="h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="h-full rounded-lg bg-background">
                    <PageHeader title={t('empCreateEmployeeTitle')} addLinkHref="/employees" addLinkText={t('backText')} />

                    <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border bg-background p-6">
                        {/* 👤 Personal Info */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('empPersonalInfoHeader')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empFullNameLabel')}</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empFullNamePlaceholder')}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empNationalIdLabel')}</label>
                                    <input
                                        type="text"
                                        value={data.nid}
                                        onChange={(e) => setData('nid', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empNidPlaceholder')}
                                    />
                                    {errors.nid && <p className="text-sm text-red-500">{errors.nid}</p>}
                                </div>
                            </div>
                        </div>

                        {/* 📞 Contact Info */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('empContactInfoHeader')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empMobileLabel')}</label>
                                    <input
                                        type="text"
                                        value={data.mobile}
                                        onChange={(e) => setData('mobile', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empMobilePlaceholder')}
                                    />
                                    {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empEmailLabel')}</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empEmailPlaceholder')}
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empPresentAddressLabel')}</label>
                                    <input
                                        type="text"
                                        value={data.present_address}
                                        onChange={(e) => setData('present_address', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empPresentAddressPlaceholder')}
                                    />
                                    {errors.present_address && <p className="text-sm text-red-500">{errors.present_address}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empPermanentAddressLabel')}</label>
                                    <input
                                        type="text"
                                        value={data.permanent_address}
                                        onChange={(e) => setData('permanent_address', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empPermanentAddressPlaceholder')}
                                    />
                                    {errors.permanent_address && <p className="text-sm text-red-500">{errors.permanent_address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* 🧾 Job Info */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('empJobInfoHeader')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empDepartmentLabel')}</label>
                                    <select
                                        value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        className="w-full rounded border p-2"
                                    >
                                        <option value="">{t('empSelectDepartmentOption')}</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empDesignationLabel')}</label>
                                    <select
                                        value={data.designation_id}
                                        onChange={(e) => setData('designation_id', e.target.value)}
                                        className="w-full rounded border p-2"
                                    >
                                        <option value="">{t('empSelectDesignationOption')}</option>
                                        {designations.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.designation_id && <p className="text-sm text-red-500">{errors.designation_id}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empShiftLabel')}</label>
                                    <select
                                        value={data.shift_id}
                                        onChange={(e) => setData('shift_id', e.target.value)}
                                        className="w-full rounded border p-2"
                                    >
                                        <option value="">{t('empSelectShiftOption')}</option>
                                        {shifts.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.shift_id && <p className="text-sm text-red-500">{errors.shift_id}</p>}
                                </div>
                            </div>
                        </div>

                        {/* 💰 Payroll Info */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">{t('empPayrollHeader')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empSalaryLabel')}</label>
                                    <input
                                        type="number"
                                        value={data.salary}
                                        onChange={(e) => setData('salary', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empSalaryPlaceholder')}
                                    />
                                    {errors.salary && <p className="text-sm text-red-500">{errors.salary}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empAdvanceLabel')}</label>
                                    <input
                                        type="number"
                                        value={data.advance_amount}
                                        onChange={(e) => setData('advance_amount', e.target.value)}
                                        className="w-full rounded border p-2"
                                        placeholder={t('empAdvancePlaceholder')}
                                    />
                                    {errors.advance_amount && <p className="text-sm text-red-500">{errors.advance_amount}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">{t('empJoiningDateLabel')}</label>
                                    <input
                                        type="date"
                                        value={data.joining_date}
                                        onChange={(e) => setData('joining_date', e.target.value)}
                                        className="w-full rounded border p-2"
                                    />
                                    {errors.joining_date && <p className="text-sm text-red-500">{errors.joining_date}</p>}
                                </div>
                            </div>
                        </div>

                        {/* 📌 Status & Reference */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('empStatusLabel')}</label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded border p-2">
                                    <option value="Active">{t('empActiveOption')}</option>
                                    <option value="Inactive">{t('empInactiveOption')}</option>
                                </select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('empReferenceByLabel')}</label>
                                <select
                                    value={data.reference_by}
                                    onChange={(e) => setData('reference_by', e.target.value)}
                                    className="w-full rounded border p-2"
                                >
                                    <option value="">{t('empSelectReferenceOption')}</option>
                                    {references.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.reference_by && <p className="text-sm text-red-500">{errors.reference_by}</p>}
                            </div>
                        </div>

                        {/* Submit */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/employees"
                            processing={processing}
                            submitText={t('empCreateEmployeeButton')}
                            cancelText={t('cancelText')}
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
