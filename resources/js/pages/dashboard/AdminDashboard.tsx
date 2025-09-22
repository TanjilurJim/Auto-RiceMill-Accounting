import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// resources/ts/Pages/dashboard/AdminDashboard.tsx
import { NotificationsPanel as NotificationsPanelBase } from '@/components/dashboard/NotificationsPanel';
import { RevenueChart as RevenueChartBase } from '@/components/dashboard/RevenueChart';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, CheckCircle2, CircleUser, Crown, Shield, UserPlus, Users } from 'lucide-react';

import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { memo, useDeferredValue, useMemo, useState } from 'react';

const RevenueChart = memo(RevenueChartBase);
const NotificationsPanel = memo(NotificationsPanelBase);
/**
 * Admin Dashboard — UI-first skeleton
 * ------------------------------------------------------------
 * Data contract (server → Inertia → page props):
 * {
 *   stats: {
 *     totalUsers: number;
 *     activeUsers: number;
 *     newThisWeek: number;
 *     rolesSummary: Array<{ role: string; count: number }>;
 *   };
 *   recentUsers: Array<{
 *     id: number | string;
 *     name: string;
 *     email: string;
 *     roleNames: string[];
 *     joinedAt: string; // ISO date
 *     isActive: boolean;
 *   }>
 * }
 *
 * For now, this file focuses on layout/UX. If props are missing,
 * we render sensible placeholders so you can wire the backend later.
 */

type RecentUser = {
    id: number | string;
    name: string;
    email: string;
    roleNames: string[];
    joinedAt: string;
    isActive: boolean;
};

type RolesSummaryItem = { role: string; count: number };

