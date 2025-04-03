import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Swal from 'sweetalert2';

interface FinancialYear {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  is_closed: boolean;
}

export default function Index({ financialYears }: { financialYears: FinancialYear[] }) {
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the financial year!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/financial-years/${id}`);
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Financial Years" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Financial Years</h1>
          <Link
            href="/financial-years/create"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Year
          </Link>
        </div>

        <div className="overflow-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Start Date</th>
                <th className="px-4 py-3 font-semibold text-gray-600">End Date</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {financialYears.map((year) => (
                <tr key={year.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{year.title}</td>
                  <td className="px-4 py-3">{year.start_date}</td>
                  <td className="px-4 py-3">{year.end_date}</td>
                  <td className="px-4 py-3 text-center">
                    {year.is_closed ? (
                      <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        Closed
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Open
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/financial-years/${year.id}/edit`}
                        className="rounded bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(year.id)}
                        className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {financialYears.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No financial years found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
