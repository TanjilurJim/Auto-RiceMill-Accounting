import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateAccountGroup({
  natureOptions,
  groupOptions,
}: {
  natureOptions: { id: number; name: string }[];
  groupOptions: { id: number; name: string }[];
}) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    nature_id: '',
    group_under_id: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/account-groups');
  };

  return (
    <AppLayout>
      <Head title="Create Account Group" />

      {/* Use tokens, not fixed gray */}
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-xl p-6">
          {/* Make sure heading uses foreground color */}
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Create Account Group
          </h1>

          {/* Card surface also via tokens */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-lg bg-card p-6 text-card-foreground shadow ring-1 ring-border"
          >
            {/* Account Group Name */}
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Account Group Name
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-md bg-input p-2 text-foreground placeholder:text-muted-foreground ring-1 ring-input focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter account group name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Nature */}
            <div>
              <label htmlFor="nature_id" className="mb-1 block text-sm font-medium">
                Nature
              </label>
              <select
                id="nature_id"
                value={data.nature_id}
                onChange={(e) => setData('nature_id', e.target.value)}
                className="w-full rounded-md bg-input p-2 text-foreground ring-1 ring-input focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select nature</option>
                {natureOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              {errors.nature_id && <p className="text-sm text-red-500">{errors.nature_id}</p>}
            </div>

            {/* Group Under */}
            <div>
              <label htmlFor="group_under_id" className="mb-1 block text-sm font-medium">
                Group Under
              </label>
              <select
                id="group_under_id"
                value={data.group_under_id}
                onChange={(e) => setData('group_under_id', e.target.value)}
                className="w-full rounded-md bg-input p-2 text-foreground ring-1 ring-input focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select group under</option>
                {groupOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              {errors.group_under_id && (
                <p className="text-sm text-red-500">{errors.group_under_id}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="w-full rounded-md bg-input p-2 text-foreground placeholder:text-muted-foreground ring-1 ring-input focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Optional description"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Link
                href="/account-groups"
                className="rounded-md bg-card px-4 py-2 text-foreground ring-1 ring-border hover:bg-muted"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
