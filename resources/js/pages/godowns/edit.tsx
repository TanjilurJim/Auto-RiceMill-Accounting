import Button from '@/components/Btn&Link/Button';
import CancelLink from '@/components/Btn&Link/CancelLink';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Godown {
    id: number;
    name: string;
    godown_code: string;
    address: string;
}

export default function GodownEdit({ godown }: { godown: Godown }) {
    const { data, setData, put, processing, errors } = useForm({
        name: godown.name,
        address: godown.address,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/godowns/${godown.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Godown" />
            <div className="flex min-h-screen justify-center bg-gray-100">
            <div className="w-full max-w-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Edit Godown</h1>

                <form onSubmit={submit} className="max-w-md space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">
                    <div>
                        <label htmlFor="name" className="mb-1 block font-medium">
                            Godown Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            placeholder="Godown Name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="mb-1 block font-medium">
                            Description
                        </label>
                        <textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            placeholder="Description"
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        {/* <Link href="/godowns" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            Cancel
                        </Link> */}
                        <CancelLink href="/godowns" />

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