const RecentRegistrationsCard = memo(function RecentRegistrationsCard({
    recentUsers,
    rolesSummary,
}: {
    recentUsers: RecentUser[];
    rolesSummary: RolesSummaryItem[];
}) {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // roles come from rolesSummary only (cheap & stable)
    const allRoles: string[] = useMemo(() => ['all', ...rolesSummary.map((r) => r.role).sort((a, b) => a.localeCompare(b))], [rolesSummary]);

    // process a modest slice on the client; you only render 12 anyway
    const source = useMemo(() => (Array.isArray(recentUsers) ? recentUsers.slice(0, 2000) : []), [recentUsers]);

    // precompute a lowercase key once
    const prepared = useMemo(() => source.map((u) => ({ ...u, _key: `${u.name ?? ''} ${u.email ?? ''}`.toLowerCase() })), [source]);

    const filtered = useMemo(() => {
        let rows = prepared;
        if (deferredQuery) {
            const q = deferredQuery.toLowerCase();
            rows = rows.filter((u) => u._key.includes(q));
        }
        if (roleFilter !== 'all') {
            rows = rows.filter((u) => (u.roleNames ?? []).includes(roleFilter));
        }
        if (statusFilter !== 'all') {
            const wantActive = statusFilter === 'active';
            rows = rows.filter((u) => !!u.isActive === wantActive);
        }
        return rows.slice(0, 12);
    }, [prepared, deferredQuery, roleFilter, statusFilter]);

    const t = useTranslation();

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: t('user'),
            accessor: (u: RecentUser) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{(u.name ?? 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1 truncate font-medium">
                            {u.name}
                            {(u.roleNames ?? []).some((r) => r.toLowerCase() === 'owner') && (
                                <Link
                                    href={route('users.lineage', u.id)}
                                    title="View lineage (users created by this owner)"
                                    className="text-amber-500 hover:text-amber-600"
                                >
                                    <Crown className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                        <div className="text-muted-foreground truncate text-xs">{u.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: t('roles'),
            accessor: (u: RecentUser) => (
                <div className="flex flex-wrap gap-1">
                    {(u.roleNames ?? []).length === 0 && <Badge variant="outline">—</Badge>}
                    {(u.roleNames ?? []).map((r: string) => (
                        <Badge key={r} variant="secondary" className="capitalize">
                            {r}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            header: t('joined'),
            accessor: (u: RecentUser) => <span className="text-sm">{shortDate(u.joinedAt)}</span>,
        },
        {
            header: t('status'),
            accessor: (u: RecentUser) =>
                u.isActive ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">{t('active')}</Badge>
                ) : (
                    <Badge variant="outline">{t('inactive')}</Badge>
                ),
            className: 'text-right',
        },
    ];

    return (
        <Card className="overflow-hidden shadow-sm">
            <CardHeader className="pb-0">
                <div className="grid grid-cols-1 items-center justify-center gap-4 lg:grid-cols-2 lg:justify-between">
                    <div>
                        <CardTitle className="text-center text-base md:text-left">{t('recentRegistrations')}</CardTitle>
                        <p className="text-muted-foreground mt-1 text-xs">{t('newestAccounts')}</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:items-center sm:justify-center">
                        {/* Search name or email */}
                        <div className="relative">
                            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchPlaceholder')} className="pl-9" />
                            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
                        </div>

                        {/* Role (native select) */}
                        <div className="relative">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="border-input bg-background focus:ring-ring h-9 w-full cursor-pointer rounded-md border px-3 text-sm leading-none outline-none focus:ring-2">
                                    <SelectValue placeholder={t('allRoles')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {allRoles.map((r) => (
                                            <SelectItem className="cursor-pointer" key={r} value={r}>
                                                {r === 'all' ? t('allRoles') : r}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status (native select) */}
                        <div className="relative">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="border-input bg-background focus:ring-ring h-9 w-full rounded-md border px-3 text-sm leading-none outline-none focus:ring-2">
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">{t('allStatus')}</SelectItem>
                                        <SelectItem value="active">{t('active')}</SelectItem>
                                        <SelectItem value="inactive">{t('inactive')}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <div className="px-2">
                <TableComponent columns={tableColumns} data={filtered} noDataMessage={t('noUsersFound')} />
            </div>

            <CardFooter className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">{t('showingUsers', { count: filtered.length })}</span>
                <Link href={route('users.index')} className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                    {t('viewAllUsers')} <ArrowRight className="h-4 w-4" />
                </Link>
            </CardFooter>
        </Card>
    );
});

function fmt(n?: number) {
    if (typeof n !== 'number') return '—';
    return new Intl.NumberFormat('en-BD').format(n);
}

function shortDate(iso?: string) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Import our new components

export default function AdminDashboard() {
    const { stats, recentUsers, expiringSoon } = (usePage().props as any) ?? {};

    // 1) Debounced/deferred query + non-blocking Select updates

    const [timeRange, setTimeRange] = useState('7d');

    const safeStats = {
        totalUsers: stats?.totalUsers ?? 0,
        activeUsers: stats?.activeUsers ?? 0,
        newThisWeek: stats?.newThisWeek ?? 0,
        rolesSummary: (stats?.rolesSummary as Array<{ role: string; count: number }>) ?? [],
    };

    const allRoles: string[] = useMemo(() => {
        return ['all', ...safeStats.rolesSummary.map((r) => r.role).sort((a, b) => a.localeCompare(b))];
    }, [safeStats.rolesSummary]);

    const inactiveCount = Math.max(safeStats.totalUsers - safeStats.activeUsers, 0);

    function cn(...classes: (string | false | null | undefined)[]): string {
        return classes.filter(Boolean).join(' ');
    }

    const t = useTranslation();
    return (
        <AppLayout breadcrumbs={[{ title: 'Super Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Super Admin Dashboard" />

            <div className="h-full w-screen lg:w-full">
                {/* Top header & quick actions: No responsive issues */}
                <div className="mt-2 mb-4 grid grid-cols-1 justify-center gap-3 px-2 md:grid-cols-2 md:justify-between">
                    <div>
                        <h1 className="text-center text-2xl font-semibold tracking-tight md:text-left">{t('superAdminDashboard')}</h1>
                        <p className="text-muted-foreground mt-1 text-center text-sm md:text-left">{t('organizationOverview')}</p>
                    </div>

                    {/* Manage Users and New User buttons */}
                    <div className="flex items-center justify-center gap-2 md:justify-end">
                        <Link href={route('users.index')} className="inline-flex items-center">
                            <Button variant="default" className="gap-2">
                                <Users className="h-4 w-4" />
                                {t('manageUsers')}
                            </Button>
                        </Link>
                        <Link href={route('users.create')} className="inline-flex items-center">
                            <Button variant="secondary" className="gap-2 hover:bg-amber-300">
                                <UserPlus className="h-4 w-4" />
                                {t('newUser')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* User Stats Cards: No responsive issues */}
                <div className="mt-6 grid grid-cols-2 gap-4 p-2 lg:grid-cols-4">
                    <Card className="hover:text-primary shadow-sm transition duration-300 ease-in-out">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Link href="/users">{t('totalUsers')}</Link>
                            </CardTitle>
                            <Users className="text-muted-foreground h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{fmt(safeStats.totalUsers)}</div>
                            <p className="text-muted-foreground mt-1 text-xs">{t('allRegisteredAccounts')}</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:text-primary shadow-sm transition duration-300 ease-in-out">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Link href="/users?filter=active">{t('activeUsers')}</Link>
                            </CardTitle>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{fmt(safeStats.activeUsers)}</div>
                            <p className="text-muted-foreground mt-1 text-xs"></p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {' '}
                                <Link href="/users?filter=inactive">{t('inactive')}</Link>
                            </CardTitle>
                            <CircleUser className="text-muted-foreground h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className={cn('text-3xl font-bold', inactiveCount > 0 ? 'text-amber-600' : '')}>{fmt(inactiveCount)}</div>
                            <p className="text-muted-foreground mt-1 text-xs">{t('notActiveRecently')}</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('newThisWeek')}</CardTitle>
                            <UserPlus className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{fmt(safeStats.newThisWeek)}</div>
                            <p className="text-muted-foreground mt-1 text-xs">{t('accountsCreated')}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 px-2">
                    <RecentRegistrationsCard recentUsers={Array.isArray(recentUsers) ? recentUsers : []} rolesSummary={safeStats.rolesSummary} />
                </div>

                {/* Revenue Revenue Overview + Expiring soon + Roles summary */}
                <div className="mt-6 gap-4 px-2">
                    {/* Revenue Overview */}
                    <RevenueChart />
                    <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        {/* Expiring Soon */}
                        <div className="">
                            <NotificationsPanel expiring={Array.isArray(expiringSoon) ? expiringSoon : []} />
                        </div>
                        {/* Roles summary */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">{t('rolesSummary')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {safeStats.rolesSummary.length === 0 && <p className="text-muted-foreground text-sm">{t('noRolesToShow')}</p>}
                                    {safeStats.rolesSummary.map(({ role, count }) => (
                                        <div key={role} className="flex items-center justify-between rounded-md border p-2">
                                            <div className="flex items-center gap-2">
                                                <Shield className="text-muted-foreground h-4 w-4" />
                                                <span className="font-medium">{role}</span>
                                            </div>
                                            <Badge variant="secondary">{fmt(count)}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={route('permissions.index')} className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                                    {t('manageRoles')} <ArrowRight className="h-4 w-4" />
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Roles distribution & filters */}
                {/* <div className="mt-6 grid gap-4 lg:grid-cols-3"></div> */}

                {/* Onboarding & activity tab */}
                <div className="mx-2 mt-6 mb-2">
                    <Tabs defaultValue="onboarding" className="w-full">
                        <TabsList>
                            <TabsTrigger value="onboarding">{t('onboarding')}</TabsTrigger>
                            <TabsTrigger value="activity">{t('activity')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="onboarding" className="mt-3">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">{t('quickOnboardingHealth')}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground text-sm">{t('onboardingMetrics')}</CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="activity" className="mt-3">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">{t('recentAdminActivity')}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground text-sm">{t('auditTrail')}</CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
