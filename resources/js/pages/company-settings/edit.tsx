import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
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
        interest_type?: 'percentage' | 'flat';
        interest_rate_per_year?: number | null;
        interest_rate_per_month?: number | null;
        interest_flat_per_day?: number | null;
        sale_approval_flow?: string;
        purchase_approval_flow?: string;
    };
    financialYears: FinancialYear[];
    interestBasisOptions: { value: string; label: string }[];
    saleFlowOptions: { value: string; label: string }[];
    purchaseFlowOptions: { value: string; label: string }[];
}

export default function Edit({
    setting,
    financialYears,
    interestBasisOptions = [],
    saleFlowOptions = [],
    purchaseFlowOptions = [],
}: EditProps) {
    // determine default frequency based on existing settings
    const defaultFrequency =
        setting?.interest_rate_per_year ? 'yearly' : setting?.interest_rate_per_month ? 'monthly' : 'yearly';

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
        // interest_type: 'percentage' | 'flat'
        interest_type: (setting?.interest_type as 'percentage' | 'flat') || 'percentage',
        // new: interest_frequency - only used when interest_type === 'percentage'
        interest_frequency: defaultFrequency, // 'yearly' | 'monthly'
        interest_rate_per_year: setting?.interest_rate_per_year ?? '',
        interest_rate_per_month: setting?.interest_rate_per_month ?? '',
        interest_flat_per_day: setting?.interest_flat_per_day ?? '',
        sale_approval_flow: setting?.sale_approval_flow ?? 'none',
        purchase_approval_flow: setting?.purchase_approval_flow ?? 'none',
        logo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // submit as form-data (files)
        router.post('/company-settings', { ...data, _method: 'put' }, { forceFormData: true });
    };
    const t = useTranslation();

    return (
        <AppLayout>
            <Head title={t('csPageTitle')} />

            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title={t('csCompanyProfileTitle')} />

                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="bg-background text-foreground space-y-6 rounded-lg border p-6"
                    >
                        {/* Basic text inputs */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {[
                                [t('csCompanyNameLabel'), 'company_name'],
                                [t('csMailingNameLabel'), 'mailing_name'],
                                [t('csCountryLabel'), 'country'],
                                [t('csEmailLabel'), 'email'],
                                [t('csWebsiteLabel'), 'website'],
                                [t('csMobileNumberLabel'), 'mobile'],
                            ].map(([label, key]) => (
                                <div key={key}>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{label}</label>
                                    <input
                                        type="text"
                                        value={data[key as keyof typeof data] as string}
                                        onChange={(e) => setData(key as string, e.target.value)}
                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Address + description */}
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                [t('csAddressLabel'), 'address'],
                                [t('csDescriptionLabel'), 'description'],
                            ].map(([label, key]) => (
                                <div key={key}>
                                    <label className="text-foreground mb-1 block text-sm font-medium">{label}</label>
                                    <textarea
                                        rows={3}
                                        value={data[key as keyof typeof data] as string}
                                        onChange={(e) => setData(key as string, e.target.value)}
                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* FY dropdown */}
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-medium">{t('csFinancialYearLabel')}</label>
                            <select
                                value={data.financial_year_id}
                                onChange={(e) => setData('financial_year_id', Number(e.target.value) || '')}
                                className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">{t('csSelectFinancialYearOption')}</option>
                                {financialYears.map((fy) => (
                                    <option key={fy.id} value={fy.id}>
                                        {fy.title} ({fy.start_date} {t('csToText')} {fy.end_date})
                                    </option>
                                ))}
                            </select>
                            {errors.financial_year_id && <p className="mt-1 text-xs text-red-500">{errors.financial_year_id}</p>}
                        </div>

                        {/* ── Approval flows ───────────────────────────────────── */}
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-medium">{t('csSaleApprovalFlowLabel')}</label>

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

                        <div>
                            <label className="text-foreground mb-1 block text-sm font-medium">{t('csPurchaseApprovalFlowLabel')}</label>

                            <select
                                value={data.purchase_approval_flow}
                                onChange={(e) => setData('purchase_approval_flow', e.target.value)}
                                className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                {purchaseFlowOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>

                            {errors.purchase_approval_flow && <p className="mt-1 text-xs text-red-500">{errors.purchase_approval_flow}</p>}
                        </div>

                        {/* Interest section: only show when apply_interest is true */}
                        <div className="border rounded p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="apply_interest"
                                        type="checkbox"
                                        checked={!!data.apply_interest}
                                        onChange={(e) => setData('apply_interest', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="apply_interest" className="text-foreground text-sm font-medium">
                                        {t('csApplyInterestLabel')}
                                    </label>
                                </div>
                                {/* <div className="text-xs text-gray-500">{t('csApplyInterestHint')}</div> */}
                            </div>

                            {data.apply_interest && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="text-foreground mb-1 block text-sm font-medium">{t('InterestBasisLabel')}</label>
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

                                    <div>
                                        <label className="text-foreground mb-1 block text-sm font-medium">{t('InterestTypeLabel')}</label>
                                        <select
                                            value={data.interest_type}
                                            onChange={(e) => setData('interest_type', e.target.value)}
                                            className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="percentage">{t('csPercentageOption')}</option>
                                            <option value="flat">{t('csFlatPerDayOption')}</option>
                                        </select>
                                        {errors.interest_type && <p className="mt-1 text-xs text-red-500">{errors.interest_type}</p>}
                                    </div>

                                    {/* Percentage flow: choose yearly or monthly via radio, show only selected input */}
                                    {data.interest_type === 'percentage' && (
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-4">
                                                <label className="text-sm font-medium text-foreground">{t('Percentage Period')}</label>
                                                <label className="flex items-center space-x-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="interest_frequency"
                                                        checked={data.interest_frequency === 'yearly'}
                                                        onChange={() => setData('interest_frequency', 'yearly')}
                                                    />
                                                    <span>{t('Yearly Option')}</span>
                                                </label>
                                                <label className="flex items-center space-x-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="interest_frequency"
                                                        checked={data.interest_frequency === 'monthly'}
                                                        onChange={() => setData('interest_frequency', 'monthly')}
                                                    />
                                                    <span>{t('Monthly Option')}</span>
                                                </label>
                                            </div>

                                            {data.interest_frequency === 'yearly' && (
                                                <div>
                                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('csYearlyInterestLabel')}</label>
                                                    <input
                                                        type="number"
                                                        step="0.0001"
                                                        value={data.interest_rate_per_year}
                                                        onChange={(e) => setData('interest_rate_per_year', e.target.value)}
                                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    {errors.interest_rate_per_year && <p className="mt-1 text-xs text-red-500">{errors.interest_rate_per_year}</p>}
                                                </div>
                                            )}

                                            {data.interest_frequency === 'monthly' && (
                                                <div>
                                                    <label className="text-foreground mb-1 block text-sm font-medium">{t('csMonthlyInterestLabel')}</label>
                                                    <input
                                                        type="number"
                                                        step="0.0001"
                                                        value={data.interest_rate_per_month}
                                                        onChange={(e) => setData('interest_rate_per_month', e.target.value)}
                                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    {errors.interest_rate_per_month && <p className="mt-1 text-xs text-red-500">{errors.interest_rate_per_month}</p>}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Flat flow: show flat-per-day input only */}
                                    {data.interest_type === 'flat' && (
                                        <div>
                                            <label className="text-foreground mb-1 block text-sm font-medium">{t('csFlatChargePerDayLabel')}</label>
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
                                </div>
                            )}
                        </div>

                        {/* Logo upload */}
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-medium">{t('csCompanyLogoLabel')}</label>
                            <div className="flex items-center gap-4">
                                {data.logo ? (
                                    <img
                                        src={URL.createObjectURL(data.logo)}
                                        alt={t('csLogoPreviewAlt')}
                                        className="h-16 w-16 rounded border object-cover"
                                    />
                                ) : setting?.logo_path ? (
                                    <img
                                        src={`/storage/${setting.logo_path}`}
                                        alt={t('csCurrentLogoAlt')}
                                        className="h-16 w-16 rounded border object-cover"
                                    />
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
                            submitText={processing ? t('csSavingText') : t('csSaveSettingsButton')}
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
