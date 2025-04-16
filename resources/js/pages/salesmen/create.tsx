import ActionFooter from '@/components/ActionFooter';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateSalesman() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone_number: '',
        email: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/salesmen');
    };

    return (
        <AppLayout>
            <Head title="Create Salesman" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Add New Salesman</h1>

                    <form onSubmit={handleSubmit} className="space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">
                        <div>
                            <label className="mb-1 block font-medium">Salesman Name*</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Enter name"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Phone Number*</label>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Enter phone number"
                            />
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Optional email"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Address</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Optional address"
                            ></textarea>
                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                        </div>

                        {/* <div className="flex justify-between mt-4">
                            <Link href="/salesmen" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <CancelLink href="/salesmen" />

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Create'}
                            </button>
                            <Button processing={processing}>
                                {processing ? 'Saving...' : 'Create'}
                            </Button>
                        </div> */}
                        <ActionFooter
                            onSubmit={handleSubmit} // Function to handle form submission
                            cancelHref="/salesmen" // URL for the cancel action
                            processing={processing} // Indicates whether the form is processing
                            submitText={processing ? 'Saving...' : 'Create'} // Text for the submit button
                            cancelText="Cancel" // Text for the cancel button
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
