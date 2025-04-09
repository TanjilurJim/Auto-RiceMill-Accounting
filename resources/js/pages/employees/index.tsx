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
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/employees/${id}`);
                Swal.fire("Deleted!", "Employee has been deleted.", "success");
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Employees" />
            <div className="p-6">
                {/* Page Header */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <Link href="/employees/create" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div>

                {/* Employee Table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg dark:bg-neutral-900">
                    <table className="min-w-full border-collapse border border-gray-200 dark:border-neutral-700">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="py-2 px-4 border">#</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Email</th>
                                <th className="py-2 px-4 border">Mobile</th>
                                <th className="py-2 px-4 border">Salary</th>
                                <th className="py-2 px-4 border">Department</th>
                                <th className="py-2 px-4 border">Designation</th>
                                <th className="py-2 px-4 border">Shift</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr key={employee.id} className="border-t border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800">
                                    <td className="py-2 px-4 text-center">{index + 1}</td>
                                    <td className="py-2 px-4">{employee.name}</td>
                                    <td className="py-2 px-4">{employee.email}</td>
                                    <td className="py-2 px-4">{employee.mobile}</td>
                                    <td className="py-2 px-4">{employee.salary}</td>
                                    <td className="py-2 px-4">{employee.department.name}</td>
                                    <td className="py-2 px-4">{employee.designation.name}</td>
                                    <td className="py-2 px-4">{employee.shift.name}</td>
                                    <td className="py-2 px-4">{employee.status}</td>
                                    <td className="py-2 px-4 flex justify-center space-x-2">
                                        {/* Edit button */}
                                        <Link 
                                            href={`/employees/${employee.id}/edit`} 
                                            className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>

                                        {/* Delete button */}
                                        <button 
                                            onClick={() => handleDelete(employee.id)} 
                                            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
