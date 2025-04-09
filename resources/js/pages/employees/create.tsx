import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateEmployee({ departments, designations, shifts, references }) {
    // useForm hook for handling form state and submission
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        mobile: '',
        email: '',
        nid: '',
        present_address: '',
        permanent_address: '',
        salary: '',
        joining_date: '',
        status: 'Active',
        advance_amount: '',
        department_id: '',
        designation_id: '',
        shift_id: '',
        reference_by: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/employees');
    };

    return (
        <AppLayout>
            <Head title="Create Employee" />

            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4">Create New Employee</h1>

                <form onSubmit={handleSubmit} className="space-y-4 rounded bg-white p-6 shadow-md">
                    {/* Employee Name */}
                    <div>
                        <label htmlFor="name" className="block font-medium mb-1">Employee Name</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter employee name"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Mobile */}
                    <div>
                        <label htmlFor="mobile" className="block font-medium mb-1">Mobile</label>
                        <input
                            id="mobile"
                            type="text"
                            value={data.mobile}
                            onChange={(e) => setData('mobile', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter mobile number"
                        />
                        {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-medium mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter email"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* NID */}
                    <div>
                        <label htmlFor="nid" className="block font-medium mb-1">National ID</label>
                        <input
                            id="nid"
                            type="text"
                            value={data.nid}
                            onChange={(e) => setData('nid', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter National ID"
                        />
                        {errors.nid && <p className="text-sm text-red-500">{errors.nid}</p>}
                    </div>

                    {/* Present Address */}
                    <div>
                        <label htmlFor="present_address" className="block font-medium mb-1">Present Address</label>
                        <input
                            id="present_address"
                            type="text"
                            value={data.present_address}
                            onChange={(e) => setData('present_address', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter present address"
                        />
                        {errors.present_address && <p className="text-sm text-red-500">{errors.present_address}</p>}
                    </div>

                    {/* Permanent Address */}
                    <div>
                        <label htmlFor="permanent_address" className="block font-medium mb-1">Permanent Address</label>
                        <input
                            id="permanent_address"
                            type="text"
                            value={data.permanent_address}
                            onChange={(e) => setData('permanent_address', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter permanent address"
                        />
                        {errors.permanent_address && <p className="text-sm text-red-500">{errors.permanent_address}</p>}
                    </div>

                    {/* Salary */}
                    <div>
                        <label htmlFor="salary" className="block font-medium mb-1">Salary</label>
                        <input
                            id="salary"
                            type="number"
                            value={data.salary}
                            onChange={(e) => setData('salary', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter salary"
                        />
                        {errors.salary && <p className="text-sm text-red-500">{errors.salary}</p>}
                    </div>

                    {/* Joining Date */}
                    <div>
                        <label htmlFor="joining_date" className="block font-medium mb-1">Joining Date</label>
                        <input
                            id="joining_date"
                            type="date"
                            value={data.joining_date}
                            onChange={(e) => setData('joining_date', e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors.joining_date && <p className="text-sm text-red-500">{errors.joining_date}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block font-medium mb-1">Status</label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                    </div>

                    {/* Advance Amount */}
                    <div>
                        <label htmlFor="advance_amount" className="block font-medium mb-1">Advance Amount</label>
                        <input
                            id="advance_amount"
                            type="number"
                            value={data.advance_amount}
                            onChange={(e) => setData('advance_amount', e.target.value)}
                            className="w-full rounded border p-2"
                            placeholder="Enter advance amount"
                        />
                        {errors.advance_amount && <p className="text-sm text-red-500">{errors.advance_amount}</p>}
                    </div>

                    {/* Department */}
                    <div>
                        <label htmlFor="department_id" className="block font-medium mb-1">Department</label>
                        <select
                            id="department_id"
                            value={data.department_id}
                            onChange={(e) => setData('department_id', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
                    </div>

                    {/* Designation */}
                    <div>
                        <label htmlFor="designation_id" className="block font-medium mb-1">Designation</label>
                        <select
                            id="designation_id"
                            value={data.designation_id}
                            onChange={(e) => setData('designation_id', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select Designation</option>
                            {designations.map((designation) => (
                                <option key={designation.id} value={designation.id}>
                                    {designation.name}
                                </option>
                            ))}
                        </select>
                        {errors.designation_id && <p className="text-sm text-red-500">{errors.designation_id}</p>}
                    </div>

                    {/* Shift */}
                    <div>
                        <label htmlFor="shift_id" className="block font-medium mb-1">Shift</label>
                        <select
                            id="shift_id"
                            value={data.shift_id}
                            onChange={(e) => setData('shift_id', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select Shift</option>
                            {shifts.map((shift) => (
                                <option key={shift.id} value={shift.id}>
                                    {shift.name}
                                </option>
                            ))}
                        </select>
                        {errors.shift_id && <p className="text-sm text-red-500">{errors.shift_id}</p>}
                    </div>

                    {/* Reference By */}
                    <div>
                        <label htmlFor="reference_by" className="block font-medium mb-1">Reference By</label>
                        <select
                            id="reference_by"
                            value={data.reference_by}
                            onChange={(e) => setData('reference_by', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select Reference</option>
                            {references.map((reference) => (
                                <option key={reference.id} value={reference.id}>
                                    {reference.name}
                                </option>
                            ))}
                        </select>
                        {errors.reference_by && <p className="text-sm text-red-500">{errors.reference_by}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-4 space-x-2">
                        <Link href="/employees" className="rounded border px-4 py-2 hover:bg-gray-200">Cancel</Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
