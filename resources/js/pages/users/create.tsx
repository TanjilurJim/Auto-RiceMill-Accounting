import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useMemo, useRef } from 'react';

interface Role { id: number; name: string; }

const SYNTHETIC_DOMAIN = 'no-mail.ricemillerp.com';

// tiny helpers
const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const shortId = () => Math.random().toString(36).slice(2, 8);

export default function CreateUser({ roles }: { roles: Role[] }) {
  const t = useTranslation();
  const { auth } = usePage().props as any;
  const isAdmin = !!auth?.isAdmin;
  const pwRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [] as number[],
    trial_mode: null as 'add' | 'set' | null,
    trial_days: null as number | null,
    trial_date: null as string | null,
  });

  const isSynthetic = useMemo(
    () => data.email?.toLowerCase().endsWith(`@${SYNTHETIC_DOMAIN}`) ?? false,
    [data.email]
  );

  const toggleRole = (id: number) => {
    setData('roles', data.roles.includes(id)
      ? data.roles.filter((rid) => rid !== id)
      : [...data.roles, id]);
  };

  function generateSyntheticEmail() {
    const base = slugify(data.name || 'user');
    const candidate = `${base}.${shortId()}@${SYNTHETIC_DOMAIN}`;
    setData('email', candidate);
    // optional: move focus to password
    setTimeout(() => pwRef.current?.focus(), 0);
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...data };
    if (payload.trial_mode !== 'add') payload.trial_days = null;
    if (payload.trial_mode !== 'set') payload.trial_date = null;
    post('/users', payload);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('us-dashboard'), href: '/dashboard' },
    { title: t('us-users'), href: '/users' },
    { title: t('us-create-user'), href: '/users/create' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('us-create-user')} />
      <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
        <div className="bg-background h-full rounded-lg">
          <PageHeader title={t('us-create-user')} addLinkHref="/users" addLinkText={t('us-back')} />

          <form onSubmit={submit} className="space-y-4 rounded-lg border bg-background p-4 dark:bg-neutral-900">
            {/* Name */}
            <div>
              <label className="mb-1 block font-medium">{t('us-name')}</label>
              <input
                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email + Generate */}
            <div>
              <label className="mb-1 block font-medium">{t('us-email')}</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder={`user@domain.com • or click Generate`}
                />
                <button
                  type="button"
                  onClick={generateSyntheticEmail}
                  className="rounded border px-3 py-2 text-sm dark:border-neutral-700"
                  title={`Fill with ${SYNTHETIC_DOMAIN}`}
                >
                  Generate
                </button>
              </div>
              {isSynthetic && (
                <p className="mt-1 text-xs text-gray-600">
                  Synthetic email detected — this address cannot receive mail. Share the password with the user directly.
                </p>
              )}
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password (always visible & required) */}
            <div>
              <label className="mb-1 block font-medium">{t('us-password')}</label>
              <input
                type="password"
                ref={pwRef}
                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-1 block font-medium">{t('us-confirm-password')}</label>
              <input
                type="password"
                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
              />
            </div>

            {/* Roles */}
            <div>
              <label className="mb-1 block font-medium">{t('us-assign-roles')}</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
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

            {/* Trial (unchanged) */}
            {isAdmin && (
              <div className="space-y-2 rounded-lg border p-3">
                <div className="text-sm font-medium">{t('us-trial-optional')}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className={`rounded border px-3 py-1 text-sm ${data.trial_mode === 'add' && data.trial_days === 7 ? 'bg-blue-600 text-white' : ''}`}
                    onClick={() => setData({ ...data, trial_mode: 'add', trial_days: 7, trial_date: null })}
                  >
                    {t('us-plus-7-days')}
                  </button>
                  <button
                    type="button"
                    className={`rounded border px-3 py-1 text-sm ${data.trial_mode === 'add' && data.trial_days === 30 ? 'bg-blue-600 text-white' : ''}`}
                    onClick={() => setData({ ...data, trial_mode: 'add', trial_days: 30, trial_date: null })}
                  >
                    {t('us-plus-30-days')}
                  </button>

                  <div className="flex items-center gap-2">
                    <InputCalendar
                      label=""
                      value={data.trial_date ?? ''}
                      onChange={(val) => setData({ ...data, trial_date: val, trial_mode: 'set', trial_days: null })}
                    />
                    {data.trial_date && (
                      <button
                        type="button"
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => setData({ ...data, trial_mode: null, trial_date: null, trial_days: null })}
                      >
                        {t('us-clear')}
                      </button>
                    )}
                  </div>
                </div>
                {errors.trial_mode && <p className="text-xs text-red-500">{errors.trial_mode}</p>}
                {errors.trial_days && <p className="text-xs text-red-500">{errors.trial_days}</p>}
                {errors.trial_date && <p className="text-xs text-red-500">{errors.trial_date}</p>}
                <p className="text-xs text-gray-500">{t('us-trial-description')}</p>
              </div>
            )}

            <ActionFooter
              processing={processing}
              onSubmit={submit}
              submitText={processing ? t('us-creating') : t('us-create-user')}
              cancelHref="/users"
              className="justify-end"
              cancelText={t('cancelButtonText')}
            />
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
