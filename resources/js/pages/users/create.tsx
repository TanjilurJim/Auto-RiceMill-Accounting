import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

export default function CreateUser({ roles }: { roles: Role[] }) {
    const { auth } = usePage().props as any;
    const isAdmin = !!auth?.isAdmin;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as number[],
    });

    const toggleRole = (id: number) => {
        setData('roles', data.roles.includes(id) ? data.roles.filter((rid) => rid !== id) : [...data.roles, id]);
    };

    const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/users', data);
  };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: 'Create User', href: '/users/create' },
    ];

    return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />
      <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
        <div className="h-full rounded-lg bg-white p-6">
          <PageHeader title="Create User" addLinkHref="/users" addLinkText="Back" />

          <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-4 dark:bg-neutral-900">
            <div>
              <label className="mb-1 block font-medium">Name</label>
              <input className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                     value={data.name} onChange={e => setData('name', e.target.value)} />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block font-medium">Email</label>
              <input type="email" className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                     value={data.email} onChange={e => setData('email', e.target.value)} />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password (always visible & required) */}
            <div>
              <label className="mb-1 block font-medium">Password</label>
              <input type="password" className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                     value={data.password} onChange={e => setData('password', e.target.value)} />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-1 block font-medium">Confirm Password</label>
              <input type="password" className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                     value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
            </div>

            {/* Roles */}
            <div>
              <label className="mb-1 block font-medium">Assign Roles</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <label key={role.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={data.roles.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      disabled={!isAdmin && role.name.toLowerCase() === 'admin'}
                    />
                    {role.name}
                  </label>
                ))}
              </div>
              {errors.roles && <p className="mt-1 text-sm text-red-500">{errors.roles}</p>}
            </div>

            <ActionFooter processing={processing} onSubmit={submit}
                          submitText={processing ? 'Creating...' : 'Create User'}
                          cancelHref="/users" className="justify-end" />
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

