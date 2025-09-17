import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// resources/ts/Pages/dashboard/AdminDashboard.tsx
import { NotificationsPanel as NotificationsPanelBase } from '@/components/dashboard/NotificationsPanel';
import { RevenueChart as RevenueChartBase } from '@/components/dashboard/RevenueChart';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Crown } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, CircleUser, Search, Shield, UserPlus, Users } from 'lucide-react';
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

    return (
        <Card className="shadow-sm lg:col-span-2">
            <CardHeader className="pb-0">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base">Recent Registrations</CardTitle>
                        <p className="text-muted-foreground mt-1 text-xs">Newest user accounts and their status</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-56">
                            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email..." className="pl-9" />
                            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
                        </div>

                        {/* Role (native select) */}
                        <div className="relative">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="border-input bg-background focus:ring-ring h-9 w-[160px] rounded-md border px-3 text-sm leading-none outline-none focus:ring-2 cursor-pointer">
                                    <SelectValue placeholder="All roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {allRoles.map((r) => (
                                            <SelectItem className="cursor-pointer" key={r} value={r}>
                                                {r === 'all' ? 'All roles' : r}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status (native select) */}
                        <div className="relative">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="border-input bg-background focus:ring-ring h-9 w-[160px] rounded-md border px-3 text-sm leading-none outline-none focus:ring-2">
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">User</TableHead>
                                <TableHead className="w-[20%]">Roles</TableHead>
                                <TableHead className="w-[20%]">Joined</TableHead>
                                <TableHead className="w-[20%] text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-muted-foreground py-10 text-center text-sm">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}

                            {filtered.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{(u.name ?? 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1 truncate font-medium">
                                                    {u.name}
                                                    {/** owner badge + link to lineage */}
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
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {(u.roleNames ?? []).length === 0 && <Badge variant="outline">—</Badge>}
                                            {(u.roleNames ?? []).map((r: string) => (
                                                <Badge key={r} variant="secondary" className="capitalize">
                                                    {r}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-sm">{shortDate(u.joinedAt)}</span>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {u.isActive ? (
                                            <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>
                                        ) : (
                                            <Badge variant="outline">Inactive</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Showing {filtered.length} users</span>
                <Link href={route('users.index')} className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                    View all users <ArrowRight className="h-4 w-4" />
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

    return (
        <AppLayout breadcrumbs={[{ title: 'Super Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Super Admin Dashboard" />

            {/* Top header & quick actions */}
            <div className="mt-2 mb-4 grid grid-cols-1 justify-center gap-3 px-2 md:grid-cols-2 md:justify-between">
                <div>
                    <h1 className="text-center text-2xl font-semibold tracking-tight md:text-left">Super Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-center text-sm md:text-left">
                        Organization-wide user overview, activity, and onboarding.
                    </p>
                </div>

                {/* Manage Users and New User buttons */}
                <div className="flex items-center justify-center gap-2 md:justify-end">
                    <Link href={route('users.index')} className="inline-flex items-center">
                        <Button variant="default" className="gap-2">
                            <Users className="h-4 w-4" />
                            Manage Users
                        </Button>
                    </Link>
                    <Link href={route('users.create')} className="inline-flex items-center">
                        <Button variant="secondary" className="gap-2 hover:bg-amber-300">
                            <UserPlus className="h-4 w-4" />
                            New User
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            {/* <QuickStats /> */}

            {/* User Stats Cards */}
            <div className="mt-6 grid gap-4 p-2 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:text-primary shadow-sm transition duration-300 ease-in-out">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            <Link href="/users">Total Users</Link>
                        </CardTitle>
                        <Users className="text-muted-foreground h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{fmt(safeStats.totalUsers)}</div>
                        <p className="text-muted-foreground mt-1 text-xs">All registered accounts</p>
                    </CardContent>
                </Card>

                <Card className="hover:text-primary shadow-sm transition duration-300 ease-in-out">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            <Link href="/users?filter=active"> Active Users</Link>
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
                            <Link href="/users?filter=inactive"> Inactive</Link>
                        </CardTitle>
                        <CircleUser className="text-muted-foreground h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-3xl font-bold', inactiveCount > 0 ? 'text-amber-600' : '')}>{fmt(inactiveCount)}</div>
                        <p className="text-muted-foreground mt-1 text-xs">Haven't been active recently</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">New This Week</CardTitle>
                        <UserPlus className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{fmt(safeStats.newThisWeek)}</div>
                        <p className="text-muted-foreground mt-1 text-xs">Accounts created in the last 7 days</p>
                    </CardContent>
                </Card>
            </div>
            <div className="px-2">
                <RecentRegistrationsCard recentUsers={Array.isArray(recentUsers) ? recentUsers : []} rolesSummary={safeStats.rolesSummary} />
            </div>
            {/* Revenue Chart & Stats */}
            <div className="mt-6 grid gap-4 px-2 lg:grid-cols-3">
                {/* <RevenueChart /> */}
                <div className="lg:col-span-2">
                    <NotificationsPanel expiring={Array.isArray(expiringSoon) ? expiringSoon : []} />
                </div>
                <Card className="shadow-sm lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base">Roles Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {safeStats.rolesSummary.length === 0 && <p className="text-muted-foreground text-sm">No roles to show yet.</p>}
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
                            Manage roles & permissions <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardFooter>
                </Card>
            </div>

            {/* Roles distribution & filters */}
            <div className="mt-6 grid gap-4 lg:grid-cols-3">{/* Recent registrations panel */}</div>

            {/* Onboarding & activity tabs (placeholder for future widgets) */}
            <div className="mt-6">
                <Tabs defaultValue="onboarding" className="w-full">
                    <TabsList>
                        <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="onboarding" className="mt-3">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Quick Onboarding Health</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                                Hook up your real metrics later (invites sent, pending verifications, first-login completion, etc.).
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="activity" className="mt-3">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Recent Admin Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                                Add audit trail widgets here (role changes, new users created, disabled accounts, etc.).
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
