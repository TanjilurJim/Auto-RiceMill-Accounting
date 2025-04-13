import Button from '@/components/Btn&Link/Button';
import CancelLink from '@/components/Btn&Link/CancelLink';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EditSalesman({ salesman }: { salesman: any }) {
    const { data, setData, put, processing, errors } = useForm({
        name: salesman.name || '',
        phone_number: salesman.phone_number || '',
        email: salesman.email || '',
        address: salesman.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/salesmen/${salesman.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Salesman" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Edit Salesman</h1>

                    <form onSubmit={handleSubmit} className="space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">

                        {/* Salesman Code */}
                        <div>
                            <label className="mb-1 block font-medium">Salesman Code</label>
                            <input
                                type="text"
                                value={salesman.salesman_code}
                                disabled
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800 bg-gray-100"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="mb-1 block font-medium">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-1 block font-medium">Phone Number</label>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1 block font-medium">E-mail</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="mb-1 block font-medium">Address</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div className="flex justify-between mt-4">
                            {/* <Link href="/salesmen" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link> */}
                            <CancelLink href="/salesmen" />

                            {/* <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update'}
                            </button> */}
                            <Button processing={processing}>
                                {processing ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
