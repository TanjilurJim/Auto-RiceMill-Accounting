import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Employee {
    id: number;
    name: string;
    email: string;
    mobile: string;
    salary: number;
    department: { name: string };
    designation: { name: string };
    shift: { name: string };
    status: string;
    creator?: { name: string };
}

export default function EmployeeIndex({ employees }: { employees: Employee[] }) {
    const handleDelete = (id: number) => {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This action cannot be undone!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/employees/${id}`);
        //         Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/employees/${id}`);
            }
        );

    };

    return (
        <AppLayout>
            <Head title="Employees" />
            <div className="p-6">
                {/* Header */}
                {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Employees</h1>
                    <Link
                        href="/employees/create"
                        className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
                    >
                        + Add Employee
                    </Link>
                </div> */}

                <PageHeader title="Employees" addLinkHref='/employees/create' addLinkText="+ Add Employee" />

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">#</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Mobile</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Salary</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Department</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Designation</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Shift</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-white">Status</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {employees.map((employee, index) => (
                                <tr
                                    key={employee.id}
                                    className="hover:bg-gray-50 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{index + 1}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.email}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.mobile}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.salary}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.department.name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.designation.name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.shift.name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{employee.status}</td>
                                    {/* <td className="px-4 py-2 text-center">
                                        <div className="inline-flex gap-2">
                                            <Link
                                                href={`/employees/${employee.id}/edit`}
                                                className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td> */}
                                    <ActionButtons
                                        editHref={`/employees/${employee.id}/edit`}
                                        onDelete={() => handleDelete(employee.id)}
                                        editText="Edit"
                                        deleteText="Delete"
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
