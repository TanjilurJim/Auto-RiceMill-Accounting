import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';

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
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put('/company-settings');
  };

  return (
    <AppLayout>
      <Head title="Company Settings" />
      <div className="p-6 w-full mx-auto space-y-6">
        <PageHeader title="Company Profile" />

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border shadow rounded-lg">
          {/* Text Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ['Company Name', 'company_name'],
              ['Mailing Name', 'mailing_name'],
              ['Country', 'country'],
              ['Email', 'email'],
              ['Website', 'website'],
              ['Mobile Number', 'mobile'],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  value={data[key]}
                  onChange={(e) => setData(key, e.target.value)}
                  className="w-full border px-3 py-2 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <textarea
                  value={data[key]}
                  onChange={(e) => setData(key, e.target.value)}
                  className="w-full border px-3 py-2 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}
          </div>

          {/* Financial Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
            <select
              value={data.financial_year_id}
              onChange={(e) => setData('financial_year_id', e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Financial Year</option>
              {financialYears.map((fy) => (
                <option key={fy.id} value={fy.id}>
                  {fy.title} ({fy.start_date} to {fy.end_date})
                </option>
              ))}
            </select>
            {errors.financial_year_id && (
              <p className="text-red-500 text-xs mt-1">{errors.financial_year_id}</p>
            )}
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
    </AppLayout>
  );
}
