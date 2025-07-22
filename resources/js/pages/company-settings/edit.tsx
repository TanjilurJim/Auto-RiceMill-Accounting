import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { FaCamera } from 'react-icons/fa';

interface FinancialYear {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
}

interface EditProps {
    setting: {
        company_name: string;
        mailing_name: string;
        country: string;
        email: string;
        website: string;
        financial_year_id: number | null;
        mobile: string;
        address: string;
        description: string;
        logo_path?: string;
        apply_interest?: boolean;
        interest_basis?: string;
    };
    financialYears: FinancialYear[];
    interestBasisOptions: { value: string; label: string }[];
    saleFlowOptions: { value: string; label: string }[];
}

export default function Edit({ setting, financialYears, interestBasisOptions = [],saleFlowOptions = [],  }: EditProps) {
    const { data, setData, processing, errors } = useForm({
        company_name: setting?.company_name || '',
        mailing_name: setting?.mailing_name || '',
        country: setting?.country || '',
        email: setting?.email || '',
        website: setting?.website || '',
        financial_year_id: setting?.financial_year_id ?? '',
        mobile: setting?.mobile || '',
        address: setting?.address || '',
        description: setting?.description || '',
        apply_interest: setting?.apply_interest ?? true,
        interest_basis: setting?.interest_basis || 'due',
        interest_rate_per_year: setting?.interest_rate_per_year ?? '',
        interest_rate_per_month: setting?.interest_rate_per_month ?? '',
        interest_type: setting?.interest_type || 'percentage',
        interest_flat_per_day: setting?.interest_flat_per_day ?? '',
        sale_approval_flow: setting?.sale_approval_flow ?? 'none',
        logo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/company-settings', { ...data, _method: 'put' }, { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title="Company Settings" />

            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Company Profile" />

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 rounded-lg border bg-white p-6">
                        {/* Basic text inputs */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {[
                                ['Company Name', 'company_name'],
                                ['Mailing Name', 'mailing_name'],
                                ['Country', 'country'],
                                ['Email', 'email'],
                                ['Website', 'website'],
                                ['Mobile Number', 'mobile'],
                            ].map(([label, key]) => (
                                <div key={key}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                                    <input
                                        type="text"
                                        value={data[key as keyof typeof data] as string}
                                        onChange={(e) => setData(key, e.target.value)}
                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Address + description */}
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                ['Address', 'address'],
                                ['Description', 'description'],
                            ].map(([label, key]) => (
                                <div key={key}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                                    <textarea
                                        rows={3}
                                        value={data[key as keyof typeof data] as string}
                                        onChange={(e) => setData(key, e.target.value)}
                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* FY dropdown */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Financial Year</label>
                            <select
                                value={data.financial_year_id}
                                onChange={(e) => setData('financial_year_id', Number(e.target.value) || '')}
                                className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Select Financial Year</option>
                                {financialYears.map((fy) => (
                                    <option key={fy.id} value={fy.id}>
                                        {fy.title} ({fy.start_date} to {fy.end_date})
                                    </option>
                                ))}
                            </select>
                            {errors.financial_year_id && <p className="mt-1 text-xs text-red-500">{errors.financial_year_id}</p>}
                        </div>

                        {/* ── Sale approval flow ───────────────────────────────────── */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Sale approval flow</label>

                            <select
                                value={data.sale_approval_flow}
                                onChange={(e) => setData('sale_approval_flow', e.target.value)}
                                className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                {saleFlowOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>

                            {errors.sale_approval_flow && <p className="mt-1 text-xs text-red-500">{errors.sale_approval_flow}</p>}
                        </div>

                        {/* Interest flags */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    id="apply_interest"
                                    type="checkbox"
                                    checked={!!data.apply_interest}
                                    onChange={(e) => setData('apply_interest', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="apply_interest" className="text-sm font-medium text-gray-700">
                                    Apply interest on overdue invoices
                                </label>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Interest basis</label>
                                <select
                                    value={data.interest_basis}
                                    onChange={(e) => setData('interest_basis', e.target.value)}
                                    className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {interestBasisOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.interest_basis && <p className="mt-1 text-xs text-red-500">{errors.interest_basis}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Interest type</label>
                            <select
                                value={data.interest_type}
                                onChange={(e) => setData('interest_type', e.target.value)}
                                className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat per day</option>
                            </select>
                            {errors.interest_type && <p className="mt-1 text-xs text-red-500">{errors.interest_type}</p>}
                        </div>
                        {data.interest_type === 'flat' && (
                            <div className="mt-6">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Flat charge per day</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.interest_flat_per_day}
                                    onChange={(e) => setData('interest_flat_per_day', e.target.value)}
                                    className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.interest_flat_per_day && <p className="mt-1 text-xs text-red-500">{errors.interest_flat_per_day}</p>}
                            </div>
                        )}

                        {/* ② new inputs — put these under the “Interest basis” select */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Yearly interest %</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={data.interest_rate_per_year}
                                    onChange={(e) => setData('interest_rate_per_year', e.target.value)}
                                    className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.interest_rate_per_year && <p className="mt-1 text-xs text-red-500">{errors.interest_rate_per_year}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Monthly interest %</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={data.interest_rate_per_month}
                                    onChange={(e) => setData('interest_rate_per_month', e.target.value)}
                                    className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.interest_rate_per_month && <p className="mt-1 text-xs text-red-500">{errors.interest_rate_per_month}</p>}
                            </div>
                        </div>

                        {/* Logo upload */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Company Logo</label>
                            <div className="flex items-center gap-4">
                                {data.logo ? (
                                    <img src={URL.createObjectURL(data.logo)} alt="Logo Preview" className="h-16 w-16 rounded border object-cover" />
                                ) : setting?.logo_path ? (
                                    <img src={`/storage/${setting.logo_path}`} alt="Current Logo" className="h-16 w-16 rounded border object-cover" />
                                ) : (
                                    <div className="flex h-10 w-16 items-center justify-center rounded border bg-gray-100 text-gray-400">
                                        <FaCamera size={20} />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.length) {
                                            setData('logo', e.target.files[0]);
                                        }
                                    }}
                                    className="flex-1 rounded border px-3 py-2 text-sm shadow-sm"
                                />
                            </div>
                            {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
                        </div>

                        <ActionFooter
                            processing={processing}
                            onSubmit={handleSubmit}
                            submitText={processing ? 'Saving…' : 'Save Settings'}
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
