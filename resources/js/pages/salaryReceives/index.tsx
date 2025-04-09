import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Employee {
  id: number;
  name: string;
}

interface ReceivedMode {
  id: number;
  mode_name: string;
}

interface SalaryReceive {
  id: number;
  vch_no: string;
  date: string;
  employee: Employee;
  receivedMode: ReceivedMode;
  amount: string;
  description: string | null;
}

interface PaginatedSalaryReceives {
  data: SalaryReceive[];
  links: { url: string | null; label: string; active: boolean }[];
}

export default function SalaryReceiveIndex({ salaryReceives }: { salaryReceives: PaginatedSalaryReceives }) {
  // Handle delete action
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This salary receive record will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/salary-receives/${id}`);
        Swal.fire('Deleted!', 'The salary receive has been deleted.', 'success');
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Salary Receives" />
      <div className="bg-gray-100 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Salary Receives</h1>
          <Link
            href="/salary-receives/create"
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + Add New
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-[13px]">
            <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
              <tr>
                <th className="border px-3 py-2">SL</th>
                <th className="border px-3 py-2">Voucher No</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Employee</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaryReceives.data.map((salaryReceive, index) => (
                <tr key={salaryReceive.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2">{salaryReceive.vch_no}</td>
                  <td className="border px-3 py-2">{salaryReceive.date}</td>
                  <td className="border px-3 py-2">{salaryReceive.employee.name}</td>
                  <td className="border px-3 py-2">{salaryReceive.amount}</td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                    <Link
                      href={`/salary-receives/${salaryReceive.id}`}
                      className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                      <Link
                        href={`/salary-receives/${salaryReceive.id}/edit`}
                        className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                      >
                        Edit
                      </Link>

                     
                      <button
                        onClick={() => handleDelete(salaryReceive.id)}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end gap-1">
          {salaryReceives.links.map((link, index) => (
            <Link
              key={index}
              href={link.url || ''}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'} ${!link.url && 'pointer-events-none opacity-50'}`}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
