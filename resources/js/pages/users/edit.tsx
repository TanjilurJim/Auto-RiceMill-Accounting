import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { fmtDateTime } from '@/utils/format';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, Crown, Info } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}
interface User {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    status: 'active' | 'inactive';
    roles: Role[];
    created_at?: string;
    trial_ends_at?: string | null;
}

export default function EditUser({ user, roles, userRoles }: { user: User; roles: Role[]; userRoles: number[] }) {
    const { props } = usePage();
    const authUser = props.auth?.user as { id: number; roles?: { name: string }[] } | undefined;

    const isOwner = (user.roles ?? []).some((r) => r.name?.toLowerCase() === 'owner');
    const isAdmin = (authUser?.roles ?? []).some((r) => r.name === 'admin');

    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        status: user.status,
        roles: userRoles ?? [],
    });

    const toggleRole = (id: number) => {
        setData('roles', data.roles.includes(id) ? data.roles.filter((rid) => rid !== id) : [...data.roles, id]);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: `Edit ${user.name}`, href: `/users/${user.id}/edit` },
    ];

    // For custom trial date
    const [customDate, setCustomDate] = useState<string>('');

    const [trialPlan, setTrialPlan] = useState<{
        mode: 'add' | 'set' | null;
        days?: number | null;
        date?: string | null;
        target?: Date | null;
    }>({ mode: null });

    const [applying, setApplying] = useState(false);

    // Compute proposed end based on the later of now or current trial end
    const computeTarget = (mode: 'add' | 'set', payload: { days?: number; date?: string }) => {
        const now = new Date();
        const base = user.trial_ends_at ? new Date(user.trial_ends_at) : now;
        const effectiveBase = base < now ? now : base;

        if (mode === 'add' && payload.days) {
            const t = new Date(effectiveBase);
            t.setDate(t.getDate() + payload.days);
            return t;
        }
        if (mode === 'set' && payload.date) {
            return new Date(`${payload.date}T23:59:59`);
        }
        return null;
    };

    const applyPlan = () => {
        if (!trialPlan.mode) return;
        setApplying(true);

        const payload = trialPlan.mode === 'add' ? { mode: 'add', days: trialPlan.days } : { mode: 'set', date: trialPlan.date };

        router.patch(route('users.extendTrial', user.id), payload, {
            preserveScroll: true,
            onFinish: () => setApplying(false),
            onSuccess: () => {
                // clear local preview and date picker
                setTrialPlan({ mode: null });
                setCustomDate('');
            },
        });
    };

    const clearPlan = () => {
        setTrialPlan({ mode: null });
        setCustomDate('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={`Edit User – ${user.name}`}>
            <Head title={`Edit User – ${user.name}`} />

            <PageHeader title="Edit User" addLinkHref="/users" addLinkText="Back" />

            <form onSubmit={submit} className="bg-background text-foreground mt-3 space-y-6 rounded-lg border p-4">
                {/* Identity strip */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="truncate text-lg font-semibold">{user.name}</h2>
                            {isOwner && <Crown className="h-4 w-4 text-amber-500 dark:text-amber-400" title="Owner" />}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                            {(user.roles ?? []).length === 0 && (
                                <Badge variant="outline" className="text-xs">
                                    No roles
                                </Badge>
                            )}
                            {(user.roles ?? []).map((r) => (
                                <Badge key={r.id} variant="secondary" className="text-xs capitalize">
                                    {r.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Badge
                        className={
                            data.status === 'active' ? 'bg-emerald-600 text-white hover:bg-emerald-600' : 'bg-rose-500 text-white hover:bg-rose-500'
                        }
                    >
                        {data.status}
                    </Badge>
                </div>

                {/* Form grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Name"
                        error={errors.name}
                        input={
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="bg-background focus:ring-ring w-full rounded-md border p-2 outline-none focus:ring-2"
                            />
                        }
                    />
                    <Field
                        label="Email"
                        error={errors.email}
                        input={
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="bg-background focus:ring-ring w-full rounded-md border p-2 outline-none focus:ring-2"
                            />
                        }
                    />
                    <Field
                        label="Phone"
                        input={
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="bg-background focus:ring-ring w-full rounded-md border p-2 outline-none focus:ring-2"
                            />
                        }
                    />
                    <Field
                        label="Status"
                        input={
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                className="bg-background focus:ring-ring w-full rounded-md border p-2 outline-none focus:ring-2"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        }
                    />
                    <Field
                        className="md:col-span-2"
                        label="Address"
                        input={
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="bg-background focus:ring-ring min-h-[84px] w-full rounded-md border p-2 outline-none focus:ring-2"
                            />
                        }
                    />
                </div>

                {/* Roles */}
                <div className="space-y-2 rounded-md border p-3">
                    <div className="text-sm font-medium">Assign Roles</div>
                    {authUser?.id === user.id && !(authUser?.roles ?? []).some((r: any) => r.name === 'admin') ? (
                        <p className="text-muted-foreground text-xs">You cannot change your own roles.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.roles.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        className="accent-primary"
                                    />
                                    <span className="capitalize">{role.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {errors.roles && <p className="text-xs text-rose-500">{errors.roles}</p>}
                </div>

                {/* Trial controls */}
                {/* Trial controls */}
                <div className="space-y-3 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <div className="text-sm font-medium">Trial</div>
                    </div>

                    <div className="text-muted-foreground text-xs">
                        Current end: <span className="text-foreground font-medium">{user.trial_ends_at ? fmtDateTime(user.trial_ends_at) : '—'}</span>
                    </div>

                    {/* Local state for preview & toggle */}
                    {/* Put this inside your component, above return(): 
     const [customDate, setCustomDate] = useState<string>('');
     const [trialPlan, setTrialPlan] = useState<{ mode: 'add' | 'set' | null; days?: number | null; date?: string | null; target?: Date | null; }>({ mode: null });
     const [applying, setApplying] = useState(false);

     const computeTarget = (mode: 'add' | 'set', payload: { days?: number; date?: string }) => {
       const now = new Date();
       const base = user.trial_ends_at ? new Date(user.trial_ends_at) : now;
       const effectiveBase = base < now ? now : base;
       if (mode === 'add' && payload.days) {
         const t = new Date(effectiveBase);
         t.setDate(t.getDate() + payload.days);
         return t;
       }
       if (mode === 'set' && payload.date) {
         return new Date(`${payload.date}T23:59:59`);
       }
       return null;
     };

     const applyPlan = () => {
       if (!trialPlan.mode) return;
       setApplying(true);
       const data =
         trialPlan.mode === 'add'
           ? { mode: 'add', days: trialPlan.days }
           : { mode: 'set', date: trialPlan.date };

       router.patch(route('users.extendTrial', user.id), data, {
         preserveScroll: true,
         onFinish: () => setApplying(false),
         onSuccess: () => {
           setTrialPlan({ mode: null }); // clear preview after success
           setCustomDate('');
         },
       });
     };

     const clearPlan = () => {
       setTrialPlan({ mode: null });
       setCustomDate('');
     };
  */}

                    <div className="flex flex-wrap items-center gap-2">
                        {/* +7 days (toggle) */}
                        <Button
                            type="button"
                            variant={trialPlan.mode === 'add' && trialPlan.days === 7 ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => {
                                if (trialPlan.mode === 'add' && trialPlan.days === 7) {
                                    // toggle off
                                    setTrialPlan({ mode: null });
                                    return;
                                }
                                const target = computeTarget('add', { days: 7 });
                                setTrialPlan({ mode: 'add', days: 7, target });
                            }}
                        >
                            +7 days
                        </Button>

                        {/* +30 days (toggle) */}
                        <Button
                            type="button"
                            variant={trialPlan.mode === 'add' && trialPlan.days === 30 ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => {
                                if (trialPlan.mode === 'add' && trialPlan.days === 30) {
                                    setTrialPlan({ mode: null });
                                    return;
                                }
                                const target = computeTarget('add', { days: 30 });
                                setTrialPlan({ mode: 'add', days: 30, target });
                            }}
                        >
                            +30 days
                        </Button>

                        {/* Custom date (sets end-of-day) */}
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={customDate}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomDate(val);
                                    if (val) {
                                        const target = computeTarget('set', { date: val });
                                        setTrialPlan({ mode: 'set', date: val, target });
                                    } else {
                                        if (trialPlan.mode === 'set') setTrialPlan({ mode: null });
                                    }
                                }}
                                className="bg-background focus:ring-ring rounded-md border p-2 text-sm outline-none focus:ring-2"
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant={trialPlan.mode === 'set' ? 'default' : 'secondary'}
                                disabled={!customDate}
                                onClick={() => {
                                    if (!customDate) return;
                                    if (trialPlan.mode === 'set') {
                                        // toggle off
                                        setTrialPlan({ mode: null });
                                        setCustomDate('');
                                        return;
                                    }
                                    const target = computeTarget('set', { date: customDate });
                                    setTrialPlan({ mode: 'set', date: customDate, target });
                                }}
                            >
                                Set custom date
                            </Button>
                        </div>
                    </div>

                    {/* Inline preview + actions */}
                    {trialPlan.mode && trialPlan.target && (
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2">
                            <div className="flex items-center gap-2">
                                <Info className="text-muted-foreground h-4 w-4" />
                                <span className="text-sm">
                                    Proposed end:&nbsp;
                                    <span className="text-foreground font-medium">{fmtDateTime(trialPlan.target)}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={applyPlan} disabled={applying}>
                                    {applying ? 'Applying…' : 'Apply change'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={clearPlan} disabled={applying}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="text-muted-foreground text-xs">
                        “+7/+30” adds days to the later of <em>now</em> or the current trial end. “Set custom date” overwrites the end date (end of
                        selected day).
                    </p>
                </div>

                <ActionFooter
                    processing={processing}
                    submitText={processing ? 'Saving...' : 'Save'}
                    onSubmit={submit}
                    cancelHref="/users"
                    className="justify-end"
                />
            </form>
        </AppLayout>
    );
}

function Field({ label, input, error, className }: { label: string; input: React.ReactNode; error?: string; className?: string }) {
    return (
        <div className={className}>
            <label className="text-foreground mb-1 block text-sm font-medium">{label}</label>
            {input}
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </div>
    );
}
