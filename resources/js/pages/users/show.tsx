import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Calendar, CalendarClock, Crown, Mail, MapPin, Phone } from 'lucide-react';
import { fmtDateTime } from '@/utils/format';
type Role = { id: number; name: string };

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    status: 'active' | 'inactive';
    createdBy?: { id: number; name: string } | null;
    roles: Role[];
    created_at?: string; // ISO from backend (optional)
    trial_ends_at?: string | null;
}

export default function UserShow({ user }: { user: User }) {
    const { props } = usePage();
    const authUser = props.auth?.user as { roles?: { name: string }[] } | undefined;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
        { title: user.name, href: `/users/${user.id}` },
    ];

    const isOwner = (user.roles ?? []).some((r) => r.name?.toLowerCase() === 'owner');
    const isAdmin = (authUser?.roles ?? []).some((r) => r.name === 'admin');

    const initials = (user.name ?? 'U')
        .split(' ')
        .map((p: string) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const joinedAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : undefined;

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={`User – ${user.name}`}>
            <Head title={`User – ${user.name}`} />

            {/* Header row */}
            <div className="flex flex-col gap-3 p-2 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader title={`User Details – ${user.name}`} addLinkHref="/users" addLinkText="Back" />
                <div className="flex items-center gap-2">
                    {isOwner && (
                        <Link href={route('users.lineage', user.id)} className="inline-flex">
                            <Button variant="secondary" size="sm" className="inline-flex items-center gap-1">
                                <Crown className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                                View lineage
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    <Link href={`/users/${user.id}/edit`}>
                        <Button size="sm">Edit</Button>
                    </Link>
                </div>
            </div>

            {/* Main card */}
            <div className="px-2">
                <Card className="mt-3 shadow-sm">
                    <CardContent className="pt-6">
                        {/* Top identity strip */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="text-base">{initials}</AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                        <h2 className="text-foreground truncate text-lg font-semibold">{user.name}</h2>
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
                            </div>

                            {/* Status */}
                            <div>
                                <Badge
                                    className={
                                        user.status === 'active'
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-600'
                                            : 'bg-rose-500 text-white hover:bg-rose-500'
                                    }
                                >
                                    {user.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="mt-6 grid gap-4 rounded-md border p-4 md:grid-cols-2">
                            <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} valueClass="truncate" />
                            <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone || '—'} />
                            <DetailRow icon={<MapPin className="h-4 w-4" />} label="Address" value={user.address || '—'} valueClass="truncate" />
                            <DetailRow
                                icon={<CalendarClock className="h-4 w-4" />}
                                label="Trial ends"
                                value={user.trial_ends_at ? fmtDateTime(user.trial_ends_at) : '—'}
                            />
                            {joinedAt && <DetailRow icon={<Calendar className="h-4 w-4" />} label="Joined" value={joinedAt} />}

                            {/* Created By (admin only) */}
                            {isAdmin && (
                                <DetailRow
                                    label="Created By"
                                    value={
                                        user.createdBy?.id ? (
                                            <Link href={`/users/${user.createdBy.id}`} className="text-primary hover:underline">
                                                {user.createdBy.name}
                                            </Link>
                                        ) : (
                                            'N/A'
                                        )
                                    }
                                />
                            )}
                        </div>

                        {/* Footer actions */}
                        <ActionFooter cancelHref="/users" printHref={`/users/${user.id}/edit`} printText="Edit" className="justify-end" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

/** Reusable row */
function DetailRow({ icon, label, value, valueClass }: { icon?: React.ReactNode; label: string; value: React.ReactNode; valueClass?: string }) {
    return (
        <div className="flex items-start gap-3">
            {icon && <div className="text-muted-foreground mt-[2px]">{icon}</div>}
            <div className="min-w-0">
                <div className="text-muted-foreground text-xs font-medium">{label}</div>
                <div className={`text-foreground text-sm ${valueClass ?? ''}`}>{value}</div>
            </div>
        </div>
    );
}
