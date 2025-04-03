import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl font-bold border-b pb-3">Company Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border shadow rounded-lg">
          {/* Text Fields */}
          {[
            ['Company Name', 'company_name'],
            ['Mailing Name', 'mailing_name'],
            ['Country', 'country'],
            ['Email', 'email'],
            ['Website', 'website'],
            ['Mobile Number', 'mobile'],
            ['Address', 'address'],
            ['Description', 'description'],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {key === 'address' || key === 'description' ? (
                <textarea
                  value={data[key]}
                  onChange={(e) => setData(key, e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  value={data[key]}
                  onChange={(e) => setData(key, e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              )}
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          {/* Financial Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
            <select
              value={data.financial_year_id}
              onChange={(e) => setData('financial_year_id', e.target.value)}
              className="w-full border px-3 py-2 rounded"
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

          {/* Save Button */}
          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
