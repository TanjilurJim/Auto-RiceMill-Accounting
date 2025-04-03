import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    start_date: '',
    end_date: '',
    is_closed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/financial-years');
  };

  return (
    <AppLayout>
      <Head title="Create Financial Year" />

      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-6 bg-gray-100 shadow rounded-2xl">
          Add New Financial Year
        </h1>

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
              placeholder="e.g., 2024-2025"
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
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
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
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
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
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Save'}
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
