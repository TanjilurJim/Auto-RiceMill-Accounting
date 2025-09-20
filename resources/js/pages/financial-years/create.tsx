import React from 'react';

import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';

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
      <div className="bg-background p-6 h-full w-screen lg:w-full">
        <div className="bg-background h-full rounded-lg p-6">

          <PageHeader title="Add New Financial Year" addLinkHref='/financial-years' addLinkText="Back" />

          <form onSubmit={handleSubmit} className="space-y-6 bg-background rounded-lg p-6 border">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-foreground font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
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
                className=" w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
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

            
            <ActionFooter
              processing={processing}
              submitText={processing ? 'Saving...' : 'Save'}
              onSubmit={handleSubmit}
              onCancel={() => window.history.back()}
              className='justify-end'
            />
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
