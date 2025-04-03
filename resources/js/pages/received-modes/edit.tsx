import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface ReceivedModeProps {
  receivedMode: {
    id: number;
    mode_name: string;
    opening_balance: string;
    closing_balance: string;
    phone_number: string;
  };
}

export default function Edit({ receivedMode }: ReceivedModeProps) {
  const { data, setData, put, processing, errors } = useForm({
    mode_name: receivedMode.mode_name || '',
    opening_balance: receivedMode.opening_balance || '',
    closing_balance: receivedMode.closing_balance || '',
    phone_number: receivedMode.phone_number || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/received-modes/${receivedMode.id}`);
  };

  return (
    <AppLayout>
      <Head title="Edit Received Mode" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Received Mode</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Mode Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mode Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={data.mode_name}
                  onChange={(e) => setData('mode_name', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {errors.mode_name && <p className="text-red-500 text-xs mt-1">{errors.mode_name}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={data.phone_number}
                  onChange={(e) => setData('phone_number', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
              </div>

              {/* Opening Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={data.opening_balance}
                  onChange={(e) => setData('opening_balance', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {errors.opening_balance && <p className="text-red-500 text-xs mt-1">{errors.opening_balance}</p>}
              </div>

              {/* Closing Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closing Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={data.closing_balance}
                  onChange={(e) => setData('closing_balance', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {errors.closing_balance && <p className="text-red-500 text-xs mt-1">{errors.closing_balance}</p>}
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="flex justify-end border-t pt-4 bg-white sticky bottom-0 left-0 p-4 z-10 shadow-sm">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded shadow-sm transition"
            >
              {processing ? 'Updating...' : 'Update Received Mode'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
