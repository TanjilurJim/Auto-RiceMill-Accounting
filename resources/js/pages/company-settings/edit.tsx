import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FaCamera } from 'react-icons/fa';
import { router } from '@inertiajs/react'

export default function Edit({ setting, financialYears }) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: setting?.company_name || '',
        mailing_name: setting?.mailing_name || '',
        country: setting?.country || '',
        email: setting?.email || '',
        website: setting?.website || '',
        financial_year_id: setting?.financial_year_id || '',
        mobile: setting?.mobile || '',
        address: setting?.address || '',
        description: setting?.description || '',
        logo: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    
      router.post('/company-settings', {
        ...data,            // send every field, incl. File
        _method: 'put',     // method spoof
      }, {
        forceFormData: true // ensures multipart/form‑data
      });
    };

    return (
        <AppLayout>
            <Head title="Company Settings" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Company Profile" />

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 rounded-lg border bg-white p-6">
                        {/* Text Fields */}
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
                                        value={data[key]}
                                        onChange={(e) => setData(key, e.target.value)}
                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Address and Description */}
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                ['Address', 'address'],
                                ['Description', 'description'],
                            ].map(([label, key]) => (
                                <div key={key}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                                    <textarea
                                        value={data[key]}
                                        onChange={(e) => setData(key, e.target.value)}
                                        className="w-full rounded border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows={3}
                                    />
                                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Financial Year Dropdown */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Financial Year</label>
                            <select
                                value={data.financial_year_id}
                                onChange={(e) => setData('financial_year_id', e.target.value)}
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
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Company Logo</label>

                            <div className="flex items-center gap-4">
                                {/* Preview or placeholder icon */}
                                {data.logo ? (
                                    <img src={URL.createObjectURL(data.logo)} alt="Logo Preview" className="h-16 w-16 rounded border object-cover" />
                                ) : setting?.logo_path ? (
                                    <img src={`/storage/${setting.logo_path}`} alt="Current Logo" className="h-16 w-16 rounded border object-cover" />
                                ) : (
                                    <div className="flex h-10 w-16 items-center justify-center rounded border bg-gray-100 text-gray-400">
                                        <FaCamera size={20} /> {/* Use the React icon here */}
                                    </div>
                                )}

                                {/* File input */}
                                <input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setData('logo', e.target.files[0]);
                                        }
                                    }}
                                    className="flex-1 rounded border px-3 py-2 text-sm shadow-sm"
                                />
                            </div>

                            {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
                        </div>

                        {/* Action Footer */}
                        <ActionFooter
                            processing={processing}
                            onSubmit={handleSubmit}
                            submitText={processing ? 'Saving...' : 'Save Settings'}
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
