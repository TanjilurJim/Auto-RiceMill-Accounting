import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function EditEmployee({ employee, departments, designations, shifts, references }) {
    // useForm hook for handling form state and submission
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name,
        mobile: employee.mobile,
        email: employee.email,
        nid: employee.nid,
        present_address: employee.present_address,
        permanent_address: employee.permanent_address,
        salary: employee.salary,
        joining_date: employee.joining_date,
        status: employee.status,
        advance_amount: employee.advance_amount,
        department_id: employee.department_id,
        designation_id: employee.designation_id,
        shift_id: employee.shift_id,
        reference_by: employee.reference_by,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/employees/${employee.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Employee" />

            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg p-4 md:p-12">
                    <PageHeader title="Edit Employee" addLinkHref="/employees" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Employee Name */}
                            <div>
                                <label htmlFor="name" className="mb-1 block font-medium">
                                    Employee Name
                                </label>
                                <Input
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
                                <label htmlFor="mobile" className="mb-1 block font-medium">
                                    Mobile
                                </label>
                                <Input
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
                                <label htmlFor="email" className="mb-1 block font-medium">
                                    Email
                                </label>
                                <Input
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
                                <label htmlFor="nid" className="mb-1 block font-medium">
                                    National ID
                                </label>
                                <Input
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
                                <label htmlFor="present_address" className="mb-1 block font-medium">
                                    Present Address
                                </label>
                                <Input
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
                                <label htmlFor="permanent_address" className="mb-1 block font-medium">
                                    Permanent Address
                                </label>
                                <Input
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
                                <label htmlFor="salary" className="mb-1 block font-medium">
                                    Salary
                                </label>
                                <Input
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
                                <InputCalendar value={data.joining_date} label="Date" onChange={(val) => setData('joining_date', val)} />
                                {errors.joining_date && <p className="text-sm text-red-500">{errors.joining_date}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="mb-1 block font-medium">
                                    Status
                                </label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            {/* Advance Amount */}
                            <div>
                                <label htmlFor="advance_amount" className="mb-1 block font-medium">
                                    Advance Amount
                                </label>
                                <Input
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
                                <label htmlFor="department_id" className="mb-1 block font-medium">
                                    Department
                                </label>
                                <Select value={data.department_id?.toString() ?? ''} onValueChange={(val) => setData('department_id', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {departments.map((department) => (
                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
                            </div>

                            {/* Designation */}
                            <div>
                                <label htmlFor="designation_id" className="mb-1 block font-medium">
                                    Designation
                                </label>
                                <Select value={data.designation_id?.toString() ?? ''} onValueChange={(val) => setData('designation_id', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Designation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {designations.map((designation) => (
                                                <SelectItem key={designation.id} value={designation.id.toString()}>
                                                    {designation.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.designation_id && <p className="text-sm text-red-500">{errors.designation_id}</p>}
                            </div>

                            {/* Shift */}
                            <div>
                                <label htmlFor="shift_id" className="mb-1 block font-medium">
                                    Shift
                                </label>
                                <Select value={data.shift_id?.toString() ?? ''} onValueChange={(val) => setData('shift_id', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {shifts.map((shift) => (
                                                <SelectItem key={shift.id} value={shift.id.toString()}>
                                                    {shift.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.shift_id && <p className="text-sm text-red-500">{errors.shift_id}</p>}
                            </div>

                            {/* Reference By */}
                            <div>
                                <label htmlFor="reference_by" className="mb-1 block font-medium">
                                    Reference By
                                </label>
                                <Select value={data.reference_by?.toString() ?? ''} onValueChange={(val) => setData('reference_by', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Reference" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {references.map((reference) => (
                                                <SelectItem key={reference.id} value={reference.id.toString()}>
                                                    {reference.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.reference_by && <p className="text-sm text-red-500">{errors.reference_by}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/employees"
                            processing={processing}
                            submitText="Update Employee"
                            cancelText="Cancel"
                            className="mt-4 justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
