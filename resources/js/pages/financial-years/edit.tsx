import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-6">Edit Financial Year</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6 border">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input w-full"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="form-input w-full"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
              disabled={data.is_closed}
            />
            {errors.start_date && <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="form-input w-full"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
              disabled={data.is_closed}
            />
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

          {/* Buttons */}
          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
