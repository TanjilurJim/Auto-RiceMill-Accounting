import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import InputCalendar from '@/components/Btn&Link/InputCalendar';

interface FinancialYear {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  is_closed: boolean;
}

export default function Edit({ financialYear }: { financialYear: FinancialYear }) {
  const { data, setData, put, processing, errors } = useForm({
    title: financialYear.title || '',
    start_date: financialYear.start_date || '',
    end_date: financialYear.end_date || '',
    is_closed: financialYear.is_closed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/financial-years/${financialYear.id}`);
  };

  return (
    <AppLayout>
      <Head title="Edit Financial Year" />
      <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
        <div className="bg-white h-full rounded-lg p-6">
          <PageHeader title="Edit Financial Year" addLinkHref="/financial-years" addLinkText="Back" />

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6 border">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
            </div>

            {/* Start Date */}
            <div>
              <InputCalendar value={data.start_date} label="Start Date" onChange={(val) => setData('start_date', val)} />
              {errors.start_date && <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>}
            </div>

            {/* End Date */}
            <div>
              <InputCalendar value={data.end_date} label="End Date" onChange={(val) => setData('end_date', val)} />
              {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_closed"
                checked={data.is_closed}
                onChange={(e) => setData('is_closed', e.target.checked)}
              />
              <label htmlFor="is_closed" className="text-sm text-gray-700">
                Mark as Closed
              </label>
            </div>

            {/* Action Footer */}
            <ActionFooter
              processing={processing}
              submitText={processing ? 'Saving...' : 'Update'}
              onSubmit={handleSubmit}
              onCancel={() => window.history.back()}
              cancelText="Cancel"
              className="justify-end"
            />
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
