import TrialBanner from '@/components/TrialBanner';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Circle } from 'lucide-react';

// If you have a Badge component:
import { Badge } from '@/components/ui/badge';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileForm {
    name: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const fmt = (iso?: string | null) => {
        if (!iso) return '—';
        const d = new Date(iso);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    const roles = (auth.user?.roles ?? []).map((r: any) => r.name);
    const trial = (auth as any).trial;
    const activeSince = auth.user?.email_verified_at ?? auth.user?.created_at;
    const endsAt = trial?.ends_at;
    const expired = !!trial?.expired;
    const expSoon = !!trial?.expiring_soon;
    const inactive = !!trial?.inactive;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <TrialBanner />
            <Card className="m-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Account status
                        {inactive ? (
                            <span className="relative inline-flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                            </span>
                        ) : expSoon ? (
                            <span className="relative inline-flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                            </span>
                        ) : (
                            <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <div className="text-muted-foreground text-xs">Roles</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {roles.length ? (
                                roles.map((r: string) => (
                                    <Badge key={r} variant="secondary" className="capitalize">
                                        {r}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground text-sm">No roles</span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <div className="text-muted-foreground text-xs">Active since</div>
                            <div className="text-sm">{fmt(activeSince)}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs">Trial ends</div>
                            <div className="text-sm">
                                {endsAt ? fmt(endsAt) : '—'}
                                {trial?.days_left != null && (
                                    <span className={`ml-2 text-xs ${expired ? 'text-red-600' : 'text-muted-foreground'}`}>
                                        {expired ? 'Expired' : `${trial.days_left} day(s) left`}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs">Status</div>
                            <div className={`text-sm ${inactive ? 'text-red-600' : 'text-emerald-600'}`}>{inactive ? 'Inactive' : 'Active'}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
